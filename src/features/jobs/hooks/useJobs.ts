// hooks/useJobs.ts
import { useEffect, useState } from "react";
import { Tables } from "@/types/database";

type Job = Tables<"jobs"> & {
  skills?: string[];  // joined from job_skills
};

const MOCK_JOBS: Job[] = [
  {
    id: "job-001",
    company_id: "comp-001",
    title: "Frontend Developer",
    description: "Build responsive web apps with React, Tailwind, and modern frontend tools.",
    salary_min: 60000,
    salary_max: 80000,
    wilaya: "Algiers",
    job_type: "full-time",
    created_at: new Date().toISOString(),
    company: "TechCorp DZ",
    status: "active",
    skills: ["React", "Tailwind", "TypeScript", "Next.js"],
  },
  {
    id: "job-002",
    company_id: "comp-002",
    title: "Backend Engineer",
    description: "Develop scalable APIs using Node.js, PostgreSQL, and Docker.",
    salary_min: 70000,
    salary_max: 95000,
    wilaya: "Oran",
    job_type: "full-time",
    created_at: new Date().toISOString(),
    company: "DataSoft",
    status: "active",
    skills: ["Node.js", "PostgreSQL", "Docker", "Redis"],
  },
  {
    id: "job-003",
    company_id: "comp-003",
    title: "UI/UX Designer",
    description: "Create intuitive user interfaces and design systems for web/mobile.",
    salary_min: 55000,
    salary_max: 72000,
    wilaya: "Constantine",
    job_type: "remote",
    created_at: new Date().toISOString(),
    company: "CreativeMinds",
    status: "active",
    skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
  },
  {
    id: "job-004",
    company_id: "comp-004",
    title: "DevOps Engineer",
    description: "Manage cloud infrastructure (AWS), CI/CD pipelines, and Kubernetes.",
    salary_min: 80000,
    salary_max: 110000,
    wilaya: "Algiers",
    job_type: "hybrid",
    created_at: new Date().toISOString(),
    company: "CloudScale",
    status: "active",
    skills: ["AWS", "Kubernetes", "Terraform", "GitHub Actions"],
  },
  {
    id: "job-005",
    company_id: "comp-005",
    title: "Mobile Developer (React Native)",
    description: "Build cross-platform mobile applications with React Native.",
    salary_min: 65000,
    salary_max: 85000,
    wilaya: "Annaba",
    job_type: "full-time",
    created_at: new Date().toISOString(),
    company: "AppWizards",
    status: "active",
    skills: ["React Native", "Expo", "Redux", "Firebase"],
  },
  {
    id: "job-006",
    company_id: "comp-006",
    title: "Data Scientist",
    description: "Analyze large datasets, build ML models, and deploy insights.",
    salary_min: 75000,
    salary_max: 105000,
    wilaya: "Algiers",
    job_type: "remote",
    created_at: new Date().toISOString(),
    company: "AI Insights",
    status: "active",
    skills: ["Python", "Pandas", "Scikit-learn", "TensorFlow"],
  },
];

export const useJobs = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
  
    const getJobById = (id: string): Job | undefined => {
      return jobs.find(job => job.id === id);
    };
  
    useEffect(() => {
      const fetchMock = async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        setJobs(MOCK_JOBS);
        setLoading(false);
      };
      fetchMock();
    }, []);
  
    return { jobs, loading, getJobById };
  };