// components/ProfileCompletionJourney.tsx
import { cn } from "@/lib/utils";
import { CheckCircle2, Lock, Clock } from "lucide-react";

export interface Step {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    status: "completed" | "current" | "pending" | "locked";
  }

interface ProfileCompletionJourneyProps {
  currentStep: number;
  steps: Step[];
}

export const ProfileCompletionJourney = ({
  currentStep,
  steps,
}: ProfileCompletionJourneyProps) => {
  return (
    <div className="w-full overflow-x-auto py-6">
      <div className="flex min-w-max items-start justify-between gap-4 md:min-w-0 md:justify-start">
        {steps.map((step, idx) => {
          const isActive = idx === currentStep;
          const isCompleted = step.status === "completed";
          const isLocked = step.status === "locked";
          const isPending = step.status === "pending";

          return (
            <div
              key={step.id}
              className={cn(
                "relative flex flex-1 flex-col items-center text-center transition-all duration-300",
                idx !== steps.length - 1 && "md:flex-row md:items-start"
              )}
            >
              {/* Connector line (except last) */}
              {idx !== steps.length - 1 && (
                <div
                  className={cn(
                    "absolute left-[calc(50%+1.5rem)] top-5 hidden h-[2px] w-[calc(100%-3rem)] md:block",
                    isCompleted ? "bg-primary" : "bg-theme-border"
                  )}
                />
              )}

              {/* Step icon */}
              <div
                className={cn(
                  "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                  isCompleted && "border-primary bg-primary text-white",
                  isActive && !isCompleted && "border-primary bg-primary/10 text-primary",
                  isPending && "border-amber-500 bg-amber-500/10 text-amber-500",
                  isLocked && "border-theme-border bg-theme-muted/10 text-theme-muted"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : isPending ? (
                  <Clock className="h-5 w-5 animate-pulse" />
                ) : isLocked ? (
                  <Lock className="h-5 w-5" />
                ) : (
                  step.icon
                )}
              </div>

              {/* Text content */}
              <div className="mt-3 max-w-[140px] md:ml-4 md:mt-0 md:text-left">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    isCompleted && "text-primary",
                    isActive && "text-theme-text",
                    isLocked && "text-theme-muted"
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-theme-muted">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};