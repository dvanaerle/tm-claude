// @ts-nocheck
import { useState, useRef, useEffect, useCallback } from "react";

const T = {
  // primary
  darkGreen:"#001A13", green:"#003017",     medGreen:"#002E21",
  orange:"#FF8000",    lime:"#809700",       limeDark:"#6D8005",
  limeSecond:"#8BA407",
  blue:"#80A5E4",      yellow:"#FFCB00",
  red:"#FF4D4D",       black:"#11171F",      brown:"#8A7B6C",
  // secondary
  sand:"#F5E6D7",      beige:"#FFF5ED",      bone:"#E0D2C5",
  // neutral
  grey:"#636363",      midGrey:"#878787",    lightGrey:"#E3E3E3",
  white:"#FFFFFF",     darkGrey:"#151A1F",
  // selected card bg — tint of lime, used for all selected states
  selectedBg:"#f0f7e8",
};

const O_BASE = { poly:799, glass:1151, heavy:1534 };
const O_DM   = { "2.5":1.00,"3.0":1.14,"3.5":1.28,"4.0":1.44 };
const O_WM   = { "3.06":1.00,"4.06":1.26,"5.06":1.55,"6.06":1.86,"7.06":2.18,"8.06":2.52,"9.06":2.88,"10.06":3.26,"11.06":3.66,"12.06":4.08 };
const BREEDTES = ["3.06","4.06","5.06","6.06","7.06","8.06","9.06","10.06","11.06","12.06"];
const SW_BP  = { 1:349,2:589,3:829,4:1069,5:1309,6:1549 };
const SW_HA  = { "1980":0,"2080":0,"2180":40,"2280":80,"2380":120,"2480":160,"2580":200,"2680":240,"2720":280 };

function calcPrice(c) {
  // Only calculate once a productlijn is chosen
  if (!c.lijn) return 0;
  const lijn    = c.lijn;
  const diepte  = c.diepte  || "3.0";
  const breedte = c.breedte || "3.06";
  const ob = O_BASE[lijn] * O_DM[diepte] * O_WM[breedte];
  const oe = (c.led==="spots"?173:c.led==="system"?289:0)
           + (c.zonwering==="auto"?897:0)
           + (c.fundering==="plain"?54:c.fundering==="hwa"?98:0);
  let sw=0;
  if(c.swVoor){const r=+c.swVoorRails||3;sw+=Math.round((SW_BP[r]+(SW_HA[c.swVoorHoogte]||0))*(c.swSteellook==="ja"?1.18:1));}
  if(c.swZij) {const r=+c.swZijRails||2; sw+=Math.round((SW_BP[r]+(SW_HA[c.swZijHoogte]||0))*(c.swSteellook==="ja"?1.18:1));}
  const sa=(c.swGrep==="ja"?89:0)+(c.swSier==="ja"?69:0)+(c.swTocht==="ja"?79:0)+(c.swShading==="ja"?249:0);
  const spieP  = c.swSpie&&c.swZij  ? 139 : 0;
  const hoekP  = c.swHoek&&c.swVoor&&c.swZij ? 89 : 0;
  const uP     = c.swUProfiel ? 119 : 0;
  const ctrlP  = c.ledController ? 149 : 0;
  const staP   = c.extraStaander ? 189 : 0;
  return Math.round(ob+oe+sw+sa+spieP+hoekP+uP+ctrlP+staP+(c.zonweringStand?897:0));
}


/* ─── WIREFRAME IMAGE PLACEHOLDER ─── */
function Img({ w=96, h=72, label="" }) {
  return (
    <div style={{
      width:w, height:h, background:"#E8E8E8",
      borderRadius:8, display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      gap:5, flexShrink:0, overflow:"hidden",
    }}>
      {/* Camera / image icon */}
      <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
        <path d="M1 5a2 2 0 012-2h2.172a2 2 0 001.414-.586l.828-.828A2 2 0 018.828 1h4.344a2 2 0 011.414.586l.828.828A2 2 0 0016.828 3H19a2 2 0 012 2v12a2 2 0 01-2 2H3a2 2 0 01-2-2V5z" stroke="#ABABAB" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="11" cy="11" r="3.5" stroke="#ABABAB" strokeWidth="1.4" fill="none"/>
        <circle cx="17.5" cy="5.5" r="0.75" fill="#ABABAB"/>
      </svg>
      {label && (
        <span style={{fontSize:8,fontWeight:600,color:"#ABABAB",textTransform:"uppercase",letterSpacing:".07em",textAlign:"center",padding:"0 6px"}}>
          {label}
        </span>
      )}
    </div>
  );
}

/* ─── DATA ─── */
const LIJNEN = [
  { id:"poly",  name:"Poly Line",  badge:"Voordeligst", bc:T.lime,   from:"v.a. €799",   desc:"Opaal polycarbonaat. Diffuus daglicht, inkortbaar op maat." },
  { id:"glass", name:"Glass Line", badge:"Meest gekozen",bc:T.orange,from:"v.a. €1.151", desc:"Helder of melkglas. Maximale lichtinval, luxe uitstraling." },
  { id:"heavy", name:"Heavy Duty", badge:"Sterkst",     bc:T.green,  from:"v.a. €1.534", desc:"6061-T6 aluminium, 98 kg/m² sneeuwlast, 6,06 m vrij." },
];
const STIJLEN = [
  { id:"modern",    name:"Modern",    desc:"Strakke lijnen, verborgen details.",    avail:["poly","glass","heavy"] },
  { id:"klassiek",  name:"Klassiek",  desc:"Sierlijk profiel, antraciet & wit.",    avail:["poly","glass"] },
  { id:"tijdloos",  name:"Tijdloos",  desc:"Subtiele curves, tijdvaste look.",      avail:["heavy"] },
  { id:"authentiek",name:"Authentiek",desc:"Schoren, klassiek ambachtelijk karakter.",avail:["heavy"] },
  { id:"eigentijds",name:"Eigentijds",desc:"Modern met verfijnde details.",         avail:["heavy"] },
];
const KLEUREN = [
  { id:"antraciet", name:"Mat Antraciet", ral:"RAL 7016", hex:"#3E4347", pop:true  },
  { id:"wit",       name:"Mat Wit",       ral:"RAL 9016", hex:"#EDEAE2", pop:false },
  { id:"zwart",     name:"Mat Zwart",     ral:"RAL 9005", hex:"#161A1D", pop:false },
];
const DAKTYPEN = {
  poly:  [{ id:"opaal",  name:"Opaal polycarbonaat", desc:"Diffuus licht, privacy, inkortbaar" }],
  glass: [{ id:"helder", name:"Helder glas",  desc:"Max. lichtinval, luxe uitstraling" },
          { id:"melk",   name:"Melkglas",      desc:"Privacy & schaduw, zachter licht" }],
  heavy: [{ id:"helder", name:"Helder glas",  desc:"Max. lichtinval, 98 kg/m² sneeuw"  },
          { id:"melk",   name:"Melkglas",      desc:"Privacy & 98 kg/m² sneeuwlast"     }],
};
const DIEPTES     = ["2.5","3.0","3.5","4.0"];
const HOOGTE_LOOP = ["2.10","2.15","2.20","2.25","2.30","2.35"];
const SW_RAILS    = [
  { id:"1", label:"1-rail — 1960 mm (1 paneel)"  },{ id:"2", label:"2-rail — 1960 mm (2 panelen)" },
  { id:"3", label:"3-rail — 2940 mm (3 panelen)" },{ id:"4", label:"4-rail — 3920 mm (4 panelen)" },
  { id:"5", label:"5-rail — 4900 mm (5 panelen)" },{ id:"6", label:"6-rail — 5880 mm (6 panelen)" },
];
const SW_HOOGTES = ["1980","2080","2180","2280","2380","2480","2580","2680","2720"]
  .map(h=>({ value:h, label:`${h} mm  (${h}–${+h+40} mm bereik)${SW_HA[h]>0?" +€"+SW_HA[h]:""}` }));

const ALL_STEPS = [
  { id:"lijn",        label:"Productlijn",  group:"Overkapping" },
  { id:"stijl",       label:"Stijl",        group:"Overkapping" },
  { id:"kleur",       label:"Kleur",        group:"Overkapping" },
  { id:"dak",         label:"Dak",          group:"Overkapping" },
  { id:"maten",       label:"Afmetingen",   group:"Overkapping" },
  { id:"verlichting", label:"Verlichting",  group:"Overkapping" },
  { id:"zonwering",   label:"Zonwering",    group:"Overkapping" },
  { id:"fundering",   label:"Fundering",    group:"Overkapping" },
  { id:"sw_intro",    label:"Schuifwand",   group:"Schuifwanden" },
  { id:"sw_voor",     label:"Voorzijde",    group:"Schuifwanden", cond:c=>c.swWil },
  { id:"sw_zij",      label:"Zijkanten",    group:"Schuifwanden", cond:c=>c.swWil },
  { id:"sw_acc",      label:"Type & afwerking",group:"Schuifwanden", cond:c=>c.swWil },
  { id:"extra_zon",   label:"Ext. Zonwering",group:"Extra's",    cond:c=>c.zonwering!=="auto" },
  { id:"overzicht",   label:"Overzicht",    group:"Bestellen" },
];

/* ─── STEP VALIDATION ───────────────────────────────────────
   Returns true when the user has made a valid choice for the
   current step — used to enable/disable the Volgende button.
─────────────────────────────────────────────────────────── */
function canAdvance(stepId, c) {
  switch(stepId) {
    case "lijn":        return !!c.lijn;
    case "stijl":       return !!c.stijl;
    case "kleur":       return !!c.kleur;
    case "dak":         return !!c.dakSub;
    case "maten": {
      if (!c.breedte || !c.diepte || !c.hoogte) return false;
      // Extra staander required for widths > 6.06m (except Heavy Duty at exactly 6.06m)
      if (parseFloat(c.breedte) > 6.06 && !c.extraStaander) return false;
      return true;
    }
    case "verlichting": return c.led !== undefined;
    case "zonwering":   return c.zonwering !== undefined;
    case "fundering":   return !!c.fundering;
    case "sw_intro":    return c.swWil !== null;
    case "sw_voor": {
      // If 6-rail selected, U-profiel must be added
      if (c.swVoor && parseInt(c.swVoorRails)>=6 && !c.swUProfiel) return false;
      return true;
    }
    case "sw_zij": {
      // Spieën required when zijkant enabled
      if (c.swZij && !c.swSpie) return false;
      // Hoekprofiel required when both voor + zij
      if (c.swZij && c.swVoor && !c.swHoek) return false;
      return true;
    }
    case "sw_acc":      return !!c.swSteellook;
    case "extra_zon":   return true;
    case "overzicht":   return true;
    default:            return true;
  }
}

const INIT = {
  lijn:null, stijl:null, kleur:null, dakSub:null,
  breedte:null, diepte:null, hoogte:null,
  led:"none", zonwering:"none", fundering:"none",
  swWil:null,
  swSteellook:"nee",
  swVoor:false, swVoorRails:"3", swVoorHoogte:"2080",
  swZij:false,  swZijRails:"2",  swZijHoogte:"2080",
  swGrep:"none", swSier:"none", swTocht:"none", swShading:"none",
  swSpie:false, swHoek:false, swUProfiel:false,
  ledController:false, extraStaander:false,
  zonweringStand:false, shadingStand:false,
};

/* ─── GLOBAL CSS ─── */
const CSS = `
  @import url('https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css');
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{font-size:16px}
  body{background:${T.beige};font-family:'ArticulatCF','Inter',sans-serif;color:${T.green};-webkit-font-smoothing:antialiased}
  button{font-family:inherit;cursor:pointer}
  button:focus-visible{outline:2px solid ${T.lime};outline-offset:2px}
  select{font-family:inherit}
  ::-webkit-scrollbar{width:4px;height:4px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:${T.bone};border-radius:99px}
  .price-hl{display:inline-block;background:${T.orange};color:#fff;padding:2px 10px 3px;border-radius:0;font-weight:800;font-size:16px;letter-spacing:-.01em;transform:rotate(-2deg);transform-origin:left center;line-height:1.45}
  .price-hl-sm{display:inline-block;background:${T.orange};color:#fff;padding:1px 7px 2px;border-radius:0;font-weight:800;font-size:12px;transform:rotate(-2deg);transform-origin:left center;line-height:1.45}
  .tmx-select{appearance:none;-webkit-appearance:none;width:100%;background:${T.white};border:1.5px solid ${T.lightGrey};border-radius:4px;padding:10px 36px 10px 12px;font-size:14px;font-weight:600;color:${T.green};cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23636363' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;background-size:16px;transition:border-color .15s}
  .tmx-select:focus{outline:none;border-color:${T.green}}
  .tmx-select:hover{border-color:${T.green}}
  @media(max-width:540px){.hide-xs{display:none!important}.two-col{grid-template-columns:1fr!important}.three-col{grid-template-columns:1fr 1fr!important}}
`;

/* ─── ICON LOADER ─── */
function useRemixIcons() {
  useEffect(() => {
    if (document.getElementById("ri-css")) return;
    const link = document.createElement("link");
    link.id = "ri-css";
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css";
    document.head.appendChild(link);
  }, []);
}

