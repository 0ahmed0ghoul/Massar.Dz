

export const STATUS_OPTIONS = ["pending", "accepted", "rejected", "interview", "interview_scheduled"] as const;
export type AppStatus = typeof STATUS_OPTIONS[number];

export const STATUS_CONFIG: Record<AppStatus, { label: string; classes: string }> = {
  pending: { label: "Pending", classes: "border-yellow-500/30 text-yellow-400" },
  accepted: { label: "Accepted", classes: "border-green-500/30 text-green-400" },
  rejected: { label: "Rejected", classes: "border-red-500/30 text-red-400" },
  interview: { label: "Schedule Interview", classes: "border-blue-500/30 text-blue-400" },
  interview_scheduled: { label: "Interview Scheduled", classes: "border-purple-500/30 text-purple-400" },
};