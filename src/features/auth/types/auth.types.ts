// types/auth.types.ts
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types/supabase";
import type { Role } from "@/constants/roles";

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  role: Role | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<Profile>) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  authLoading: boolean;
  profileLoading: boolean;
}