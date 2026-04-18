import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Activity } from "lucide-react";

/* ── Floating UI card data ─────────────────────────────────── */
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

/* ── Component ─────────────────────────────────────────────── */
const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#0b0c0e]">
      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Green glow orb */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[500px] -translate-x-1/4 rounded-full bg-[#639922]/[0.07] blur-3xl" />

      <div className="container relative z-10 grid items-center gap-12 py-24 lg:grid-cols-2 lg:py-32">

        {/* ── LEFT ─────────────────────────────────────────────── */}
        <div className="flex flex-col">
          {/* Badge */}
          <div className="mb-8 flex w-fit items-center gap-2 rounded-full border border-[#639922]/30 px-3 py-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#639922]/20">
              <span className="block h-2 w-2 rounded-full bg-[#639922]" />
            </span>
            <span className="text-xs font-medium tracking-wide text-[#639922]">
              The smarter way to recruit
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight text-white lg:text-6xl">
            Where{" "}
            <span
              className="font-extrabold"
              style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.45)", color: "transparent" }}
            >
              talent
            </span>{" "}
            meets{" "}
            <span className="text-[#639922]">opportunity</span>
            <br />— powered by data
          </h1>

          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/45">
            Massar connects students, employers, and universities on a single
            platform. Smarter matching, transparent outcomes, and better career
            decisions.
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              asChild
              className="gap-2 bg-[#639922] text-white hover:bg-[#4f7a1a]"
            >
              <Link to="/register/student">
                Find your next role <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/15 text-white/70 hover:border-white/40 hover:bg-transparent hover:text-white"
            >
              <Link to="/jobs" className="text-black hover:border-white/40">Browse jobs</Link>
            </Button>
          </div>

          {/* Social proof */}
          <div className="mt-10 flex items-center gap-3">
            <div className="flex">
              {avatars.map((av, i) => (
                <div
                  key={i}
                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0b0c0e] text-[10px] font-bold text-white"
                  style={{ background: av.bg, marginLeft: i === 0 ? 0 : -8 }}
                >
                  {av.initials}
                </div>
              ))}
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0b0c0e] text-[10px] font-bold text-white"
                style={{ background: "#5F5E5A", marginLeft: -8 }}
              >
                +
              </div>
            </div>
            <p className="text-xs leading-snug text-white/40">
              <span className="font-medium text-white/75">45,000+ students</span> already matched
              <br />
              across 120+ universities worldwide
            </p>
          </div>
        </div>

        {/* ── RIGHT — Floating Cards ────────────────────────────── */}
        <div className="relative hidden h-[460px] lg:block">

          {/* Match card */}
          <div
            className="absolute left-[8%] top-0 w-72 rounded-2xl border border-white/[0.09] bg-white/[0.04] p-4 backdrop-blur-md"
            style={{ animation: "floatA 5s ease-in-out infinite" }}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-widest text-white/40">Top match for you</span>
              <span className="rounded-full bg-[#639922]/15 px-2.5 py-0.5 text-[11px] font-bold text-[#639922]">
                {topMatch.score}% match
              </span>
            </div>
            <p className="text-[16px] font-bold text-white">{topMatch.role}</p>
            <p className="mb-3 text-[12px] text-white/50">
              {topMatch.company} · {topMatch.location}
            </p>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {topMatch.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/[0.08] bg-white/[0.06] px-2.5 py-0.5 text-[11px] text-white/55"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2.5">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
                <div className="h-full rounded-full bg-[#639922]" style={{ width: `${topMatch.score}%` }} />
              </div>
              <span className="text-[12px] font-semibold text-[#639922]">{topMatch.score}%</span>
            </div>
          </div>

          {/* Weekly stats card */}
          <div
            className="absolute right-0 top-1/2 w-56 -translate-y-1/2 rounded-2xl border border-white/[0.09] bg-white/[0.04] p-4 backdrop-blur-md"
            style={{ animation: "floatB 6s ease-in-out infinite" }}
          >
            <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-[#639922]/15">
              <Activity className="h-4 w-4 text-[#639922]" />
            </div>
            <p className="text-[11px] uppercase tracking-widest text-white/40">New opportunities</p>
            <p className="mt-0.5 text-[22px] font-black tracking-tight text-white">{weeklyStats.count}</p>
            <p className="text-[12px] text-white/40">roles this week</p>
            <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-[#639922]">
              <TrendingUp className="h-3 w-3" />
              {weeklyStats.delta} vs last week
            </div>
          </div>

          {/* Profile card */}
          <div
            className="absolute bottom-0 left-0 w-64 rounded-2xl border border-white/[0.09] bg-white/[0.04] p-4 backdrop-blur-md"
            style={{ animation: "floatC 7s ease-in-out infinite" }}
          >
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#639922] to-[#3B6D11] text-[14px] font-bold text-white">
                {profileCard.initials}
              </div>
              <div>
                <p className="text-[14px] font-semibold text-white">{profileCard.name}</p>
                <p className="text-[11px] text-white/45">{profileCard.uni}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="block h-1.5 w-1.5 rounded-full bg-[#639922]" />
              <span className="text-[11px] text-white/45">{profileCard.status}</span>
            </div>
            <div className="my-3 h-px bg-white/[0.07]" />
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: profileCard.apps, lbl: "Applications" },
                { val: profileCard.interviews, lbl: "Interviews" },
                { val: profileCard.matchRate, lbl: "Match rate" },
              ].map((s) => (
                <div key={s.lbl}>
                  <p className="text-[16px] font-bold text-white">{s.val}</p>
                  <p className="text-[10px] text-white/35">{s.lbl}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatA {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-10px); }
        }
        @keyframes floatB {
          0%,100% { transform: translateY(-50%) translateX(0px); }
          50%      { transform: translateY(-50%) translateX(-6px); }
        }
        @keyframes floatC {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(8px); }
        }
      `}</style>
    </section>
  );
};

export default Hero;