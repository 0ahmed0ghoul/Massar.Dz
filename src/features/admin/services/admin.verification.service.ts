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

    // Default update
    const updates: any = {
      is_verified: true,
      status: "active",
    };

    // If student → auto mark connection as pending
    if (
      profile.role === "student" &&
      profile.candidate_type === "studying" &&
      profile.university_name
    ) {
      updates.university_connection_status = "pending";
    }

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", profile.id);

    if (error) {
      throw new Error(error.message);
    }
  },

  async rejectProfile(id: string): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  },

  // ─────────────────────────────────────────────
  // University Helpers
  // ─────────────────────────────────────────────
  async getUniversityIdByName(
    universityName: string
  ): Promise<string | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "university_admin")
      .eq("university_name", universityName)
      .limit(1);

    if (error) {
      throw new Error(error.message);
    }

    return data?.[0]?.id || null;
  },

  // ─────────────────────────────────────────────
  // Connection Invitation
  // ─────────────────────────────────────────────
  async sendConnectionInvitation(
    studentId: string,
    universityId: string,
    invitedBy: string
  ): Promise<void> {
    // Get university info
    const { data: university, error: universityError } = await supabase
      .from("profiles")
      .select("id, university_name")
      .eq("id", universityId)
      .maybeSingle();

    if (universityError) {
      throw new Error(universityError.message);
    }

    if (!university) {
      throw new Error("University not found");
    }

    // Update student profile directly
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        university_connection_status: "pending",
        university_name: university.university_name,
      })
      .eq("id", studentId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    console.log(
      `✅ Invitation sent from ${invitedBy} to student ${studentId}`
    );
  },

  // ─────────────────────────────────────────────
  // Connection Status
  // ─────────────────────────────────────────────
  async getConnectionStatus(
    studentId: string
  ): Promise<string | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("university_connection_status")
      .eq("id", studentId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data?.university_connection_status || null;
  },
};