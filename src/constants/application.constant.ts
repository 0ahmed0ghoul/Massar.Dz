import { Award, CheckCircle2, Clock, Eye, UserCheck, XCircle } from "lucide-react";

export const STATUS_OPTIONS = [
    "pending", "reviewing", "shortlisted", "interview", "rejected", "hired",
  ] as const;
  
export type AppStatus = typeof STATUS_OPTIONS[number];


export const STATUS_CONFIG: Record<AppStatus, {
    label: string; dot: string; classes: string; icon: React.ElementType;
  }> = {
    pending:     { label: "Pending",     dot: "bg-amber-400",   classes: "border-amber-500/20 bg-amber-500/10 text-amber-400",   icon: Clock        },
    reviewing:   { label: "Reviewing",   dot: "bg-sky-400",     classes: "border-sky-500/20   bg-sky-500/10   text-sky-400",     icon: Eye          },
    shortlisted: { label: "Shortlisted", dot: "bg-emerald-400", classes: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400", icon: CheckCircle2 },
    interview:   { label: "Interview",   dot: "bg-violet-400",  classes: "border-violet-500/20 bg-violet-500/10 text-violet-400", icon: UserCheck    },
    rejected:    { label: "Rejected",    dot: "bg-red-400",     classes: "border-red-500/20   bg-red-500/10   text-red-400",     icon: XCircle      },
    hired:       { label: "Hired",       dot: "bg-[#639922]",   classes: "border-[#639922]/20 bg-[#639922]/10 text-[#639922]",  icon: Award        },
  };