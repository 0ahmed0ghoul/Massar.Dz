// types/auth.types.ts
import { Profile, UserRole } from "@/domain/profile.types";
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