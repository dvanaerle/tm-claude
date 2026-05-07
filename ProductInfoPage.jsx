import { useState, useEffect, useRef, useId } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   TUINMAXIMAAL DESIGN SYSTEM
═══════════════════════════════════════════════════════════════════════════ */

const C = {
  darkGreen: "#001A13", green: "#003017", mediumGreen: "#002E21",
  orange: "#FF8000", lighterGreen: "#809700", lightGreen: "#6D8005",
  sand: "#F5E6D7", beige: "#FFF5ED", bone: "#E0D2C5",
  white: "#FFFFFF", lightGrey: "#E3E3E3", grey: "#636363", darkGrey: "#4A4A4A",
  warning: "#A16207",
  onDarkPrimary: "#FFFFFF", onDarkSecondary: "#E8DDC8", onDarkMuted: "#C9BFA9",
};

const S = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 64 };
const R = { sm: 2, button: 4, card: 8, full: 9999 };

/* ═══════════════════════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════════════════════ */
const STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${C.beige}; -webkit-font-smoothing: antialiased; }
  body, button, input { font-family: 'ArticulatCF', 'Helvetica Neue', Arial, sans-serif; }

  .bento {
    display: grid; gap: 12px;
    grid-template-columns: repeat(12, 1fr);
    grid-auto-rows: minmax(120px, auto);
  }
  @media (max-width: 768px) {
    .bento { grid-template-columns: repeat(2, 1fr) !important; gap: 10px; }
    .bento > * { grid-column: span 2 !important; grid-row: auto !important; }
    .bento > [data-mob="1"] { grid-column: span 1 !important; }
  }

  /* Cards — 8px radius, no default border */
  .card {
    background: ${C.white};
    border-radius: ${R.card}px;
    border: none;
    overflow: hidden; position: relative;
    transition: transform .25s ease, box-shadow .25s ease;
  }
  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 26, 19, 0.07);
  }
  /* border-card: applied only when card surface == section surface (no contrast) */
  .border-card { border: 1px solid ${C.lightGrey} !important; }
  .border-card:hover { border-color: ${C.bone} !important; }

  .card.dark {
    background: ${C.green}; color: ${C.onDarkPrimary};
    border: 1px solid ${C.darkGreen};
  }
  .card.dark:hover { border-color: ${C.mediumGreen}; }
  .card.beige { background: ${C.beige}; border: none; }
  .card.beige:hover { box-shadow: 0 6px 20px rgba(0, 26, 19, 0.07); }
  /* beige on beige = same surface → needs visible edge */
  .border-card.card.beige { border: 1px solid ${C.bone} !important; }
  .border-card.card.beige:hover { border-color: ${C.lightGrey} !important; }
  .card.sand { background: ${C.sand}; border: none; }
  .card.sand:hover { box-shadow: 0 6px 20px rgba(0, 26, 19, 0.07); }

  *:focus { outline: none; }
  *:focus-visible {
    outline: 2px solid ${C.green};
    outline-offset: 3px;
    border-radius: ${R.button}px;
  }

  .skip-link {
    position: absolute; left: -9999px; top: 0; z-index: 200;
    padding: 12px 20px; background: ${C.green}; color: ${C.white};
    font-weight: 600; border-radius: ${R.button}px;
  }
  .skip-link:focus { left: 16px; top: 16px; }

  .nav-pill { transition: color .15s, background .15s; }
  .nav-pill:hover { color: ${C.green}; background: ${C.beige}; }
  .nav-pill[aria-current="page"] { background: ${C.green}; color: ${C.white}; }

  .tab-btn { transition: color .2s; }
  .tab-indicator { transition: left .3s cubic-bezier(.4,.2,.2,1), width .3s cubic-bezier(.4,.2,.2,1); }
  .acc-body { overflow: hidden; transition: max-height .35s cubic-bezier(.2,.8,.2,1); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .reveal { animation: fadeUp .8s cubic-bezier(.2,.8,.2,1) both; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  nav.topbar::-webkit-scrollbar { display: none; }
  nav.topbar { scrollbar-width: none; }

  .grain {
    position: absolute; inset: 0; pointer-events: none; opacity: .25;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .15 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  .sr-only {
    position: absolute; width: 1px; height: 1px;
    padding: 0; margin: -1px; overflow: hidden;
    clip: rect(0,0,0,0); white-space: nowrap; border: 0;
  }

  /* Image placeholder styles */
  .img-placeholder {
    position: relative;
    background:
      linear-gradient(135deg, transparent 49.5%, ${C.bone} 49.5%, ${C.bone} 50.5%, transparent 50.5%),
      linear-gradient(45deg, transparent 49.5%, ${C.bone} 49.5%, ${C.bone} 50.5%, transparent 50.5%),
      ${C.beige};
    background-size: 100% 100%;
    overflow: hidden;
    isolation: isolate;
  }
  .img-placeholder::before {
    content: "";
    position: absolute; inset: 0;
    background: repeating-linear-gradient(
      45deg,
      ${C.bone}33,
      ${C.bone}33 1px,
      transparent 1px,
      transparent 18px
    );
    z-index: 0;
  }
  .img-placeholder.dark {
    background:
      linear-gradient(135deg, transparent 49.5%, rgba(255,255,255,.08) 49.5%, rgba(255,255,255,.08) 50.5%, transparent 50.5%),
      linear-gradient(45deg, transparent 49.5%, rgba(255,255,255,.08) 49.5%, rgba(255,255,255,.08) 50.5%, transparent 50.5%),
      ${C.darkGreen};
  }
  .img-placeholder.dark::before {
    background: repeating-linear-gradient(
      45deg,
      rgba(255,255,255,.05),
      rgba(255,255,255,.05) 1px,
      transparent 1px,
      transparent 18px
    );
  }
  .img-content {
    position: relative; z-index: 1;
    width: 100%; height: 100%;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 10px; text-align: center; padding: 20px;
  }
`;

function GlobalStyles() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
}

/* ═══════════════════════════════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════════════════════════════ */
const Arrow = () => <svg aria-hidden="true" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7"/></svg>;
const Plus  = () => <svg aria-hidden="true" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14"/></svg>;
const Check = () => <svg aria-hidden="true" width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>;
const Cross = () => <svg aria-hidden="true" width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>;
const ImageIcon = ({ size = 24, dark }) => (
  <svg aria-hidden="true" width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={dark ? C.onDarkSecondary : C.darkGrey} strokeWidth={1.5}>
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5" fill={dark ? C.onDarkSecondary : C.darkGrey}/>
    <path d="M21 15l-5-5L5 21"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════════════
   IMAGE PLACEHOLDER
   Een mooie placeholder die laat zien wáár een foto moet komen,
   met aspect ratio + use case label
═══════════════════════════════════════════════════════════════════════════ */
function ImagePlaceholder({
  aspect,         // aspect ratio: "16/9", "4/3", "1/1", "3/4"
  label,          // korte naam: "Hero foto"
  description,    // wat moet er op de foto: "Avondsfeer, lampen aan, gezin onder overkapping"
  dark = false,
  fill = false,   // vul volledige parent
  rounded = true,
  className = "",
}) {
  return (
    <div
      role="img"
      aria-label={`Image placeholder: ${label}. ${description || ""}`}
      className={`img-placeholder ${dark ? "dark" : ""} ${className}`}
      style={{
        aspectRatio: fill ? undefined : aspect,
        width: "100%",
        height: fill ? "100%" : undefined,
        minHeight: fill ? 200 : undefined,
        borderRadius: rounded ? R.card : 0,
      }}
    >
      <div className="img-content">
        <div style={{
          width: 48, height: 48, borderRadius: R.full,
          background: dark ? "rgba(255,255,255,0.08)" : C.white,
          border: `1px solid ${dark ? "rgba(255,255,255,0.18)" : C.bone}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <ImageIcon size={22} dark={dark} />
        </div>
        <div>
          <div style={{
            fontSize: 11, fontWeight: 700,
            letterSpacing: "0.08em", textTransform: "uppercase",
            color: dark ? C.onDarkSecondary : C.darkGrey,
          }}>{label}</div>
          {description && (
            <div style={{
              fontSize: 12, fontWeight: 400,
              color: dark ? C.onDarkMuted : C.grey,
              marginTop: 6, lineHeight: 1.5, maxWidth: 320,
            }}>{description}</div>
          )}
          {aspect && (
            <div style={{
              fontSize: 10, fontWeight: 600,
              color: dark ? C.onDarkMuted : C.grey,
              marginTop: 6,
              fontVariantNumeric: "tabular-nums",
            }}>{aspect}</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TYPOGRAPHY
═══════════════════════════════════════════════════════════════════════════ */

function H1({ children, light, id }) {
  return (
    <h1 id={id} style={{
      fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 700,
      lineHeight: 1.05, letterSpacing: "-0.025em",
      color: light ? C.onDarkPrimary : C.green,
    }}>{children}</h1>
  );
}

function H2({ children, light, id }) {
  return (
    <h2 id={id} style={{
      fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700,
      lineHeight: 1.15, letterSpacing: "-0.02em",
      color: light ? C.onDarkPrimary : C.green,
    }}>{children}</h2>
  );
}

function H3({ children, light, size }) {
  return (
    <h3 style={{
      fontSize: size || 24, fontWeight: 700, lineHeight: 1.292,
      color: light ? C.onDarkPrimary : C.green,
    }}>{children}</h3>
  );
}

function H5({ children, light, as: Tag = "h4" }) {
  return (
    <Tag style={{
      fontSize: 18, fontWeight: 600, lineHeight: 1.278,
      color: light ? C.onDarkPrimary : C.green,
    }}>{children}</Tag>
  );
}

function Body({ children, size = "md", muted, light }) {
  const sizes = { lg: 18, md: 16, sm: 14, xs: 12 };
  const color = light
    ? muted ? C.onDarkSecondary : C.onDarkPrimary
    : muted ? C.darkGrey : C.green;
  return (
    <p style={{ fontSize: sizes[size], fontWeight: 400, lineHeight: 1.5, color }}>
      {children}
    </p>
  );
}

function Eyebrow({ children, light }) {
  return (
    <div style={{
      fontSize: 12, fontWeight: 600,
      letterSpacing: "0.06em", textTransform: "uppercase",
      color: light ? C.onDarkSecondary : C.darkGrey,
      display: "inline-flex", alignItems: "center", gap: 8,
    }}>
      <span aria-hidden="true" style={{
        width: 6, height: 6, borderRadius: R.full,
        background: C.lighterGreen, display: "inline-block", flexShrink: 0,
      }}/>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BUTTONS
═══════════════════════════════════════════════════════════════════════════ */

function PrimaryBtn({ children, full, ariaLabel, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={onClick} aria-label={ariaLabel}
      style={{
        display: "inline-flex", alignItems: "center", gap: S.sm,
        padding: "12px 24px 8px 24px",
        background: hover ? C.lightGreen : C.lighterGreen,
        color: C.white, fontSize: 16, fontWeight: 600, lineHeight: 1.5,
        border: `4px solid ${C.lightGreen}`,
        borderTop: "none", borderLeft: "none", borderRight: "none",
        borderRadius: R.button, cursor: "pointer",
        transition: "background 0.15s ease",
        width: full ? "100%" : "auto",
        justifyContent: "center", fontFamily: "inherit", minHeight: 44,
      }}
    >{children}</button>
  );
}

function SecondaryBtn({ children, light, ariaLabel, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={onClick} aria-label={ariaLabel}
      style={{
        display: "inline-flex", alignItems: "center", gap: S.sm,
        padding: "10px 24px",
        background: hover ? (light ? C.white : C.green) : "transparent",
        color: hover
          ? (light ? C.green : C.white)
          : (light ? C.onDarkPrimary : C.green),
        fontSize: 16, fontWeight: 600, lineHeight: 1.5,
        border: `1px solid ${light ? C.onDarkSecondary : C.green}`,
        borderRadius: R.button, cursor: "pointer",
        transition: "background 0.15s, color 0.15s",
        fontFamily: "inherit", minHeight: 44,
      }}
    >{children}</button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED
═══════════════════════════════════════════════════════════════════════════ */

function Spec({ label, value, dark }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      padding: `${S.sm}px 0`, gap: S.sm,
      borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.16)" : C.lightGrey}`,
      fontSize: 14,
    }}>
      <span style={{ color: dark ? C.onDarkSecondary : C.darkGrey, fontWeight: 400 }}>{label}</span>
      <span style={{ color: dark ? C.onDarkPrimary : C.green, fontWeight: 600, textAlign: "right" }}>{value}</span>
    </div>
  );
}

function Acc({ title, children, dark }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div style={{ borderTop: `1px solid ${dark ? "rgba(255,255,255,0.16)" : C.lightGrey}` }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open} aria-controls={id}
        style={{
          width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: `${S.md - 2}px 0`, background: "none", border: "none", cursor: "pointer",
          color: dark ? C.onDarkPrimary : C.green,
          fontFamily: "inherit", fontSize: 14, fontWeight: 600, textAlign: "left", minHeight: 44,
        }}
      >
        {title}
        <span aria-hidden="true" style={{
          transform: open ? "rotate(45deg)" : "none",
          transition: "transform 0.3s ease",
          color: dark ? C.onDarkSecondary : C.darkGrey,
        }}><Plus /></span>
      </button>
      <div id={id} className="acc-body" style={{ maxHeight: open ? 600 : 0 }} aria-hidden={!open}>
        <div style={{ paddingBottom: S.md }}>{children}</div>
      </div>
    </div>
  );
}

function BigNum({ value, suffix, label, color = C.green, light }) {
  return (
    <div>
      <div style={{
        fontSize: "clamp(48px, 7vw, 96px)", fontWeight: 700, color,
        lineHeight: 0.95, letterSpacing: "-0.03em",
        display: "flex", alignItems: "baseline",
      }}>
        {value}
        {suffix && <span style={{ fontSize: "0.42em", marginLeft: 4, opacity: 0.85, fontWeight: 600 }}>{suffix}</span>}
      </div>
      {label && (
        <div style={{
          fontSize: 14, fontWeight: 400,
          color: light ? C.onDarkSecondary : C.darkGrey,
          marginTop: S.md - 4, lineHeight: 1.5, maxWidth: 240,
        }}>{label}</div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HEADING HIGHLIGHT
   Inline orange badge on a word/phrase inside a heading.
   textColor: heading.highlight.DEFAULT = white
   backgroundColor: heading.highlight.DEFAULT = tmx-primary-orange (#FF8000)
   Usage: <H1>Buiten leven, <Highlight>het hele jaar</Highlight> door.</H1>
═══════════════════════════════════════════════════════════════════════════ */
function Highlight({ children, paragraph }) {
  // heading-highlight:  padding 8 12 2 12, fontWeight 900, rotate(-2deg), display inline
  // paragraph-highlight: padding 4 12 2 12, fontWeight 700, rotate(-2deg), display inline
  return (
    <span style={{
      display: "inline-block",                     // inline-block so transform applies
      background: C.orange,                        // backgroundColor.heading.highlight.DEFAULT
      color: C.white,                              // textColor.heading.highlight.DEFAULT
      padding: paragraph ? "4px 12px 2px 12px" : "8px 12px 2px 12px",
      fontWeight: paragraph ? 700 : 900,           // 900 heading / 700 paragraph
      transform: "rotate(-2deg)",                  // rotate(-2deg) per DESIGN.md
      boxDecorationBreak: "clone",
      WebkitBoxDecorationBreak: "clone",
    }}>{children}</span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MESSAGE COMPONENTS — per DESIGN.md
   success: 1px solid border all sides, rounded.md (4px), padding 8 8 8 20
   error:   2px solid border all sides (stronger emphasis)
   warning: 1px solid border all sides
   info:    1px solid border all sides
═══════════════════════════════════════════════════════════════════════════ */
const MSG = {
  success: { bg: "#F0FDF4", border: "#22C55E", text: "#166534", icon: "✓", borderW: "1px" },
  error:   { bg: "#FEF2F2", border: "#EF4444", text: "#991B1B", icon: "✕", borderW: "2px" },
  warning: { bg: "#FEFCE8", border: "#A16207", text: "#854D0E", icon: "!",  borderW: "1px" },
  info:    { bg: "#EFF6FF", border: "#1D4ED8", text: "#1E3A8A", icon: "i",  borderW: "1px" },
};

function Message({ variant = "info", children }) {
  const m = MSG[variant];
  return (
    <div
      role={variant === "error" || variant === "warning" ? "alert" : "note"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        background: m.bg,
        borderRadius: R.button,                    // rounded.md = 4px per design system
        border: `${m.borderW} solid ${m.border}`,  // 1px all sides (2px for error)
        padding: "8px 8px 8px 20px",               // exact padding from DESIGN.md
        fontSize: 14,
        lineHeight: 1.5,
        color: m.text,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 18, height: 18,
          borderRadius: R.full,
          background: m.border,
          color: C.white,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, fontWeight: 900,
          flexShrink: 0, marginTop: 1,
        }}
      >{m.icon}</span>
      <span style={{ fontWeight: 400 }}>{children}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DIAGRAMS — kept as SVG (data-rich, more clear than photos)
═══════════════════════════════════════════════════════════════════════════ */

function StrengthBars() {
  const data = [
    { label: "6060-T6 standaard", val: 60, color: C.lightGrey, sub: "Andere merken" },
    { label: "6063-T6", val: 75, color: C.lighterGreen, sub: "Poly & Glass Line", strong: true },
    { label: "6061-T6", val: 95, color: C.orange, sub: "Heavy Duty", strong: true },
  ];
  return (
    <div
      style={{ display: "flex", alignItems: "flex-end", gap: S.lg, height: 200 }}
      role="img"
      aria-label="Sterkte vergelijking: standaard 60 procent, Gumax 6063-T6 75 procent, Gumax 6061-T6 Heavy Duty 95 procent"
    >
      {data.map(({ label, val, color, sub, strong }) => (
        <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
          <div style={{
            width: "100%", height: `${val}%`, background: color,
            borderRadius: `${R.card}px ${R.card}px 0 0`, position: "relative",
          }} aria-hidden="true">
            <div style={{
              position: "absolute", top: -28, left: 0,
              fontSize: 22, fontWeight: 700, color: C.green, letterSpacing: "-0.02em",
            }}>{val}%</div>
          </div>
          <div>
            <div style={{
              fontSize: 12, fontWeight: strong ? 600 : 500,
              color: strong ? C.green : C.darkGrey, lineHeight: 1.3,
            }}>{label}</div>
            <div style={{ fontSize: 11, color: C.grey, marginTop: 2 }}>{sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DimensionDiagram() {
  return (
    <svg viewBox="0 0 400 240" role="img" aria-labelledby="dim-title" style={{ width: "100%", height: "auto" }}>
      <title id="dim-title">Maatschets van een aangebouwde overkapping</title>
      <defs>
        <marker id="ar1" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.green}/>
        </marker>
      </defs>
      <rect x="20" y="30" width="20" height="180" fill={C.bone}/>
      <polygon points="40,80 360,90 360,100 40,90" fill={C.green}/>
      <rect x="40" y="80" width="320" height="14" fill={C.beige}/>
      <rect x="170" y="94" width="10" height="116" fill={C.green}/>
      <rect x="350" y="94" width="10" height="116" fill={C.green}/>
      <line x1="20" y1="210" x2="380" y2="210" stroke={C.lightGrey} strokeWidth="1"/>
      <line x1="40" y1="226" x2="360" y2="226" stroke={C.green} strokeWidth="1.2" markerStart="url(#ar1)" markerEnd="url(#ar1)"/>
      <text x="200" y="222" textAnchor="middle" fontSize="11" fontFamily="ArticulatCF" fontWeight="600" fill={C.green}>3,06 — 12,06 m</text>
      <line x1="378" y1="94" x2="378" y2="210" stroke={C.green} strokeWidth="1.2" markerStart="url(#ar1)" markerEnd="url(#ar1)"/>
      <text x="392" y="156" textAnchor="middle" fontSize="11" fontFamily="ArticulatCF" fontWeight="600" fill={C.green} transform="rotate(90, 392, 156)">2,10 — 2,35 m</text>
      <text x="200" y="68" textAnchor="middle" fontSize="11" fontFamily="ArticulatCF" fontWeight="500" fill={C.darkGrey}>diepte 2,5 / 3 / 3,5 / 4 m</text>
    </svg>
  );
}

function FoundationDiagram({ hwa }) {
  return (
    <svg viewBox="0 0 160 180" role="img" aria-label={hwa ? "Betonpoer met regenwaterafvoer in de staander" : "Betonpoer zonder regenwaterafvoer"} style={{ width: "100%", maxWidth: 200 }}>
      <defs>
        <pattern id="soilPat" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="0.8" fill="#8A7B6C" opacity="0.5"/>
        </pattern>
      </defs>
      <rect x="0" y="0" width="160" height="90" fill={C.beige}/>
      <rect x="0" y="90" width="160" height="90" fill={C.bone}/>
      <rect x="0" y="90" width="160" height="90" fill="url(#soilPat)"/>
      <line x1="0" y1="90" x2="160" y2="90" stroke={C.green} strokeWidth="1.2"/>
      <rect x="65" y="10" width="30" height="80" rx={R.sm} fill={C.green}/>
      <rect x="40" y="92" width="80" height="56" rx={R.button} fill={C.mediumGreen} stroke={C.green} strokeWidth="1"/>
      <text x="80" y="118" textAnchor="middle" fontSize="10" fontFamily="ArticulatCF" fontWeight="700" fill={C.white}>BETONPOER</text>
      <text x="80" y="132" textAnchor="middle" fontSize="9" fontFamily="ArticulatCF" fill={C.white} opacity="0.85">750 kg draagvermogen</text>
      {hwa && (
        <>
          <rect x="71" y="148" width="18" height="28" rx={R.sm} fill={C.lighterGreen}/>
          <text x="80" y="167" textAnchor="middle" fontSize="9" fontFamily="ArticulatCF" fontWeight="700" fill={C.white}>HWA</text>
          <text x="80" y="6" textAnchor="middle" fontSize="10" fontFamily="ArticulatCF" fontWeight="600" fill={C.lightGreen}>regenwater ↓</text>
        </>
      )}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════════════════════════════════ */
const NAV = [
  { id: "begin",       label: "Overzicht" },
  { id: "materiaal",   label: "Materiaal" },
  { id: "afmetingen",  label: "Afmetingen" },
  { id: "kleuren",     label: "Kleuren" },
  { id: "daktypes",    label: "Daktypes" },
  { id: "stijlen",     label: "Stijlen" },
  { id: "accessoires", label: "Accessoires" },
  { id: "fundering",   label: "Fundering" },
];

function SectionHeader({ id, eyebrow, title, sub, light, headingId }) {
  return (
    <div id={id} style={{ scrollMarginTop: 80, marginBottom: S.xl }}>
      <Eyebrow light={light}>{eyebrow}</Eyebrow>
      <div style={{ marginTop: S.md - 2 }}>
        <H2 light={light} id={headingId}>{title}</H2>
        {sub && (
          <div style={{ marginTop: S.md, maxWidth: 600 }}>
            <Body size="lg" muted light={light}>{sub}</Body>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */
export default function Page() {
  const [active, setActive] = useState("begin");
  const [dakTab, setDakTab] = useState("helder");
  const [fundTab, setFundTab] = useState("hwa");
  const tabRefs = useRef({});
  const fundTabRefs = useRef({});
  const [tabIndicator, setTabIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const obs = new IntersectionObserver(
      es => es.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-15% 0px -75% 0px" }
    );
    NAV.forEach(({ id }) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = tabRefs.current[dakTab];
    if (el) setTabIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [dakTab]);

  function handleTabKey(e, currentKey, options, setter) {
    const i = options.findIndex(o => o.k === currentKey);
    if (e.key === "ArrowRight") { e.preventDefault(); setter(options[(i + 1) % options.length].k); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); setter(options[(i - 1 + options.length) % options.length].k); }
    else if (e.key === "Home") { e.preventDefault(); setter(options[0].k); }
    else if (e.key === "End") { e.preventDefault(); setter(options[options.length - 1].k); }
  }

  const dakOptions = [
    { k: "poly", l: "Polycarbonaat" },
    { k: "helder", l: "Helder glas" },
    { k: "melk", l: "Melkglas" },
  ];
  const fundOptions = [
    { k: "hwa", l: "Met regenwaterafvoer" },
    { k: "no-hwa", l: "Zonder afvoer" },
    { k: "beton", l: "Gestort beton" },
  ];

  // Daktypes content per tab
  const dakContent = {
    poly: {
      eyebrow: "Poly Line",
      title: "Zacht licht. Aangenaam koel.",
      desc: "Opaal polycarbonaat tempert de zon en biedt natuurlijke privacy. De eerste keuze voor wie zomerwarmte buiten houdt.",
      stats: [["~55%", "Lichtinval"], ["100", "kg/m² last"], ["B+D", "Inkortbaar"], ["Privacy", "Goed"]],
      placeholder: { label: "Polycarbonaat dak", description: "Close-up van zacht gefilterd licht onder een opaal polycarbonaat dak — diffuse schaduw op terras" },
    },
    helder: {
      eyebrow: "Glass Line",
      pop: true,
      title: "Helder. Onbelemmerd.",
      desc: "98 cm plaatbreedte — uniek bij Gumax®. Minder tussenliggers, meer hemel. Het dichtst bij geen dak.",
      stats: [["~90%", "Lichtinval"], ["98 cm", "Plaatbreedte"], ["Breedte", "Inkortbaar"], ["Uitzicht", "Volledig"]],
      placeholder: { label: "Helder glazen dak", description: "Onderaanzicht door helder glazen dak — blauwe lucht, wolken, minimale tussenliggers" },
    },
    melk: {
      eyebrow: "Glass Line",
      title: "Gefilterd. Geborgen.",
      desc: "De luxe van glas, met de privacy van melkglas. Voor wie de zon wel wil voelen, maar niet alles wil zien.",
      stats: [["Gedempt", "Lichtinval"], ["98 cm", "Plaatbreedte"], ["Breedte", "Inkortbaar"], ["Privacy", "Hoog"]],
      placeholder: { label: "Melkglas dak", description: "Onderaanzicht melkglas — zachte gloed, gefilterd zonlicht zonder direct uitzicht" },
    },
  };

  const dak = dakContent[dakTab];

  return (
    <div style={{ background: C.beige, color: C.green, minHeight: "100vh" }}>
      <GlobalStyles />

      <a href="#main-content" className="skip-link">Sla navigatie over</a>

      {/* ╔═══════════════════════════════════════════════════════════
          NAV
      ╚═══════════════════════════════════════════════════════════ */}
      <nav className="topbar" aria-label="Hoofdnavigatie productinformatie" style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255, 245, 237, 0.85)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: `1px solid ${C.bone}`,
        overflowX: "auto",
      }}>
        <div style={{
          maxWidth: 1314, margin: "0 auto", padding: `${S.sm + 2}px ${S.lg}px`,
          display: "flex", alignItems: "center", gap: S.lg, minWidth: "max-content",
        }}>
          <a href="/" aria-label="Tuinmaximaal homepage" style={{
            fontSize: 20, fontWeight: 700, color: C.green,
            flexShrink: 0, letterSpacing: "-0.01em", textDecoration: "none",
          }}>tuinmaximaal</a>
          <ul style={{ display: "flex", gap: 2, flex: 1, justifyContent: "center", listStyle: "none" }}>
            {NAV.map(({ id, label }) => (
              <li key={id}>
                <button
                  className="nav-pill"
                  onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                  aria-current={active === id ? "page" : undefined}
                  style={{
                    padding: "10px 14px", borderRadius: R.full, border: "none", cursor: "pointer",
                    fontFamily: "inherit", fontSize: 13, fontWeight: 600,
                    color: C.darkGrey, background: "transparent", minHeight: 36,
                  }}
                >{label}</button>
              </li>
            ))}
          </ul>
          <PrimaryBtn ariaLabel="Configureer uw overkapping">Configureer <Arrow /></PrimaryBtn>
        </div>
      </nav>

      <main id="main-content">

        {/* ╔═══════════════════════════════════════════════════════════
            HERO — image placeholder for full-bleed lifestyle photo
        ╚═══════════════════════════════════════════════════════════ */}
        <section id="begin" aria-labelledby="hero-title" style={{ padding: `${S.xxl + 16}px ${S.lg}px ${S.xxl - 4}px`, scrollMarginTop: 64 }}>
          <div style={{ maxWidth: 1314, margin: "0 auto" }}>
            <div className="reveal" style={{ textAlign: "center", marginBottom: S.xxl - 4 }}>
              <Eyebrow>Gumax® Productinformatie</Eyebrow>
              <div style={{ marginTop: S.md + 2 }}>
                <H1 id="hero-title">
                  Buiten leven,{" "}
                  <Highlight>het hele jaar door</Highlight>.
                </H1>
              </div>
              <div style={{ maxWidth: 540, margin: `${S.xl}px auto 0` }}>
                <Body size="lg" muted>
                  Een Gumax® terrasoverkapping is geen aanbouw. Het is een uitnodiging — om buiten te leven, ongeacht het seizoen.
                </Body>
              </div>
              <div style={{ marginTop: S.xl + 4, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <PrimaryBtn>Stel uw overkapping samen <Arrow /></PrimaryBtn>
                <SecondaryBtn>Vraag samplepakket aan</SecondaryBtn>
              </div>
            </div>

            <div className="bento reveal" style={{ animationDelay: "0.15s" }}>
              {/* HERO IMAGE — main lifestyle shot */}
              <div className="card" style={{
                gridColumn: "span 8", gridRow: "span 2",
                aspectRatio: "16/9", padding: 0,
                position: "relative", overflow: "hidden",
              }}>
                <ImagePlaceholder
                  fill
                  rounded={false}
                  label="Hero — Lifestyle"
                  description="Avondsfeer, overkapping verlicht, gezin/koppel gezellig aan tafel of in lounge. Glazen schuifwanden zichtbaar. Warme avondlicht. Min. 1920×1080px."
                  aspect="16:9"
                />
              </div>

              <div className="card beige border-card" style={{
                gridColumn: "span 4", padding: S.xl,
                display: "flex", flexDirection: "column", justifyContent: "space-between",
              }} data-mob="1">
                <Eyebrow>Vanaf</Eyebrow>
                <BigNum value="€799" label="Altijd uit voorraad leverbaar"/>
              </div>

              <div className="card" style={{
                gridColumn: "span 4", padding: S.xl,
                display: "flex", flexDirection: "column", justifyContent: "space-between",
              }} data-mob="1">
                <Eyebrow>Garantie</Eyebrow>
                <BigNum value="10" suffix="jaar" label="Op constructie en coating"/>
              </div>
            </div>
          </div>
        </section>

        {/* ╔═══════════════════════════════════════════════════════════
            MATERIAAL — data-rich, no images needed
        ╚═══════════════════════════════════════════════════════════ */}
        <section aria-labelledby="materiaal-title" style={{ padding: `${S.xxl + 36}px ${S.lg}px` }}>
          <div style={{ maxWidth: 1314, margin: "0 auto" }}>
            <SectionHeader
              id="materiaal" headingId="materiaal-title"
              eyebrow="01 — Materiaal"
              title="Sterker, stiller, langer."
              sub="Het aluminium dat we kiezen, kiest u voor het leven."
            />

            <div className="bento">
              <div className="card" style={{ gridColumn: "span 7", gridRow: "span 2", padding: S.xl + 4 }}>
                <Eyebrow>Sterkte</Eyebrow>
                <div style={{ marginTop: S.md - 2, marginBottom: S.lg + 4 }}>
                  <H3><Highlight>25% sterker</Highlight> dan standaard aluminium.</H3>
                </div>
                <StrengthBars />
              </div>

              <div className="card dark" style={{ gridColumn: "span 5", padding: S.xl + 4, position: "relative", overflow: "hidden" }}>
                <Eyebrow light>Belastbaarheid</Eyebrow>
                <div style={{ marginTop: S.md - 2, marginBottom: S.lg }}>
                  <H3 light size={22}>Stilte onder zwaar weer.</H3>
                </div>
                <BigNum value="122" suffix="kg/m²" label="Sneeuwlast — Heavy Duty" color={C.white} light/>
                <div style={{ display: "flex", gap: S.lg, marginTop: S.lg + 4, paddingTop: S.md, borderTop: "1px solid rgba(255,255,255,0.16)" }}>
                  <div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: C.lighterGreen, letterSpacing: "-0.02em" }}>100</div>
                    <div style={{ fontSize: 12, color: C.onDarkSecondary, marginTop: 4 }}>kg/m² — Poly &amp; Glass</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: C.white, letterSpacing: "-0.02em" }}>98</div>
                    <div style={{ fontSize: 12, color: C.onDarkSecondary, marginTop: 4 }}>kg/m² — gehard glas</div>
                  </div>
                </div>
              </div>

              <div className="card" style={{ gridColumn: "span 5", padding: S.xl + 4 }}>
                <Eyebrow>Gumax® Excellence</Eyebrow>
                <div style={{ marginTop: S.md - 2, marginBottom: S.md + 4 }}>
                  <H3 size={22}>Drie lagen die jaren mooi blijven.</H3>
                </div>
                <div role="img" aria-label="Coating opbouw: topcoat, primer, aluminium 6063-T6 als basis" style={{ borderRadius: R.card, overflow: "hidden", border: `1px solid ${C.lightGrey}` }}>
                  {[
                    { l: "Topcoat",            s: "Kleur & glans",  h: 32, bg: C.lighterGreen,  c: C.white },
                    { l: "Primer",             s: "Hechting",       h: 22, bg: "#C8D690",       c: C.green },
                    { l: "Aluminium 6063-T6",  s: "Het hart",       h: 44, bg: C.bone,          c: C.green },
                  ].map(({ l, s, h, bg, c }) => (
                    <div key={l} style={{
                      height: h, background: bg,
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "0 18px",
                    }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: c }}>{l}</span>
                      <span style={{ fontSize: 12, color: c, opacity: 0.85 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ╔═══════════════════════════════════════════════════════════
            AFMETINGEN — diagram is sterker dan foto
        ╚═══════════════════════════════════════════════════════════ */}
        <section aria-labelledby="afmetingen-title" style={{ padding: `${S.xxl + 36}px ${S.lg}px`, background: C.white, borderTop: `1px solid ${C.bone}`, borderBottom: `1px solid ${C.bone}` }}>
          <div style={{ maxWidth: 1314, margin: "0 auto" }}>
            <SectionHeader
              id="afmetingen" headingId="afmetingen-title"
              eyebrow="02 — Afmetingen"
              title="Past precies bij uw huis."
              sub="Van compact terras tot ruime tuinkamer. In stappen die u zelf bepaalt."
            />

            <div className="bento">
              <div className="card beige" style={{ gridColumn: "span 7", gridRow: "span 2", padding: S.xl + 4, display: "flex", flexDirection: "column" }}>
                <Eyebrow>Maatschets</Eyebrow>
                <div style={{ marginTop: S.md - 2, marginBottom: S.lg }}>
                  <H3>Ruimte op maat.</H3>
                </div>
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <DimensionDiagram />
                </div>
              </div>

              <div className="card border-card" style={{ gridColumn: "span 5", padding: S.xl }}>
                <Eyebrow>Inkortbaarheid</Eyebrow>
                <div style={{ marginTop: S.md - 2, marginBottom: S.md + 2 }}>
                  <H5>Per productlijn</H5>
                </div>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {[
                    { line: "Poly Line", b: true, d: true, note: "Volledig op maat" },
                    { line: "Glass Line", b: true, d: false, note: "Alleen breedte" },
                    { line: "Heavy Duty", b: false, d: false, note: "Bestel exacte maat" },
                  ].map(({ line, b, d, note }) => (
                    <li key={line} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: `${S.md - 2}px 0`, borderBottom: `1px solid ${C.lightGrey}`,
                    }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: C.green }}>{line}</div>
                        <div style={{ fontSize: 12, color: C.darkGrey, marginTop: 2 }}>{note}</div>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        {[["Breedte", b], ["Diepte", d]].map(([l, ok]) => (
                          <span key={l} style={{
                            fontSize: 11, fontWeight: 600, padding: "4px 9px", borderRadius: R.full,
                            background: ok ? C.green : C.beige,
                            color: ok ? C.white : C.darkGrey,
                            border: ok ? "none" : `1px solid ${C.bone}`,
                            display: "inline-flex", alignItems: "center", gap: 4,
                          }}>
                            <span aria-hidden="true">{ok ? <Check /> : <Cross />}</span>
                            {l}
                            <span className="sr-only">{ok ? " inkortbaar" : " niet inkortbaar"}</span>
                          </span>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card border-card" style={{ gridColumn: "span 5", padding: S.xl }}>
                <Acc title="Volledige maatspecificaties">
                  <Spec label="Min. breedte" value="3,06 m"/>
                  <Spec label="Max. breedte" value="12,06 m"/>
                  <Spec label="Dieptes" value="2,5 / 3 / 3,5 / 4 m"/>
                  <Spec label="Doorloophoogtes" value="2,10 — 2,35 m"/>
                  <Spec label="Staander profiel" value="110 × 110 mm"/>
                  <Spec label="Staander hoogte" value="2.500 mm"/>
                </Acc>
                <div style={{ marginTop: S.md }}>
                  <Message variant="info">
                    Bij inkorten in de diepte passen geen glazen schuifwanden meer aan de zijkanten — de glazen spie past dan niet.
                  </Message>
                </div>
                <div style={{ marginTop: S.sm }}>
                  <Message variant="warning">
                    Heavy Duty is niet inkortbaar. Bestel altijd de exacte gewenste maat.
                  </Message>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ╔═══════════════════════════════════════════════════════════
            KLEUREN — image placeholders voor product foto's per kleur
        ╚═══════════════════════════════════════════════════════════ */}
        <section aria-labelledby="kleuren-title" style={{ padding: `${S.xxl + 36}px ${S.lg}px` }}>
          <div style={{ maxWidth: 1314, margin: "0 auto" }}>
            <SectionHeader
              id="kleuren" headingId="kleuren-title"
              eyebrow="03 — Kleuren"
              title="Drie kleuren. Eén juiste."
              sub="Geen meerprijs. Alleen het gevoel dat u thuis bent zodra u buiten zit."
            />

            <div className="bento">
              {[
                {
                  hex: "#3B3F45",
                  name: "Mat antraciet", ral: "RAL 7016", popular: true,
                  desc: "Antraciet overkapping in moderne tuin, tegen witte gevel of moderne nieuwbouw. Sfeerfoto, dag of zonsondergang.",
                },
                {
                  hex: "#F2F0EC",
                  name: "Mat wit", ral: "RAL 9016",
                  desc: "Witte overkapping in lichte/strakke tuin, mediterrane sfeer. Felle zon, scherpe schaduw.",
                },
                {
                  hex: "#1A1A1A",
                  name: "Mat zwart", ral: "RAL 9005",
                  desc: "Zwarte overkapping als statement tegen donkere baksteen of houten gevel. Industriële look.",
                },
              ].map(({ hex, name, ral, popular, desc }) => (
                <article
                  key={ral}
                  className="card"
                  style={{ gridColumn: "span 4", gridRow: "span 2", padding: 0 }}
                >
                  <ImagePlaceholder
                    aspect="4/3"
                    label={`${name} foto`}
                    description={desc}
                    rounded={false}
                  />
                  <div style={{ padding: S.lg + 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <span aria-hidden="true" style={{
                        width: 20, height: 20, borderRadius: R.sm,
                        background: hex, border: `1px solid ${C.bone}`,
                        flexShrink: 0,
                      }}/>
                      <H5 as="h3">{name}</H5>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: C.darkGrey, fontWeight: 500 }}>{ral}</span>
                      {popular && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          background: C.beige, color: C.green,
                          padding: "4px 8px", borderRadius: R.full,
                        }}>Meest gekozen</span>
                      )}
                    </div>
                  </div>
                </article>
              ))}

              <div className="card sand" style={{
                gridColumn: "span 12", padding: `${S.xl}px ${S.xl + 4}px`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                flexWrap: "wrap", gap: S.md + 4,
              }}>
                <div>
                  <H3 size={22}>Voel het verschil <Highlight>in uw hand</Highlight>.</H3>
                  <div style={{ marginTop: S.sm }}>
                    <Body size="sm" muted>Gratis samplepakket met kleurenstalen, helder- en melkglas en een polycarbonaatsample.</Body>
                  </div>
                </div>
                <PrimaryBtn ariaLabel="Vraag een gratis samplepakket aan">
                  Aanvragen <Arrow />
                </PrimaryBtn>
              </div>
            </div>
          </div>
        </section>

        {/* ╔═══════════════════════════════════════════════════════════
            DAKTYPES — image placeholder per tab
        ╚═══════════════════════════════════════════════════════════ */}
        <section aria-labelledby="daktypes-title" style={{ padding: `${S.xxl + 36}px ${S.lg}px`, background: C.white, borderTop: `1px solid ${C.bone}`, borderBottom: `1px solid ${C.bone}` }}>
          <div style={{ maxWidth: 1314, margin: "0 auto" }}>
            <SectionHeader
              id="daktypes" headingId="daktypes-title"
              eyebrow="04 — Daktypes"
              title="Hoe wilt u het licht ervaren?"
              sub="Drie keer de zon. Drie keer een ander gevoel."
            />

            <div role="tablist" aria-label="Daktype keuze" style={{
              position: "relative", display: "inline-flex",
              background: C.beige, border: `1px solid ${C.bone}`,
              borderRadius: R.full, padding: 5, marginBottom: S.xl,
            }}>
              <div className="tab-indicator" aria-hidden="true" style={{
                position: "absolute", top: 5, left: tabIndicator.left, width: tabIndicator.width,
                height: "calc(100% - 10px)", background: C.green, borderRadius: R.full, zIndex: 0,
              }}/>
              {dakOptions.map(({ k, l }) => (
                <button
                  key={k}
                  ref={el => (tabRefs.current[k] = el)}
                  onClick={() => setDakTab(k)}
                  onKeyDown={(e) => handleTabKey(e, dakTab, dakOptions, setDakTab)}
                  role="tab"
                  aria-selected={dakTab === k}
                  aria-controls={`dak-panel-${k}`}
                  id={`dak-tab-${k}`}
                  tabIndex={dakTab === k ? 0 : -1}
                  className="tab-btn"
                  style={{
                    position: "relative", zIndex: 1,
                    padding: "10px 22px", border: "none", borderRadius: R.full, cursor: "pointer",
                    background: "transparent",
                    color: dakTab === k ? C.white : C.darkGrey,
                    fontFamily: "inherit", fontSize: 14, fontWeight: 600, minHeight: 40,
                  }}
                >{l}</button>
              ))}
            </div>

            <div className="bento" role="tabpanel" id={`dak-panel-${dakTab}`} aria-labelledby={`dak-tab-${dakTab}`}>
              <div className="card border-card" style={{
                gridColumn: "span 7", padding: 0,
                minHeight: 360, position: "relative", overflow: "hidden",
              }}>
                <ImagePlaceholder
                  fill rounded={false}
                  aspect="16/9"
                  label={dak.placeholder.label}
                  description={dak.placeholder.description}
                />
              </div>

              <div className="card border-card" style={{ gridColumn: "span 5", padding: S.xl + 4 }}>
                <div style={{ display: "flex", gap: S.sm, alignItems: "center" }}>
                  <Eyebrow>{dak.eyebrow}</Eyebrow>
                  {dak.pop && (
                    <span style={{
                      fontSize: 11, fontWeight: 600, color: C.warning,
                      background: "#FEF3C7", padding: "3px 8px", borderRadius: R.full,
                    }}>Populair</span>
                  )}
                </div>
                <div style={{ marginTop: S.md - 2, marginBottom: S.md }}>
                  <H3 size={24}>{dak.title}</H3>
                </div>
                <Body size="sm" muted>{dak.desc}</Body>

                <dl style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: S.md - 2, marginTop: S.lg + 4 }}>
                  {dak.stats.map(([v, l]) => (
                    <div key={l} style={{ paddingTop: S.md - 4, borderTop: `1px solid ${C.lightGrey}` }}>
                      <dd style={{ fontSize: 18, fontWeight: 700, color: C.green, letterSpacing: "-0.015em", marginBottom: 4 }}>{v}</dd>
                      <dt style={{ fontSize: 12, color: C.darkGrey, fontWeight: 500 }}>{l}</dt>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* ╔═══════════════════════════════════════════════════════════
            STIJLEN — image placeholder voor staander-detail
        ╚═══════════════════════════════════════════════════════════ */}
        <section aria-labelledby="stijlen-title" style={{ padding: `${S.xxl + 36}px ${S.lg}px` }}>
          <div style={{ maxWidth: 1314, margin: "0 auto" }}>
            <SectionHeader
              id="stijlen" headingId="stijlen-title"
              eyebrow="05 — Stijlen"
              title="Eigentijds of tijdloos."
              sub="Welke architectuur het ook is — er is een staander die hoort."
            />

            <div className="bento">
              <div className="card" style={{ gridColumn: "span 6", padding: 0 }}>
                <ImagePlaceholder
                  fill rounded={false}
                  aspect="3/2"
                  label="Modern vs Klassiek"
                  description="Twee staanders zij-aan-zij — links moderne staander met rechte hoeken, rechts klassieke staander met afgeronde hoeken en sierwerk. Detail/macro shot."
                />
              </div>

              <div className="card beige border-card" style={{ gridColumn: "span 3", padding: S.xl }}>
                <Eyebrow>Poly &amp; Glass</Eyebrow>
                <div style={{ marginTop: S.md - 2, marginBottom: S.md + 2 }}>
                  <H5>2 stijlen</H5>
                </div>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {[
                    ["Modern", "Strakke rechte lijnen"],
                    ["Klassiek", "Welvingen — antraciet & wit"],
                  ].map(([n, d]) => (
                    <li key={n} style={{ paddingBottom: S.md - 2, marginBottom: S.md - 2, borderBottom: `1px solid ${C.bone}` }}>
                      <div style={{ fontSize: 16, fontWeight: 600, color: C.green }}>{n}</div>
                      <div style={{ fontSize: 12, color: C.darkGrey, marginTop: 4 }}>{d}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card sand" style={{ gridColumn: "span 3", padding: S.xl }}>
                <Eyebrow>Heavy Duty</Eyebrow>
                <div style={{ marginTop: S.md - 2, marginBottom: S.md + 2 }}>
                  <H5>4 stijlen</H5>
                </div>
                <ol style={{ listStyle: "none", padding: 0 }}>
                  {["Modern", "Tijdloos", "Authentiek", "Eigentijds"].map((n, i) => (
                    <li key={n} style={{
                      display: "flex", justifyContent: "space-between",
                      padding: `${S.sm + 2}px 0`,
                      borderBottom: i < 3 ? `1px solid ${C.bone}` : "none",
                      fontSize: 14, color: C.green, fontWeight: 600,
                    }}>
                      <span>{n}</span>
                      <span style={{ color: C.darkGrey, fontWeight: 500 }}>0{i + 1}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* ╔═══════════════════════════════════════════════════════════
            ACCESSOIRES — featured met image placeholder, kleinere zonder
        ╚═══════════════════════════════════════════════════════════ */}
        <section aria-labelledby="acc-title" style={{ padding: `${S.xxl + 36}px ${S.lg}px`, background: C.white, borderTop: `1px solid ${C.bone}`, borderBottom: `1px solid ${C.bone}` }}>
          <div style={{ maxWidth: 1314, margin: "0 auto" }}>
            <SectionHeader
              id="accessoires" headingId="acc-title"
              eyebrow="06 — Accessoires"
              title="Maakt het helemaal van u."
              sub="Een overkapping is het begin. De rest groeit met u mee."
            />

            <div className="bento">
              {/* FEATURED — image placeholder for full lifestyle product shot */}
              <article className="card border-card" style={{
                gridColumn: "span 6", gridRow: "span 2",
                padding: 0,
                display: "flex", flexDirection: "column",
                minHeight: 320,
              }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <ImagePlaceholder
                    fill rounded={false}
                    aspect="3/2"
                    label="Schuifwanden — featured"
                    description="Glazen schuifwanden in actie — dichtgeschoven in herfst/winter, sfeerlicht binnen, mistig buiten. Verkoopt het 'tuinkamer' gevoel."
                  />
                </div>
                <div style={{ padding: S.xl + 8 }}>
                  <H3 size={26}>Glazen schuifwanden</H3>
                  <div style={{ marginTop: 6 }}>
                    <Body size="sm" muted>1–6 rail · 10 mm gehard glas · op maat inkortbaar in antraciet, wit en zwart.</Body>
                  </div>
                </div>
              </article>

              {/* Smaller — image placeholder per item */}
              {[
                { title: "Automatische zonwering", sub: "Per strook · Smart Home", desc: "Detail van automatisch zonweringsysteem in werking — strepen schaduw op terras." },
                { title: "Ledverlichting", sub: "Dimbaar · RGB", desc: "Avond, ledspots aan in tussenliggers — sfeerlicht onder dak." },
                { title: "Glazen schuifdeuren", sub: "980 mm · veiligheidsglas", desc: "Open glazen schuifdeur, doorkijk naar tuin." },
                { title: "Aluminium zijwand", sub: "55% lichtdoorlatend", desc: "Zijwand bij de wind — beschutting maar lichtdoorlatend." },
                { title: "Shading panels", sub: "Kleurenkeuze", desc: "Shading panels in textiel kleuren tegen middagzon." },
                { title: "Hordeur", sub: "Insectenwerend", desc: "Hordeur in framework, zomeravond, zicht op tuin." },
                { title: "Terrasverwarmer", sub: "2100 W halogeen", desc: "Terrasverwarmer aan, gloed boven, herfstavond gebruik." },
              ].map(({ title, sub, desc }, i) => {
                const tone = (i === 3 || i === 6) ? "beige" : "";
                const needsBorder = tone === ""; // white card on white section
                return (
                  <article key={title} className={`card ${tone}${needsBorder ? " border-card" : ""}`} style={{
                    gridColumn: "span 3", gridRow: "span 1",
                    padding: 0,
                    display: "flex", flexDirection: "column",
                    minHeight: 200,
                  }}>
                    <div style={{ position: "relative", aspectRatio: "4/3" }}>
                      <ImagePlaceholder
                        fill rounded={false}
                        aspect="4/3"
                        label={title}
                        description={desc}
                      />
                    </div>
                    <div style={{ padding: S.md + 4, paddingTop: S.md - 2 }}>
                      <H5>{title}</H5>
                      <div style={{ marginTop: 4 }}>
                        <span style={{ fontSize: 12, color: C.darkGrey, fontWeight: 400, lineHeight: 1.5 }}>{sub}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ╔═══════════════════════════════════════════════════════════
            FUNDERING — diagram is sterker dan foto
        ╚═══════════════════════════════════════════════════════════ */}
        <section aria-labelledby="fund-title" style={{ padding: `${S.xxl + 36}px ${S.lg}px` }}>
          <div style={{ maxWidth: 1314, margin: "0 auto" }}>
            <SectionHeader
              id="fundering" headingId="fund-title"
              eyebrow="07 — Fundering"
              title="De basis van rust."
              sub="Een goede start is alles. We nemen het denkwerk uit handen."
            />

            <div className="bento">
              <div className="card beige border-card" style={{ gridColumn: "span 4", gridRow: "span 2", padding: S.xl + 8, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <FoundationDiagram hwa={fundTab === "hwa"}/>
              </div>

              <div className="card" style={{ gridColumn: "span 8", padding: S.xl + 8 }}>
                <div role="tablist" aria-label="Funderingstype keuze" style={{
                  display: "inline-flex", gap: 4, background: C.beige,
                  border: `1px solid ${C.bone}`, borderRadius: R.full, padding: 4,
                  marginBottom: S.lg + 4, flexWrap: "wrap",
                }}>
                  {fundOptions.map(({ k, l }) => (
                    <button
                      key={k}
                      ref={el => (fundTabRefs.current[k] = el)}
                      onClick={() => setFundTab(k)}
                      onKeyDown={(e) => handleTabKey(e, fundTab, fundOptions, setFundTab)}
                      role="tab"
                      aria-selected={fundTab === k}
                      aria-controls={`fund-panel-${k}`}
                      id={`fund-tab-${k}`}
                      tabIndex={fundTab === k ? 0 : -1}
                      style={{
                        padding: "8px 14px", border: "none", borderRadius: R.full, cursor: "pointer",
                        background: fundTab === k ? C.green : "transparent",
                        color: fundTab === k ? C.white : C.darkGrey,
                        fontFamily: "inherit", fontSize: 13, fontWeight: 600,
                        transition: "background 0.25s, color 0.25s", minHeight: 36,
                      }}>
                      {l}
                    </button>
                  ))}
                </div>

                <div role="tabpanel" id={`fund-panel-${fundTab}`} aria-labelledby={`fund-tab-${fundTab}`}>
                  {fundTab === "hwa" && <>
                    <Eyebrow>Aanbevolen</Eyebrow>
                    <div style={{ marginTop: S.md - 2, marginBottom: S.md - 2 }}>
                      <H3>Betonpoer met afvoer in de staander.</H3>
                    </div>
                    <Body size="sm" muted>Regenwater verdwijnt onzichtbaar via de staander naar de riolering. Aansluiting Ø 75 mm.</Body>
                    <div style={{ marginTop: S.md }}>
                      <Message variant="info">Bij dakoppervlak &gt; 24 m² adviseren we minimaal twee HWA-aansluitingen.</Message>
                    </div>
                  </>}
                  {fundTab === "no-hwa" && <>
                    <Eyebrow>Eenvoudig</Eyebrow>
                    <div style={{ marginTop: S.md - 2, marginBottom: S.md - 2 }}>
                      <H3>Betonpoer, water naar de tuin.</H3>
                    </div>
                    <Body size="sm" muted>De simpelste optie. Regenwater stroomt via de staander bovengronds de tuin in. Geen graafwerk voor riolering nodig.</Body>
                  </>}
                  {fundTab === "beton" && <>
                    <Eyebrow>Permanent</Eyebrow>
                    <div style={{ marginTop: S.md - 2, marginBottom: S.md - 2 }}>
                      <H3>Staanders in gestort beton.</H3>
                    </div>
                    <Body size="sm" muted>De staanders worden in de grond geplaatst en met vloeibaar beton vastgezet.</Body>
                    <div style={{ marginTop: S.md }}>
                      <Message variant="warning">Beton mag de coating niet raken — verwijdering is vrijwel onmogelijk en beschadigt de poedercoating.</Message>
                    </div>
                    <div style={{ marginTop: S.sm }}>
                      <Message variant="error">De overkapping is daarna niet meer verplaatsbaar.</Message>
                    </div>
                  </>}
                </div>

                <dl style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: S.md, marginTop: S.lg + 4 }}>
                  {[
                    ["750", "kg per staander"],
                    ["Ø 75", "mm afvoer"],
                    [">24 m²", "→ 2 afvoeren"],
                    ["Tegels", "ongeschikt"],
                  ].map(([v, l]) => (
                    <div key={l} style={{ paddingTop: S.md, borderTop: `1px solid ${C.lightGrey}` }}>
                      <dd style={{ fontSize: 22, fontWeight: 700, color: C.green, letterSpacing: "-0.015em" }}>{v}</dd>
                      <dt style={{ fontSize: 12, color: C.darkGrey, marginTop: 4 }}>{l}</dt>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* ╔═══════════════════════════════════════════════════════════
            ONDERHOUD + UITBREIDINGEN — onderhoud krijgt foto, uitbreidingen blijft tekstueel
        ╚═══════════════════════════════════════════════════════════ */}
        <section aria-label="Onderhoud en uitbreidingen" style={{ padding: `${S.xxl + 36}px ${S.lg}px`, background: C.white, borderTop: `1px solid ${C.bone}` }}>
          <div style={{ maxWidth: 1314, margin: "0 auto" }}>
            <div className="bento">
              <div className="card beige" style={{ gridColumn: "span 6", padding: S.xxl - 16 }}>
                <Eyebrow>Onderhoud</Eyebrow>
                <div style={{ marginTop: S.md, marginBottom: S.md + 2 }}>
                  <H2>Eén keer per jaar.<br/><Highlight>Meer niet</Highlight>.</H2>
                </div>
                <div style={{ marginBottom: S.lg + 4, maxWidth: 460 }}>
                  <Body size="sm" muted>Aluminium roest niet. De coating verkleurt niet. Een tuinslang en een mild reinigingsmiddel volstaan.</Body>
                  <div style={{ marginTop: S.md }}>
                    <Message variant="success">
                      Gebruik nooit schuurmiddelen of schuursponzen — deze beschadigen de coating en het glas.
                    </Message>
                  </div>
                </div>
                <div style={{ display: "flex", gap: S.xl }}>
                  <BigNum value="1×" label="Per jaar — normaal gebruik"/>
                  <BigNum value="2×" label="Per jaar — kustomgeving" color={C.warning}/>
                </div>
              </div>

              <div className="card border-card" style={{ gridColumn: "span 6", padding: S.xxl - 16 }}>
                <Eyebrow>Uitbreidingen</Eyebrow>
                <div style={{ marginTop: S.md, marginBottom: S.md + 2 }}>
                  <H2>Groeit mee, voor altijd.</H2>
                </div>
                <div style={{ marginBottom: S.lg + 4, maxWidth: 460 }}>
                  <Body size="sm" muted>Schuifwanden, zonwering, verlichting — alles is achteraf toe te voegen. Behalve ledspots: die plaatsen we tijdens de montage.</Body>
                  <div style={{ marginTop: S.md }}>
                    <Message variant="warning">
                      Ledspots moeten vóór montage besteld worden — achteraf inbouwen in de tussenliggers is niet mogelijk.
                    </Message>
                  </div>
                </div>
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: S.sm + 2 }}>
                  {[
                    { t: "Glazen schuifwanden", ok: true },
                    { t: "Automatische zonwering", ok: true },
                    { t: "Lighting System", ok: true },
                    { t: "Ledspots: vóór montage", ok: false },
                  ].map(({ t, ok }) => (
                    <li key={t} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: `${S.sm + 2}px 0`, borderBottom: `1px solid ${C.lightGrey}`,
                    }}>
                      <span aria-hidden="true" style={{
                        width: 24, height: 24, borderRadius: R.full,
                        background: ok ? C.lighterGreen : C.bone,
                        color: ok ? C.white : C.darkGrey,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>{ok ? <Check /> : <Cross />}</span>
                      <span className="sr-only">{ok ? "Mogelijk: " : "Let op: "}</span>
                      <span style={{ fontSize: 15, color: ok ? C.green : C.darkGrey, fontWeight: 600 }}>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ╔═══════════════════════════════════════════════════════════
            FINAL CTA — image placeholder for atmospheric end shot
        ╚═══════════════════════════════════════════════════════════ */}
        <section aria-labelledby="cta-title" style={{ position: "relative", overflow: "hidden" }}>
          <div className="img-placeholder dark" style={{
            position: "absolute", inset: 0, borderRadius: 0,
          }}>
            <div className="img-content" style={{ opacity: 0.5 }}>
              <div style={{
                width: 56, height: 56, borderRadius: R.full,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <ImageIcon size={26} dark />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.onDarkSecondary }}>
                  Final CTA — Sfeerbeeld
                </div>
                <div style={{ fontSize: 12, color: C.onDarkMuted, marginTop: 6, lineHeight: 1.5, maxWidth: 380 }}>
                  Donkere avondsfeer, overkapping verlicht, glas reflecteert. Donkere overlay over foto voor leesbaarheid tekst. Min. 1920×1080.
                </div>
              </div>
            </div>
          </div>

          <div style={{
            position: "relative", zIndex: 2,
            padding: `${S.xxl + 56}px ${S.lg}px`,
            background: "linear-gradient(180deg, rgba(0,26,19,0.4) 0%, rgba(0,48,23,0.85) 100%)",
            color: C.white,
          }}>
            <div style={{ maxWidth: 1314, margin: "0 auto", textAlign: "center" }}>
              <Eyebrow light>Begin hier</Eyebrow>
              <div style={{ marginTop: S.lg }}>
                <H1 light id="cta-title">
                  Uw buitenleven<br/>
                  <Highlight>begint hier</Highlight>.
                </H1>
              </div>
              <div style={{ maxWidth: 480, margin: `${S.xl}px auto ${S.xl + 12}px` }}>
                <Body size="lg" muted light>Configureer in een paar minuten. Direct prijs zichtbaar. Vanaf € 799.</Body>
              </div>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <PrimaryBtn ariaLabel="Configureer uw overkapping nu">
                  Configureer uw overkapping <Arrow />
                </PrimaryBtn>
                <SecondaryBtn light ariaLabel="Vraag een offerte aan">
                  Offerte aanvragen
                </SecondaryBtn>
              </div>
              <div style={{
                marginTop: S.xxl + 16, paddingTop: S.xl,
                borderTop: "1px solid rgba(255,255,255,0.16)",
                color: C.onDarkSecondary, fontSize: 13,
              }}>
                Klantenservice 365 dagen per jaar bereikbaar · Showrooms in Eindhoven &amp; Venlo
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
