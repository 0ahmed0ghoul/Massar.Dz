// pages/NotFoundPage.tsx
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Search, Compass, Wallet } from "lucide-react";

// ─── Quick Links ──────────────────────────────────────────────────────────────

const QUICK_LINKS = [
  { icon: Wallet,    label: "Pricing",    to: "/pricing" },
  { icon: Search,  label: "Browse Jobs",  to: "/jobs" },
  { icon: Compass, label: "Internships",  to: "/internships" },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background overflow-hidden px-4">

      {/* ── Background layers ── */}

      {/* Grid texture */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-[0.04]" />

      {/* Primary green orb — top left */}
      <div className="pointer-events-none absolute -top-40 -left-20 h-[560px] w-[560px]
                      rounded-full bg-[#639922]/[0.09] blur-[130px]" />

      {/* Secondary orb — bottom right */}
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-[400px] w-[400px]
                      rounded-full bg-[#639922]/[0.06] blur-[100px]" />

      {/* Faint center radial glow behind the 404 */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[300px] w-[600px]
                      -translate-x-1/2 -translate-y-1/2 rounded-full
                      bg-[#639922]/[0.04] blur-[80px]" />

      {/* Top accent line */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px
                      bg-gradient-to-r from-transparent via-[#639922]/50 to-transparent" />

      {/* Bottom accent line */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px
                      bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full">

        {/* Eyebrow badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#639922]/20
                        bg-[#639922]/8 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#639922] animate-pulse" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#639922]">
            Error 404
          </span>
        </div>

        {/* Giant 404 — typographic hero */}
        <div className="relative mb-2 select-none">
          {/* Ghost 404 behind — creates depth */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center
                       text-[160px] sm:text-[200px] font-black tracking-tighter leading-none
                       text-white/[0.015] blur-sm"
          >
            404
          </span>
          {/* Foreground 404 */}
          <span className="relative block text-[140px] sm:text-[180px] font-black tracking-tighter leading-none
                           bg-gradient-to-b from-white/70 via-white/40 to-white/10
                           bg-clip-text text-transparent">
            404
          </span>
        </div>

        {/* Divider line with dot */}
        <div className="mb-8 flex items-center gap-3 w-full max-w-xs">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/[0.1]" />
          <span className="h-1 w-1 rounded-full bg-[#639922]/60" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/[0.1]" />
        </div>

        {/* Headline */}
        <h1 className="mb-3 text-2xl sm:text-3xl font-bold tracking-tight text-white/85">
          Page not found
        </h1>

        {/* Subtext */}
        <p className="mb-10 text-sm sm:text-base text-white/35 leading-relaxed max-w-sm">
          The page you're looking for doesn't exist, has been moved, or you don't have
          permission to access it.
        </p>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center mb-10">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1]
                       bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/60
                       hover:border-white/[0.18] hover:bg-white/[0.07] hover:text-white/85
                       transition-all duration-150 w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 rounded-xl border border-[#639922]/30
                       bg-[#639922]/12 px-5 py-2.5 text-sm font-semibold text-[#639922]
                       hover:bg-[#639922]/20 hover:border-[#639922]/50
                       hover:shadow-[0_4px_20px_rgba(99,153,34,0.2)]
                       transition-all duration-150 w-full sm:w-auto justify-center"
          >
            <Home className="h-4 w-4" />
            Take me home
          </button>
        </div>

        {/* Quick links */}
        <div className="w-full">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-white/20">
            Or try one of these
          </p>
          <div className="grid grid-cols-3 gap-2">
            {QUICK_LINKS.map(({ icon: Icon, label, to }) => (
              <button
                key={to}
                onClick={() => navigate(to)}
                className="flex flex-col items-center gap-2 rounded-xl border border-white/[0.06]
                           bg-white/[0.02] px-3 py-4
                           hover:border-[#639922]/20 hover:bg-[#639922]/[0.04]
                           transition-all duration-150 group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg
                                border border-white/[0.08] bg-white/[0.04]
                                group-hover:border-[#639922]/25 group-hover:bg-[#639922]/10
                                transition-all duration-150">
                  <Icon className="h-3.5 w-3.5 text-white/35 group-hover:text-[#639922] transition-colors duration-150" />
                </div>
                <span className="text-[12px] font-medium text-white/35 group-hover:text-white/60 transition-colors duration-150">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-12 text-[11px] text-white/15">
          If you believe this is an error, contact your system administrator.
        </p>
      </div>
    </div>
  );
}