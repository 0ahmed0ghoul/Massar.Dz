import { Briefcase, Building2, GraduationCap, School, TrendingUp, MapPin } from "lucide-react";

const stats = [
  { 
    label: "Active Jobs", 
    value: "2,400+", 
    icon: Briefcase,
    description: "Live opportunities",
    trend: "+23%"
  },
  { 
    label: "Companies", 
    value: "850+", 
    icon: Building2,
    description: "Hiring partners",
    trend: "+15%"
  },
  { 
    label: "Students", 
    value: "45,000+", 
    icon: GraduationCap,
    description: "Active job seekers",
    trend: "+32%"
  },
  { 
    label: "Placements", 
    value: "12,500+", 
    icon: TrendingUp,
    description: "Successful hires",
    trend: "+28%"
  },
];

const Stats = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Trusted by thousands</h2>
          <p className="text-muted-foreground mt-2">Join the fastest growing career platform</p>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s) => (
            <div 
              key={s.label} 
              className="relative group bg-card rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-primary/20"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <s.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {s.value}
                  </span>
                  <span className="text-xs text-success font-medium bg-success/10 px-1.5 py-0.5 rounded-full">
                    {s.trend}
                  </span>
                </div>
                <span className="text-sm font-semibold mt-2">{s.label}</span>
                <span className="text-xs text-muted-foreground">{s.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;