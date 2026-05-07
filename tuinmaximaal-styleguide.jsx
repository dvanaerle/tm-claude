import { useState } from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const tokens = {
  colors: {
    primary: {
      darkGreen: "#001A13",
      green: "#003017",
      mediumGreen: "#002E21",
      orange: "#FF8000",
      lighterGreen: "#809700",
      lighterGreenSecond: "#8BA407",
      lightGreen: "#6D8005",
      blue: "#80A5E4",
      yellow: "#FFCB00",
      red: "#FF4D4D",
      black: "#11171F",
      brown: "#8A7B6C",
    },
    secondary: {
      sand: "#F5E6D7",
      beige: "#FFF5ED",
      bone: "#E0D2C5",
    },
    neutral: {
      white: "#FFFFFF",
      lightGrey: "#E3E3E3",
      grey: "#636363",
      mediumGrey: "#878787",
      darkGrey: "#151A1F",
    },
    status: {
      success: "#22C55E",
      error: "#EF4444",
      warning: "#A16207",
      info: "#1D4ED8",
    },
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const Swatch = ({ name, hex, textLight = false }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <div
      style={{
        width: "100%",
        height: 72,
        background: hex,
        borderRadius: 4,
        border: `1px solid rgba(0,0,0,0.08)`,
        display: "flex",
        alignItems: "flex-end",
        padding: "6px 8px",
      }}
    >
      <span
        style={{
          fontFamily: "ArticulatCF, sans-serif",
          fontSize: 10,
          fontWeight: 600,
          color: textLight ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.45)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {hex}
      </span>
    </div>
    <span
      style={{
        fontFamily: "ArticulatCF, sans-serif",
        fontSize: 12,
        color: tokens.colors.neutral.grey,
        fontWeight: 600,
      }}
    >
      {name}
    </span>
  </div>
);

const ColorGroup = ({ title, swatches }) => (
  <div style={{ marginBottom: 40 }}>
    <h4 style={styles.sectionLabel}>{title}</h4>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
        gap: 12,
      }}
    >
      {swatches.map(([name, hex, light]) => (
        <Swatch key={name} name={name} hex={hex} textLight={light} />
      ))}
    </div>
  </div>
);

const TypeRow = ({ label, style, sample = "The Garden Awaits" }) => (
  <div
    style={{
      display: "flex",
      alignItems: "baseline",
      gap: 24,
      padding: "16px 0",
      borderBottom: `1px solid ${tokens.colors.neutral.lightGrey}`,
    }}
  >
    <span
      style={{
        fontFamily: "ArticulatCF, sans-serif",
        fontSize: 11,
        fontWeight: 600,
        color: tokens.colors.neutral.grey,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        minWidth: 72,
        flexShrink: 0,
      }}
    >
      {label}
    </span>
    <span style={{ ...style, color: tokens.colors.primary.green, flex: 1 }}>
      {sample}
    </span>
    <span
      style={{
        fontFamily: "ArticulatCF, sans-serif",
        fontSize: 11,
        color: tokens.colors.neutral.mediumGrey,
        flexShrink: 0,
      }}
    >
      {style.fontSize} / lh {style.lineHeight}
    </span>
  </div>
);

const SectionDivider = ({ title }) => (
  <div style={{ margin: "56px 0 32px" }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 4,
          height: 24,
          background: tokens.colors.primary.lighterGreen,
          borderRadius: 2,
        }}
      />
      <h2
        style={{
          fontFamily: "ArticulatCF, sans-serif",
          fontSize: 22,
          fontWeight: 700,
          color: tokens.colors.primary.green,
          margin: 0,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>
    </div>
    <div
      style={{
        height: 1,
        background: tokens.colors.secondary.bone,
        marginTop: 16,
      }}
    />
  </div>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  sectionLabel: {
    fontFamily: "ArticulatCF, sans-serif",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: tokens.colors.neutral.mediumGrey,
    margin: "0 0 16px",
  },
};

// ─── Buttons ──────────────────────────────────────────────────────────────────
const BtnPrimary = () => {
  const [hover, setHover] = useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover
          ? tokens.colors.primary.lightGreen
          : tokens.colors.primary.lighterGreen,
        color: "#fff",
        fontFamily: "ArticulatCF, sans-serif",
        fontSize: 16,
        fontWeight: 600,
        lineHeight: 1.5,
        padding: "12px 24px 8px",
        borderRadius: 4,
        border: "none",
        borderBottom: `4px solid ${tokens.colors.primary.lightGreen}`,
        cursor: "pointer",
        transition: "background 0.15s ease",
      }}
    >
      Add to Cart
    </button>
  );
};

