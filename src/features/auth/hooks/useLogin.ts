import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { authCoreService } from "../service";

export const useLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  // ─────────────────────────────────────────
  // LOGIN WITH EMAIL/PASSWORD
  // ─────────────────────────────────────────

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      // 1. Sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Email not confirmed
        if (error.message.includes("Email not confirmed")) {
          await supabase.auth.resend({
            type: "signup",
            email,
          });

          throw new Error(
            "Email not verified. We sent you a new confirmation email."
          );
        }

        throw error;
      }

      const user = data.user;
      if (!user) throw new Error("No user returned");

      // 2. Fetch profile (important)
      const profile = await authCoreService.fetchProfile(user.id);

      if (!profile) {
        // profile not ready yet → small delay retry
        await new Promise((res) => setTimeout(res, 500));

        const retryProfile = await authCoreService.fetchProfile(user.id);

        if (!retryProfile) {
          throw new Error("Profile not ready. Please try again.");
        }

        handleRedirect(retryProfile.role);
        return;
      }

      // 3. Redirect based on role
      handleRedirect(profile.role);

      toast({
        title: "Success!",
        description: "Logged in successfully",
      });
    } catch (err: any) {
      toast({
        title: "Login failed",
        description:
          err.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // GOOGLE LOGIN
  // ─────────────────────────────────────────

  const loginWithGoogle = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      toast({
        title: "Google Login Failed",
        description: err.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // REDIRECT LOGIC (CENTRALIZED)
  // ─────────────────────────────────────────

  const handleRedirect = (role: string) => {
    switch (role) {
      case "student":
        navigate("/dashboard/student");
        break;

      case "company_admin":
      case "pending_university":
        navigate("/pending-approval");
        break;

      case "university_admin":
        navigate("/dashboard/university");
        break;

      case "super_admin":
        navigate("/dashboard/admin");
        break;

      default:
        navigate("/");
    }
  };

  return {
    login,
    loginWithGoogle,
    isLoading,
  };
};