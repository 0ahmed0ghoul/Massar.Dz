// features/admin/components/PendingCard.tsx
import { Building2, GraduationCap, CheckCircle, XCircle, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Profile } from "../services/admin.service";

interface PendingCardProps {
  profile: Profile;
  actionLoading: string | null;
  onApprove: (profile: Profile) => void;
  onReject: (profile: Profile) => void;
  isStudent?: boolean;
}

export const PendingCard = ({ profile, actionLoading, onApprove, onReject, isStudent }: PendingCardProps) => {
  const navigate = useNavigate();
  const isLoading = actionLoading === profile.id || actionLoading === `reject-${profile.id}`;

  const displayName = isStudent
    ? `${profile.first_name} ${profile.last_name}`
    : profile.role === "university_admin"
    ? profile.university_name || `${profile.first_name} ${profile.last_name}`
    : profile.company_name || `${profile.first_name} ${profile.last_name}`;

  const subtitle = isStudent
    ? `${profile.degree_level || "Student"} • ${profile.university_name || "University not set"}`
    : `${profile.email} • ${profile.city || "Location not set"}`;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition-all hover:border-[#639922]/30">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex cursor-pointer items-start gap-3 flex-1" onClick={() => navigate(`/dashboard/admin/pending/${profile.id}`, { state: { profile } })}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/10">
            {isStudent ? <GraduationCap className="h-5 w-5 text-amber-400" /> : <Building2 className="h-5 w-5 text-amber-400" />}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-white">{displayName}</p>
              <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                {isStudent ? "Pending Verification" : "Pending Approval"}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-white/40">{subtitle}</p>
            <p className="mt-1 text-xs text-white/30">
              {isStudent ? "Completed profile awaiting verification" : `Submitted: ${new Date(profile.created_at).toLocaleDateString()}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/dashboard/admin/pending/${profile.id}`, { state: { profile } })}
            className="rounded-lg border border-white/20 p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onApprove(profile)}
            disabled={isLoading}
            className="rounded-lg bg-[#639922]/20 p-2 text-[#639922] transition hover:bg-[#639922]/30 disabled:opacity-50"
          >
            <CheckCircle className="h-4 w-4" />
          </button>
          <button
            onClick={() => onReject(profile)}
            disabled={isLoading}
            className="rounded-lg bg-red-500/20 p-2 text-red-400 transition hover:bg-red-500/30 disabled:opacity-50"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};