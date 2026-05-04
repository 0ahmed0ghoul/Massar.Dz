// features/admin/components/AccountsTable.tsx
import {
  Eye, Trash2, UserCheck, Building2, GraduationCap,
  Briefcase, ChevronDown, Loader2, Mail, CheckCircle2,
  Clock, XCircle, Wifi, WifiOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Profile } from "../types/verification.types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AccountsTableProps {
  profiles: Profile[];
  actionLoading: string | null;
  sendingInvite: string | null;
  onStatusChange: (id: string, status: string) => Promise<void>;
  onDelete: (id: string, name: string) => Promise<void>;
  onSendInvitation: (profile: Profile) => Promise<void>;
}

type StatusValue = "active" | "pending" | "rejected";
type ConnectionStatus = "null" | "pending" | "accepted" | "rejected";

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLE_ICONS = {
  student: GraduationCap,
  graduate: GraduationCap,
  professional: Briefcase,
  company_admin: Building2,
  university_admin: Building2,
  super_admin: UserCheck,
} as const;

const ROLE_LABELS: Record<string, string> = {
  student: "Student",
  graduate: "Graduate",
  professional: "Professional",
  company_admin: "Company",
  university_admin: "University",
  super_admin: "Admin",
};

const ROLE_COLORS: Record<string, string> = {
  student: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  graduate: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  professional: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  company_admin: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  university_admin: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  super_admin: "bg-[#639922]/10 text-[#639922] border-[#639922]/20",
};

const STATUS_CONFIG: Record<StatusValue, { icon: React.ElementType; classes: string; dot: string }> = {
  active: {
    icon: CheckCircle2,
    classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  pending: {
    icon: Clock,
    classes: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    dot: "bg-amber-400",
  },
  rejected: {
    icon: XCircle,
    classes: "bg-red-500/10 text-red-400 border-red-500/20",
    dot: "bg-red-400",
  },
};

const CONNECTION_CONFIG: Record<ConnectionStatus, { label: string; classes: string; icon: React.ElementType }> = {
  null: { label: "Not Connected", classes: "text-white/30", icon: WifiOff },
  pending: { label: "Invite Sent", classes: "text-amber-400", icon: Clock },
  accepted: { label: "Connected", classes: "text-emerald-400", icon: Wifi },
  rejected: { label: "Rejected", classes: "text-red-400", icon: WifiOff },
};

const STATUS_OPTIONS: { value: StatusValue; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: string }) {
  const Icon = ROLE_ICONS[role as keyof typeof ROLE_ICONS] ?? UserCheck;
  const colorClass = ROLE_COLORS[role] ?? "bg-white/5 text-white/50 border-white/10";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${colorClass}`}>
      <Icon className="h-3 w-3" />
      {ROLE_LABELS[role] ?? role}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as StatusValue] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${cfg.classes}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot} shrink-0`} />
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

function StatusSelect({
  value,
  disabled,
  onChange,
}: {
  value: string;
  disabled: boolean;
  onChange: (val: string) => void;
}) {
  const cfg = STATUS_CONFIG[value as StatusValue] ?? STATUS_CONFIG.pending;
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          appearance-none cursor-pointer rounded-lg border pl-3 pr-7 py-1.5
          text-[11px] font-medium transition-all outline-none
          disabled:cursor-not-allowed disabled:opacity-40
          ${cfg.classes}
        `}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#0f1117] text-white">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 opacity-60" />
    </div>
  );
}

function ConnectionCell({
  profile,
  sendingInvite,
  onSendInvitation,
}: {
  profile: Profile;
  sendingInvite: string | null;
  onSendInvitation: (p: Profile) => Promise<void>;
}) {
  if (profile.role !== "student") {
    return <span className="text-xs text-white/20">—</span>;
  }
  const key = (profile.university_connection_status ?? "null") as ConnectionStatus;
  const cfg = CONNECTION_CONFIG[key] ?? CONNECTION_CONFIG["null"];
  const Icon = cfg.icon;
  const isSending = sendingInvite === profile.id;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${cfg.classes}`}>
        <Icon className="h-3.5 w-3.5" />
        {cfg.label}
      </span>
      {key === "null" && (
        <button
          onClick={() => onSendInvitation(profile)}
          disabled={isSending}
          className="inline-flex items-center gap-1 rounded-md border border-[#639922]/30
                     bg-[#639922]/10 px-2 py-0.5 text-[11px] font-medium text-[#639922]
                     hover:bg-[#639922]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? (
            <><Loader2 className="h-3 w-3 animate-spin" /> Sending…</>
          ) : (
            <><Mail className="h-3 w-3" /> Invite</>
          )}
        </button>
      )}
      {key === "pending" && (
        <span className="text-[11px] text-amber-400/60 italic">Awaiting reply</span>
      )}
    </div>
  );
}

