// features/admin/pages/AdminPendingPage.tsx
import { useEffect, useState } from "react";
import { RefreshCw, School, Building2 } from "lucide-react";
import { useAdmin } from "../hooks/useAdmin";
import { PendingList } from "../components/PendingList";
import { Profile } from "../services/admin.service";
import { PendingFilter } from "../constants/admin.constants";

export const AdminPendingPage = () => {
  const { fetchPendingProfiles, approvePending, rejectPending, actionLoading, loading } = useAdmin();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filter, setFilter] = useState<PendingFilter>("all");

  const loadPending = async () => {
    const data = await fetchPendingProfiles();
    setProfiles(data);
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleApprove = async (profile: Profile) => {
    const ok = await approvePending(profile);
    if (ok) setProfiles((prev) => prev.filter((p) => p.id !== profile.id));
  };

  const handleReject = async (profile: Profile) => {
    const ok = await rejectPending(profile);
    if (ok) setProfiles((prev) => prev.filter((p) => p.id !== profile.id));
  };

  const filtered = filter === "all" ? profiles : profiles.filter((p) => p.role === filter);
  const counts = {
    all: profiles.length,
    university_admin: profiles.filter((p) => p.role === "university_admin").length,
    company_admin: profiles.filter((p) => p.role === "company_admin").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Pending Verifications</h1>
          <p className="text-white/40 text-sm mt-1">Review and approve institution & company accounts</p>
        </div>
        <button
          onClick={loadPending}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="flex gap-2">
        {(["all", "university_admin", "company_admin"] as PendingFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              filter === f ? "bg-white/10 text-white" : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
          >
            {f === "all" && "All"}
            {f === "university_admin" && <><School className="h-3.5 w-3.5" /> Universities</>}
            {f === "company_admin" && <><Building2 className="h-3.5 w-3.5" /> Companies</>}
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${counts[f] > 0 ? "bg-amber-400 text-black" : "bg-white/10 text-white/40"}`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      <PendingList
        profiles={filtered}
        actionLoading={actionLoading}
        onApprove={handleApprove}
        onReject={handleReject}
        loading={loading}
      />
    </div>
  );
};