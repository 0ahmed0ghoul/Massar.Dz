// features/admin/components/PendingList.tsx
import { useNavigate } from "react-router-dom";
import { Eye, CheckCircle, XCircle, Building2, GraduationCap, User } from "lucide-react";

export const PendingList = ({ profiles, actionLoading, onApprove, onReject, loading }) => {
  const navigate = useNavigate();

  if (loading) return <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#639922] border-t-transparent" /></div>;
  if (profiles.length === 0) return <div className="py-12 text-center"><p className="text-foreground/40">No pending profiles to display.</p></div>;

  // Helper to get the main display name
  const getDisplayName = (profile) => {
    if (profile.role === "university_admin") return profile.university_name || "University";
    if (profile.role === "company_admin") return profile.company_name || "Company";
    return `${profile.first_name} ${profile.last_name}`.trim() || profile.email || "Student";
  };

  // Helper to get the icon based on role
  const getIcon = (role) => {
    if (role === "university_admin") return <GraduationCap className="h-5 w-5 text-amber-400" />;
    if (role === "company_admin") return <Building2 className="h-5 w-5 text-amber-400" />;
    return <User className="h-5 w-5 text-amber-400" />;
  };

  return (
    <div className="space-y-3">
      {profiles.map((profile) => {
        const isUniversity = profile.role === "university_admin";
        const isCompany = profile.role === "company_admin";
        const isStudent = profile.role === "student";
        const isLoading = actionLoading === profile.id;
        const displayName = getDisplayName(profile);
        const Icon = getIcon(profile.role);

        return (
          <div key={profile.id} className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition-all hover:border-[#639922]/30 hover:bg-white/[0.04]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex cursor-pointer items-start gap-3 flex-1" onClick={() => navigate(`/dashboard/admin/pending/${profile.id}`, { state: { profile } })}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/10">
                  {Icon}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-foreground">{displayName}</p>
                    <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                      Pending {isStudent ? "Verification" : "Approval"}
                    </span>
                    {isStudent && !profile.is_completed && (
                      <span className="rounded-full bg-red-400/20 px-2 py-0.5 text-xs font-medium text-red-400">
                        Incomplete
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-foreground/40">
                    {profile.first_name} {profile.last_name} • {profile.email}
                  </p>
                  {/* Additional info for students */}
                  {isStudent && profile.university_name && (
                    <p className="mt-1 text-xs text-foreground/30">
                      🎓 {profile.university_name} • {profile.specialty || profile.major || "No specialty"}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-foreground/30">
                    Submitted: {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/dashboard/admin/pending/${profile.id}`, { state: { profile } })}
                  className="rounded-lg border border-white/20 p-2 text-foreground/60 transition hover:bg-white/10 hover:text-foreground"
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
      })}
    </div>
  );
};