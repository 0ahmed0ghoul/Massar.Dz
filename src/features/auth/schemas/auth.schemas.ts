import { z } from "zod";

const password = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/[0-9]/, "Must contain a number")
  .regex(/[^A-Za-z0-9]/, "Must contain a special character");

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

export const companySchema = z.object({
  companyName: z.string().min(1, "Company name required"),
  companyType: z.enum(["startup", "private", "government"], { required_error: "Company type required" }),
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  industry: z.string().min(1, "Industry required"),
});

export const universitySchema = z.object({
  universityName: z.string().min(2, "At least 2 characters"),
  firstName:      z.string().min(2, "At least 2 characters"),
  lastName:       z.string().min(2, "At least 2 characters"),
  email:          z.string().email("Enter a valid institutional email"),
  password,
  wilaya:           z.string().min(2, "At least 2 characters"),
  department: z.string().min(1, "Department required"),
  position: z.string().min(1, "Position required"),
});

export type StudentFields    = z.infer<typeof studentSchema>;
export type CompanyFields    = z.infer<typeof companySchema>;
export type UniversityFields = z.infer<typeof universitySchema>;