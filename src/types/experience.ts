export interface Experience {
  id: string;
  student_id: string;
  title: string;
  company: string | null;
  location: string | null;
  type: 'job' | 'internship' | 'volunteer' | 'project';
  start_date: string | null;
  end_date: string | null;
  current: boolean;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export type ExperienceInput = Omit<Experience, 'id' | 'student_id' | 'created_at' | 'updated_at'>;