/* Inline SVG icon — guaranteed to render even without CDN */
function Icon({ name, size=14, color="currentColor", style={} }) {
  const paths = {
    "arrow-left":        "M19 12H5M5 12l7 7M5 12l7-7",
    "arrow-right":       "M5 12h14M14 5l7 7-7 7",
    "check":             "M20 6L9 17l-5-5",
    "check-double":      "M18 6L7 17l-5-5M23 6l-9 9",
    "close":             "M18 6L6 18M6 6l12 12",
    "add":               "M12 5v14M5 12h14",
    "info":              "M12 16v-4m0-4h.01M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z",
    "warning":           "M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z",
    "drop":              "M12 2.69l5.66 5.66a8 8 0 11-11.31 0z",
    "scissors":          "M6 3a3 3 0 110 6 3 3 0 010-6zm12 12a3 3 0 110 6 3 3 0 010-6zM20 4L8.12 15.88M14.47 14.48L20 20M3.99 4l5 5",
    "cart":              "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0",
    "mail":              "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
    "door":              "M13 4H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2v-5M18 14l4-4-4-4m4 4H9",
    "layout-right":      "M3 3h18v18H3zM15 3v18",
    "layout-grid":       "M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z",
    "chevron-down":      "M6 9l6 6 6-6",
    "sun":               "M12 17A5 5 0 1012 7a5 5 0 000 10zm0-15v2m0 14v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42",
    "sun-cloudy":        "M12 17A5 5 0 1012 7a5 5 0 000 10zM12 1v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2",
    "bulb":              "M9 21h6M12 3a6 6 0 00-3.44 10.89L9 17h6l.44-3.11A6 6 0 0012 3z",
    "building":          "M2 20h20M6 20V4l6-2 6 2v16M9 8h2m-2 4h2m3-4h2m-2 4h2",
    "shield":            "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    "hand":              "M18 11V6a2 2 0 00-2-2v0a2 2 0 00-2 2v0M14 10V4a2 2 0 00-2-2v0a2 2 0 00-2 2v6M10 10.5V6a2 2 0 00-2-2v0a2 2 0 00-2 2v8M6 14l-.6-1.4A2 2 0 004 10.94V11a8 8 0 008 8h0a8 8 0 008-8v-.5",
    "layout-col":        "M3 3h18v18H3zM9 3v18",
    "layout-col-fill":   "M3 3h7v18H3zM14 3h7v18h-7z",
    "close-circle":      "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM15 9l-6 6M9 9l6 6",
    "customer-svc":      "M3 18v-6a9 9 0 0118 0v6M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z",
    "truck":             "M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
    "price-tag":         "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01",
    "tools":             "M14.7 6.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-2-2a1 1 0 010-1.4l8-8a1 1 0 011.4 0l2 2zM3 21l3.75-1.25L3 16.25 1.75 20z",
    "store":             "M2 7l.9-3.6A1 1 0 013.86 3h16.28a1 1 0 01.97.4L22 7M2 7h20M2 7v12a1 1 0 001 1h18a1 1 0 001-1V7M12 3v4M8 3l-1 4M16 3l1 4",
    "ruler":             "M22 9.43L9.43 22M18 13l4-4-4-4M13 18l-4 4-4-4M3 15L9 9M15 3l-6 6",
    "spotlight":         "M12 3v2m0 14v2M3 12H1m4.22-6.36L3.81 4.22M19.78 4.22l-1.41 1.42M21 12h-2M4.22 19.78l1.42-1.42M18.36 18.36l1.42 1.42M12 8a4 4 0 100 8 4 4 0 000-8z",
    "bulb-flash":        "M18 7a9 9 0 00-9-5 9 9 0 00-3 16.9V21a1 1 0 001 1h4a1 1 0 001-1v-1h2v1a1 1 0 001 1h1a1 1 0 001-1v-2.1A9 9 0 0018 7zM9 21h6",
  };
  const d = paths[name];
  if (!d) return <span style={{width:size,height:size,display:"inline-block",flexShrink:0}}/>;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,...style}}>
      {d.split("M").filter(Boolean).map((seg,i)=>(
        <path key={i} d={`M${seg}`} fill="none"/>
      ))}
    </svg>
  );
}
function Logo({ h=30 }) {
  const w=h*2.6;
  return (
    <svg width={w} height={h} viewBox="0 0 240 92" fill="none">
      <line x1="24" y1="48" x2="80"  y2="6"  stroke="white" strokeWidth="7" strokeLinecap="round"/>
      <line x1="160" y1="6" x2="216" y2="48" stroke="white" strokeWidth="7" strokeLinecap="round"/>
      <line x1="24" y1="48" x2="24"  y2="76" stroke="white" strokeWidth="7" strokeLinecap="round"/>
      <line x1="216" y1="48" x2="216" y2="76" stroke="white" strokeWidth="7" strokeLinecap="round"/>
      <text x="40" y="72" fontFamily="Arial,sans-serif" fontSize="38" fontWeight="800" fill="white" letterSpacing="-1">TUIN</text>
      <text x="40" y="89" fontFamily="Arial,sans-serif" fontSize="21" fontWeight="400" fill="white" letterSpacing="1">Maximaal</text>
    </svg>
  );
}

/* ─── ATOMS ─── */
function HScroll({ children, gap=8, bg=T.white, style={} }) {
  const ref=useRef(null);
  const [l,sl]=useState(false);
  const [r,sr]=useState(false);
  const m=useCallback(()=>{const el=ref.current;if(!el)return;sl(el.scrollLeft>3);sr(el.scrollLeft<el.scrollWidth-el.clientWidth-3);},[]);
  useEffect(()=>{const el=ref.current;if(!el)return;m();el.addEventListener("scroll",m,{passive:true});const ro=new ResizeObserver(m);ro.observe(el);return()=>{el.removeEventListener("scroll",m);ro.disconnect();};},[m]);
  return (
    <div style={{position:"relative",...style}}>
      {l&&<div style={{position:"absolute",left:0,top:0,bottom:0,width:40,zIndex:2,background:`linear-gradient(to right,${bg},transparent)`,pointerEvents:"none"}}/>}
      {r&&<div style={{position:"absolute",right:0,top:0,bottom:0,width:40,zIndex:2,background:`linear-gradient(to left,${bg},transparent)`,pointerEvents:"none"}}/>}
      <div ref={ref} style={{display:"flex",gap,overflowX:"auto",scrollbarWidth:"none",WebkitOverflowScrolling:"touch",paddingBottom:1}}>{children}</div>
    </div>
  );
}

function Radio({ active, onClick, children, style={} }) {
  return (
    <button onClick={onClick} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 15px",background:active?T.selectedBg:T.white,border:`1.5px solid ${active?T.lime:T.lightGrey}`,borderRadius:8,textAlign:"left",fontFamily:"inherit",transition:"all .15s",width:"100%",boxShadow:active?"0 2px 10px rgba(128,151,0,.12)":"none",...style}}>
      {children}
      {/* DS: radio active = white bg + green radial dot. Never solid filled circle. */}
      <div style={{
        width:18,height:18,borderRadius:"50%",flexShrink:0,marginLeft:"auto",
        border:`2px solid ${active?T.green:T.lightGrey}`,
        background:T.white,
        display:"flex",alignItems:"center",justifyContent:"center",
        transition:"all .15s",
      }}>
        {active&&<div style={{width:8,height:8,borderRadius:"50%",background:T.green}}/>}
      </div>
    </button>
  );
}

