// features/company/types/company.types.ts

export interface CompanyProfile {
    id: string;
    company_name: string | null;
    company_description: string | null;
    company_culture: string | null;
    wilaya: string | null;
    website: string | null;
    industry: string | null;
    company_size: string | null;
    avatar_url: string | null;
    is_verified: boolean;
  }
  
  // Public facing profile (includes optional company_location)
  export interface PublicCompanyProfile {
    id: string;
    company_name: string;
    avatar_url: string | null;
    company_description: string | null;
    company_culture: string | null;
    company_location: string | null;  // can be derived from wilaya
    wilaya: string | null;
    industry: string | null;
    company_size: string | null;
    website: string | null;
    is_verified: boolean;
    created_at: string;
  }