// features/company/services/companyProfile.service.ts
import { supabase } from "@/lib/supabaseClient";
import { CompanyProfile, PublicCompanyProfile } from "@/types/company";

class CompanyProfileService {
  
  async getCompanyProfile(companyId: string): Promise<CompanyProfile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
        id,
        company_name,
        company_description,
        company_culture,
        wilaya,
        website,
        industry,
        company_size,
        avatar_url,
        is_verified
      `
      )
      .eq("id", companyId)
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
  async updateCompanyProfile(
    companyId: string,
    updates: Partial<Omit<CompanyProfile, "id" | "is_verified">>
  ): Promise<CompanyProfile> {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", companyId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async uploadLogo(companyId: string, file: File): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${companyId}/logo_${Date.now()}.${fileExt}`;
    const filePath = `company-logos/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from("company-files")
      .upload(filePath, file);
    if (uploadError) throw new Error(uploadError.message);
    const {
      data: { publicUrl },
    } = supabase.storage.from("company-files").getPublicUrl(filePath);
    await this.updateCompanyProfile(companyId, { avatar_url: publicUrl });
    return publicUrl;
  }

  async getPublicProfile(
    companyId: string
  ): Promise<PublicCompanyProfile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
        id,
        company_name,
        avatar_url,
        company_description,
        company_culture,
        wilaya,
        industry,
        company_size,
        website,
        is_verified,
        created_at
      `
      )
      .eq("id", companyId)
      .eq("role", "company_admin")
      .single();
    if (error) throw new Error(error.message);
    if (!data) return null;
    return {
      ...data,
      wilaya: data.wilaya,
    };
  }
}

export const companyProfileService = new CompanyProfileService();
