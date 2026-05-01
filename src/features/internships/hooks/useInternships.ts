// hooks/useInternships.ts
import { useEffect, useState } from "react";
import { Tables } from "@/types/database";

type Internship = Tables<"internships"> & {
  skills?: string[][];
};

const MOCK_INTERNSHIPS: Internship[] = [
  {
    id: "int-001",
    company_id: "comp-001",
    title: "Frontend Developer Intern",
    description: "Join our web team to build React components and improve user experience.",
    duration: "3 months",
    location: "Algiers",
    requirements: "Basic knowledge of HTML, CSS, JavaScript. React is a plus.",
    stipend_min: 20000,
    stipend_max: 35000,
    internship_type: "full-time",
    status: "active",
    created_at: new Date().toISOString(),
    company: "TechCorp DZ",
    skills: ["React", "Tailwind", "JavaScript"],
  },
  {
    id: "int-002",
    company_id: "comp-002",
    title: "Data Science Intern",
    description: "Work on real-world ML projects, data cleaning, and visualization.",
    duration: "6 months",
    location: "Oran",
    requirements: "Python, Pandas, basic statistics.",
    stipend_min: 25000,
    stipend_max: 40000,
    internship_type: "hybrid",
    status: "active",
    created_at: new Date().toISOString(),
    company: "AI Insights",
    skills: ["Python", "Pandas", "Scikit-learn", "SQL"],
  },
  {
    id: "int-003",
    company_id: "comp-003",
    title: "UI/UX Design Intern",
    description: "Assist in creating wireframes, prototypes, and user testing.",
    duration: "4 months",
    location: "Remote",
    requirements: "Figma or Adobe XD basics, portfolio is a plus.",
    stipend_min: 18000,
    stipend_max: 30000,
    internship_type: "remote",
    status: "active",
    created_at: new Date().toISOString(),
    company: "CreativeMinds",
    skills: ["Figma", "User Research", "Prototyping"],
  },
  {
    id: "int-004",
    company_id: "comp-004",
    title: "DevOps Intern",
    description: "Learn cloud infrastructure, CI/CD pipelines, and monitoring tools.",
    duration: "3 months",
    location: "Algiers",
    requirements: "Linux basics, interest in cloud.",
    stipend_min: 22000,
    stipend_max: 36000,
    internship_type: "full-time",
    status: "active",
    created_at: new Date().toISOString(),
    company: "CloudScale",
    skills: ["Docker", "AWS basics", "GitHub Actions"],
  },
  {
    id: "int-005",
    company_id: "comp-005",
    title: "Marketing Intern",
    description: "Support social media, content creation, and campaign analysis.",
    duration: "2 months",
    location: "Constantine",
    requirements: "Good writing skills, familiar with social platforms.",
    stipend_min: 15000,
    stipend_max: 25000,
    internship_type: "part-time",
    status: "active",
    created_at: new Date().toISOString(),
    company: "BrandBoost",
    skills: ["Social Media", "Content Writing", "Analytics"],
  },
];

export const useInternships = () => {
    const [internships, setInternships] = useState<Internship[]>([]);
    const [loading, setLoading] = useState(true);
  
    const getInternshipById = (id: string): Internship | undefined => {
      return internships.find(internship => internship.id === id);
    };
  
    useEffect(() => {
      const fetchMock = async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        setInternships(MOCK_INTERNSHIPS);
        setLoading(false);
      };
      fetchMock();
    }, []);
  
    return { internships, loading, getInternshipById };
  };