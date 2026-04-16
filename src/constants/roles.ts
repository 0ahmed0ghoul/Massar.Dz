export const ROLES = {
  STUDENT: "student",
  COMPANY_ADMIN: "company_admin",
  UNIVERSITY_ADMIN: "university_admin",
  SUPER_ADMIN: "super_admin",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];