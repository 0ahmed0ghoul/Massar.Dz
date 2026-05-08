import { Profile } from "@/types/profile.types";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { RegisterRole } from "@/types/auth";

class AuthService {
  // ───────────────────────── AUTH ─────────────────────────

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    // 🔥 FORCE SESSION SYNC
    await supabase.auth.getSession();
    await supabase.auth.getUser();
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

    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      email: cleanEmail,
      role: profileData.role,
      candidate_type: profileData.candidate_type || null,
      university_connection_status: "none",
      status: "pending",
      is_completed: false,
      is_verified: false,
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
      student_id: profileData.student_id || null,
    });

    if (profileError) {
      console.error("Profile insert error:", profileError);
      throw new Error(
        "Account created but profile setup failed. Please contact support."
      );
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

  // ───────────────────────── COMPLETE PROFILE ─────────────────────────

  async markProfileCompleted(
    userId: string,
    additionalData: any,
    verificationDocs: any,
    logoUrl?: string
  ) {
    const updates: any = {
      ...additionalData,
      verification_docs: verificationDocs,
      is_completed: true,
      completed_at: new Date().toISOString(),
    };

    // IMPORTANT: avatar goes ONLY here
    if (logoUrl) {
      updates.avatar_url = logoUrl;

      // remove duplicated logo inside docs
      if (updates.verification_docs?.logo) {
        delete updates.verification_docs.logo;
      }
    }

    return this.updateProfile(userId, updates);
  }

  // ───────────────────────── STORAGE ─────────────────────────

  // Inside AuthService class
async uploadCompanyLogo(userId: string, file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/logo_${Date.now()}.${fileExt}`;
  const filePath = `company-logos/${fileName}`;

  // Make sure bucket "company-files" exists; otherwise create it via Supabase storage
  const { error: uploadError } = await supabase.storage
    .from("company-files")
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from("company-files").getPublicUrl(filePath);
  if (!data?.publicUrl) throw new Error("Failed to generate public URL");

  return data.publicUrl;
}

  async uploadUniversityLogo(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/logo_${Date.now()}.${fileExt}`;
    const filePath = `university-logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("university-files")
      .upload(filePath, file, {
        upsert: true,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage
      .from("university-files")
      .getPublicUrl(filePath);

    if (!data?.publicUrl) {
      throw new Error("Failed to generate public URL");
    }

    // IMPORTANT: save in avatar_url immediately
    await this.updateProfile(userId, {
      avatar_url: data.publicUrl,
    });

    return data.publicUrl;
  }

  // ───────────────────────── ADMIN ─────────────────────────

  async approveCompanyUniversity(userId: string) {
    return this.updateProfile(userId, {
      is_verified: true,
      status: "active",
    });
  }

  // ───────────────────────── REGISTER ─────────────────────────

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

    if (params.role === "student") {
      profileData.candidate_type = params.profile.candidateType;
      profileData.degree_level = params.profile.degreeLevel;
      profileData.university_name = params.profile.university;
      profileData.department = params.profile.department;
      profileData.graduation_year = params.profile.graduationYear;
      profileData.speciality = params.profile.speciality;
      profileData.student_id = params.profile.studentId || null;
      profileData.skills = params.profile.skills;
      profileData.wilaya = params.profile.wilaya || null;
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

  // ───────────────────────── UTILS ─────────────────────────

  async checkStudentIdExists(studentId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("student_id", studentId.trim())
      .maybeSingle();

    if (error) {
      console.error("Student ID check error:", error);
      return false;
    }

    return !!data;
  }

  async getCurrentStudentType(
    userId: string
  ): Promise<"studying" | "graduated" | "self_taught" | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("candidate_type")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data) return null;
    return data.candidate_type as any;
  }

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

  async getVerifiedUniversities(): Promise<{ id: string; name: string }[]> {
    try {
      const { data, error } = await supabase.rpc("get_verified_universities");

      if (error) throw error;

      return (data || []).map((u: any) => ({
        id: u.id,
        name: u.university_name,
      }));
    } catch (error) {
      console.error("Error fetching verified universities:", error);
      return [];
    }
  }

  async getUniversityDepartments(universityName: string): Promise<string[]> {
    if (!universityName) return [];

    const { data, error } = await supabase
      .from("profiles")
      .select("department")
      .eq("role", "university_admin")
      .eq("university_name", universityName)
      .not("department", "is", null);

    if (error) {
      console.error("Error fetching departments:", error);
      return [];
    }

    return [...new Set(data.map((d) => d.department).filter(Boolean))];
  }
}

export const authService = new AuthService();
