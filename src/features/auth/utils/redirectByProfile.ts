// src/features/auth/utils/redirectByProfile.ts
import { NavigateFunction } from "react-router-dom";
import { Profile } from "@/types/profile.types";

export function redirectByProfile(navigate: NavigateFunction, profile: Profile) {
  // Students – always go to student dashboard (they complete profile there)
  if (profile.role === "student") {
    navigate("/student/dashboard");
    return;
  }

  // Company admin
  if (profile.role === "company_admin") {
    if (!profile.is_completed) {
      navigate("/complete-profile");
      return;
    }
    if (profile.is_completed && !profile.is_verified) {
      navigate("/pending-approval");
      return;
    }
    if (profile.is_completed && profile.is_verified) {
      navigate("/dashboard/company");
      return;
    }
    navigate("/dashboard/company");
    return;
  }

  // University admin
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

  // Fallback
  navigate("/");
}