function Check({ active, onClick, icon, title, desc, price, disabled=false }) {
  return (
    <button onClick={()=>!disabled&&onClick()} style={{display:"flex",alignItems:"flex-start",gap:11,padding:"12px 14px",background:active?T.selectedBg:T.white,border:`1.5px solid ${active?T.lime:T.lightGrey}`,borderRadius:8,textAlign:"left",fontFamily:"inherit",transition:"all .15s",width:"100%",opacity:disabled?.4:1,cursor:disabled?"not-allowed":"pointer"}}>
      {icon&&<Icon name={icon} size={17} color={active?T.green:T.midGrey} style={{marginTop:1,flexShrink:0}}/>}
      <div style={{flex:1}}>
        <div style={{fontSize:13,fontWeight:700,color:T.green}}>{title}</div>
        {desc&&<div style={{fontSize:11,color:T.grey,lineHeight:1.55,marginTop:2}}>{desc}</div>}
      </div>
      {price&&<span style={{fontSize:11,fontWeight:600,color:T.grey,flexShrink:0,marginTop:1}}>{price}</span>}
      <div style={{width:17,height:17,borderRadius:4,flexShrink:0,marginTop:1,border:`2px solid ${active?T.lime:T.lightGrey}`,background:active?T.lime:T.white,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}>
        {active&&<Icon name="check" size={10} color={T.white}/>}
      </div>
    </button>
  );
}

function Field({ label, value, onChange, opts, hint }) {
  return (
    <div>
      <label style={{display:"block",fontSize:10,fontWeight:700,color:T.midGrey,textTransform:"uppercase",letterSpacing:".09em",marginBottom:7}}>{label}</label>
      <select className="tmx-select" value={value} onChange={e=>onChange(e.target.value)}>
        {opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
      {hint&&<div style={{fontSize:11,color:T.grey,marginTop:5,lineHeight:1.55}}>{hint}</div>}
    </div>
  );
}

/* ─────────────────────────────────────────
   UPSELL BLOCK  — required or recommended
   companion product with inline add-to-cfg
───────────────────────────────────────── */
function UpsellBlock({ added, onToggle, icon, title, badge="Vereist", badgeColor=T.orange, price, desc, children }) {
  return (
    <div style={{
      background: added ? T.selectedBg : T.white,
      border:`1.5px solid ${added ? T.lime : badgeColor}`,
      borderRadius:8, padding:"14px 15px",
      transition:"all .2s",
    }}>
      <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
        {/* Icon area */}
        <div style={{
          width:44, height:44, borderRadius:8, flexShrink:0,
          background: added ? "#daefc2" : `${badgeColor}18`,
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          {icon}
        </div>
        <div style={{flex:1,minWidth:0}}>
          {/* Header row */}
          <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap",marginBottom:4}}>
            <span style={{fontSize:13,fontWeight:800,color:T.green}}>{title}</span>
            <span style={{fontSize:9,fontWeight:800,background:badgeColor,color:T.white,
              borderRadius:4,padding:"2px 7px",textTransform:"uppercase",letterSpacing:".04em",flexShrink:0}}>
              {badge}
            </span>
            <span style={{fontSize:11,fontWeight:700,color:T.grey,flexShrink:0}}>{price}</span>
          </div>
          {/* Description */}
          <div style={{fontSize:12,color:T.grey,lineHeight:1.6,marginBottom:11}}>{desc}</div>
          {/* Extra content slot */}
          {children&&<div style={{marginBottom:11}}>{children}</div>}
          {/* CTA */}
          <button
            onClick={onToggle}
            style={{
              background: added ? T.lime : T.green,
              color: T.white, border:"none",
              borderBottom:`2px solid ${added ? T.limeDark : T.darkGreen}`,
              borderRadius:4, padding:"7px 14px",
              fontSize:12, fontWeight:700, fontFamily:"inherit",
              cursor:"pointer", display:"inline-flex", alignItems:"center", gap:6,
              transition:"all .15s",
            }}>
            {added
              ? <><Icon name="check" size={12} color={T.white}/>Toegevoegd — klik om te verwijderen</>
              : <><Icon name="add"   size={12} color={T.white}/>Toevoegen aan configuratie</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

/* Icon SVGs used inside UpsellBlock */
const SpieIcon = ()=>(
  <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
    <polygon points="4,28 28,28 28,4" fill="rgba(128,151,0,.3)" stroke={T.lime} strokeWidth="2" strokeLinejoin="round"/>
    <line x1="4" y1="28" x2="28" y2="4" stroke={T.lime} strokeWidth="2.5" strokeLinecap="round"/>
    <text x="10" y="27" fontSize="7" fontWeight="700" fill={T.green} fontFamily="sans-serif">8°</text>
  </svg>
);
const HoekIcon = ()=>(
  <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
    <path d="M4 28 L4 4 L28 4" stroke={T.lime} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <rect x="4" y="4" width="8" height="24" fill="rgba(128,151,0,.25)" rx="1"/>
    <rect x="4" y="4" width="24" height="8" fill="rgba(128,151,0,.15)" rx="1"/>
  </svg>
);
const UProfielIcon = ()=>(
  <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
    <path d="M6 6 L6 26 L26 26" stroke={T.lime} strokeWidth="3" strokeLinecap="round" fill="none"/>
    <path d="M6 6 L12 6 L12 26" stroke={T.lime} strokeWidth="2" strokeLinecap="round" fill="none"/>
    <rect x="6" y="6" width="6" height="20" fill="rgba(128,151,0,.25)" rx="1"/>
  </svg>
);
const MotorIcon = ()=>(
  <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
    <rect x="4" y="10" width="16" height="12" rx="3" stroke={T.lime} strokeWidth="2" fill="rgba(128,151,0,.2)"/>
    <line x1="20" y1="16" x2="28" y2="16" stroke={T.lime} strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="28" cy="16" r="3" fill={T.lime}/>
    <line x1="10" y1="4" x2="10" y2="10" stroke={T.lime} strokeWidth="2" strokeLinecap="round"/>
    <line x1="14" y1="6" x2="14" y2="10" stroke={T.lime} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const FunderingWarnIcon = ()=>(
  <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
    <rect x="8" y="20" width="16" height="8" rx="2" fill="rgba(255,128,0,.25)" stroke={T.orange} strokeWidth="2"/>
    <line x1="12" y1="20" x2="12" y2="4" stroke={T.orange} strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="20" y1="20" x2="20" y2="4" stroke={T.orange} strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M16 4 L18 10 L14 10 Z" fill={T.orange}/>
  </svg>
);
const StaanderIcon = ()=>(
  <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
    <rect x="13" y="4" width="6" height="24" rx="2" fill="rgba(128,151,0,.25)" stroke={T.lime} strokeWidth="2"/>
    <rect x="10" y="26" width="12" height="4" rx="1.5" fill={T.lime} opacity=".5"/>
    <rect x="4" y="12" width="24" height="5" rx="2" fill="rgba(128,151,0,.3)" stroke={T.lime} strokeWidth="1.5"/>
    <line x1="7" y1="17" x2="7" y2="28" stroke={T.lime} strokeWidth="2" strokeLinecap="round"/>
    <line x1="25" y1="17" x2="25" y2="28" stroke={T.lime} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

function Note({ color=T.lime, icon="info", children }) {
  return (
    <div style={{display:"flex",gap:9,alignItems:"flex-start",background:`${color}16`,border:`1px solid ${color}40`,borderRadius:8,padding:"10px 12px",fontSize:12,color:T.black,lineHeight:1.65}}>
      <Icon name={icon} size={14} color={color} style={{marginTop:1,flexShrink:0}}/>
      <span>{children}</span>
    </div>
  );
}

function SL({ children }) { return <div style={{fontSize:10,fontWeight:700,color:T.midGrey,textTransform:"uppercase",letterSpacing:".09em",marginBottom:8}}>{children}</div>; }
function Sep() { return <div style={{height:1,background:T.lightGrey,margin:"22px 0"}}/>; }
/* ─────────────────────────────────────────
   INFO DRAWER — per-step context + video
───────────────────────────────────────── */
function VideoPlaceholder({ label="" }) {
  return (
    <div style={{width:"100%",paddingBottom:"56.25%",position:"relative",borderRadius:8,overflow:"hidden",background:"#D8D8D8"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:`repeating-linear-gradient(0deg,rgba(0,0,0,.04) 0,rgba(0,0,0,.04) 1px,transparent 1px,transparent 28px),repeating-linear-gradient(90deg,rgba(0,0,0,.04) 0,rgba(0,0,0,.04) 1px,transparent 1px,transparent 28px)`}}/>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
        <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(0,0,0,.18)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
        </div>
        <span style={{fontSize:11,fontWeight:600,color:"rgba(0,0,0,.4)",letterSpacing:".05em",textTransform:"uppercase",textAlign:"center",padding:"0 20px"}}>
          {label||"Video"}
        </span>
      </div>
    </div>
  );
}

function InfoDrawer({ open, onClose, title, intro, bullets, video, extra }) {
  if (!open) return null;
  return (
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,24,13,.38)",zIndex:400,animation:"fadeIn .2s ease"}}/>
      <div style={{
        position:"fixed", right:0, top:0, bottom:0,
        width:"min(460px,100vw)", background:T.white, zIndex:401,
        display:"flex", flexDirection:"column",
        boxShadow:"-4px 0 32px rgba(0,48,23,.14)",
        animation:"slideIn .25s ease",
      }}>
        {/* Header */}
        <div style={{background:T.green, padding:"16px 20px", flexShrink:0,
          display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:"rgba(245,230,215,.55)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:3}}>Meer informatie</div>
            <div style={{fontSize:17,fontWeight:800,color:T.white,letterSpacing:"-.02em"}}>{title}</div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.12)",border:"none",borderRadius:4,width:34,height:34,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Icon name="close" size={15} color={T.white}/>
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{flex:1, overflowY:"auto", padding:"20px 20px 28px"}}>

          {/* Video placeholder */}
          {video&&(
            <div style={{marginBottom:20}}>
              <VideoPlaceholder label={video}/>
            </div>
          )}

          {/* Intro text */}
          {intro&&(
            <p style={{fontSize:13,color:T.grey,lineHeight:1.75,marginBottom:16}}>{intro}</p>
          )}

          {/* Bullets */}
          {bullets&&bullets.length>0&&(
            <ul style={{listStyle:"none",padding:0,display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
              {bullets.map((b,i)=>(
                <li key={i} style={{display:"flex",gap:10,alignItems:"flex-start",fontSize:13,color:T.grey,lineHeight:1.6}}>
                  <div style={{width:18,height:18,borderRadius:"50%",background:T.lime,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                    <Icon name="check" size={10} color={T.white}/>
                  </div>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Extra rich content */}
          {extra&&<div style={{marginTop:8}}>{extra}</div>}
        </div>

        {/* Footer */}
        <div style={{flexShrink:0, padding:"14px 20px", borderTop:`1px solid ${T.lightGrey}`}}>
          <button onClick={onClose} style={{
            width:"100%", background:T.green, color:T.white,
            border:"none", borderRadius:4, padding:"11px",
            fontSize:13, fontWeight:700, fontFamily:"inherit", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          }}>
            <Icon name="close" size={13} color={T.white}/>
            Sluiten
          </button>
        </div>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
    </>
  );
}

function Wrap({ title, sub, group, info, children }) {
  const [infoOpen, setInfoOpen] = useState(false);
  return (
    <div>
      {group&&<div style={{fontSize:10,fontWeight:700,color:T.orange,textTransform:"uppercase",letterSpacing:".1em",marginBottom:5}}>{group}</div>}
      <div style={{marginBottom:22}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10}}>
          <h2 style={{fontSize:21,fontWeight:800,color:T.green,letterSpacing:"-.025em",lineHeight:1.2,marginBottom:4,flex:1}}>{title}</h2>
          {info&&(
            <button onClick={()=>setInfoOpen(true)} style={{
              flexShrink:0, background:T.beige, border:`1px solid ${T.bone}`,
              borderRadius:4, padding:"5px 10px", cursor:"pointer",
              fontFamily:"inherit", display:"flex", alignItems:"center", gap:5,
              fontSize:11, fontWeight:700, color:T.green, whiteSpace:"nowrap",
              transition:"background .15s",
            }}
            onMouseEnter={e=>e.currentTarget.style.background=T.bone}
            onMouseLeave={e=>e.currentTarget.style.background=T.beige}>
              <Icon name="info" size={13} color={T.green}/>
              Meer info
            </button>
          )}
        </div>
        {sub&&<p style={{fontSize:13,color:T.grey,lineHeight:1.6}}>{sub}</p>}
      </div>
      {children}
      {info&&<InfoDrawer open={infoOpen} onClose={()=>setInfoOpen(false)} {...info}/>}
    </div>
  );
}

/* ─── STEP COMPONENTS ─── */
function StepLijn({ c, s }) {
  const kleurHex = KLEUREN.find(k=>k.id===c.kleur)?.hex||"#3E4347";
  return (
    <Wrap title="Kies uw productlijn" sub="De basis van uw overkapping bepaalt constructie en prijs." group="Terrasoverkapping"
      info={{title:"Productlijnen vergelijken",video:"Poly Line vs Glass Line vs Heavy Duty",intro:"Gumax® biedt drie aluminium productlijnen, elk met een eigen balans tussen prijs, lichtinval en draagvermogen. Alle lijnen worden vervaardigd uit hoogwaardig aluminium met 60–80 µm poedercoating.",bullets:["Poly Line: meest voordelig, opaal diffuus licht, zelf inkortbaar in breedte én diepte","Glass Line: maximale lichtinval door helder of melkglas, meest populaire keuze","Heavy Duty: 6061-T6 aluminium, draagt 98 kg/m² sneeuwlast, tot 6,06 m breed zonder extra staander","Alle lijnen: CE-gecertificeerd, TÜV NORD gecontroleerd, 10 jaar garantie"]}}>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {LIJNEN.map(l=>(
          <Radio key={l.id} active={c.lijn===l.id} onClick={()=>s({...c,lijn:l.id,stijl:STIJLEN.find(x=>x.avail.includes(l.id))?.id||"modern",dakSub:DAKTYPEN[l.id][0].id})}>
            <div style={{flexShrink:0,borderRadius:8,overflow:"hidden"}}>
              <Img w={96} h={72} label={l.name}/>
              
              
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}>
                <span style={{fontSize:14,fontWeight:800,color:T.green}}>{l.name}</span>
                <span style={{fontSize:9,fontWeight:800,background:l.bc,color:T.white,borderRadius:4,padding:"2px 7px",textTransform:"uppercase",letterSpacing:".04em"}}>{l.badge}</span>
              </div>
              <div style={{fontSize:12,color:T.grey,lineHeight:1.5,marginBottom:7}}>{l.desc}</div>
              <span className="price-hl-sm">{l.from}</span>
            </div>
          </Radio>
        ))}
      </div>
    </Wrap>
  );
}

function StepStijl({ c, s }) {
  const avail = STIJLEN.filter(x=>x.avail.includes(c.lijn));
  const kleurHex = KLEUREN.find(k=>k.id===c.kleur)?.hex||"#3E4347";
  return (
    <Wrap title="Kies uw stijl" sub="De stijl bepaalt de profilering van het aluminium frame." group="Terrasoverkapping"
      info={{title:"Stijlen uitgelegd",video:"Stijlverschillen Modern, Klassiek & Authentiek",intro:"De stijl bepaalt de vormentaal van het zichtbare aluminium frame — van strak en hedendaags tot klassiek en ambachtelijk.",bullets:["Modern: strakke rechte lijnen, verborgen bevestigingen — voor alle drie productlijnen","Klassiek: sierlijke profielen en ronde details, alleen in antraciet en wit — Poly & Glass Line","Tijdloos: subtiele curves die in elk tijdperk passen — Heavy Duty","Authentiek: decoratieve schoren aan de buitenste staanders voor klassiek karakter — Heavy Duty","Eigentijds: verfijnde mix van modern en klassiek — Heavy Duty"]}}>
      {c.stijl==="klassiek"&&<div style={{marginBottom:14}}><Note color={T.orange} icon="warning">Stijl Klassiek is alleen beschikbaar in Mat Antraciet en Mat Wit.</Note></div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
        {avail.map(x=>(
          <button key={x.id} onClick={()=>s({...c,stijl:x.id})} style={{
            padding:0,background:c.stijl===x.id?T.selectedBg:T.white,
            border:`1.5px solid ${c.stijl===x.id?T.lime:T.lightGrey}`,
            borderRadius:8,overflow:"hidden",textAlign:"left",
            fontFamily:"inherit",transition:"all .15s",position:"relative",cursor:"pointer",
          }}>
            {/* Image with padding so it doesn't touch edges */}
            <div style={{padding:"10px 10px 0",background:c.stijl===x.id?T.selectedBg:T.white}}>
              <div style={{borderRadius:6,overflow:"hidden"}}>
                <Img w="100%" h={90} label={x.name}/>
              </div>
            </div>
            {c.stijl===x.id&&<div style={{
              position:"absolute",top:16,right:16,
              width:20,height:20,borderRadius:"50%",
              background:T.green,display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 1px 4px rgba(0,0,0,.2)",
            }}><Icon name="check" size={11} color={T.white}/></div>}
            <div style={{padding:"10px 12px 13px"}}>
              <div style={{fontSize:13,fontWeight:700,color:T.green,marginBottom:2}}>{x.name}</div>
              <div style={{fontSize:11,color:T.grey,lineHeight:1.5}}>{x.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </Wrap>
  );
}

function StepKleur({ c, s }) {
  const restricted = c.stijl==="klassiek";
  const avail = restricted ? KLEUREN.filter(k=>k.id!=="zwart") : KLEUREN;
  return (
    <Wrap title="Kies uw kleur" sub="60–80 µm poedercoating, UV-bestendig. Geldt voor overkapping én alle accessoires." group="Terrasoverkapping"
      info={{title:"Kleuren & afwerking",video:"Kleurverschillen in het zonlicht",intro:"Alle kleuren zijn een hoogwaardige poedercoating van 60–80 µm dikte — UV-bestendig en kleurvast. De gekozen kleur geldt voor het volledige frame én alle accessoires zoals schuifwanden en zonwering.",bullets:["Mat Antraciet (RAL 7016): meest gekozen, tijdloze donkere tint, past bij moderne architectuur","Mat Wit (RAL 9016): lichte frisse uitstraling, enige optie voor stijl Klassiek naast Antraciet","Mat Zwart (RAL 9005): diep zwart voor een stoere industriële look","Alle kleuren: onderhoudsvriendelijk, 1× per jaar reinigen met Gumax® reinigingsset volstaat"]}}>
      {restricted&&<div style={{marginBottom:14}}><Note color={T.orange} icon="warning">Stijl Klassiek is alleen in Antraciet en Wit verkrijgbaar.</Note></div>}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {avail.map(k=>(
          <Radio key={k.id} active={c.kleur===k.id} onClick={()=>s({...c,kleur:k.id})}>
            <div style={{borderRadius:8,overflow:"hidden",flexShrink:0}}>
              <Img w={88} h={68} label={k.name}/>
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:2}}>
                <span style={{fontSize:14,fontWeight:700,color:T.green}}>{k.name}</span>
                {k.pop&&<span style={{fontSize:9,fontWeight:800,background:T.orange,color:T.white,borderRadius:4,padding:"1px 6px",textTransform:"uppercase"}}>Populair</span>}
              </div>
              <span style={{fontSize:12,color:T.grey}}>{k.ral}</span>
            </div>
          </Radio>
        ))}
      </div>
    </Wrap>
  );
}

function StepDak({ c, s }) {
  const opts = DAKTYPEN[c.lijn]||DAKTYPEN.glass;
  return (
    <Wrap title="Kies uw daktype" sub={`Beschikbare dakopties voor de ${LIJNEN.find(l=>l.id===c.lijn)?.name}.`} group="Terrasoverkapping"
      info={{title:"Daktypen vergelijken",video:"Helder glas vs Melkglas vs Polycarbonaat",intro:"Het daktype bepaalt hoeveel licht er doorvalt, de mate van privacy en of het dak inkortbaar is.",bullets:["Opaal polycarbonaat: diffuus zachte lichtinval, geen directe zon, zelf inkortbaar op maat","Helder glas: maximale lichtinval, helder zicht naar boven, niet inkortbaar","Melkglas: privacy en schaduw bij volledige lichtinval, niet inkortbaar","Gehard veiligheidsglas valt uiteen in veilige korrels — nooit in scherpe splinters"]}}>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
        {opts.map(d=>(
          <Radio key={d.id} active={c.dakSub===d.id} onClick={()=>s({...c,dakSub:d.id})}>
            <div style={{borderRadius:8,overflow:"hidden",flexShrink:0}}>
              <Img w={96} h={72} label={d.name}/>
            </div>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:T.green,marginBottom:3}}>{d.name}</div>
              <div style={{fontSize:12,color:T.grey}}>{d.desc}</div>
            </div>
          </Radio>
        ))}
      </div>
      {c.lijn==="poly"&&<Note icon="scissors">Polycarbonaat is inkortbaar in breedte én diepte — elke maat tot 4 m mogelijk.</Note>}
      {c.lijn==="heavy"&&<Note color={T.orange} icon="warning">Heavy Duty is <strong>niet</strong> inkortbaar. Gehard glas kan niet op maat worden gesneden.</Note>}
    </Wrap>
  );
}

function StepMaten({ c, s }) {
  const breedte = c.breedte||"3.06";
  const diepte  = c.diepte||"2.5";
  const hoogte  = c.hoogte||"2.10";
  const opp=(parseFloat(breedte)*parseFloat(diepte)).toFixed(1);
  const hwa=parseFloat(opp)>24;
  const nSta=parseFloat(breedte)<=4.06?2:c.lijn==="heavy"&&breedte==="6.06"?2:3;
  const lijn = c.lijn||"glass";

  // Price deltas relative to smallest option
  const baseB = Math.round(O_BASE[lijn]*O_DM[diepte]*O_WM["3.06"]);
  const baseD = Math.round(O_BASE[lijn]*O_DM["2.5"]*O_WM[breedte]);
  const curPrice = Math.round(O_BASE[lijn]*O_DM[diepte]*O_WM[breedte]);

  const breedteOpts = BREEDTES.map(b=>{
    const p=Math.round(O_BASE[lijn]*O_DM[diepte]*O_WM[b]);
    const d=p-baseB; return {v:b,p,delta:d};
  });
  const diepteOpts = DIEPTES.map(d=>{
    const p=Math.round(O_BASE[lijn]*O_DM[d]*O_WM[breedte]);
    const delta=p-baseD; return {v:d,p,delta};
  });

  return (
    <Wrap title="Afmetingen" sub="Alle maten inclusief goot. Voetplaten steken 2,5 cm extra per kant uit." group="Terrasoverkapping"
      info={{title:"Afmetingen & maatvoering",video:"Hoe meet ik mijn terras op?",intro:"De opgegeven maten zijn altijd inclusief de goot. Houd rekening met de voetplaten die 2,5 cm per kant uitsteken buiten de opgegeven breedte.",bullets:["Breedte: gemeten buitenwerks, inclusief goot aan beide zijden","Diepte: van muur tot buitenzijde goot — standaard 2,5 tot 4,0 m","Doorloophoogte: onderzijde goot tot bovenkant vloer — minimaal 2,10 m aanbevolen","Bij >6,06 m breedte is een extra tussenstaander vereist voor constructieve stabiliteit","Oppervlak >24 m²: aanbevolen hemelwaterafvoer (HWA) in de betonpoer verwerken"]}}>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}} className="two-col">
        {/* Breedte dropdown */}
        <div>
          <label style={{display:"block",fontSize:10,fontWeight:700,color:T.midGrey,textTransform:"uppercase",letterSpacing:".09em",marginBottom:7}}>Breedte</label>
          <select className="tmx-select" value={breedte} onChange={e=>s({...c,breedte:e.target.value})}>
            {BREEDTES.map(b=>{
              const p=Math.round(O_BASE[lijn]*O_DM[diepte]*O_WM[b]);
              const delta=p-baseB;
              return <option key={b} value={b}>{b} m{delta>0?` — +€${delta}`:""}</option>;
            })}
          </select>
          {c.lijn==="heavy"&&breedte==="6.06"&&<div style={{fontSize:11,color:T.lime,fontWeight:600,marginTop:6}}>✓ Geen extra tussenstaander nodig</div>}
        </div>

        {/* Diepte dropdown */}
        <div>
          <label style={{display:"block",fontSize:10,fontWeight:700,color:T.midGrey,textTransform:"uppercase",letterSpacing:".09em",marginBottom:7}}>Diepte</label>
          <select className="tmx-select" value={diepte} onChange={e=>s({...c,diepte:e.target.value})}>
            {DIEPTES.map(d=>{
              const p=Math.round(O_BASE[lijn]*O_DM[d]*O_WM[breedte]);
              const delta=p-baseD;
              return <option key={d} value={d}>{d} m{delta>0?` — +€${delta}`:""}</option>;
            })}
          </select>
        </div>
      </div>

      {/* Extra staander upsell — shown when breedte > 6.06m */}
      {parseFloat(breedte)>6.06&&(
        <div style={{marginBottom:14}}>
          <UpsellBlock
            added={c.extraStaander}
            onToggle={()=>s({...c,extraStaander:!c.extraStaander})}
            icon={<StaanderIcon/>}
            title="Extra tussenstaander"
            badge="Vereist"
            badgeColor={T.orange}
            price="+€189"
            desc={`Bij een breedte van ${breedte} m is een extra tussenstaander vereist voor de constructieve stabiliteit van het frame. Zonder deze staander is de overkapping niet veilig te monteren.`}
          />
        </div>
      )}

      {/* Doorloophoogte */}
      <div style={{marginBottom:14}}>
        <Field label="Doorloophoogte (aanbevolen)" value={hoogte} onChange={v=>s({...c,hoogte:v})} opts={HOOGTE_LOOP.map(h=>({v:h,l:`${h} m`}))} hint="Gemeten van bovenkant fundering tot vlakke onderzijde van de goot."/>
      </div>

      {/* Summary */}
      <div style={{background:T.white,border:`1px solid ${T.bone}`,borderRadius:8,overflow:"hidden",marginBottom:hwa?14:0}}>
        <div style={{background:T.green,padding:"8px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,.7)",textTransform:"uppercase",letterSpacing:".07em"}}>Uw maten</span>
          <span className="price-hl-sm">€{curPrice.toLocaleString("nl-NL")}</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)"}}>
          {[["Breedte",`${breedte} m`],["Diepte",`${diepte} m`],["Opp.",`${opp} m²`],["Staanders",`${nSta} st.`],["Hoogte",`${hoogte} m`],["HWA",hwa?"Aanbevolen ⚠":"Optioneel",hwa]].map(([l,v,w],i)=>(
            <div key={i} style={{background:i%2===0?T.white:T.beige,padding:"9px 12px"}}>
              <div style={{fontSize:9,fontWeight:700,color:T.midGrey,textTransform:"uppercase",letterSpacing:".06em",marginBottom:2}}>{l}</div>
              <div style={{fontSize:12,fontWeight:700,color:w?T.orange:T.green}}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      {hwa&&<div style={{marginTop:10}}><Note color={T.orange} icon="drop">Bij &gt;24 m² dakoppervlak zijn minimaal 2 hemelwaterafvoeren aanbevolen.</Note></div>}
    </Wrap>
  );
}

function StepVerlichting({ c, s }) {
  return (
    <Wrap title="Verlichting" sub="Geïntegreerde LED in de dakliggers. Kies nu — het inbouwsysteem kan achteraf niet meer worden toegevoegd." group="Terrasoverkapping"
      info={{title:"Verlichtingsopties",video:"LED Spots vs Lighting System demo",intro:"De verlichting wordt geïntegreerd in de holle dakliggers. Na montage is bijplaatsen niet mogelijk — kies dus bewust.",bullets:["LED Spots: per ligger één dimbare spot, warm wit, ideaal voor sfeervol terrasgevoel","Lighting System: volledig kleurintelbaar (RGBW), app-bediening, Philips Hue compatibel","Slimme controller (+€149): vereist voor volledige smart home integratie van het Lighting System","Zonder verlichting: altijd nog losse buitenlampen plaatsen, maar geen geïntegreerde oplossing mogelijk"]}}>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {[
          {id:"none",   label:"Geen verlichting",  desc:"Zonder geïntegreerde LED.", sublabel:""},
          {id:"spots",  label:"LED Spots",          desc:"Dimbare spots per dakligger.", sublabel:"+€173"},
          {id:"system", label:"Lighting System",    desc:"Kleurstelbaar, smart home, afstandsbediening.", sublabel:"+€289"},
        ].map(o=>(
          <Radio key={o.id} active={c.led===o.id} onClick={()=>s({...c,led:o.id})}>
            <div style={{borderRadius:8,overflow:"hidden",flexShrink:0}}>
              <Img w={88} h={68} label={o.label}/>
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3}}>
                <span style={{fontSize:13,fontWeight:700,color:T.green}}>{o.label}</span>
                {o.sublabel&&<span style={{fontSize:11,fontWeight:600,color:T.grey}}>{o.sublabel}</span>}
              </div>
              <div style={{fontSize:11,color:T.grey,lineHeight:1.5}}>{o.desc}</div>
            </div>
          </Radio>
        ))}
      </div>
      {/* Lighting System → smart controller upsell */}
      {c.led==="system"&&(
        <div style={{marginTop:12}}>
          <UpsellBlock
            added={c.ledController}
            onToggle={()=>s({...c,ledController:!c.ledController})}
            icon={<MotorIcon/>}
            title="Slimme LED controller"
            badge="Aanbevolen"
            badgeColor={T.lime}
            price="+€149"
            desc="Bedien kleuren, helderheid en scenes via app of afstandsbediening. Vereist voor volledige smart home integratie van het Lighting System."
          />
        </div>
      )}
    </Wrap>
  );
}

function StepZonwering({ c, s }) {
  return (
    <Wrap title="Automatische zonwering" sub="Compacte onderzonwering tussen de dakliggers. Beschermd tegen weersinvloeden, patent pending." group="Terrasoverkapping"
      info={{title:"Automatische zonwering",video:"Zonwering in werking — warmtereductie demo",intro:"De Gumax® onderzonwering is speciaal ontwikkeld voor terrasoverkappingen en zit volledig beschermd tussen de dakliggers.",bullets:["Tot 15°C koeler dankzij warmtereflecterend doek","Volledig automatisch via afstandsbediening of app","Beschermd tegen wind, regen en vuil — geen aparte cassette nodig","Beschikbaar in dezelfde kleur als uw frame","Patent pending constructie, exclusief bij Gumax®"]}}>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {[
          {id:"none", label:"Geen zonwering",       desc:"Open bovenzijde."},
          {id:"auto", label:"Automatische zonwering",desc:"Warmtereflecterend doek, tot 15°C koeler.", sub:"+€897"},
        ].map(o=>(
          <Radio key={o.id} active={c.zonwering===o.id} onClick={()=>s({...c,zonwering:o.id})}>
            <div style={{borderRadius:8,overflow:"hidden",flexShrink:0}}>
              <Img w={88} h={68} label="Zonwering"/>
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3}}>
                <span style={{fontSize:13,fontWeight:700,color:T.green}}>{o.label}</span>
                {o.sub&&<span style={{fontSize:11,fontWeight:600,color:T.grey}}>{o.sub}</span>}
              </div>
              <div style={{fontSize:11,color:T.grey,lineHeight:1.5}}>{o.desc}</div>
            </div>
          </Radio>
        ))}
      </div>
    </Wrap>
  );
}

function StepFundering({ c, s }) {
  const opp=(parseFloat(c.breedte)*parseFloat(c.diepte)).toFixed(1);
  const hwa=parseFloat(opp)>24;
  return (
    <Wrap title="Fundering" sub="Iedere staander draagt maximaal 750 kg. Betonpoeren verdelen deze kracht op de ondergrond." group="Terrasoverkapping"
      info={{title:"Fundering & betonpoeren",video:"Betonpoeren plaatsen — stap voor stap",intro:"Een deugdelijke fundering is essentieel. Elke staander moet minimaal 750 kg kunnen dragen. Betonpoeren verdelen deze last over een groter vlak.",bullets:["Betonpoeren: kant-en-klaar meegeleverd, passend voor alle staanders","HWA (hemelwaterafvoer): verwerkt in de poer, leidt regenwater weg bij >24 m²","Eigen fundering: zorg voor minimaal 750 kg draagvermogen per staander — anders vervalt de garantie","Poeren worden minimaal 60 cm diep ingegraven onder de vorstgrens"]}}>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {[
          {id:"none",  label:"Geen betonpoeren",   desc:"Zelf regelen of bestaande fundering."},
          {id:"plain", label:"Betonpoeren",         desc:"Stevige fundering zonder HWA.", sub:"+€54"},
          {id:"hwa",   label:"Betonpoeren + HWA",  desc:"Hemelwaterafvoer in de poer. Aanbevolen bij >24 m².", sub:"+€98"},
        ].map(o=>(
          <Radio key={o.id} active={c.fundering===o.id} onClick={()=>s({...c,fundering:o.id})}>
            <div style={{borderRadius:8,overflow:"hidden",flexShrink:0}}>
              <Img w={88} h={68} label={o.label}/>
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3}}>
                <span style={{fontSize:13,fontWeight:700,color:T.green}}>{o.label}</span>
                {o.sub&&<span style={{fontSize:11,fontWeight:600,color:T.grey}}>{o.sub}</span>}
              </div>
              <div style={{fontSize:11,color:T.grey,lineHeight:1.5}}>{o.desc}</div>
            </div>
          </Radio>
        ))}
      </div>
      {/* Warn when no fundering selected */}
      {c.fundering==="none"&&(
        <div style={{marginTop:12}}>
          <div style={{
            background:"#fff8f0",border:`1.5px solid ${T.orange}`,
            borderRadius:8,padding:"13px 15px",
            display:"flex",gap:11,alignItems:"flex-start",
          }}>
            <FunderingWarnIcon/>
            <div>
              <div style={{fontSize:13,fontWeight:800,color:T.green,marginBottom:4}}>
                Eigen fundering vereist
              </div>
              <div style={{fontSize:12,color:T.grey,lineHeight:1.6}}>
                U heeft geen betonpoeren geselecteerd. Zorg ervoor dat uw fundering voldoet aan minimaal 750 kg draagvermogen per staander. Zonder deugdelijke fundering vervalt de garantie op het frame.
              </div>
            </div>
          </div>
        </div>
      )}
      {/* HWA upsell when surface > 24m² but plain fundering chosen */}
      {hwa&&c.fundering==="plain"&&(
        <div style={{marginTop:12}}>
          <UpsellBlock
            added={false}
            onToggle={()=>s({...c,fundering:"hwa"})}
            icon={<FunderingWarnIcon/>}
            title="Upgrade naar Betonpoeren + HWA"
            badge="Sterk aanbevolen"
            badgeColor={T.orange}
            price="+€44 extra"
            desc={`Uw dakoppervlak is ${opp} m². Bij meer dan 24 m² is HWA (hemelwaterafvoer) sterk aanbevolen om verstopping en waterschade te voorkomen. De meerprijs ten opzichte van standaard betonpoeren is slechts €44.`}
          />
        </div>
      )}
    </Wrap>
  );
}

function StepSwIntro({ c, s }) {
  return (
    <Wrap title="Glazen schuifwanden" sub="Sluit uw overkapping stijlvol af zonder lichtinval te verliezen." group="Schuifwanden"
      info={{title:"Glazen schuifwanden",video:"Schuifwand plaatsen & bedienen",intro:"Gumax® glazen schuifwanden sluiten uw overkapping volledig af tot een echte buitenkamer, zonder in te leveren op licht.",bullets:["10 mm gehard veiligheidsglas — valt uiteen in veilige korrels bij breuk","Zijdelings schuivend in aluminium rails — 1 tot 6 rails mogelijk","Steel Look variant: aluminium raamwerk op het glas voor industriële uitstraling","Zijkanten vereisen 8° glazen spieën voor aansluiting op het schuine dak","Voor- én zijkant combineren: hoekprofiel vereist voor waterdichte aansluiting"]}}>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:18}}>
        <Radio active={c.swWil===true} onClick={()=>s({...c,swWil:true})}>
          <div style={{borderRadius:8,overflow:"hidden",flexShrink:0}}>
            <Img w={88} h={68} label="Schuifwand"/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:700,color:T.green,marginBottom:3}}>Ja, ik wil glazen schuifwanden</div>
            <div style={{fontSize:12,color:T.grey,lineHeight:1.5}}>1–6 rails, 1960–5880 mm breed. Helder glas of Steel Look. Dezelfde kleur als uw overkapping.</div>
          </div>
        </Radio>
        <Radio active={c.swWil===false} onClick={()=>s({...c,swWil:false})}>
          <div style={{width:88,height:68,borderRadius:8,background:T.beige,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Icon name="close-circle" size={28} color={T.lightGrey}/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:700,color:T.green,marginBottom:3}}>Nee, nu niet</div>
            <div style={{fontSize:12,color:T.grey,lineHeight:1.5}}>Schuifwanden kunnen later los worden besteld en zijn altijd achteraf te monteren.</div>
          </div>
        </Radio>
      </div>
      {c.swWil===true&&<Note icon="info">U configureert hierna de voor- en zijkanten afzonderlijk voor de exacte maatvoeringen.</Note>}
    </Wrap>
  );
}

function SwMaten({ railsV, hoogteV, onRails, onHoogte, sl }) {
  const r=+railsV||3; const h=hoogteV||"2080";
  const p=Math.round((SW_BP[r]+(SW_HA[h]||0))*(sl==="ja"?1.18:1));
  return (
    <div style={{background:T.beige,border:`1px solid ${T.bone}`,borderRadius:8,padding:"14px 16px",marginBottom:14}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:10}} className="two-col">
        <Field label="Rails / breedte" value={railsV} onChange={onRails} opts={SW_RAILS.map(x=>({v:x.id,l:x.label}))}/>
        <Field label="Doorloophoogte"  value={hoogteV} onChange={onHoogte} opts={SW_HOOGTES.map(x=>({v:x.value,l:x.label}))}/>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <div style={{borderRadius:8,overflow:"hidden",flexShrink:0}}>
          <Img w={80} h={56} label="Preview"/>
        </div>
        <div>
          <div style={{fontSize:11,color:T.grey,marginBottom:3}}>{r} panelen · 980 mm/paneel · 10 mm gehard glas</div>
          <span className="price-hl-sm">€{p.toLocaleString("nl-NL")}</span>
        </div>
      </div>
    </div>
  );
}

function StepSwVoor({ c, s }) {
  return (
    <Wrap title="Schuifwand voorzijde" sub="Sluit de open voorzijde (positie B) van uw overkapping af." group="Schuifwanden"
      info={{title:"Voorzijde schuifwand",video:"Voorzijde configureren — rails & hoogte",intro:"De voorzijde (positie B) is de meest voorkomende plek voor een schuifwand. De wand sluit direct aan op het frame.",bullets:["1 tot 6 rails — elke rail dekt 980 mm breed, 1 paneel per rail","Hoogte van 1980 tot 2720 mm — meerprijs per 100 mm extra boven 2080 mm","6-rail systeem vereist U-profielen voor correcte aansluiting op de goot","Steel Look toeslag 18% — aluminium raamwerk op het glas"]}}>
      <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:14}}>
        <Check active={c.swVoor} onClick={()=>s({...c,swVoor:!c.swVoor})} icon="door" title="Schuifwand aan de voorzijde" desc="Meest voorkomend. Standaard aansluiting op het frame."/>
      </div>
      {c.swVoor&&<>
        <SwMaten railsV={c.swVoorRails} hoogteV={c.swVoorHoogte} onRails={v=>s({...c,swVoorRails:v})} onHoogte={v=>s({...c,swVoorHoogte:v})} sl={c.swSteellook}/>
        {/* U-profiel vereist bij 6-rail systeem op 6m+ overkapping */}
        {parseInt(c.swVoorRails)>=6&&(
          <UpsellBlock
            added={c.swUProfiel}
            onToggle={()=>s({...c,swUProfiel:!c.swUProfiel})}
            icon={<UProfielIcon/>}
            title="U-profielen aansluiting"
            badge="Vereist bij 6-rail"
            badgeColor={T.orange}
            price="+€119"
            desc="Bij een 6-rail systeem op een overkapping van 6,06 m of breder zijn U-profielen vereist voor een correcte en waterdichte aansluiting aan frame en goot."
          />
        )}
      </>}
      {!c.swVoor&&<Note color={T.midGrey} icon="info">Geen schuifwand aan de voorzijde. De voorzijde blijft open.</Note>}
    </Wrap>
  );
}

function StepSwZij({ c, s }) {
  return (
    <Wrap title="Schuifwanden zijkanten" sub="Sluit een of beide zijkanten af (positie A)." group="Schuifwanden"
      info={{title:"Zijkant schuifwanden",video:"Zijkant montage — spieën & hoekprofiel",intro:"Zijkanten sluiten de open zijdes (positie A) van de overkapping af. Door de schuin aflopende daklijn zijn 8° spieën altijd vereist.",bullets:["8° glazen spieën vereist — volgen de dakhelling voor een waterdichte aansluiting","Hoekprofiel vereist bij combinatie voor- én zijkant — dicht de hoek af","Zelfde rails en hoogtes beschikbaar als voorzijde","Prijs geldt per set — bij twee zijkanten dubbele prijs"]}}>
      <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:14}}>
        <Check active={c.swZij} onClick={()=>s({...c,swZij:!c.swZij})} icon="layout-right" title="Schuifwand aan de zijkant(en)" desc="Standaard aansluiting via glazen spie op het schuin aflopende dak."/>
      </div>
      {c.swZij&&<>
        <SwMaten railsV={c.swZijRails} hoogteV={c.swZijHoogte} onRails={v=>s({...c,swZijRails:v})} onHoogte={v=>s({...c,swZijHoogte:v})} sl={c.swSteellook}/>
        {/* Required: 8° glazen spieën */}
        <UpsellBlock
          added={c.swSpie}
          onToggle={()=>s({...c,swSpie:!c.swSpie})}
          icon={<SpieIcon/>}
          title="8° Glazen spieën"
          badge="Vereist"
          badgeColor={T.orange}
          price="+€139"
          desc="Voor correcte aansluiting op het schuin aflopende dak. Één spie per zijkant — passend voor alle standaard dakvallen. Zonder spieën past de schuifwand niet correct."
        />
        {/* Required when both voor+zij: hoekprofiel */}
        {c.swVoor&&(
          <div style={{marginTop:10}}>
            <UpsellBlock
              added={c.swHoek}
              onToggle={()=>s({...c,swHoek:!c.swHoek})}
              icon={<HoekIcon/>}
              title="Hoekprofiel voor- & zijkant"
              badge="Vereist"
              badgeColor={T.orange}
              price="+€89"
              desc="Bij combinatie van een voor- én zijkant schuifwand is een hoekprofiel vereist voor waterdichte aansluiting in de hoek van de overkapping."
            />
          </div>
        )}
      </>}
      {!c.swZij&&<Note color={T.midGrey} icon="info">Geen schuifwand aan de zijkant(en). De zijkanten blijven open.</Note>}
    </Wrap>
  );
}

