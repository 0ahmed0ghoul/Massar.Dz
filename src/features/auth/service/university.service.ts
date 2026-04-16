import { supabase } from "@/lib/supabaseClient";

export interface UniversityFormData {
  universityName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  city: string;
}

class UniversityAuthService {
  async register(data: UniversityFormData) {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          university_name: data.universityName,
          city: data.city,
        },
      },
    });

    if (error) throw error;
  }
}

export const universityAuthService = new UniversityAuthService();