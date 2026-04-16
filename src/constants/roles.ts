export const ROLES = [
  "student",
  "company_admin",
  "pending_university",
  "university_admin",
  "super_admin",
] as const;

export type UserRole = (typeof ROLES)[number];