function StepSwAcc({ c, s }) {
  const sl=c.swSteellook==="ja";
  return (
    <Wrap title="Type & afwerking" sub="Kies het glastype en optionele accessoires voor uw schuifwanden." group="Schuifwanden"
      info={{title:"Type glas & accessoires",video:"Standaard vs Steel Look vergelijking",intro:"Kies het glastype en optionele afwerkingen voor uw schuifwanden.",bullets:["Standaard glaswand: 10 mm gehard glas, combineerbaar met handgrepen, sier- en tochtstrips","Steel Look: aluminium raamwerk op glas voor industriële look, niet combineerbaar met handgrepen/strips","Handgrepen: greeplijst voorkomt vingerafdrukken bij schuiven","Tochtstrips: afdichting tegen tocht, muggen en regeninslag aan onderzijde","Shading panels: aluminium lamellen op hetzelfde railsysteem voor privacy en schaduw"]}}>
      <SL>Type glaswand</SL>
      <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:18}}>
        {[{id:"nee",icon:"door",name:"Standaard glaswand",desc:"10 mm gehard veiligheidsglas. Combineerbaar met alle accessoires."},{id:"ja",icon:"building",name:"Steel Look",desc:"Aluminium frame op het glas. Niet combineerbaar met handgrepen/strips.",note:"+18% toeslag"}].map(o=>(
          <Radio key={o.id} active={c.swSteellook===o.id} onClick={()=>s({...c,swSteellook:o.id})}>
            <div style={{borderRadius:8,overflow:"hidden",flexShrink:0}}>
              <Img w={88} h={68} label={o.name}/>
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3}}>
                <span style={{fontSize:13,fontWeight:700,color:T.green}}>{o.name}</span>
                {o.note&&<span style={{fontSize:9,fontWeight:800,background:T.orange,color:T.white,borderRadius:4,padding:"2px 7px",textTransform:"uppercase"}}>{o.note}</span>}
              </div>
              <div style={{fontSize:12,color:T.grey,lineHeight:1.5}}>{o.desc}</div>
            </div>
          </Radio>
        ))}
      </div>
      {sl&&<div style={{marginBottom:16}}><Note color={T.orange} icon="warning">Steel Look is niet combineerbaar met handgrepen, sierstrips en tochtstrips.</Note></div>}
      <Sep/>
      <SL>Accessoires</SL>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}} className="two-col">
        {[
          {f:"swGrep",  lb:"Handgrepen",   lock:sl, opts:[{id:"none",icon:"close-circle",t:"Geen",d:""},{id:"ja",icon:"hand",t:"Handgrepen",d:"Voorkom vingerafdrukken.",p:"+€89"}]},
          {f:"swSier",  lb:"Sierstrips",   lock:sl, opts:[{id:"none",icon:"close-circle",t:"Geen",d:""},{id:"ja",icon:"layout-col-fill",t:"Sierstrips",d:"Omringend kader.",p:"+€69"}]},
          {f:"swTocht", lb:"Tochtstrips",  lock:sl, opts:[{id:"none",icon:"close-circle",t:"Geen",d:""},{id:"ja",icon:"shield",t:"Tochtstrips",d:"Tocht & muggen.",p:"+€79"}]},
          {f:"swShading",lb:"Shading Panels",lock:false,opts:[{id:"none",icon:"close-circle",t:"Geen",d:""},{id:"ja",icon:"layout-col",t:"Shading Panel",d:"Schaduw & privacy.",p:"+€249"}]},
        ].map(g=>(
          <div key={g.f}>
            <SL>{g.lb}</SL>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {g.opts.map(o=><Check key={o.id} active={c[g.f]===o.id} onClick={()=>s({...c,[g.f]:o.id})} icon={o.icon} title={o.t} desc={o.d} price={o.p} disabled={g.lock&&o.id!=="none"}/>)}
            </div>
          </div>
        ))}
      </div>
    </Wrap>
  );
}

