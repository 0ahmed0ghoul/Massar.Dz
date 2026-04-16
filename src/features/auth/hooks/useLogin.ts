import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { authService } from "../service/auth.service";

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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.log("LOGIN ERROR:", error);
        throw error;
      }
  
      const user = data.user;
      if (!user) throw new Error("No user returned");
  
      let profile = await authService.fetchProfile(user.id);
  
      if (!profile) {
        await new Promise((r) => setTimeout(r, 1000));
        profile = await authService.fetchProfile(user.id);
      }
  
      if (!profile) throw new Error("Profile not found");
  
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
  
      handleRedirect(profile.role); // ✅ now correct
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err.message,
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