const BtnSecondary = () => {
  const [hover, setHover] = useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? tokens.colors.primary.green : "transparent",
        color: hover ? "#fff" : tokens.colors.primary.green,
        fontFamily: "ArticulatCF, sans-serif",
        fontSize: 16,
        fontWeight: 600,
        lineHeight: 1.5,
        padding: "10px 24px",
        borderRadius: 4,
        border: `2px solid ${tokens.colors.primary.green}`,
        cursor: "pointer",
        transition: "background 0.15s ease, color 0.15s ease",
      }}
    >
      Learn More
    </button>
  );
};

const BtnTertiary = () => {
  const [hover, setHover] = useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "transparent",
        color: hover
          ? tokens.colors.primary.lighterGreen
          : tokens.colors.primary.green,
        fontFamily: "ArticulatCF, sans-serif",
        fontSize: 16,
        fontWeight: 600,
        lineHeight: 1.5,
        padding: 0,
        border: "none",
        cursor: "pointer",
        transition: "color 0.15s ease",
        textDecoration: hover ? "underline" : "none",
      }}
    >
      View Details →
    </button>
  );
};

// ─── Form Controls ────────────────────────────────────────────────────────────
const InputDemo = ({ label, state = "default" }) => {
  const [focused, setFocused] = useState(false);
  const [val, setVal] = useState(state === "success" ? "Valid input value" : state === "error" ? "Invalid value" : "");

  const borderColor =
    state === "error"
      ? tokens.colors.primary.orange
      : state === "success"
      ? tokens.colors.primary.lighterGreen
      : focused
      ? tokens.colors.neutral.grey
      : tokens.colors.neutral.lightGrey;

  const disabled = state === "disabled";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontFamily: "ArticulatCF, sans-serif",
          fontSize: 14,
          fontWeight: 600,
          color: tokens.colors.primary.green,
        }}
      >
        {label}
      </label>
      <input
        disabled={disabled}
        value={disabled ? "" : val}
        onChange={(e) => setVal(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Placeholder text"
        style={{
          background: disabled
            ? tokens.colors.neutral.lightGrey
            : "#fff",
          color: tokens.colors.primary.green,
          fontFamily: "ArticulatCF, sans-serif",
          fontSize: 16,
          padding: 14,
          borderRadius: 4,
          border: `1px solid ${borderColor}`,
          outline: "none",
          transition: "border-color 0.15s ease",
          width: "100%",
          boxSizing: "border-box",
        }}
      />
      {state === "error" && (
        <span
          style={{
            fontFamily: "ArticulatCF, sans-serif",
            fontSize: 12,
            color: tokens.colors.status.error,
          }}
        >
          This field is required.
        </span>
      )}
      {state === "success" && (
        <span
          style={{
            fontFamily: "ArticulatCF, sans-serif",
            fontSize: 12,
            color: tokens.colors.status.success,
          }}
        >
          Looks good!
        </span>
      )}
    </div>
  );
};

const CheckboxDemo = ({ label, checked: initChecked = false, inactive = false }) => {
  const [checked, setChecked] = useState(initChecked);
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        cursor: inactive ? "not-allowed" : "pointer",
        fontFamily: "ArticulatCF, sans-serif",
        fontSize: 14,
        color: tokens.colors.primary.green,
      }}
    >
      <div
        onClick={() => !inactive && setChecked(!checked)}
        style={{
          width: 20,
          height: 20,
          borderRadius: 4,
          border: `2px solid ${
            inactive
              ? tokens.colors.neutral.lightGrey
              : checked
              ? tokens.colors.primary.lighterGreen
              : tokens.colors.neutral.grey
          }`,
          background: inactive
            ? tokens.colors.neutral.lightGrey
            : checked
            ? tokens.colors.primary.lighterGreen
            : "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "all 0.12s ease",
        }}
      >
        {checked && !inactive && (
          <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
            <path
              d="M1 4L4.5 7.5L11 1"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      {label}
    </label>
  );
};

