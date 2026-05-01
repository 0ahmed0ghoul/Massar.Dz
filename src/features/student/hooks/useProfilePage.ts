// hooks/useProfilePage.ts
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { studentService } from "@/features/student/services/student.service";
import { Tables } from "@/types/database";
import { Profile } from "@/domain/profile.types";


export const useProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [uploadingStudentCard, setUploadingStudentCard] = useState(false);

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await studentService.getProfile(user.id);
      setProfile(data);
      console.log('data',data)
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    setSaving(true);
    try {
      await studentService.updateProfile(user.id, updates);
      setProfile((prev) => (prev ? { ...prev, ...updates } : null));
      await fetchProfile(); // re-fetch to sync
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return null;
    setUploadingAvatar(true);
    try {
      const url = await studentService.uploadAvatar(user.id, file);
      if (url) setProfile((prev) => prev ? { ...prev, avatar_url: url } : null);
      return url;
    } finally {
      setUploadingAvatar(false);
    }
  };

  const deleteAvatar = async () => {
    if (!user) return;
    setUploadingAvatar(true);
    try {
      await studentService.deleteAvatar(user.id);
      setProfile((prev) => prev ? { ...prev, avatar_url: null } : null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const uploadCV = async (file: File) => {
    if (!user) return null;
    setUploadingCV(true);
    try {
      const url = await studentService.uploadCV(user.id, file);
      if (url) setProfile((prev) => prev ? { ...prev, resume_url: url } : null);
      return url;
    } finally {
      setUploadingCV(false);
    }
  };

  const deleteCV = async () => {
    if (!user) return;
    setUploadingCV(true);
    try {
      await studentService.deleteCV(user.id);
      setProfile((prev) => prev ? { ...prev, resume_url: null } : null);
    } finally {
      setUploadingCV(false);
    }
  };

  const uploadStudentCard = async (file: File) => {
    if (!user) return null;
    setUploadingStudentCard(true);
    try {
      const url = await studentService.uploadStudentCard(user.id, file);
      if (url) setProfile((prev) => prev ? { ...prev, student_card_url: url } : null);
      return url;
    } finally {
      setUploadingStudentCard(false);
    }
  };

  const deleteStudentCard = async () => {
    if (!user) return;
    setUploadingStudentCard(true);
    try {
      await studentService.deleteStudentCard(user.id);
      setProfile((prev) => prev ? { ...prev, student_card_url: null } : null);
    } finally {
      setUploadingStudentCard(false);
    }
  };

  const requestUniversityConnection = async () => {
    if (!user || profile?.status !== 'pending') return; // use correct snake_case field name
    try {
      await studentService.updateProfile(user.id, { university_connection_status: true });
      setProfile((prev) => prev ? { ...prev, university_connection_status: true } : null);
    } catch (error) {
      console.error("Failed to request university connection:", error);
    }
  };

  return {
    profile,
    loading,
    saving,
    uploadingAvatar,
    uploadingCV,
    uploadingStudentCard,
    updateProfile,
    uploadAvatar,
    deleteAvatar,
    uploadCV,
    deleteCV,
    uploadStudentCard,
    deleteStudentCard,
    requestUniversityConnection,
  };
};