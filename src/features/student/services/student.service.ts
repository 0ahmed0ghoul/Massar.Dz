import { supabase } from "@/lib/supabaseClient";
import { Tables, TablesUpdate } from "@/types/database";

type Profile = Tables<"profiles">;
type Application = Tables<"applications">;
type Job = Tables<"jobs">;
type Interview = Tables<"interviews">;
type Activity = Tables<"activities">;

export const studentService = {
  // ───────── PROFILE ─────────
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, payload: TablesUpdate<"profiles">) {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ───────── APPLICATIONS ─────────
  async getApplications(userId: string): Promise<Application[]> {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("student_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  // ───────── JOBS ─────────
  async getJobs(): Promise<Job[]> {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  // ───────── ACTIVITIES ─────────
  async getActivities(userId: string): Promise<Activity[]> {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("student_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  // ───────── INTERVIEWS ─────────
  async getInterviews(userId: string): Promise<Interview[]> {
    const { data, error } = await supabase
      .from("interviews")
      .select("*")
      .eq("student_id", userId)
      .order("date", { ascending: true });

    if (error) throw error;
    return data ?? [];
  },
};