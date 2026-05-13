// features/admin/constants/admin.constants.ts
import { GraduationCap, Building2, School, Clock, Users } from "lucide-react";

export const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  student: { label: "Student", color: "#00A550", bg: "rgba(0,165,80,0.1)", icon: GraduationCap },
  company_admin: { label: "Company", color: "#8B5CF6", bg: "rgba(139,92,246,0.1)", icon: Building2 },
  university_admin: { label: "University", color: "#E8A020", bg: "rgba(232,160,32,0.1)", icon: School },
  super_admin: { label: "Admin", color: "#EF4444", bg: "rgba(239,68,68,0.1)", icon: Users },
};

export const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "#00A550" },
  pending: { label: "Pending", color: "#E8A020" },
  rejected: { label: "Rejected", color: "#EF4444" },
};
// admin.constants.ts

export interface QAQuestion {
  id: string;
  text: string;
  type: "true_false" | "multiple_choice" | "numeric";
  options?: string[];
  part: number;
  condition?: {
    dependsOn: string;
    value: string;
  };
}

export const ADMIN_QUESTIONS: QAQuestion[] = [
  // Part 1: Current Status
  {
    id: "q1_professional_status",
    text: "Which of the following best describes your current professional situation?",
    type: "multiple_choice",
    options: [
      "In professional activity (Employed, self-employed, or internship)",
      "Actively looking for a job",
      "Continuing studies",
      "Other (Voluntary inactivity, travel, etc.)"
    ],
    part: 1
  },

  // Part 2: Role and Industry (only for those in professional activity)
  {
    id: "q2_sector",
    text: "In which sector of activity is your current employer?",
    type: "multiple_choice",
    options: [
      "Industry (Manufacturing, Aerospace, Automotive)",
      "Energy (Oil & Gas, Renewables, Utilities)",
      "Construction & Civil Engineering (BTP)",
      "Services (Consulting, Finance, Healthcare)",
      "Other"
    ],
    part: 2,
    condition: {
      dependsOn: "q1_professional_status",
      value: "In professional activity (Employed, self-employed, or internship)"
    }
  },
  {
    id: "q3_function",
    text: "What is the primary function of your current role?",
    type: "multiple_choice",
    options: [
      "Studies, Projects, and R&D",
      "Production, Methods, Development, or Maintenance",
      "Business Manager / Account Manager (Chargé d'affaires)",
      "Quality, Health, Safety, and Environment (QHSE)",
      "Information Technology (IT / Informatique)",
      "Other"
    ],
    part: 2,
    condition: {
      dependsOn: "q1_professional_status",
      value: "In professional activity (Employed, self-employed, or internship)"
    }
  },

  // Part 3: Compensation & Demographics
  {
    id: "q5_salary",
    text: "What is your total annual gross salary (including all bonuses and premiums)?",
    type: "numeric",
    part: 3
  }
];

export type RoleFilter = "all" | "student" | "professional"| "company_admin" | "university_admin" | "university_admin";
export type StatusFilter = "all" | "active" | "pending" | "rejected";
export type PendingFilter = "all" | "university_admin" | "company_admin" | "students";