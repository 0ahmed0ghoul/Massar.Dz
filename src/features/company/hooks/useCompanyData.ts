// hooks/useCompanyData.ts
import { useState, useEffect } from 'react';
import { Company, Job, Candidate, Application } from '../types/company';

const STORAGE_KEYS = {
  COMPANY: 'company_profile',
  JOBS: 'company_jobs',
  CANDIDATES: 'company_candidates',
  APPLICATIONS: 'company_applications',
};

// ----- MOCK DATA -----
const MOCK_COMPANY: Company = {
  id: 'comp_001',
  name: 'TechCorp Algeria',
  logo: '',
  description: 'Leading software company specializing in AI and cloud solutions.',
  culture: 'Innovative, inclusive, and fast-paced. We value learning and teamwork.',
  photos: [],
  verified: true,
  location: 'Algiers, Algeria',
  website: 'https://techcorp.dz',
  industry: 'Software Development',
  size: '100-500',
};

const MOCK_JOBS: Job[] = [
  {
    id: 'job_1',
    companyId: 'comp_001',
    title: 'Frontend Developer',
    type: 'full-time',
    description: 'Build responsive UIs with React and Tailwind.',
    requirements: ['3+ years React', 'TypeScript', 'Tailwind CSS'],
    skills: ['React', 'TypeScript', 'Tailwind', 'Next.js'],
    location: 'Algiers (hybrid)',
    experience: '3+ years',
    salary: '60000-80000 DZD',
    postedAt: new Date().toISOString(),
    active: true,
  },
  {
    id: 'job_2',
    companyId: 'comp_001',
    title: 'Backend Engineer',
    type: 'full-time',
    description: 'Design APIs and microservices with Node.js.',
    requirements: ['Node.js', 'PostgreSQL', 'AWS'],
    skills: ['Node.js', 'Express', 'MongoDB', 'Docker'],
    location: 'Remote',
    experience: '2+ years',
    salary: '70000-90000 DZD',
    postedAt: new Date().toISOString(),
    active: true,
  },
  {
    id: 'job_3',
    companyId: 'comp_001',
    title: 'Data Science Intern',
    type: 'internship',
    description: 'Assist in data analysis and ML model development.',
    requirements: ['Python', 'Pandas', 'Scikit-learn'],
    skills: ['Python', 'Pandas', 'SQL', 'Statistics'],
    location: 'Algiers',
    experience: 'Entry level',
    salary: '20000 DZD',
    postedAt: new Date().toISOString(),
    active: true,
  },
];

const MOCK_CANDIDATES: Candidate[] = [
  {
    id: 'cand_1',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    skills: ['React', 'TypeScript', 'Tailwind', 'Next.js'],
    university: 'USTHB',
    degree: 'Master in CS',
    graduationYear: 2023,
    experience: '2 years',
    location: 'Algiers',
    resumeUrl: '',
    aiScore: 92,
  },
  {
    id: 'cand_2',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john@example.com',
    skills: ['Node.js', 'Express', 'MongoDB', 'AWS'],
    university: 'ESI',
    degree: 'Engineer',
    graduationYear: 2022,
    experience: '3 years',
    location: 'Oran',
    aiScore: 88,
  },
  {
    id: 'cand_3',
    firstName: 'Alice',
    lastName: 'Chen',
    email: 'alice@example.com',
    skills: ['React', 'Python', 'Django', 'PostgreSQL'],
    university: 'University of Algiers',
    degree: 'Bachelor',
    graduationYear: 2024,
    experience: '1 year',
    location: 'Algiers',
    aiScore: 76,
  },
  {
    id: 'cand_4',
    firstName: 'Karim',
    lastName: 'Boudiaf',
    email: 'karim@example.com',
    skills: ['Python', 'Pandas', 'Scikit-learn', 'SQL'],
    university: 'USTHB',
    degree: 'Master in Data Science',
    graduationYear: 2024,
    experience: 'Internship',
    location: 'Algiers',
    aiScore: 94,
  },
];

const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app_1',
    jobId: 'job_1',
    candidateId: 'cand_1',
    status: 'shortlisted',
    appliedAt: new Date().toISOString(),
    notes: 'Strong portfolio, good React knowledge.',
    rating: 4,
    aiMatchScore: 92,
  },
  {
    id: 'app_2',
    jobId: 'job_1',
    candidateId: 'cand_3',
    status: 'reviewing',
    appliedAt: new Date().toISOString(),
    notes: 'Needs more experience with TypeScript.',
    rating: 3,
    aiMatchScore: 76,
  },
  {
    id: 'app_3',
    jobId: 'job_2',
    candidateId: 'cand_2',
    status: 'interview',
    appliedAt: new Date().toISOString(),
    notes: 'Good backend experience, scheduled interview.',
    rating: 5,
    aiMatchScore: 88,
  },
];

