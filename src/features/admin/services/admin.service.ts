// features/admin/services/admin.service.ts
import { supabase } from "@/lib/supabaseClient";

export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  status?: string; // optional, for other statuses (active/inactive)
  university_name?: string;
  company_name?: string;
  industry?: string;
  degree_level?: string;
  wilaya?: string;
  created_at: string;
  is_completed?: boolean; // true after user completes profile
  is_verified?: boolean;  // true after admin approves company/university
}

export interface AdminStats {
  total: number;
  students: number;
  companies: number;
  universities: number;
  pendingUniversities: number; // completed but not verified
  pendingCompanies: number;    // completed but not verified
  pendingStudents: number;     // incomplete profiles
  rejected: number;            // optional, not used
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

  // Fetch pending institutions: completed profile but not yet verified
  async getPendingProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("is_completed", true)
      .eq("is_verified", false)
      .in("role", ["university_admin", "company_admin"])
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Profile[];
  },

  // Fetch pending students: incomplete profiles
  async getPendingStudents(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "student")
      .eq("is_completed", false)
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

  // For institutions: approve by setting is_verified = true
  async approvePending(id: string, newRole: string): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .update({ is_verified: true, status: "active" })
      .eq("id", id);
    if (error) throw error;
  },

  // For students: mark profile as completed (if desired)
  async approveStudent(id: string): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .update({ is_completed: true })
      .eq("id", id);
    if (error) throw error;
  },

  // Reject or delete a profile
  async deleteProfile(id: string): Promise<void> {
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) throw error;
  },

  // Compute statistics
  async getStats(): Promise<AdminStats> {
    const { data, error } = await supabase.from("profiles").select("role, is_completed, is_verified");
    if (error) throw error;

    const students = data.filter(p => p.role === "student");
    const companies = data.filter(p => p.role === "company_admin");
    const universities = data.filter(p => p.role === "university_admin");

    return {
      total: data.length,
      students: students.length,
      companies: companies.filter(c => c.is_verified === true).length,
      universities: universities.filter(u => u.is_verified === true).length,
      pendingUniversities: universities.filter(u => u.is_completed === true && u.is_verified !== true).length,
      pendingCompanies: companies.filter(c => c.is_completed === true && c.is_verified !== true).length,
      pendingStudents: students.filter(s => s.is_completed !== true).length,
      rejected: 0,
    };
  },
};