export type UserRole = 'student' | 'employer' | 'university'

export interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  role: UserRole | null
  degree_level: string | null
  company_name: string | null
  university_name: string | null
  industry: string | null
  country: string | null
  city: string | null
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  title: string
  company_id: string
  description: string
  requirements: string[]
  location: string
  salary_range: string | null
  type: 'full-time' | 'part-time' | 'internship' | 'remote'
  status: 'open' | 'closed' | 'draft'
  created_at: string
  updated_at: string
}

export interface Application {
  id: string
  job_id: string
  student_id: string
  status: 'pending' | 'reviewed' | 'interviewed' | 'accepted' | 'rejected'
  cover_letter: string | null
  resume_url: string | null
  created_at: string
  updated_at: string
}