// features/admin/components/PendingList.tsx
import { useNavigate } from "react-router-dom";
import { Eye, CheckCircle, XCircle, Building2, GraduationCap } from "lucide-react";

export const PendingList = ({ profiles, actionLoading, onApprove, onReject, loading }) => {
  const navigate = useNavigate();

  if (loading) return <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#639922] border-t-transparent" /></div>;
  if (profiles.length === 0) return <div className="py-12 text-center"><p className="text-white/40">No pending profiles to display.</p></div>;

  return (
    <div className="space-y-3">
      {profiles.map((profile) => {
        const isUniversity = profile.role === "university_admin";
        const isLoading = actionLoading === profile.id;
        return (
          <div key={profile.id} className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition-all hover:border-[#639922]/30 hover:bg-white/[0.04]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex cursor-pointer items-start gap-3 flex-1" onClick={() => navigate(`/dashboard/admin/pending/${profile.id}`, { state: { profile } })}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/10">{isUniversity ? <GraduationCap className="h-5 w-5 text-amber-400" /> : <Building2 className="h-5 w-5 text-amber-400" />}</div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-white">{isUniversity ? profile.university_name : profile.company_name}</p>
                    <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-xs font-medium text-amber-400">Pending</span>
                  </div>
                  <p className="mt-0.5 text-xs text-white/40">{profile.first_name} {profile.last_name} • {profile.email}</p>
                  <p className="mt-1 text-xs text-white/30">Submitted: {profile.completed_at ? new Date(profile.completed_at).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigate(`/dashboard/admin/pending/${profile.id}`, { state: { profile } })} className="rounded-lg border border-white/20 p-2 text-white/60 transition hover:bg-white/10 hover:text-white"><Eye className="h-4 w-4" /></button>
                <button onClick={() => onApprove(profile)} disabled={isLoading} className="rounded-lg bg-[#639922]/20 p-2 text-[#639922] transition hover:bg-[#639922]/30 disabled:opacity-50"><CheckCircle className="h-4 w-4" /></button>
                <button onClick={() => onReject(profile)} disabled={isLoading} className="rounded-lg bg-red-500/20 p-2 text-red-400 transition hover:bg-red-500/30 disabled:opacity-50"><XCircle className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};