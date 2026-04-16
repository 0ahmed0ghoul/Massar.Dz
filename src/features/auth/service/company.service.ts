import { supabase } from "@/lib/supabaseClient";

export interface CompanyFormData {
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  industry: string;
}

class CompanyAuthService {
  async register(data: CompanyFormData) {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          company_name: data.companyName,
          industry: data.industry,
        },
      },
    });

    if (error) throw error;
  }
}

export const companyAuthService = new CompanyAuthService();