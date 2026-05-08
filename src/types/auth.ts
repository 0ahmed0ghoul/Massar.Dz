
export type VerificationStatus = "pending" | "approved" | "rejected" | null;
export type CompanyType = "startup" | "private" | "government";

export interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  degreeLevel: string;
  university?: string;
  department?: string;
  graduationYear?: string;
}

export interface GraduateFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  graduationYear: string;
  university: string;
  degree: string;
  speciality: string;
  skills?: string[];
}

export interface ProfessionalFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  currentRole: string;
  company: string;
  yearsOfExperience: string;
  skills?: string[];
  lookingFor: "internship" | "fulltime" | "parttime" | "freelance";
}

// In the hook or separate types file
export interface CompanyFormData {
  firstName: string;
  lastName: string;
  wilaya: string;
  companyName: string;
  industry: string;
  companyDescription: string;
  companyType?: string;
  email?: string;
}

export interface UniversityFormData {
  universityName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  department: string;
  position: string;
  wilaya: string;
  rectorName: string;
  website: string;
}

export type RegisterRole = "student" | "graduate" | "professional" | "company_admin" | "university_admin" | "super_admin";
// types/auth.types.ts
import { Profile, UserRole } from "@/types/profile.types";
import type { User } from "@supabase/supabase-js";

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Approval flow helpers (based on is_completed and is_verified columns)
  isProfileComplete: boolean;      // For UI: true for students; for others, is_completed === true
  isPendingApproval: boolean;      // Company/university: is_completed === true && is_verified !== true
  needsProfileCompletion: boolean; // Company/university: is_completed !== true
  isApproved: boolean;             // Students: true always; Company/university: is_completed === true && is_verified === true

  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<Profile>) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  completeProfile: (additionalData: any, fileUrls?: { logo?: string; certificate?: string }) => Promise<void>;
}

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  authLoading: boolean;
  profileLoading: boolean;
}