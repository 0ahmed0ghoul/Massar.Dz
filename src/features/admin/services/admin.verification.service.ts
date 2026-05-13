// features/admin/services/admin.verification.service.ts
import { supabase } from "@/lib/supabaseClient";
import { Profile } from "@/types/profile.types";

export const adminVerificationService = {
  // ─────────────────────────────────────────────
  // Fetch pending profiles
  // ─────────────────────────────────────────────
  async getPendingAccounts(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("is_completed", true)
      .eq("is_verified", false)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data as Profile[];
  },


  // ─────────────────────────────────────────────
  // Approval / Rejection
  // ─────────────────────────────────────────────
  async approveProfile(profile: Profile): Promise<void> {
    console.log("PROFILE:", profile);
    // Approve profile
    const { error } = await supabase
      .from("profiles")
      .update({
        is_verified: true,
        status: "active",
      })
      .eq("id", profile.id);
  
    if (error) throw new Error(error.message);
  
    // Automatically create university connection invitation
    // only for students that are currently studying
    if (
      profile.role === "student" &&
      profile.candidate_type === "studying" &&
      profile.university_name
    ) {
      const universityId = await this.getUniversityIdByName(
        profile.university_name
      );
  
      if (!universityId) return;
  
      // Prevent duplicates
      const { data: existingConnection } = await supabase
        .from("department_connections")
        .select("id")
        .eq("student_id", profile.id)
        .eq("university_id", universityId)
        .maybeSingle();
  
      if (!existingConnection) {
        const { error: connectionError } = await supabase
          .from("department_connections")
          .insert({
            student_id: profile.id,
            university_id: universityId,
            status: "pending",
          });
  
        if (connectionError) {
          throw new Error(connectionError.message);
        }
  
        const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({
          university_connection_status: "pending",
        })
        .eq("id", profile.id);
      
      if (profileUpdateError) {
        throw new Error(profileUpdateError.message);
      }
      }
    }
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
      .from("department_connections")
      .select("id")
      .eq("student_id", studentId)
      .eq("university_id", universityId)
      .maybeSingle();
    if (existing) throw new Error("Connection invitation already sent");

    // 2. Insert invitation record
    const { error: insertError } = await supabase
      .from("department_connections")
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
      .from("department_connections")
      .select("status")
      .eq("student_id", studentId)
      .eq("university_id", universityId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data?.status || null;
  },
};