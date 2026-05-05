import { Tables } from "@/types/database";

export type Profile = Tables<"profiles">;
export type Job = Tables<"jobs">;
export type Application = Tables<"applications">;
export type Interview = Tables<"interviews">;
export type Activity = Tables<"notifications">; // Replace "activities" with a valid constraint

export type CertificateType = "stars" | "major" | "hackathon" | "english" | "self_taught";

export interface AddCertificateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (request: {
    type: CertificateType;
    title: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialId?: string;
    files?: Record<string, File>;
    achievements?: string[];
  }) => void;
}
