import { z } from "zod";

const password = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/[0-9]/, "Must contain a number")
  .regex(/[^A-Za-z0-9]/, "Must contain a special character");

export const studentSchema = z.object({
  firstName:   z.string().min(2, "At least 2 characters"),
  lastName:    z.string().min(2, "At least 2 characters"),
  email:       z.string().email("Enter a valid email"),
  password,
  degreeLevel: z.string().min(1, "Please select a degree level"),
});

export const companySchema = z.object({
  companyName: z.string().min(2, "At least 2 characters"),
  firstName:   z.string().min(2, "At least 2 characters"),
  lastName:    z.string().min(2, "At least 2 characters"),
  email:       z.string().email("Enter a valid work email"),
  password,
  industry:    z.string().min(1, "Please select an industry"),
});

export const universitySchema = z.object({
  universityName: z.string().min(2, "At least 2 characters"),
  firstName:      z.string().min(2, "At least 2 characters"),
  lastName:       z.string().min(2, "At least 2 characters"),
  email:          z.string().email("Enter a valid institutional email"),
  password,
  city:           z.string().min(2, "At least 2 characters"),
});

export type StudentFields    = z.infer<typeof studentSchema>;
export type CompanyFields    = z.infer<typeof companySchema>;
export type UniversityFields = z.infer<typeof universitySchema>;