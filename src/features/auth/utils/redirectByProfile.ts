// src/features/auth/utils/redirectByProfile.ts
import { NavigateFunction } from "react-router-dom";
import { Profile } from "@/types/profile.types";

export function redirectByProfile(navigate: NavigateFunction, profile: Profile) {
  // Students / graduates / professionals – immediate dashboard (always approved)
  if (profile.role === "student" || profile.role === "graduate" || profile.role === "professional") {
    navigate("/student/dashboard");
    return;
  }

  // Company
  if (profile.role === "company_admin") {
    if (!profile.is_completed) {
      // Hasn't completed the profile form yet
      navigate("/complete-profile");
      return;
    }
    if (profile.is_completed && !profile.is_verified) {
      // Profile submitted, waiting for admin review
      navigate("/pending-approval");
      return;
    }
    if (profile.is_completed && profile.is_verified) {
      // Admin approved – full access
      navigate("/dashboard/company");
      return;
    }
    // Fallback
    navigate("/dashboard/company");
    return;
  }

  // University
  if (profile.role === "university_admin") {
    if (!profile.is_completed) {
      navigate("/complete-profile");
      return;
    }
    if (profile.is_completed && !profile.is_verified) {
      navigate("/pending-approval");
      return;
    }
    if (profile.is_completed && profile.is_verified) {
      navigate("/university/dashboard");
      return;
    }
    navigate("/university/dashboard");
    return;
  }

  // Super admin
  if (profile.role === "super_admin") {
    navigate("/dashboard/admin");
    return;
  }

  // Default fallback
  navigate("/");
}