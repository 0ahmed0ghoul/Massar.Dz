import { StudentProfile } from "@/types/profile.types";

export const STUDENT_STATUS_OPTIONS = [
  { id: "studying", label: "Currently Studying", icon: "GraduationCap" },
  { id: "graduated", label: "Graduated", icon: "Calendar" },
  { id: "self_taught", label: "Self‑Taught", icon: "Sparkles" },
] as const;

export const UNIVERSITY_STRUCTURE: Record<string, string[]> = {
  "Computer Science": [
    "Computer Science",
    "Software Engineering",
    "Information Systems",
    "Artificial Intelligence",
    "Cyber Security",
    "Data Science",
    "Web Development",
    "Mobile Development",
    "Networks & Telecommunications",
  ],

  Mathematics: [
    "Pure Mathematics",
    "Applied Mathematics",
    "Statistics",
    "Operational Research",
  ],

  Physics: [
    "Theoretical Physics",
    "Nuclear Physics",
    "Quantum Physics",
    "Materials Physics",
  ],

  Chemistry: [
    "Organic Chemistry",
    "Analytical Chemistry",
    "Industrial Chemistry",
    "Biochemistry",
  ],

  Biology: [
    "Microbiology",
    "Genetics",
    "Molecular Biology",
    "Biotechnology",
  ],

  "Civil Engineering": [
    "Structural Engineering",
    "Construction Engineering",
    "Hydraulics",
    "Geotechnical Engineering",
  ],

  "Mechanical Engineering": [
    "Industrial Mechanics",
    "Energy Engineering",
    "Manufacturing",
    "Automotive Engineering",
  ],

  "Electrical Engineering": [
    "Power Systems",
    "Automation",
    "Embedded Systems",
    "Electronics",
  ],

  Economics: [
    "International Economics",
    "Banking",
    "Financial Economics",
  ],

  Management: [
    "Business Management",
    "Human Resources",
    "Project Management",
  ],

  Medicine: [
    "General Medicine",
    "Surgery",
    "Cardiology",
    "Neurology",
  ],

  Pharmacy: [
    "Clinical Pharmacy",
    "Pharmaceutical Industry",
  ],

  Law: [
    "Private Law",
    "Public Law",
    "International Law",
  ],

  Literature: [
    "Arabic Literature",
    "English Literature",
    "French Literature",
  ],
};

export const UNIVERSITY_DEPARTMENTS =
  Object.keys(UNIVERSITY_STRUCTURE);
  


  
export const COMMON_SPECIALITIES = [
  "Computer Science",
  "Software Engineering",
  "Data Science",
  "Artificial Intelligence",
  "Cybersecurity",
  "Business Administration",
  "Marketing",
  "Finance",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Biotechnology",
  "Medicine",
  "Law",
  "Economics",
];

export const COMMON_DEGREES = [
  "License (LMD)",
  "Master (LMD)",
  "Doctorate",
  'Ingenieur (ING)'
];

export const EDUCATION_LEVELS = [
  { value: "bachelor", label: "Bachelor's" },
  { value: "Master", label: "Master" },
  { value: "Doctorate", label: "Doctorate" },
];

export const REQUIRED_STUDENT_FIELDS: (keyof StudentProfile)[] = [
  "first_name",
  "last_name",
  "email",
  "wilaya",
];