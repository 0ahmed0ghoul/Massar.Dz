export const ROLES = {
    STUDENT: "student",
    COMPANY: "company_admin",
    UNIVERSITY: "university_admin",
    ADMIN: "super_admin",
  } as const;
  
  export type Role = typeof ROLES[keyof typeof ROLES];
  
  // 🔥 runtime validator (VERY IMPORTANT)
  export const isRole = (role: any): role is Role => {
    return Object.values(ROLES).includes(role);
  };