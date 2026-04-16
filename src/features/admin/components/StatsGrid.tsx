// features/admin/components/StatsGrid.tsx
import { StatsCard } from "./StatsCard";
import { AdminStats } from "../services/admin.service";
import { Users, GraduationCap, Building2, School, Clock, XCircle } from "lucide-react";

interface StatsGridProps {
  stats: AdminStats;
  loading?: boolean;
}

export const StatsGrid = ({ stats, loading }: StatsGridProps) => {
  const totalPending = stats.pendingUniversities + stats.pendingCompanies;
  const statCards = [
    { label: "Total Accounts", value: stats.total, icon: Users, color: "#1A6BFF", bg: "rgba(26,107,255,0.08)" },
    { label: "Students", value: stats.students, icon: GraduationCap, color: "#00A550", bg: "rgba(0,165,80,0.08)" },
    { label: "Companies", value: stats.companies, icon: Building2, color: "#8B5CF6", bg: "rgba(139,92,246,0.08)" },
    { label: "Universities", value: stats.universities, icon: School, color: "#E8A020", bg: "rgba(232,160,32,0.08)" },
    { label: "Pending Review", value: totalPending, icon: Clock, color: totalPending > 0 ? "#E8A020" : "#555", bg: totalPending > 0 ? "rgba(232,160,32,0.08)" : "rgba(255,255,255,0.03)", pulse: totalPending > 0 },
    { label: "Rejected", value: stats.rejected, icon: XCircle, color: "#EF4444", bg: "rgba(239,68,68,0.08)" },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl border border-white/10 bg-white/[0.03] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {statCards.map((card) => (
        <StatsCard key={card.label} {...card} />
      ))}
    </div>
  );
};