export function useCompanyData() {
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedCompany = localStorage.getItem(STORAGE_KEYS.COMPANY);
    const storedJobs = localStorage.getItem(STORAGE_KEYS.JOBS);
    const storedCandidates = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
    const storedApps = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);

    setCompany(storedCompany ? JSON.parse(storedCompany) : MOCK_COMPANY);
    setJobs(storedJobs ? JSON.parse(storedJobs) : MOCK_JOBS);
    setCandidates(storedCandidates ? JSON.parse(storedCandidates) : MOCK_CANDIDATES);
    setApplications(storedApps ? JSON.parse(storedApps) : MOCK_APPLICATIONS);
    setLoading(false);
  }, []);

  const persist = () => {
    if (company) localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(company));
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  };

  // Company profile
  const updateCompany = (updates: Partial<Company>) => {
    const updated = { ...company, ...updates } as Company;
    setCompany(updated);
    persist();
  };

  // Job management
  const addJob = (job: Omit<Job, 'id' | 'companyId' | 'postedAt'>) => {
    const newJob: Job = {
      ...job,
      id: crypto.randomUUID(),
      companyId: company!.id,
      postedAt: new Date().toISOString(),
      active: true,
    };
    setJobs([...jobs, newJob]);
    persist();
  };

  const updateJob = (jobId: string, updates: Partial<Job>) => {
    setJobs(jobs.map(j => j.id === jobId ? { ...j, ...updates } : j));
    persist();
  };

  const deleteJob = (jobId: string) => {
    setJobs(jobs.filter(j => j.id !== jobId));
    // Also delete associated applications? We'll keep for history.
    persist();
  };

  // Candidate management (search, filter)
  const filterCandidates = (filters: {
    skills?: string[];
    university?: string;
    experience?: string;
    location?: string;
  }) => {
    return candidates.filter(c => {
      if (filters.skills?.length && !filters.skills.some(skill => c.skills.includes(skill))) return false;
      if (filters.university && !c.university.toLowerCase().includes(filters.university.toLowerCase())) return false;
      if (filters.experience && !c.experience.toLowerCase().includes(filters.experience.toLowerCase())) return false;
      if (filters.location && !c.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      return true;
    });
  };

  // Applications
  const getApplicationsForJob = (jobId: string) => {
    return applications.filter(app => app.jobId === jobId)
      .map(app => ({
        ...app,
        candidate: candidates.find(c => c.id === app.candidateId),
      }));
  };

  const updateApplication = (appId: string, updates: Partial<Application>) => {
    setApplications(apps => apps.map(app => app.id === appId ? { ...app, ...updates } : app));
    persist();
  };

  const addNote = (appId: string, note: string) => {
    setApplications(apps => apps.map(app =>
      app.id === appId ? { ...app, notes: app.notes ? `${app.notes}\n${note}` : note } : app
    ));
    persist();
  };

  const setRating = (appId: string, rating: number) => {
    setApplications(apps => apps.map(app => app.id === appId ? { ...app, rating } : app));
    persist();
  };

  // AI matching: returns top candidates for a job based on skill overlap
  const getAIMatchedCandidates = (jobId: string, limit = 10) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return [];
    const scored = candidates.map(candidate => {
      const matchSkills = candidate.skills.filter(skill => job.skills.includes(skill)).length;
      const totalSkills = new Set([...job.skills, ...candidate.skills]).size;
      const score = totalSkills === 0 ? 0 : Math.round((matchSkills / totalSkills) * 100);
      return { ...candidate, aiScore: score };
    });
    return scored.sort((a, b) => b.aiScore! - a.aiScore!).slice(0, limit);
  };

  // Automated screening: returns candidates that meet minimum requirements (e.g., experience)
  const autoScreen = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return [];
    // Simple screening: experience level match (contains "2+ years" etc.)
    const minYears = parseInt(job.experience.match(/\d+/)?.[0] || '0');
    return candidates.filter(c => {
      const expYears = parseInt(c.experience.match(/\d+/)?.[0] || '0');
      return expYears >= minYears;
    });
  };

  return {
    company,
    jobs,
    candidates,
    applications,
    loading,
    updateCompany,
    addJob,
    updateJob,
    deleteJob,
    filterCandidates,
    getApplicationsForJob,
    updateApplication,
    addNote,
    setRating,
    getAIMatchedCandidates,
    autoScreen,
  };
}