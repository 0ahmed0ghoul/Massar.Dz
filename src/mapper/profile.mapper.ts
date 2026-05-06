import type { Tables } from "@/types/database";
import type { Profile } from "../types/profile.types";
import type { UserRole } from "@/types/roles";

export type ProfileDB = Tables<"profiles">;

export function mapProfile(db: ProfileDB): Profile {
  return {
    id: db.id,
    role: db.role as UserRole,
    first_name:db.first_name,
    last_name:db.last_name,
    status : db.status,
    full_name: `${db.first_name ?? ""} ${db.last_name ?? ""}`.trim(),
    email: db.email ?? "",
    avatar_url: db.avatar_url ?? undefined,
    phone: undefined,
    is_premium: db.is_premium ?? false,
    stripe_customer_id: undefined,
    created_at: db.created_at ?? "",
    updated_at: db.updated_at ?? "",
  };
}