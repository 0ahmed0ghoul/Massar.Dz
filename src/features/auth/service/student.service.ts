import { supabase } from "@/lib/supabaseClient";

export interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  degreeLevel: string;
}

class StudentAuthService {
  async register(data: StudentFormData) {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          degree_level: data.degreeLevel,
        },
      },
    });

    if (error) throw error;
  }
}

export const studentAuthService = new StudentAuthService();