// services/student.service.ts
import { supabase } from "@/lib/supabaseClient";
import { Tables } from "@/types/database";

type Application = Tables<"applications">;
type Job = Tables<"jobs">;
type Interview = Tables<"interviews">;
type Activity = Tables<"activities">;
type Profile = Tables<"profiles">;

export const studentService = {
  getApplications: async (userId: string) => {
    const { data, error } = await supabase
      .from("applications")
      .select(`
        *,
        job:jobs!applications_job_id_fkey (*)
      `)
      .eq("student_id", userId);

    if (error) {
      console.error("getApplications error:", error);
      return [];
    }
    return data || [];
  },

  getJobs: async (): Promise<Job[]> => {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getJobs error:", error);
      return [];
    }
    return data || [];
  },

  getInterviews: async (userId: string): Promise<Interview[]> => {
    const { data, error } = await supabase
      .from("interviews")
      .select("*")
      .eq("student_id", userId)
      .order("date", { ascending: true });

    if (error) {
      console.error("getInterviews error:", error);
      return [];
    }
    return data || [];
  },

  getActivities: async (userId: string): Promise<Activity[]> => {
    try {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("student_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch {
      return [];
    }
  },

  getProfile: async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("getProfile error:", error);
      return null;
    }
    return data;
  },

  updateProfile: async (userId: string, updates: Partial<Profile>) => {
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId);

    if (error) throw error;
  },

  uploadAvatar: async (userId: string, file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/avatar.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await studentService.updateProfile(userId, { avatar_url: publicUrl });
      return publicUrl;
    } catch (err) {
      console.error('Avatar upload error:', err);
      return null;
    }
  },

  deleteAvatar: async (userId: string): Promise<void> => {
    try {
      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove([`${userId}/avatar`]);

      if (deleteError) throw deleteError;
      await studentService.updateProfile(userId, { avatar_url: null });
    } catch (err) {
      console.error('Avatar deletion error:', err);
    }
  },

  uploadCV: async (userId: string, file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/resume.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      await studentService.updateProfile(userId, { resume_url: publicUrl });
      return publicUrl;
    } catch (err) {
      console.error('CV upload error:', err);
      return null;
    }
  },

  deleteCV: async (userId: string): Promise<void> => {
    try {
      const profile = await studentService.getProfile(userId);
      if (profile?.resume_url) {
        // Extract file path from URL safely
        try {
          const url = new URL(profile.resume_url);
          const pathParts = url.pathname.split('/');
          const resumesIndex = pathParts.indexOf('resumes');
          if (resumesIndex !== -1) {
            const filePath = pathParts.slice(resumesIndex + 1).join('/');
            if (filePath) {
              await supabase.storage.from('resumes').remove([filePath]);
            }
          }
        } catch (urlError) {
          console.error('Error parsing resume URL:', urlError);
        }
      }
      await studentService.updateProfile(userId, { resume_url: null });
    } catch (err) {
      console.error('CV deletion error:', err);
    }
  },
};