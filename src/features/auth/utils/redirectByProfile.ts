// src/features/auth/utils/redirectByProfile.ts
import { NavigateFunction } from "react-router-dom";
import { Profile } from "@/domain/profile.types";

export function redirectByProfile(navigate: NavigateFunction, profile: Profile) {
  // 1. Students / graduates / professionals – immediate dashboard
  if (profile.role === "student" || profile.role === "graduate" || profile.role === "professional") {
    // For safety, they should have registration_step === "complete"
    navigate("/student/dashboard");
    return;
  }
  // 2. Company or University
  if (profile.role === "company_admin" || profile.role === "university_admin") {
    const step = profile.registration_step;
    if (step === "pending_profile") {
      // User hasn't completed the profile form yet
      navigate("/complete-profile");
      return;
    }
    if (step === "pending_approval") {
      // Profile submitted, waiting for admin review
      navigate("/pending-approval");
      return;
    }
    if (step === "approved") {
      // Admin approved – full access
      navigate("/dashboard");
      return;
    }
    // Fallback (should not happen)
    navigate("/dashboard");
    return;
  }
  // Super admin or other roles
  navigate("/dashboard/admin");
}