export interface Application {
  id: string;
  job_id: string;
  student_id: string;
  status:
    | "pending"
    | "reviewing"
    | "shortlisted"
    | "interview"
    | "rejected"
    | "hired"
    | "interview_scheduled";

  rating: number;
  notes: string | null;
  cover_letter: string | null;
  cv_url: string | null;
  ai_match_score: number | null;
  created_at: string;
  updated_at: string;

  student?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    university_name: string;
    skills: string[];
  };

  job?: {
    id: string;
    title: string;
  };
}
