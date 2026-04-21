// hooks/useApplications.ts
import { useEffect, useState } from "react";
import { Tables } from "@/types/database";
import { useAuth } from "@/features/auth/contexts/AuthContext";

type Application = Tables<"applications">;

type ApplicationWithJob = Application & {
  jobs: {
    id: string;
    title: string;
    company: string;
  } | null;
};

// Mock applications data with related job info
const MOCK_APPLICATIONS: ApplicationWithJob[] = [
  {
    id: "app-001",
    student_id: "student-123",
    job_id: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
    status: "pending",
    match_score: 85,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    jobs: {
      id: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
      title: "Frontend Developer",
      company: "TechCorp DZ",
    },
  },
  {
    id: "app-002",
    student_id: "student-123",
    job_id: "2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q",
    status: "reviewed",
    match_score: 72,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    jobs: {
      id: "2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q",
      title: "Backend Engineer",
      company: "DataSoft",
    },
  },
  {
    id: "app-003",
    student_id: "student-123",
    job_id: "3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r",
    status: "accepted",
    match_score: 94,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    jobs: {
      id: "3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r",
      title: "UI/UX Designer",
      company: "CreativeMinds",
    },
  },
  {
    id: "app-004",
    student_id: "student-123",
    job_id: "4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s",
    status: "rejected",
    match_score: 45,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    jobs: {
      id: "4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s",
      title: "DevOps Engineer",
      company: "CloudScale",
    },
  },
];

export const useApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);

  useEffect(() => {
    if (!user) return;

    // Simulate API delay
    const fetchMockApplications = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // In a real app, you might filter by user.id, but for mock we return all
      setApplications(MOCK_APPLICATIONS);
    };

    fetchMockApplications();
  }, [user]);

  return { applications };
};