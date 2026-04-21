// components/ProfileCompletionJourney.tsx
import { cn } from "@/lib/utils";
import { CheckCircle2, Lock, Clock } from "lucide-react";
import React from "react";

export interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "completed" | "current" | "pending" | "locked";
}

interface ProfileCompletionJourneyProps {
  steps: Step[];
}

export const ProfileCompletionJourney = ({ steps }: ProfileCompletionJourneyProps) => {
  return (
    <div className="w-full py-4">

      {/* ================= MOBILE (VERTICAL) ================= */}
      <div className="flex flex-col gap-6 md:hidden">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex items-start gap-4">

            {/* ICON + LINE */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full transition-all",
                  step.status === "completed" &&
                    "bg-gradient-to-br from-[#639922] to-[#4f7a1a] text-foreground",
                  step.status === "current" &&
                    "border-2 border-[#639922] bg-[#639922]/10 text-[#639922]",
                  step.status === "pending" &&
                    "border-2 border-amber-500 bg-amber-500/10 text-amber-500",
                  step.status === "locked" &&
                    "border border-white/[0.12] bg-white/[0.04] text-foreground/30"
                )}
              >
                {step.status === "completed" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : step.status === "pending" ? (
                  <Clock className="h-4 w-4 animate-pulse" />
                ) : step.status === "locked" ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <div className="scale-90">{step.icon}</div>
                )}
              </div>

              {/* LINE */}
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    "mt-2 h-10 w-[2px]",
                    step.status === "completed"
                      ? "bg-[#639922]"
                      : "bg-white/[0.1]"
                  )}
                />
              )}
            </div>

            {/* TEXT */}
            <div>
              <p
                className={cn(
                  "text-sm font-semibold",
                  step.status === "completed" && "text-[#639922]",
                  step.status === "current" && "text-foreground",
                  step.status === "locked" && "text-foreground/30"
                )}
              >
                {step.title}
              </p>
              <p className="text-xs text-foreground/40">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ================= DESKTOP (HORIZONTAL) ================= */}
      <div className="hidden md:block overflow-x-auto">
        <div className="flex items-center justify-between gap-2 min-w-[700px]">

          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              {/* STEP */}
              <div className="flex flex-col items-center text-center">

                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300",
                    step.status === "completed" &&
                      "bg-gradient-to-br from-[#639922] to-[#4f7a1a] text-foreground shadow-lg shadow-[#639922]/30",
                    step.status === "current" &&
                      "border-2 border-[#639922] bg-[#639922]/10 text-[#639922]",
                    step.status === "pending" &&
                      "border-2 border-amber-500 bg-amber-500/10 text-amber-500",
                    step.status === "locked" &&
                      "border border-white/[0.12] bg-white/[0.04] text-foreground/30"
                  )}
                >
                  {step.status === "completed" ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : step.status === "pending" ? (
                    <Clock className="h-5 w-5 animate-pulse" />
                  ) : step.status === "locked" ? (
                    <Lock className="h-5 w-5" />
                  ) : (
                    <div>{step.icon}</div>
                  )}
                </div>

                <div className="mt-3 max-w-[120px]">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      step.status === "completed" && "text-[#639922]",
                      step.status === "current" && "text-foreground",
                      step.status === "locked" && "text-foreground/30"
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-foreground/40">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* CONNECTOR */}
              {idx < steps.length - 1 && (
                <div className="flex-1 h-[2px] mx-2">
                  <div
                    className={cn(
                      "h-full w-full rounded-full",
                      step.status === "completed"
                        ? "bg-gradient-to-r from-[#639922] to-[#639922]/40"
                        : "bg-white/[0.08]"
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          ))}

        </div>
      </div>
    </div>
  );
};