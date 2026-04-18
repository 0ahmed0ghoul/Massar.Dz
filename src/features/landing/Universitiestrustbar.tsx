const universities = [
    {
      type: "guelma",
      jsx: (
        <div className="text-center leading-snug">
          <div style={{ fontFamily: "Georgia, serif", fontSize: 20, letterSpacing: "0.18em", color: "#e8e8e8", textTransform: "uppercase" }}>Guelma</div>
          <div style={{ fontSize: 9, letterSpacing: "0.3em", color: "rgba(232,232,232,0.5)", textTransform: "uppercase" }}>University</div>
        </div>
      ),
    },
    {
      type: "esi",
      jsx: (
        <span style={{ fontFamily: "Arial, sans-serif", fontSize: 32, fontWeight: 900, color: "#e8e8e8", letterSpacing: "0.04em" }}>
          ESI
        </span>
      ),
    },
    {
      type: "ensia",
      jsx: (
        <span style={{ fontFamily: "Arial, sans-serif", fontSize: 28, fontWeight: 900, letterSpacing: "0.06em", color: "#e8e8e8" }}>
          ENSIA
        </span>
      ),
    },
    {
      type: "boumerdes",
      jsx: (
        <div className="text-center leading-snug">
          <div style={{ fontFamily: "Georgia, serif", fontSize: 13, color: "rgba(232,232,232,0.55)", letterSpacing: "0.04em" }}>University of</div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#e8e8e8" }}>Boumerdes</div>
        </div>
      ),
    },
    {
      type: "tebessa",
      jsx: (
        <div className="text-center leading-snug">
          <div style={{ fontFamily: "Georgia, serif", fontSize: 13, color: "rgba(232,232,232,0.55)" }}>University of</div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#e8e8e8", letterSpacing: "0.04em" }}>Tébessa</div>
        </div>
      ),
    },
    {
      type: "constantine",
      jsx: (
        <div className="text-center leading-snug">
          <div style={{ fontFamily: "Georgia, serif", fontSize: 13, color: "rgba(232,232,232,0.55)" }}>University of</div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#e8e8e8" }}>Constantine</div>
        </div>
      ),
    },
    {
      type: "usthb",
      jsx: (
        <span style={{ fontFamily: "Arial, sans-serif", fontSize: 26, fontWeight: 800, color: "#e8e8e8", letterSpacing: "0.06em" }}>
          USTHB
        </span>
      ),
    },
    {
      type: "oran",
      jsx: (
        <div className="text-center leading-snug">
          <div style={{ fontFamily: "Georgia, serif", fontSize: 13, color: "rgba(232,232,232,0.55)" }}>University of</div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#e8e8e8" }}>Oran</div>
        </div>
      ),
    },
  ];
  
  const companies = [
    { name: "SONATRACH",       style: { fontFamily: "Arial, sans-serif", fontSize: 24, fontWeight: 700, color: "#e8e8e8", letterSpacing: "0.05em" } },
    { name: "Algérie Télécom", style: { fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 22, fontWeight: 300, color: "#e8e8e8" } },
    { name: "SONELGAZ",        style: { fontFamily: "Arial, sans-serif", fontSize: 24, fontWeight: 700, color: "#e8e8e8", letterSpacing: "0.03em" } },
    { name: "YALIDINE",        style: { fontFamily: "Arial, sans-serif", fontSize: 26, fontWeight: 900, letterSpacing: "0.08em", color: "#e8e8e8" } },
    { name: "YASSIR",          style: { fontFamily: "Arial, sans-serif", fontSize: 24, fontWeight: 900, letterSpacing: "0.12em", color: "#e8e8e8" } },
    { name: "Ooredoo",         style: { fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 26, fontWeight: 600, color: "#e8e8e8" } },
    { name: "BNA BANK",        style: { fontFamily: "Arial, sans-serif", fontSize: 20, fontWeight: 700, letterSpacing: "0.06em", color: "#e8e8e8" } },
    { name: "Air Algérie",     style: { fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 22, fontWeight: 500, color: "#e8e8e8" } },
  ];
  
  const ITEM_OPACITY = 0.45;
  
  const LogoItem = ({ children }) => (
    <div
      style={{
        flexShrink: 0,
        padding: "0 48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        height: 80,
        opacity: ITEM_OPACITY,
        transition: "opacity 0.3s",
        cursor: "default",
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
      onMouseLeave={e => (e.currentTarget.style.opacity = String(ITEM_OPACITY))}
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
      <section
        className="relative overflow-hidden bg-[#0b0c0e] py-16"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Grid texture */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
  
        {/* Label */}
        <p className="relative z-10 mb-11 text-center text-[11px] font-medium uppercase tracking-[0.1em] text-white/30">
          Trusted by thousands of students &amp; professionals
        </p>
  
        {/* Row 1 — Universities */}
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0b0c0e] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0b0c0e] to-transparent z-10" />
          <div className="scroll-left flex w-fit">
            {[...universities, ...universities].map((u, i) => (
              <LogoItem key={i}>{u.jsx}</LogoItem>
            ))}
          </div>
        </div>
  
        {/* Middle divider */}
        <div className="relative z-10 mx-auto my-9 flex max-w-3xl items-center gap-5 px-10">
          <div className="h-px flex-1 bg-white/[0.08]" />
          <span className="whitespace-nowrap text-[11px] font-medium uppercase tracking-wider text-white/25">
            also trusted by teams at
          </span>
          <div className="h-px flex-1 bg-white/[0.08]" />
        </div>
  
        {/* Row 2 — Companies */}
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0b0c0e] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0b0c0e] to-transparent z-10" />
          <div className="scroll-right flex w-fit">
            {[...companies, ...companies].map((c, i) => (
              <LogoItem key={i}>
                <span style={c.style}>{c.name}</span>
              </LogoItem>
            ))}
          </div>
        </div>
  
        {/* Stats */}
        <div className="relative z-10 mx-auto mt-12 flex max-w-2xl justify-center border-t border-white/[0.07] pt-10">
          {stats.map((s, i) => (
            <div
              key={i}
              className="max-w-[180px] flex-1 px-6 text-center"
              style={{
                borderRight:
                  i < stats.length - 1 ? "0.5px solid rgba(255,255,255,0.07)" : "none",
              }}
            >
              <div className="mb-1 text-[26px] font-black tracking-tight text-white">{s.val}</div>
              <div className="text-[10px] font-medium uppercase tracking-[0.09em] text-white/30">{s.lbl}</div>
            </div>
          ))}
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