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
    <section className="relative overflow-hidden bg-[#0b0c0e] py-20">
      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container relative z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.1em] text-white/30">
            Simple Process
          </p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            How it works
          </h2>
          <p className="mt-3 text-white/40">
            Get started in minutes, not hours.
          </p>
        </div>

        {/* Steps with connecting lines */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-[44px] top-24 h-[calc(100%-120px)] w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent md:left-1/2 md:-translate-x-1/2" />
          
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
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5">
                          <s.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-xs font-bold text-white">
                        {s.step}
                      </div>
                    </div>
                    <div className="flex-1 md:hidden">
                      <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                      <p className="mt-1 text-sm text-white/40">{s.desc}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full md:w-1/2">
                  <div className="hidden md:block">
                    <h3 className="text-xl font-semibold text-white">{s.title}</h3>
                    <p className="mt-2 text-sm text-white/40">{s.desc}</p>
                    <ul className="mt-4 space-y-2">
                      {s.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-2 text-sm text-white/30">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
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
        <div className="mt-16 flex flex-wrap justify-center gap-8 border-t border-white/10 pt-10">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">2 min</div>
            <div className="text-xs text-white/30">Average setup time</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white">24/7</div>
            <div className="text-xs text-white/30">Platform access</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white">100%</div>
            <div className="text-xs text-white/30">Free to join</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;