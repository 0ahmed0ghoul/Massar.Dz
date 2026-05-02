// domain/certificate.types.ts
export type CertificateType = "stars" | "major" | "graduation" | "hackathon" | "english" | "self_taught";

export interface Certificate {
    id: string;
    user_id: string;
    type: CertificateType;
    title: string;
    issuer: string;
    issue_date: string;
    expiry_date?: string;
    credential_id?: string;
    file_url?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface GraduationToken {
    id: string;
    token: string;
    student_id: string;
    university_id: string;
    certificate_id?: string;
    scanned_at?: string;
    expires_at: string;
    created_at: string;
}