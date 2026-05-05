// features/admin/types/verification.types.ts
export interface Profile {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    status?: string;
    university_name?: string;
    company_name?: string;
    industry?: string;
    degree_level?: string;
    wilaya?: string;
    created_at: string;
    speciality_type : string;
    is_completed?: boolean;
    is_verified?: boolean;
    university_connection_status?:string
  }
  
  // features/admin/types/admin.types.ts
  export interface AdminStats {
    total: number;
    students: number;
    companies: number;
    universities: number;
    pendingUniversities: number;
    pendingCompanies: number;
    pendingStudents: number;
    rejected: number;
  }