// features/university/hooks/useUniversityStats.ts
import { useState, useEffect } from 'react';

export interface UniversityStats {
  totalStudents: number;
  studentsByYear: Record<string, number>;
  studentsBySpeciality: Record<string, number>;
  studentsByStatus: { studying: number; graduated: number; self_taught: number };
  topSkills: { name: string; count: number }[];
  skillDistribution: { name: string; value: number }[];
  certificatesByType: Record<string, number>;
  totalCertificates: number;
  starsCertificateHolders: number;
  applicationsByStatus: Record<string, number>;
  totalApplications: number;
  applicationTrend: { month: string; count: number }[];
  averageExperienceYears: number;
  employedCount: number;
  employmentRate: number;
}

function generateMockStats(): UniversityStats {
  return {
    totalStudents: 342,
    studentsByYear: {
      "1st Year": 78,
      "2nd Year": 85,
      "3rd Year": 92,
      "4th Year": 54,
      "5th Year": 33,
    },
    studentsBySpeciality: {
      "Computer Science": 120,
      "Software Engineering": 65,
      "Data Science": 48,
      "Cybersecurity": 42,
      "AI & ML": 35,
      "Business Informatics": 32,
    },
    studentsByStatus: {
      studying: 245,
      graduated: 67,
      self_taught: 30,
    },
    topSkills: [
      { name: "JavaScript", count: 156 },
      { name: "Python", count: 142 },
      { name: "React", count: 110 },
      { name: "Node.js", count: 89 },
      { name: "TypeScript", count: 76 },
      { name: "SQL", count: 68 },
      { name: "Java", count: 55 },
      { name: "Git", count: 52 },
      { name: "Docker", count: 41 },
      { name: "Machine Learning", count: 37 },
    ],
    skillDistribution: [],
    certificatesByType: {
      major: 210,
      stars: 48,
      graduation: 98,
      hackathon: 67,
      english: 89,
    },
    totalCertificates: 512,
    starsCertificateHolders: 48,
    applicationsByStatus: {
      pending: 45,
      reviewing: 28,
      shortlisted: 19,
      interview: 12,
      rejected: 33,
      hired: 8,
    },
    totalApplications: 145,
    applicationTrend: [
      { month: "Dec 2024", count: 12 },
      { month: "Jan 2025", count: 18 },
      { month: "Feb 2025", count: 23 },
      { month: "Mar 2025", count: 28 },
      { month: "Apr 2025", count: 35 },
      { month: "May 2025", count: 29 },
    ],
    averageExperienceYears: 1.8,
    employedCount: 48,
    employmentRate: 14,
  };
}

export function useUniversityStats() {
  const [stats, setStats] = useState<UniversityStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats(generateMockStats());
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return { stats: stats || generateMockStats(), loading };
}