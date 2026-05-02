// services/activity.service.ts
import { supabase } from "@/lib/supabaseClient";
import { Activity, ActivityType } from "../types/activity.types";

export const activityService = {
  // Get activities for a student, most recent first (limit default 20)
  async getStudentActivities(studentId: string, limit: number = 20): Promise<Activity[]> {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message);
    return data || [];
  },

  // Add a new activity entry
  async addActivity(
    studentId: string,
    type: ActivityType,
    title: string,
    description?: string,
    metadata?: Record<string, any>
  ): Promise<Activity> {
    const { data, error } = await supabase
      .from("activities")
      .insert({
        student_id: studentId,
        type,
        title,
        description,
        metadata,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  // Delete an activity (optional)
  async deleteActivity(activityId: string): Promise<void> {
    const { error } = await supabase.from("activities").delete().eq("id", activityId);
    if (error) throw new Error(error.message);
  },
};