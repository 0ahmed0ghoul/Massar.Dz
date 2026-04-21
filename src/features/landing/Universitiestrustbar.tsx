const universities = [
  {
    type: "guelma",
    jsx: (
      <div className="text-center leading-snug">
        <div className="font-serif text-xl tracking-[0.18em] text-foreground/70 uppercase">
          Guelma
        </div>
        <div className="text-[9px] tracking-[0.3em] text-foreground/40 uppercase">
          University
        </div>
      </div>
    ),
  },
  {
    type: "esi",
    jsx: (
      <span className="font-sans text-3xl font-black tracking-wide text-foreground/70">
        ESI
      </span>
    ),
  },
  {
    type: "ensia",
    jsx: (
      <span className="font-sans text-2xl font-black tracking-wider text-foreground/70">
        ENSIA
      </span>
    ),
  },
  {
    type: "boumerdes",
    jsx: (
      <div className="text-center leading-snug">
        <div className="font-serif text-xs tracking-wide text-foreground/40">
          University of
        </div>
        <div className="font-serif text-xl text-foreground/70">Boumerdes</div>
      </div>
    ),
  },
  {
    type: "tebessa",
    jsx: (
      <div className="text-center leading-snug">
        <div className="font-serif text-xs tracking-wide text-foreground/40">
          University of
        </div>
        <div className="font-serif text-xl tracking-wide text-foreground/70">
          Tébessa
        </div>
      </div>
    ),
  },
  {
    type: "constantine",
    jsx: (
      <div className="text-center leading-snug">
        <div className="font-serif text-xs tracking-wide text-foreground/40">
          University of
        </div>
        <div className="font-serif text-xl text-foreground/70">Constantine</div>
      </div>
    ),
  },
  {
    type: "usthb",
    jsx: (
      <span className="font-sans text-2xl font-extrabold tracking-wider text-foreground/70">
        USTHB
      </span>
    ),
  },
  {
    type: "oran",
    jsx: (
      <div className="text-center leading-snug">
        <div className="font-serif text-xs tracking-wide text-foreground/40">
          University of
        </div>
        <div className="font-serif text-xl text-foreground/70">Oran</div>
      </div>
    ),
  },
];

const companies = [
  { name: "SONATRACH",       className: "font-sans text-2xl font-bold tracking-wide text-foreground/70" },
  { name: "Algérie Télécom", className: "font-sans text-xl font-light text-foreground/70" },
  { name: "SONELGAZ",        className: "font-sans text-2xl font-bold tracking-tight text-foreground/70" },
  { name: "YALIDINE",        className: "font-sans text-2xl font-black tracking-wider text-foreground/70" },
  { name: "YASSIR",          className: "font-sans text-2xl font-black tracking-wider text-foreground/70" },
  { name: "Ooredoo",         className: "font-sans text-2xl font-semibold text-foreground/70" },
  { name: "BNA BANK",        className: "font-sans text-xl font-bold tracking-wide text-foreground/70" },
  { name: "Air Algérie",     className: "font-sans text-xl font-medium text-foreground/70" },
];
const ITEM_OPACITY = "opacity-40";

const LogoItem = ({ children }) => (
  <div
    className={`flex h-20 shrink-0 cursor-default items-center justify-center border-r border-border/40 px-12 ${ITEM_OPACITY} transition-opacity duration-300 hover:opacity-90`}
  >
    {children}
  </div>
);

const stats = [
  { val: "120+", lbl: "Universities"    },
  { val: "45K+", lbl: "Active Students" },
  { val: "91%",  lbl: "Placement Rate"  },
  { val: "156%", lbl: "YoY Growth"      },
];

const UniversitiesCompaniesTrustBar = () => {
  return (
    <section className="relative overflow-hidden border-y border-border bg-background py-16">
      {/* Grid pattern - using inline style for guaranteed visibility */}
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

      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Label */}
        <p className="mb-11 text-center text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
          Trusted by thousands of students &amp; professionals
        </p>

        {/* Row 1 — Universities */}
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-24 bg-gradient-to-l from-background to-transparent" />
          <div className="scroll-left flex w-fit">
            {[...universities, ...universities].map((u, i) => (
              <LogoItem key={i}>{u.jsx}</LogoItem>
            ))}
          </div>
        </div>

        {/* Middle divider */}
        <div className="mx-auto my-9 flex max-w-3xl items-center gap-5 px-10">
          <div className="h-px flex-1 bg-border/50" />
          <span className="whitespace-nowrap text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
            also trusted by teams at
          </span>
          <div className="h-px flex-1 bg-border/50" />
        </div>

        {/* Row 2 — Companies */}
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-24 bg-gradient-to-l from-background to-transparent" />
          <div className="scroll-right flex w-fit">
            {[...companies, ...companies].map((c, i) => (
              <LogoItem key={i}>
                <span className={c.className}>{c.name}</span>
              </LogoItem>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-12 flex max-w-2xl justify-center border-t border-border/50 pt-10">
          {stats.map((s, i) => (
            <div
              key={i}
              className="max-w-[180px] flex-1 px-6 text-center"
              style={{
                borderRight:
                  i < stats.length - 1 ? "0.5px solid" : "none",
                borderRightColor: "hsl(var(--border) / 0.5)",
              }}
            >
              <div className="mb-1 text-2xl font-black tracking-tight text-foreground">
                {s.val}
              </div>
              <div className="text-[10px] font-medium uppercase tracking-[0.09em] text-muted-foreground/70">
                {s.lbl}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .scroll-left  { animation: scrollL 40s linear infinite; }
        .scroll-right { animation: scrollR 38s linear infinite; }
        .scroll-left:hover, .scroll-right:hover { animation-play-state: paused; }
        @keyframes scrollL { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes scrollR { from { transform: translateX(-50%); } to { transform: translateX(0); } }
      `}</style>
    </section>
  );
};

export default UniversitiesCompaniesTrustBar;