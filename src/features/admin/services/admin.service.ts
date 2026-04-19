// features/admin/services/admin.service.ts
import { supabase } from "@/lib/supabaseClient";

export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  university_name?: string;
  company_name?: string;
  industry?: string;
  degree_level?: string;
  city?: string;
  created_at: string;
  is_completed?: boolean;
  is_verified?: boolean;
}

export interface AdminStats {
  total: number;
  students: number;
  companies: number;
  universities: number;
  pendingUniversities: number;
  pendingCompanies: number;
  pendingStudents: number;
  rejected: number;
}

export const adminService = {
  // Fetch all profiles
  async getProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Profile[];
  },

  // Fetch pending institutions (status = pending, role in university_admin, company_admin)
  async getPendingProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("status", "pending")
      .in("role", ["university_admin", "company_admin"])
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Profile[];
  },

  // Fetch pending students (is_completed = true, is_verified = false, role = student)
  async getPendingStudents(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "student")
      .eq("is_completed", true)
      .eq("is_verified", false)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Profile[];
  },

  // Fetch all pending (institutions + students)
  async getAllPending(): Promise<Profile[]> {
    const institutions = await this.getPendingProfiles();
    const students = await this.getPendingStudents();
    return [...institutions, ...students];
  },

  // Update profile status (for institutions)
  async updateStatus(id: string, status: string): Promise<void> {
    const { error } = await supabase.from("profiles").update({ status }).eq("id", id);
    if (error) throw error;
  },

  // Approve institution (set role and status to active)
  async approvePending(id: string, newRole: string): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole, status: "active" })
      .eq("id", id);
    if (error) throw error;
  },

  // Approve student (set is_verified = true)
  async approveStudent(id: string): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .update({ is_verified: true })
      .eq("id", id);
    if (error) throw error;
  },

  // Delete profile
  async deleteProfile(id: string): Promise<void> {
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) throw error;
  },

  // Compute stats
  async getStats(): Promise<AdminStats> {
    const { data, error } = await supabase.from("profiles").select("role, status, is_completed, is_verified");
    if (error) throw error;

    const students = data.filter(p => p.role === "student");
    return {
      total: data.length,
      students: students.length,
      companies: data.filter(p => p.role === "company_admin" && p.status === "active").length,
      universities: data.filter(p => p.role === "university_admin" && p.status === "active").length,
      pendingUniversities: data.filter(p => p.role === "university_admin" && p.status === "pending").length,
      pendingCompanies: data.filter(p => p.role === "company_admin" && p.status === "pending").length,
      pendingStudents: students.filter(s => s.is_completed === true && s.is_verified === false).length,
      rejected: data.filter(p => p.status === "rejected").length,
    };
  },
};