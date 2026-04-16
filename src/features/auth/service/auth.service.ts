import { Profile } from "@/domain/profile.types";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

// ─── Types ─────────────────────────────────────────────

export interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  degreeLevel: string;
}

export interface CompanyFormData {
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  industry: string;
}

export interface UniversityFormData {
  universityName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  city: string;
}
// ─────────────────────────────────────────────
// SERVICE
// ─────────────────────────────────────────────

class AuthService {
  // ── AUTH ───────────────────────────────────

  async signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }

  async signUp(email: string, password: string, meta?: any) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: meta,
      },
    });
    if (error) throw error;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  // ✅ SINGLE SOURCE OF TRUTH (FIXED)
  async getCurrentUser(): Promise<User | null> {
    const { data } = await supabase.auth.getUser();
    return data.user ?? null;
  }

  // ── AUTH LISTENER (FIXED) ───────────────────

  onAuthStateChange(callback: (user: User | null) => void) {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });

    return data.subscription;
  }

  // ── PROFILE ─────────────────────────────────

  async fetchProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
  
    if (error) {
      console.warn("Profile not ready yet:", error.message);
      return null;
    }
  
    return data ?? null;
  }

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // ── REGISTER FLOWS ─────────────────────────

  async registerStudent(data: any) {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          degree_level: data.degreeLevel,
        },
      },
    });

    if (error) throw error;
  }

  async registerCompany(data: any) {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          company_name: data.companyName,
          industry: data.industry,
        },
      },
    });

    if (error) throw error;
  }

  async registerUniversity(data: any) {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          university_name: data.universityName,
          city: data.city,
        },
      },
    });

    if (error) throw error;
  }

  // ── UTILITIES ──────────────────────────────

  async checkEmailExists(email: string): Promise<boolean> {
    const { data } = await supabase
      .from("profiles")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    return !!data;
  }

  async sendVerificationEmail(email: string, code: string): Promise<boolean> {
    const { error } = await supabase.functions.invoke(
      "send-verification-email",
      {
        body: { email, code },
      }
    );

    return !error;
  }
}

export const authService = new AuthService();