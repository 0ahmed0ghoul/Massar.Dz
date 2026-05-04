// features/admin/hooks/useAdmin.ts
import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { adminService } from "../services/admin.service";
import { AdminStats, Profile } from "../types/verification.types";

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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
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
    fetchStats,
    updateStatus,
    deleteProfile,
  };
}