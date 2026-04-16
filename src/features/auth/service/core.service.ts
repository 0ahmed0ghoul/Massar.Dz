import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { Profile } from "@/domain/profile.types";

class AuthCoreService {
  // ── AUTH ───────────────────────────────────

  async signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
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

export const authCoreService = new AuthCoreService();