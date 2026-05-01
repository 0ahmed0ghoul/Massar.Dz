// contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthContextType, AuthState } from "../types/auth.types";
import { authService } from "../service/auth.service";
import { UserRole } from "@/constants/roles";
import { Profile } from "@/domain/profile.types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    authLoading: true,
    profileLoading: true,
  });

  // ─────────────────────────────────────────────────────────────
  // Derived values
  // ─────────────────────────────────────────────────────────────
  const role = useMemo<UserRole | null>(() => state.profile?.role as UserRole || null, [state.profile]);
  const isLoading = state.authLoading || state.profileLoading;
  const isAuthenticated = !!state.user;

  // Registration / approval status helpers
  const isProfileComplete = state.profile?.registration_step === "complete";
  const isPendingApproval  = state.profile?.registration_step === "pending_approval";
  const needsProfileCompletion = state.profile?.registration_step === "pending_profile";
  const isApproved = state.profile?.registration_step === "approved";

  // ─────────────────────────────────────────────────────────────
  // Load profile with retry
  // ─────────────────────────────────────────────────────────────
  const loadProfileWithRetry = async (userId: string): Promise<Profile | null> => {
    for (let i = 0; i < 5; i++) {
      const profile = await authService.fetchProfile(userId);
      if (profile) return profile;
      await new Promise((res) => setTimeout(res, 300));
    }
    return null;
  };

  // ─────────────────────────────────────────────────────────────
  // Initialisation & auth state listener
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      setState((prev) => ({ ...prev, authLoading: true, profileLoading: true }));
      const user = await authService.getCurrentUser();

      if (!mounted) {
        setState({ user: null, profile: null, authLoading: false, profileLoading: false });
        return;
      }

      if (!user) {
        setState({ user: null, profile: null, authLoading: false, profileLoading: false });
        return;
      }

      const profile = await loadProfileWithRetry(user.id);
      if (mounted) {
        setState({
          user,
          profile,
          authLoading: false,
          profileLoading: false,
        });
      }
    };

    init();

    const subscription = authService.onAuthStateChange(async (user) => {
      if (!mounted) return;

      if (!user) {
        setState({ user: null, profile: null, authLoading: false, profileLoading: false });
        return;
      }

      const profile = await loadProfileWithRetry(user.id);
      if (mounted) {
        setState({ user, profile, authLoading: false, profileLoading: false });
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Actions
  // ─────────────────────────────────────────────────────────────
  const signIn = async (email: string, password: string) => {
    await authService.signIn(email, password);
  };

  const signUp = async (email: string, password: string, profileData: Partial<Profile>) => {
    // Pass the whole profileData (including role, university/company fields, etc.)
    await authService.signUp(email, password, profileData);
  };

  const signOut = async () => {
    await authService.signOut();
    setState({ user: null, profile: null, authLoading: false, profileLoading: false });
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!state.user) throw new Error("No user logged in");
    const updatedProfile = await authService.updateProfile(state.user.id, updates);
    if (updatedProfile) {
      setState((prev) => ({ ...prev, profile: updatedProfile }));
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Complete profile (for company/university after email verification)
  // ─────────────────────────────────────────────────────────────
  const completeProfile = async (additionalData: any, fileUrls?: { logo?: string; certificate?: string }) => {
    if (!state.user) throw new Error("No user logged in");

    const updates = {
      ...additionalData,
      logo_url: fileUrls?.logo || null,
      certificate_url: fileUrls?.certificate || null,
      registration_step: "pending_approval",
    };
    await updateProfile(updates);
  };

  // ─────────────────────────────────────────────────────────────
  // Context value
  // ─────────────────────────────────────────────────────────────
  const value: AuthContextType = {
    user: state.user,
    profile: state.profile,
    role,
    isLoading,
    isAuthenticated,
    isProfileComplete,
    isPendingApproval,
    needsProfileCompletion,
    isApproved,
    signIn,
    signUp,
    signOut,
    updateProfile,
    completeProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};