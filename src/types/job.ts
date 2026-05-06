
export interface Job {
  id: string;
  company_id: string;
  title: string;
  description: string;
  requirements: string | null;
  location: string | null;
  job_type: "full-time" | "part-time" | "contract" | "internship";
  experience_level: "entry" | "mid" | "senior" | "lead";
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  skills: string[];
  status: "active" | "closed" | "draft";
  applications_count: number;
  created_at: string;
  updated_at: string;
  company?: {
    id: string;
    company_name: string;
    avatar_url: string;
    wilaya: string;
  };
}

export type JobInput = Omit<
  Job,
  "id" | "company_id" | "applications_count" | "created_at" | "updated_at"
>;

  