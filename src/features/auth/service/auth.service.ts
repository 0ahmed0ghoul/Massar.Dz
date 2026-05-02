import { Profile } from "@/domain/profile.types";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

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

export interface CompanyFormData {
  companyName: string;
  companyType: CompanyType;
  firstName: string;
  lastName: string;
  email: string;
  industry: string;
  registrationNumber?: string;
  wilaya: string;
  companyDescription: string;
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

type RegisterRole = "student" | "graduate" | "professional" | "company_admin" | "university_admin" | "super_admin";

// ─────────────────────────────────────────────
// SERVICE
// ─────────────────────────────────────────────

class AuthService {
  // ── AUTH ───────────────────────────────────

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data.user;
  }

  async signUp(email: string, password: string, profileData: Partial<Profile>) {
    const cleanEmail = email.trim().toLowerCase();

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          role: profileData.role,
          full_name: profileData.full_name,
        },
      },
    });

    if (signUpError) {
      const msg = signUpError.message.toLowerCase();
      if (msg.includes("already registered") || msg.includes("duplicate")) {
        throw new Error("This email is already registered. Please login.");
      }
      throw new Error("Unable to create account. Please try again.");
    }

    if (!authData.user) throw new Error("User creation failed.");

    // Determine initial is_completed based on role (students are automatically "completed" for access, but we set false)
    // For students, is_completed = false initially (they can still access dashboard via AuthContext logic).
    // For companies/universities, is_completed = false, is_verified = false.
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      email: cleanEmail,
      role: profileData.role,
      candidate_type: profileData.candidate_type || null,
      university_connection_status: false,
      status: "pending",
      is_completed: false,               // initially false for all
      is_verified: false,                // initially false for all
      first_name: profileData.first_name || null,
      last_name: profileData.last_name || null,
      degree_level: profileData.degree_level || null,
      university_name: profileData.university_name || null,
      department: profileData.department || null,
      company_name: profileData.company_name || null,
      company_type: profileData.company_type || null,
      industry: profileData.industry || null,
      wilaya: profileData.wilaya || null,
      position: profileData.position || null,
      graduation_year: profileData.graduation_year || null,
      speciality: profileData.speciality || null,
      years_of_experience: profileData.years_of_experience || null,
      looking_for: profileData.looking_for || null,
      skills: profileData.skills || null,
    });

    if (profileError) {
      console.error("Profile insert error:", profileError);
      throw new Error("Account created but profile setup failed. Please contact support.");
    }

    return authData.user;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser(): Promise<User | null> {
    const { data } = await supabase.auth.getUser();
    return data.user ?? null;
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
    return data.subscription;
  }

  // ─────────────────────────────────────────────
  // PROFILE
  // ─────────────────────────────────────────────

  async fetchProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.warn("Profile fetch error:", error.message);
      return null;
    }
    return data ?? null;
  }

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // ─────────────────────────────────────────────
  // MARK PROFILE COMPLETED (used by Company/University after filling)
  // ─────────────────────────────────────────────
  async markProfileCompleted(userId: string, additionalData: any, verificationDocs: any) {
    const updates: any = {
      ...additionalData,
      verification_docs: verificationDocs,
      is_completed: true,
      completed_at: new Date().toISOString(),
    };
    return this.updateProfile(userId, updates);
  }

  // ─────────────────────────────────────────────
  // ADMIN ACTIONS
  // ─────────────────────────────────────────────
  async approveCompanyUniversity(userId: string) {
    return this.updateProfile(userId, { is_verified: true, status: "active" });
  }

  // ─────────────────────────────────────────────
  // REGISTER (COMPATIBLE WITH useRegister)
  // ─────────────────────────────────────────────
  async registerUser(params: {
    email: string;
    password: string;
    role: RegisterRole;
    profile: any;
  }) {
    const profileData: Partial<Profile> = {
      role: params.role,
      first_name: params.profile.firstName ?? null,
      last_name: params.profile.lastName ?? null,
      email: params.email,
    };

    // Role-specific fields
    if (params.role === "student") {
      profileData.candidate_type = params.profile.candidateType;
      profileData.degree_level = params.profile.degreeLevel;
      profileData.university_name = params.profile.university;
      profileData.department = params.profile.department;
      profileData.graduation_year = params.profile.graduationYear;
      profileData.speciality = params.profile.speciality;
      profileData.skills = params.profile.skills;
    } else if (params.role === "graduate") {
      profileData.candidate_type = params.profile.candidateType;
      profileData.graduation_year = params.profile.graduationYear;
      profileData.university_name = params.profile.university;
      profileData.degree_level = params.profile.degree;
      profileData.speciality = params.profile.speciality;
      profileData.skills = params.profile.skills;
    } else if (params.role === "professional") {
      profileData.candidate_type = params.profile.candidateType;
      profileData.current_role = params.profile.currentRole;
      profileData.current_company = params.profile.company;
      profileData.years_of_experience = params.profile.yearsOfExperience;
      profileData.skills = params.profile.skills;
      profileData.looking_for = params.profile.lookingFor;
    } else if (params.role === "company_admin") {
      profileData.company_name = params.profile.companyName;
      profileData.company_type = params.profile.companyType;
      profileData.industry = params.profile.industry;
      profileData.wilaya = params.profile.location;
    } else if (params.role === "university_admin") {
      profileData.university_name = params.profile.universityName;
      profileData.department = params.profile.department;
      profileData.position = params.profile.position;
      profileData.wilaya = params.profile.wilaya;
    }

    return this.signUp(params.email, params.password, profileData);
  }

  // ─────────────────────────────────────────────
  // UTILS
  // ─────────────────────────────────────────────
  async checkEmailExists(email: string): Promise<boolean> {
    const { data } = await supabase
      .from("profiles")
      .select("email")
      .eq("email", email)
      .maybeSingle();
    return !!data;
  }

  async sendVerificationEmail(email: string, code: string): Promise<boolean> {
    console.log("📧 MOCK EMAIL SENT");
    console.log("To:", email);
    console.log("Code:", code);
    await new Promise((r) => setTimeout(r, 800));
    return true;
  }
}

export const authService = new AuthService();