function StepExtraZon({ c, s }) {
  return (
    <Wrap title="Extra zonwering" sub="Voeg een Gumax® automatische zonwering toe als standalone accessoire." group="Extra's"
      info={{title:"Extra zonwering",video:"Zonwering standalone demo",intro:"Voeg een extra zonwering toe als losse aanvulling, onafhankelijk van de overkapping configuratie.",bullets:["Zelfde specificaties als de geïntegreerde zonwering","Warmtereflecterend doek — tot 15°C koeler","In dezelfde kleur als uw frame leverbaar","Achteraf toe te voegen — ook zonder bij bestelling te hebben gekozen"]}}>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <Radio active={!c.zonweringStand} onClick={()=>s({...c,zonweringStand:false})}>
          <div style={{width:88,height:68,borderRadius:8,background:T.beige,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="close-circle" size={28} color={T.lightGrey}/></div>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:T.green}}>Geen extra zonwering</div></div>
        </Radio>
        <Radio active={c.zonweringStand} onClick={()=>s({...c,zonweringStand:true})}>
          <div style={{borderRadius:8,overflow:"hidden",flexShrink:0}}><Img w={88} h={68} label="Zonwering"/></div>
          <div style={{flex:1}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3}}>
              <span style={{fontSize:13,fontWeight:700,color:T.green}}>Automatische zonwering</span>
              <span style={{fontSize:11,fontWeight:600,color:T.grey}}>+€897</span>
            </div>
            <div style={{fontSize:11,color:T.grey}}>Warmtereflecterend doek, dezelfde kleur als uw frame.</div>
          </div>
        </Radio>
      </div>
    </Wrap>
  );
}

