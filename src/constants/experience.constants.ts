export const EXPERIENCE_TYPES = [
  { value: "job", label: "Full-time Job" },
  { value: "internship", label: "Internship" },
  { value: "volunteer", label: "Volunteering" },
  { value: "project", label: "Project" },
];

export const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-600" },
  reviewing: { label: "Reviewing", color: "bg-blue-600" },
  shortlisted: { label: "Shortlisted", color: "bg-emerald-600" },
  interview: { label: "Interview", color: "bg-purple-600" },
  rejected: { label: "Rejected", color: "bg-red-600" },
  hired: { label: "Hired", color: "bg-[#639922]" },
};