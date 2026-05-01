import { z } from "zod";

// Base fields shared across roles
const baseFields = {
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
};

// ─────────────────────────────────────────────────────────────
// Student (currently enrolled)
// ─────────────────────────────────────────────────────────────
export const studentSchema = z.object({
    firstName: z.string().min(1, "First name required"),
    lastName: z.string().min(1, "Last name required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    candidateType: z.enum(["studying", "graduated", "self_taught"]), // ✅ new
    degreeLevel: z.enum(["bachelor", "master", "phd", "bootcamp"]).optional(),
    university: z.string().optional(),
    department: z.string().optional(),
    degree: z.string().optional(),
    graduationYear: z.string().optional(),
    speciality: z.string().optional(),
    skills: z.array(z.string()).optional().default([]),
  });

export type StudentFields = z.infer<typeof studentSchema>;

// ─────────────────────────────────────────────────────────────
// Graduate (recent university graduate)
// ─────────────────────────────────────────────────────────────
export const graduateSchema = z.object({
  ...baseFields,
  graduationYear: z.string().min(1, "Graduation year required"),
  university: z.string().min(1, "University name required"),
  degree: z.string().min(1, "Degree required"),
  speciality: z.string().min(1, "Major required"),
  skills: z.string().optional(),
});

export type GraduateFields = z.infer<typeof graduateSchema>;

// ─────────────────────────────────────────────────────────────
// Professional (experienced, not necessarily a student)
// ─────────────────────────────────────────────────────────────
export const professionalSchema = z.object({
  ...baseFields,
  currentRole: z.string().min(1, "Current role required"),
  company: z.string().min(1, "Company name required"),
  yearsOfExperience: z.string().min(1, "Years of experience required"),
  skills: z.string().optional(),
  lookingFor: z.enum(["internship", "fulltime", "parttime", "freelance"]),
});

export type ProfessionalFields = z.infer<typeof professionalSchema>;

// ─────────────────────────────────────────────────────────────
// Company (startup / private / government)
// ─────────────────────────────────────────────────────────────
export const companySchema = z.object({
  ...baseFields,
  companyName: z.string().min(1, "Company name required"),
  companyType: z.enum(["startup", "private", "government"]),
  industry: z.string().min(1, "Industry required"),
  registrationNumber: z.string().optional(),
  location: z.string().min(1, "Location required"),
});

export type CompanyFields = z.infer<typeof companySchema>;

// ─────────────────────────────────────────────────────────────
// University (with department)
// ─────────────────────────────────────────────────────────────
export const universitySchema = z.object({
  ...baseFields,
  universityName: z.string().min(1, "University name required"),
  department: z.string().min(1, "Department required"),
  position: z.string().min(1, "Position required"),
  wilaya: z.string().min(1, "wilaya required"),
});

export type UniversityFields = z.infer<typeof universitySchema>;