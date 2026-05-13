import { z } from "zod";

// Base fields shared across roles (can be reused if needed)
const baseFields = {
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
};

// ─────────────────────────────────────────────────────────────
// Student (currently enrolled / graduated / self-taught)
// ─────────────────────────────────────────────────────────────
export const studentSchema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  candidateType: z.enum(["studying", "graduated", "self_taught"]),
  degreeLevel: z.enum(["bachelor", "master", "phd", "bootcamp"]).optional(),
  university: z.string().optional(),
  department: z.string().optional(),
  degree: z.string().optional(),
  graduationYear: z.string().optional(),
  speciality: z.string().optional(),
  studentId: z.string().optional(),   // ✅ changed from student_id to studentId
  wilaya: z.string().optional(),      // ✅ added
  skills: z.array(z.string()).optional().default([]),
}).superRefine((data, ctx) => {
  if (data.candidateType === "studying" && !data.studentId) {
    ctx.addIssue({
      path: ["studentId"],
      message: "Student ID is required for studying students.",
      code: "custom",
    });
  }
});

export type StudentFields = z.infer<typeof studentSchema>;

// ─────────────────────────────────────────────────────────────
// Graduate (if you still use it separately)
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
// Professional
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
// Company – adjusted to match the CompanyForm fields exactly
// ─────────────────────────────────────────────────────────────
export const companySchema = z.object({
  companyName: z.string().min(1, "Company name required"),
  companyType: z.enum(["startup", "private", "government"]),
  industry: z.string().min(1, "Industry required"),
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type CompanyFields = z.infer<typeof companySchema>;

// ─────────────────────────────────────────────────────────────
// University
// ─────────────────────────────────────────────────────────────
export const universitySchema = z.object({
  firstName: z.string().min(1, "First name required"),

  lastName: z.string().min(1, "Last name required"),

  email: z.string().email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  wilaya: z
    .string()
    .min(1, "Wilaya required"),

    univ_admin_type: z.enum([
      "rectorate",
      "head_of_department",
    ]),
});

export type UniversityFields = z.infer<typeof universitySchema>;

