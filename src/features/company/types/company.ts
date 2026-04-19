// types/company.ts
export interface Company {
    id: string;
    name: string;
    logo?: string;
    description: string;
    culture: string;
    photos: string[];        // URLs
    verified: boolean;
    location: string;
    website?: string;
    industry: string;
    size: string;            // e.g. "50-200"
  }
  
  export interface Job {
    id: string;
    companyId: string;
    title: string;
    type: 'full-time' | 'part-time' | 'internship' | 'contract';
    description: string;
    requirements: string[];
    skills: string[];
    location: string;
    experience: string;      // e.g. "2+ years"
    salary?: string;
    postedAt: string;
    active: boolean;
  }
  
  export interface Candidate {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    skills: string[];
    university: string;
    degree: string;
    graduationYear: number;
    experience: string;      // e.g. "3 years"
    location: string;
    resumeUrl?: string;
    aiScore?: number;        // mock AI match score
  }
  
  export interface Application {
    id: string;
    jobId: string;
    candidateId: string;
    status: 'pending' | 'reviewing' | 'shortlisted' | 'interview' | 'rejected' | 'hired';
    appliedAt: string;
    notes: string;
    rating: number;          // 1-5
    aiMatchScore?: number;
  }