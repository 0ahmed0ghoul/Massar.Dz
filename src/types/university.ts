import { OfficialStudentRecord, StudentProfile } from "./student";

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
export interface Invitation {
  id: string;
  studentId: string;
  universityId: string;
  profileData: StudentProfile;
  status: "pending" | "connected" | "rejected";
  createdAt: string;
}
export interface InvitationWithStudent {
  id: string;
  student_id: string;
  university_id: string;
  status: "pending" | "connected" | "rejected";
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