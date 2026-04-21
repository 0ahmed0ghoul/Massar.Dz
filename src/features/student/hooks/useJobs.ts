// hooks/useJobs.ts
import { useEffect, useState } from "react";
import { Tables } from "@/types/database";

type Job = Tables<"jobs">;

// Mock data matching the jobs table structure
const MOCK_JOBS: Job[] = [
  {
    id: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
    company_id: "comp-001",
    title: "Frontend Developer",
    description: "Build responsive web applications with React and Tailwind CSS.",
    salary_min: 60000,
    salary_max: 80000,
    wilaya: "Algiers",
    job_type: "full-time",
    created_at: new Date().toISOString(),
    company: "TechCorp DZ",
    status: "active",
  },
  {
    id: "2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q",
    company_id: "comp-002",
    title: "Backend Engineer",
    description: "Develop scalable APIs using Node.js and PostgreSQL.",
    salary_min: 70000,
    salary_max: 95000,
    wilaya: "Oran",
    job_type: "full-time",
    created_at: new Date().toISOString(),
    company: "DataSoft",
    status: "active",
  },
  {
    id: "3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r",
    company_id: "comp-003",
    title: "UI/UX Designer",
    description: "Create intuitive user interfaces and design systems.",
    salary_min: 55000,
    salary_max: 72000,
    wilaya: "Constantine",
    job_type: "remote",
    created_at: new Date().toISOString(),
    company: "CreativeMinds",
    status: "active",
  },
  {
    id: "4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s",
    company_id: "comp-004",
    title: "DevOps Engineer",
    description: "Manage cloud infrastructure and CI/CD pipelines.",
    salary_min: 80000,
    salary_max: 110000,
    wilaya: "Algiers",
    job_type: "hybrid",
    created_at: new Date().toISOString(),
    company: "CloudScale",
    status: "active",
  },
  {
    id: "5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t",
    company_id: "comp-005",
    title: "Mobile Developer (React Native)",
    description: "Build cross-platform mobile applications.",
    salary_min: 65000,
    salary_max: 85000,
    wilaya: "Annaba",
    job_type: "full-time",
    created_at: new Date().toISOString(),
    company: "AppWizards",
    status: "active",
  },
];

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    // Simulate API delay
    const fetchMockJobs = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setJobs(MOCK_JOBS);
    };

    fetchMockJobs();
  }, []);

  return { jobs };
};