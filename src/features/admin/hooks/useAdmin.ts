// features/admin/hooks/useAdmin.ts
import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { adminService, Profile, AdminStats } from "../services/admin.service";

export function useAdmin() {
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleError = (err: any, title = "Error") => {
    toast({ title, description: err.message, variant: "destructive" });
  };

  const fetchProfiles = useCallback(async (): Promise<Profile[]> => {
    setLoading(true);
    try {
      return await adminService.getProfiles();
    } catch (err: any) {
      handleError(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch pending institutions
  const fetchPendingProfiles = useCallback(async (): Promise<Profile[]> => {
    setLoading(true);
    try {
      return await adminService.getPendingProfiles();
    } catch (err: any) {
      handleError(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch pending students (incomplete profiles)
  const fetchPendingStudents = useCallback(async (): Promise<Profile[]> => {
    setLoading(true);
    try {
      return await adminService.getPendingStudents();
    } catch (err: any) {
      handleError(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all pending (institutions + students)
  const fetchAllPending = useCallback(async (): Promise<Profile[]> => {
    setLoading(true);
    try {
      return await adminService.getAllPending();
    } catch (err: any) {
      handleError(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async (): Promise<AdminStats | null> => {
    setLoading(true);
    try {
      return await adminService.getStats();
    } catch (err: any) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (id: string, status: string) => {
    setActionLoading(`status-${id}`);
    try {
      await adminService.updateStatus(id, status);
      toast({ title: "Updated", description: `Status changed to ${status}.` });
      return true;
    } catch (err: any) {
      handleError(err);
      return false;
    } finally {
      setActionLoading(null);
    }
  }, []);

  // Approve institution
  const approvePending = useCallback(async (profile: Profile) => {
    setActionLoading(profile.id);
    try {
      const newRole = profile.role === "university_admin" ? "university_admin" : "company_admin";
      await adminService.approvePending(profile.id, newRole);
      toast({
        title: "Approved ✓",
        description: `${profile.first_name} ${profile.last_name} approved as ${newRole === "university_admin" ? "University Admin" : "Company Admin"}.`,
      });
      return true;
    } catch (err: any) {
      handleError(err);
      return false;
    } finally {
      setActionLoading(null);
    }
  }, []);

  // Approve student (mark is_completed = true)
  const approveStudent = useCallback(async (profile: Profile) => {
    setActionLoading(profile.id);
    try {
      await adminService.approveStudent(profile.id);
      toast({
        title: "Approved ✓",
        description: `${profile.first_name} ${profile.last_name}'s profile marked as complete.`,
      });
      return true;
    } catch (err: any) {
      handleError(err);
      return false;
    } finally {
      setActionLoading(null);
    }
  }, []);

  // Reject institution
  const rejectPending = useCallback(async (profile: Profile) => {
    setActionLoading(`reject-${profile.id}`);
    try {
      await adminService.updateStatus(profile.id, "rejected");
      toast({
        title: "Rejected",
        description: `${profile.first_name} ${profile.last_name}'s account rejected.`,
        variant: "destructive",
      });
      return true;
    } catch (err: any) {
      handleError(err);
      return false;
    } finally {
      setActionLoading(null);
    }
  }, []);

  // Reject student (optional – just remove from list? We'll just delete for simplicity)
  const rejectStudent = useCallback(async (profile: Profile) => {
    setActionLoading(`reject-${profile.id}`);
    try {
      // Option 1: delete profile
      await adminService.deleteProfile(profile.id);
      toast({
        title: "Rejected",
        description: `${profile.first_name} ${profile.last_name}'s profile removed.`,
        variant: "destructive",
      });
      return true;
    } catch (err: any) {
      handleError(err);
      return false;
    } finally {
      setActionLoading(null);
    }
  }, []);

  const deleteProfile = useCallback(async (id: string, name: string) => {
    setActionLoading(`delete-${id}`);
    try {
      await adminService.deleteProfile(id);
      toast({ title: "Deleted", description: `${name}'s account removed.` });
      return true;
    } catch (err: any) {
      handleError(err);
      return false;
    } finally {
      setActionLoading(null);
    }
  }, []);

  return {
    loading,
    actionLoading,
    fetchProfiles,
    fetchPendingProfiles,
    fetchPendingStudents,
    fetchAllPending,
    fetchStats,
    updateStatus,
    approvePending,
    approveStudent,
    rejectPending,
    rejectStudent,
    deleteProfile,
  };
}