function StepExtraShad({ c, s }) {
  return (
    <Wrap title="Shading Panels" sub="Creëer schaduw, beschutting en privacy. Combineerbaar op hetzelfde railsysteem als schuifwanden." group="Extra's"
      info={{title:"Shading Panels",video:"Shading Panels in gebruik",intro:"Aluminium lamellen die horizontaal schuiven op hetzelfde rail als uw schuifwanden. Ideaal voor privacy en hittewering.",bullets:["Aluminium lamellen in dezelfde kleur als uw frame","Combineerbaar op hetzelfde railsysteem als de glazen schuifwanden","Biedt schaduw én privacy zonder lichtinval volledig te blokkeren","Ook los te bestellen als aanvulling achteraf"]}}>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <Radio active={!c.shadingStand} onClick={()=>s({...c,shadingStand:false})}>
          <div style={{width:88,height:68,borderRadius:8,background:T.beige,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="close-circle" size={28} color={T.lightGrey}/></div>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:T.green}}>Geen shading panels</div></div>
        </Radio>
        <Radio active={c.shadingStand} onClick={()=>s({...c,shadingStand:true})}>
          <div style={{borderRadius:8,overflow:"hidden",flexShrink:0}}><Img w={88} h={68} label="Shading"/></div>
          <div style={{flex:1}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3}}>
              <span style={{fontSize:13,fontWeight:700,color:T.green}}>Shading Panels</span>
              <span style={{fontSize:11,fontWeight:600,color:T.grey}}>+€249</span>
            </div>
            <div style={{fontSize:11,color:T.grey}}>Aluminium lamellen. Schaduw & privacy naar wens.</div>
          </div>
        </Radio>
      </div>
    </Wrap>
  );
}

