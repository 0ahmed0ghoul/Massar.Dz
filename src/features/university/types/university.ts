export interface StudentOutcome {
    outcome: 'Employed' | 'Internship' | 'Studying';
    company?: string;
    date: string;
  }
export interface University {
    id: string;
    name: string;
    logo?: string;           
    address: string;
    wilaya: string;
    phone: string;
    email: string;
    website?: string;
    establishedYear?: number;
    description?: string;
  }
    export interface Student {
    id: string;
    firstName: string;
    lastName: string;
    studentId: string; 
    email: string;
    speciality: string;       
    wilaya?: string;
    specialityType?: 'ENG' | 'PRO' | 'LMD';
    academicYears?: string;
    degreeLevel?: string;
    status: 'studying' | 'graduated';
    graduationEligible: boolean;
    outcome?: StudentOutcome;
    isProfileVerified: boolean; 
    connectionStatus: 'none' | 'pending' | 'connected';
  }
    export interface StudentProfile {
    firstName: string;
    lastName: string;
    studentId: string;
    studentIdCardImage: string;  
    wilaya: string;
    speciality: string;
    specialityType: 'ENG' | 'PRO' | 'LMD';
    academicYears: string;
    degreeLevel: string;
    email?: string;               
    phone?: string;           
  }
  
  export interface Invitation {
    id: string;
    studentId: string;
    universityId: string;
    profileData: StudentProfile;  
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
  }
  export interface InvitationWithStudent {
    id: string;
    student_id: string;
    university_id: string;
    status: 'pending' | 'accepted' | 'rejected';
    invited_by: string | null;
    created_at: string;
    updated_at: string;
    profile: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      student_id: string;
      speciality: string | null;
      department: string | null;
      degree_level: string | null;
      academic_year: string | null;
      wilaya: string;
      avatar_url: string | null;
    } | null; 
  }