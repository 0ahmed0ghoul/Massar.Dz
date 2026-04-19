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
  
    if (error) {
      console.error("❌ SIGNUP ERROR:", error);
  
      const msg = error.message.toLowerCase();
  
      if (msg.includes("already registered") || msg.includes("duplicate")) {
        throw new Error("This email is already registered. Please login.");
      }
  
      throw new Error("Unable to create account. Please try again.");
    }
  
    if (!data.user) {
      throw new Error("User creation failed.");
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
  
  async markProfileCompleted(userId: string, additionalData: any, verificationDocs: any) {
    return this.updateProfile(userId, {
      profile_completed: true,
      verification_status: "pending",
      verification_docs: verificationDocs,
      completed_at: new Date().toISOString(),
      ...additionalData,
    });
  }

  // ─────────────────────────────────────────────
  // REGISTER (CLEAN & SAFE)
  // ─────────────────────────────────────────────

async registerUser(params: {
  email: string;
  password: string;
  role: RegisterRole;
  profile: any;
}) {
  const cleanEmail = params.email.trim().toLowerCase();
  const user = await this.signUp(cleanEmail, params.password);

  const profileData = {
    id: user.id,
    email: cleanEmail,
    role: params.role,
    status: params.role === "student" ? "active" : "pending",
    profile_completed: false,               // 👈 NEW
    verification_status: null,              // 👈 NEW
    first_name: params.profile.firstName ?? null,
    last_name: params.profile.lastName ?? null,
    degree_level: params.profile.degreeLevel ?? null,
    company_name: params.profile.companyName ?? null,
    industry: params.profile.industry ?? null,
    university_name: params.profile.universityName ?? null,
    city: params.profile.city ?? null,
  };

  const { error: profileError } = await supabase
    .from("profiles")
    .insert(profileData);

  if (profileError) {
    console.error("Profile insert error:", profileError);
    throw new Error("Account created but profile setup failed. Please contact support.");
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