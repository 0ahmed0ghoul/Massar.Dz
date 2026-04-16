import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { studentService } from "../services/student.service";
import { Tables } from "@/types/database";

type Profile = Tables<"profiles">;

export const useStudentProfile = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);

  const fetchProfile = async () => {
    if (!user) return;

    setLoading(true);
    const data = await studentService.getProfile(user.id);
    setProfile(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const updateProfile = async (payload: Partial<Profile>) => {
    if (!user) return;
    setSaving(true);
    await studentService.updateProfile(user.id, payload);
    const updated = await studentService.getProfile(user.id);
    setProfile(updated);
    setSaving(false);
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return;
    setUploadingAvatar(true);
    const avatarUrl = await studentService.uploadAvatar(user.id, file);
    if (avatarUrl) {
      setProfile(prev => prev ? { ...prev, avatar_url: avatarUrl } : null);
    }
    setUploadingAvatar(false);
    return avatarUrl;
  };

  const deleteAvatar = async () => {
    if (!user) return;
    setUploadingAvatar(true);
    await studentService.deleteAvatar(user.id);
    setProfile(prev => prev ? { ...prev, avatar_url: null } : null);
    setUploadingAvatar(false);
  };

  const uploadCV = async (file: File) => {
    if (!user) return null;
    setUploadingCV(true);
    const resumeUrl = await studentService.uploadCV(user.id, file);
    if (resumeUrl) {
      setProfile(prev => prev ? { ...prev, resume_url: resumeUrl } : null);
    }
    setUploadingCV(false);
    return resumeUrl;
  };
  
  const deleteCV = async () => {
    if (!user) return;
    setUploadingCV(true);
    await studentService.deleteCV(user.id);
    setProfile(prev => prev ? { ...prev, resume_url: null } : null);
    setUploadingCV(false);
  };

  return {
    profile,
    loading,
    saving,
    updateProfile,
    uploadingAvatar,
    uploadAvatar,
    deleteAvatar,
    uploadingCV,
    uploadCV,
    deleteCV,
    refetch: fetchProfile,
  };
};