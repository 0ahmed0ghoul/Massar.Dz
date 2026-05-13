// domain/types.ts
import type { Tables } from "@/types/database";

export interface ProfileFormProps {
  profile: any;
  saving: boolean;
  uploadingAvatar?: boolean;
  uploadingCV?: boolean;
  uploadingStudentCard?: boolean;
  updateProfile: (updates: any) => Promise<void>;
  uploadAvatar?: (file: File) => Promise<string | null>;
  deleteAvatar?: () => Promise<void>;
  uploadCV?: (file: File) => Promise<string | null>;
  deleteCV?: () => Promise<void>;
  uploadStudentCard?: (file: File) => Promise<string | null>;
  deleteStudentCard?: () => Promise<void>;
}

export interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "completed" | "current" | "pending" | "locked";
}

export interface ProfileCompletionJourneyProps {
  steps: Step[];
}
export interface UniversityConnectionCardProps {
  profile: StudentProfile;
  onRequestConnection: () => Promise<void>;
  isRequesting?: boolean;
}

export interface RoleOption {
  role: UserRole;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: string;
}
// All possible user roles
export type UserRole =
  | "student"
  | "graduate"
  | "professional"
  | "company_admin"
  | "university_admin"
  | "super_admin";

// Registration flow steps
export type RegistrationStep = "pending_profile" | "complete" | "pending_approval" | "approved";

// Company types
export type CompanyType = "startup" | "private" | "government";

// What a professional is looking for
export type LookingFor = "internship" | "fulltime" | "parttime" | "freelance";

// Base profile from database (full table row)
export type ProfileDB = Tables<"profiles">;

export interface BaseProfile {
  id: string;
  email: string;
  role: UserRole;

  first_name: string | null;
  last_name: string | null;
  full_name?: string;

  avatar_url: string | null;

  status: string | null;
  created_at: string;
  updated_at: string;

  wilaya: string | null;

  phone: string | null;

  is_premium: boolean;
  stripe_customer_id?: string;

  is_completed?: boolean;
  is_verified?: boolean;
}

export interface StudentProfile extends BaseProfile {
  degree_level: string | null;
  university_name: string | null;
  department: string | null;
  graduation_year: string | null;

  speciality: string | null;
  speciality_type: "LMD" | "ING" | "PRO" | null;

  student_id: string | null;
  student_card_url: string | null;
  academic_year: string | null;

  role: string | null;
  current_company: string | null;
  years_of_experience: number | null;

  looking_for: LookingFor | null;

  skills: string[] | null;

  resume_url: string | null;

  university_connection_status: string;
}
export interface CompanyProfile extends BaseProfile {
  company_name: string | null;
  company_type: CompanyType | null;
  industry: string | null;

  company_description: string | null;
  company_size: string | null;
  company_culture: string | null;

  logo_url: string | null;
  website: string | null;

  certificate_url: string | null;

  rector_name: string | null;

  verification_docs: Record<string, any> | null;

  candidate_type: string | null;
}

export type Profile = StudentProfile | CompanyProfile;

export interface AdminStats {
  total: number;
  students: number;
  companies: number;
  universities: number;
  pendingUniversities: number;
  pendingCompanies: number;
  pendingStudents: number;
  rejected: number;
}
// Helper type for creating/updating a profile
export type ProfileInsert = Omit<Profile, "id" | "created_at" | "updated_at">;
export type ProfileUpdate = Partial<ProfileInsert>;