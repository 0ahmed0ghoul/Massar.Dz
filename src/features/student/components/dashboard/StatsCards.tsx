import { ArrowUpRight, Target, Briefcase, Zap } from "lucide-react";

const StatsCards = ({ stats }: { stats: any[] }) => {
  const icons = [<Briefcase />, <Target />, <Zap />, <ArrowUpRight />];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all hover:border-[#639922]/40 hover:bg-white/[0.06]"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-foreground/40">{stat.label}</p>
              <h3 className="mt-1 text-3xl font-black text-foreground">{stat.value}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#639922]/10 text-[#639922] transition-transform group-hover:scale-110">
              {icons[i % icons.length]}
            </div>
          </div>
          {/* Subtle glow effect on hover */}
          <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-[#639922]/10 blur-2xl transition-opacity opacity-0 group-hover:opacity-100" />
        </div>
      ))}
    </div>
  );
};

export default StatsCards;