// features/admin/services/admin.service.ts
import { supabase } from "@/lib/supabaseClient";

export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;               // active, pending, rejected
  university_name?: string;
  company_name?: string;
  industry?: string;
  degree_level?: string;
  wilaya?: string;
  created_at: string;
  is_completed?: boolean;       // profile completion flag
  status?: string; // pending, approved, rejected, null
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

  // Fetch pending students:
  // - those who have completed their profile but status = 'pending'
  // - or those who have not completed their profile (is_completed = false)
  async getPendingStudents(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "student")
      .or(`is_completed.eq.false,status.eq.pending`)
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

  // Approve student: mark profile as completed and verified
  async approveStudent(id: string): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .update({
        is_completed: true,
        status: "approved",
        status: "active",
      })
      .eq("id", id);
    if (error) throw error;
  },

  // Delete profile (for rejection of students or institutions)
  async deleteProfile(id: string): Promise<void> {
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) throw error;
  },

  // Compute stats
  async getStats(): Promise<AdminStats> {
    const { data, error } = await supabase.from("profiles").select("role, status, is_completed, status");
    if (error) throw error;

    const students = data.filter(p => p.role === "student");
    const companies = data.filter(p => p.role === "company_admin");
    const universities = data.filter(p => p.role === "university_admin");

    return {
      total: data.length,
      students: students.length,
      companies: companies.filter(c => c.status === "active").length,
      universities: universities.filter(u => u.status === "active").length,
      pendingUniversities: universities.filter(u => u.status === "pending").length,
      pendingCompanies: companies.filter(c => c.status === "pending").length,
      pendingStudents: students.filter(s =>
        s.is_completed === false || s.status === "pending"
      ).length,
      rejected: data.filter(p => p.status === "rejected").length,
    };
  },
};