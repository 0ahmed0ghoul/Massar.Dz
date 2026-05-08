// pages/DashboardRedirectPage.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function DashboardRedirectPage() {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!user || !profile) {
      navigate("/login");
      return;
    }

    const { role, is_completed, is_verified } = profile;

    // Student
    if (role === "student") {
      if (!is_completed) {
        navigate("/complete-profile");
        return;
      }
      navigate("/student/dashboard");
      return;
    }

    // Company admin
    if (role === "company_admin") {
      if (!is_completed) {
        navigate("/complete-profile");
        return;
      }
      if (!is_verified) {
        navigate("/pending-approval");
        return;
      }
      navigate("/dashboard/company");
      return;
    }

    // University admin
    if (role === "university_admin") {
      if (!is_completed) {
        navigate("/complete-profile");
        return;
      }
      if (!is_verified) {
        navigate("/pending-approval");
        return;
      }
      navigate("/university/dashboard");
      return;
    }

    // Super admin
    if (role === "super_admin") {
      navigate("/dashboard/admin");
      return;
    }

    // Fallback
    navigate("/");
  }, [user, profile, isLoading, navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[#639922]" />
    </div>
  );
}