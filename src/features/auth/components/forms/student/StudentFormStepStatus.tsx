import { Check, GraduationCap, Calendar, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  {
    id: "studying",
    label: "Currently Studying",
    sub: "I'm enrolled at a university",
    icon: GraduationCap,
    color: "text-sky-400",
    border: "border-sky-500/25",
    activeBg: "bg-sky-500/10",
  },
  {
    id: "graduated",
    label: "Graduated",
    sub: "I've completed my degree",
    icon: Calendar,
    color: "text-violet-400",
    border: "border-violet-500/25",
    activeBg: "bg-violet-500/10",
  },
  {
    id: "self_taught",
    label: "Self‑Taught",
    sub: "Learning independently",
    icon: Sparkles,
    color: "text-amber-400",
    border: "border-amber-500/25",
    activeBg: "bg-amber-500/10",
  },
];

export function StepStatus({
  status,
  onSelect,
}: {
  status: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold text-white/85">What's your learning path?</h2>
        <p className="text-[13px] text-white/35 mt-1">This helps us personalise your experience</p>
      </div>
      <div className="flex flex-col gap-3 max-w-sm mx-auto w-full">
        {STATUS_OPTIONS.map((opt) => {
          const active = status === opt.id;
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              className={cn(
                "flex items-center gap-4 rounded-2xl border p-4 text-left transition-all w-full",
                active
                  ? `${opt.activeBg} ${opt.border} shadow-[0_0_0_1px_rgba(99,153,34,0.1)]`
                  : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                  active
                    ? `${opt.activeBg} ${opt.border}`
                    : "border-white/[0.08] bg-white/[0.04]"
                )}
              >
                <Icon className={cn("h-5 w-5", active ? opt.color : "text-white/30")} />
              </div>
              <div className="flex-1">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    active ? "text-white/90" : "text-white/60"
                  )}
                >
                  {opt.label}
                </p>
                <p className="text-[12px] text-white/35">{opt.sub}</p>
              </div>
              {active && (
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#639922]/50 bg-[#639922]/20">
                  <Check className="h-3 w-3 text-[#639922]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}