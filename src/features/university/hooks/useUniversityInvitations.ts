// features/university/hooks/useUniversityInvitations.ts
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import {
  universityInvitationService,
  InvitationWithStudent,
} from "../services/universityInvitation.service";
import { useToast } from "@/components/ui/use-toast";

export function useUniversityInvitations() {
  const { profile } = useAuth();
  const { toast } = useToast();

  const [pending, setPending] = useState<InvitationWithStudent[]>([]);
  const [history, setHistory] = useState<InvitationWithStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const universityId = profile?.id;

  const loadInvitations = useCallback(async () => {
    if (!universityId) return;

    setLoading(true);
    try {
      const [pendingData, allData] = await Promise.all([
        universityInvitationService.getPendingInvitations(universityId),
        universityInvitationService.getAllInvitations(universityId),
      ]);

      setPending(pendingData);

      // FIX: keep full history (not only filtered safe logic)
      setHistory(allData.filter((inv) => inv.status !== "pending"));

    } catch (err: any) {
      console.error("Invitation load error:", err);

      toast({
        title: "Error",
        description: err.message || "Failed to load invitations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [universityId, toast]);

  useEffect(() => {
    if (!universityId) return;
    loadInvitations();
  }, [universityId, loadInvitations]);

  const acceptInvitation = useCallback(
    async (invitationId: string, studentId: string) => {
      setActionLoading(invitationId);
      try {
        await universityInvitationService.acceptInvitation(invitationId, studentId);

        toast({
          title: "Success",
          description: "Student connected successfully",
        });

        await loadInvitations();
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setActionLoading(null);
      }
    },
    [loadInvitations, toast]
  );

  const rejectInvitation = useCallback(
    async (invitationId: string, studentId: string) => {
      setActionLoading(invitationId);
      try {
        await universityInvitationService.rejectInvitation(invitationId, studentId);

        toast({
          title: "Success",
          description: "Invitation rejected",
        });

        await loadInvitations();
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setActionLoading(null);
      }
    },
    [loadInvitations, toast]
  );

  return {
    pending,
    history,
    loading,
    actionLoading,
    acceptInvitation,
    rejectInvitation,
    refresh: loadInvitations,
  };
}