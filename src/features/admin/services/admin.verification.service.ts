// features/admin/services/admin.verification.service.ts
import { supabase } from "@/lib/supabaseClient";
import { Profile } from "../types/verification.types";

export const adminVerificationService = {
  // ─────────────────────────────────────────────
  // Fetch pending profiles
  // ─────────────────────────────────────────────
  async getPendingInstitutions(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("is_completed", true)
      .eq("is_verified", false)
      .in("role", ["university_admin", "company_admin"])
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data as Profile[];
  },

  async getPendingStudents(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "student")
      .eq("is_completed", true)
      .eq("is_verified", false)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data as Profile[];
  },

  async getAllPending(): Promise<Profile[]> {
    const [institutions, students] = await Promise.all([
      this.getPendingInstitutions(),
      this.getPendingStudents(),
    ]);
    return [...institutions, ...students];
  },

  // ─────────────────────────────────────────────
  // Approval / Rejection
  // ─────────────────────────────────────────────
  async approveInstitution(id: string): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .update({ is_verified: true, status: "active" })
      .eq("id", id);
    if (error) throw new Error(error.message);
  },

  async approveStudent(id: string): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .update({ is_verified: true, status: "active" })
      .eq("id", id);
    if (error) throw new Error(error.message);
  },

  async rejectProfile(id: string): Promise<void> {
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  // ─────────────────────────────────────────────
  // University Connection Invitations
  // ─────────────────────────────────────────────
  async getUniversityIdByName(universityName: string): Promise<string | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "university_admin")
      .eq("university_name", universityName)
      .limit(1);
    if (error) throw new Error(error.message);
    return data?.[0]?.id || null;
  },

  async sendConnectionInvitation(studentId: string, universityId: string, invitedBy: string): Promise<void> {
    // 1. Check if invitation already exists
    const { data: existing } = await supabase
      .from("university_connections")
      .select("id")
      .eq("student_id", studentId)
      .eq("university_id", universityId)
      .maybeSingle();
    if (existing) throw new Error("Connection invitation already sent");

    // 2. Insert invitation record
    const { error: insertError } = await supabase
      .from("university_connections")
      .insert({
        student_id: studentId,
        university_id: universityId,
        status: "pending",
        invited_by: invitedBy,
      });
    if (insertError) throw new Error(insertError.message);

    // 3. Update student's profile to mark connection status as 'pending'
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ university_connection_status: "pending" })
      .eq("id", studentId);
    if (updateError) throw new Error(updateError.message);
  },

  async getConnectionStatus(studentId: string, universityId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from("university_connections")
      .select("status")
      .eq("student_id", studentId)
      .eq("university_id", universityId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data?.status || null;
  },
};