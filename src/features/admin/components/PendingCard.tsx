// features/admin/components/PendingCard.tsx
import { School, Building2, Mail, MapPin, Clock, XCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Profile } from "../services/admin.service";

interface PendingCardProps {
  profile: Profile;
  actionLoading: string | null;
  onApprove: (profile: Profile) => void;
  onReject: (profile: Profile) => void;
}

export const PendingCard = ({ profile, actionLoading, onApprove, onReject }: PendingCardProps) => {
  const isUni = profile.role === "pending_university";
  const approving = actionLoading === profile.id;
  const rejecting = actionLoading === `reject-${profile.id}`;
  const busy = approving || rejecting;
  const submitted = new Date(profile.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:bg-white/[0.05]">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${
              isUni ? "border-amber-400/20 bg-amber-400/10" : "border-purple-400/20 bg-purple-400/10"
            }`}
          >
            {isUni ? <School className="h-5 w-5 text-amber-400" /> : <Building2 className="h-5 w-5 text-purple-400" />}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-white">
                {profile.first_name} {profile.last_name}
              </span>
              <Badge className={`text-[10px] px-2 py-0.5 border ${isUni ? "border-amber-400/20 bg-amber-400/10 text-amber-400" : "border-purple-400/20 bg-purple-400/10 text-purple-400"}`}>
                {isUni ? "University" : "Company"}
              </Badge>
            </div>
            <p className="text-white font-medium text-sm">
              {isUni ? profile.university_name : profile.company_name}
              {profile.industry && <span className="text-white/40 font-normal"> · {profile.industry}</span>}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-white/40">
              <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{profile.email}</span>
              {profile.city && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{profile.city}</span>}
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Submitted {submitted}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:shrink-0">
          <button
            onClick={() => onReject(profile)}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
          >
            {rejecting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
            Reject
          </button>
          <button
            onClick={() => onApprove(profile)}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-medium text-black hover:bg-white/90 transition-all disabled:opacity-50"
          >
            {approving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};