// ─── Desktop Row ──────────────────────────────────────────────────────────────

function DesktopRow({
  profile,
  actionLoading,
  sendingInvite,
  onStatusChange,
  onDelete,
  onSendInvitation,
  navigate,
}: {
  profile: Profile;
  actionLoading: string | null;
  sendingInvite: string | null;
  onStatusChange: (id: string, status: string) => Promise<void>;
  onDelete: (id: string, name: string) => Promise<void>;
  onSendInvitation: (p: Profile) => Promise<void>;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const RoleIcon = ROLE_ICONS[profile.role as keyof typeof ROLE_ICONS] ?? UserCheck;
  const isLoading =
    actionLoading === profile.id ||
    actionLoading === `status-${profile.id}` ||
    actionLoading === `delete-${profile.id}`;
  const fullName = `${profile.first_name} ${profile.last_name}`;

  return (
    <tr className="group border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors duration-150">
      {/* User */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#639922]/20 to-[#639922]/5 border border-[#639922]/15">
              <RoleIcon className="h-4 w-4 text-[#639922]" />
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0f1117] ${
                STATUS_CONFIG[profile.status as StatusValue]?.dot ?? "bg-amber-400"
              }`}
            />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-white/90 truncate">{fullName}</p>
            <p className="text-[11px] text-white/35 truncate">{profile.email}</p>
            {(profile.university_name || profile.company_name) && (
              <p className="text-[11px] text-white/25 truncate mt-0.5">
                {profile.university_name ?? profile.company_name}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="px-5 py-3.5">
        <RoleBadge role={profile.role} />
      </td>

      {/* Status */}
      <td className="px-5 py-3.5">
        <StatusSelect
          value={profile.status ?? "active"}
          disabled={isLoading}
          onChange={(val) => onStatusChange(profile.id, val)}
        />
      </td>

      {/* Connection */}
      <td className="px-5 py-3.5">
        <ConnectionCell
          profile={profile}
          sendingInvite={sendingInvite}
          onSendInvitation={onSendInvitation}
        />
      </td>

      {/* Actions */}
      <td className="px-5 py-3.5">
        <div className="flex items-center justify-end gap-2">
          {/* Preview — always visible, labelled */}
          <button
            onClick={() =>
              navigate(`/dashboard/admin/pending/${profile.id}`, { state: { profile } })
            }
            title="Preview profile"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#639922]/25
                       bg-[#639922]/10 px-2.5 py-1.5 text-[11px] font-medium text-[#639922]
                       hover:bg-[#639922]/20 hover:border-[#639922]/40
                       transition-all duration-150"
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </button>
          {/* Delete */}
          <button
            onClick={() => onDelete(profile.id, fullName)}
            disabled={isLoading}
            title="Delete Account"
            className="flex h-7 w-7 items-center justify-center rounded-lg
                       bg-red-500/5 text-red-400/60 border border-red-500/10
                       hover:bg-red-500/15 hover:text-red-400 hover:border-red-500/25
                       transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isLoading && actionLoading === `delete-${profile.id}` ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Mobile Card ──────────────────────────────────────────────────────────────

function MobileCard({
  profile,
  actionLoading,
  sendingInvite,
  onStatusChange,
  onDelete,
  onSendInvitation,
  navigate,
}: {
  profile: Profile;
  actionLoading: string | null;
  sendingInvite: string | null;
  onStatusChange: (id: string, status: string) => Promise<void>;
  onDelete: (id: string, name: string) => Promise<void>;
  onSendInvitation: (p: Profile) => Promise<void>;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const RoleIcon = ROLE_ICONS[profile.role as keyof typeof ROLE_ICONS] ?? UserCheck;
  const isLoading =
    actionLoading === profile.id ||
    actionLoading === `status-${profile.id}` ||
    actionLoading === `delete-${profile.id}`;
  const fullName = `${profile.first_name} ${profile.last_name}`;

  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 space-y-3
                    hover:border-white/10 hover:bg-white/[0.04] transition-all duration-200">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl
                          bg-gradient-to-br from-[#639922]/20 to-[#639922]/5 border border-[#639922]/15">
            <RoleIcon className="h-4.5 w-4.5 text-[#639922]" />
          </div>
          <span
            className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0f1117] ${
              STATUS_CONFIG[profile.status as StatusValue]?.dot ?? "bg-amber-400"
            }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-white/90 truncate">{fullName}</p>
          <p className="text-[11px] text-white/35 truncate">{profile.email}</p>
          {(profile.university_name || profile.company_name) && (
            <p className="text-[11px] text-white/25 truncate">
              {profile.university_name ?? profile.company_name}
            </p>
          )}
        </div>
        {/* Action buttons top-right */}
        <div className="flex gap-1.5 shrink-0">
          <button
            onClick={() =>
              navigate(`/dashboard/admin/pending/${profile.id}`, { state: { profile } })
            }
            title="Preview profile"
            className="inline-flex items-center gap-1 rounded-lg border border-[#639922]/25
                       bg-[#639922]/10 px-2 py-1.5 text-[11px] font-medium text-[#639922]
                       hover:bg-[#639922]/20 hover:border-[#639922]/40 transition-all"
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </button>
          <button
            onClick={() => onDelete(profile.id, fullName)}
            disabled={isLoading}
            className="flex h-7 w-7 items-center justify-center rounded-lg
                       bg-red-500/5 text-red-400/60 border border-red-500/10
                       hover:bg-red-500/15 hover:text-red-400 hover:border-red-500/25
                       transition-all disabled:opacity-30"
          >
            {isLoading && actionLoading === `delete-${profile.id}` ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.05]" />

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-widest text-white/25 font-medium">Role</span>
          <RoleBadge role={profile.role} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-widest text-white/25 font-medium">Status</span>
          <StatusSelect
            value={profile.status ?? "active"}
            disabled={isLoading}
            onChange={(val) => onStatusChange(profile.id, val)}
          />
        </div>
      </div>

      {/* Connection (students only) */}
      {profile.role === "student" && (
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-widest text-white/25 font-medium">
            University Connection
          </span>
          <ConnectionCell
            profile={profile}
            sendingInvite={sendingInvite}
            onSendInvitation={onSendInvitation}
          />
        </div>
      )}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl
                      bg-white/[0.04] border border-white/[0.07]">
        <UserCheck className="h-6 w-6 text-white/20" />
      </div>
      <p className="text-sm font-medium text-white/40">No accounts found</p>
      <p className="mt-1 text-xs text-white/20">Accounts will appear here once created</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * AccountsTable — Renders a responsive table (desktop) / card list (mobile)
 * of user profiles with inline status editing, connection management, and actions.
 */
export function AccountsTable({
  profiles,
  actionLoading,
  sendingInvite,
  onStatusChange,
  onDelete,
  onSendInvitation,
}: AccountsTableProps) {
  const navigate = useNavigate();

  // Super-admins are managed separately — never shown in this table
  const visibleProfiles = profiles.filter((p) => p.role !== "super_admin");

  if (visibleProfiles.length === 0) return <EmptyState />;

  const sharedProps = {
    actionLoading,
    sendingInvite,
    onStatusChange,
    onDelete,
    onSendInvitation,
    navigate,
  };

  return (
    <>
      {/* ── Desktop table (md+) ── */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/[0.07]
                      bg-white/[0.02] shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {["User", "Role", "Status", "Connection", ""].map((col, i) => (
                <th
                  key={i}
                  className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-white/30
                    bg-white/[0.02] ${i === 4 ? "text-right" : "text-left"}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleProfiles.map((profile) => (
              <DesktopRow key={profile.id} profile={profile} {...sharedProps} />
            ))}
          </tbody>
        </table>

        {/* Row count footer */}
        <div className="border-t border-white/[0.04] px-5 py-2.5">
          <p className="text-[11px] text-white/20">
            {visibleProfiles.length} account{visibleProfiles.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* ── Mobile cards (< md) ── */}
      <div className="flex flex-col gap-3 md:hidden">
        {visibleProfiles.map((profile) => (
          <MobileCard key={profile.id} profile={profile} {...sharedProps} />
        ))}
        <p className="text-center text-[11px] text-white/20 py-1">
          {visibleProfiles.length} account{visibleProfiles.length !== 1 ? "s" : ""}
        </p>
      </div>
    </>
  );
}