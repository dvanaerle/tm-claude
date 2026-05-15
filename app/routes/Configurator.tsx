import { useState, useCallback, useRef, useEffect, useMemo } from "react";

/* ─── DESIGN TOKENS ─── */
const T = {
  darkGreen: "#001A13",
  green: "#003017",
  medGreen: "#002E21",
  orange: "#FF8000",
  lime: "#809700",
  limeDark: "#6D8005",
  sand: "#F5E6D7",
  beige: "#FFF5ED",
  bone: "#E0D2C5",
  grey: "#636363",
  midGrey: "#878787",
  lightGrey: "#E3E3E3",
  white: "#FFFFFF",
  black: "#11171F",
  darkGrey: "#151A1F",
  selectedBg: "#f0f7e8",
  // RAL colour hex values from the configurator
  antraciet: "#3E4347",
  zwart: "#1C1C1C",
  wit: "#F2F2F2",
};

/* ─── DATA (strictly from architecture document) ─── */

// Step 1: Productlijnen
const LIJNEN = [
  {
    id: "poly",
    name: "Poly Line",
    badge: "Voordeligst",
    bc: T.darkGreen,
    from: "v.a. €799,00",
    basePrice: 799,
    desc: "Opaal polycarbonaat dak. Diffuus zacht licht. Zelf inkortbaar op maat.",
  },
  {
    id: "glass",
    name: "Glass Line",
    badge: "Populairste",
    bc: T.lime,
    from: "v.a. €1.151,00",
    basePrice: 1151,
    desc: "Helder of melkglas dak. Maximale lichtinval. Meest gekozen productlijn.",
  },
  {
    id: "heavy",
    name: "Heavy Duty",
    badge: "Premium",
    bc: T.orange,
    from: "v.a. €1.534,00",
    basePrice: 1534,
    desc: "6061-T6 aluminium constructie. Draagt 98 kg/m² sneeuwlast. Maximale kwaliteit.",
  },
];

// Step 1: Stijlen per lijn
const STIJLEN = {
  poly: [
    {
      id: "modern",
      name: "Modern",
      delta: 0,
      note: "Ronde decoratieve dakgootafwerking. Mat antraciet, wit, zwart.",
    },
    {
      id: "klassiek",
      name: "Klassiek",
      delta: 0,
      note: "Golvende decoratieve afwerking. Mat antraciet en wit.",
    },
  ],
  glass: [
    {
      id: "modern",
      name: "Modern",
      delta: 0,
      note: "Ronde decoratieve dakgootafwerking. Mat antraciet, wit, zwart.",
    },
    {
      id: "klassiek",
      name: "Klassiek",
      delta: 0,
      note: "Golvende decoratieve afwerking. Mat antraciet en wit.",
    },
  ],
  heavy: [
    {
      id: "modern",
      name: "Modern",
      delta: 0,
      note: "Ronde decoratieve afwerking.",
    },
    {
      id: "authentiek",
      name: "Authentiek",
      delta: 0,
      note: "Gelaagde afwerking. Mat antraciet, wit, zwart.",
    },
    {
      id: "eigentijds",
      name: "Eigentijds",
      delta: 100,
      note: "Robuuste overhangende afwerking. Alleen mat antraciet.",
    },
    {
      id: "tijdloos",
      name: "Tijdloos",
      delta: 0,
      note: "Strakke afwerking. Mat antraciet en zwart.",
    },
  ],
};

// Step 2: Breedtes
const BREEDTES = [
  { id: "3060", label: "3.060 mm", delta: { poly: 0, glass: 0, heavy: 0 } },
  {
    id: "4060",
    label: "4.060 mm",
    delta: { poly: 382, glass: 178, heavy: 236 },
  },
  {
    id: "5060",
    label: "5.060 mm",
    delta: { poly: 633, glass: 444, heavy: 591 },
  },
  {
    id: "6060",
    label: "6.060 mm",
    delta: { poly: 825, glass: 798, heavy: 1064 },
  },
  {
    id: "7060",
    label: "7.060 mm",
    delta: { poly: 993, glass: 1064, heavy: 1418 },
  },
  {
    id: "8060",
    label: "8.060 mm",
    delta: { poly: 1534, glass: 1596, heavy: 2126 },
  },
  {
    id: "9060",
    label: "9.060 mm",
    delta: { poly: 1584, glass: 1773, heavy: 2363 },
  },
  {
    id: "10060",
    label: "10.060 mm",
    delta: { poly: 1894, glass: 2172, heavy: 2895 },
  },
  {
    id: "11060",
    label: "11.060 mm",
    delta: { poly: 2180, glass: 2483, heavy: 3308 },
  },
  {
    id: "12060",
    label: "12.060 mm",
    delta: { poly: 2470, glass: 2749, heavy: 3662 },
  },
];

// Step 2: Dieptes
const DIEPTES = [
  { id: "2500", label: "2.500 mm", delta: { poly: 0, glass: 0, heavy: 0 } },
  {
    id: "3000",
    label: "3.000 mm",
    delta: { poly: 100, glass: 178, heavy: 236 },
  },
  {
    id: "3500",
    label: "3.500 mm",
    delta: { poly: 421, glass: 355, heavy: 473 },
  },
  {
    id: "4000",
    label: "4.000 mm",
    delta: { poly: 633, glass: 710, heavy: 945 },
  },
];

// Step 2: Fundering
const FUNDERINGEN = [
  {
    id: "geen",
    name: "Geen fundering",
    delta: 0,
    note: "U zorgt zelf voor een vlakke, draagkrachtige ondergrond.",
  },
  {
    id: "poer",
    name: "Betonpoeren zonder HWA",
    delta: 130,
    note: "Verstelbare fundering, HWA-uitlaat door paal. Inclusief PVC bocht en gatenzaag.",
  },
  {
    id: "hwa1",
    name: "Betonpoeren, 1× met HWA",
    delta: 167,
    note: "Ondergrondse regenwaterafvoer. Geen zichtbare afvoerleidingen.",
  },
  {
    id: "hwa2",
    name: "Betonpoeren, 2× met HWA",
    delta: 175,
    note: "Ondergrondse regenwaterafvoer links en rechts. Geen zichtbare afvoerleidingen.",
  },
];

// Step 3: Daktypen (glass + heavy only)
const DAKTYPEN = [
  {
    id: "helder",
    name: "Helder glas",
    note: "Maximaal doorzicht. Gehard en gelamineerd glas 4-4-2, 8,76 mm dik, panelen van 98 cm breed.",
  },
  {
    id: "melk",
    name: "Melkglas",
    note: "Zachter licht en privacy. Gehard en gelamineerd glas 4-4-2, 8,76 mm dik, panelen van 98 cm breed.",
  },
];

// Step 3: Kleuren per lijn/stijl
const KLEUREN = {
  default: [
    {
      id: "antraciet",
      name: "Mat antraciet",
      ral: "RAL 7016",
      hex: T.antraciet,
    },
    { id: "zwart", name: "Mat zwart", ral: "RAL 9005", hex: T.zwart },
    { id: "wit", name: "Mat wit", ral: "RAL 9016", hex: T.wit },
  ],
  // Heavy Duty Modern has no white
  heavy_modern: [
    {
      id: "antraciet",
      name: "Mat antraciet",
      ral: "RAL 7016",
      hex: T.antraciet,
    },
    { id: "zwart", name: "Mat zwart", ral: "RAL 9005", hex: T.zwart },
  ],
};

// Step 3: Color-dependent upsells
const KLEUR_UPSELLS = {
  antraciet: [
    { id: "lakstift", name: "Lakstift mat antraciet", price: 24.0, qty: 0 },
    { id: "spuitbus", name: "Spuitbus mat antraciet", price: 51.45, qty: 0 },
  ],
  zwart: [
    { id: "lakstift", name: "Lakstift mat zwart", price: 24.0, qty: 0 },
    { id: "spuitbus", name: "Spuitbus mat zwart", price: 51.45, qty: 0 },
  ],
  wit: [
    { id: "lakstift", name: "Lakstift mat wit", price: 24.0, qty: 0 },
    { id: "spuitbus", name: "Spuitbus mat wit", price: 51.45, qty: 0 },
  ],
};

// Step 4: Voorzijde opties
const VOORZIJDE = [
  {
    id: "open",
    name: "Voorkant open",
    delta: 0,
    note: "Geen afscheiding aan de voorzijde.",
  },
  {
    id: "schuifwand",
    name: "Glazen schuifwanden",
    delta: 308,
    note: "Railsysteem. Met of zonder Steel Look. Combineerbaar met Shading Panel en/of vliegengaas schuifdeur.",
  },
  {
    id: "schoor_normaal",
    name: "Schoren normaal",
    delta: 104,
    note: "Eén schoor per paal. Decoratief. Niet mogelijk in combinatie met schuifwand.",
  },
  {
    id: "schoor_binnen",
    name: "Schoren naar binnen",
    delta: 208,
    note: "Twee schoren per paal. Decoratief. Niet mogelijk in combinatie met schuifwand.",
  },
];

// Step 4: Zijkant opties (left + right)
const ZIJKANT = [
  {
    id: "open",
    name: "Zijkant open laten",
    delta: 0,
    note: "Geen afscheiding aan de zijkant.",
  },
  {
    id: "poly_spie",
    name: "Polycarbonaat spie op schutting",
    delta: 171,
    note: "Sluit de ruimte tussen veranda en schutting. Beschermt tegen regen en wind.",
  },
  {
    id: "schuifwand",
    name: "Glazen schuifwanden",
    delta: 715.1,
    note: "Railsysteem. Steel Look optioneel. Combineerbaar met Shading Panel en/of vliegengaas schuifdeur.",
  },
  {
    id: "aluminium",
    name: "Aluminium zijwand",
    delta: 1049,
    note: "Volledige privacywand. Stevige constructie. Twee kleuropties voor panelen.",
  },
  {
    id: "glazen_spie",
    name: "Glazen spie",
    delta: 363,
    note: "Daglicht, regen- en windbescherming. Optioneel privacyfolie.",
  },
  {
    id: "poly_wand",
    name: "Polycarbonaat zijwand",
    delta: 588,
    note: "Opaal polycarbonaat zijwand. Privacy met diffuus licht.",
  },
];

