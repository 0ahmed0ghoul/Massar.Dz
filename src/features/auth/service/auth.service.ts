import { Profile } from "@/domain/profile.types";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

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

type RegisterRole =
  | "student"
  | "company_admin"
  | "university_admin"
  | "super_admin";

// ─────────────────────────────────────────────
// SERVICE
// ─────────────────────────────────────────────

class AuthService {
  // ── AUTH ───────────────────────────────────

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data.user;
  }

  async signUp(email: string, password: string) {
    const cleanEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
    });

    if (error) throw error;

    if (!data.user) {
      throw new Error("User creation failed");
    }

    return data.user;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser(): Promise<User | null> {
    const { data } = await supabase.auth.getUser();
    return data.user ?? null;
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });

    return data.subscription;
  }

  // ─────────────────────────────────────────────
  // PROFILE
  // ─────────────────────────────────────────────

  async fetchProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.warn("Profile fetch error:", error.message);
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

  // ─────────────────────────────────────────────
  // REGISTER (CLEAN & SAFE)
  // ─────────────────────────────────────────────

// service/auth.service.ts  — registerUser only, everything else unchanged

async registerUser(params: {
  email: string;
  password: string;
  role: RegisterRole;
  profile: any;
}) {
  // 1. Create the auth user
  const user = await this.signUp(params.email, params.password);

  // 2. Build the profile row (all optional fields default to null)
  const profileData = {
    id:              user.id,
    email:           params.email.trim().toLowerCase(),
    role:            params.role,
    status:          params.role === "student" ? "active" : "pending",
    first_name:      params.profile.firstName      ?? null,
    last_name:       params.profile.lastName       ?? null,
    degree_level:    params.profile.degreeLevel    ?? null,
    company_name:    params.profile.companyName    ?? null,
    industry:        params.profile.industry       ?? null,
    university_name: params.profile.universityName ?? null,
    city:            params.profile.city           ?? null,
  };

  // 3. Insert — this is what was missing before
  const { error: profileError } = await supabase
    .from("profiles")
    .insert(profileData);

  if (profileError) {
    // Auth user was created but profile failed — attempt cleanup
    await supabase.auth.admin.deleteUser(user.id).catch(() => null);
    throw profileError;
  }

  return user;
}
  // ─────────────────────────────────────────────
  // UTILS
  // ─────────────────────────────────────────────

  async checkEmailExists(email: string): Promise<boolean> {
    const { data } = await supabase
      .from("profiles")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    return !!data;
  }

  async sendVerificationEmail(email: string, code: string): Promise<boolean> {
    console.log("📧 MOCK EMAIL SENT");
    console.log("To:", email);
    console.log("Code:", code);

    await new Promise((r) => setTimeout(r, 800));
    return true;
  }
}

export const authService = new AuthService();