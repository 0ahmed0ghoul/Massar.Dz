// features/admin/pages/AdminDashboardPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, Users, Clock, ArrowRight } from "lucide-react";
import { useAdmin } from "../hooks/useAdmin";
import { StatsGrid } from "../components/StatsGrid";
import { AdminStats } from "../services/admin.service";

export const AdminDashboardPage = () => {
  const { fetchStats, loading } = useAdmin();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const loadStats = async () => {
    const data = await fetchStats();
    setStats(data);
    setLastRefresh(new Date());
  };

  useEffect(() => {
    loadStats();
  }, []);

  const totalPending = stats ? stats.pendingUniversities + stats.pendingCompanies : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-white/40 text-sm mt-1">Last refreshed at {lastRefresh.toLocaleTimeString()}</p>
        </div>
        <button
          onClick={loadStats}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {stats && <StatsGrid stats={stats} loading={loading} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/dashboard/admin/pending"
          className="group flex items-center justify-between rounded-xl border border-amber-400/20 bg-amber-400/5 p-5 hover:bg-amber-400/10 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/10">
              <Clock className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="font-semibold text-white">Pending Verifications</p>
              <p className="text-sm text-white/40">
                {totalPending > 0 ? `${totalPending} account${totalPending > 1 ? "s" : ""} waiting` : "No pending accounts"}
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-amber-400 transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          to="/dashboard/admin/accounts"
          className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <Users className="h-5 w-5 text-white/60" />
            </div>
            <div>
              <p className="font-semibold text-white">All Accounts</p>
              <p className="text-sm text-white/40">Browse, search and manage all users</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-white/40 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {stats && (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Role Breakdown</h2>
          <div className="space-y-3">
            {[
              { label: "Students", value: stats.students, color: "#00A550" },
              { label: "Companies (active)", value: stats.companies, color: "#8B5CF6" },
              { label: "Universities (approved)", value: stats.universities, color: "#E8A020" },
              { label: "Pending review", value: totalPending, color: "#1A6BFF" },
              { label: "Rejected", value: stats.rejected, color: "#EF4444" },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <span className="w-40 text-sm text-white/50 shrink-0">{row.label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(row.value / stats.total) * 100}%`, background: row.color }}
                  />
                </div>
                <span className="w-6 text-right text-sm font-medium text-white">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};