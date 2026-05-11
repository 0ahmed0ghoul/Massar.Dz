// features/university/services/universityInvitation.service.ts

import { supabase } from "@/lib/supabaseClient";
import { universityStudentsService } from "./universityStudents.service";

export interface InvitationWithStudent {
  id: string;
  student_id: string;
  university_id: string;
  status: "pending" | "accepted" | "rejected";
  invited_by: string | null;
  created_at: string;
  updated_at?: string;

  profile: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    student_id: string | null;
    speciality: string | null;
    department: string | null;
    degree_level: string | null;
    academic_year: string | null;
    wilaya: string | null;
    avatar_url: string | null;
    student_card_url: string | null;
    resume_url: string | null;
  } | null;

  university_record?: any;
}

//
// 🔥 CORE MAPPING FUNCTION (ASYNC)
//
export const mapConnection = async (
  item: any
): Promise<InvitationWithStudent> => {
  const profile = item.profile;

  let university_record = null;

  // ✅ Normalize student_id
  const cleanStudentId = profile?.student_id
    ? profile.student_id.toString().trim()
    : null;

  // ✅ Try matching with university Excel data
  if (cleanStudentId) {
    try {
      university_record = await universityStudentsService.matchStudent(
        item.university_id,
        cleanStudentId
      );
    } catch (err) {
      console.error("❌ Matching error:", err);
    }
  }

  // ✅ Debug log
  console.log("MATCHING:", cleanStudentId, "=>", university_record);

  return {
    id: item.id,
    student_id: item.student_id,
    university_id: item.university_id,
    status: item.status,
    invited_by: item.invited_by,
    created_at: item.created_at,
    updated_at: item.updated_at,

    profile: profile
      ? {
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          student_id: cleanStudentId,
          speciality: profile.speciality,
          department: profile.department,
          degree_level: profile.degree_level,
          academic_year: profile.academic_year,
          wilaya: profile.wilaya,
          avatar_url: profile.avatar_url,
          student_card_url: profile.student_card_url ?? null,
          resume_url: profile.resume_url ?? null,
        }
      : null,

    university_record,
  };
};

//
// 🚀 SERVICE
//
export const universityInvitationService = {
  // =========================
  // GET PENDING
  // =========================
  async getPendingInvitations(
    universityId: string
  ): Promise<InvitationWithStudent[]> {
    const { data, error } = await supabase
      .from("department_connections")
      .select(`
        id,
        student_id,
        university_id,
        status,
        invited_by,
        created_at,
        updated_at,
        profile:profiles!university_connections_student_id_fkey (
          id,
          first_name,
          last_name,
          email,
          student_id,
          speciality,
          department,
          degree_level,
          academic_year,
          wilaya,
          avatar_url,
          student_card_url,
          resume_url
        )
      `)
      .eq("university_id", universityId)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    // 🔥 IMPORTANT FIX
    return await Promise.all((data || []).map(mapConnection));
  },

  // =========================
  // GET HISTORY
  // =========================
  async getAllInvitations(
    universityId: string
  ): Promise<InvitationWithStudent[]> {
    const { data, error } = await supabase
      .from("department_connections")
      .select(`
        id,
        student_id,
        university_id,
        status,
        invited_by,
        created_at,
        updated_at,
        profile:profiles!university_connections_student_id_fkey (
          id,
          first_name,
          last_name,
          email,
          student_id,
          speciality,
          department,
          degree_level,
          academic_year,
          wilaya,
          avatar_url,
          student_card_url,
          resume_url
        )
      `)
      .eq("university_id", universityId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    // 🔥 IMPORTANT FIX HERE TOO
    return await Promise.all((data || []).map(mapConnection));
  },

  // =========================
  // ACCEPT
  // =========================
  async acceptInvitation(invitationId: string, studentId: string) {
    const { error: connError } = await supabase
      .from("department_connections")
      .update({
        status: "accepted",
        updated_at: new Date().toISOString(),
      })
      .eq("id", invitationId);

    if (connError) throw new Error(connError.message);

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        university_connection_status: "accepted",
      })
      .eq("id", studentId);

    if (profileError) throw new Error(profileError.message);
  },

  // =========================
  // REJECT
  // =========================
  async rejectInvitation(invitationId: string, studentId: string) {
    const { error: connError } = await supabase
      .from("department_connections")
      .update({
        status: "rejected",
        updated_at: new Date().toISOString(),
      })
      .eq("id", invitationId);

    if (connError) throw new Error(connError.message);

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        university_connection_status: "rejected",
      })
      .eq("id", studentId);

    if (profileError) throw new Error(profileError.message);
  },
};