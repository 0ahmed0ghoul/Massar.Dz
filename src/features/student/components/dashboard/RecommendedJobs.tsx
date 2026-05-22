// RecommendedJobs.tsx

import {
  Sparkles,
  Lock,
  CreditCard,
  Crown,
  Shield,
  Clock,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

import { useAuth } from "@/features/auth/contexts/AuthContext";
import { calculateMatchScore } from "@/features/company/service/application.service";


interface Job {
  id: string | number;
  title: string;
  company: string;
  location?: string;

  // REQUIRED FOR MATCHING
  skills?: string[] | string;
  experience_level?: string;
  job_type?: string;

  // optional existing score
  match?: number;
}

const RecommendedJobs = ({ jobs = [] }: { jobs?: Job[] }) => {
  const { profile } = useAuth();

  // =========================================================
  // PLAN LOGIC
  // =========================================================
  const planType = profile?.plan_type || "free";
  const planStatus = profile?.plan_status || "inactive";

  const isActive = planStatus === "active";
  const isPremium = planType === "premium" && isActive;
  const isBasic = planType === "basic" && isActive;
  const isPending = planStatus === "pending";
  const isRejected = planStatus === "rejected";

  // =========================================================
  // MATCHING LOGIC
  // SAME AS application.service.ts
  // =========================================================
  const jobsWithMatch = jobs
    .map((job) => ({
      ...job,
      calculatedMatch:
        job.match ||
        calculateMatchScore(profile, {
          ...job,
          skills: job.skills || [],
        }),
    }))
    .sort((a, b) => b.calculatedMatch - a.calculatedMatch);

  // =========================================================
  // MOCK DATA
  // =========================================================
  const mockJobs: Job[] = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "Google",
      location: "Mountain View, CA",
      skills: ["react", "javascript", "typescript"],
      experience_level: "mid",
      job_type: "full-time",
    },
    {
      id: 2,
      title: "Software Engineer",
      company: "Microsoft",
      location: "Remote",
      skills: ["nodejs", "react", "sql"],
      experience_level: "entry",
      job_type: "full-time",
    },
  ];

  const displayJobs =
    jobsWithMatch.length > 0
      ? jobsWithMatch
      : mockJobs.map((job) => ({
          ...job,
          calculatedMatch: calculateMatchScore(profile, job),
        }));

  // =========================================================
  // PENDING
  // =========================================================
  if (isPending) {
    return (
      <div className="rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-400/5 to-transparent p-6 text-center backdrop-blur-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-400/10">
          <Clock className="h-6 w-6 text-amber-400" />
        </div>

        <h3 className="text-lg font-bold text-foreground">
          Payment Pending
        </h3>

        <p className="mt-1 text-sm text-foreground/40">
          Your premium payment is being reviewed.
        </p>
      </div>
    );
  }

  // =========================================================
  // REJECTED
  // =========================================================
  if (isRejected) {
    return (
      <div className="rounded-2xl border border-red-400/30 bg-gradient-to-br from-red-400/5 to-transparent p-6 text-center backdrop-blur-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-400/10">
          <AlertCircle className="h-6 w-6 text-red-400" />
        </div>

        <h3 className="text-lg font-bold text-foreground">
          Payment Rejected
        </h3>

        <button
          onClick={() => (window.location.href = "/pricing")}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-500/20 px-6 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/30"
        >
          <CreditCard className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  // =========================================================
  // FREE PLAN
  // =========================================================
  if (!isPremium && !isBasic) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.02] to-white/[0.01] p-6 text-center backdrop-blur-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#639922]/10">
          <Lock className="h-6 w-6 text-[#639922]" />
        </div>

        <h3 className="text-lg font-bold text-foreground">
          Premium Feature
        </h3>

        <p className="my-2 text-sm text-foreground/40">
          Unlock AI-powered job recommendations tailored to your profile.
        </p>

        <button
          onClick={() =>
            (window.location.href = "/pricing?plan=premium")
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#639922] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#4f7a1a]"
        >
          <Crown className="h-4 w-4" />
          Upgrade to Premium
        </button>
      </div>
    );
  }

  // =========================================================
  // BASIC PLAN
  // =========================================================
  if (isBasic) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
        <div className="mb-6 flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-400" />

          <h2 className="text-lg font-bold text-foreground">
            Basic Recommendations
          </h2>
        </div>

        <div className="space-y-4">
          {displayJobs.slice(0, 3).map((job) => (
            <div
              key={job.id}
              className="rounded-xl border border-white/[0.05] bg-white/[0.03] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[15px] font-bold text-foreground">
                    {job.title}
                  </p>

                  <p className="text-xs text-foreground/50">
                    {job.company} • {job.location || "Remote"}
                  </p>
                </div>

                <div className="rounded bg-blue-400/10 px-2 py-1 text-[11px] font-bold text-blue-400">
                  {job.calculatedMatch}% Match
                </div>
              </div>

              <div className="mt-4">
                <a
                  href={`/experience/${job.id}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-foreground/70 transition hover:bg-white/10"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View Job Post
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // =========================================================
  // PREMIUM PLAN
  // =========================================================
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#639922]" />

          <h2 className="text-lg font-bold text-foreground">
            Recommended for You
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Crown className="h-3 w-3 text-[#639922]" />

          <span className="text-xs text-[#639922]">
            Premium Plan
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {displayJobs.map((job) => (
          <div
            key={job.id}
            className="group relative rounded-xl border border-white/[0.05] bg-gradient-to-r from-white/[0.04] to-transparent p-4 transition-all hover:border-[#639922]/30"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[15px] font-bold text-foreground transition-colors group-hover:text-[#639922]">
                  {job.title}
                </p>

                <p className="text-xs text-foreground/50">
                  {job.company} • {job.location || "Remote"}
                </p>
              </div>

              <div className="rounded bg-[#639922]/10 px-2 py-0.5 text-[11px] font-bold text-[#639922]">
                {job.calculatedMatch}% Match
              </div>
            </div>

            <div className="mt-4">
              <a
                href={`/experience/${job.id}`}
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-xs font-medium text-foreground/70 transition hover:bg-white/10"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View Job Post
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedJobs;