export const CERTIFICATE_TYPES = [
    "stars",
    "major",
    "graduation",
    "hackathon",
    "english",
    "self_taught",
  ] as const;
  
export type CertificateType = typeof CERTIFICATE_TYPES[number];

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