/* ─── ACCORDION COMPONENT (shared by Overzicht + can be reused) ─── */
function Accordion({ label, price, rows, defaultOpen=true, badge=null }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{borderRadius:8,overflow:"hidden",border:`1px solid ${T.lightGrey}`,marginBottom:10}}>
      <button onClick={()=>setOpen(o=>!o)} style={{
        width:"100%",background:T.green,border:"none",
        padding:"10px 15px",cursor:"pointer",fontFamily:"inherit",
        display:"flex",justifyContent:"space-between",alignItems:"center",
      }}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:11,fontWeight:700,color:T.white,textTransform:"uppercase",letterSpacing:".07em"}}>{label}</span>
          {badge&&<span style={{fontSize:9,fontWeight:800,background:T.orange,color:T.white,borderRadius:4,padding:"1px 6px"}}>{badge}</span>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {price>0
            ? <span className="price-hl-sm">€{price.toLocaleString("nl-NL")}</span>
            : <span style={{fontSize:11,color:"rgba(255,255,255,.45)",fontStyle:"italic"}}>Prijs volgt</span>
          }
          <Icon name={open?"chevron-down":"arrow-right"} size={13} color="rgba(255,255,255,.65)"/>
        </div>
      </button>
      {open&&(
        <div>
          {rows.length===0&&(
            <div style={{padding:"11px 15px",fontSize:12,color:T.midGrey,fontStyle:"italic"}}>Nog geen keuzes gemaakt.</div>
          )}
          {rows.map(([l,v],i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 15px",background:i%2===0?T.white:T.beige,fontSize:12}}>
              <span style={{color:T.grey,fontWeight:500}}>{l}</span>
              <span style={{fontWeight:700,color:T.green,textAlign:"right",maxWidth:"55%"}}>{v||"–"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OverzichtAccordions({ secs, price }) {
  // Each accordion is independently togglable; Prijsoverzicht has its own state too
  const [priceOpen, setPriceOpen] = useState(true);
  return (
    <div style={{marginBottom:18}}>
      {secs.map((sec,si)=>(
        <Accordion key={`sec-${si}`} label={sec.label} price={sec.price} rows={sec.rows} defaultOpen={true}/>
      ))}
      {/* Prijsoverzicht — own independent state */}
      <div style={{borderRadius:8,overflow:"hidden",border:`1px solid ${T.lightGrey}`,marginBottom:10}}>
        <button onClick={()=>setPriceOpen(o=>!o)} style={{
          width:"100%",background:T.green,border:"none",
          padding:"10px 15px",cursor:"pointer",fontFamily:"inherit",
          display:"flex",justifyContent:"space-between",alignItems:"center",
        }}>
          <span style={{fontSize:11,fontWeight:700,color:T.white,textTransform:"uppercase",letterSpacing:".07em"}}>Prijsoverzicht</span>
          <Icon name={priceOpen?"chevron-down":"arrow-right"} size={13} color="rgba(255,255,255,.65)"/>
        </button>
        {priceOpen&&(
          <div style={{background:T.white}}>
            {secs.map((sec,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 15px",background:i%2===0?T.white:T.beige,fontSize:12}}>
                <span style={{color:T.grey,fontWeight:500}}>{sec.label}</span>
                <span style={{fontWeight:700,color:T.green}}>€{sec.price.toLocaleString("nl-NL")}</span>
              </div>
            ))}
            <div style={{borderTop:`1px solid ${T.lightGrey}`,padding:"11px 15px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontWeight:700,fontSize:14,color:T.green}}>Totaal incl. BTW</span>
              <span className="price-hl">€{price.toLocaleString("nl-NL")}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepOverzicht({ c, price }) {
  const lijn=LIJNEN.find(l=>l.id===c.lijn), stijl=STIJLEN.find(x=>x.id===c.stijl);
  const kleur=KLEUREN.find(k=>k.id===c.kleur), dak=DAKTYPEN[c.lijn||"glass"]?.find(d=>d.id===c.dakSub);
  const breedte=c.breedte||"–", diepte=c.diepte||"–";
  const opp=c.breedte&&c.diepte?(parseFloat(c.breedte)*parseFloat(c.diepte)).toFixed(1):"–";
  const oBas=c.lijn&&c.breedte&&c.diepte?Math.round(O_BASE[c.lijn]*O_DM[c.diepte]*O_WM[c.breedte]):0;
  const oExt=(c.led==="spots"?173:c.led==="system"?289:0)+(c.zonwering==="auto"?897:0)+(c.fundering==="plain"?54:c.fundering==="hwa"?98:0);
  let swVP=0,swZP=0;
  if(c.swVoor){const r=+c.swVoorRails||3;swVP=Math.round((SW_BP[r]+(SW_HA[c.swVoorHoogte]||0))*(c.swSteellook==="ja"?1.18:1));}
  if(c.swZij) {const r=+c.swZijRails||2; swZP=Math.round((SW_BP[r]+(SW_HA[c.swZijHoogte]||0))*(c.swSteellook==="ja"?1.18:1));}
  const swA=(c.swGrep==="ja"?89:0)+(c.swSier==="ja"?69:0)+(c.swTocht==="ja"?79:0)+(c.swShading==="ja"?249:0);
  const spieP = c.swSpie&&c.swZij ? 139 : 0;
  const hoekP = c.swHoek&&c.swVoor&&c.swZij ? 89 : 0;
  const uP    = c.swUProfiel ? 119 : 0;
  const ctrlP = c.ledController ? 149 : 0;
  const staP  = c.extraStaander ? 189 : 0;
  const extP=(c.zonweringStand?897:0);
  const allSwAcc = swA+spieP+hoekP+uP;
  const secs=[
    {label:"Terrasoverkapping",color:T.green,rows:[
      ["Productlijn",     lijn?.name||"–"],
      ["Stijl",           stijl?.name||"–"],
      ["Kleur",           kleur?`${kleur.name} (${kleur.ral})`:"–"],
      ["Daktype",         dak?.name||"–"],
      ["Afmetingen",      breedte!=="–"?`${breedte} × ${diepte} m (${opp} m²)`:"–"],
      ["Doorloophoogte",  c.hoogte?`${c.hoogte} m`:"–"],
      c.extraStaander?["Extra tussenstaander","+€189"]:null,
      ["Verlichting",     c.led==="none"?"Geen":c.led==="spots"?"LED Spots":"Lighting System"],
      c.ledController?["LED controller","+€149"]:null,
      ["Zonwering",       c.zonwering==="auto"?"Automatisch":"Geen"],
      ["Fundering",       c.fundering==="none"||!c.fundering?"Geen":c.fundering==="plain"?"Betonpoeren":"Betonpoeren + HWA"],
    ].filter(Boolean),price:oBas+oExt+ctrlP+staP},
    c.swVoor?{label:"Schuifwand voorzijde",color:T.green,rows:[
      ["Rails",`${c.swVoorRails}-rail`],["Hoogte",`${c.swVoorHoogte} mm`],
      ["Type",c.swSteellook==="ja"?"Steel Look":"Standaard"],
      c.swUProfiel?["U-profielen","+€119"]:null,
    ].filter(Boolean),price:swVP+uP}:null,
    c.swZij?{label:"Schuifwand zijkant(en)",color:T.green,rows:[
      ["Rails",`${c.swZijRails}-rail`],["Hoogte",`${c.swZijHoogte} mm`],
      ["Type",c.swSteellook==="ja"?"Steel Look":"Standaard"],
      c.swSpie?["8° Glazen spieën","+€139"]:null,
    ].filter(Boolean),price:swZP+spieP}:null,
    (c.swVoor||c.swZij)&&(swA+hoekP)>0?{label:"Accessoires schuifwanden",color:T.green,rows:[
      c.swGrep==="ja"?  ["Handgrepen",    "+€89"]:null,
      c.swSier==="ja"?  ["Sierstrips",    "+€69"]:null,
      c.swTocht==="ja"? ["Tochtstrips",   "+€79"]:null,
      c.swShading==="ja"?["Shading",      "+€249"]:null,
      c.swHoek&&c.swVoor&&c.swZij?["Hoekprofiel","+€89"]:null,
    ].filter(Boolean),price:swA+hoekP}:null,
    extP>0?{label:"Extra's",color:T.green,rows:[
      c.zonweringStand?["Zonwering standalone","+€897"]:null,
    ].filter(Boolean),price:extP}:null,
  ].filter(Boolean);

  return (
    <Wrap title="Overzicht & bestellen" sub="Controleer uw volledige configuratie voor u bestelt." group="Bestellen">
      <OverzichtAccordions secs={secs} price={price}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}} className="two-col">
        {[["truck","Gratis levering NL & BE"],["shield","10 jaar garantie"],["price-tag","Laagste prijsgarantie"],["tools","Compleet bouwpakket"],["store","365 dgn afhalen Eindhoven"],["customer-svc","085 060 7000 · ma–za"]].map(([ic,t])=>(
          <div key={t} style={{display:"flex",gap:8,alignItems:"center",fontSize:12,color:T.grey}}>
            <Icon name={ic} size={14} color={T.lime}/>{t}
          </div>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <button style={{background:T.lime,color:T.white,border:"none",borderBottom:`4px solid ${T.limeDark}`,borderRadius:4,padding:"12px 24px 8px",fontSize:14,fontWeight:700,cursor:"pointer",width:"100%",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <Icon name="cart" size={15} color={T.white}/>Alles in winkelwagen plaatsen
        </button>
        <button style={{background:"transparent",color:T.green,border:`1.5px solid ${T.green}`,borderRadius:4,padding:"10px 24px",fontSize:13,fontWeight:600,cursor:"pointer",width:"100%",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <Icon name="mail" size={14} color={T.green}/>Vrijblijvende offerte aanvragen
        </button>
        <div style={{textAlign:"center",fontSize:11,color:T.midGrey,marginTop:2,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}><Icon name="customer-svc" size={12} color={T.midGrey}/>085 060 7000 · ma–vr 8–18 u · za 9–16 u</div>
      </div>
    </Wrap>
  );
}

/* ─── STEP BAR ─── */
function StepBar({ steps, current, maxReached, onGo }) {
  const ref=useRef(null);
  const [l,sl]=useState(false);
  const [r,sr]=useState(false);
  const m=useCallback(()=>{const el=ref.current;if(!el)return;sl(el.scrollLeft>3);sr(el.scrollLeft<el.scrollWidth-el.clientWidth-3);},[]);
  useEffect(()=>{const el=ref.current;if(!el)return;m();el.addEventListener("scroll",m,{passive:true});const ro=new ResizeObserver(m);ro.observe(el);return()=>{el.removeEventListener("scroll",m);ro.disconnect();};},[m]);
  useEffect(()=>{const el=ref.current;if(!el)return;const btn=el.querySelectorAll("button")[current];btn?.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"});},[current]);
  return (
    <div style={{position:"relative",background:T.white,borderBottom:`1px solid ${T.lightGrey}`}}>
      {l&&<div style={{position:"absolute",left:0,top:0,bottom:0,width:36,zIndex:2,background:`linear-gradient(to right,${T.white},transparent)`,pointerEvents:"none"}}/>}
      {r&&<div style={{position:"absolute",right:0,top:0,bottom:0,width:36,zIndex:2,background:`linear-gradient(to left,${T.white},transparent)`,pointerEvents:"none"}}/>}
      <div ref={ref} style={{display:"flex",overflowX:"auto",scrollbarWidth:"none"}}>
        {steps.map((s,i)=>{
          const done   = i < current;
          const active = i === current;
          const future = i > maxReached;
          const can    = i <= maxReached;
          // circle: active→green, done→lime, unlocked-not-current→lime, locked→lightGrey
          const circBg  = active ? T.green : done ? T.lime : can ? T.lime : T.lightGrey;
          // label: active→green, done/can→midGrey, locked→lightGrey
          const labelCol = active ? T.green : can ? T.midGrey : T.lightGrey;
          return (
            <button
              key={s.id}
              onClick={()=>can&&onGo(i)}
              disabled={!can}
              title={future?"Vul eerst de vorige stappen in":""}
              style={{
                flex:"0 0 auto",border:"none",background:"none",
                padding:"10px 13px 8px",
                cursor:can?"pointer":"not-allowed",
                borderBottom:`2.5px solid ${active?T.green:"transparent"}`,
                fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:4,
                minWidth:62,transition:"border-color .2s",
                opacity:future?0.32:1,
              }}>
              <div style={{
                width:22,height:22,borderRadius:"50%",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:10,fontWeight:800,
                color:can||active?T.white:T.grey,
                background:circBg,
                transition:"background .2s",
              }}>
                {(done||can)&&!active ? <Icon name="check" size={11} color={T.white}/> : i+1}
              </div>
              <div style={{
                fontSize:9,fontWeight:active?700:600,whiteSpace:"nowrap",
                color:labelCol,
                textTransform:"uppercase",letterSpacing:".04em",
              }}>{s.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── SUMMARY STRIP ─── */
function Strip({ c, price, onOpenDrawer }) {
  const kleur=KLEUREN.find(k=>k.id===c.kleur);
  const pills=[
    c.lijn   ? {label:LIJNEN.find(l=>l.id===c.lijn)?.name}    : null,
    c.stijl  ? {label:STIJLEN.find(x=>x.id===c.stijl)?.name}  : null,
    c.kleur&&kleur ? {dot:kleur.hex, label:kleur.name}          : null,
    c.dakSub ? {label:DAKTYPEN[c.lijn||"glass"]?.find(d=>d.id===c.dakSub)?.name} : null,
    c.breedte&&c.diepte ? {label:`${c.breedte}×${c.diepte}m`} : null,
    c.led!=="none"   ? {label:c.led==="spots"?"LED Spots":"Lighting System"} : null,
    c.zonwering==="auto" ? {label:"Zonwering"}     : null,
    c.fundering&&c.fundering!=="none" ? {label:c.fundering==="hwa"?"Poeren+HWA":"Betonpoeren"} : null,
    c.swVoor         ? {label:"SW voor"}           : null,
    c.swZij          ? {label:"SW zijkant"}        : null,
    c.swSpie         ? {label:"Spieën +€139"}      : null,
  ].filter(x=>x&&x.label);

  const scrollRef=useRef(null);
  const [fadeL,setFL]=useState(false);
  const [fadeR,setFR]=useState(false);
  const measure=useCallback(()=>{
    const el=scrollRef.current; if(!el) return;
    setFL(el.scrollLeft>3);
    setFR(el.scrollLeft<el.scrollWidth-el.clientWidth-3);
  },[]);
  useEffect(()=>{
    const el=scrollRef.current; if(!el) return;
    measure();
    el.addEventListener("scroll",measure,{passive:true});
    const ro=new ResizeObserver(measure); ro.observe(el);
    return()=>{el.removeEventListener("scroll",measure);ro.disconnect();};
  },[measure]);

  return (
    <div style={{
      background:T.beige,borderBottom:`1px solid ${T.bone}`,
      display:"flex",alignItems:"stretch",height:38,
    }}>
      {/* Scrollable pills area */}
      <div style={{flex:1,position:"relative",minWidth:0,overflow:"hidden"}}>
        {fadeL&&<div style={{position:"absolute",left:0,top:0,bottom:0,width:36,zIndex:2,background:`linear-gradient(to right,${T.beige},transparent)`,pointerEvents:"none"}}/>}
        {fadeR&&<div style={{position:"absolute",right:0,top:0,bottom:0,width:36,zIndex:2,background:`linear-gradient(to left,${T.beige},transparent)`,pointerEvents:"none"}}/>}
        <div ref={scrollRef} style={{display:"flex",alignItems:"center",gap:6,height:"100%",overflowX:"auto",scrollbarWidth:"none",WebkitOverflowScrolling:"touch",padding:"0 14px"}}>
          <span style={{fontSize:9,fontWeight:700,color:T.midGrey,textTransform:"uppercase",letterSpacing:".08em",flexShrink:0}}>Keuzes:</span>
          {pills.length===0&&(
            <span style={{fontSize:11,color:T.midGrey,fontStyle:"italic",flexShrink:0}}>Nog geen keuzes gemaakt</span>
          )}
          {pills.map((p,i)=>(
            <span key={i} style={{display:"inline-flex",alignItems:"center",gap:5,background:T.white,border:`1px solid ${T.bone}`,borderRadius:4,padding:"2px 9px",fontSize:11,fontWeight:700,color:T.green,flexShrink:0,whiteSpace:"nowrap"}}>
              {p.dot&&<span style={{width:9,height:9,borderRadius:"50%",background:p.dot,display:"inline-block",border:`1px solid ${T.lightGrey}`,flexShrink:0}}/>}
              {p.label}
            </span>
          ))}
        </div>
      </div>
      {/* Fixed price — always visible, opens drawer */}
      <button onClick={onOpenDrawer} style={{
        flexShrink:0,display:"flex",alignItems:"center",
        padding:"0 14px 0 10px",borderLeft:`1px solid ${T.bone}`,
        gap:6,background:"transparent",border:"none",cursor:"pointer",
        height:"100%",
      }}>
        <span style={{fontSize:9,fontWeight:700,color:T.midGrey,textTransform:"uppercase",letterSpacing:".06em"}}>
          {price>0?"Totaal":"Prijs"}
        </span>
        <span className="price-hl-sm">
          {price>0?`€${price.toLocaleString("nl-NL")}`:"—"}
        </span>
        <Icon name="chevron-down" size={11} color={T.grey}/>
      </button>
    </div>
  );
}

/* ─── CONFIGURATION DRAWER ─── */

// Maps each summary row label to the step id it belongs to
const STEP_FOR_FIELD = {
  "Productlijn":"lijn",  "Stijl":"stijl",       "Kleur":"kleur",
  "Kleur RAL":"kleur",   "Dak":"dak",            "Breedte":"maten",
  "Diepte":"maten",      "Oppervlak":"maten",    "Doorloophoogte":"maten",
  "Extra tussenstaander":"maten",
  "Verlichting":"verlichting",  "LED controller":"verlichting",
  "Zonwering":"zonwering",       "Fundering":"fundering",
  "Voorzijde":"sw_voor",  "U-profielen":"sw_voor",
  "Zijkant":"sw_zij",     "8° Spieën":"sw_zij",  "Hoekprofiel":"sw_zij",
  "Type":"sw_acc",        "Handgrepen":"sw_acc",  "Sierstrips":"sw_acc",
  "Tochtstrips":"sw_acc", "Shading":"sw_acc",
  "Zonwering standalone":"extra_zon",
};

function ConfigDrawer({ c, price, open, onClose, onNavigate }) {
  const lijn   = LIJNEN.find(l=>l.id===c.lijn);
  const stijl  = STIJLEN.find(s=>s.id===c.stijl);
  const kleur  = KLEUREN.find(k=>k.id===c.kleur);
  const dak    = DAKTYPEN[c.lijn||"glass"]?.find(d=>d.id===c.dakSub);
  const opp    = c.breedte&&c.diepte ? (parseFloat(c.breedte)*parseFloat(c.diepte)).toFixed(1) : null;

  const oBas   = c.lijn&&c.breedte&&c.diepte ? Math.round(O_BASE[c.lijn]*O_DM[c.diepte]*O_WM[c.breedte]) : 0;
  const oExt   = (c.led==="spots"?173:c.led==="system"?289:0)+(c.zonwering==="auto"?897:0)+(c.fundering==="plain"?54:c.fundering==="hwa"?98:0);
  let swVP=0,swZP=0;
  if(c.swVoor){const r=+c.swVoorRails||3;swVP=Math.round((SW_BP[r]+(SW_HA[c.swVoorHoogte]||0))*(c.swSteellook==="ja"?1.18:1));}
  if(c.swZij) {const r=+c.swZijRails||2; swZP=Math.round((SW_BP[r]+(SW_HA[c.swZijHoogte]||0))*(c.swSteellook==="ja"?1.18:1));}
  const swA    = (c.swGrep==="ja"?89:0)+(c.swSier==="ja"?69:0)+(c.swTocht==="ja"?79:0)+(c.swShading==="ja"?249:0);
  const spieP  = c.swSpie&&c.swZij?139:0;
  const hoekP  = c.swHoek&&c.swVoor&&c.swZij?89:0;
  const uP     = c.swUProfiel?119:0;
  const ctrlP  = c.ledController?149:0;
  const staP   = c.extraStaander?189:0;
  const extP   = c.zonweringStand?897:0;

  const sections = [
    { label:"Terrasoverkapping", price:oBas+oExt+ctrlP+staP, complete:oBas>0, rows:[
      {l:"Productlijn",     v:lijn?.name,             dot:null},
      {l:"Stijl",           v:stijl?.name,            dot:null},
      {l:"Kleur",           v:kleur?.name,            dot:kleur?.hex},
      {l:"Kleur RAL",       v:kleur?.ral,             dot:null},
      {l:"Dak",             v:dak?.name,              dot:null},
      {l:"Breedte",         v:c.breedte?`${c.breedte} m`:null, dot:null},
      {l:"Diepte",          v:c.diepte?`${c.diepte} m`:null,   dot:null},
      opp?{l:"Oppervlak",   v:`${opp} m²`,            dot:null}:null,
      {l:"Doorloophoogte",  v:c.hoogte?`${c.hoogte} m`:null,   dot:null},
      c.extraStaander?{l:"Extra tussenstaander",v:"+€189",dot:null}:null,
      {l:"Verlichting",     v:c.led==="none"?null:c.led==="spots"?"LED Spots":"Lighting System", dot:null},
      c.ledController?{l:"LED controller",v:"+€149",dot:null}:null,
      {l:"Zonwering",       v:c.zonwering==="auto"?"Automatisch":null, dot:null},
      {l:"Fundering",       v:c.fundering==="none"||!c.fundering?null:c.fundering==="plain"?"Betonpoeren":"Betonpoeren + HWA", dot:null},
    ].filter(r=>r&&r.v)},
    (c.swVoor||c.swZij) ? { label:"Schuifwanden", price:swVP+swZP+swA+spieP+hoekP+uP, complete:true, rows:[
      c.swVoor?{l:"Voorzijde",    v:`${c.swVoorRails}-rail · ${c.swVoorHoogte} mm`, dot:null}:null,
      c.swUProfiel?{l:"U-profielen",v:"+€119",dot:null}:null,
      c.swZij ?{l:"Zijkant",      v:`${c.swZijRails}-rail · ${c.swZijHoogte} mm`,  dot:null}:null,
      {l:"Type",                  v:c.swSteellook==="ja"?"Steel Look":"Standaard",  dot:null},
      c.swGrep==="ja"   ?{l:"Handgrepen",  v:"+€89",  dot:null}:null,
      c.swSier==="ja"   ?{l:"Sierstrips",  v:"+€69",  dot:null}:null,
      c.swTocht==="ja"  ?{l:"Tochtstrips", v:"+€79",  dot:null}:null,
      c.swShading==="ja"?{l:"Shading",     v:"+€249", dot:null}:null,
      c.swSpie&&c.swZij ?{l:"8° Spieën",   v:"+€139", dot:null}:null,
      c.swHoek&&c.swVoor&&c.swZij?{l:"Hoekprofiel",v:"+€89",dot:null}:null,
    ].filter(Boolean)} : null,
    extP>0 ? { label:"Extra's", price:extP, complete:true, rows:[
      {l:"Zonwering standalone", v:"+€897", dot:null},
    ]} : null,
  ].filter(Boolean);

  if (!open) return null;

  return (
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,24,13,.4)",zIndex:400,animation:"fadeIn .2s ease"}}/>
      <div style={{
        position:"fixed",right:0,top:0,bottom:0,
        width:"min(420px,100vw)",background:T.white,zIndex:401,
        display:"flex",flexDirection:"column",
        boxShadow:"-4px 0 32px rgba(0,48,23,.15)",
        animation:"slideIn .25s ease",
      }}>
        {/* Header */}
        <div style={{background:T.green,padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:"rgba(245,230,215,.55)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:3}}>Uw samenstelling</div>
            <div style={{fontSize:17,fontWeight:800,color:T.white,letterSpacing:"-.02em"}}>Prijsoverzicht</div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.12)",border:"none",borderRadius:4,width:34,height:34,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Icon name="close" size={16} color={T.white}/>
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{flex:1,overflowY:"auto",padding:"16px 20px 20px"}}>

          {sections.length===0&&(
            <div style={{textAlign:"center",padding:"48px 20px",color:T.midGrey}}>
              <Icon name="info" size={30} color={T.lightGrey} style={{display:"block",margin:"0 auto 12px"}}/>
              <div style={{fontSize:13,lineHeight:1.6}}>Nog geen keuzes gemaakt.<br/>Doorloop de stappen om uw overkapping samen te stellen.</div>
            </div>
          )}

          {/* Always-open sections — semantic definition list */}
          {sections.map((sec,si)=>(
            <section key={si} aria-label={sec.label} style={{marginBottom:12,borderRadius:8,overflow:"hidden",border:`1px solid ${T.lightGrey}`}}>
              {/* Section header — static, not interactive */}
              <div style={{
                background:T.green,padding:"10px 14px",
                display:"flex",justifyContent:"space-between",alignItems:"center",
              }}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <h3 style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.85)",textTransform:"uppercase",letterSpacing:".07em",margin:0}}>{sec.label}</h3>
                  {!sec.complete&&<span style={{fontSize:9,fontWeight:700,background:T.orange,color:T.white,borderRadius:4,padding:"1px 6px"}}>Onvolledig</span>}
                </div>
                {sec.price>0
                  ? <span className="price-hl-sm">€{sec.price.toLocaleString("nl-NL")}</span>
                  : <span style={{fontSize:11,color:"rgba(245,230,215,.5)",fontStyle:"italic"}}>Prijs volgt</span>
                }
              </div>
              {/* Always-visible rows — each is a navigable button */}
              {sec.rows.length===0 ? (
                <p style={{padding:"12px 14px",fontSize:12,color:T.midGrey,fontStyle:"italic",margin:0}}>
                  Nog geen keuzes gemaakt voor dit onderdeel.
                </p>
              ) : (
                <dl style={{margin:0}}>
                  {sec.rows.map((row,ri)=>{
                    const stepId = STEP_FOR_FIELD[row.l];
                    const canNav = !!stepId && !!onNavigate;
                    return (
                      <div
                        key={ri}
                        role={canNav?"group":undefined}
                        style={{
                          display:"flex",justifyContent:"space-between",alignItems:"center",
                          background:ri%2===0?T.white:T.beige,
                          transition:"background .12s",
                        }}
                        onMouseEnter={e=>{if(canNav)e.currentTarget.style.background="#f0f7e8";}}
                        onMouseLeave={e=>{e.currentTarget.style.background=ri%2===0?T.white:T.beige;}}
                      >
                        {/* Label — clickable if step known */}
                        {canNav ? (
                          <button
                            onClick={()=>onNavigate(stepId)}
                            aria-label={`Ga naar stap: ${row.l} wijzigen`}
                            style={{
                              flex:1,display:"flex",alignItems:"center",gap:7,
                              padding:"9px 14px",background:"transparent",
                              border:"none",cursor:"pointer",fontFamily:"inherit",
                              textAlign:"left",
                            }}>
                            <dt style={{
                              fontSize:12,fontWeight:600,color:T.green,margin:0,
                              textDecoration:"underline",textDecorationColor:`${T.lime}80`,
                              textUnderlineOffset:"3px",
                            }}>{row.l}</dt>
                            <Icon name="ruler" size={11} color={T.lime} style={{opacity:.7,flexShrink:0}}/>
                          </button>
                        ) : (
                          <dt style={{fontSize:12,fontWeight:500,color:T.grey,margin:0,padding:"9px 14px"}}>{row.l}</dt>
                        )}
                        {/* Value */}
                        <dd style={{display:"flex",alignItems:"center",gap:6,fontSize:12,fontWeight:700,color:T.green,textAlign:"right",maxWidth:"55%",margin:0,padding:"9px 14px 9px 0",flexShrink:0}}>
                          {row.dot&&<span style={{width:9,height:9,borderRadius:"50%",background:row.dot,border:`1px solid ${T.lightGrey}`,flexShrink:0}}/>}
                          {row.v}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              )}
            </section>
          ))}

          {/* Total */}
          {price>0&&(
            <div style={{background:T.beige,border:`1px solid ${T.bone}`,borderRadius:8,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6,marginBottom:14}}>
              <div>
                <div style={{fontSize:10,fontWeight:700,color:T.midGrey,textTransform:"uppercase",letterSpacing:".06em",marginBottom:3}}>Totaal incl. BTW</div>
                <span className="price-hl">€{price.toLocaleString("nl-NL")}</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
                <div style={{display:"flex",gap:6,alignItems:"center",fontSize:11,color:T.grey}}>
                  <Icon name="truck" size={12} color={T.lime}/>Gratis levering
                </div>
                <div style={{display:"flex",gap:6,alignItems:"center",fontSize:11,color:T.grey}}>
                  <Icon name="shield" size={12} color={T.lime}/>10 jaar garantie
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer — only show when isLast (overzicht) */}
        <div style={{flexShrink:0,padding:"14px 20px",borderTop:`1px solid ${T.lightGrey}`}}>
          <button onClick={onClose} style={{
            width:"100%",background:T.green,color:T.white,border:"none",
            borderRadius:4,padding:"12px",fontSize:13,fontWeight:700,
            fontFamily:"inherit",cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",gap:8,
          }}>
            <Icon name="close" size={14} color={T.white}/>
            Sluiten en doorgaan
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
      `}</style>
    </>
  );
}

/* ─── ROOT ─── */
export default function App() {
  const [cfg,setCfg]=useState(INIT);
  const [step,setStep]=useState(0);
  const [maxR,setMaxR]=useState(0);
  const [drawerOpen,setDrawerOpen]=useState(false);
  const topRef=useRef(null);

  useRemixIcons();
  const activeSteps=ALL_STEPS.filter(s=>!s.cond||s.cond(cfg));
  const isLast=step===activeSteps.length-1;
  const price=calcPrice(cfg);

  const goStep=(i)=>{
    setStep(i);
    setMaxR(m=>Math.max(m,i));
    topRef.current?.scrollTo({top:0,behavior:"smooth"});
  };

  const render=()=>{
    const sid=activeSteps[step]?.id;
    if(sid==="lijn")        return <StepLijn       c={cfg} s={setCfg}/>;
    if(sid==="stijl")       return <StepStijl      c={cfg} s={setCfg}/>;
    if(sid==="kleur")       return <StepKleur      c={cfg} s={setCfg}/>;
    if(sid==="dak")         return <StepDak        c={cfg} s={setCfg}/>;
    if(sid==="maten")       return <StepMaten      c={cfg} s={setCfg}/>;
    if(sid==="verlichting") return <StepVerlichting c={cfg} s={setCfg}/>;
    if(sid==="zonwering")   return <StepZonwering  c={cfg} s={setCfg}/>;
    if(sid==="fundering")   return <StepFundering  c={cfg} s={setCfg}/>;
    if(sid==="sw_intro")    return <StepSwIntro    c={cfg} s={setCfg}/>;
    if(sid==="sw_voor")     return <StepSwVoor     c={cfg} s={setCfg}/>;
    if(sid==="sw_zij")      return <StepSwZij      c={cfg} s={setCfg}/>;
    if(sid==="sw_acc")      return <StepSwAcc      c={cfg} s={setCfg}/>;
    if(sid==="extra_zon")   return <StepExtraZon   c={cfg} s={setCfg}/>;
    if(sid==="overzicht")   return <StepOverzicht  c={cfg} price={price}/>;
    return null;
  };

  return (
    <div style={{fontFamily:"'Inter','Open Sans',sans-serif",background:T.beige,height:"100vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <style>{CSS}</style>

      {/* DRAWER */}
      <ConfigDrawer c={cfg} price={price} open={drawerOpen} onClose={()=>setDrawerOpen(false)} onNavigate={(stepId)=>{
        const idx=activeSteps.findIndex(s=>s.id===stepId);
        if(idx>=0){goStep(idx);}
        setDrawerOpen(false);
      }}/>

      {/* STEP BAR */}
      <div style={{flexShrink:0}}>
        <StepBar steps={activeSteps} current={step} maxReached={maxR} onGo={goStep}/>
      </div>
      {/* SUMMARY STRIP */}
      <div style={{flexShrink:0}}>
        <Strip c={cfg} price={price} onOpenDrawer={()=>setDrawerOpen(true)}/>
      </div>
      {/* BODY */}
      <div ref={topRef} style={{flex:1,overflowY:"auto",overflowX:"hidden"}}>
        <div style={{maxWidth:680,margin:"0 auto",padding:"28px 18px 120px"}}>
          {render()}
        </div>
      </div>
      {/* FOOTER */}
      <div style={{flexShrink:0,background:T.white,borderTop:`1px solid ${T.lightGrey}`,boxShadow:"0 -2px 14px rgba(0,48,23,.06)",zIndex:200}}>
        <div style={{maxWidth:680,margin:"0 auto",padding:"10px 18px",display:"flex",alignItems:"center",gap:12}}>

          {/* ← Back */}
          <button
            onClick={()=>goStep(Math.max(step-1,0))}
            disabled={step===0}
            style={{
              background:"transparent",
              border:`1.5px solid ${step===0?T.lightGrey:T.lightGrey}`,
              borderRadius:4,padding:"9px 14px",fontSize:13,fontWeight:700,
              color:step===0?T.lightGrey:T.grey,
              fontFamily:"inherit",flexShrink:0,
              display:"flex",alignItems:"center",gap:5,
              cursor:step===0?"not-allowed":"pointer",
            }}>
            <Icon name="arrow-left" size={14} color={step===0?T.lightGrey:T.grey}/>
            <span className="hide-xs" style={{fontSize:12}}>Terug</span>
          </button>

          {/* Centred price — tap to open drawer */}
          <button onClick={()=>setDrawerOpen(true)} style={{
            flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:1,
            background:"transparent",border:"none",cursor:"pointer",fontFamily:"inherit",
            padding:"4px 0",
          }}>
            <div style={{fontSize:9,fontWeight:700,color:T.midGrey,textTransform:"uppercase",letterSpacing:".08em",display:"flex",alignItems:"center",gap:4}}>
              Prijs samenstelling
              <Icon name="chevron-down" size={10} color={T.midGrey}/>
            </div>
            <span className="price-hl" style={{fontSize:18}}>
              {price>0?`€${price.toLocaleString("nl-NL")}`:"\u2013"}
            </span>
          </button>

          {/* Volgende / Bestellen */}
          {(()=>{
            const sid = activeSteps[step]?.id;
            const ok  = canAdvance(sid, cfg);
            if (!isLast) return (
              <button
                onClick={()=>ok&&goStep(Math.min(step+1,activeSteps.length-1))}
                disabled={!ok}
                title={!ok?"Maak eerst een keuze om verder te gaan":""}
                style={{
                  background:T.lime,
                  color:T.white,
                  border:"none",
                  borderBottom:`4px solid ${T.limeDark}`,
                  borderRadius:4,padding:"12px 24px 8px 24px",fontSize:14,fontWeight:700,
                  fontFamily:"inherit",flexShrink:0,
                  display:"flex",alignItems:"center",gap:6,
                  cursor:ok?"pointer":"not-allowed",
                  opacity: ok ? 1 : 0.5,
                  transition:"opacity .15s",
                }}
                onMouseEnter={e=>{if(ok)e.currentTarget.style.background=T.limeDark;}}
                onMouseLeave={e=>{if(ok)e.currentTarget.style.background=T.lime;}}>
                Volgende
                <Icon name="arrow-right" size={14} color={T.white}/>
              </button>
            );
            return (
              <button
                onClick={()=>ok&&null}
                disabled={!ok}
                style={{
                  background:T.lime,
                  color:T.white,
                  border:"none",
                  borderBottom:`4px solid ${T.limeDark}`,
                  borderRadius:4,padding:"12px 24px 8px 24px",fontSize:14,fontWeight:700,
                  fontFamily:"inherit",flexShrink:0,
                  display:"flex",alignItems:"center",gap:6,
                  cursor:ok?"pointer":"not-allowed",
                  opacity:ok?1:0.5,
                }}>
                <Icon name="cart" size={14} color={T.white}/>
                Bestellen
              </button>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
