// types/auth.types.ts
import { Profile, UserRole } from "@/domain/profile.types";
import type { User } from "@supabase/supabase-js";

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Approval flow helpers
  isProfileComplete: boolean;      // registration_step === "complete"
  isPendingApproval: boolean;      // registration_step === "pending_approval"
  needsProfileCompletion: boolean; // registration_step === "pending_profile"
  isApproved: boolean;             // registration_step === "approved" (for company/university)

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