// src/features/auth/utils/redirectByProfile.ts
import type { NavigateFunction } from "react-router-dom";
import type { Profile } from "@/domain/profile.types";

export function redirectByProfile(navigate: NavigateFunction, profile: Profile) {
  // Any non-active account goes to the waiting room regardless of role
  if (profile.status === "pending") {
    navigate("/pending-approval");
    return;
  }

  switch (profile.role) {
    case "student":
      navigate("/student/dashboard");
      break;
    case "company_admin":
      navigate("/dashboard/company");
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
}