const GLASS_SHORTENING = [
  {
    id: "none",
    name: "Don't shorten",
    note: "Standaard dakplaten, automatisch opgelost via roof-panels.",
  },
  {
    id: "custom",
    name: "Customized glass",
    note: "Start de glas zaagopties voor ingekorte Glass Line dakplaten.",
  },
];

const GLASS_CUTTING_OPTIONS = [
  "2070-2490 mm",
  "28003050",
  "2500 mm",
  "2510-2770 mm",
  "2780 mm",
  "2800-3050 mm",
  "3070-3490 mm",
  "3500 mm",
  "3510-3770 mm",
  "3780 mm",
  "3800-4050 mm",
  "4070-4490 mm",
  "4500 mm",
  "4510-4770 mm",
  "4780 mm",
  "4800-5050 mm",
  "5070-5490 mm",
  "5500 mm",
  "5510-5770 mm",
  "5780 mm",
  "5800-6050 mm",
  "6070-6490 mm",
  "6500 mm",
  "6510-6770 mm",
  "6780 mm",
  "6800-7050 mm",
  "7070-7490 mm",
  "7500 mm",
  "7510-7770 mm",
  "7780 mm",
  "7800-8050 mm",
  "8070-8490 mm",
  "8500 mm",
  "8510-8770 mm",
  "8780 mm",
  "8800-9050 mm",
  "9070-9490 mm",
  "9500 mm",
  "9510-9770 mm",
  "9780 mm",
  "9800-10050 mm",
  "10070-10490 mm",
  "10500 mm",
  "10510-10770 mm",
  "10780 mm",
  "10800-11050 mm",
  "11070-11490 mm",
  "11500 mm",
  "11510-11770 mm",
  "11780 mm",
  "11800-12050 mm",
  "Ongezaagd",
].map((label) => ({ id: label, name: label }));

const FRONT_GLASS_WALL = {
  size: [
    "1900",
    "1950",
    "2000",
    "2050",
    "2100",
    "2150",
    "2200",
    "2250",
    "2300",
    "2350",
    "2400",
    "2500",
    "2600",
    "2700",
  ].map((height) => ({ id: height, name: `${height} mm` })),
  foundation: [
    { id: "geen", name: "Geen fundering", delta: 0 },
    { id: "funderingskoker", name: "Funderingskoker", delta: 170 },
  ],
  accessories: [
    { id: "geen", name: "Geen accessoires", delta: 0 },
    { id: "steel_look", name: "Steel Look set", delta: 173 },
    { id: "strips", name: "Sier- en tochtstrips", delta: 121.8 },
  ],
  handles: [
    { id: "geen", name: "Geen handgrepen", delta: 0 },
    { id: "curved", name: "Curved", delta: 81.9 },
    { id: "square", name: "Square", delta: 81.9 },
    { id: "square_large", name: "Square Large", delta: 117 },
  ],
  profiles: [
    { id: "geen", name: "Geen U-profielen", delta: 0 },
    { id: "u_profielen", name: "U-Profielen", delta: 166 },
  ],
};

const SIDE_GLASS_WALL = {
  size: [
    "2000",
    "2050",
    "2100",
    "2150",
    "2200",
    "2250",
    "2300",
    "2350",
    "2400",
    "2500",
  ].map((height) => ({ id: height, name: `${height} mm` })),
  foundation: FRONT_GLASS_WALL.foundation,
  accessories: FRONT_GLASS_WALL.accessories,
  handles: [
    { id: "geen", name: "Geen handgrepen", delta: 0 },
    { id: "curved", name: "Handgrepen Curved", delta: 81.9 },
    { id: "square", name: "Handgrepen Square", delta: 81.9 },
    { id: "square_large", name: "Handgrepen square large", delta: 117 },
  ],
  profiles: [
    { id: "geen", name: "Geen U-profielen", delta: 0 },
    { id: "u_profielen", name: "U-profielen", delta: 166 },
  ],
};

const ALUMINIUM_SIDE_WALL = {
  panelColor: [
    { id: "antraciet", name: "Mat antraciet RAL 7016" },
    { id: "grijsbeige", name: "Mat grijsbeige RAL 1019" },
  ],
  height: [
    { id: "2000_2300", name: "2000-2300 mm", delta: 0 },
    { id: "2301_2500", name: "2301-2500 mm", delta: 105 },
    { id: "met_spie", name: "Met spie", delta: 315 },
  ],
  foundation: [
    { id: "geen", name: "Geen funderingskoker", delta: 0 },
    { id: "funderingskoker", name: "Funderingskoker", delta: 170 },
  ],
};

const DEFAULT_GLASS_WALL = {
  size: "2000",
  foundation: "geen",
  accessories: "geen",
  handles: "geen",
  profiles: "geen",
};

const DEFAULT_FRONT_GLASS_WALL = {
  ...DEFAULT_GLASS_WALL,
  size: "1900",
};

const DEFAULT_ALUMINIUM_WALL = {
  panelColor: "antraciet",
  height: "2000_2300",
  foundation: "geen",
};

// Step 5: Zonwering
const ZONWERING = [
  { id: "geen", name: "Geen zonwering", delta: 0, note: "" },
  {
    id: "gumax",
    name: "Gumax zonwering voor alle banen",
    delta: 897,
    note: "Bedienbaar per baan. Reflecteert licht en warmtestraling. 89% warmtestralingreflectie.",
  },
];

// Step 5: Verlichting
const VERLICHTING = [
  { id: "geen", name: "Geen verlichting", delta: 0, note: "" },
  {
    id: "ledspot",
    name: "Gumax ledspots",
    delta: 173,
    note: "Warm wit 2700K. Dimbaar via afstandsbediening. Twee spots per dwarsligger.",
  },
  {
    id: "system",
    name: "Gumax Lighting System",
    delta: 314,
    note: "Breed kleurenspectrum. Afstandsbediening per armatuur. Smart Home integratie mogelijk.",
  },
];

// Step 5: Bladvanger
const BLADVANGER = [
  { id: "geen", name: "Geen bladvanger", delta: 0, note: "" },
  {
    id: "bladvanger",
    name: "Bladvanger",
    delta: 51.45,
    note: "Dakgootbreedte bladvanger. Voorkomt verstopping en bevordert waterafvoer.",
  },
];

// Step 5: Ledspot upsell
const LEDSPOT_UPSELL = {
  id: "afstandsbed",
  name: "Afstandsbediening ledspots",
  price: 52.31,
  qty: 1,
};

// Step 6: Remaining upsells
const OVERZICHT_UPSELLS = [
  {
    id: "pvc_bocht",
    name: "90° PVC bocht 71mm antraciet",
    price: 13.1,
    qty: 0,
  },
  { id: "reinigingsset", name: "Gumax reinigingsset", price: 34.95, qty: 0 },
];

/* ─── INITIAL STATE ─── */
const INIT = {
  lijn: null,
  stijl: null,
  breedte: "3060",
  diepte: "2500",
  fundering: "poer",
  daktype: "helder",
  kleur: "antraciet",
  inkortOptie: "none",
  glasZaagoptie: "Ongezaagd",
  kleurUpsells: [], // [{id, name, price, qty}]
  voorzijde: "open",
  links: "open",
  rechts: "open",
  frontWall: DEFAULT_FRONT_GLASS_WALL,
  sideWalls: {
    links: DEFAULT_GLASS_WALL,
    rechts: DEFAULT_GLASS_WALL,
  },
  aluminiumWalls: {
    links: DEFAULT_ALUMINIUM_WALL,
    rechts: DEFAULT_ALUMINIUM_WALL,
  },
  zonwering: "geen",
  verlichting: "geen",
  bladvanger: "geen",
  ledspotUpsell: false,
  overzichtUpsells: OVERZICHT_UPSELLS.map((u) => ({ ...u })),
};

/* ─── PRICE CALCULATOR ─── */
function optionDelta(options, id) {
  return options.find((option) => option.id === id)?.delta || 0;
}

function glassWallDelta(options, values) {
  const handlesDelta =
    values.accessories === "steel_look"
      ? 0
      : optionDelta(options.handles, values.handles);
  return (
    optionDelta(options.foundation, values.foundation) +
    optionDelta(options.accessories, values.accessories) +
    handlesDelta +
    optionDelta(options.profiles, values.profiles)
  );
}

function aluminiumWallDelta(values) {
  return (
    optionDelta(ALUMINIUM_SIDE_WALL.height, values.height) +
    optionDelta(ALUMINIUM_SIDE_WALL.foundation, values.foundation)
  );
}

function subConfiguratorDelta(c) {
  const frontWall =
    c.voorzijde === "schuifwand"
      ? glassWallDelta(FRONT_GLASS_WALL, c.frontWall)
      : 0;
  const leftGlassWall =
    c.links === "schuifwand"
      ? glassWallDelta(SIDE_GLASS_WALL, c.sideWalls.links)
      : 0;
  const rightGlassWall =
    c.rechts === "schuifwand"
      ? glassWallDelta(SIDE_GLASS_WALL, c.sideWalls.rechts)
      : 0;
  const leftAluminiumWall =
    c.links === "aluminium" ? aluminiumWallDelta(c.aluminiumWalls.links) : 0;
  const rightAluminiumWall =
    c.rechts === "aluminium" ? aluminiumWallDelta(c.aluminiumWalls.rechts) : 0;
  return (
    frontWall +
    leftGlassWall +
    rightGlassWall +
    leftAluminiumWall +
    rightAluminiumWall
  );
}

