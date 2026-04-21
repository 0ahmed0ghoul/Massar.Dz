// features/admin/pages/AdminDashboardPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, Users, Clock, ArrowRight, Shield, Building2, GraduationCap, XCircle, CheckCircle } from "lucide-react";
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
    <div className="relative min-h-screen bg-background">
      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Green glow orbs */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[500px] -translate-x-1/4 rounded-full gradient-hero blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-1/2 h-96 w-[500px] translate-x-1/4 rounded-full bg-[#639922]/[0.05] blur-3xl" />

      <div className="relative z-10 container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#639922]/10 p-2">
                <Shield className="h-6 w-6 text-[#639922]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Admin Dashboard</h1>
                <p className="mt-1 text-sm text-foreground/40">
                  Overview of platform activity and pending verifications
                </p>
              </div>
            </div>
            <p className="mt-2 text-xs text-foreground/30">
              Last refreshed at {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={loadStats}
            disabled={loading}
            className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-foreground/60 backdrop-blur-sm transition-all hover:border-[#639922]/30 hover:bg-white/[0.05] hover:text-foreground disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 transition-transform duration-300 ${loading ? "animate-spin" : "group-hover:rotate-180"}`} />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        {stats && <StatsGrid stats={stats} loading={loading} />}

        {/* Quick Action Cards */}
        <div className="mt-4 mb-4 grid gap-5 sm:grid-cols-2">
          <Link
            to="/dashboard/admin/pending"
            className="group relative overflow-hidden rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-400/5 to-transparent p-5 backdrop-blur-sm transition-all duration-300 hover:border-amber-400/40 hover:shadow-lg hover:shadow-amber-400/5"
          >
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-400/10 blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/10">
                  <Clock className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Pending Verifications</p>
                  <p className="text-sm text-foreground/40">
                    {totalPending > 0 
                      ? `${totalPending} account${totalPending > 1 ? "s" : ""} waiting for review` 
                      : "All clear — no pending accounts"}
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-amber-400 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            to="/dashboard/admin/accounts"
            className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-300 hover:border-[#639922]/30 hover:shadow-lg hover:shadow-[#639922]/5"
          >
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#639922]/10 blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <Users className="h-6 w-6 text-foreground/60" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">All Accounts</p>
                  <p className="text-sm text-foreground/40">Browse, search and manage all users</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-foreground/40 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </Link>
        </div>

        {/* Role Breakdown Card */}
        {stats && (
          <div className="group rounded-2xl border border-white/[0.09] bg-white/[0.03] p-5 backdrop-blur-md transition-all duration-300 hover:border-[#639922]/30 sm:p-6">
            <div className="mb-5 flex items-center gap-2 border-b border-white/10 pb-3">
              <Shield className="h-5 w-5 text-[#639922]" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">
                Role Breakdown
              </h2>
              <span className="ml-auto text-xs text-foreground/30">Total: {stats.total}</span>
            </div>
            <div className="space-y-4">
              {[
                { label: "Students", value: stats.students, color: "#00A550", icon: GraduationCap },
                { label: "Companies (active)", value: stats.companies, color: "#8B5CF6", icon: Building2 },
                { label: "Universities (approved)", value: stats.universities, color: "#E8A020", icon: Building2 },
                { label: "Pending review", value: totalPending, color: "#1A6BFF", icon: Clock },
                { label: "Rejected", value: stats.rejected, color: "#EF4444", icon: XCircle },
              ].map((row) => {
                const percentage = stats.total > 0 ? (row.value / stats.total) * 100 : 0;
                const Icon = row.icon;
                return (
                  <div key={row.label} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5" style={{ color: row.color }} />
                        <span className="text-foreground/70">{row.label}</span>
                      </div>
                      <span className="font-medium text-foreground">{row.value}</span>
                    </div>
                    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${percentage}%`, backgroundColor: row.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Additional Info (if needed) */}
        <div className="mt-6 text-center text-xs text-foreground/30">
          <p>Platform health: All systems operational</p>
        </div>
      </div>
    </div>
  );
};