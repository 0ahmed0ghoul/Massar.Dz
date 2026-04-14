import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { studentService } from "../services/student.service";
import { Tables } from "@/types/database";

type Profile = Tables<"profiles">;

export const useStudentProfile = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  return {
    profile,
    loading,
    saving,
    updateProfile,
    refetch: fetchProfile,
  };
};