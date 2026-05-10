export const STATUS_OPTIONS = [
  "pending",
  "accepted",
  "rejected",
  "interview",
  "interview_scheduled",
] as const;

export type AppStatus = typeof STATUS_OPTIONS[number];

export const STATUS_CONFIG: Record<
  AppStatus,
  {
    label: string;
    classes: string;
    dot?: string;
  }
> = {
  pending: {
    label: "Pending",
    classes: `
      border-yellow-500/20
      bg-yellow-500/10
      text-yellow-300
      focus:border-yellow-500/40
      focus:ring-yellow-500/20
    `,
    dot: "bg-yellow-400",
  },

  accepted: {
    label: "Accepted",
    classes: `
      border-green-500/20
      bg-green-500/10
      text-green-300
      focus:border-green-500/40
      focus:ring-green-500/20
    `,
    dot: "bg-green-400",
  },

  rejected: {
    label: "Rejected",
    classes: `
      border-red-500/20
      bg-red-500/10
      text-red-300
      focus:border-red-500/40
      focus:ring-red-500/20
    `,
    dot: "bg-red-400",
  },

  interview: {
    label: "Interview",
    classes: `
      border-blue-500/20
      bg-blue-500/10
      text-blue-300
      focus:border-blue-500/40
      focus:ring-blue-500/20
    `,
    dot: "bg-blue-400",
  },

  interview_scheduled: {
    label: "Interview Scheduled",
    classes: `
      border-purple-500/20
      bg-purple-500/10
      text-purple-300
      focus:border-purple-500/40
      focus:ring-purple-500/20
    `,
    dot: "bg-purple-400",
  },
};