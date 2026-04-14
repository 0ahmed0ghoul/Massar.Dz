import { Tables } from "@/types/database";

export type Profile = Tables<"profiles">;
export type Job = Tables<"jobs">;
export type Application = Tables<"applications">;
export type Interview = Tables<"interviews">;
export type Activity = Tables<"notifications">; // Replace "activities" with a valid constraint