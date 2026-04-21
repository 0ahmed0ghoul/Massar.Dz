import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Activity, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

/* ── Floating UI card data ───────────────────────────────── */
const topMatch = {
  role: "Product Manager",
  company: "Sonatrach Digital",
  location: "Algiers, DZ",
  score: 94,
  tags: ["Full-time", "Strategy", "Agile", "MBA preferred"],
};

const weeklyStats = { count: "1,284", delta: "+23%" };

const profileCard = {
  initials: "SA",
  name: "Sara Amrani",
  uni: "University of Algiers · Computer Sci.",
  status: "Actively looking · Available June 2025",
  apps: 12,
  interviews: 5,
  matchRate: "94%",
};

const avatars = [
  { initials: "SA", bg: "#639922" },
  { initials: "MK", bg: "#185FA5" },
  { initials: "LR", bg: "#993556" },
  { initials: "YB", bg: "#854F0B" },
];

/* ── Component ───────────────────────────────────────────── */
const Hero = () => {
  const [isDark, setIsDark] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && systemPrefersDark);
    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <section className="relative overflow-hidden bg-background transition-colors h-[100vh]">
      {/* Grid Pattern – guaranteed visible in both themes */}
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

      {/* Adaptive Glow (uses CSS variable for opacity) */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[500px] -translate-x-1/4 rounded-full gradient-hero blur-3xl" />

      <div className="container relative z-10 grid items-center gap-12 py-24 lg:grid-cols-2 lg:py-32">
        {/* LEFT */}
        <div className="flex flex-col">
          {/* Badge */}
          <div className="mb-8 flex w-fit items-center gap-2 rounded-full border border-primary/30 px-3 py-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
              <span className="block h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-xs font-medium tracking-wide text-primary">
              The smarter way to recruit
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight text-foreground lg:text-6xl">
            Where{" "}
            <span className="font-extrabold text-foreground [WebkitTextStroke:1.5px_rgba(0,0,0,0.4)] dark:[WebkitTextStroke:1.5px_rgba(255,255,255,0.45)]">
              talent
            </span>{" "}
            meets{" "}
            <span className="text-primary">opportunity</span>
            <br />— powered by data
          </h1>

          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            Massar connects students, employers, and universities on a single
            platform. Smarter matching, transparent outcomes, and better career
            decisions.
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button size="lg" asChild className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/register/student">
                Find your next role <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-border text-foreground hover:bg-muted"
            >
              <Link to="/jobs">Browse jobs</Link>
            </Button>
          </div>

          {/* Social proof */}
          <div className="mt-10 flex items-center gap-3">
            <div className="flex">
              {avatars.map((av, i) => (
                <div
                  key={i}
                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background text-[10px] font-bold text-white"
                  style={{ background: av.bg, marginLeft: i === 0 ? 0 : -8 }}
                >
                  {av.initials}
                </div>
              ))}
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background text-[10px] font-bold text-white"
                style={{ background: "#5F5E5A", marginLeft: -8 }}
              >
                +
              </div>
            </div>

            <p className="text-xs leading-snug text-muted-foreground">
              <span className="font-medium text-foreground">45,000+ students</span> already matched
              <br />
              across 120+ universities worldwide
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative hidden h-[460px] lg:block">
          {/* Match card */}
          <div
            className={`absolute left-[8%] top-0 w-72 rounded-2xl border bg-card/60 p-4 backdrop-blur-md ${
              !isDark ? "border-primary/20 shadow-lg shadow-primary/20" : "border-border"
            }`}
            style={{ animation: "floatA 5s ease-in-out infinite" }}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-widest text-muted-foreground">Top match</span>
              <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                {topMatch.score}%
              </span>
            </div>

            <p className="text-[16px] font-bold text-foreground">{topMatch.role}</p>
            <p className="mb-3 text-[12px] text-muted-foreground">
              {topMatch.company} · {topMatch.location}
            </p>

            <div className="mb-3 flex flex-wrap gap-1.5">
              {topMatch.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2.5">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${topMatch.score}%` }} />
              </div>
              <span className="text-[12px] font-semibold text-primary">{topMatch.score}%</span>
            </div>
          </div>

          {/* Weekly stats */}
          <div
            className={`absolute right-0 top-1/2 w-56 -translate-y-1/2 rounded-2xl border bg-card/60 p-4 backdrop-blur-md ${
              !isDark ? "border-primary/20 shadow-lg shadow-primary/20" : "border-border"
            }`}
            style={{ animation: "floatB 6s ease-in-out infinite" }}
          >
            <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
              <Activity className="h-4 w-4 text-primary" />
            </div>

            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">New opportunities</p>
            <p className="mt-0.5 text-[22px] font-black text-foreground">{weeklyStats.count}</p>
            <p className="text-[12px] text-muted-foreground">roles this week</p>

            <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-primary">
              <TrendingUp className="h-3 w-3" />
              {weeklyStats.delta}
            </div>
          </div>

          {/* Profile card */}
          <div
            className={`absolute bottom-0 left-0 w-64 rounded-2xl border bg-card/60 p-4 backdrop-blur-md ${
              !isDark ? "border-primary/20 shadow-lg shadow-primary/20" : "border-border"
            }`}
            style={{ animation: "floatC 7s ease-in-out infinite" }}
          >
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                {profileCard.initials}
              </div>
              <div>
                <p className="text-[14px] font-semibold text-foreground">{profileCard.name}</p>
                <p className="text-[11px] text-muted-foreground">{profileCard.uni}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-[16px] font-bold text-foreground">{profileCard.apps}</p>
                <p className="text-[10px] text-muted-foreground">Apps</p>
              </div>
              <div>
                <p className="text-[16px] font-bold text-foreground">{profileCard.interviews}</p>
                <p className="text-[10px] text-muted-foreground">Interviews</p>
              </div>
              <div>
                <p className="text-[16px] font-bold text-foreground">{profileCard.matchRate}</p>
                <p className="text-[10px] text-muted-foreground">Match</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatA {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes floatB {
          0%,100% { transform: translateY(-50%) translateX(0px); }
          50% { transform: translateY(-50%) translateX(-6px); }
        }
        @keyframes floatC {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(8px); }
        }
      `}</style>
    </section>
  );
};

export default Hero;