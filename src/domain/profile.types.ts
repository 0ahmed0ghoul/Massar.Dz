// domain/types.ts
import type { Tables } from "@/types/database";

export type UserRole = "student" | "company_admin" | "super_admin" | "university_admin";

export type ProfileDB = Tables<"profiles">;

export interface Profile {
    id: string;
    role: UserRole;
    full_name: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url?: string;
    phone?: string;
    status: string;
    is_premium: boolean;
    stripe_customer_id?: string;
    created_at: string;
    updated_at: string;
    company_name?: string;
    industry?: string;
    university_name?: string;
    city?: string;
    degree_level?: string;
  }