function calcPrice(c) {
  if (!c.lijn) return 0;
  const lijn = LIJNEN.find((l) => l.id === c.lijn);
  const breedte = BREEDTES.find((b) => b.id === c.breedte);
  const diepte = DIEPTES.find((d) => d.id === c.diepte);
  const stijl = STIJLEN[c.lijn]?.find((s) => s.id === c.stijl);
  const funder = FUNDERINGEN.find((f) => f.id === c.fundering);
  const voor = VOORZIJDE.find((v) => v.id === c.voorzijde);
  const li = ZIJKANT.find((z) => z.id === c.links);
  const re = ZIJKANT.find((z) => z.id === c.rechts);
  const zon = ZONWERING.find((z) => z.id === c.zonwering);
  const verl = VERLICHTING.find((v) => v.id === c.verlichting);
  const blad = BLADVANGER.find((b) => b.id === c.bladvanger);
  let p = lijn.basePrice;
  if (breedte) p += breedte.delta[c.lijn] || 0;
  if (diepte) p += diepte.delta[c.lijn] || 0;
  if (stijl) p += stijl.delta || 0;
  if (funder) p += funder.delta || 0;
  if (voor) p += voor.delta || 0;
  if (li) p += li.delta || 0;
  if (re) p += re.delta || 0;
  if (zon) p += zon.delta || 0;
  if (verl) p += verl.delta || 0;
  if (blad) p += blad.delta || 0;
  if (c.ledspotUpsell) p += LEDSPOT_UPSELL.price;
  // color upsells
  c.kleurUpsells.forEach((u) => {
    p += u.price * u.qty;
  });
  // overzicht upsells
  c.overzichtUpsells.forEach((u) => {
    p += u.price * u.qty;
  });
  p += subConfiguratorDelta(c);
  return Math.round(p * 100) / 100;
}

/* ─── ICON ─── */
function Icon({ name, size = 16, color = "currentColor" }) {
  const paths = {
    check: "M20 6L9 17l-5-5",
    "arrow-left": "M19 12H5M5 12l7 7M5 12l7-7",
    "arrow-right": "M5 12h14M13 5l7 7-7 7",
    cart: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0",
    info: "M12 16v-4m0-4h.01M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z",
    warning:
      "M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z",
    plus: "M12 5v14M5 12h14",
    minus: "M5 12h14",
    chevdown: "M6 9l6 6 6-6",
    chevup: "M18 15l-6-6-6 6",
    mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  };
  const d = paths[name];
  if (!d) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <path d={d} />
    </svg>
  );
}

/* ─── RADIO ─── */
function Radio({ active, onClick, children, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "12px 14px",
        background: active ? T.selectedBg : T.white,
        border: `1.5px solid ${active ? T.lime : disabled ? "#f0f0f0" : T.lightGrey}`,
        borderRadius: 8,
        textAlign: "left",
        fontFamily: "inherit",
        transition: "all .15s",
        width: "100%",
        boxShadow: active ? "0 2px 10px rgba(128,151,0,.1)" : "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          flexShrink: 0,
          marginLeft: "auto",
          marginTop: 1,
          border: `2px solid ${active ? T.green : T.lightGrey}`,
          background: T.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {active && (
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: T.green,
            }}
          />
        )}
      </div>
    </button>
  );
}

/* ─── NOTE ─── */
function Note({ icon = "info", color = T.lime, children }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 9,
        alignItems: "flex-start",
        background: `${color}14`,
        border: `1px solid ${color}35`,
        borderRadius: 8,
        padding: "10px 12px",
        fontSize: 12,
        color: T.black,
        lineHeight: 1.65,
      }}
    >
      <Icon
        name={icon}
        size={14}
        color={color}
        style={{ marginTop: 1, flexShrink: 0 }}
      />
      <span>{children}</span>
    </div>
  );
}

/* ─── SECTION HEADER ─── */
function SH({ label }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        color: T.midGrey,
        textTransform: "uppercase",
        letterSpacing: ".09em",
        marginBottom: 8,
      }}
    >
      {label}
    </div>
  );
}

/* ─── SEPARATOR ─── */
function Sep() {
  return (
    <div style={{ height: 1, background: T.lightGrey, margin: "22px 0" }} />
  );
}

/* ─── PRICE BADGE ─── */
function PriceBadge({ delta }) {
  if (!delta) return null;
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: T.white,
        background: T.orange,
        borderRadius: 4,
        padding: "1px 7px",
        flexShrink: 0,
      }}
    >
      +{fmtEur(delta)}
    </span>
  );
}

