import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { supabaseAuth } from "@/lib/supabaseAuth";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types/supabase";
import type { Role } from "@/constants/roles";

interface AuthContextType {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // Derived role (SAFE)
  const role = useMemo<Role | null>(() => {
    return (profile?.role as Role) ?? null;
  }, [profile]);

  const isLoading = authLoading || profileLoading;
  const isAuthenticated = !!user;

  // -----------------------------
  // FETCH PROFILE
  // -----------------------------
  const fetchProfile = async (userId: string) => {
    setProfileLoading(true);
  
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle(); // 🔥 FIX: prevents hard crash
  
      if (error) throw error;
  
      setProfile(data ?? null);
    } catch (err) {
      console.error("fetchProfile error:", err);
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  // -----------------------------
  // INIT AUTH (SENIOR PATTERN)
  // -----------------------------
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      setAuthLoading(true);

      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user ?? null;

      if (!mounted) return;

      setUser(sessionUser);

      if (sessionUser) {
        await fetchProfile(sessionUser.id);
      } else {
        setProfile(null);
      }

      if (mounted) setAuthLoading(false);
      };

    init();

    // 🔥 REALTIME AUTH LISTENER (SOURCE OF TRUTH)
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange(async (_event, session) => {
        const sessionUser = session?.user ?? null;

        setUser(sessionUser);

        if (sessionUser) {
          await fetchProfile(sessionUser.id);
        } else {
          setProfile(null);
        }

        setAuthLoading(false);
      });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // -----------------------------
  // AUTH ACTIONS
  // -----------------------------
  const signIn = async (email: string, password: string) => {
    await supabaseAuth.signIn(email, password);
  };

  const signUp = async (
    email: string,
    password: string,
    userData: Partial<Profile>
  ) => {
    await supabaseAuth.signUp(email, password, userData);
  };

  const signOut = async () => {
    await supabaseAuth.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    const updated = await supabaseAuth.updateProfile(updates);
    setProfile(updated);
  };

  // -----------------------------
  // CONTEXT VALUE
  // -----------------------------
  const value: AuthContextType = {
    user,
    profile,
    role,

    isLoading,
    isAuthenticated,

    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};