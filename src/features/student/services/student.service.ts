import { Profile } from "@/domain/profile.types";
import { supabase } from "@/lib/supabaseClient";
import type { User, Session } from "@supabase/supabase-js";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type RegisterRole =
  | "student"
  | "company_admin"
  | "university_admin"
  | "super_admin";

// ─────────────────────────────────────────────
// SERVICE
// ─────────────────────────────────────────────

class AuthService {
  // ─────────────────────────────────────────
  // AUTH
  // ─────────────────────────────────────────

  async signUp(params: {
    email: string;
    password: string;
    role: RegisterRole;
    profile: Partial<Profile>;
  }): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email: params.email,
      password: params.password,
      options: {
        data: {
          role: params.role,
          first_name: params.profile.first_name,
          last_name: params.profile.last_name,
          degreeLevel: params.profile.degree_level,
          companyName: params.profile.company_name,
          industry: params.profile.industry,
          universityName: params.profile.university_name,
          city: params.profile.city,
        },
      },
    });

    if (error) throw error;

    if (!data.user) {
      throw new Error("Signup failed: no user returned");
    }

    return data.user;
  }

  async signIn(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error("Login failed");

    return data.user;
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  // ─────────────────────────────────────────
  // SESSION
  // ─────────────────────────────────────────

  async getSession(): Promise<Session | null> {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }

  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  }

  // ─────────────────────────────────────────
  // PROFILE (TRIGGER-OWNED SOURCE OF TRUTH)
  // ─────────────────────────────────────────

  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.warn("Profile fetch warning:", error.message);
      return null;
    }

    return data;
  }

  async getCurrentProfile(): Promise<Profile | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;

    return this.getProfile(user.id);
  }

  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error("No authenticated user");

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // ─────────────────────────────────────────
  // PASSWORD
  // ─────────────────────────────────────────

  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
  }

  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  }

  // ─────────────────────────────────────────
  // UTILS
  // ─────────────────────────────────────────

  onAuthStateChange(callback: (user: User | null) => void) {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });

    return data.subscription;
  }
}

export const authService = new AuthService();