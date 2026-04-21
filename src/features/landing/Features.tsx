import { Link } from "react-router-dom";
import { GraduationCap, Building2, School, CheckCircle2, ArrowRight } from "lucide-react";

const features = [
  {
    num: "01",
    icon: GraduationCap,
    title: "For Students",
    description:
      "Build your profile, discover opportunities, and track your applications — all in one place.",
    benefits: ["Smart job matching", "Application tracker", "Profile completeness guide"],
    cta: "Create profile",
    href: "/register",
    featured: false,
  },
  {
    num: "02",
    icon: Building2,
    title: "For Employers",
    description:
      "Post jobs, search candidates, and manage applications with a powerful Kanban pipeline.",
    benefits: ["Candidate search & filters", "Application Kanban board", "Analytics dashboard"],
    cta: "Start hiring",
    href: "/register",
    featured: true,
  },
  {
    num: "03",
    icon: School,
    title: "For Universities",
    description:
      "Import students, track employment outcomes, and boost your program's ranking score.",
    benefits: ["CSV student import", "Outcomes tracking", "Ranking analytics"],
    cta: "Get started",
    href: "/register",
    featured: false,
  },
];

const stats = [
  { val: "45K+",  lbl: "Active students"    },
  { val: "1,200+", lbl: "Partner employers" },
  { val: "120+",  lbl: "Universities"        },
  { val: "91%",   lbl: "Placement rate"      },
];

const Features = () => {
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

      {/* Centre glow - using theme primary color */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="container relative z-10">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="mb-14 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 px-4 py-1.5">
            <span className="block h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[11px] font-medium uppercase tracking-widest text-primary">
              Built for everyone
            </span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
            One platform,{" "}
            <span className="text-primary">three</span> perspectives
          </h2>
          <p className="mt-3 text-[15px] text-muted-foreground">
            Built for every stakeholder in the hiring process.
          </p>
        </div>

        {/* ── Cards ──────────────────────────────────────────── */}
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border p-7 transition-all duration-300 ${
                f.featured
                  ? "border-primary/30 bg-primary/5 hover:border-primary/50"
                  : "border-border/50 bg-card/30 hover:border-primary/30 hover:bg-card/50"
              }`}
            >
              {/* Top accent line on featured */}
              {f.featured && (
                <div
                  className="absolute inset-x-0 top-0 h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)`,
                  }}
                />
              )}

              {/* Card number */}
              <span className="absolute right-6 top-6 text-[11px] font-bold tracking-wide text-foreground/10">
                {f.num}
              </span>

              {/* Icon */}
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                <f.icon className="h-5 w-5 text-primary" />
              </div>

              <h3 className="mb-2 text-[19px] font-extrabold tracking-tight text-foreground">
                {f.title}
              </h3>
              <p className="mb-5 text-[13px] leading-relaxed text-foreground/80">
                {f.description}
              </p>

              {/* Benefits */}
              <ul className="mb-6 flex flex-1 flex-col gap-2.5">
                {f.benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
                    <span className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/15">
                      <CheckCircle2 className="h-2.5 w-2.5 text-primary" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to={f.href}
                className={`inline-flex w-fit items-center gap-2 rounded-[9px] px-4 py-2.5 text-[13px] font-semibold transition-all duration-200 ${
                  f.featured
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border text-foreground/70 hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {f.cta}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>

        {/* ── Stats strip ────────────────────────────────────── */}
        <div className="mt-16 grid grid-cols-2 gap-px border-t border-border/50 pt-12 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className="text-center"
              style={{
                borderRight:
                  i < stats.length - 1
                    ? "1px solid hsl(var(--border) / 0.5)"
                    : "none",
              }}
            >
              <p className="text-[26px] font-black tracking-tight text-foreground">
                {s.val}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground/60">
                {s.lbl}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;