export type ActivityType =
  | "profile_view"
  | "profile_updated"
  | "profile_completed"
  | "application_submitted"
  | "skill_assessment"
  | "certificate_added"
  | "job_saved"
  | "message_received"
  | "interview_scheduled";

export interface Activity {
  id: string;
  student_id: string;
  type: ActivityType;
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}