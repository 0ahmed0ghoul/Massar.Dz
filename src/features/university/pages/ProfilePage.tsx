// pages/UniversityProfilePage.tsx
import { ThemeToggle } from "@/features/student/components/ThemeToggle.tsx";
import { useUniversityProfile } from "../hooks/useUniversityProfile";
import UniversityProfileHeader from "../components/UniversityProfileHeader";
import UniversityProfileForm from "../components/UniversityProfileForm";
import UniversityConnectionsCard from "../components/UniversityConnectionsCard";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { 
  BookOpen, GraduationCap, Loader2, Building2, ChevronRight, 
  Sparkles, Landmark, Users, Clock, MessageCircleMore 
} from "lucide-react";
import { Link } from "react-router-dom";

// ─── Loading Screen ───────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-[0.03]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/3 rounded-full bg-[#639922]/[0.07] blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#639922]/[0.04] blur-[80px]" />

      <div className="relative flex flex-col items-center gap-5">
        {/* Spinner ring */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-[#639922]/10" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#639922]" />
          <Building2 className="h-6 w-6 text-[#639922]/60" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-white/50">Loading university profile</p>
          <div className="mt-2 flex justify-center gap-1">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="h-1 w-1 rounded-full bg-[#639922]/60 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-[0.03]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/3 rounded-full bg-[#639922]/[0.06] blur-[120px]" />
      <div className="relative text-center max-w-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
          <Building2 className="h-7 w-7 text-white/25" />
        </div>
        <h2 className="text-lg font-semibold text-white/70 mb-2">No Profile Found</h2>
        <p className="text-sm text-white/35 leading-relaxed">
          Please complete your registration to set up your university profile.
        </p>
      </div>
    </div>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────

function Section({
  children,
  className = "",
  accent = false,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={style}
      className={`
        group relative rounded-2xl border transition-all duration-300
        ${accent
          ? "border-[#639922]/20 bg-gradient-to-br from-[#639922]/[0.06] to-white/[0.02] hover:border-[#639922]/35 hover:shadow-[0_0_40px_rgba(99,153,34,0.08)]"
          : "border-white/[0.07] bg-white/[0.025] hover:border-white/[0.12] hover:bg-white/[0.035]"
        }
        ${className}
      `}
    >
      {/* Subtle inner glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
                      bg-gradient-to-br from-white/[0.02] to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ─── Section Label ────────────────────────────────────────────────────────────

function SectionLabel({ icon: Icon, label, sub }: {
  icon: React.ElementType; label: string; sub?: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-white/[0.05] px-6 py-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#639922]/20 bg-[#639922]/10 shrink-0">
        <Icon className="h-4 w-4 text-[#639922]" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white/80">{label}</p>
        {sub && <p className="text-[11px] text-white/30 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Quick Action Card ────────────────────────────────────────────────────────

function QuickActionCard({ 
  icon: Icon, 
  title, 
  description, 
  to, 
  badge 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  to: string;
  badge?: string;
}) {
  return (
    <Link to={to}>
      <div className="group relative rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 hover:border-[#639922]/30 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#639922]/20 bg-[#639922]/10">
            <Icon className="h-5 w-5 text-[#639922]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white/80">{title}</h3>
              {badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#639922]/20 text-[#639922] font-medium">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-xs text-white/35 mt-1">{description}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-[#639922] transition-colors shrink-0 mt-1" />
        </div>
      </div>
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const UniversityProfilePage = () => {
  const { profile } = useAuth();
  const univAdminType = profile?.univ_admin_type; // 'head_of_department' or 'rectorate'
  const isRectorate = univAdminType === 'rectorate';
  const isDepartmentHead = univAdminType === 'head_of_department';

  const {
    university,
    loading,
    saving,
    uploadingLogo,
    updateUniversity,
    uploadLogo,
    deleteLogo,
    connectedStudents,
    pendingRequests,
    acceptRequest,
    rejectRequest,
  } = useUniversityProfile();

  if (loading) return <LoadingScreen />;
  if (!university) return <EmptyState />;

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">

      {/* ── Background layers ── */}
      {/* Grid texture */}
      <div className="pointer-events-none fixed inset-0 bg-grid-pattern opacity-[0.035]" />

      {/* Primary green orb — top center */}
      <div className="pointer-events-none fixed -top-48 left-1/2 h-[600px] w-[800px] -translate-x-1/3
                      rounded-full bg-[#639922]/[0.08] blur-[140px]" />

      {/* Secondary soft orb — bottom right */}
      <div className="pointer-events-none fixed bottom-0 right-0 h-80 w-80
                      rounded-full bg-[#639922]/[0.04] blur-[100px] translate-x-1/3 translate-y-1/3" />

      {/* Thin accent line at very top */}
      <div className="pointer-events-none fixed top-0 left-0 right-0 h-px
                      bg-gradient-to-r from-transparent via-[#639922]/40 to-transparent" />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

        {/* ── Page header ── */}
        <header className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">

            {/* Title */}
            <h1 className="text-3xl font-bold tracking-tight text-white/90 sm:text-4xl">
              {isRectorate ? 'University Profile' : 'Department Profile'}
            </h1>
            <p className="text-sm text-white/35 max-w-md leading-relaxed">
              {isRectorate 
                ? 'Manage your university\'s information, oversee all departments, and view analytics.'
                : 'Manage your department\'s information, handle connection requests, and communicate with students.'
              }
            </p>
          </div>

          {/* Actions cluster */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <ThemeToggle />
          </div>
        </header>
        {/* ── Cards stack ── */}
        <div className="space-y-5">
          {/* 2 — Profile form card */}
          <Section style={{ animationDelay: "60ms" }}>
            <SectionLabel
              icon={Sparkles}
              label="Profile Information"
              sub={isRectorate 
                ? "University details, contact information and description"
                : "Department details, contact information and description"
              }
            />
            <div className="p-6">
              <UniversityProfileForm
                university={university}
                saving={saving}
                uploadingLogo={uploadingLogo}
                updateUniversity={updateUniversity}
                uploadLogo={uploadLogo}
                deleteLogo={deleteLogo}
              />
            </div>
          </Section>

          {/* 3 — Department Head: Connection Management */}
          {isDepartmentHead && (
            <Section style={{ animationDelay: "120ms" }}>
              <SectionLabel
                icon={Users}
                label="Connection Management"
                sub="Review and manage student connections"
              />
              <div className="p-6">
                <UniversityConnectionsCard
                  connectedStudents={connectedStudents}
                  pendingRequests={pendingRequests}
                  onAccept={acceptRequest}
                  onReject={rejectRequest}
                />
              </div>
            </Section>
          )}

        </div>

        {/* ── Footer spacer ── */}
        <div className="mt-12 flex items-center justify-center">
          <div className="h-px w-48 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        </div>

      </div>
    </div>
  );
};

export default UniversityProfilePage;