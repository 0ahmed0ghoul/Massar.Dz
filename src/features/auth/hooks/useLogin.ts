// hooks/useLogin.ts
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { authService } from "../service/auth.service";
import { redirectByProfile } from "@/utils/redirectByProfile";
import type { Profile } from "@/domain/profile.types";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchProfileWithRetry(
  userId: string,
  retries = 2,
  delayMs = 1200
): Promise<Profile | null> {
  for (let i = 0; i < retries; i++) {
    const profile = await authService.fetchProfile(userId);
    if (profile) return profile;
    if (i < retries - 1) await sleep(delayMs);
  }
  return null;
}

export const useLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isSubmittingRef = useRef(false);

  const login = async (email: string, password: string) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      const user = data.user;
      if (!user) throw new Error("No user returned from auth");

      // Profile is written async by a DB trigger — retry once
      const profile = await fetchProfileWithRetry(user.id);
      if (!profile) {
        throw new Error("Profile not found. Please contact support.");
      }

      toast({ title: "Welcome back!", description: "Logged in successfully." });
      redirectByProfile(navigate, profile);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      toast({ title: "Login failed", description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return { login, isLoading };
};