import { Users, Search, TrendingUp, CheckCircle2 } from "lucide-react";

const steps = [
  { 
    step: "01", 
    icon: Users, 
    title: "Create your account", 
    desc: "Choose your role — student, employer, or university — and set up your profile.",
    details: ["Email verification", "Profile setup", "Role selection"]
  },
  { 
    step: "02", 
    icon: Search, 
    title: "Discover & connect", 
    desc: "Browse jobs, search candidates, or import students. Our matching algorithm does the heavy lifting.",
    details: ["Smart matching", "Real-time updates", "Direct messaging"]
  },
  { 
    step: "03", 
    icon: TrendingUp, 
    title: "Track outcomes", 
    desc: "Monitor applications, hiring pipelines, and employment outcomes with real-time analytics.",
    details: ["Analytics dashboard", "Application tracking", "Success metrics"]
  },
];

const HowItWorks = () => {
  return (
    <section className="relative overflow-hidden bg-background py-20">
      {/* Grid pattern - guaranteed visible in both themes */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--grid-line, 0 0% 75%) / var(--grid-line-opacity, 0.5)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--grid-line, 0 0% 75%) / var(--grid-line-opacity, 0.5)) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="container relative z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground/60">
            Simple Process
          </p>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            How it works
          </h2>
          <p className="mt-3 text-muted-foreground">
            Get started in minutes, not hours.
          </p>
        </div>

        {/* Steps with connecting lines */}
        <div className="relative">
          {/* Connecting line - using theme border color */}
          <div className="absolute left-[44px] top-24 h-[calc(100%-120px)] w-px bg-gradient-to-b from-border via-border/50 to-transparent md:left-1/2 md:-translate-x-1/2" />
          
          <div className="space-y-12 md:space-y-0">
            {steps.map((s, idx) => (
              <div
                key={s.step}
                className={`relative flex flex-col gap-6 md:flex-row ${
                  idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } md:items-center`}
              >
                {/* Timeline node */}
                <div className="flex w-full md:w-1/2 md:justify-end">
                  <div className="flex items-center gap-4 md:max-w-md">
                    <div className="relative">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
                          <s.icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-xs font-bold text-primary-foreground">
                        {s.step}
                      </div>
                    </div>
                    <div className="flex-1 md:hidden">
                      <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full md:w-1/2">
                  <div className="hidden md:block">
                    <h3 className="text-xl font-semibold text-foreground">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                    <ul className="mt-4 space-y-2">
                      {s.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-2 text-sm text-muted-foreground/70">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats summary */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 border-t border-border/50 pt-10">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">2 min</div>
            <div className="text-xs text-muted-foreground/60">Average setup time</div>
          </div>
          <div className="h-8 w-px bg-border/50" />
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">24/7</div>
            <div className="text-xs text-muted-foreground/60">Platform access</div>
          </div>
          <div className="h-8 w-px bg-border/50" />
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">100%</div>
            <div className="text-xs text-muted-foreground/60">Free to join</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;