import { NavigateFunction } from "react-router-dom";
import { Profile } from "@/domain/profile.types";
import { ROLES } from "@/constants/roles";

export const redirectByProfile = (
  navigate: NavigateFunction,
  profile: Profile
) => {
  // 🔥 PRIORITY: pending users
  if (profile.status === "pending") {
    navigate("/pending-approval");
    return;
  }

  switch (profile.role) {
    case ROLES.STUDENT:
      navigate("/student/dashboard");
      break;

    case ROLES.COMPANY_ADMIN:
      navigate("/dashboard/company");
      break;

    case ROLES.UNIVERSITY_ADMIN:
      navigate("/university/dashboard");
      break;

    case ROLES.SUPER_ADMIN:
      navigate("/dashboard/admin");
      break;

    default:
      navigate("/");
  }
};