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
}

export interface AdminStats {
  total: number;
  students: number;
  companies: number;
  universities: number;
  pendingUniversities: number;
  pendingCompanies: number;
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

  // Fetch pending profiles (status = pending and role in pending_university, company_admin)
  async getPendingProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("status", "pending")
      .in("role", ["pending_university", "company_admin"])
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Profile[];
  },

  // Update profile status
  async updateStatus(id: string, status: string): Promise<void> {
    const { error } = await supabase.from("profiles").update({ status }).eq("id", id);
    if (error) throw error;
  },

  // Update profile role + status (for approval)
  async approvePending(id: string, newRole: string): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole, status: "active" })
      .eq("id", id);
    if (error) throw error;
  },

  // Delete profile
  async deleteProfile(id: string): Promise<void> {
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) throw error;
  },

  // Compute stats from profiles array (or fetch directly)
  async getStats(): Promise<AdminStats> {
    const { data, error } = await supabase.from("profiles").select("role, status");
    if (error) throw error;

    return {
      total: data.length,
      students: data.filter((p) => p.role === "student").length,
      companies: data.filter((p) => p.role === "company_admin" && p.status === "active").length,
      universities: data.filter((p) => p.role === "university_admin").length,
      pendingUniversities: data.filter((p) => p.role === "pending_university" && p.status === "pending").length,
      pendingCompanies: data.filter((p) => p.role === "company_admin" && p.status === "pending").length,
      rejected: data.filter((p) => p.status === "rejected").length,
    };
  },
};