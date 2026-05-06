// features/admin/components/AccountRow.tsx
import { useState } from "react";
import { ChevronDown, CheckCircle2, XCircle, Mail, Trash2, RefreshCw } from "lucide-react";
import { Profile } from "../services/admin.service";
import { ROLE_CONFIG, STATUS_CONFIG } from "../../../constants/admin.constants";

interface AccountRowProps {
  profile: Profile;
  actionLoading: string | null;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string, name: string) => void;
}

export const AccountRow = ({ profile, actionLoading, onStatusChange, onDelete }: AccountRowProps) => {
  const [expanded, setExpanded] = useState(false);
  const roleConf = ROLE_CONFIG[profile.role] ?? ROLE_CONFIG.student;
  const statusConf = STATUS_CONFIG[profile.status] ?? STATUS_CONFIG.active;
  const name = `${profile.first_name} ${profile.last_name}`;
  const org = profile.university_name || profile.company_name;
  const deleting = actionLoading === `delete-${profile.id}`;
  const updatingStatus = actionLoading === `status-${profile.id}`;

  return (
    <div className="bg-white/[0.01] hover:bg-white/[0.04] transition-colors">
      <div
        className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
            style={{ background: roleConf.bg, color: roleConf.color }}
          >
            {(profile.first_name?.[0] || "?").toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{name}</p>
            <p className="text-xs text-foreground/40 truncate">{profile.email}</p>
          </div>
        </div>

        <div className="hidden sm:block">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
            style={{ background: roleConf.bg, color: roleConf.color }}
          >
            <roleConf.icon className="h-3 w-3" />
            {roleConf.label}
          </span>
        </div>

        <div className="hidden sm:block">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border"
            style={{
              color: statusConf.color,
              borderColor: `${statusConf.color}30`,
              background: `${statusConf.color}10`,
            }}
          >
            {statusConf.label}
          </span>
        </div>

        <ChevronDown className={`h-4 w-4 text-foreground/30 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </div>

      {expanded && (
        <div className="border-t border-white/[0.06] bg-white/[0.02] px-5 py-4">
          <div className="grid gap-3 sm:grid-cols-2 text-sm mb-4">
            {[
              { label: "Email", value: profile.email },
              { label: "Role", value: roleConf.label },
              { label: "Status", value: statusConf.label },
              { label: "Joined", value: new Date(profile.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
              org && { label: "Organisation", value: org },
              profile.industry && { label: "Industry", value: profile.industry },
              profile.degree_level && { label: "Degree", value: profile.degree_level },
              profile.wilaya && { label: "wilaya", value: profile.wilaya },
            ]
              .filter(Boolean)
              .map((row: any) => (
                <div key={row.label} className="flex gap-2">
                  <span className="text-foreground/30 w-28 shrink-0">{row.label}</span>
                  <span className="text-foreground/70">{row.value}</span>
                </div>
              ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {profile.status !== "active" && (
              <button
                onClick={(e) => { e.stopPropagation(); onStatusChange(profile.id, "active"); }}
                disabled={updatingStatus}
                className="flex items-center gap-1.5 rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400 hover:bg-green-500/20 transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Set Active
              </button>
            )}
            {profile.status !== "rejected" && (
              <button
                onClick={(e) => { e.stopPropagation(); onStatusChange(profile.id, "rejected"); }}
                disabled={updatingStatus}
                className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
              >
                <XCircle className="h-3.5 w-3.5" /> Reject
              </button>
            )}
            <a href={`mailto:${profile.email}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-foreground/60 hover:text-foreground hover:bg-white/10 transition-all">
              <Mail className="h-3.5 w-3.5" /> Email
            </a>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(profile.id, name); }}
              disabled={deleting}
              className="flex items-center gap-1.5 rounded-lg border border-red-900/30 bg-red-900/10 px-3 py-1.5 text-xs font-medium text-red-500/70 hover:text-red-400 hover:bg-red-900/20 transition-all disabled:opacity-50 ml-auto"
            >
              {deleting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};