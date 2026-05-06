// features/admin/hooks/usePendingVerification.ts
import { useState, useCallback, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { adminVerificationService } from "../services/admin.verification.service";
import { Profile } from "../../../types/verification.types";

export function usePendingVerification() {
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  // Cancel any ongoing request on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleError = (err: unknown, title = "Error") => {
    if (err instanceof Error && err.name === "AbortError") return;
    const message = err instanceof Error ? err.message : "Something went wrong";
    toast({ title, description: message, variant: "destructive" });
  };

  const withLoading = async <T,>(fn: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    try {
      return await fn();
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const withAction = async <T,>(id: string, fn: () => Promise<T>): Promise<T | null> => {
    setActionLoading(id);
    try {
      return await fn();
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setActionLoading(null);
    }
  };

  // ─────────────────────────────────────────────
  // Data fetching
  // ─────────────────────────────────────────────
  const fetchPendingInstitutions = useCallback(() => {
    return withLoading(() => adminVerificationService.getPendingInstitutions());
  }, []);

  const fetchPendingStudents = useCallback(() => {
    return withLoading(() => adminVerificationService.getPendingStudents());
  }, []);

  const fetchAllPending = useCallback(() => {
    return withLoading(() => adminVerificationService.getAllPending());
  }, []);

  // ─────────────────────────────────────────────
  // Approval actions
  // ─────────────────────────────────────────────
  const approveInstitution = useCallback(async (profile: Profile): Promise<boolean> => {
    const result = await withAction(profile.id, async () => {
      await adminVerificationService.approveInstitution(profile.id);
      toast({
        title: "Approved ✓",
        description: `${profile.first_name} ${profile.last_name} approved as ${
          profile.role === "university_admin" ? "University Admin" : "Company Admin"
        }.`,
      });
      return true;
    });
    return result !== null;
  }, []);

  const approveStudent = useCallback(
    async (profile: Profile, sendInvitation: boolean = false, adminId?: string): Promise<boolean> => {
      const result = await withAction(profile.id, async () => {
        await adminVerificationService.approveStudent(profile.id);
        toast({
          title: "Approved ✓",
          description: `${profile.first_name} ${profile.last_name}'s profile verified.`,
        });

        if (sendInvitation && profile.university_name && adminId) {
          const universityId = await adminVerificationService.getUniversityIdByName(profile.university_name);
          if (!universityId) throw new Error("University not found");
          await adminVerificationService.sendConnectionInvitation(profile.id, universityId, adminId);
          toast({
            title: "Success",
            description: "Connection invitation sent to the university",
          });        }
        return true;
      });
      return result !== null;
    },
    []
  );

  const rejectProfile = useCallback(async (profile: Profile): Promise<boolean> => {
    const result = await withAction(`reject-${profile.id}`, async () => {
      await adminVerificationService.rejectProfile(profile.id);
      toast({
        title: "Rejected",
        description: `${profile.first_name} ${profile.last_name}'s account removed.`,
        variant: "destructive",
      });
      return true;
    });
    return result !== null;
  }, []);

  // ─────────────────────────────────────────────
  // Connection invitation (standalone)
  // ─────────────────────────────────────────────
  const sendConnectionInvitation = useCallback(
    async (studentId: string, universityName: string, adminId: string): Promise<boolean> => {
      const result = await withAction(`invite-${studentId}`, async () => {
        const universityId = await adminVerificationService.getUniversityIdByName(universityName);
        if (!universityId) throw new Error("University not found");
        await adminVerificationService.sendConnectionInvitation(studentId, universityId, adminId);
        toast({
            title: "Success",
            description: "Connection invitation sent to the university",
          });        return true;
      });
      return result !== null;
    },
    []
  );

  const getConnectionStatus = useCallback(
    async (studentId: string, universityName: string): Promise<string | null> => {
      try {
        const universityId = await adminVerificationService.getUniversityIdByName(universityName);
        if (!universityId) return null;
        return await adminVerificationService.getConnectionStatus(studentId, universityId);
      } catch (err) {
        console.error(err);
        return null;
      }
    },
    []
  );

  return {
    loading,
    actionLoading,
    fetchPendingInstitutions,
    fetchPendingStudents,
    fetchAllPending,
    approveInstitution,
    approveStudent,
    rejectProfile,
    sendConnectionInvitation,
    getConnectionStatus,
  };
}