const RadioDemo = ({ label, checked: initChecked = false, inactive = false }) => {
  const [checked, setChecked] = useState(initChecked);
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        cursor: inactive ? "not-allowed" : "pointer",
        fontFamily: "ArticulatCF, sans-serif",
        fontSize: 14,
        color: tokens.colors.primary.green,
      }}
    >
      <div
        onClick={() => !inactive && setChecked(!checked)}
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          border: `2px solid ${
            inactive
              ? tokens.colors.neutral.lightGrey
              : checked
              ? tokens.colors.primary.green
              : tokens.colors.neutral.grey
          }`,
          background: inactive ? tokens.colors.neutral.lightGrey : "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "all 0.12s ease",
        }}
      >
        {checked && !inactive && (
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: tokens.colors.primary.green,
            }}
          />
        )}
      </div>
      {label}
    </label>
  );
};

// ─── Messages ─────────────────────────────────────────────────────────────────
const MessageBlock = ({ type, text }) => {
  const map = {
    success: {
      bg: "#F0FDF4",
      border: tokens.colors.status.success,
      icon: "✓",
      label: "Success",
    },
    error: {
      bg: "#FEF2F2",
      border: tokens.colors.status.error,
      icon: "✕",
      label: "Error",
    },
    warning: {
      bg: "#FEFCE8",
      border: tokens.colors.status.warning,
      icon: "!",
      label: "Warning",
    },
    info: {
      bg: "#EFF6FF",
      border: tokens.colors.status.info,
      icon: "i",
      label: "Info",
    },
  };
  const m = map[type];
  return (
    <div
      style={{
        background: m.bg,
        borderRadius: 4,
        borderLeft: `4px solid ${m.border}`,
        padding: "10px 12px 10px 16px",
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: m.border,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 700,
          fontFamily: "ArticulatCF, sans-serif",
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        {m.icon}
      </div>
      <div>
        <div
          style={{
            fontFamily: "ArticulatCF, sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: tokens.colors.primary.black,
          }}
        >
          {m.label}
        </div>
        <div
          style={{
            fontFamily: "ArticulatCF, sans-serif",
            fontSize: 14,
            color: tokens.colors.neutral.grey,
            marginTop: 2,
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

// ─── Spacing ──────────────────────────────────────────────────────────────────
const spacingScale = [
  { name: "xs", px: 4 },
  { name: "sm", px: 8 },
  { name: "md", px: 16 },
  { name: "lg", px: 24 },
  { name: "xl", px: 32 },
  { name: "xxl", px: 64 },
];

// ─── NAV ──────────────────────────────────────────────────────────────────────
const sections = [
  "Colors",
  "Typography",
  "Spacing & Shape",
  "Buttons",
  "Forms",
  "Messages",
];

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function StyleGuide() {
  const [active, setActive] = useState("Colors");

  return (
    <div
      style={{
        fontFamily: "ArticulatCF, sans-serif",
        background: tokens.colors.secondary.beige,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", flex: 1 }}>
        {/* ── Sidebar ── */}
        <nav
          style={{
            width: 192,
            background: tokens.colors.secondary.sand,
            borderRight: `1px solid ${tokens.colors.secondary.bone}`,
            padding: "32px 0",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              padding: "0 20px 16px",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: tokens.colors.neutral.mediumGrey,
            }}
          >
            Foundations
          </div>
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => setActive(s)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background:
                  active === s
                    ? tokens.colors.secondary.beige
                    : "transparent",
                color:
                  active === s
                    ? tokens.colors.primary.green
                    : tokens.colors.neutral.grey,
                fontFamily: "ArticulatCF, sans-serif",
                fontSize: 14,
                fontWeight: active === s ? 600 : 400,
                padding: "9px 20px",
                border: "none",
                borderLeft: `3px solid ${
                  active === s
                    ? tokens.colors.primary.lighterGreen
                    : "transparent"
                }`,
                cursor: "pointer",
                transition: "all 0.1s ease",
              }}
            >
              {s}
            </button>
          ))}
        </nav>

        {/* ── Content ── */}
        <main
          style={{
            flex: 1,
            padding: "40px 48px",
            overflowY: "auto",
            maxWidth: 900,
          }}
        >
          {/* ── COLORS ── */}
          {active === "Colors" && (
            <div>
              <h1
                style={{
                  fontFamily: "ArticulatCF, sans-serif",
                  fontSize: 30,
                  fontWeight: 700,
                  color: tokens.colors.primary.green,
                  margin: "0 0 8px",
                }}
              >
                Colors
              </h1>
              <p
                style={{
                  fontFamily: "ArticulatCF, sans-serif",
                  fontSize: 16,
                  color: tokens.colors.neutral.grey,
                  margin: "0 0 40px",
                  lineHeight: 1.5,
                }}
              >
                A palette built around a deep green brand family, warm neutral
                surfaces, and two high-energy accents. Deep forest green
                anchors authority; lime green drives actions; orange signals
                urgency.
              </p>
              <ColorGroup
                title="Primary"
                swatches={[
                  ["Dark Green", tokens.colors.primary.darkGreen, true],
                  ["Green", tokens.colors.primary.green, true],
                  ["Medium Green", tokens.colors.primary.mediumGreen, true],
                  ["Lighter Green", tokens.colors.primary.lighterGreen, true],
                  ["Lighter Green 2", tokens.colors.primary.lighterGreenSecond, true],
                  ["Light Green", tokens.colors.primary.lightGreen, true],
                  ["Orange", tokens.colors.primary.orange, true],
                  ["Yellow", tokens.colors.primary.yellow],
                  ["Red", tokens.colors.primary.red, true],
                  ["Blue", tokens.colors.primary.blue],
                  ["Brown", tokens.colors.primary.brown, true],
                  ["Black", tokens.colors.primary.black, true],
                ]}
              />
              <ColorGroup
                title="Secondary"
                swatches={[
                  ["Sand", tokens.colors.secondary.sand],
                  ["Beige", tokens.colors.secondary.beige],
                  ["Bone", tokens.colors.secondary.bone],
                ]}
              />
              <ColorGroup
                title="Neutral"
                swatches={[
                  ["White", tokens.colors.neutral.white],
                  ["Light Grey", tokens.colors.neutral.lightGrey],
                  ["Grey", tokens.colors.neutral.grey, true],
                  ["Medium Grey", tokens.colors.neutral.mediumGrey, true],
                  ["Dark Grey", tokens.colors.neutral.darkGrey, true],
                ]}
              />
              <ColorGroup
                title="Status"
                swatches={[
                  ["Success", tokens.colors.status.success, true],
                  ["Error", tokens.colors.status.error, true],
                  ["Warning", tokens.colors.status.warning, true],
                  ["Info", tokens.colors.status.info, true],
                ]}
              />
            </div>
          )}

          {/* ── TYPOGRAPHY ── */}
          {active === "Typography" && (
            <div>
              <h1
                style={{
                  fontFamily: "ArticulatCF, sans-serif",
                  fontSize: 30,
                  fontWeight: 700,
                  color: tokens.colors.primary.green,
                  margin: "0 0 8px",
                }}
              >
                Typography
              </h1>
              <p
                style={{
                  fontFamily: "ArticulatCF, sans-serif",
                  fontSize: 16,
                  color: tokens.colors.neutral.grey,
                  margin: "0 0 40px",
                  lineHeight: 1.5,
                }}
              >
                A single typeface: <strong>ArticulatCF</strong> with
                sans-serif fallback. Heavy weights give a direct, confident
                brand voice; compact metrics keep labels efficient.
              </p>

              <h4 style={styles.sectionLabel}>Headings</h4>
              {[
                { label: "H1", fontSize: "36px", fontWeight: 700, lineHeight: "1.306" },
                { label: "H2", fontSize: "30px", fontWeight: 700, lineHeight: "1.3" },
                { label: "H3", fontSize: "24px", fontWeight: 700, lineHeight: "1.292" },
                { label: "H4", fontSize: "20px", fontWeight: 600, lineHeight: "1.3" },
                { label: "H5", fontSize: "18px", fontWeight: 600, lineHeight: "1.278" },
                { label: "H6", fontSize: "16px", fontWeight: 600, lineHeight: "1.3125" },
              ].map((t) => (
                <TypeRow
                  key={t.label}
                  label={t.label}
                  style={{
                    fontFamily: "ArticulatCF, sans-serif",
                    fontSize: t.fontSize,
                    fontWeight: t.fontWeight,
                    lineHeight: t.lineHeight,
                  }}
                />
              ))}

              <SectionDivider title="" />
              <h4 style={{ ...styles.sectionLabel, marginTop: 24 }}>Body</h4>
              {[
                { label: "Body LG", fontSize: "18px", fontWeight: 400, lineHeight: "1.5", sample: "Discover our curated range of garden furniture, plants and tools for every outdoor space." },
                { label: "Body MD", fontSize: "16px", fontWeight: 400, lineHeight: "1.5", sample: "Discover our curated range of garden furniture, plants and tools for every outdoor space." },
                { label: "Body SM", fontSize: "14px", fontWeight: 400, lineHeight: "1.5", sample: "Discover our curated range of garden furniture, plants and tools for every outdoor space." },
                { label: "Body XS", fontSize: "12px", fontWeight: 400, lineHeight: "1.5", sample: "Discover our curated range of garden furniture, plants and tools for every outdoor space." },
              ].map((t) => (
                <TypeRow
                  key={t.label}
                  label={t.label}
                  style={{
                    fontFamily: "ArticulatCF, sans-serif",
                    fontSize: t.fontSize,
                    fontWeight: t.fontWeight,
                    lineHeight: t.lineHeight,
                  }}
                  sample={t.sample}
                />
              ))}

              <h4 style={{ ...styles.sectionLabel, marginTop: 32 }}>Labels</h4>
              {[
                { label: "Label MD", fontSize: "16px", fontWeight: 600, lineHeight: "1.5", sample: "Add to Cart" },
                { label: "Label SM", fontSize: "14px", fontWeight: 600, lineHeight: "1.5", sample: "View Details" },
              ].map((t) => (
                <TypeRow
                  key={t.label}
                  label={t.label}
                  style={{
                    fontFamily: "ArticulatCF, sans-serif",
                    fontSize: t.fontSize,
                    fontWeight: t.fontWeight,
                    lineHeight: t.lineHeight,
                  }}
                  sample={t.sample}
                />
              ))}
            </div>
          )}

          {/* ── SPACING & SHAPE ── */}
          {active === "Spacing & Shape" && (
            <div>
              <h1
                style={{
                  fontFamily: "ArticulatCF, sans-serif",
                  fontSize: 30,
                  fontWeight: 700,
                  color: tokens.colors.primary.green,
                  margin: "0 0 8px",
                }}
              >
                Spacing & Shape
              </h1>
              <p
                style={{
                  fontFamily: "ArticulatCF, sans-serif",
                  fontSize: 16,
                  color: tokens.colors.neutral.grey,
                  margin: "0 0 40px",
                  lineHeight: 1.5,
                }}
              >
                A strict 4px base scale governs all spacing. Shape language is
                practically rounded — 4px for interactive controls, full circle
                for radios only.
              </p>

              <h4 style={styles.sectionLabel}>Spacing Scale</h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  marginBottom: 48,
                }}
              >
                {spacingScale.map(({ name, px }) => (
                  <div
                    key={name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 20,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "ArticulatCF, sans-serif",
                        fontSize: 12,
                        fontWeight: 600,
                        color: tokens.colors.neutral.grey,
                        width: 36,
                        flexShrink: 0,
                      }}
                    >
                      {name}
                    </span>
                    <div
                      style={{
                        width: px * 2.5,
                        height: 20,
                        background: tokens.colors.primary.lighterGreen,
                        borderRadius: 2,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "ArticulatCF, sans-serif",
                        fontSize: 12,
                        color: tokens.colors.neutral.mediumGrey,
                      }}
                    >
                      {px}px
                    </span>
                  </div>
                ))}
              </div>

              <h4 style={styles.sectionLabel}>Border Radius</h4>
              <div
                style={{
                  display: "flex",
                  gap: 24,
                  alignItems: "flex-end",
                  flexWrap: "wrap",
                }}
              >
                {[
                  { name: "sm", px: "2px", r: 2 },
                  { name: "md", px: "4px", r: 4 },
                  { name: "full", px: "9999px", r: 9999 },
                ].map(({ name, px, r }) => (
                  <div
                    key={name}
                    style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}
                  >
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        background: tokens.colors.secondary.sand,
                        border: `2px solid ${tokens.colors.primary.green}`,
                        borderRadius: r,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "ArticulatCF, sans-serif",
                        fontSize: 12,
                        fontWeight: 600,
                        color: tokens.colors.neutral.grey,
                      }}
                    >
                      {name}
                    </span>
                    <span
                      style={{
                        fontFamily: "ArticulatCF, sans-serif",
                        fontSize: 11,
                        color: tokens.colors.neutral.mediumGrey,
                      }}
                    >
                      {px}
                    </span>
                  </div>
                ))}
              </div>

              <h4 style={{ ...styles.sectionLabel, marginTop: 40 }}>Container</h4>
              <div
                style={{
                  background: "#fff",
                  border: `1px solid ${tokens.colors.secondary.bone}`,
                  borderRadius: 4,
                  padding: 24,
                }}
              >
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {[
                    { name: "Lighter", bg: "#ffffff" },
                    { name: "Default", bg: "#fafafa" },
                    { name: "Darker", bg: "#f5f5f5" },
                    { name: "Beige", bg: tokens.colors.secondary.beige },
                  ].map(({ name, bg }) => (
                    <div key={name} style={{ flex: "1 1 120px" }}>
                      <div
                        style={{
                          height: 56,
                          background: bg,
                          border: `1px solid ${tokens.colors.neutral.lightGrey}`,
                          borderRadius: 4,
                        }}
                      />
                      <div
                        style={{
                          fontFamily: "ArticulatCF, sans-serif",
                          fontSize: 12,
                          color: tokens.colors.neutral.grey,
                          marginTop: 6,
                          fontWeight: 600,
                        }}
                      >
                        {name}
                      </div>
                      <div
                        style={{
                          fontFamily: "ArticulatCF, sans-serif",
                          fontSize: 11,
                          color: tokens.colors.neutral.mediumGrey,
                        }}
                      >
                        {bg}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── BUTTONS ── */}
          {active === "Buttons" && (
            <div>
              <h1
                style={{
                  fontFamily: "ArticulatCF, sans-serif",
                  fontSize: 30,
                  fontWeight: 700,
                  color: tokens.colors.primary.green,
                  margin: "0 0 8px",
                }}
              >
                Buttons & Actions
              </h1>
              <p
                style={{
                  fontFamily: "ArticulatCF, sans-serif",
                  fontSize: 16,
                  color: tokens.colors.neutral.grey,
                  margin: "0 0 40px",
                  lineHeight: 1.5,
                }}
              >
                Three levels of hierarchy. Primary is the strongest CTA.
                Secondary for outlined actions. Tertiary for low-priority inline
                actions. Hover the buttons to see state transitions.
              </p>

              {[
                {
                  title: "Primary",
                  subtitle:
                    "Lime green fill with 4px darker bottom border — the tactile depth signal. Used for the single strongest call to action on screen.",
                  component: <BtnPrimary />,
                  tokens: [
                    ["bg-default", tokens.colors.primary.lighterGreen],
                    ["bg-hover", tokens.colors.primary.lightGreen],
                    ["border-bottom", tokens.colors.primary.lightGreen],
                    ["text", "#FFFFFF"],
                  ],
                },
                {
                  title: "Secondary",
                  subtitle:
                    "Transparent fill with a solid green border. Inverts to solid dark green on hover. For supporting actions alongside a primary CTA.",
                  component: <BtnSecondary />,
                  tokens: [
                    ["bg-default", "transparent"],
                    ["bg-hover", tokens.colors.primary.green],
                    ["border", tokens.colors.primary.green],
                    ["text-default", tokens.colors.primary.green],
                    ["text-hover", "#FFFFFF"],
                  ],
                },
                {
                  title: "Tertiary",
                  subtitle:
                    "No background, no border, no padding. Text link behavior. For low-priority or inline contextual actions only.",
                  component: <BtnTertiary />,
                  tokens: [
                    ["text-default", tokens.colors.primary.green],
                    ["text-hover", tokens.colors.primary.lighterGreen],
                  ],
                },
              ].map(({ title, subtitle, component, tokens: tkns }) => (
                <div
                  key={title}
                  style={{
                    background: "#fff",
                    border: `1px solid ${tokens.colors.secondary.bone}`,
                    borderRadius: 4,
                    padding: 28,
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 24,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ flex: "1 1 200px" }}>
                      <div
                        style={{
                          fontFamily: "ArticulatCF, sans-serif",
                          fontSize: 14,
                          fontWeight: 700,
                          color: tokens.colors.primary.green,
                          marginBottom: 4,
                        }}
                      >
                        {title}
                      </div>
                      <div
                        style={{
                          fontFamily: "ArticulatCF, sans-serif",
                          fontSize: 13,
                          color: tokens.colors.neutral.grey,
                          lineHeight: 1.5,
                          marginBottom: 20,
                          maxWidth: 320,
                        }}
                      >
                        {subtitle}
                      </div>
                      {component}
                    </div>
                    <div
                      style={{
                        flex: "0 0 auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      {tkns.map(([name, val]) => (
                        <div
                          key={name}
                          style={{ display: "flex", alignItems: "center", gap: 8 }}
                        >
                          <div
                            style={{
                              width: 14,
                              height: 14,
                              borderRadius: 2,
                              background: val === "transparent" ? "#fff" : val,
                              border: `1px solid ${tokens.colors.neutral.lightGrey}`,
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontFamily: "ArticulatCF, sans-serif",
                              fontSize: 11,
                              color: tokens.colors.neutral.mediumGrey,
                            }}
                          >
                            {name}
                          </span>
                          <code
                            style={{
                              fontFamily: "monospace",
                              fontSize: 11,
                              color: tokens.colors.neutral.grey,
                              background: tokens.colors.secondary.beige,
                              padding: "1px 5px",
                              borderRadius: 2,
                            }}
                          >
                            {val}
                          </code>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── FORMS ── */}
          {active === "Forms" && (
            <div>
              <h1
                style={{
                  fontFamily: "ArticulatCF, sans-serif",
                  fontSize: 30,
                  fontWeight: 700,
                  color: tokens.colors.primary.green,
                  margin: "0 0 8px",
                }}
              >
                Forms & Inputs
              </h1>
              <p
                style={{
                  fontFamily: "ArticulatCF, sans-serif",
                  fontSize: 16,
                  color: tokens.colors.neutral.grey,
                  margin: "0 0 40px",
                  lineHeight: 1.5,
                }}
              >
                All inputs share a white surface with a light grey resting
                border. State is communicated through border color alone — no
                fills change. Click the inputs to see focus state.
              </p>

              <SectionDivider title="Text Inputs" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: 24,
                  marginBottom: 48,
                }}
              >
                <InputDemo label="Default" state="default" />
                <InputDemo label="Error" state="error" />
                <InputDemo label="Success" state="success" />
                <InputDemo label="Disabled" state="disabled" />
              </div>

              <SectionDivider title="Checkboxes" />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  marginBottom: 48,
                }}
              >
                <CheckboxDemo label="Unchecked" />
                <CheckboxDemo label="Checked" checked />
                <CheckboxDemo label="Inactive" inactive />
              </div>

              <SectionDivider title="Radio Buttons" />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  marginBottom: 48,
                }}
              >
                <RadioDemo label="Unselected" />
                <RadioDemo label="Selected" checked />
                <RadioDemo label="Inactive" inactive />
              </div>

              <div
                style={{
                  background: tokens.colors.secondary.sand,
                  borderRadius: 4,
                  padding: "16px 20px",
                  borderLeft: `4px solid ${tokens.colors.primary.brown}`,
                }}
              >
                <div
                  style={{
                    fontFamily: "ArticulatCF, sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: tokens.colors.primary.green,
                    marginBottom: 4,
                  }}
                >
                  Usage Note
                </div>
                <div
                  style={{
                    fontFamily: "ArticulatCF, sans-serif",
                    fontSize: 13,
                    color: tokens.colors.neutral.grey,
                    lineHeight: 1.5,
                  }}
                >
                  Checkboxes and radios are always 20px, always paired with a
                  label in a flex row. Group multiple choice controls in a flex
                  column. Never mix circular and rectangular corners within the
                  same control group.
                </div>
              </div>
            </div>
          )}

          {/* ── MESSAGES ── */}
          {active === "Messages" && (
            <div>
              <h1
                style={{
                  fontFamily: "ArticulatCF, sans-serif",
                  fontSize: 30,
                  fontWeight: 700,
                  color: tokens.colors.primary.green,
                  margin: "0 0 8px",
                }}
              >
                Messages
              </h1>
              <p
                style={{
                  fontFamily: "ArticulatCF, sans-serif",
                  fontSize: 16,
                  color: tokens.colors.neutral.grey,
                  margin: "0 0 40px",
                  lineHeight: 1.5,
                }}
              >
                All four message types share the same structure: 4px radius,
                left border in the status color, tinted background, and a small
                icon badge.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <MessageBlock
                  type="success"
                  text="Your order has been placed successfully. Delivery in 3–5 business days."
                />
                <MessageBlock
                  type="error"
                  text="Payment failed. Please check your card details and try again."
                />
                <MessageBlock
                  type="warning"
                  text="Only 2 items left in stock. Order now to secure your purchase."
                />
                <MessageBlock
                  type="info"
                  text="Free shipping on orders over €75. Add €12 more to qualify."
                />
              </div>

              <h4 style={{ ...styles.sectionLabel, marginTop: 40 }}>
                Token Reference
              </h4>
              <div
                style={{
                  background: "#fff",
                  border: `1px solid ${tokens.colors.secondary.bone}`,
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                {[
                  { type: "Success", bg: "#F0FDF4", border: tokens.colors.status.success },
                  { type: "Error", bg: "#FEF2F2", border: tokens.colors.status.error },
                  { type: "Warning", bg: "#FEFCE8", border: tokens.colors.status.warning },
                  { type: "Info", bg: "#EFF6FF", border: tokens.colors.status.info },
                ].map(({ type, bg, border }, i) => (
                  <div
                    key={type}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "12px 20px",
                      borderBottom:
                        i < 3
                          ? `1px solid ${tokens.colors.neutral.lightGrey}`
                          : "none",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "ArticulatCF, sans-serif",
                        fontSize: 13,
                        fontWeight: 600,
                        color: tokens.colors.primary.green,
                        width: 72,
                      }}
                    >
                      {type}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: 2,
                          background: bg,
                          border: `1px solid ${tokens.colors.neutral.lightGrey}`,
                        }}
                      />
                      <code
                        style={{
                          fontFamily: "monospace",
                          fontSize: 11,
                          color: tokens.colors.neutral.grey,
                        }}
                      >
                        bg: {bg}
                      </code>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: 2,
                          background: border,
                        }}
                      />
                      <code
                        style={{
                          fontFamily: "monospace",
                          fontSize: 11,
                          color: tokens.colors.neutral.grey,
                        }}
                      >
                        border: {border}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
