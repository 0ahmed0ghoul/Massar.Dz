// features/admin/components/StatsCard.tsx
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bg: string;
  pulse?: boolean;
}

export const StatsCard = ({ label, value, icon: Icon, color, bg, pulse }: StatsCardProps) => (
  <div className="relative rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:bg-white/[0.05]">
    {pulse && (
      <span className="absolute right-4 top-4 flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
      </span>
    )}
    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: bg }}>
      <Icon className="h-5 w-5" style={{ color }} />
    </div>
    <div className="text-3xl font-bold text-white">{value}</div>
    <div className="text-sm text-white/40 mt-1">{label}</div>
  </div>
);