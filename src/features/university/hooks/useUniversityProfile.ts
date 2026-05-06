// features/university/hooks/useUniversityProfile.ts
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { universityProfileService, UniversityProfile, ConnectedStudent, PendingRequest } from "../services/universityProfile.service";

export function useUniversityProfile() {
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const [university, setUniversity] = useState<UniversityProfile | null>(null);
  const [connectedStudents, setConnectedStudents] = useState<ConnectedStudent[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const universityId = profile?.id;

  const loadAllData = useCallback(async () => {
    if (!universityId) return;
    setLoading(true);
    try {
      const [uni, connected, pending] = await Promise.all([
        universityProfileService.getUniversityProfile(universityId),
        universityProfileService.getConnectedStudents(universityId),
        universityProfileService.getPendingRequests(universityId),
      ]);
      setUniversity(uni);
      setConnectedStudents(connected);
      setPendingRequests(pending);
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [universityId, toast]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const updateUniversity = useCallback(async (updates: Partial<UniversityProfile>) => {
    if (!universityId) return;
    setSaving(true);
    try {
      await universityProfileService.updateUniversityProfile(universityId, updates);
      setUniversity((prev) => (prev ? { ...prev, ...updates } : null));
      toast({ title: "Success", description: "Profile updated" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }, [universityId, toast]);

  const uploadLogo = useCallback(async (file: File) => {
    if (!universityId) return;
    setUploadingLogo(true);
    try {
      const logoUrl = await universityProfileService.uploadLogo(universityId, file);
      // Now update avatar_url directly (assumes service already updates)
      setUniversity((prev) => prev ? { ...prev, avatar_url: logoUrl } : null);
      toast({ title: "Success", description: "Logo uploaded" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUploadingLogo(false);
    }
  }, [universityId, toast]);

  const deleteLogo = useCallback(async () => {
    if (!university?.avatar_url) return;
    setUploadingLogo(true);
    try {
      await universityProfileService.deleteLogo(university.avatar_url);
      await updateUniversity({ avatar_url: null });
      toast({ title: "Success", description: "Logo removed" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUploadingLogo(false);
    }
  }, [university, updateUniversity, toast]);

  const acceptRequest = useCallback(async (requestId: string, studentId: string) => {
    try {
      await universityProfileService.acceptRequest(requestId, studentId);
      toast({ title: "Success", description: "Connection accepted" });
      await loadAllData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  }, [loadAllData, toast]);

  const rejectRequest = useCallback(async (requestId: string, studentId: string) => {
    try {
      await universityProfileService.rejectRequest(requestId, studentId);
      toast({ title: "Success", description: "Connection rejected" });
      await loadAllData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  }, [loadAllData, toast]);

  return {
    university,
    loading,
    saving,
    uploadingLogo,
    updateUniversity,
    uploadLogo,
    deleteLogo,
    connectedStudents,
    pendingRequests,
    acceptRequest,
    rejectRequest,
    refresh: loadAllData,
  };
}