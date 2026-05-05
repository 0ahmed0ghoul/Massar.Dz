// domain/types.ts
import type { Tables } from "@/types/database";

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

// Frontend‑friendly Profile interface (includes all relevant fields)
export interface Profile {
  certificatee: any;
  // Core
  id: string;
  email: string;
  role: UserRole;
  first_name: string | null;
  last_name: string | null;
  full_name?: string; // derived from first_name + last_name
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  // Approval flow fields
  status: string | null;
  verification_docs: any; // JSONB
  completed_at: string | null;
  // Student / Graduate specific
  degree_level: string | null;        // bachelor, master, phd, bootcamp
  university_name: string | null;
  department: string | null;
  graduation_year: string | null;     // YYYY
  speciality: string | null;
  student_id: string | null;
  student_card_url: string | null;
  academic_year: string | null;
  speciality_type: "LMD" | "ING" | "PRO" | null;
  // Professional specific
  current_role: string | null;
  current_company: string | null;
  years_of_experience: number | null; // e.g., "5"
  looking_for: LookingFor | null;
  skills: string | null;               // comma‑separated or plain text

  // Company specific
  company_name: string | null;
  company_type: CompanyType | null;
  industry: string | null;
  company_description: string | null;
  logo_url: string | null;
  certificate_url: string | null;

  // University specific
  position: string | null;             // e.g. "Head of Department"
  rector_name: string | null;
  website: string | null;

  // Common location fields
  wilaya: string | null;

  // Subscription
  is_premium: boolean;
  stripe_customer_id?: string;

  // Other
  resume_url: string | null;
  phone: string | null;
  university_connection_status: string;
  is_completed?: boolean;
  is_verified?:boolean;
  candidate_type: string | null;
}

// Helper type for creating/updating a profile
export type ProfileInsert = Omit<Profile, "id" | "created_at" | "updated_at">;
export type ProfileUpdate = Partial<ProfileInsert>;