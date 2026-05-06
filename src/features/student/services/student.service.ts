// features/student/services/student.service.ts
import { REQUIRED_STUDENT_FIELDS } from "@/constants/student.constants";
import { supabase } from "@/lib/supabaseClient";
import { Activity } from "@/types/activity";
import { Application } from "@/types/application";
import { Job } from "@/types/job";
import { Profile } from "@/types/profile.types";
import { Interview } from "@/types/student";


type ApplicationWithJob = Application & {
  jobs: {
    id: string;
    title: string;
    company: string;
  } | null;
};



// Helper: Insert activity
async function addActivity(studentId: string, type: string, title: string, description?: string, metadata?: any) {
  try {
    await supabase.from("activities").insert({
      student_id: studentId,
      type,
      title,
      description,
      metadata,
    });
  } catch (err) {
    console.error("Failed to record activity:", err);
  }
}

export const studentService = {
  async getJobs(): Promise<Job[]> {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching jobs:", error);
      throw new Error(error.message);
    }
    return data || [];
  },

  async getVerifiedUniversities(): Promise<{ id: string; name: string }[]> {
    try {
      const { data, error } = await supabase
        .rpc('get_verified_universities');
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching verified universities:", error);
      return [];
    }
  },

  async getApplications(studentId: string): Promise<ApplicationWithJob[]> {
    const { data, error } = await supabase
      .from("applications")
      .select(`
        *,
        jobs ( id, title, company )
      `)
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching applications:", error);
      throw new Error(error.message);
    }
    return data || [];
  },

  async getActivities(studentId: string): Promise<Activity[]> {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching activities:", error);
      throw new Error(error.message);
    }
    return data || [];
  },

  async getInterviews(studentId: string): Promise<Interview[]> {
    const { data, error } = await supabase
      .from("interviews")
      .select("*")
      .eq("student_id", studentId)
      .order("scheduled_at", { ascending: true });
    if (error) {
      console.error("Error fetching interviews:", error);
      throw new Error(error.message);
    }
    return data || [];
  },

  async getProfile(studentId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", studentId)
      .single();
    if (error && error.code !== "PGRST116") {
      console.error("Error fetching profile:", error);
      throw new Error(error.message);
    }
    return data;
  },

  async updateProfile(studentId: string, payload: Partial<Profile>): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", studentId);
    if (error) {
      console.error("Error updating profile:", error);
      throw new Error(error.message);
    }
    // Record generic profile update activity (avoid too many if called in loops)
    await addActivity(studentId, "profile_updated", "Profile information updated");
  },

  async isProfileComplete(studentId: string): Promise<boolean> {
    const profile = await this.getProfile(studentId);
    if (!profile) return false;
    return REQUIRED_STUDENT_FIELDS.every(field => {
      const value = profile[field];
      return value != null && String(value).trim() !== "";
    });
  },

  async ensureProfileCompleted(studentId: string): Promise<boolean> {
    const complete = await this.isProfileComplete(studentId);
    if (complete) {
      const profile = await this.getProfile(studentId);
      if (profile && !profile.is_completed) {
        await this.updateProfile(studentId, { is_completed: true });
        await addActivity(studentId, "profile_completed", "Profile completed – ready for opportunities");
      }
    }
    return complete;
  },

  async uploadAvatar(studentId: string, file: File): Promise<string | null> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${studentId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("student-files")
      .upload(filePath, file, { upsert: true });
    if (uploadError) {
      console.error("Error uploading avatar:", uploadError);
      throw new Error(uploadError.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from("student-files")
      .getPublicUrl(filePath);
    const avatarUrl = publicUrlData.publicUrl;

    await this.updateProfile(studentId, { avatar_url: avatarUrl });
    await addActivity(studentId, "profile_updated", "Profile picture uploaded");
    return avatarUrl;
  },

  async deleteAvatar(studentId: string): Promise<void> {
    const profile = await this.getProfile(studentId);
    if (!profile?.avatar_url) return;

    const urlParts = profile.avatar_url.split("/");
    const filePath = urlParts.slice(urlParts.indexOf("avatars")).join("/");
    const { error: deleteError } = await supabase.storage
      .from("student-files")
      .remove([filePath]);
    if (deleteError) {
      console.error("Error deleting avatar:", deleteError);
      throw new Error(deleteError.message);
    }

    await this.updateProfile(studentId, { avatar_url: null });
    await addActivity(studentId, "profile_updated", "Profile picture removed");
  },

  async uploadCV(studentId: string, file: File): Promise<string | null> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${studentId}-${Date.now()}.${fileExt}`;
    const filePath = `resumes/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("student-files")
      .upload(filePath, file, { upsert: true });
    if (uploadError) {
      console.error("Error uploading CV:", uploadError);
      throw new Error(uploadError.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from("student-files")
      .getPublicUrl(filePath);
    const resumeUrl = publicUrlData.publicUrl;

    await this.updateProfile(studentId, { resume_url: resumeUrl });
    await addActivity(studentId, "profile_updated", "CV/Resume uploaded");
    return resumeUrl;
  },

  async deleteCV(studentId: string): Promise<void> {
    const profile = await this.getProfile(studentId);
    if (!profile?.resume_url) return;

    const urlParts = profile.resume_url.split("/");
    const filePath = urlParts.slice(urlParts.indexOf("resumes")).join("/");
    const { error: deleteError } = await supabase.storage
      .from("student-files")
      .remove([filePath]);
    if (deleteError) {
      console.error("Error deleting CV:", deleteError);
      throw new Error(deleteError.message);
    }

    await this.updateProfile(studentId, { resume_url: null });
    await addActivity(studentId, "profile_updated", "CV/Resume removed");
  },

  async uploadStudentCard(studentId: string, file: File): Promise<string | null> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${studentId}-${Date.now()}.${fileExt}`;
    const filePath = `student-cards/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("student-files")
      .upload(filePath, file, { upsert: true });
    if (uploadError) {
      console.error("Error uploading student card:", uploadError);
      throw new Error(uploadError.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from("student-files")
      .getPublicUrl(filePath);
    const studentCardUrl = publicUrlData.publicUrl;

    await this.updateProfile(studentId, { student_card_url: studentCardUrl });
    await addActivity(studentId, "profile_updated", "Student card uploaded");
    return studentCardUrl;
  },

  async deleteStudentCard(studentId: string): Promise<void> {
    const profile = await this.getProfile(studentId);
    if (!profile?.student_card_url) return;

    const urlParts = profile.student_card_url.split("/");
    const filePath = urlParts.slice(urlParts.indexOf("student-cards")).join("/");
    const { error: deleteError } = await supabase.storage
      .from("student-files")
      .remove([filePath]);
    if (deleteError) {
      console.error("Error deleting student card:", deleteError);
      throw new Error(deleteError.message);
    }

    await this.updateProfile(studentId, { student_card_url: null });
    await addActivity(studentId, "profile_updated", "Student card removed");
  },
};