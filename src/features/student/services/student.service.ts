// features/student/services/student.service.ts
import { supabase } from "@/lib/supabaseClient";
import { Tables } from "@/types/database";

type Job = Tables<"jobs">;
type Application = Tables<"applications">;
type Activity = Tables<"activities">;
type Interview = Tables<"interviews">;
type Profile = Tables<"profiles">;

type ApplicationWithJob = Application & {
  jobs: {
    id: string;
    title: string;
    company: string;
  } | null;
};

// Required fields for a student profile to be considered "complete"
const REQUIRED_STUDENT_FIELDS: (keyof Profile)[] = [
  "first_name",
  "last_name",
  "email",
  "degree_level",
  "university_name",
  "specialty",
  "wilaya",
  "academic_year",
  "specialty_type",
  "student_id"
];

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

  async getApplications(studentId: string): Promise<ApplicationWithJob[]> {
    const { data, error } = await supabase
      .from("applications")
      .select(`
        *,
        jobs (
          id,
          title,
          company
        )
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

  /**
   * Update a student's profile
   */
  async updateProfile(studentId: string, payload: Partial<Profile>): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", studentId);

    if (error) {
      console.error("Error updating profile:", error);
      throw new Error(error.message);
    }
  },

  /**
   * Check if a student profile has all required fields filled.
   */
  async isProfileComplete(studentId: string): Promise<boolean> {
    const profile = await this.getProfile(studentId);
    if (!profile) return false;
    return REQUIRED_STUDENT_FIELDS.every(field => {
      const value = profile[field];
      return value != null && String(value).trim() !== "";
    });
  },

  /**
   * If the profile is complete and not yet marked as completed,
   * set the is_completed flag to true.
   * Returns true if the profile is complete (whether it was already marked or just set).
   */
  async ensureProfileCompleted(studentId: string): Promise<boolean> {
    const complete = await this.isProfileComplete(studentId);
    if (complete) {
      const profile = await this.getProfile(studentId);
      if (profile && !profile.is_completed) {
        await this.updateProfile(studentId, { is_completed: true });
      }
    }
    return complete;
  },

  /**
   * Upload an avatar image for a student
   */
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
    return avatarUrl;
  },

  /**
   * Delete a student's avatar
   */
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
  },

  /**
   * Upload a CV/resume file for a student
   */
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
    return resumeUrl;
  },

  /**
   * Delete a student's CV
   */
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
  },

  /**
   * Upload a student card file for a student
   */
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
    return studentCardUrl;
  },

  /**
   * Delete a student's student card
   */
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
  },
};