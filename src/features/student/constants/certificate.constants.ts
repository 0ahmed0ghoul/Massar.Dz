import { CertificateType } from "../types/certificate.types";

export const CERTIFICATE_TYPES: { value: CertificateType; label: string; icon: string; isUniversity: boolean }[] = [
  { value: "stars", label: "Stars Certificate", icon: "⭐", isUniversity: true },
  { value: "major", label: "Major Certificate", icon: "🎓", isUniversity: true },
  { value: "hackathon", label: "Hackathon / Competition", icon: "🏆", isUniversity: false },
  { value: "english", label: "English Certificate", icon: "🌐", isUniversity: false },
  { value: "self_taught", label: "Self‑Taught / Online Course", icon: "📚", isUniversity: false },
];

export const STAR_ACHIEVEMENTS = [
  { id: "major", label: "Major Excellence", description: "Being top of your major" },
  { id: "delegate", label: "Student Delegate", description: "Active student representation" },
  { id: "internship", label: "Internship Completion", description: "Completed an internship" },
  { id: "club", label: "Club Participation", description: "Active member of a student club" },
  { id: "language", label: "Language Certificate", description: "Official language certificate (TOEFL, IELTS, etc.)" },
];
