// pages/company/CompanyApplicationsPage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  Users,
  Loader2,
  Eye,
  Calendar,
  Briefcase,
  ChevronDown,
  CheckCircle2,
  Award,
  UserCheck,
} from "lucide-react";

import { useCompanyJobs } from "@/features/company/hooks/useCompanyJobs";
import { useCompanyApplications } from "@/features/company/hooks/useCompanyApplications";

import {
  AppStatus,
  STATUS_CONFIG,
  STATUS_OPTIONS,
} from "@/constants/application.constant";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatusSelect({
  value,
  disabled,
  onChange,
}: {
  value: string;
  disabled: boolean;
  onChange: (v: string) => void;
}) {
  const cfg =
    STATUS_CONFIG[value as AppStatus] ?? STATUS_CONFIG.pending;

  return (
    <div className="relative">
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full appearance-none cursor-pointer rounded-lg border pl-3 pr-7 py-1.5
          text-[11px] font-semibold transition-all outline-none
          disabled:opacity-40 disabled:cursor-not-allowed
          ${cfg.classes}
        `}
      >
        {STATUS_OPTIONS.map((s) => (
          <option
            key={s}
            value={s}
            className="bg-[#0f1117] text-white capitalize"
          >
            {s}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 opacity-60" />
    </div>
  );
}

function StarRating({
  rating,
  onRate,
}: {
  rating: number;
  onRate: (r: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((r) => (
        <button
          key={r}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRate(r);
          }}
          onMouseEnter={() => setHover(r)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Star
            className={`h-3.5 w-3.5 transition-colors ${
              r <= (hover || rating)
                ? "fill-amber-400 text-amber-400"
                : "text-white/15 hover:text-amber-400/40"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5 py-4">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${color}`}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25">
          {label}
        </p>

        <p className="text-xl font-bold text-white/90 leading-tight">
          {value}
        </p>
      </div>
    </div>
  );
}

function AppCard({
  app,
  updating,
  onView,
  onStatusChange,
  onRate,
}: {
  app: any;
  updating: string | null;
  onView: () => void;
  onStatusChange: (v: string) => void;
  onRate: (r: number) => void;
}) {
  const name = `${app.student?.first_name ?? ""} ${
    app.student?.last_name ?? ""
  }`.trim();

  const initials = getInitials(name);

  const isUpdating = updating === app.id;

  const isPremiumLocked = true;

  return (
    <div
      className="
        group relative flex flex-col rounded-2xl border border-white/[0.07]
        bg-white/[0.025] backdrop-blur-xl
        transition-all duration-300 hover:border-[#639922]/25
        hover:bg-white/[0.05]
        hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]
        overflow-hidden
      "
    >
      <div
        className="
          pointer-events-none absolute inset-0 opacity-0
          group-hover:opacity-100 transition
          bg-gradient-to-br from-[#639922]/10 via-transparent to-transparent
        "
      />

      <div className="relative flex-1 p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <div
              className="
                flex h-11 w-11 items-center justify-center rounded-xl
                border border-white/[0.08]
                bg-white/[0.04]
                text-[12px] font-bold text-white/60
              "
            >
              {app.student?.avatar_url ? (
                <img
                  src={app.student.avatar_url}
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <span
              className={`
                absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5
                rounded-full border-2 border-[#0f1117]
                ${
                  STATUS_CONFIG[app.status as AppStatus]?.dot ??
                  "bg-amber-400"
                }
              `}
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[14px] text-white/90 truncate">
              {name || "—"}
            </p>

            <p className="text-[11px] text-white/35 truncate mt-0.5">
              {app.student?.email}
            </p>
          </div>

          <div className="relative shrink-0 w-[70px] text-right">
            <div
              className={`transition ${
                isPremiumLocked ? "opacity-40" : ""
              }`}
            >
              <p className="text-[9px] uppercase text-white/25 tracking-widest">
                Match
              </p>

              <p className="text-sm font-bold text-[#639922]">
                {Math.round(app.match_score ?? 0)}%
              </p>
            </div>

            {isPremiumLocked && (
              <div
                className="
                  absolute inset-0 rounded-lg backdrop-blur-sm
                  bg-black/30 flex items-center justify-center
                "
              >
                <span className="text-[10px] text-white/70">🔒</span>
              </div>
            )}
          </div>
        </div>

        <div className="h-px bg-white/[0.04]" />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-white/30">
              Rating
            </span>

            <StarRating
              rating={app.rating ?? 0}
              onRate={onRate}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-white/30">
              Applied
            </span>

            <span className="text-[11px] font-medium text-white/50 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(app.created_at)}
            </span>
          </div>

          {app.student?.speciality && (
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-white/30">
                Field
              </span>

              <span className="text-[11px] font-medium text-white/60 truncate max-w-[140px]">
                {app.student.speciality}
              </span>
            </div>
          )}
        </div>
      </div>

      <div
        className="
          border-t border-white/[0.05]
          px-5 py-3 flex items-center gap-2
          bg-white/[0.015]
        "
      >
        <div className="flex-1">
          <StatusSelect
            value={app.status}
            disabled={isUpdating}
            onChange={onStatusChange}
          />
        </div>

        <button
          onClick={onView}
          className="
            inline-flex items-center gap-1.5 rounded-lg
            border border-[#639922]/30
            bg-[#639922]/15 px-3 py-1.5
            text-[11px] font-semibold text-[#639922]
            hover:bg-[#639922]/25
            hover:border-[#639922]/50
            hover:shadow-[0_4px_14px_rgba(99,153,34,0.25)]
            transition-all
          "
        >
          {isUpdating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <>
              <Eye className="h-3.5 w-3.5" />
              View
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export default function CompanyApplicationsPage() {
  const navigate = useNavigate();

  const { jobs, loading: jobsLoading } = useCompanyJobs();

  const [selectedJobId, setSelectedJobId] =
    useState<string>("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const {
    applications,
    loading,
    updating,
    updateStatus,
    updateRating,
  } = useCompanyApplications(selectedJobId || null);

  if (!selectedJobId && jobs.length > 0) {
    setSelectedJobId(jobs[0].id);
  }

  const statusCounts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = applications.filter(
      (a) => a.status === s
    ).length;

    return acc;
  }, {} as Record<string, number>);

  const filtered =
    statusFilter === "all"
      ? applications
      : applications.filter(
          (a) => a.status === statusFilter
        );

  if (jobsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-[#639922]" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white/90">
            Applicant Dashboard
          </h1>

          <p className="text-sm text-white/35 max-w-lg">
            Review applications and manage your hiring pipeline.
          </p>
        </header>

        {/* Job Selector */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
          <div className="relative sm:w-80">
            <select
              value={selectedJobId}
              onChange={(e) => {
                setSelectedJobId(e.target.value);
                setStatusFilter("all");
              }}
              className="
                w-full appearance-none rounded-xl
                border border-white/[0.08]
                bg-white/[0.03]
                px-4 py-2.5 pr-10
                text-[13px] text-white/80
              "
            >
              {jobs.map((job) => (
                <option
                  key={job.id}
                  value={job.id}
                  className="bg-[#0f1117] text-white"
                >
                  {job.title}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          </div>
        </div>

        {/* Stats */}
        {applications.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              icon={Users}
              label="Total"
              value={applications.length}
              color="border-[#639922]/20 bg-[#639922]/10 text-[#639922]"
            />

            <StatCard
              icon={Award}
              label="Hired"
              value={statusCounts.hired ?? 0}
              color="border-amber-500/20 bg-amber-500/10 text-amber-400"
            />

            <StatCard
              icon={UserCheck}
              label="Interview"
              value={statusCounts.interview ?? 0}
              color="border-violet-500/20 bg-violet-500/10 text-violet-400"
            />

            <StatCard
              icon={CheckCircle2}
              label="Shortlisted"
              value={statusCounts.shortlisted ?? 0}
              color="border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
            />
          </div>
        )}

        {/* Applications */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-[#639922]" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                updating={updating}
                onView={() =>
                  navigate(
                    `/company/dashboard/application?job=${app.job_id}&candidate=${app.student_id}`
                  )
                }
                onStatusChange={(val) =>
                  updateStatus(app.id, val as any)
                }
                onRate={(r) =>
                  updateRating(app.id, r)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}