function fmtEur(n) {
  return (
    "€" +
    n.toLocaleString("nl-NL", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

/* ─── STEPPER QTY ─── */
function QtyControl({ qty, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        border: `1px solid ${T.lightGrey}`,
        borderRadius: 6,
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => onChange(Math.max(0, qty - 1))}
        style={{
          width: 30,
          height: 30,
          border: "none",
          background: T.beige,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "inherit",
        }}
      >
        <Icon name="minus" size={12} color={T.green} />
      </button>
      <span
        style={{
          width: 30,
          textAlign: "center",
          fontSize: 13,
          fontWeight: 700,
          color: T.green,
        }}
      >
        {qty}
      </span>
      <button
        onClick={() => onChange(qty + 1)}
        style={{
          width: 30,
          height: 30,
          border: "none",
          background: T.beige,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "inherit",
        }}
      >
        <Icon name="plus" size={12} color={T.green} />
      </button>
    </div>
  );
}

/* ─── UPSELL CARD ─── */
function UpsellCard({ name, price, qty, onChange }) {
  const active = qty > 0;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        border: `1.5px solid ${active ? T.lime : T.lightGrey}`,
        borderRadius: 8,
        background: active ? T.selectedBg : T.white,
        transition: "all .15s",
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.green }}>
          {name}
        </div>
        <div style={{ fontSize: 12, color: T.grey, marginTop: 2 }}>
          {fmtEur(price)} per stuk
        </div>
      </div>
      <QtyControl qty={qty} onChange={onChange} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   STEP 1 — Productlijn & Stijl
═══════════════════════════════════════════ */
function OptionGroup({ label, options, value, onChange, columns = 1 }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <SH label={label} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns},1fr)`,
          gap: 8,
        }}
      >
        {options.map((option) => (
          <Radio
            key={option.id}
            active={value === option.id}
            onClick={() => onChange(option.id)}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: option.note ? 3 : 0,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: T.green }}>
                  {option.name}
                </span>
                {option.delta > 0 && <PriceBadge delta={option.delta} />}
              </div>
              {option.note && (
                <span style={{ fontSize: 11, color: T.grey, lineHeight: 1.5 }}>
                  {option.note}
                </span>
              )}
            </div>
          </Radio>
        ))}
      </div>
    </div>
  );
}

function SelectGroup({ label, options, value, onChange }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <SH label={label} />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{
          width: "100%",
          padding: "11px 12px",
          border: `1.5px solid ${T.lightGrey}`,
          borderRadius: 8,
          background: T.white,
          color: T.green,
          fontFamily: "inherit",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function SubPath({ title, children }) {
  return (
    <div
      style={{
        marginTop: 12,
        padding: "14px 14px 2px",
        border: `1px solid ${T.lightGrey}`,
        borderRadius: 8,
        background: T.beige,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 800,
          color: T.green,
          marginBottom: 12,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function Step1({ c, s }) {
  const stijlen = c.lijn ? STIJLEN[c.lijn] : [];
  const selectLijn = useCallback(
    (id) => {
      const firstStijl = STIJLEN[id][0].id;
      s((prev) => ({ ...prev, lijn: id, stijl: firstStijl }));
    },
    [s],
  );

  return (
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: T.orange,
          textTransform: "uppercase",
          letterSpacing: ".1em",
          marginBottom: 5,
        }}
      >
        Stap 1 van 6
      </div>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: T.green,
          letterSpacing: "-.025em",
          marginBottom: 4,
        }}
      >
        Productlijn & Stijl
      </h2>
      <p
        style={{
          fontSize: 13,
          color: T.grey,
          lineHeight: 1.6,
          marginBottom: 20,
        }}
      >
        Kies uw productlijn en stijl. Dit bepaalt de constructie, het gewicht en
        de prijs van uw terrasoverkapping.
      </p>

      {/* Productlijn cards — horizontal, image left */}
      <SH label="Productlijn" />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginBottom: 22,
        }}
      >
        {LIJNEN.map((l) => {
          const active = c.lijn === l.id;
          return (
            <button
              key={l.id}
              onClick={() => selectLijn(l.id)}
              style={{
                padding: 0,
                border: `2px solid ${active ? T.lime : T.lightGrey}`,
                borderRadius: 10,
                overflow: "hidden",
                textAlign: "left",
                fontFamily: "inherit",
                cursor: "pointer",
                background: T.white,
                transition: "border-color .18s, box-shadow .18s",
                boxShadow: active ? "0 2px 12px rgba(128,151,0,.15)" : "none",
                display: "flex",
                flexDirection: "row",
              }}
            >
              {/* Image placeholder — left, fills height */}
              <div
                style={{
                  width: "42%",
                  flexShrink: 0,
                  position: "relative",
                  overflow: "hidden",
                  background: "#EBEBEB",
                  alignSelf: "stretch",
                  minHeight: 120,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                      "linear-gradient(45deg,#e0e0e0 25%,transparent 25%),linear-gradient(-45deg,#e0e0e0 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e0e0e0 75%),linear-gradient(-45deg,transparent 75%,#e0e0e0 75%)",
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0,0 10px,10px -10px,-10px 0",
                  }}
                />
                {active && (
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      zIndex: 2,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: T.lime,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name="check" size={11} color={T.white} />
                  </div>
                )}
              </div>
              {/* Content */}
              <div
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  background: active ? T.selectedBg : T.white,
                  transition: "background .18s",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <span
                    style={{ fontSize: 14, fontWeight: 800, color: T.green }}
                  >
                    {l.name}
                  </span>
                  <span
                    style={{
                      fontSize: 8,
                      fontWeight: 800,
                      color: T.white,
                      background: l.bc,
                      borderRadius: 4,
                      padding: "2px 6px",
                      textTransform: "uppercase",
                      letterSpacing: ".04em",
                      flexShrink: 0,
                    }}
                  >
                    {l.badge}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: T.grey,
                    lineHeight: 1.55,
                    margin: 0,
                    flex: 1,
                  }}
                >
                  {l.desc}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: T.white,
                      background: T.orange,
                      borderRadius: 4,
                      padding: "3px 8px 2px",
                    }}
                  >
                    {l.from}
                  </span>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: `2px solid ${active ? T.green : T.lightGrey}`,
                      background: T.white,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {active && (
                      <div
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: T.green,
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Stijl — revealed when lijn chosen */}
      {c.lijn && (
        <div>
          <Sep />
          <SH label="Stijl" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {stijlen.map((st) => (
              <Radio
                key={st.id}
                active={c.stijl === st.id}
                onClick={() => s((p) => ({ ...p, stijl: st.id }))}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 3,
                    }}
                  >
                    <span
                      style={{ fontSize: 13, fontWeight: 700, color: T.green }}
                    >
                      {st.name}
                    </span>
                    {st.delta > 0 && <PriceBadge delta={st.delta} />}
                  </div>
                  <span
                    style={{ fontSize: 11, color: T.grey, lineHeight: 1.5 }}
                  >
                    {st.note}
                  </span>
                </div>
              </Radio>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   STEP 2 — Afmetingen
═══════════════════════════════════════════ */
function Step2({ c, s }) {
  const lijn = c.lijn;

  return (
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: T.orange,
          textTransform: "uppercase",
          letterSpacing: ".1em",
          marginBottom: 5,
        }}
      >
        Stap 2 van 6
      </div>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: T.green,
          letterSpacing: "-.025em",
          marginBottom: 4,
        }}
      >
        Afmetingen & Fundering
      </h2>
      <p
        style={{
          fontSize: 13,
          color: T.grey,
          lineHeight: 1.6,
          marginBottom: 20,
        }}
      >
        Kies de breedte, diepte en funderingsoptie van uw terrasoverkapping.
        Prijzen zijn inclusief alle benodigde onderdelen.
      </p>

      {/* Breedte */}
      <SH label="Breedte" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 8,
          marginBottom: 18,
        }}
      >
        {BREEDTES.map((b) => {
          const active = c.breedte === b.id;
          const delta = b.delta[lijn] || 0;
          return (
            <button
              key={b.id}
              onClick={() => s((p) => ({ ...p, breedte: b.id }))}
              style={{
                padding: "10px 12px",
                border: `1.5px solid ${active ? T.lime : T.lightGrey}`,
                borderRadius: 8,
                background: active ? T.selectedBg : T.white,
                fontFamily: "inherit",
                cursor: "pointer",
                textAlign: "left",
                transition: "all .15s",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: T.green }}>
                {b.label}
              </div>
              {delta > 0 && (
                <div
                  style={{
                    fontSize: 11,
                    color: T.orange,
                    fontWeight: 600,
                    marginTop: 2,
                  }}
                >
                  +{fmtEur(delta)}
                </div>
              )}
              {delta === 0 && (
                <div
                  style={{
                    fontSize: 11,
                    color: T.lime,
                    fontWeight: 600,
                    marginTop: 2,
                  }}
                >
                  Basisprijs
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Breedte shortening info */}
      {lijn === "poly" && (
        <div style={{ marginBottom: 18 }}>
          <Note color={T.lime}>U kunt de breedte zelf inkorten.</Note>
        </div>
      )}
      {lijn === "glass" && (
        <div style={{ marginBottom: 18 }}>
          <Note color={T.midGrey}>
            Glasplaten kunnen op aanvraag worden ingekort via onze
            klantenservice.
          </Note>
        </div>
      )}
      {lijn === "heavy" && (
        <div style={{ marginBottom: 18 }}>
          <Note color={T.midGrey}>
            Heavy Duty wordt geleverd in standaardbreedten. Inkorten is niet
            mogelijk.
          </Note>
        </div>
      )}

      <Sep />

      {/* Diepte */}
      <SH label="Diepte" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 8,
          marginBottom: 18,
        }}
      >
        {DIEPTES.map((d) => {
          const active = c.diepte === d.id;
          const delta = d.delta[lijn] || 0;
          return (
            <button
              key={d.id}
              onClick={() => s((p) => ({ ...p, diepte: d.id }))}
              style={{
                padding: "10px 12px",
                border: `1.5px solid ${active ? T.lime : T.lightGrey}`,
                borderRadius: 8,
                background: active ? T.selectedBg : T.white,
                fontFamily: "inherit",
                cursor: "pointer",
                textAlign: "left",
                transition: "all .15s",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: T.green }}>
                {d.label}
              </div>
              {delta > 0 && (
                <div
                  style={{
                    fontSize: 11,
                    color: T.orange,
                    fontWeight: 600,
                    marginTop: 2,
                  }}
                >
                  +{fmtEur(delta)}
                </div>
              )}
              {delta === 0 && (
                <div
                  style={{
                    fontSize: 11,
                    color: T.lime,
                    fontWeight: 600,
                    marginTop: 2,
                  }}
                >
                  Basisprijs
                </div>
              )}
            </button>
          );
        })}
      </div>

      {lijn === "poly" && c.diepte !== "2500" && (
        <div style={{ marginBottom: 18 }}>
          <Note icon="warning" color={T.orange}>
            Let op: als u de diepte inkort, zijn glazen schuifwanden aan de
            zijkanten niet mogelijk. De glazen spie past dan niet meer.
          </Note>
        </div>
      )}

      <Sep />

      {/* Fundering */}
      <SH label="Fundering" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {FUNDERINGEN.map((f) => (
          <Radio
            key={f.id}
            active={c.fundering === f.id}
            onClick={() => s((p) => ({ ...p, fundering: f.id }))}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 3,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: T.green }}>
                  {f.name}
                </span>
                {f.delta > 0 && <PriceBadge delta={f.delta} />}
              </div>
              <span style={{ fontSize: 11, color: T.grey, lineHeight: 1.5 }}>
                {f.note}
              </span>
            </div>
          </Radio>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   STEP 3 — Dak & Kleur
═══════════════════════════════════════════ */
function Step3({ c, s }) {
  const lijn = c.lijn;
  // Kleur options depend on lijn + stijl
  const kleuren =
    lijn === "heavy" && c.stijl === "modern"
      ? KLEUREN.heavy_modern
      : KLEUREN.default;

  const setKleur = (id) => {
    const upsells = (KLEUR_UPSELLS[id] || []).map((u) => ({ ...u, qty: 0 }));
    s((p) => ({ ...p, kleur: id, kleurUpsells: upsells }));
  };

  const updateUpsellQty = (uid, qty) => {
    s((p) => ({
      ...p,
      kleurUpsells: p.kleurUpsells.map((u) =>
        u.id === uid ? { ...u, qty } : u,
      ),
    }));
  };

  return (
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: T.orange,
          textTransform: "uppercase",
          letterSpacing: ".1em",
          marginBottom: 5,
        }}
      >
        Stap 3 van 6
      </div>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: T.green,
          letterSpacing: "-.025em",
          marginBottom: 4,
        }}
      >
        Dak & Kleur
      </h2>
      <p
        style={{
          fontSize: 13,
          color: T.grey,
          lineHeight: 1.6,
          marginBottom: 20,
        }}
      >
        Kies het daktype en de kleur van uw terrasoverkapping. De gekozen kleur
        geldt voor het complete frame.
      </p>

      {/* Daktype — only for glass + heavy */}
      {lijn !== "poly" && (
        <div style={{ marginBottom: 22 }}>
          <SH label="Daktype" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {DAKTYPEN.map((d) => (
              <Radio
                key={d.id}
                active={c.daktype === d.id}
                onClick={() => s((p) => ({ ...p, daktype: d.id }))}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: T.green,
                      marginBottom: 3,
                    }}
                  >
                    {d.name}
                  </div>
                  <span
                    style={{ fontSize: 11, color: T.grey, lineHeight: 1.5 }}
                  >
                    {d.note}
                  </span>
                </div>
              </Radio>
            ))}
          </div>
          {lijn === "poly" && (
            <div style={{ marginTop: 10 }}>
              <Note color={T.midGrey}>
                Poly Line wordt standaard geleverd met een opaal polycarbonaat
                dak.
              </Note>
            </div>
          )}
          <Sep />
        </div>
      )}

      {lijn === "poly" && (
        <div style={{ marginBottom: 22 }}>
          <Note color={T.midGrey}>
            Poly Line heeft een opaal polycarbonaat dak. Dit geeft diffuus,
            zacht licht en is zelf inkortbaar op maat.
          </Note>
          <Sep />
        </div>
      )}

      {/* Kleur */}
      <SH label="Kleur" />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {kleuren.map((k) => (
          <button
            key={k.id}
            onClick={() => setKleur(k.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "12px 14px",
              border: `1.5px solid ${c.kleur === k.id ? T.lime : T.lightGrey}`,
              borderRadius: 8,
              background: c.kleur === k.id ? T.selectedBg : T.white,
              fontFamily: "inherit",
              cursor: "pointer",
              textAlign: "left",
              transition: "all .15s",
              boxShadow:
                c.kleur === k.id ? "0 2px 10px rgba(128,151,0,.1)" : "none",
            }}
          >
            {/* Color swatch */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                flexShrink: 0,
                background: k.hex,
                border: `1px solid ${T.lightGrey}`,
                boxShadow: "inset 0 1px 3px rgba(0,0,0,.1)",
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.green }}>
                {k.name}
              </div>
              <div style={{ fontSize: 11, color: T.grey, marginTop: 1 }}>
                {k.ral}
              </div>
            </div>
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: `2px solid ${c.kleur === k.id ? T.green : T.lightGrey}`,
                background: T.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {c.kleur === k.id && (
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: T.green,
                  }}
                />
              )}
            </div>
          </button>
        ))}
      </div>

      {lijn === "glass" && (
        <div>
          <Sep />
          <OptionGroup
            label="Inkort opties"
            options={GLASS_SHORTENING}
            value={c.inkortOptie}
            onChange={(id) => s((p) => ({ ...p, inkortOptie: id }))}
          />
          {c.inkortOptie === "custom" && (
            <SubPath title="Customized glass sub-configurator">
              <SelectGroup
                label="Glas zaagopties"
                options={GLASS_CUTTING_OPTIONS}
                value={c.glasZaagoptie}
                onChange={(id) => s((p) => ({ ...p, glasZaagoptie: id }))}
              />
              <OptionGroup
                label="Kies uw fundering"
                options={FUNDERINGEN}
                value={c.fundering}
                onChange={(id) => s((p) => ({ ...p, fundering: id }))}
              />
            </SubPath>
          )}
        </div>
      )}

      {/* Color-dependent inline upsells */}
      {c.kleur && c.kleurUpsells.length > 0 && (
        <div>
          <Sep />
          <SH label="Bijpassende onderhoudsmiddelen" />
          <p
            style={{
              fontSize: 12,
              color: T.grey,
              marginBottom: 12,
              lineHeight: 1.55,
            }}
          >
            Speciaal voor uw gekozen kleur. Handig voor kleine krassen of
            gebruiksschade.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {c.kleurUpsells.map((u) => (
              <UpsellCard
                key={u.id}
                name={u.name}
                price={u.price}
                qty={u.qty}
                onChange={(qty) => updateUpsellQty(u.id, qty)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   STEP 4 — Wanden & Schuifwanden
═══════════════════════════════════════════ */
function Step4({ c, s }) {
  const [openZone, setOpenZone] = useState("voor");
  const lijn = c.lijn;
  // If poly line with non-baseline depth, disable side sliding walls
  const polyDepthShortened = lijn === "poly" && c.diepte !== "2500";
  // If voorzijde has schuifwand, disable schoren
  const voorHasSchuif = c.voorzijde === "schuifwand";

  const voorzijdeOpts = VOORZIJDE.map((v) => {
    let disabled = false;
    let disabledNote = "";
    if (
      (v.id === "schoor_normaal" || v.id === "schoor_binnen") &&
      voorHasSchuif
    ) {
      disabled = true;
      disabledNote = "Niet combineerbaar met glazen schuifwanden.";
    }
    return { ...v, disabled, disabledNote };
  });

  const zijkantOpts = (side) =>
    ZIJKANT.map((z) => {
      let disabled = false;
      let disabledNote = "";
      if (z.id === "schuifwand" && polyDepthShortened) {
        disabled = true;
        disabledNote = "Niet mogelijk bij ingekorte diepte Poly Line.";
      }
      if (side === "rechts" && z.id === "schuifwand" && c.links !== "open") {
        disabled = true;
        disabledNote =
          "Niet beschikbaar nadat links al een zij-accessoire heeft.";
      }
      return { ...z, disabled, disabledNote };
    });

  const ZoneTab = ({ id, label, val }) => {
    const active = openZone === id;
    const hasChoice = val !== "open" && val !== "open";
    return (
      <button
        onClick={() => setOpenZone(id)}
        style={{
          flex: 1,
          padding: "10px 8px",
          border: "none",
          fontFamily: "inherit",
          cursor: "pointer",
          background: active ? "rgba(255,255,255,.15)" : "transparent",
          borderBottom: `3px solid ${active ? T.white : "transparent"}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          transition: "all .15s",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: active ? 800 : 500,
            color: active ? T.white : "rgba(255,255,255,.6)",
            textTransform: "uppercase",
            letterSpacing: ".05em",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: 9,
            color: active ? "rgba(255,255,255,.8)" : "rgba(255,255,255,.4)",
          }}
        >
          {val === "open"
            ? "Open"
            : VOORZIJDE.find((v) => v.id === val)?.name ||
              ZIJKANT.find((v) => v.id === val)?.name ||
              val}
        </span>
      </button>
    );
  };

  const renderOpts = (opts, field) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {opts.map((o) => (
        <Radio
          key={o.id}
          active={c[field] === o.id}
          disabled={o.disabled}
          onClick={() => !o.disabled && s((p) => ({ ...p, [field]: o.id }))}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 3,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: T.green }}>
                {o.name}
              </span>
              {o.delta > 0 && <PriceBadge delta={o.delta} />}
            </div>
            <span style={{ fontSize: 11, color: T.grey, lineHeight: 1.5 }}>
              {o.disabled ? o.disabledNote : o.note}
            </span>
          </div>
        </Radio>
      ))}
    </div>
  );

  const updateFrontWall = (field, value) => {
    s((p) => ({ ...p, frontWall: { ...p.frontWall, [field]: value } }));
  };

  const updateSideWall = (side, field, value) => {
    s((p) => ({
      ...p,
      sideWalls: {
        ...p.sideWalls,
        [side]: { ...p.sideWalls[side], [field]: value },
      },
    }));
  };

  const updateAluminiumWall = (side, field, value) => {
    s((p) => ({
      ...p,
      aluminiumWalls: {
        ...p.aluminiumWalls,
        [side]: { ...p.aluminiumWalls[side], [field]: value },
      },
    }));
  };

  const renderFrontGlassWallPath = () => (
    <SubPath title="Glazen schuifwanden voorzijde">
      <OptionGroup
        label="Kies uw afmeting"
        options={FRONT_GLASS_WALL.size}
        value={c.frontWall.size}
        onChange={(value) => updateFrontWall("size", value)}
        columns={2}
      />
      <OptionGroup
        label="Kies uw fundering"
        options={FRONT_GLASS_WALL.foundation}
        value={c.frontWall.foundation}
        onChange={(value) => updateFrontWall("foundation", value)}
      />
      <OptionGroup
        label="Kies uw accessoires"
        options={FRONT_GLASS_WALL.accessories}
        value={c.frontWall.accessories}
        onChange={(value) => updateFrontWall("accessories", value)}
      />
      {c.frontWall.accessories !== "steel_look" && (
        <OptionGroup
          label="Kies uw handgrepen"
          options={FRONT_GLASS_WALL.handles}
          value={c.frontWall.handles}
          onChange={(value) => updateFrontWall("handles", value)}
        />
      )}
      <OptionGroup
        label="Kies U-profielen"
        options={FRONT_GLASS_WALL.profiles}
        value={c.frontWall.profiles}
        onChange={(value) => updateFrontWall("profiles", value)}
      />
    </SubPath>
  );

  const renderSideGlassWallPath = (side) => (
    <SubPath
      title={`${side === "links" ? "Linker" : "Rechter"}zijkant glazen schuifwanden`}
    >
      <OptionGroup
        label="Kies uw afmetingen"
        options={SIDE_GLASS_WALL.size}
        value={c.sideWalls[side].size}
        onChange={(value) => updateSideWall(side, "size", value)}
        columns={2}
      />
      <OptionGroup
        label="Kies fundering schuifwand"
        options={SIDE_GLASS_WALL.foundation}
        value={c.sideWalls[side].foundation}
        onChange={(value) => updateSideWall(side, "foundation", value)}
      />
      <OptionGroup
        label="Kies accessoires glazen schuifwand"
        options={SIDE_GLASS_WALL.accessories}
        value={c.sideWalls[side].accessories}
        onChange={(value) => updateSideWall(side, "accessories", value)}
      />
      {c.sideWalls[side].accessories !== "steel_look" && (
        <OptionGroup
          label="Kies uw handgrepen"
          options={SIDE_GLASS_WALL.handles}
          value={c.sideWalls[side].handles}
          onChange={(value) => updateSideWall(side, "handles", value)}
        />
      )}
      <OptionGroup
        label="Kies U-profielen"
        options={SIDE_GLASS_WALL.profiles}
        value={c.sideWalls[side].profiles}
        onChange={(value) => updateSideWall(side, "profiles", value)}
      />
    </SubPath>
  );

  const renderAluminiumWallPath = (side) => (
    <SubPath
      title={`${side === "links" ? "Linker" : "Rechter"}zijkant aluminium zijwand`}
    >
      <OptionGroup
        label="Paneelkleur aluminium zijwand"
        options={ALUMINIUM_SIDE_WALL.panelColor}
        value={c.aluminiumWalls[side].panelColor}
        onChange={(value) => updateAluminiumWall(side, "panelColor", value)}
      />
      <OptionGroup
        label="Kies hoogte zijwand"
        options={ALUMINIUM_SIDE_WALL.height}
        value={c.aluminiumWalls[side].height}
        onChange={(value) => updateAluminiumWall(side, "height", value)}
      />
      <OptionGroup
        label="Kies aluminium zijwand fundering"
        options={ALUMINIUM_SIDE_WALL.foundation}
        value={c.aluminiumWalls[side].foundation}
        onChange={(value) => updateAluminiumWall(side, "foundation", value)}
      />
    </SubPath>
  );

  return (
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: T.orange,
          textTransform: "uppercase",
          letterSpacing: ".1em",
          marginBottom: 5,
        }}
      >
        Stap 4 van 6
      </div>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: T.green,
          letterSpacing: "-.025em",
          marginBottom: 4,
        }}
      >
        Wanden & Schuifwanden
      </h2>
      <p
        style={{
          fontSize: 13,
          color: T.grey,
          lineHeight: 1.6,
          marginBottom: 20,
        }}
      >
        Kies hoe u de voorzijde en zijkanten van uw terrasoverkapping wilt
        afschermen. U kunt elke zijde afzonderlijk configureren.
      </p>

      {/* Zone tabs — green bar */}
      <div style={{ background: T.green, borderRadius: 8, marginBottom: 16 }}>
        <div style={{ display: "flex", padding: "6px 6px 0" }}>
          <ZoneTab id="voor" label="Voorzijde" val={c.voorzijde} />
          <ZoneTab id="links" label="Links" val={c.links} />
          <ZoneTab id="rechts" label="Rechts" val={c.rechts} />
        </div>
      </div>

      {openZone === "voor" && (
        <div>
          <SH label="Voorzijde overkapping" />
          {renderOpts(voorzijdeOpts, "voorzijde")}
          {c.voorzijde === "schuifwand" && renderFrontGlassWallPath()}
        </div>
      )}
      {openZone === "links" && (
        <div>
          <SH label="Linkerzijkant terrasoverkapping" />
          {renderOpts(zijkantOpts("links"), "links")}
          {c.links === "schuifwand" && renderSideGlassWallPath("links")}
          {c.links === "aluminium" && renderAluminiumWallPath("links")}
        </div>
      )}
      {openZone === "rechts" && (
        <div>
          <SH label="Rechterzijkant terrasoverkapping" />
          {renderOpts(zijkantOpts("rechts"), "rechts")}
          {c.rechts === "schuifwand" && renderSideGlassWallPath("rechts")}
          {c.rechts === "aluminium" && renderAluminiumWallPath("rechts")}
          {openZone === "rechts" && (
            <div
              style={{
                marginTop: 10,
                fontSize: 11,
                color: T.grey,
                lineHeight: 1.5,
              }}
            >
              Dezelfde opties als links. Een polycarbonaat spie aan de
              rechterzijkant vermindert ook het inkijken van buren.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   STEP 5 — Extras
═══════════════════════════════════════════ */
function Step5({ c, s }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: T.orange,
          textTransform: "uppercase",
          letterSpacing: ".1em",
          marginBottom: 5,
        }}
      >
        Stap 5 van 6
      </div>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: T.green,
          letterSpacing: "-.025em",
          marginBottom: 4,
        }}
      >
        Extra's & Accessoires
      </h2>
      <p
        style={{
          fontSize: 13,
          color: T.grey,
          lineHeight: 1.6,
          marginBottom: 20,
        }}
      >
        Breid uw terrasoverkapping uit met comfort- en kwaliteitsopties. U kunt
        alles ook later toevoegen.
      </p>

      {/* Zonwering */}
      <SH label="Zonwering" />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 22,
        }}
      >
        {ZONWERING.map((z) => (
          <Radio
            key={z.id}
            active={c.zonwering === z.id}
            onClick={() => s((p) => ({ ...p, zonwering: z.id }))}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: z.note ? 3 : 0,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: T.green }}>
                  {z.name}
                </span>
                {z.delta > 0 && <PriceBadge delta={z.delta} />}
              </div>
              {z.note && (
                <span style={{ fontSize: 11, color: T.grey, lineHeight: 1.5 }}>
                  {z.note}
                </span>
              )}
            </div>
          </Radio>
        ))}
        {c.lijn === "glass" &&
          c.diepte !== "2500" &&
          c.zonwering === "gumax" && (
            <Note icon="warning" color={T.orange}>
              Als u de breedte heeft laten inkorten, is zonwering voor ingekorte
              dakplaten niet mogelijk.
            </Note>
          )}
      </div>

      <Sep />

      {/* Verlichting */}
      <SH label="Verlichting" />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: c.verlichting === "ledspot" ? 12 : 22,
        }}
      >
        {VERLICHTING.map((v) => (
          <Radio
            key={v.id}
            active={c.verlichting === v.id}
            onClick={() =>
              s((p) => ({ ...p, verlichting: v.id, ledspotUpsell: false }))
            }
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: v.note ? 3 : 0,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: T.green }}>
                  {v.name}
                </span>
                {v.delta > 0 && <PriceBadge delta={v.delta} />}
              </div>
              {v.note && (
                <span style={{ fontSize: 11, color: T.grey, lineHeight: 1.5 }}>
                  {v.note}
                </span>
              )}
            </div>
          </Radio>
        ))}
      </div>

      {/* Ledspot upsell — inline when selected */}
      {c.verlichting === "ledspot" && (
        <div style={{ marginBottom: 22 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 14px",
              border: `1.5px solid ${c.ledspotUpsell ? T.lime : T.lightGrey}`,
              borderRadius: 8,
              background: c.ledspotUpsell ? T.selectedBg : T.white,
              transition: "all .15s",
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: T.green,
                  marginBottom: 2,
                }}
              >
                {LEDSPOT_UPSELL.name}
              </div>
              <div style={{ fontSize: 12, color: T.grey }}>
                {fmtEur(LEDSPOT_UPSELL.price)} — aanbevolen bij ledspots
              </div>
            </div>
            {/* Toggle checkbox */}
            <button
              onClick={() =>
                s((p) => ({ ...p, ledspotUpsell: !p.ledspotUpsell }))
              }
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                flexShrink: 0,
                border: `2px solid ${c.ledspotUpsell ? T.lime : T.lightGrey}`,
                background: c.ledspotUpsell ? T.lime : T.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all .15s",
                fontFamily: "inherit",
              }}
            >
              {c.ledspotUpsell && (
                <Icon name="check" size={11} color={T.white} />
              )}
            </button>
          </div>
        </div>
      )}

      <Sep />

      {/* Bladvanger */}
      <SH label="Goot bladvanger" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {BLADVANGER.map((b) => (
          <Radio
            key={b.id}
            active={c.bladvanger === b.id}
            onClick={() => s((p) => ({ ...p, bladvanger: b.id }))}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: b.note ? 3 : 0,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: T.green }}>
                  {b.name}
                </span>
                {b.delta > 0 && <PriceBadge delta={b.delta} />}
              </div>
              {b.note && (
                <span style={{ fontSize: 11, color: T.grey, lineHeight: 1.5 }}>
                  {b.note}
                </span>
              )}
            </div>
          </Radio>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   STEP 6 — Overzicht & Bestellen
═══════════════════════════════════════════ */
function optionName(options, id) {
  return options.find((option) => option.id === id)?.name;
}

function glassWallSummary(options, values) {
  const handles =
    values.accessories === "steel_look"
      ? "handgrepen overgeslagen"
      : optionName(options.handles, values.handles);
  return [
    optionName(options.size, values.size),
    optionName(options.foundation, values.foundation),
    optionName(options.accessories, values.accessories),
    handles,
    optionName(options.profiles, values.profiles),
  ]
    .filter(Boolean)
    .join(" / ");
}

function aluminiumWallSummary(values) {
  return [
    optionName(ALUMINIUM_SIDE_WALL.panelColor, values.panelColor),
    optionName(ALUMINIUM_SIDE_WALL.height, values.height),
    optionName(ALUMINIUM_SIDE_WALL.foundation, values.foundation),
  ]
    .filter(Boolean)
    .join(" / ");
}

function Step6({ c, s, onGoStep, price }) {
  const lijn = LIJNEN.find((l) => l.id === c.lijn);
  const stijl = STIJLEN[c.lijn]?.find((st) => st.id === c.stijl);
  const breedte = BREEDTES.find((b) => b.id === c.breedte);
  const diepte = DIEPTES.find((d) => d.id === c.diepte);
  const fundering = FUNDERINGEN.find((f) => f.id === c.fundering);
  const kleur = (
    c.lijn === "heavy" && c.stijl === "modern"
      ? KLEUREN.heavy_modern
      : KLEUREN.default
  ).find((k) => k.id === c.kleur);
  const daktype = DAKTYPEN.find((d) => d.id === c.daktype);
  const shortening = GLASS_SHORTENING.find(
    (option) => option.id === c.inkortOptie,
  );
  const voorzijde = VOORZIJDE.find((v) => v.id === c.voorzijde);
  const links = ZIJKANT.find((z) => z.id === c.links);
  const rechts = ZIJKANT.find((z) => z.id === c.rechts);
  const zonwering = ZONWERING.find((z) => z.id === c.zonwering);
  const verlichting = VERLICHTING.find((v) => v.id === c.verlichting);
  const bladvanger = BLADVANGER.find((b) => b.id === c.bladvanger);

  const Row = ({ label, value, step }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 0",
        borderBottom: `1px solid ${T.lightGrey}`,
      }}
    >
      <button
        onClick={() => onGoStep(step)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: 12,
          color: T.grey,
          fontWeight: 500,
          padding: 0,
          textDecoration: "underline",
          textDecorationColor: `${T.lime}80`,
          textUnderlineOffset: "3px",
          textAlign: "left",
        }}
      >
        {label}
      </button>
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: T.green,
          textAlign: "right",
          maxWidth: "55%",
        }}
      >
        {value}
      </span>
    </div>
  );

  const updateUpsellQty = (uid, qty) => {
    s((p) => ({
      ...p,
      overzichtUpsells: p.overzichtUpsells.map((u) =>
        u.id === uid ? { ...u, qty } : u,
      ),
    }));
  };

  return (
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: T.orange,
          textTransform: "uppercase",
          letterSpacing: ".1em",
          marginBottom: 5,
        }}
      >
        Stap 6 van 6
      </div>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: T.green,
          letterSpacing: "-.025em",
          marginBottom: 4,
        }}
      >
        Overzicht & Bestellen
      </h2>
      <p
        style={{
          fontSize: 13,
          color: T.grey,
          lineHeight: 1.6,
          marginBottom: 20,
        }}
      >
        Controleer uw configuratie. Klik op een keuze om deze aan te passen.
      </p>

      {/* Summary sections */}
      <div
        style={{
          border: `1px solid ${T.lightGrey}`,
          borderRadius: 8,
          overflow: "hidden",
          marginBottom: 16,
        }}
      >
        <div style={{ background: T.green, padding: "9px 14px" }}>
          <h3
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: T.white,
              textTransform: "uppercase",
              letterSpacing: ".07em",
              margin: 0,
            }}
          >
            Uw configuratie
          </h3>
        </div>
        <div style={{ padding: "0 14px" }}>
          <Row label="Productlijn" value={lijn?.name} step={0} />
          <Row label="Stijl" value={stijl?.name} step={0} />
          <Row label="Breedte" value={breedte?.label} step={1} />
          <Row label="Diepte" value={diepte?.label} step={1} />
          <Row label="Fundering" value={fundering?.name} step={1} />
          {c.lijn !== "poly" && (
            <Row label="Daktype" value={daktype?.name} step={2} />
          )}
          <Row
            label="Kleur"
            value={`${kleur?.name} ${kleur?.ral || ""}`}
            step={2}
          />
          {c.lijn === "glass" && (
            <Row label="Inkort opties" value={shortening?.name} step={2} />
          )}
          {c.lijn === "glass" && c.inkortOptie === "custom" && (
            <Row label="Glas zaagopties" value={c.glasZaagoptie} step={2} />
          )}
          <Row label="Voorzijde" value={voorzijde?.name} step={3} />
          {c.voorzijde === "schuifwand" && (
            <Row
              label="Voorzijde pad"
              value={glassWallSummary(FRONT_GLASS_WALL, c.frontWall)}
              step={3}
            />
          )}
          <Row label="Linkerzijkant" value={links?.name} step={3} />
          {c.links === "schuifwand" && (
            <Row
              label="Linkerzijde pad"
              value={glassWallSummary(SIDE_GLASS_WALL, c.sideWalls.links)}
              step={3}
            />
          )}
          {c.links === "aluminium" && (
            <Row
              label="Linkerzijde pad"
              value={aluminiumWallSummary(c.aluminiumWalls.links)}
              step={3}
            />
          )}
          <Row label="Rechterzijkant" value={rechts?.name} step={3} />
          {c.rechts === "schuifwand" && (
            <Row
              label="Rechterzijde pad"
              value={glassWallSummary(SIDE_GLASS_WALL, c.sideWalls.rechts)}
              step={3}
            />
          )}
          {c.rechts === "aluminium" && (
            <Row
              label="Rechterzijde pad"
              value={aluminiumWallSummary(c.aluminiumWalls.rechts)}
              step={3}
            />
          )}
          <Row label="Zonwering" value={zonwering?.name} step={4} />
          <Row label="Verlichting" value={verlichting?.name} step={4} />
          <Row label="Bladvanger" value={bladvanger?.name} step={4} />
          {c.ledspotUpsell && (
            <Row
              label="Afstandsbediening"
              value={`${LEDSPOT_UPSELL.name} — ${fmtEur(LEDSPOT_UPSELL.price)}`}
              step={4}
            />
          )}
          {c.kleurUpsells
            .filter((u) => u.qty > 0)
            .map((u) => (
              <Row
                key={u.id}
                label={u.name}
                value={`${u.qty}× ${fmtEur(u.price)}`}
                step={2}
              />
            ))}
        </div>
      </div>

      {/* Overzicht upsells */}
      <div style={{ marginBottom: 20 }}>
        <SH label="Aanvullende producten" />
        <p
          style={{
            fontSize: 12,
            color: T.grey,
            marginBottom: 12,
            lineHeight: 1.55,
          }}
        >
          Handige toevoegingen. Niet verplicht — voeg toe naar behoefte.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {c.overzichtUpsells.map((u) => (
            <UpsellCard
              key={u.id}
              name={u.name}
              price={u.price}
              qty={u.qty}
              onChange={(qty) => updateUpsellQty(u.id, qty)}
            />
          ))}
        </div>
      </div>

      {/* Total price */}
      <div
        style={{
          border: `2px solid ${T.lime}`,
          borderRadius: 8,
          padding: "14px 16px",
          background: T.selectedBg,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 700, color: T.green }}>
          Totaalprijs incl. BTW
        </span>
        <span style={{ fontSize: 20, fontWeight: 800, color: T.orange }}>
          {fmtEur(price)}
        </span>
      </div>

      {/* CTAs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button
          style={{
            background: T.lime,
            color: T.white,
            border: "none",
            borderBottom: `4px solid ${T.limeDark}`,
            borderRadius: 4,
            padding: "12px 24px 8px",
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "inherit",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            width: "100%",
          }}
        >
          <Icon name="cart" size={16} color={T.white} />
          Toevoegen aan winkelwagen
        </button>
        {price >= 3000 && (
          <button
            style={{
              background: "transparent",
              color: T.green,
              border: `1.5px solid ${T.green}`,
              borderRadius: 4,
              padding: "10px 24px",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
            }}
          >
            <Icon name="mail" size={14} color={T.green} />
            Vrijblijvende offerte aanvragen
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TMX LOGO
═══════════════════════════════════════════ */
function TMXLogo({ height = 30 }) {
  const w = Math.round(height * (74 / 46));
  return (
    <svg
      width={w}
      height={height}
      viewBox="0 0 74 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#cl)">
        <path
          d="M8.2679 10.1281H10.025V32.1229H8.04809V12.0637H0L24.2542 0.0385728L25.1292 1.76884L8.2679 10.1281ZM65.0497 10.0896H63.2913V45.4113H64.4891V12.0251H73.3162L49.0635 0L48.1884 1.73027L65.0497 10.0896ZM16.9685 34.7624C15.8082 37.5934 14.5297 40.4299 13.4585 43.2966C12.3886 40.4312 11.1087 37.5934 9.94847 34.7624H8.0467V45.4126H9.37669V40.3679C9.41286 38.9696 9.25983 37.5713 9.30156 36.1731C9.81909 37.552 10.3714 38.9186 10.9613 40.2701C11.6916 41.9838 12.422 43.6989 13.1538 45.4126H13.7604C14.4921 43.6989 15.2225 41.9838 15.9529 40.2701C16.5428 38.9186 17.0951 37.552 17.6126 36.1731C17.6543 37.5713 17.5013 38.9696 17.5375 40.3679V45.4126H18.8661V34.7624H16.9657H16.9685ZM25.8763 40.2756V45.4126H24.8274L24.6841 44.5888C24.0886 45.2515 23.3763 45.6055 22.2954 45.6C21.5177 45.6041 20.9751 45.425 20.4896 44.9842C19.4824 43.9951 19.5366 42.0582 20.772 41.2716C21.9197 40.5346 23.3833 40.7384 24.6242 41.1104C24.6131 40.5649 24.7202 39.9463 24.3599 39.4821C23.9523 38.9214 23.2163 38.7161 22.5472 38.7382C21.8349 38.7175 21.1435 38.9159 20.4729 39.128V38.0879C21.5678 37.6636 22.8032 37.5149 23.9495 37.8207C24.5783 37.9887 25.1654 38.3607 25.5188 38.9104C25.7901 39.3085 25.8819 39.8003 25.8735 40.2742M24.6256 42.0968C23.7033 41.8956 22.6905 41.6394 21.782 42.0224C20.9403 42.3916 20.8791 43.6397 21.5052 44.232C21.9837 44.626 22.671 44.6481 23.2442 44.4745C23.7533 44.3106 24.2277 44.024 24.6075 43.6507C24.6632 43.1368 24.6187 42.6147 24.627 42.0981M54.9844 40.2756V45.4126H53.9368L53.7935 44.5888C53.1995 45.2515 52.4858 45.6055 51.4048 45.6C50.6272 45.6041 50.0846 45.425 49.5991 44.9842C48.5918 43.9951 48.6461 42.0582 49.8815 41.2716C51.0292 40.5346 52.4928 40.7384 53.7337 41.1104C53.7226 40.5649 53.8311 39.9463 53.4694 39.4821C53.0618 38.9214 52.3258 38.7161 51.6566 38.7382C50.9444 38.7175 50.2529 38.9159 49.5824 39.128V38.0879C50.6772 37.6636 51.9126 37.5149 53.0604 37.8207C53.6892 37.9887 54.2763 38.3607 54.6296 38.9104C54.9009 39.3085 54.9927 39.8003 54.9844 40.2742M53.7337 42.0968C52.8113 41.8956 51.7985 41.6394 50.8901 42.0224C50.0484 42.3916 49.9872 43.6397 50.6132 44.232C51.0918 44.626 51.7791 44.6481 52.3522 44.4745C52.8614 44.3106 53.3358 44.024 53.7142 43.6507C53.7699 43.1368 53.7254 42.6147 53.7337 42.0981M62.2061 40.2756V45.4126H61.1572L61.0152 44.5888C60.4198 45.2515 59.7075 45.6055 58.6266 45.6C57.8489 45.6041 57.3063 45.425 56.8208 44.9842C55.8136 43.9951 55.8678 42.0582 57.1032 41.2716C58.2509 40.5346 59.7145 40.7384 60.9554 41.1104C60.9443 40.5649 61.0528 39.9463 60.6911 39.4821C60.2835 38.9214 59.5475 38.7161 58.8784 38.7382C58.1661 38.7175 57.4746 38.9159 56.8041 39.128V38.0879C57.899 37.6636 59.1343 37.5149 60.2821 37.8207C60.9109 37.9887 61.498 38.3607 61.8514 38.9104C62.1226 39.3085 62.2145 39.8003 62.2061 40.2742M60.9554 42.0968C60.0331 41.8956 59.0203 41.6394 58.1118 42.0224C57.2701 42.3916 57.2089 43.6397 57.835 44.232C58.3135 44.626 59.0008 44.6481 59.574 44.4745C60.0831 44.3106 60.5575 44.024 60.9373 43.6507C60.993 43.1368 60.9485 42.6147 60.9568 42.0981M39.748 37.7353C39.0134 37.8799 38.3888 38.3524 37.9325 38.9255L37.7043 37.8813H36.7235V45.4126H37.9881V40.0662C38.3874 39.427 39.0343 38.8869 39.7981 38.7519C40.2182 38.7079 40.6801 38.7079 41.0418 38.9558C41.5148 39.2493 41.704 39.8347 41.6957 40.3637V45.4126H42.9533V40.1915C42.9533 40.0662 43.0201 39.9697 43.0882 39.8761C43.5696 39.2616 44.2694 38.7299 45.0888 38.7327C45.5507 38.6968 46.0376 38.858 46.3409 39.2134C46.6289 39.5868 46.697 40.0717 46.7193 40.5277V45.4113H47.9324L47.9296 40.1144C47.9533 39.2258 47.4789 38.2767 46.6261 37.9185C45.7343 37.5217 44.645 37.5851 43.8158 38.1045C43.3804 38.3869 43.0354 38.7767 42.7057 39.1693C42.5471 38.9062 42.4024 38.6293 42.1881 38.4062C41.6011 37.727 40.598 37.5328 39.7466 37.7339M33.5474 45.4223L30.6579 41.5746L33.4514 37.8827H32.0741L30.0332 40.7426L27.8838 37.8813H26.5065L29.3001 41.576L26.4105 45.4237L27.7544 45.414L29.9358 42.4177L32.2021 45.414L33.546 45.4237L33.5474 45.4223ZM35.5382 37.8813H34.2875V45.4223H35.5382V37.8813ZM35.5382 34.7376H34.2875V36.0959H35.5382V34.7376ZM33.7032 12.9811V31.9989H36.1211V12.9811H33.7032ZM40.4811 12.9811V31.9989H42.8323C42.8323 28.4296 42.8378 24.8588 42.8309 21.2895C42.8476 20.0042 42.7557 18.723 42.7279 17.4377C42.7043 17.0189 42.6292 16.6001 42.6723 16.1799C42.9074 16.4486 43.0785 16.7627 43.2774 17.0575C44.7243 19.2685 46.2421 21.4355 47.7835 23.5845C49.7785 26.3907 51.7693 29.1941 53.7671 31.9989H56.1141V12.9825H53.756L53.7588 24.2926C53.7685 24.7913 53.749 25.2928 53.8158 25.7873C53.8464 26.4045 53.8255 27.023 53.8645 27.6402C53.9146 28.0149 53.9382 28.3938 53.9201 28.7712C53.806 28.65 53.6975 28.5274 53.6099 28.3882C51.8932 25.7267 50.0623 23.141 48.219 20.5648C46.4243 18.0383 44.62 15.5118 42.8295 12.9825H40.4797L40.4811 12.9811ZM27.0282 12.9811V25.0365C26.967 26.0808 26.8223 27.1622 26.2784 28.0797C25.7622 28.9903 24.8941 29.7052 23.8841 30.0152C23.2289 30.2218 22.543 30.3072 21.8571 30.3031C21.1713 30.3072 20.4854 30.2218 19.8302 30.0152C18.8202 29.7052 17.952 28.9903 17.4359 28.0797C16.892 27.1622 16.7487 26.0808 16.6861 25.0365V12.9811H14.3781V25.1192C14.3683 26.1014 14.5074 27.085 14.8163 28.019C15.2142 29.2272 15.9515 30.3444 17.0102 31.0815C18.2734 31.9493 19.8274 32.3199 21.348 32.3461C21.5177 32.3502 21.6874 32.3516 21.8571 32.3516C22.0269 32.3516 22.1966 32.3502 22.3663 32.3461C23.8869 32.3199 25.4409 31.9493 26.7041 31.0815C27.7628 30.3444 28.5001 29.2272 28.898 28.019C29.2069 27.085 29.346 26.1014 29.3348 25.1192V12.9811H27.0282Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="cl">
          <rect width="73.3176" height="45.6" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

/* ═══════════════════════════════════════════
   STEP BAR
═══════════════════════════════════════════ */
const STEPS = [
  "Productlijn & Stijl",
  "Afmetingen",
  "Dak & Kleur",
  "Wanden",
  "Extra's",
  "Overzicht",
];

function StepBar({ step, maxReached, onGo }) {
  const ref = useRef(null);
  const [fadeL, setFL] = useState(false);
  const [fadeR, setFR] = useState(false);
  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setFL(el.scrollLeft > 3);
    setFR(el.scrollLeft < el.scrollWidth - el.clientWidth - 3);
  }, []);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, [measure]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.querySelectorAll("[data-step]")[step]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [step]);

  return (
    <div
      style={{
        background: T.green,
        flexShrink: 0,
        display: "flex",
        alignItems: "stretch",
        boxShadow: "0 2px 8px rgba(0,0,0,.18)",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          padding: "0 16px 0 18px",
          borderRight: "1px solid rgba(255,255,255,.1)",
        }}
      >
        <TMXLogo height={30} />
      </div>
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {fadeL && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 32,
              zIndex: 3,
              background: `linear-gradient(to right,${T.green},transparent)`,
              pointerEvents: "none",
            }}
          />
        )}
        {fadeR && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 32,
              zIndex: 3,
              background: `linear-gradient(to left,${T.green},transparent)`,
              pointerEvents: "none",
            }}
          />
        )}
        <div
          ref={ref}
          style={{
            display: "flex",
            alignItems: "center",
            overflowX: "auto",
            scrollbarWidth: "none",
            padding: "6px 8px",
            gap: 2,
          }}
        >
          {STEPS.map((label, i) => {
            const done = i < step,
              active = i === step,
              can = i <= maxReached,
              future = !can;
            return (
              <button
                key={i}
                data-step={i}
                onClick={() => can && onGo(i)}
                disabled={!can}
                aria-current={active ? "step" : undefined}
                style={{
                  flex: "0 0 auto",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  padding: active ? "6px 12px 7px" : "6px 10px 7px",
                  minWidth: 50,
                  minHeight: 44,
                  border: "none",
                  fontFamily: "inherit",
                  cursor: can ? "pointer" : "not-allowed",
                  borderRadius: 6,
                  transition: "all .18s",
                  background: active ? "rgba(255,255,255,.95)" : "transparent",
                  boxShadow: active ? "0 1px 8px rgba(0,0,0,.22)" : "none",
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9,
                    fontWeight: 800,
                    flexShrink: 0,
                    boxSizing: "border-box",
                    background: active
                      ? T.green
                      : done
                        ? T.lime
                        : "transparent",
                    border:
                      active || done
                        ? "none"
                        : can
                          ? "2px solid rgba(255,255,255,.65)"
                          : "2px solid rgba(255,255,255,.2)",
                    color: active ? T.white : T.white,
                  }}
                >
                  {done ? (
                    <Icon name="check" size={11} color={T.white} />
                  ) : (
                    <span
                      style={{
                        lineHeight: 1,
                        color: active
                          ? T.white
                          : can
                            ? "rgba(255,255,255,.8)"
                            : "rgba(255,255,255,.28)",
                      }}
                    >
                      {i + 1}
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontSize: 8,
                    fontWeight: active ? 800 : done ? 600 : can ? 500 : 400,
                    whiteSpace: "nowrap",
                    textTransform: "uppercase",
                    letterSpacing: ".05em",
                    color: active
                      ? T.green
                      : done
                        ? "rgba(255,255,255,.75)"
                        : can
                          ? "rgba(255,255,255,.6)"
                          : "rgba(255,255,255,.25)",
                  }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   FOOTER NAV
═══════════════════════════════════════════ */
function Footer({ step, price, canNext, onBack, onNext, isFinal }) {
  return (
    <div
      style={{
        flexShrink: 0,
        background: T.white,
        borderTop: `1px solid ${T.lightGrey}`,
        padding: "12px 18px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      {/* Back */}
      <button
        onClick={onBack}
        disabled={step === 0}
        style={{
          background: "transparent",
          border: `1.5px solid ${step === 0 ? T.lightGrey : T.lightGrey}`,
          borderRadius: 4,
          padding: "9px 14px",
          fontSize: 13,
          fontWeight: 700,
          color: step === 0 ? T.lightGrey : T.grey,
          fontFamily: "inherit",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 5,
          cursor: step === 0 ? "not-allowed" : "pointer",
        }}
      >
        <Icon
          name="arrow-left"
          size={14}
          color={step === 0 ? T.lightGrey : T.grey}
        />
        Terug
      </button>

      {/* Price */}
      <div style={{ flex: 1, textAlign: "center" }}>
        {price > 0 ? (
          <div>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: T.midGrey,
                textTransform: "uppercase",
                letterSpacing: ".07em",
              }}
            >
              Totaalprijs
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: T.orange }}>
              {fmtEur(price)}
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 11, color: T.midGrey, fontStyle: "italic" }}>
            Kies een productlijn
          </div>
        )}
      </div>

      {/* Next / Cart */}
      {!isFinal ? (
        <button
          onClick={onNext}
          disabled={!canNext}
          style={{
            background: canNext ? T.lime : "#c8d89a",
            color: T.white,
            border: "none",
            borderBottom: `4px solid ${canNext ? T.limeDark : "#aab87a"}`,
            borderRadius: 4,
            padding: "12px 22px 8px",
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "inherit",
            cursor: canNext ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexShrink: 0,
            transition: "background .15s",
          }}
        >
          Volgende <Icon name="arrow-right" size={14} color={T.white} />
        </button>
      ) : (
        <button
          style={{
            background: T.lime,
            color: T.white,
            border: "none",
            borderBottom: `4px solid ${T.limeDark}`,
            borderRadius: 4,
            padding: "12px 18px 8px",
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "inherit",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexShrink: 0,
          }}
        >
          <Icon name="cart" size={14} color={T.white} />
          In winkelwagen
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════ */
export default function App() {
  const [cfg, setCfg] = useState(INIT);
  const [step, setStep] = useState(0);
  const [maxR, setMaxR] = useState(0);
  const topRef = useRef(null);

  const price = useMemo(() => calcPrice(cfg), [cfg]);

  const goStep = useCallback((n) => {
    setStep(n);
    setMaxR((m) => Math.max(m, n));
    setTimeout(
      () => topRef.current?.scrollTo({ top: 0, behavior: "smooth" }),
      50,
    );
  }, []);

  const canNext = useMemo(() => {
    switch (step) {
      case 0:
        return !!(cfg.lijn && cfg.stijl);
      case 1:
        return !!(cfg.breedte && cfg.diepte && cfg.fundering);
      case 2:
        return !!(cfg.kleur && (cfg.lijn === "poly" || cfg.daktype));
      case 3:
        return !!(cfg.voorzijde && cfg.links && cfg.rechts);
      case 4:
        return true;
      case 5:
        return true;
      default:
        return true;
    }
  }, [step, cfg]);

  const CSS = `
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html,body{height:100%;font-family:'ArticulatCF','Inter',sans-serif;color:${T.green};-webkit-font-smoothing:antialiased}
    button{font-family:'ArticulatCF','Inter',sans-serif}
    ::-webkit-scrollbar{display:none}
    @media(max-width:540px){.hide-xs{display:none!important}}
  `;

  const renderStep = () => {
    switch (step) {
      case 0:
        return <Step1 c={cfg} s={setCfg} />;
      case 1:
        return <Step2 c={cfg} s={setCfg} />;
      case 2:
        return <Step3 c={cfg} s={setCfg} />;
      case 3:
        return <Step4 c={cfg} s={setCfg} />;
      case 4:
        return <Step5 c={cfg} s={setCfg} />;
      case 5:
        return <Step6 c={cfg} s={setCfg} onGoStep={goStep} price={price} />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: T.beige,
      }}
    >
      <style>{CSS}</style>
      <StepBar step={step} maxReached={maxR} onGo={goStep} />
      <div ref={topRef} style={{ flex: 1, overflowY: "auto" }}>
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            padding: "28px 18px 120px",
          }}
        >
          {renderStep()}
        </div>
      </div>
      <Footer
        step={step}
        price={price}
        canNext={canNext}
        isFinal={step === 5}
        onBack={() => step > 0 && goStep(step - 1)}
        onNext={() => canNext && step < 5 && goStep(step + 1)}
      />
    </div>
  );
}
