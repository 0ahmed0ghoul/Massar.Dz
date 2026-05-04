// types/university.types.ts
export interface OfficialStudentRecord {
    id: string;
    studentId: string;
    fullName: string;
    specialityType: string;
    academicYearGroup: number;
    section: number;
    departmentId: string;
    uploadedAt: Date;
  }
  
  export interface PlatformStudent {
    id: string;
    studentId: string;
    firstName: string;
    lastName: string;
    email: string;
    speciality: string;
    academicYear?: number;
    section?: number;
    isProfileVerified: boolean;
    connectionStatus: 'none' | 'pending' | 'connected' | 'rejected';
    rejectionReason?: string;
    status?: string;
    graduationEligible?: boolean;
  }
  
  export interface MatchResult {
    matched: boolean;
    matchScore: number;
    mismatchedFields: string[];
    officialRecord?: OfficialStudentRecord;
  }
  
  export interface InvitationRequest {
    studentId: string;
    officialStudentId: string;
    departmentId: string;
  }
  
  export interface RejectionRequest {
    studentId: string;
    reason: string;
    email: string;
    studentName: string;
  }