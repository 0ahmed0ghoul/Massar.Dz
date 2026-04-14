export type UserRole = 'student' | 'company_admin' | 'university_admin' | 'super_admin';
export type DegreeLevel = 'bachelor' | 'master' | 'phd' | 'bootcamp';
export type JobType = 'full_time' | 'part_time' | 'internship' | 'contract' | 'remote';
export type ExperienceLevel = 'entry' | 'mid' | 'senior';
export type JobStatus = 'draft' | 'active' | 'paused' | 'closed';
export type ApplicationStatus = 'pending' | 'reviewing' | 'shortlisted' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
export type OutcomeType = 'employed' | 'self_employed' | 'further_study' | 'unemployed' | 'unknown';
export type Visibility = 'public' | 'universities_only' | 'private';
export type CompanyTier = 'free' | 'starter' | 'pro' | 'enterprise';
export type CompanyAdminRole = 'owner' | 'recruiter';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  avatar_url?: string;
  phone?: string;
  is_premium: boolean;
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
  
}

export interface Job {
  id: string;
  company_id: string;
  title: string;
  description: string;
  requirements: string[];
  field_category: string;
  job_type: JobType;
  location: string;
  is_remote: boolean;
  salary_min?: number;
  salary_max?: number;
  currency: string;
  required_skills: string[];
  experience_level: ExperienceLevel;
  status: JobStatus;
  expires_at?: string;
  views_count: number;
  created_at: string;
  updated_at: string;
  company?: Company;
}

export interface Company {
  id: string;
  name: string;
  logo_url?: string;
  website?: string;
  industry: string;
  size_range: string;
  country: string;
  city: string;
  description: string;
  subscription_tier: CompanyTier;
  is_verified: boolean;
}
