export interface Company {
  id: string;
  name: string;
  logo?: string;
  description: string;
  culture: string;
  photos: string[]; // URLs
  verified: boolean;
  location: string;
  website?: string;
  industry: string;
  size: string; // e.g. "50-200"
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  skills: string[];
  university: string;
  degree: string;
  graduationYear: number;
  experience: string; // e.g. "3 years"
  location: string;
  resumeUrl?: string;
  aiScore?: number; // mock AI match score
}

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

export interface PublicCompanyProfile {
  id: string;
  company_name: string;
  avatar_url: string | null;
  company_description: string | null;
  company_culture: string | null;
  wilaya: string | null;
  industry: string | null;
  company_size: string | null;
  website: string | null;
  is_verified: boolean;
  created_at: string;
}
