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
    specialtyType?: 'ENG' | 'PRO' | 'LMD';
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
    specialtyType: 'ENG' | 'PRO' | 'LMD';
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