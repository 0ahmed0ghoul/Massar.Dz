// features/university/services/universityProfile.service.ts
import { supabase } from "@/lib/supabaseClient";
import { Profile } from "@/types/profile.types";

export interface UniversityProfile extends Profile {
  university_name: string | null;
  rector_name: string | null;
  website: string | null;
  department: string | null;
  position: string | null;
  wilaya: string | null;
  verification_docs: {
    registration_certificate?: string;
    tax_id?: string;
  };
  avatar_url: string | null;
}

export interface ConnectedStudent {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  student_id: string | null;
  speciality: string | null;
  department: string | null;
  degree_level: string | null;
  academic_year: string | null;
  wilaya: string | null;
  avatar_url: string | null;
  university_connection_status: string | null;
  connected_at: string;
}

export interface PendingRequest {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  student_id_number: string | null;
  speciality: string | null;
  department: string | null;
  degree_level: string | null;
  academic_year: string | null;
  wilaya: string | null;
  avatar_url: string | null;
  student_card_url: string | null;
  resume_url: string | null;
  invited_by: string | null;
  created_at: string;
}

export const universityProfileService = {
  // Fetch university admin's own profile
  async getUniversityProfile(adminId: string): Promise<UniversityProfile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", adminId)
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  // Update university profile
  async updateUniversityProfile(adminId: string, updates: Partial<UniversityProfile>): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", adminId);
    if (error) throw new Error(error.message);
  },

  // Upload logo to storage and return public URL
  async uploadLogo(adminId: string, file: File): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${adminId}/logo-${Date.now()}.${fileExt}`;
    const filePath = `university-logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("university-files")
      .upload(filePath, file);
    if (uploadError) throw new Error(uploadError.message);

    const { data: { publicUrl } } = supabase.storage
      .from("university-files")
      .getPublicUrl(filePath);
    return publicUrl;
  },

  // Delete logo from storage (if needed)
  async deleteLogo(publicUrl: string): Promise<void> {
    const path = publicUrl.split("/university-files/")[1];
    if (!path) return;
    const { error } = await supabase.storage
      .from("university-files")
      .remove([path]);
    if (error) console.error("Failed to delete logo:", error);
  },

  // Get connected students (university_connection_status = 'accepted')
  async getConnectedStudents(universityId: string): Promise<ConnectedStudent[]> {
    const { data, error } = await supabase
      .from("profiles")
      .select(`
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
        university_connection_status,
        updated_at
      `)
      .eq("university_connection_status", "accepted")
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data.map((s: any) => ({
      ...s,
      connected_at: s.updated_at,
    }));
  },

  // Get pending connection requests for this university
  async getPendingRequests(universityId: string): Promise<PendingRequest[]> {
    const { data, error } = await supabase
      .from("university_connections")
      .select(`
        id,
        student_id,
        invited_by,
        created_at,
        profiles:student_id (
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
    return (data || []).map((item: any) => ({
      id: item.id,
      student_id: item.student_id,
      invited_by: item.invited_by,
      created_at: item.created_at,
      ...item.profiles,
      student_id_number: item.profiles?.student_id,
    }));
  },

  // Accept a pending request (updates connection status and invitation)
  async acceptRequest(requestId: string, studentId: string): Promise<void> {
    // 1. Update invitation status
    const { error: connError } = await supabase
      .from("university_connections")
      .update({ status: "accepted", updated_at: new Date().toISOString() })
      .eq("id", requestId);
    if (connError) throw new Error(connError.message);

    // 2. Update student's profile connection status
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ university_connection_status: "accepted" })
      .eq("id", studentId);
    if (profileError) throw new Error(profileError.message);
  },

  // Reject a pending request
  async rejectRequest(requestId: string, studentId: string): Promise<void> {
    // 1. Update invitation status
    const { error: connError } = await supabase
      .from("university_connections")
      .update({ status: "rejected", updated_at: new Date().toISOString() })
      .eq("id", requestId);
    if (connError) throw new Error(connError.message);

    // 2. Update student's profile connection status (optional: set to 'rejected')
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ university_connection_status: "rejected" })
      .eq("id", studentId);
    if (profileError) throw new Error(profileError.message);
  },
};