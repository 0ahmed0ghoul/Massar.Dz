// features/admin/constants/admin.constants.ts
import { GraduationCap, Building2, School, Clock, Users } from "lucide-react";

export const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  student: { label: "Student", color: "#00A550", bg: "rgba(0,165,80,0.1)", icon: GraduationCap },
  company_admin: { label: "Company", color: "#8B5CF6", bg: "rgba(139,92,246,0.1)", icon: Building2 },
  university_admin: { label: "University", color: "#E8A020", bg: "rgba(232,160,32,0.1)", icon: School },
  pending_university: { label: "Pending Uni", color: "#E8A020", bg: "rgba(232,160,32,0.08)", icon: Clock },
  super_admin: { label: "Admin", color: "#EF4444", bg: "rgba(239,68,68,0.1)", icon: Users },
};

export const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "#00A550" },
  pending: { label: "Pending", color: "#E8A020" },
  rejected: { label: "Rejected", color: "#EF4444" },
};

export type RoleFilter = "all" | "student" | "company_admin" | "university_admin" | "pending_university";
export type StatusFilter = "all" | "active" | "pending" | "rejected";
export type PendingFilter = "all" | "pending_university" | "company_admin";