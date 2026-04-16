// domain/types.ts
import type { Tables } from "@/types/database";

export type UserRole = "student" | "company_admin" | "pending_university" | "super_admin" | "university_admin";

export type ProfileDB = Tables<"profiles">;

export interface Profile {
    id: string;
    role: UserRole;
    full_name: string;
    email: string;
    avatar_url?: string;
    phone?: string;
    is_premium: boolean;
    stripe_customer_id?: string;
    created_at: string;
    updated_at: string;
  }