import { BookOpen, Check, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Path", icon: Sparkles },
  { label: "Account", icon: User },
  { label: "Academic", icon: BookOpen },
] as const;

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-6 sm:mb-8">
      {STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const Icon = step.icon;
        return (
          <div key={i} className="flex items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-bold transition-all",
                active
                  ? "border-[#639922]/50 bg-[#639922]/15 text-[#639922]"
                  : done
                  ? "border-[#639922]/30 bg-[#639922]/10 text-[#639922]/70"
                  : "border-white/[0.08] bg-white/[0.03] text-white/25"
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
            </div>
            <span
              className={cn(
                "mx-1.5 text-[11px] font-semibold transition-colors hidden sm:inline",
                active
                  ? "text-white/70"
                  : done
                  ? "text-white/40"
                  : "text-white/20"
              )}
            >
              {step.label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-1 h-px w-6 transition-all",
                  done ? "bg-[#639922]/40" : "bg-white/[0.06]"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}