// pages/company/CompanyApplicationsPage.tsx
import { useState } from "react";
import {
  Star, Users, Loader2, Eye, Calendar, Briefcase,
  ChevronDown, CheckCircle2, Award,
  UserCheck, Filter,
} from "lucide-react";
import { useCompanyJobs } from "@/features/company/hooks/useCompanyJobs";
import { useCompanyApplications } from "@/features/company/hooks/useCompanyApplications";
import { ApplicationDetailModal } from "../components/ApplicationDetailModal";
import { AppStatus, STATUS_CONFIG, STATUS_OPTIONS } from "@/constants/application.constant";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name: string) {
  return name.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2);
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}
function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as AppStatus] ?? STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold capitalize ${cfg.classes}`}>
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
function StatusSelect({
  value,
  disabled,
  onChange,
}: {
  value: string; disabled: boolean; onChange: (v: string) => void;
}) {
  const cfg = STATUS_CONFIG[value as AppStatus] ?? STATUS_CONFIG.pending;
  return (
    <div className="relative">
      <select
        value={value}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        className={`
          w-full appearance-none cursor-pointer rounded-lg border pl-3 pr-7 py-1.5
          text-[11px] font-semibold transition-all outline-none
          disabled:opacity-40 disabled:cursor-not-allowed
          ${cfg.classes}
        `}
      >
        {STATUS_OPTIONS.map(s => (
          <option key={s} value={s} className="bg-[#0f1117] text-white capitalize">{s}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 opacity-60" />
    </div>
  );
}
function StarRating({ rating, onRate }: { rating: number; onRate: (r: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(r => (
        <button
          key={r}
          type="button"
          onClick={e => { e.stopPropagation(); onRate(r); }}
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
function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: number | string; color: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5 py-4">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25">{label}</p>
        <p className="text-xl font-bold text-white/90 leading-tight">{value}</p>
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
  const name = `${app.student?.first_name ?? ""} ${app.student?.last_name ?? ""}`.trim();
  const initials = getInitials(name);
  const isUpdating = updating === app.id;

  const isPremiumLocked = true; // 👉 later connect to real subscription

  return (
    <div className="group relative flex flex-col rounded-2xl border border-white/[0.07] 
                    bg-white/[0.025] backdrop-blur-xl
                    transition-all duration-300 hover:border-[#639922]/25 hover:bg-white/[0.05]
                    hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] overflow-hidden">

      {/* ✨ subtle glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 
                      transition bg-gradient-to-br from-[#639922]/10 via-transparent to-transparent" />

      {/* ── Card body ── */}
      <div className="relative flex-1 p-5 space-y-4">

        {/* Top row */}
        <div className="flex items-start gap-3">

          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl
                            border border-white/[0.08] bg-white/[0.04] text-[12px] font-bold text-white/60">
              {app.student?.avatar_url
                ? <img src={app.student.avatar_url} className="h-full w-full rounded-xl object-cover" />
                : initials
              }
            </div>

            {/* Status dot */}
            <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0f1117]
              ${STATUS_CONFIG[app.status as AppStatus]?.dot ?? "bg-amber-400"}`} />
          </div>

          {/* Name */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[14px] text-white/90 truncate">{name || "—"}</p>
            <p className="text-[11px] text-white/35 truncate mt-0.5">
              {app.student?.email}
            </p>
          </div>

          {/* 🎯 Match Score (Premium) */}
          <div className="relative shrink-0 w-[70px] text-right">

            {/* content */}
            <div className={`transition ${isPremiumLocked ? "opacity-40" : ""}`}>
              <p className="text-[9px] uppercase text-white/25 tracking-widest">Match</p>
              <p className="text-sm font-bold text-[#639922]">
                {Math.round(app.match_score ?? 0)}%
              </p>
            </div>

            {/* 🔒 blur overlay */}
            {isPremiumLocked && (
              <div className="absolute inset-0 rounded-lg backdrop-blur-sm bg-black/30 
                              flex items-center justify-center">
                <span className="text-[10px] text-white/70 flex items-center gap-1">
                  🔒
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.04]" />

        {/* Meta */}
        <div className="space-y-2">

          {/* Rating */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-white/30">Rating</span>
            <StarRating rating={app.rating ?? 0} onRate={onRate} />
          </div>

          {/* Applied */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-white/30">Applied</span>
            <span className="text-[11px] font-medium text-white/50 flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {formatDate(app.created_at)}
            </span>
          </div>

          {/* Speciality */}
          {app.student?.speciality && (
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-white/30">Field</span>
              <span className="text-[11px] font-medium text-white/60 truncate max-w-[140px]">
                {app.student.speciality}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-white/[0.05] px-5 py-3 flex items-center gap-2 bg-white/[0.015]">

        {/* Status */}
        <div className="flex-1">
          <StatusSelect
            value={app.status}
            disabled={isUpdating}
            onChange={onStatusChange}
          />
        </div>

        {/* View */}
        <button
          onClick={onView}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#639922]/30
                     bg-[#639922]/15 px-3 py-1.5 text-[11px] font-semibold text-[#639922]
                     hover:bg-[#639922]/25 hover:border-[#639922]/50
                     hover:shadow-[0_4px_14px_rgba(99,153,34,0.25)]
                     transition-all"
        >
          {isUpdating
            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
            : <><Eye className="h-3.5 w-3.5" /> View</>
          }
        </button>
      </div>
    </div>
  );
}
function StatusFilter({
  active,
  onChange,
  counts,
}: {
  active: string;
  onChange: (s: string) => void;
  counts: Record<string, number>;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <button
        onClick={() => onChange("all")}
        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-semibold
                    transition-all duration-150 border
                    ${active === "all"
                      ? "border-[#639922]/25 bg-[#639922]/12 text-[#639922]"
                      : "border-transparent text-white/35 hover:text-white/60 hover:bg-white/[0.04]"
                    }`}
      >
        All
        <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none
          ${active === "all" ? "bg-[#639922]/20 text-[#639922]" : "bg-white/[0.07] text-white/30"}`}>
          {Object.values(counts).reduce((a, b) => a + b, 0)}
        </span>
      </button>
      {STATUS_OPTIONS.map(s => {
        const cfg = STATUS_CONFIG[s];
        const isActive = active === s;
        return (
          <button
            key={s}
            onClick={() => onChange(s)}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-semibold
                        transition-all duration-150 border capitalize
                        ${isActive
                          ? `${cfg.classes}`
                          : "border-transparent text-white/35 hover:text-white/60 hover:bg-white/[0.04]"
                        }`}
          >
            {isActive && <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${cfg.dot}`} />}
            {cfg.label}
            {(counts[s] ?? 0) > 0 && (
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none
                ${isActive ? "bg-white/20 text-inherit" : "bg-white/[0.07] text-white/30"}`}>
                {counts[s]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CompanyApplicationsPage() {
  const { jobs, loading: jobsLoading } = useCompanyJobs();
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    applications, loading, updating,
    updateStatus, updateRating, updateNotes,
  } = useCompanyApplications(selectedJobId || null);

  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Auto-select first job
  if (!selectedJobId && jobs.length > 0) setSelectedJobId(jobs[0].id);

  // ── Derived ────────────────────────────────────────────────────────────────

  const statusCounts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = applications.filter(a => a.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  const filtered = statusFilter === "all"
    ? applications
    : applications.filter(a => a.status === statusFilter);

  const hiredCount     = statusCounts.hired ?? 0;
  const shortlistedCount = statusCounts.shortlisted ?? 0;

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  // ── Loading ────────────────────────────────────────────────────────────────

  if (jobsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-[#639922]" />
          <p className="text-sm text-white/30">Loading jobs…</p>
        </div>
      </div>
    );
  }

  // ── No jobs ────────────────────────────────────────────────────────────────

  if (jobs.length === 0) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden">
        <div className="pointer-events-none fixed inset-0 bg-grid-pattern opacity-[0.035]" />
        <div className="pointer-events-none fixed -top-48 left-1/2 h-[500px] w-[700px]
                        -translate-x-1/3 rounded-full bg-[#639922]/[0.06] blur-[130px]" />
        <div className="relative flex flex-col items-center gap-5 text-center px-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.03]">
            <Briefcase className="h-7 w-7 text-white/20" />
          </div>
          <div>
            <p className="text-lg font-semibold text-white/50">No jobs posted yet</p>
            <p className="text-sm text-white/25 mt-1 max-w-sm">
              Post your first job to start receiving and managing applications.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 bg-grid-pattern opacity-[0.035]" />
      <div className="pointer-events-none fixed -top-48 left-1/2 h-[600px] w-[800px]
                      -translate-x-1/3 rounded-full bg-[#639922]/[0.07] blur-[140px]" />
      <div className="pointer-events-none fixed bottom-0 right-0 h-72 w-72
                      rounded-full bg-[#639922]/[0.04] blur-[90px] translate-x-1/3 translate-y-1/3" />
      <div className="pointer-events-none fixed top-0 left-0 right-0 h-px
                      bg-gradient-to-r from-transparent via-[#639922]/35 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">

        {/* ── Header ── */}
        <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#639922]/20
                               bg-[#639922]/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#639922]">
                <Briefcase className="h-3 w-3" /> Company Dashboard
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white/90">Applicant Dashboard</h1>
            <p className="text-sm text-white/35 max-w-lg">
              Review applications, rate candidates, update statuses and manage your hiring pipeline.
            </p>
          </div>
        </header>

        {/* ── Job selector ── */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
          <div className="flex items-center gap-3 border-b border-white/[0.05] px-6 py-4 bg-white/[0.01]">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#639922]/20 bg-[#639922]/10">
              <Briefcase className="h-4 w-4 text-[#639922]" />
            </div>
            <p className="text-sm font-semibold text-white/70">Select Job Position</p>
          </div>
          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Custom select */}
            <div className="relative sm:w-80">
              <select
                value={selectedJobId}
                onChange={e => { setSelectedJobId(e.target.value); setStatusFilter("all"); }}
                className="w-full appearance-none rounded-xl border border-white/[0.08] bg-white/[0.03]
                           px-4 py-2.5 pr-10 text-[13px] text-white/80
                           focus:border-[#639922]/40 focus:outline-none focus:ring-2 focus:ring-[#639922]/10
                           transition-all cursor-pointer"
              >
                {jobs.map(job => (
                  <option key={job.id} value={job.id} className="bg-[#0f1117] text-white">
                    {job.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            </div>

            {/* Selected job meta */}
            {selectedJob && (
              <div className="flex items-center gap-4 text-[12px] text-white/35">
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  {applications.length} applicant{applications.length !== 1 ? "s" : ""}
                </span>
                {selectedJob.status && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/[0.07]
                                   bg-white/[0.03] px-2.5 py-1 capitalize text-white/40">
                    {selectedJob.status}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Stats ── */}
        {applications.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard icon={Users}       label="Total"       value={applications.length}  color="border-[#639922]/20 bg-[#639922]/10 text-[#639922]" />
            <StatCard icon={CheckCircle2}label="Shortlisted" value={shortlistedCount}     color="border-emerald-500/20 bg-emerald-500/10 text-emerald-400" />
            <StatCard icon={UserCheck}   label="Interviews"  value={statusCounts.interview ?? 0} color="border-violet-500/20 bg-violet-500/10 text-violet-400" />
            <StatCard icon={Award}       label="Hired"       value={hiredCount}           color="border-amber-500/20 bg-amber-500/10 text-amber-400" />
          </div>
        )}

        {/* ── Applications ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24">
            <Loader2 className="h-6 w-6 animate-spin text-[#639922]" />
            <p className="text-sm text-white/30">Loading applications…</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border
                          border-dashed border-white/[0.07] bg-white/[0.01] py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.03]">
              <Users className="h-6 w-6 text-white/20" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/40">No applications yet</p>
              <p className="text-[12px] text-white/20 mt-1">Applications for this job will appear here</p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Filter pills */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-white/30">
                <Filter className="h-3.5 w-3.5" />
                <span className="text-[11px] font-semibold uppercase tracking-widest">Filter</span>
              </div>
              <StatusFilter
                active={statusFilter}
                onChange={setStatusFilter}
                counts={statusCounts}
              />
            </div>

            {/* Result count */}
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-white/25 font-mono">
                {filtered.length} of {applications.length} shown
              </p>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] py-14 text-center">
                <p className="text-sm text-white/30">No applications match this filter</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map(app => (
                  <AppCard
                    key={app.id}
                    app={app}
                    updating={updating}
                    onView={() => { setSelectedApp(app); setDetailOpen(true); }}
                    onStatusChange={val => updateStatus(app.id, val as any)}
                    onRate={r => updateRating(app.id, r)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom spacer */}
        <div className="flex items-center justify-center">
          <div className="h-px w-48 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        </div>
      </div>

      <ApplicationDetailModal
        application={selectedApp}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onUpdateStatus={updateStatus}
        onUpdateRating={updateRating}
        onUpdateNotes={updateNotes}
        updating={updating}
      />
    </div>
  );
}