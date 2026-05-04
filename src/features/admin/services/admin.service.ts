// features/admin/services/admin.service.ts
import { supabase } from "@/lib/supabaseClient";
import { AdminStats, Profile } from "../types/verification.types";

export const adminService = {
  async getProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: string): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .update({ status })
      .eq("id", id);
    if (error) throw error;
  },

  async deleteProfile(id: string): Promise<void> {
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) throw error;
  },

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