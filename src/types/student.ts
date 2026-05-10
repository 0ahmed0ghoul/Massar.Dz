import { Tables } from "@/types/database";
import { Job } from "./job";

export type Profile = Tables<"profiles">;
export type Application = Tables<"applications">;
export type Interview = Tables<"interviews">;
export type Activity = Tables<"notifications">;
export type CandidateType = "studying" | "graduated" | "self_taught" | null;

export interface StudentOutcome {
  outcome: 'Employed' | 'Internship' | 'Studying';
  company?: string;
  date: string;
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
export interface DashboardState {
  stats: { label: string; value: number }[];
  applications: Application[];
  jobs: Job[];
  interviews: Interview[];
  activities: Activity[];
  profile: Profile | null;
}

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

export interface StudentConversation {
  id: string;
  universityName: string;
  universityAvatar?: string | null;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  unreadCount: number;
  role?: "university" | "company"; // optional, for UI
}