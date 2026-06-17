import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./index.css";
import dysonImg from "./assets/dyson.png";
import nomiMascot from "./assets/nomi-mascot.png";
import predictImg from "./assets/Predict-Pro.png";
import aiSendImg from "./assets/AI_send.png";
import creditCardImg from "./assets/CreditCard.png";
import fifaImg from "./assets/spidey-fifa.png";
import bubbleNavImg from "./assets/bubblenavbar.png";
import xPvc from "./assets/x-pvc.png";
import linkedinPvc from "./assets/linkedin-pvc.png";
import githubPvc from "./assets/github-pvc.png";
import resumePvc from "./assets/resume-pvc.png";
import resumePdf from "../yash1.pdf";
import avatarPvc from "./assets/avatar-pvc.png";
import talkamoreImg from "./assets/talkamore-mobile.jpg";
import talkamoreWebImg from "./assets/talkamore-web.jpg";
import talkamoreLogo from "./assets/talkamore-logo.png";
import kraneAppsLogo from "./assets/kraneapps-logo.png";
import superteamLogo from "./assets/superteam-logo.png";
import reactPvc from "./assets/react-pvc.png";
import typescriptPvc from "./assets/typescript-pvc.png";
import gsapPvc from "./assets/gsap-pvc.png";
import framerPvc from "./assets/framer-pvc.png";
import nextjsPvc from "./assets/nextjs-pvc.png";
import tailwindPvc from "./assets/tailwind-pvc.png";
import nodePvc from "./assets/node-pvc.png";
import figmaPvc from "./assets/figma-pvc.png";
import threejsPvc from "./assets/threejs-pvc.png";
import rivePvc from "./assets/rive-pvc.png";
import yashLeather from "./assets/yash-leather.png";
import character from "./assets/character.png";
import popBombSfx from "./assets/pop-bomb.mp3";
import popNomiSfx from "./assets/pop-nomi.mp3";

const INK = "#111111";
const BLUE = "#4b63ff";

/* ---- playful pop SFX — the bomb and NOMI get their own distinct pop ----
   Each sound is a single preloaded element retriggered via currentTime=0.
   Browsers gate audio behind a user gesture, so on the first pointer/key
   interaction we "unlock" every clip (muted play→pause) — that way the
   hover-triggered bomb can still sound. play() rejections are swallowed. */
const sfxPool: HTMLAudioElement[] = [];
function makePop(src: string, volume: number): () => void {
  let el: HTMLAudioElement | null = null;
  if (typeof Audio !== "undefined") {
    el = new Audio(src);
    el.preload = "auto";
    el.volume = volume;
    sfxPool.push(el);
  }
  return () => {
    if (!el) return;
    try {
      el.currentTime = 0;
      const p = el.play();
      if (p) p.catch(() => {});
    } catch { /* ignore */ }
  };
}
const playBombPop = makePop(popBombSfx, 0.6);
const playNomiPop = makePop(popNomiSfx, 0.5);

if (typeof window !== "undefined") {
  const unlockSfx = () => {
    sfxPool.forEach((a) => {
      a.muted = true;
      const p = a.play();
      const reset = () => { a.pause(); a.currentTime = 0; a.muted = false; };
      if (p) p.then(reset).catch(() => { a.muted = false; });
      else reset();
    });
    window.removeEventListener("pointerdown", unlockSfx);
    window.removeEventListener("keydown", unlockSfx);
  };
  window.addEventListener("pointerdown", unlockSfx);
  window.addEventListener("keydown", unlockSfx);
}

/* ================================================================== */
/*  WORDMARK — Bagel Fat One bubble letterforms rendered as an inflated */
/*  latex object via the #balloon inflate filter (tube volume from a    */
/*  blurred-alpha height field) + hand-placed gloss. Blur+composite     */
/*  only, so it's smooth at any resolution with no lighting banding.    */
/*  Each letter is its own HTML <div> so transforms are cheap GPU       */
/*  composites of a cached layer, not per-frame filter re-rasters.      */
/* ================================================================== */

const CW: Record<string, number> = { Y: 0.7, A: 0.7, S: 0.64, H: 0.72 };

/* hand-tuned gloss highlights per letter (fractions of the letter cell) */
const HI: Array<Array<{ fx: number; fy: number; fw: number; fh: number; rot: number; o: number }>> = [
  [ // Y
    { fx: 0.05, fy: 0.1, fw: 0.27, fh: 0.1, rot: 36, o: 0.95 },
    { fx: 0.46, fy: 0.07, fw: 0.24, fh: 0.09, rot: -30, o: 0.95 },
    { fx: 0.32, fy: 0.52, fw: 0.09, fh: 0.28, rot: 2, o: 0.63 },
    { fx: 0.14, fy: 0.3, fw: 0.07, fh: 0.07, rot: 0, o: 0.46 },
  ],
  [ // A
    { fx: 0.26, fy: 0.05, fw: 0.28, fh: 0.1, rot: 7, o: 0.95 },
    { fx: 0.08, fy: 0.42, fw: 0.1, fh: 0.32, rot: 13, o: 0.69 },
    { fx: 0.6, fy: 0.45, fw: 0.09, fh: 0.26, rot: -11, o: 0.52 },
    { fx: 0.49, fy: 0.22, fw: 0.07, fh: 0.07, rot: 0, o: 0.46 },
  ],
  [ // S
    { fx: 0.2, fy: 0.05, fw: 0.31, fh: 0.1, rot: -12, o: 0.95 },
    { fx: 0.25, fy: 0.6, fw: 0.28, fh: 0.1, rot: -10, o: 0.75 },
    { fx: 0.12, fy: 0.34, fw: 0.08, fh: 0.08, rot: 0, o: 0.46 },
  ],
  [ // H
    { fx: 0.07, fy: 0.08, fw: 0.11, fh: 0.34, rot: 2, o: 0.95 },
    { fx: 0.56, fy: 0.07, fw: 0.11, fh: 0.36, rot: -2, o: 0.95 },
    { fx: 0.34, fy: 0.43, fw: 0.15, fh: 0.08, rot: 1, o: 0.57 },
    { fx: 0.1, fy: 0.66, fw: 0.08, fh: 0.16, rot: 2, o: 0.4 },
  ],
];

/* per-letter character: tilt + horizontal squeeze, matched to the reference
   (Y leans right, A upright + wears the crown, S straight & squeezed, H slight tilt) */
const LETTERS = [
  { c: "Y", rot: 7, sx: 1.0, crown: false },
  { c: "A", rot: 0, sx: 1.0, crown: true },
  { c: "S", rot: -1, sx: 0.9, crown: false },
  { c: "H", rot: 4, sx: 1.0, crown: false },
];
const KERN = 0.85; // < 1 → letters overlap & touch like the reference

function GlobalDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        {/* dimmed soft-gray body (the "low-opacity black layer") — white reflections
            are painted on top so they pop against it, like the reference */}
        {/* A's stuffed triangular counter: sunken floor, deep/dark at top → light bounce at base */}
        <linearGradient id="counterFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#454039" />
          <stop offset="0.5" stopColor="#b3ab9c" />
          <stop offset="1" stopColor="#ece8df" />
        </linearGradient>
        {/* BODY: bright (not pure-white) top-left → warm grey lower-right, so the pure-white
            speculars on top read as glossy pops against the diffuse surface */}
        <radialGradient id="latexBase" cx="0.37" cy="0.15" r="1.06">
          <stop offset="0" stopColor="#fdfcf8" />
          <stop offset="0.36" stopColor="#eeeae1" />
          <stop offset="0.68" stopColor="#d8d0c0" />
          <stop offset="1" stopColor="#c0b7a4" />
        </radialGradient>
        {/* INFLATE — crisp rounded silhouette + soft form shadow + crease + rim light */}
        <filter id="balloon" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          {/* 1. round corners CRISPLY: blur then steep alpha threshold (keeps a ~1px AA edge so
                the A's triangle & H joints go soft/fluffy but the silhouette stays sharp) */}
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="gb" />
          <feColorMatrix in="gb" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 13 -5.7" result="rGraphic" />
          <feColorMatrix in="rGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="rAlpha" />

          {/* height field (recess detection) off the rounded shape */}
          <feGaussianBlur in="rAlpha" stdDeviation="13" result="h" />
          {/* 2. FORM SHADOW — lower-right crescent, warm grey, soft (volume not darkness) */}
          <feOffset in="rAlpha" dx="-20" dy="-24" result="aUL" />
          <feComposite in="rAlpha" in2="aUL" operator="out" result="shA" />
          <feComposite in="shA" in2="rAlpha" operator="in" result="shClip" />
          <feGaussianBlur in="shClip" stdDeviation="11" result="shB" />
          <feComposite in="shB" in2="rAlpha" operator="in" result="shClip2" />
          <feFlood floodColor="#b6ac98" floodOpacity="0.62" result="shCol" />
          <feComposite in="shCol" in2="shClip2" operator="in" result="shade" />
          {/* 3. CREASE / recess — valley where lobes meet (light grey, not black) */}
          <feComponentTransfer in="h" result="coreTight">
            <feFuncA type="table" tableValues="0 0 0 0 0.1 0.5 0.85 1" />
          </feComponentTransfer>
          <feComposite in="rAlpha" in2="coreTight" operator="out" result="seamA" />
          <feComposite in="seamA" in2="rAlpha" operator="in" result="seamC" />
          <feGaussianBlur in="seamC" stdDeviation="5" result="seamB" />
          <feFlood floodColor="#9b9180" floodOpacity="0.34" result="seamCol" />
          <feComposite in="seamCol" in2="seamB" operator="in" result="seam" />
          {/* 4. RIM LIGHT — top-left edge, bright white */}
          <feOffset in="rAlpha" dx="16" dy="19" result="aDR" />
          <feComposite in="rAlpha" in2="aDR" operator="out" result="hiA" />
          <feComposite in="hiA" in2="rAlpha" operator="in" result="hiC" />
          <feGaussianBlur in="hiC" stdDeviation="5" result="hiB" />
          <feFlood floodColor="#ffffff" floodOpacity="0.95" result="hiCol" />
          <feComposite in="hiCol" in2="hiB" operator="in" result="hi" />
          <feMerge>
            <feMergeNode in="rGraphic" />
            <feMergeNode in="shade" />
            <feMergeNode in="seam" />
            <feMergeNode in="hi" />
          </feMerge>
        </filter>
        <filter id="b7" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="5" /></filter>
        <filter id="b7mid" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.4" /></filter>
        <filter id="b7tight" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.1" /></filter>

        {/* same inflated PVC material as the hero letters, but WITHOUT the dark
            outline node — used for the tech-stack pills (clean, borderless bubble) */}
        <filter id="balloonClean" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="gb" />
          <feColorMatrix in="gb" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 13 -5.7" result="rGraphic" />
          <feColorMatrix in="rGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="rAlpha" />
          {/* FORM SHADOW — lower-right crescent, warm grey, soft */}
          <feOffset in="rAlpha" dx="-20" dy="-24" result="aUL" />
          <feComposite in="rAlpha" in2="aUL" operator="out" result="shA" />
          <feComposite in="shA" in2="rAlpha" operator="in" result="shClip" />
          <feGaussianBlur in="shClip" stdDeviation="11" result="shB" />
          <feComposite in="shB" in2="rAlpha" operator="in" result="shClip2" />
          <feFlood floodColor="#b6ac98" floodOpacity="0.62" result="shCol" />
          <feComposite in="shCol" in2="shClip2" operator="in" result="shade" />
          {/* RIM LIGHT — top-left edge, bright white */}
          <feOffset in="rAlpha" dx="16" dy="19" result="aDR" />
          <feComposite in="rAlpha" in2="aDR" operator="out" result="hiA" />
          <feComposite in="hiA" in2="rAlpha" operator="in" result="hiC" />
          <feGaussianBlur in="hiC" stdDeviation="5" result="hiB" />
          <feFlood floodColor="#ffffff" floodOpacity="0.95" result="hiCol" />
          <feComposite in="hiCol" in2="hiB" operator="in" result="hi" />
          <feMerge>
            <feMergeNode in="rGraphic" />
            <feMergeNode in="shade" />
            <feMergeNode in="hi" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

/* a tech-stack pill rendered in the exact hero PVC material (no dark outline) */
function PvcPill({ label, i }: { label: string; i: number }) {
  const H = 120, F = 46, padX = 48;
  const W = Math.round(label.length * 27.6 + 2 * padX);
  const rx = H / 2;
  const clipId = `pvcClip${i}`;
  return (
    <svg className="stackChip" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      <defs>
        <clipPath id={clipId}><rect x="0" y="0" width={W} height={H} rx={rx} /></clipPath>
      </defs>
      <g filter="url(#balloonClean)">
        <rect x="0" y="0" width={W} height={H} rx={rx} fill="url(#latexBase)" />
      </g>
      {/* glossy top sheen, clipped to the pill */}
      <g clipPath={`url(#${clipId})`}>
        <ellipse cx={W * 0.43} cy={H * 0.26} rx={W * 0.4} ry={H * 0.17} fill="#ffffff" opacity="0.5" filter="url(#b7)" />
      </g>
      <text x={W / 2} y={H / 2} textAnchor="middle" dominantBaseline="central"
        fontFamily="'Space Mono', monospace" fontSize={F} fontWeight={700} fill="#2c2823">{label}</text>
    </svg>
  );
}

/* a tech-stack item shown as a minimal PVC logo tile (React, TypeScript) instead of
   a text pill. Shares the .stackChip class so it gets the same balloon jiggle.
   `zoom` frames the logo nicely inside the clipped tile (the React art has padding). */
function PvcLogo({ src, label }: { src: string; label: string }) {
  return (
    <span className="stackChip stackLogo" role="img" aria-label={label}>
      <img src={src} alt="" loading="lazy" />
    </span>
  );
}

function CrownHat() {
  const [boop, setBoop] = useState(0);
  return (
    <div className="crownHat" style={{ position: "absolute", left: "48%", top: "5%", width: "38%", transform: "translateX(-50%)", zIndex: 6, cursor: "pointer" }}
      onClick={() => setBoop((b) => b + 1)} aria-hidden="true">
      <div className={boop ? "crownBoop" : undefined} key={boop}>
        <svg viewBox="0 0 80 50" style={{ width: "100%", height: "auto", overflow: "visible" }}>
          <g className="crownSway">
            {/* 3-point crown; its base arches UP in the middle so it cups the A's rounded head */}
            <path className="drawPath" d="M11 40 L22 15 L33 29 L40 9 L47 29 L58 15 L69 40 Q40 28 11 40" stroke={BLUE} strokeWidth="3.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <circle className="dotPop" cx="22" cy="15" r="3.3" fill={BLUE} />
            <circle className="dotPop" cx="40" cy="9" r="3.5" fill={BLUE} />
            <circle className="dotPop" cx="58" cy="15" r="3.3" fill={BLUE} />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Wordmark({ charClass }: { charClass?: string }) {
  const fs = 300;
  const PAD = fs * 0.2;
  const wOf = (c: string) => (CW[c] ?? 0.68) * fs;
  const localH = fs * 1.5;
  const baseY = fs * 1.12;
  const dil = fs * 0.05;
  const font = { fontFamily: "'Bagel Fat One','Titan One',system-ui", fontSize: fs } as const;

  let cur = 0;
  const boxes = LETTERS.map((it) => {
    const ww = wOf(it.c);
    const box = { ...it, ww, left: cur, localW: ww + 2 * PAD };
    cur += ww * KERN;
    return box;
  });
  const last = boxes[boxes.length - 1]!;
  const outerW = last.left + last.localW;

  const letterDiv = (b: (typeof boxes)[number], i: number) => {
    const gx = PAD;
    const ccx = gx + b.ww / 2, ccy = baseY - fs * 0.36;
    const glyph = { x: gx, y: baseY, ...font, strokeLinejoin: "round" as const };
    const hcX = gx - fs * 0.12, hcW = b.ww + fs * 0.24, hcY = baseY - fs * 1.18, hcH = fs * 1.42;
    const tf = `rotate(${b.rot} ${ccx} ${ccy}) translate(${ccx} 0) scale(${b.sx} 1) translate(${-ccx} 0)`;
    const divStyle: React.CSSProperties = {
      position: "absolute", left: `${(b.left / outerW) * 100}%`, top: 0,
      width: `${(b.localW / outerW) * 100}%`, height: "100%", zIndex: LETTERS.length - i,
      transformOrigin: "center bottom", cursor: "pointer", pointerEvents: "auto",
      filter: `drop-shadow(0 0 ${fs * 0.012}px rgba(150,142,126,.45)) drop-shadow(${fs * 0.012}px ${fs * 0.03}px ${fs * 0.022}px rgba(45,40,32,.24))`,
    };
    return (
      <div key={i} className={charClass} data-ci={i} style={divStyle}>
        <svg viewBox={`0 0 ${b.localW} ${localH}`} style={{ width: "100%", height: "100%", display: "block", overflow: "visible" }}>
          <g transform={tf}>
            <g filter="url(#balloon)">
              <text {...glyph} fill="url(#latexBase)" stroke="url(#latexBase)" strokeWidth={dil}>{b.c}</text>
            </g>
            <mask id={`bm${i}`} maskUnits="userSpaceOnUse" x={-PAD} y={-PAD} width={b.localW + 2 * PAD} height={localH + 2 * PAD}>
              <text {...glyph} fill="#fff" stroke="#fff" strokeWidth={dil}>{b.c}</text>
            </mask>
            <g mask={`url(#bm${i})`} filter="url(#b7)">
              {(HI[i] ?? []).map((hl, k) => {
                const hw = hl.fw * hcW, hh = hl.fh * hcH;
                const cx = hcX + hl.fx * hcW + hw / 2, cy = hcY + hl.fy * hcH + hh / 2;
                return (
                  <rect key={k} x={hcX + hl.fx * hcW} y={hcY + hl.fy * hcH} width={hw} height={hh} rx={Math.min(hw, hh) / 2}
                    fill="#ffffff" opacity={Math.min(1, hl.o * 0.82)} transform={`rotate(${hl.rot} ${cx} ${cy})`} />
                );
              })}
            </g>
            <g mask={`url(#bm${i})`} filter="url(#b7tight)">
              {(HI[i] ?? []).filter((hl) => hl.o >= 0.6).map((hl, k) => {
                const bw = hl.fw * hcW, bh = hl.fh * hcH;
                const cx = hcX + hl.fx * hcW + bw / 2, cy = hcY + hl.fy * hcH + bh / 2;
                const cw = bw * 0.6, ch = bh * 0.5;
                return (
                  <rect key={k} x={cx - cw / 2} y={cy - ch / 2} width={cw} height={ch} rx={Math.min(cw, ch) / 2}
                    fill="#ffffff" opacity={hl.o >= 0.9 ? 1 : 0.6} transform={`rotate(${hl.rot} ${cx} ${cy})`} />
                );
              })}
            </g>
          </g>
        </svg>
        {b.crown && <CrownHat />}
      </div>
    );
  };

  // The wordmark splits at the CENTRE OF THE NAME into two PVC door panels: "YA" (left) and
  // "SH" (right). The scroll timeline swings them open on their outer hinges.
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: `${outerW} / ${localH}`, overflow: "visible", perspective: "1700px" }} role="img" aria-label="YASH">
      <div className="doorLeft" style={{ position: "absolute", inset: 0, transformOrigin: "left center", transformStyle: "preserve-3d", pointerEvents: "none" }}>
        {boxes.slice(0, 2).map((b, i) => letterDiv(b, i))}
      </div>
      <div className="doorRight" style={{ position: "absolute", inset: 0, transformOrigin: "right center", transformStyle: "preserve-3d", pointerEvents: "none" }}>
        {boxes.slice(2).map((b, j) => letterDiv(b, j + 2))}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  DOODLES                                                            */
/* ================================================================== */

function Doodle({ children, style, w, h, cls, hit = true }: {
  children: React.ReactNode; style: React.CSSProperties; w: number; h: number; cls?: string; hit?: boolean;
}) {
  return (
    <svg className={cls} width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" style={{ position: "absolute", ...style }} aria-hidden="true">
      {hit && <rect x="0" y="0" width={w} height={h} fill="transparent" />}
      {children}
    </svg>
  );
}

function HandUnder({ color = BLUE, dy = -4 }: { color?: string; dy?: number }) {
  return (
    <svg viewBox="0 0 100 10" preserveAspectRatio="none" style={{ position: "absolute", left: "-2%", bottom: dy, width: "104%", height: 8 }} aria-hidden="true">
      <path d="M2 7 Q28 2.5 54 5 Q78 7 98 3.5" stroke={color} strokeWidth="3.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}
const U = ({ children, color = BLUE, ink = false }: { children: React.ReactNode; color?: string; ink?: boolean }) => (
  <span style={{ position: "relative", whiteSpace: "nowrap", color: ink ? INK : color }}>{children}<HandUnder color={color} /></span>
);

/* the role under the About headline swaps between Yash's three hats, on a loop.
   All three sit stacked in one inline-grid cell, so the slot stays the width of the
   longest title and the trailing copy never reflows — only the active one fades in. */
const ROLE_SWAP = ["design engineer", "mobile developer", "frontend developer"];
function RoleSwap() {
  const [i, setI] = useState(0);
  const wordRef = useRef<HTMLSpanElement>(null);
  const [w, setW] = useState<number>();
  useEffect(() => {
    const t = window.setInterval(() => setI((v) => (v + 1) % ROLE_SWAP.length), 2600);
    return () => window.clearInterval(t);
  }, []);
  // after each new title paints, measure it and set the slot width — the CSS width
  // transition then slides the trailing copy ("who …") smoothly to its new spot.
  useEffect(() => {
    if (wordRef.current) setW(wordRef.current.getBoundingClientRect().width);
  }, [i]);
  return (
    <span className="aboutRole" style={{ width: w != null ? `${w}px` : undefined }}>
      <span key={i} ref={wordRef} className="aboutRoleWord">{ROLE_SWAP[i]}<HandUnder /></span>
    </span>
  );
}

function starPath(cx: number, cy: number, outer: number, inner: number, points: number) {
  const parts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    parts.push(`${i === 0 ? "M" : "L"} ${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return parts.join(" ") + " Z";
}

/* keep the bomb on the left/right flanks of the wordmark — never bottom-centre,
   so it can't land on the DESIGN ENGINEER badge below */
const BOMB_SPOTS: React.CSSProperties[] = [
  { left: "-10%", top: "6%" },
  { right: "-10%", top: "0%" },
  { left: "-12%", top: "34%" },
  { right: "-9%", top: "30%" },
  { left: "-9%", bottom: "14%" },
  { right: "-10%", bottom: "20%" },
];
const randNext = (len: number, not: number) => {
  let n = Math.floor(Math.random() * len);
  if (n === not) n = (n + 1) % len;
  return n;
};

const FlankMark = ({ side }: { side: "l" | "r" }) => (
  <svg width="26" height="22" viewBox="0 0 26 22" fill="none" aria-hidden="true" style={side === "r" ? { transform: "scaleX(-1)" } : undefined}>
    <path d="M4 4 L15 9" stroke={BLUE} strokeWidth="2.6" strokeLinecap="round" />
    <path d="M1 12 L14 12" stroke={BLUE} strokeWidth="2.6" strokeLinecap="round" />
    <path d="M4 20 L15 15" stroke={BLUE} strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);

/* ================================================================== */
/*  FEATURED WORK — the single dominant project you arrive inside the   */
/*  A. One project, cinematic media, Apple/Linear/Stripe presentation.  */
/* ================================================================== */

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
  );
}

function FeaturedWork({ cinematic = false }: { cinematic?: boolean }) {
  const body = (
    <>
      <div className="dpTop">
        <span className="dpBrand">YASH<span style={{ color: BLUE }}>.</span></span>
        <span className="dpFeatLabel">FEATURED WORK — 01 / 01</span>
      </div>

      {/* one dominant project — the glimpse seen through the A.
          A static image (not video) so the browser can cache it and the growing
          clip-path stays a cheap GPU re-clip instead of a per-frame repaint. */}
      <div className="fwMedia">
        <img className="fwVideo" src={dysonImg} alt="Dyson Landing Page" />
        <div className="fwScrim" />
        <div className="fwText">
          <div className="fwEyebrow">FEATURED PROJECT</div>
          <h2 className="fwTitle">Dyson Landing Page</h2>
          <div className="fwMetaRow">
            <div className="fwMeta"><div className="k">ROLE</div><div className="v">Design &amp; Frontend</div></div>
            <div className="fwMeta"><div className="k">STACK</div><div className="v">React · GSAP · Three.js</div></div>
            <div className="fwMeta"><div className="k">YEAR</div><div className="v">2025</div></div>
          </div>
          <p className="fwDesc">An immersive product landing page — scroll-driven 3D, fluid motion and tactile micro-interactions that make the hardware feel alive.</p>
          <a className="fwCta" href="https://dyson.yashb.xyz/" target="_blank" rel="noopener noreferrer">View Live Project <ArrowIcon /></a>
        </div>
      </div>

      <div className="fwIndex">SELECTED&nbsp;WORK</div>
    </>
  );
  return <div className="darkProjects">{cinematic ? <div className="projInner">{body}</div> : body}</div>;
}

/* (RevealHero removed — it was dead code carrying a duplicate navbar; the single
   source of truth for navigation is now <SiteNav> + <QuickMenu> below.) */

/* ================================================================== */
/*  PROJECTS DATA — the /work (Projects) page is split into Mobile App   */
/*  and Website (Projects + Components) via a toggle. Same PVC universe.  */
/* ================================================================== */
type Proj = { t: string; status?: string; live?: boolean; d: string; stack?: string[]; img?: string; l?: string; fit?: "cover" | "contain" };

const MOBILE_APPS: Proj[] = [
  {
    t: "Talkamore App", status: "Live on Apple Store", live: true,
    d: "An AI journaling companion built with React Native and Xcode. Chat with a personal AI that remembers your past entries, surfaces throwbacks, and turns daily conversations into a private, encrypted journal. Features streaming chat, Auth0 sign-in, paywalled premium tiers, and paper-journal scanning.",
    stack: ["React Native", "Xcode", "TypeScript", "TanStack Query", "SuperMemory", "Auth0", "RevenueCat", "PostgreSQL"],
    img: talkamoreImg, l: "https://talkamore.com",
  },
  {
    t: "NOMI", status: "Case study", live: false,
    d: "An AI companion mobile app with a playful, expressive interface. (Send me the real write-up + stack and I'll slot it in.)",
    stack: ["React Native", "Expo", "TypeScript"],
    img: nomiMascot, fit: "contain", l: "https://x.com/Yassshhu/status/2029313865331425700",
  },
  /* hidden for now — re-enable once the real write-up + stack are ready
  {
    t: "Suspect", status: "In development", live: false,
    d: "A fast-paced social-deduction party game. (Send me the real description + stack and I'll update it.)",
    stack: ["React Native", "TypeScript"],
    l: "",
  },
  */
];
const WEB_PROJECTS: Proj[] = [
  {
    t: "Talkamore", status: "Live", live: true,
    d: "The marketing & landing site for the Talkamore app — motion-led storytelling with a clean conversion flow. (Real copy welcome.)",
    stack: ["React", "GSAP", "Tailwind"],
    img: talkamoreWebImg, l: "https://talkamore.com",
  },
  {
    t: "PredictPro", status: "Case study", live: false,
    d: "A prediction & analytics dashboard for forecasting, with rich data visualisation and a fast, focused UX. (Real copy welcome.)",
    stack: ["React", "TypeScript", "Data viz"],
    img: predictImg, l: "https://predictpro.yashb.xyz/",
  },
];
const WEB_COMPONENTS: Proj[] = [
  { t: "AI Send Button", d: "Animated send-button micro-interaction.", stack: ["React", "Framer Motion"], img: aiSendImg, l: "https://buttonai.yashb.xyz/" },
  { t: "Credit Card UI", d: "Interactive, tactile credit-card component.", stack: ["React", "CSS"], img: creditCardImg, l: "https://creditcard.yashb.xyz/" },
  { t: "FIFA Card", d: "Player card with tilt & holographic shine.", stack: ["React", "CSS 3D"], img: fifaImg, l: "https://spidey-fifa-cards.yashb.xyz/" },
  { t: "Bubble Navbar", d: "Playful springy bubble navigation bar.", stack: ["React", "Framer Motion"], img: bubbleNavImg, l: "https://bubblenavbar.yashb.xyz/" },
];
/* ================================================================== */
/*  NAVIGATION — a calm 2-destination bar (Work · About) + a ⌘K quick   */
/*  menu that carries the full depth, so the bar stays minimal while     */
/*  every destination is one click away. Same paper/ink/blue universe.   */
/* ================================================================== */

type SectionId = "home" | "about" | "experience" | "work" | "contact";

/* one page, four visible destinations — every section is a click or a short scroll away */
const NAV_ITEMS: Array<{ id: SectionId; label: string }> = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];
const ABOUT_PARTS = ["Story", "Experience", "Tech Stack"];
const SOCIALS: Array<{ label: string; href: string; ext?: boolean; img?: string }> = [
  { label: "Résumé", href: resumePdf, ext: true, img: resumePvc },
  { label: "Email", href: "mailto:bharadwaj465@gmail.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/yash-bharadawaj-387a67244/", ext: true, img: linkedinPvc },
  { label: "GitHub", href: "https://github.com/yash2k26", ext: true, img: githubPvc },
  { label: "Twitter", href: "https://x.com/Yassshhu", ext: true, img: xPvc },
];

/* hand-drawn divider mark between the two nav items — a tiny blue spark */
function NavDivider() {
  return (
    <svg className="navDivider" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 1.5 C9.6 6 12 8.4 16.5 9 C12 9.6 9.6 12 9 16.5 C8.4 12 6 9.6 1.5 9 C6 8.4 8.4 6 9 1.5 Z" fill={BLUE} />
    </svg>
  );
}

/* keyboard hint glyph (⌘K / Ctrl K) */
function KbdHint() {
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || "");
  return <span className="kbdHint"><kbd>{isMac ? "⌘" : "Ctrl"}</kbd><kbd>K</kbd></span>;
}

function SiteNav({ active, scrolled, onNavigate, onOpenMenu }: {
  active: SectionId; scrolled: boolean;
  onNavigate: (id: SectionId) => void; onOpenMenu: () => void;
}) {
  return (
    <nav className={`stageNav${scrolled ? " shrunk" : ""}`} aria-label="Primary">
      <div className="navInner">
        {/* left — logo / home */}
        <a className="navBrand brandPull" href="#top" aria-label="Yash — home"
          onClick={(e) => { e.preventDefault(); onNavigate("home"); }}>
          <span className="brandWin">
            <span className="brandReel">
              <img className="brandFace" src={yashLeather} alt="YASH" draggable={false} />
              <img className="brandFace" src={character} alt="" aria-hidden="true" draggable={false} />
              <img className="brandFace" src={yashLeather} alt="" aria-hidden="true" draggable={false} />
            </span>
          </span>
        </a>

        {/* centre — every destination, visible (desktop). active = where you are now */}
        <div className="navCenter hideMd">
          {NAV_ITEMS.map((it) => (
            <a
              key={it.id}
              className={`navlink${active === it.id ? " active" : ""}`}
              href={`#${it.id}`}
              onClick={(e) => { e.preventDefault(); onNavigate(it.id); }}
            >
              {it.label}
            </a>
          ))}
        </div>

        {/* right — primary CTA (desktop) · hamburger → full-screen menu (mobile) */}
        <div className="navRight">
          <a className="navTalk hideMd" href="#contact" onClick={(e) => { e.preventDefault(); onNavigate("contact"); }}>
            <svg viewBox="0 0 150 56" preserveAspectRatio="none" aria-hidden="true"><path d="M16 28 C15 13 42 6.5 75 7 C110 7.5 136 13 135 28 C136 42 110 49.5 74 49 C41 48.5 17 43 16 28 Z" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" /></svg>
            Let&apos;s Talk
          </a>
          <button className="navHamburger showMd" onClick={onOpenMenu} aria-label="Open menu" aria-haspopup="dialog">
            <svg width="22" height="14" viewBox="0 0 22 14" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M1 1.5h20M1 7h20M1 12.5h20" /></svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

/* full-screen calm cream overlay — every destination one click away */
function QuickMenu({ open, active, onClose, onNavigate }: {
  open: boolean; active: SectionId;
  onClose: () => void; onNavigate: (id: SectionId) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  // focus the panel when it opens (so Tab cycles inside) and restore on close
  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  return (
    <div
      className={`quickMenu${open ? " open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* corner doodles — same hand-drawn universe */}
      <svg className="qmSpark qmSpark1" width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path d="M20 3 C21.6 14 26 18.4 37 20 C26 21.6 21.6 26 20 37 C18.4 26 14 21.6 3 20 C14 18.4 18.4 14 20 3 Z" stroke={BLUE} strokeWidth="2.6" />
      </svg>
      <svg className="qmSpark qmSpark2" width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
        <path d="M15 2 C16 10 20 14 28 15 C20 16 16 20 15 28 C14 20 10 16 2 15 C10 14 14 10 15 2 Z" fill={BLUE} />
      </svg>

      <button className="qmClose" onClick={onClose} aria-label="Close menu">
        Close <span className="qmEsc">Esc</span>
      </button>

      <div className="qmInner" ref={panelRef} tabIndex={-1}>
        <div className="qmCol qmPrimary">
          <div className="qmKicker"><FlankMark side="l" /> NAVIGATE</div>
          {([
            { id: "about", label: "About" },
            { id: "experience", label: "Experience" },
            { id: "work", label: "Work" },
            { id: "contact", label: "Contact" },
          ] as Array<{ id: SectionId; label: string }>).map((it, i) => (
            <button key={it.id} className={`qmBig${active === it.id ? " on" : ""}`} onClick={() => onNavigate(it.id)}>
              <span className="qmIdx">{String(i + 1).padStart(2, "0")}</span>{it.label}<i className="qmArrow" />
            </button>
          ))}
        </div>

        <div className="qmCol qmSecondary">
          <div className="qmKicker"><FlankMark side="l" /> ELSEWHERE</div>
          {SOCIALS.map((s) => (
            <a className="qmLink" key={s.label} href={s.href}
              target={s.ext ? "_blank" : undefined} rel={s.ext ? "noopener noreferrer" : undefined}
              onClick={onClose}>
              {s.label}<i className="qmArrow" />
            </a>
          ))}
          <p className="qmNote">Press <kbd>⌘</kbd><kbd>K</kbd> anytime to open this menu.</p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  IN-PAGE SECTIONS (stubs) — real jump targets for WORK ▸ ABOUT ▸     */
/*  CONTACT so the nav/menu links actually land somewhere. Same paper   */
/*  universe; swap the inner copy for the real editorial build.         */
/* ================================================================== */

const EXPERIENCE = [
  {
    company: "Superteam", logo: superteamLogo, location: "India",
    role: "Member", date: "May 2025 — Present",
    points: [
      "Building and shipping in the Solana ecosystem with the Superteam community.",
      "Hackathons, bounties and collaborative product builds.",
    ],
  },
  {
    company: "Talkamore", logo: talkamoreLogo, location: "Remote",
    role: "Founding Engineer", date: "Apr 2026 — Present",
    points: [
      "Built and designed the product end-to-end across web and mobile for both App Store and Play Store.",
      "Owning the core backend and system design, with a focus on scalability and real-time features.",
      "Shipping production features in a fast-moving early-stage team.",
    ],
  },
  {
    company: "KraneApps", logo: kraneAppsLogo, location: "Remote",
    role: "Design Engineer", date: "Sep 2025 — Apr 2026",
    points: [
      "Designed and shipped polished, production-ready interfaces across client web and mobile apps.",
      "Built reusable component systems and motion-led interactions used across projects.",
      "Partnered with founders to turn rough ideas into fast, tactile product experiences.",
    ],
  },
];

/* the job-history list — shared by the About section and the Work page lead */
function ExperienceList() {
  return (
    <ul className="expList">
      {EXPERIENCE.map((e) => (
        <li className="expRow" key={e.company}>
          <div className="expLeft">
            <span className="expLogoTile"><img src={e.logo} alt={`${e.company} logo`} loading="lazy" /></span>
            <div>
              <div className="expCompany">{e.company}</div>
              <div className="expLoc">{e.location}</div>
            </div>
          </div>
          <div className="expRight">
            <div className="expHead">
              <span className="expRole">{e.role}</span>
              <span className="expDate">{e.date}</span>
            </div>
            <ul className="expPoints">
              {e.points.map((pt, i) => (
                <li key={i}><span className="expDash">—</span><span>{pt}</span></li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
}

const STACK = ["React", "TypeScript", "Next.js", "GSAP", "Three.js", "Tailwind", "Node", "Figma", "Framer", "Rive"];
/* every stack item is a minimal PVC logo (transparent, no tile) */
const STACK_LOGOS: Record<string, string> = {
  React: reactPvc,
  TypeScript: typescriptPvc,
  "Next.js": nextjsPvc,
  GSAP: gsapPvc,
  "Three.js": threejsPvc,
  Tailwind: tailwindPvc,
  Node: nodePvc,
  Figma: figmaPvc,
  Framer: framerPvc,
  Rive: rivePvc,
};

/* ---- LIVE GitHub contributions — pulls the last year's calendar from a public
   proxy (no token) and paints it in the site's blue. Hides itself if the fetch
   fails, so a flaky API never leaves a broken card. ---- */
const GH_USER = "yash2k26";
const GH_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const GH_DAYS = ["", "Mon", "", "Wed", "", "Fri", ""];
type GhDay = { date: string; count: number; level: number };

function GitHubContributions() {
  const [days, setDays] = useState<GhDay[] | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(`https://github-contributions-api.jogruber.de/v4/${GH_USER}?y=last`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("bad status"))))
      .then((d: { total?: { lastYear?: number }; contributions?: GhDay[] }) => {
        if (!alive) return;
        setDays(d.contributions ?? []);
        setTotal(d.total?.lastYear ?? null);
      })
      .catch(() => { if (alive) setFailed(true); });
    return () => { alive = false; };
  }, []);

  // the calendar is wider than the card on phones — default the scroll to the
  // far right so the LATEST contributions are in view (no manual scrolling).
  const cardRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = cardRef.current;
    if (el && days) el.scrollLeft = el.scrollWidth;
  }, [days]);

  if (failed) return null;

  // group days into week columns (Sun→Sat); pad the first column so weekdays line up
  const weeks: (GhDay | null)[][] = [];
  if (days && days.length) {
    const firstDow = new Date(days[0]!.date + "T00:00:00Z").getUTCDay();
    const cells: (GhDay | null)[] = [...Array(firstDow).fill(null), ...days];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  }
  // month label sits on the first column a new month appears in
  let lastMonth = -1;
  const monthFor = (col: (GhDay | null)[]) => {
    const d = col.find(Boolean) as GhDay | undefined;
    if (!d) return "";
    const m = new Date(d.date + "T00:00:00Z").getUTCMonth();
    if (m !== lastMonth) { lastMonth = m; return GH_MONTHS[m]!; }
    return "";
  };

  return (
    <div className="ghCal" data-part="GitHub">
      <span className="ghEyebrow">GitHub</span>
      <div className="ghCard" ref={cardRef}>
        {!days ? (
          <div className="ghLoading">Loading contributions…</div>
        ) : (
          <>
            <div className="ghMonths">
              {weeks.map((col, i) => <span className="ghMonthSlot" key={i}>{monthFor(col)}</span>)}
            </div>
            <div className="ghBody">
              <div className="ghDayCol">{GH_DAYS.map((d, i) => <span className="ghDayLabel" key={i}>{d}</span>)}</div>
              <div className="ghGrid">
                {weeks.map((col, i) => (
                  <div className="ghWeek" key={i}>
                    {Array.from({ length: 7 }, (_, r) => {
                      const day = col[r];
                      return (
                        <span
                          className="ghCell"
                          key={r}
                          data-level={day ? day.level : -1}
                          title={day ? `${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}` : undefined}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="ghFoot">
              <span className="ghTotal">{(total ?? 0).toLocaleString()} contributions in the last year</span>
              <span className="ghLegend">
                Less
                {[0, 1, 2, 3, 4].map((l) => <span className="ghCell" key={l} data-level={l} />)}
                More
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function AboutSection() {
  const stackRef = useRef<HTMLDivElement>(null);

  /* tech-stack pills get the hero letters' balloon physics: a jelly inflate-in
     when they scroll into view, and a squash/stretch pop (with a neighbour nudge)
     on hover — same eases as the YASH wordmark. */
  useEffect(() => {
    const wrap = stackRef.current;
    if (!wrap) return;
    const chips = Array.from(wrap.querySelectorAll<SVGSVGElement>(".stackChip"));
    if (!chips.length) return;
    gsap.set(chips, { transformOrigin: "center center" });
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    // entrance — inflate in with an elastic overshoot, staggered
    const intro = gsap.timeline({ paused: true });
    intro.from(chips, { scale: 0.25, opacity: 0, duration: 0.75, ease: "elastic.out(1, 0.5)", stagger: 0.07 });
    let safety = 0;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        intro.play();
        io.disconnect();
        // safety: never leave a pill stranded mid-inflate (guarantees final state)
        safety = window.setTimeout(() => gsap.set(chips, { scale: 1, opacity: 1, x: 0 }), 1700);
      });
    }, { threshold: 0.3 });
    io.observe(wrap);

    // hover — balloon pop: quick squash/stretch then a wobbly elastic settle
    const handlers: Array<[Element, string, () => void]> = [];
    chips.forEach((el, i) => {
      const onEnter = () => {
        gsap.timeline()
          .to(el, { scaleX: 0.9, scaleY: 1.14, duration: 0.12, ease: "power3.out", overwrite: "auto" })
          .to(el, { scaleX: 1, scaleY: 1, duration: 0.55, ease: "elastic.out(0.8, 0.4)" });
        ([[i - 1, -1], [i + 1, 1]] as const).forEach(([j, dir]) => {
          const n = chips[j];
          if (!n) return;
          gsap.timeline()
            .to(n, { x: dir * 6, duration: 0.12, ease: "power2.out", overwrite: "auto" })
            .to(n, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
        });
      };
      el.addEventListener("pointerenter", onEnter);
      handlers.push([el, "pointerenter", onEnter]);
    });

    return () => {
      io.disconnect();
      intro.kill();
      if (safety) clearTimeout(safety);
      handlers.forEach(([el, evt, fn]) => el.removeEventListener(evt, fn));
    };
  }, []);

  return (
    <section id="about" className="aboutSection" aria-label="About">
      <div className="aboutInner container">
        {/* intro — story on the left, portrait on the right */}
        <div className="aboutIntro">
          <div className="aboutStory" data-part="Story">
            <h2 className="aboutHead">
              I'm Yash, a <RoleSwap /> who builds playful, tactile interfaces that feel alive.
            </h2>
            <p className="aboutCopy">
              I live where design and code overlap: motion, material and detail. I care about how a thing
              <U ink> feels</U> as much as how it looks: the weight of a press, the spring of a transition,
              the small surprises that make a product memorable.
            </p>
            <p className="aboutCopy">
              Lately that means PVC-soft type, scroll choreography and the little physics that make pixels
              behave like real stuff. Always learning, always shipping.
            </p>
            <a className="aboutResume" href={resumePdf} target="_blank" rel="noopener noreferrer">
              Download résumé <ArrowIcon />
            </a>
          </div>
          <div className="aboutPortrait" aria-hidden="true">
            <img src={avatarPvc} alt="" loading="lazy" />
            <span className="aboutPortraitTag">that's me
              <svg className="tagArrow" width="22" height="20" viewBox="0 0 22 20" fill="none" aria-hidden="true">
                <path d="M20 17 C13 16 6 13 3 4" stroke={BLUE} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 4 L9 6 M3 4 L4 10" stroke={BLUE} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>

        {/* live GitHub contributions, painted in the site blue */}
        <GitHubContributions />

        {/* Tech stack (Experience now lives in its own section below) */}
        <div className="aboutBlock aboutTech" data-part="Tech Stack">
          <h3 className="aboutSub">Tech Stack</h3>
          <div className="stackWrap" ref={stackRef}>
            {STACK.map((s, i) => STACK_LOGOS[s]
              ? <PvcLogo src={STACK_LOGOS[s]!} label={s} key={s} />
              : <PvcPill label={s} i={i} key={s} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== EXPERIENCE — its own section (the timeline + recognitions) ===== */
function ExperienceSection() {
  return (
    <section id="experience" className="expSection" aria-label="Experience">
      <div className="container">
        <h2 className="pageHead">Where I've<br className="hideMd" /> been building.</h2>
        <div className="expReveal">
          <ExperienceList />
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="contactSection" aria-label="Contact">
      <div className="contactInner">
        <h2 className="contactHead">Let's build something<br /> worth remembering.</h2>
        <a className="contactCta" href="mailto:bharadwaj465@gmail.com">
          <svg className="btnSkin" viewBox="0 0 320 64" preserveAspectRatio="none" aria-hidden="true">
            <path d="M16 32 C14 14 40 8 90 8 C170 7 250 7.5 300 10 C314 11 316 20 314 32 C316 46 300 56 248 56 C150 58 70 57 40 55 C20 54 18 44 16 32 Z" fill={INK} />
          </svg>
          bharadwaj465@gmail.com
        </a>
        <div className="contactSocials">
          {SOCIALS.filter((s) => s.img).map((s) => (
            <a key={s.label} className="socialPvc" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
              <img src={s.img} alt={s.label} loading="lazy" />
              <span className="socialPvcLabel">{s.label}</span>
            </a>
          ))}
        </div>
        {SOCIALS.some((s) => s.label !== "Email" && !s.img) && (
          <div className="contactLinks">
            {SOCIALS.filter((s) => s.label !== "Email" && !s.img).map((s) => (
              <a key={s.label} className="navlink" href={s.href} target={s.ext ? "_blank" : undefined} rel={s.ext ? "noopener noreferrer" : undefined}>{s.label}</a>
            ))}
          </div>
        )}
        <div className="contactFoot">© {2026} Yash Bharadwaj — designed &amp; built with care.</div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  APP                                                                */
/* ================================================================== */

/* ---- line icons + NOMI logo for the RECENT ACHIEVEMENT card (Lucide-style) ---- */
function TrophyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
/* the minimalist NOMI logo — two black blobs + wordmark + a blue hand-drawn underline */
function NomiMark() {
  return (
    <span className="nomiMark" role="img" aria-label="NOMI">
      <svg className="nomiBlobs" viewBox="0 0 64 42" fill="#141414" aria-hidden="true">
        <ellipse cx="25" cy="21" rx="9" ry="18" transform="rotate(-9 25 21)" />
        <ellipse cx="42" cy="21" rx="9" ry="18" transform="rotate(9 42 21)" />
      </svg>
      <span className="nomiWord">NOMI</span>
      <svg className="nomiUnder" viewBox="0 0 80 8" preserveAspectRatio="none" aria-hidden="true">
        <path d="M4 5 Q40 1 76 4.5" stroke={BLUE} strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/* ================================================================== */
/*  HOME PAGE — the YASH hero + the signature marshmallow-pour scroll    */
/*  transition that reveals a SELECTED WORK teaser (links to /work).     */
/* ================================================================== */

function HomePage({ onNavigate }: { onNavigate: (id: SectionId) => void }) {
  const [bombPos, setBombPos] = useState(() => Math.floor(Math.random() * BOMB_SPOTS.length));
  const [bombState, setBombState] = useState<"idle" | "burn" | "boom" | "hidden">("idle");
  const timers = useRef<number[]>([]);
  const reduced = useRef(false);

  /* ---------- hero entrance + interactions ---------- */
  useEffect(() => {
    reduced.current = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current || window.location.hash === "#still" || window.location.hash.startsWith("#p=") || window.location.hash.startsWith("#dp=")) return;

    // exclude the A's door halves — the scroll door timeline owns their transform
    const letters = gsap.utils.toArray<HTMLElement>(".heroChar:not(.aDoor)");
    letters.forEach((l) => { l.style.willChange = "transform"; });
    const sideX = [-340, -150, 150, 340];
    const intro = gsap.timeline({ delay: 0.15, onComplete: () => letters.forEach((l) => { l.style.willChange = "auto"; }) });
    letters.forEach((el, k) => {
      intro.fromTo(el, { x: sideX[k] ?? 0, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42, ease: "power3.in" }, k * 0.04);
    });
    intro.to(letters, { scaleX: 1.18, scaleY: 0.82, duration: 0.11, ease: "power2.out", stagger: 0.05 }, 0.42);
    intro.to(letters, { scaleX: 1, scaleY: 1, duration: 1.15, ease: "elastic.out(1.1,0.28)", stagger: 0.05 }, 0.55);
    gsap.from(".heroStack", { y: 26, opacity: 0, duration: 1, ease: "power2.out", stagger: 0.09, delay: 0.7 });
    gsap.utils.toArray<SVGPathElement>(".drawPath").forEach((p, i) => {
      p.setAttribute("pathLength", "100");
      gsap.fromTo(p, { strokeDasharray: 100, strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: 1, ease: "power2.inOut", delay: 1 + i * 0.05 });
    });
    gsap.from(".dotPop", { scale: 0, opacity: 0, duration: 0.6, ease: "power2.out", stagger: 0.05, delay: 1.5, transformOrigin: "center" });
    // safety: never leave a letter mid-entrance (guarantees the final resting state)
    timers.current.push(window.setTimeout(() => { gsap.set(letters, { opacity: 1, x: 0, scaleX: 1, scaleY: 1 }); }, 2600));

    const byIdx: Record<number, HTMLElement> = {};
    document.querySelectorAll<HTMLElement>(".heroChar").forEach((el) => { byIdx[Number(el.getAttribute("data-ci"))] = el; });
    const enter = (el: HTMLElement) => { gsap.to(el, { y: -6, duration: 0.18, ease: "power2.out", overwrite: "auto" }); };
    const leave = (el: HTMLElement) => { gsap.to(el, { y: 0, scaleX: 1, scaleY: 1, duration: 0.28, ease: "power2.out", overwrite: "auto" }); };
    const pop = (i: number) => {
      const el = byIdx[i];
      if (!el) return;
      gsap.timeline()
        .to(el, { scaleX: 0.86, scaleY: 1.18, duration: 0.12, ease: "power3.out", overwrite: "auto" })
        .to(el, { scaleX: 1, scaleY: 1, duration: 0.5, ease: "elastic.out(0.85,0.45)" });
      ([[i - 1, -1], [i + 1, 1]] as const).forEach(([j, dir]) => {
        const n = byIdx[j];
        if (!n) return;
        gsap.timeline()
          .to(n, { x: dir * 9, duration: 0.12, ease: "power2.out", overwrite: "auto" })
          .to(n, { x: 0, duration: 0.45, ease: "elastic.out(1,0.5)" });
      });
    };

    const handlers: Array<[Element, string, () => void]> = [];
    Object.entries(byIdx).forEach(([i, el]) => {
      const onEnter = () => enter(el);
      const onLeave = () => leave(el);
      const onClick = () => pop(Number(i));
      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointerleave", onLeave);
      el.addEventListener("click", onClick);
      handlers.push([el, "pointerenter", onEnter], [el, "pointerleave", onLeave], [el, "click", onClick]);
    });

    document.querySelectorAll<SVGSVGElement>(".ixRedraw").forEach((svg) => {
      const fn = () => {
        svg.querySelectorAll<SVGPathElement>(".drawPath").forEach((p) => {
          gsap.fromTo(p, { strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut", overwrite: "auto" });
        });
        const runner = svg.querySelector<SVGCircleElement>(".runner");
        const track = svg.querySelector<SVGPathElement>(".drawPath");
        if (runner && track) {
          const L = track.getTotalLength();
          const proxy = { t: 0 };
          runner.style.opacity = "1";
          gsap.to(proxy, {
            t: 1, duration: 0.7, ease: "power2.inOut", overwrite: "auto",
            onUpdate: () => { const pt = track.getPointAtLength(L * proxy.t); runner.setAttribute("cx", String(pt.x)); runner.setAttribute("cy", String(pt.y)); },
            onComplete: () => { gsap.to(runner, { opacity: 0, duration: 0.3 }); },
          });
        }
      };
      svg.addEventListener("mouseenter", fn);
      handlers.push([svg, "mouseenter", fn]);
    });

    document.querySelectorAll<SVGSVGElement>(".ixSpin").forEach((svg) => {
      const fn = () => gsap.fromTo(svg, { rotation: 0, scale: 1 }, { rotation: 180, scale: 1.25, duration: 0.8, ease: "back.out(1.8)", onComplete: () => gsap.to(svg, { scale: 1, rotation: 0, duration: 0.6, ease: "power2.inOut" }) });
      svg.addEventListener("mouseenter", fn);
      handlers.push([svg, "mouseenter", fn]);
    });

    return () => {
      handlers.forEach(([el, evt, fn]) => el.removeEventListener(evt, fn));
      timers.current.forEach(clearTimeout);
      intro.kill();
    };
  }, []);

  /* bomb: hover → fuse burns → BOOM → respawns elsewhere */
  useEffect(() => {
    if (reduced.current) return;
    if (bombState === "burn") {
      // hover lights the fuse: the spark keeps crackling at the tip (loops) until you
      // CLICK to detonate — or move away to put it out. No auto-explode.
      const spark = document.querySelector<SVGGElement>("#bombSpark");
      if (spark) {
        gsap.fromTo(spark, { scale: 0, transformOrigin: "center" }, { scale: 1, duration: 0.18, ease: "power2.out" });
        gsap.to(spark, { rotation: 18, scale: 0.82, duration: 0.1, yoyo: true, repeat: -1, ease: "power1.inOut", transformOrigin: "center" });
      }
    }
    if (bombState === "boom") {
      playBombPop();
      gsap.fromTo("#blast", { scale: 0.2, rotation: -18, opacity: 1, transformOrigin: "center" }, { scale: 1, rotation: 0, duration: 0.45, ease: "back.out(2.4)" });
      timers.current.push(window.setTimeout(() => {
        gsap.to("#blast", { scale: 1.18, opacity: 0, duration: 0.4, ease: "power2.in", onComplete: () => setBombState("hidden") });
      }, 1000));
    }
    if (bombState === "hidden") {
      timers.current.push(window.setTimeout(() => { setBombPos((p) => randNext(BOMB_SPOTS.length, p)); setBombState("idle"); }, 1600));
    }
    if (bombState === "idle") {
      gsap.fromTo("#bombWrap", { scale: 0, opacity: 0, transformOrigin: "center bottom" }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.8)" });
    }
    return () => {
      // stop the looping fuse spark whenever the bomb leaves the burn state
      const spark = document.querySelector("#bombSpark");
      if (spark) gsap.killTweensOf(spark);
    };
  }, [bombState]);

  return (
    <>
      {/* ====== HERO STAGE — the centred YASH wordmark; flows straight into About below ====== */}
      <div className="stage" id="home">
        {/* ---- HERO LAYER (the YASH hero; the A splits open like a door) ---- */}
        <div className="heroLayer">
          <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "72px 20px 30px" }}>

            {/* header/navbar lives on the stage top layer (.stageNav) so it stays above the hero */}

            {/* ---- giant wordmark + living annotations ---- */}
            <div className="heroWordmark" style={{ position: "relative", width: "min(60vw, 760px)", marginTop: 8 }}>

              <Doodle cls="ixRedraw shakeable" w={64} h={56} style={{ left: "6%", top: "-3%", zIndex: 3 }}>
                <path className="drawPath" d="M10 38 L4 24" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />
                <path className="drawPath" d="M26 32 L24 14" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />
                <path className="drawPath" d="M42 34 L52 20" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />
                <path className="drawPath" d="M6 51 Q24 41 42 51" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />
              </Doodle>

              <Doodle cls="ixRedraw shakeable" w={66} h={30} style={{ left: "23%", top: "4%", zIndex: 3 }}>
                <path className="drawPath" d="M4 26 Q33 7 62 22" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
                <path className="drawPath" d="M14 28 Q35 17 56 26" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
              </Doodle>
              <Doodle cls="ixRedraw shakeable" w={66} h={30} style={{ right: "14%", top: "2%", zIndex: 3 }}>
                <path className="drawPath" d="M62 26 Q33 7 4 22" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
                <path className="drawPath" d="M52 28 Q31 17 10 26" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
              </Doodle>

              <Doodle cls="ixSpin shakeable" w={40} h={40} style={{ right: "-5%", top: "-12%", zIndex: 3 }}>
                <path className="drawPath" d="M20 3 C21.5 13 23 16.5 33 18 C23 19.5 21.5 23 20 33 C18.5 23 17 19.5 7 18 C17 16.5 18.5 13 20 3 Z" stroke={BLUE} strokeWidth="2.6" strokeLinejoin="round" />
              </Doodle>

              <Doodle cls="ixRedraw shakeable" w={60} h={120} style={{ left: "1.5%", top: "16%", zIndex: 3 }}>
                <path className="drawPath" d="M52 6 C18 30 12 74 34 112" stroke={BLUE} strokeWidth="3.2" strokeLinecap="round" />
                <circle className="runner" r="4" fill={BLUE} opacity="0" />
              </Doodle>

              <Doodle cls="ixRedraw shakeable" w={56} h={56} style={{ right: "0.5%", top: "37%", zIndex: 3 }}>
                <path className="drawPath" d="M8 30 C22 22 36 18 50 14 M24 6 C26 20 28 34 30 48 M44 34 C34 32 18 38 10 44" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
              </Doodle>

              {/* the wordmark — click a letter to stretch it */}
              <div style={{ position: "relative", zIndex: 2 }}>
                <Wordmark charClass="heroChar" />
              </div>

              {/* bomb — ignites on hover, explodes, respawns elsewhere */}
              {bombState !== "hidden" && (
                <div id="bombWrap" style={{ position: "absolute", zIndex: 4, width: 92, height: 92, cursor: "pointer", ...BOMB_SPOTS[bombPos] }}
                  onMouseEnter={() => bombState === "idle" && setBombState("burn")}
                  onMouseLeave={() => bombState === "burn" && setBombState("idle")}
                  onClick={() => (bombState === "idle" || bombState === "burn") && setBombState("boom")}>
                  {bombState !== "boom" ? (
                    <svg width="92" height="92" viewBox="0 0 92 92" fill="none" aria-hidden="true">
                      <rect x="0" y="0" width="92" height="92" fill="transparent" />
                      <circle cx="32" cy="62" r="21" fill={INK} />
                      <circle cx="25" cy="55" r="4.5" fill="#f6f4ee" opacity="0.9" />
                      <path d="M43 46 L51 38 L57 44 L49 52 Z" fill={INK} />
                      <path id="bombFuse" d="M53 41 C58 32 66 34 69 24" stroke={INK} strokeWidth="4" strokeLinecap="round" />
                      <g id="bombSpark" style={{ opacity: bombState === "burn" ? 1 : 0 }}>
                        <path d="M69 24 l6 -7 M72 28 l9 -2 M66 18 l0 -9 M76 20 l6 -5" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
                        <circle cx="80" cy="13" r="1.8" fill={INK} />
                        <circle cx="84" cy="22" r="1.6" fill={INK} />
                      </g>
                      {bombState === "idle" && (
                        <g opacity="0.85">
                          <path d="M70 22 l4 -5 M73 27 l7 -2" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
                          <circle cx="79" cy="14" r="1.5" fill={INK} />
                        </g>
                      )}
                    </svg>
                  ) : (
                    <svg id="blast" width="130" height="130" viewBox="0 0 130 130" style={{ position: "absolute", left: -19, top: -19 }} aria-hidden="true">
                      <path d={starPath(65, 65, 60, 28, 11)} fill={INK} />
                      <path d={starPath(65, 65, 34, 15, 9)} fill="#f6f4ee" />
                      <g stroke={INK} strokeWidth="2.6" strokeLinecap="round">
                        <path d="M65 2 l0 -2 M118 30 l6 -4 M124 88 l8 3 M30 122 l-5 7 M8 60 l-8 -2" />
                      </g>
                      <circle cx="14" cy="24" r="2.4" fill={INK} />
                      <circle cx="116" cy="112" r="2.6" fill={INK} />
                    </svg>
                  )}
                </div>
              )}

              {/* short blue cup hugging a letter's rounded bottom, with a little accent dot */}
              <Doodle cls="ixRedraw shakeable" w={82} h={24} style={{ left: "27%", bottom: "17%", zIndex: 3 }}>
                <path className="drawPath" d="M4 8 Q33 21 60 12" stroke={BLUE} strokeWidth="3.4" strokeLinecap="round" />
                <circle cx="73" cy="9" r="2.6" fill={BLUE} />
                <circle className="runner" r="4" fill={BLUE} opacity="0" />
              </Doodle>
              <Doodle cls="ixRedraw shakeable" w={82} h={24} style={{ right: "27%", bottom: "19%", zIndex: 3 }}>
                <path className="drawPath" d="M22 12 Q49 21 78 8" stroke={BLUE} strokeWidth="3.4" strokeLinecap="round" />
                <circle cx="8" cy="9" r="2.6" fill={BLUE} />
                <circle className="runner" r="4" fill={BLUE} opacity="0" />
              </Doodle>

              {/* hand-drawn wavy arrow */}
              <Doodle cls="ixRedraw shakeable" w={90} h={56} style={{ right: "-6%", bottom: "-4%", zIndex: 3 }}>
                <path className="drawPath" d="M4 44 C16 36 24 52 38 44 C50 37 56 46 70 34 M70 34 l-12 1 M70 34 l1 12" stroke={INK} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              </Doodle>
            </div>

            {/* ---- role badge ---- */}
            {/* ---- RECENT ACHIEVEMENT card — the Monolith win + NOMI, the hero credential:
                 a paper-clipped sticky note pinned to an inflated-PVC panel ---- */}
            <div className="heroStack achCard">
              <div className="achNote">
                <svg className="achClip" width="24" height="44" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" stroke="#9a93c9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="achNoteLabel">
                  <svg className="achNoteSpark" width="14" height="14" viewBox="0 0 16 16" fill="#fff" aria-hidden="true"><path d="M8 1 C8.8 5 10 6.2 15 8 C10 9.8 8.8 11 8 15 C7.2 11 6 9.8 1 8 C6 6.2 7.2 5 8 1 Z" /></svg>
                  RECENT<br />ACHIEVEMENT
                </span>
                <svg className="achNoteUnder" viewBox="0 0 80 8" preserveAspectRatio="none" aria-hidden="true"><path d="M3 5 Q40 1 77 4" stroke={BLUE} strokeWidth="2.6" fill="none" strokeLinecap="round" /></svg>
              </div>

              <div className="achGrid">
                <div className="achLogo"><img className="achNomiMascot" src={nomiMascot} alt="NOMI" /></div>

                <div className="achMain">
                  <span className="achDate">JUNE 2026</span>
                  <h3 className="achTitle">Monolith Hackathon <span className="achTitleBlue">Winner ’26</span></h3>
                  <div className="achFounder">Founder of <a className="achNomiLink" href="#work" onClick={(e) => { e.preventDefault(); onNavigate("work"); }}>NOMI</a></div>
                  <p className="achDesc">Built and launched a social discovery platform on Solana, leading product strategy, design, and development from zero to launch.</p>
                  <div className="achPrize">
                    <span className="achPrizeIcon"><TrophyIcon /></span>
                    <span className="achPrizeText">
                      <span className="achPrizeWon">Won 1st Place</span>
                      <span className="achPrizeAmt">$10,000<span className="achPrizeCur"> USD</span></span>
                    </span>
                  </div>
                </div>

                <div className="achStats">
                  <div className="achStat">
                    <svg className="achCheck" width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M3 12 C5.5 13.5 7.5 16 9 18.5 C12 11.5 16 5.5 20 2.5" stroke={BLUE} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span className="achStatText">Live on <b>Solana</b> dApp Store</span>
                  </div>
                  <div className="achStat">
                    <svg className="achCheck" width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M3 12 C5.5 13.5 7.5 16 9 18.5 C12 11.5 16 5.5 20 2.5" stroke={BLUE} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span className="achStatText">Hackathon Winner — <b>Monolith ’26</b></span>
                  </div>
                  <div className="achStat">
                    <svg className="achCheck" width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M3 12 C5.5 13.5 7.5 16 9 18.5 C12 11.5 16 5.5 20 2.5" stroke={BLUE} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span className="achStatText">Built from 0 to <b>Launch</b></span>
                  </div>
                </div>
              </div>

              {/* hand-drawn blue accents (the mockup's little scribbles) */}
              <svg className="achScribble achScrTitle" width="32" height="18" viewBox="0 0 32 18" fill="none" aria-hidden="true">
                <path d="M3 14 L11 3 M13 15 L21 4" stroke={BLUE} strokeWidth="2.6" strokeLinecap="round" />
              </svg>
              <svg className="achScribble achScrTile" width="26" height="16" viewBox="0 0 26 16" fill="none" aria-hidden="true">
                <path d="M4 11 L1 4 M13 9 L13 1 M22 11 L25 4" stroke={BLUE} strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </div>

          </main>
        </div>
        {/* the navbar lives OUTSIDE the page as a persistent fixed layer (<SiteNav /> in App) */}
      </div>
    </>
  );
}

/* ================================================================== */
/*  PROJECTS SECTION — lives on the home page (#work). A toggle flips    */
/*  Mobile App and Website (Website = Projects + Components). Each item   */
/*  is an inflated PVC card with media; contained to the 1140 column.    */
/* ================================================================== */

/* tiny blue spark used as the tech-chip mark */
function ChipMark() {
  return (
    <svg className="pjChipMark" width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
      <path d="M4.5 0 L5.55 3.45 L9 4.5 L5.55 5.55 L4.5 9 L3.45 5.55 L0 4.5 L3.45 3.45 Z" fill={BLUE} />
    </svg>
  );
}

/* full project = media panel (left) + number · status · title · description · tech chips (right) */
function ProjectRow({ p, n }: { p: Proj; n: number }) {
  const num = String(n).padStart(2, "0");
  const initials = p.t.split(" ").map((w) => w[0]).join("").slice(0, 2);
  return (
    <article className="pjRow">
      <div className="pjMedia">
        {p.img ? <img className={p.fit === "contain" ? "pjContain" : undefined} src={p.img} alt={p.t} loading="lazy" /> : <div className="pjMediaPh"><span>{initials}</span></div>}
      </div>
      <div className="pjInfo">
        <div className="pjTopline">
          <span className="pjNum">{num}</span>
        </div>
        <h2 className="pjTitle">{p.t}</h2>
        <p className="pjDesc">{p.d}</p>
        {p.stack && (
          <div className="pjStack">
            {p.stack.map((s) => <span className="pjChip" key={s}><ChipMark />{s}</span>)}
          </div>
        )}
        {p.l && (
          <a className="pjLink" href={p.l} target="_blank" rel="noopener noreferrer">Visit project <ArrowIcon /></a>
        )}
      </div>
    </article>
  );
}

/* compact card — used only for the small Website "Components". Whole card is a link
   to the live demo when one exists. */
function ProjCard({ p }: { p: Proj }) {
  const initials = p.t.split(" ").map((w) => w[0]).join("").slice(0, 2);
  const inner = (
    <>
      <div className="projCardMedia square">
        {p.img ? <img src={p.img} alt={p.t} loading="lazy" /> : <div className="projCardPh"><span>{initials}</span></div>}
      </div>
      <div className="projCardBody">
        <span className="projCardTitle">{p.t}{p.l && <ArrowIcon />}</span>
        {p.d && <span className="projCardDesc">{p.d}</span>}
        {p.stack && <span className="projCardTags">{p.stack.join(" · ")}</span>}
      </div>
    </>
  );
  return p.l
    ? <a className="projCard isStatic isLink" href={p.l} target="_blank" rel="noopener noreferrer">{inner}</a>
    : <div className="projCard isStatic">{inner}</div>;
}

/* PVC jiggle wave for the Mobile App ⇄ Website thumb — the dark pill is sliced
   into WAVE_SEGS vertical strips; the strip at the wall it just hit wobbles first
   and hardest, each strip toward the far side starts later (WAVE_STEP apart) and
   smaller (WAVE_DECAY falloff), so a single ripple travels across and fades. */
const WAVE_SEGS = 8;     // vertical slices the pill is built from
const WAVE_AMP = 0.4;    // crest height at the impact edge (scaleY delta)
const WAVE_DECAY = 0.78; // amplitude falloff per slice toward the far edge
const WAVE_STEP = 28;    // ms of delay between adjacent slices → wave travel speed
const WAVE_TOUCH = 230;  // ms before the crest starts (≈ when the pill meets the wall)

function WorkPage() {
  const [tab, setTab] = useState<"mobile" | "web">("mobile");     // selected (drives the thumb)
  const [shown, setShown] = useState<"mobile" | "web">("mobile"); // currently rendered section
  const [leaving, setLeaving] = useState(false);                  // exit animation in flight
  // bumps on every toggle → remounts the skin so the jiggle keyframe restarts
  const [pulse, setPulse] = useState(0);

  // switching choreographs over ~0.39s: current section fades OUT (0.13s),
  // then the next section fades/settles IN (0.26s). Re-keyed to restart the CSS animation.
  const pick = (t: "mobile" | "web") => {
    if (t === tab || leaving) return;
    setTab(t);
    setPulse((p) => p + 1);
    // reduced motion → no keyframes fire (no animationend), so swap immediately
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setShown(t); return; }
    setLeaving(true);
  };
  const onStageAnimEnd = (e: React.AnimationEvent) => {
    if (e.target !== e.currentTarget) return; // ignore bubbled child animations
    if (leaving) { setShown(tab); setLeaving(false); }
  };

  const mobileSection = (
    <div className="projSection">
      <div className="pjList">
        {MOBILE_APPS.map((p, i) => <ProjectRow key={p.t} p={p} n={i + 1} />)}
      </div>
    </div>
  );
  const webSection = (
    <>
      <div className="projSection">
        <div className="pjList">
          {WEB_PROJECTS.map((p, i) => <ProjectRow key={p.t} p={p} n={i + 1} />)}
        </div>
      </div>
      <div className="projSection">
        <h2 className="projGroupTitle">Components</h2>
        <div className="projGrid g4">
          {WEB_COMPONENTS.map((p) => <ProjCard key={p.t} p={p} />)}
        </div>
      </div>
    </>
  );

  return (
    <main className="workPage" id="work" aria-label="Projects">
      <div className="container">
        <h1 className="pageHead">Things I've designed<br className="hideMd" /> &amp; built.</h1>
        <p className="pageLede">
          A mix of shipped mobile apps, websites and the little interface components I build
          along the way. Flip between the two below.
        </p>

        {/* toggle — Mobile App ⇄ Website */}
        <div className="projToggle" role="tablist" aria-label="Project category">
          <span className="projToggleThumb" style={{ transform: tab === "web" ? "translateX(100%)" : "translateX(0)" }}>
            {/* the dark pill — squashes against the wall it lands on (transform-origin),
                then settles with a damped balloon wobble (key={pulse} restarts it) */}
            <span
              className={`projToggleThumbSkin${pulse ? " jiggle" : ""}`}
              key={pulse}
              style={{ transformOrigin: tab === "web" ? "right center" : "left center" }}
            />
          </span>
          <button className={`projTab${tab === "mobile" ? " on" : ""}`} role="tab" aria-selected={tab === "mobile"} onClick={() => pick("mobile")}>Mobile App</button>
          <button className={`projTab${tab === "web" ? " on" : ""}`} role="tab" aria-selected={tab === "web"} onClick={() => pick("web")}>Website</button>
        </div>

        <div
          key={`${shown}-${leaving ? "out" : "in"}`}
          className={`projStage${leaving ? " leaving" : ""}`}
          onAnimationEnd={onStageAnimEnd}
        >
          {shown === "mobile" ? mobileSection : webSection}
        </div>
      </div>
    </main>
  );
}

/* ================================================================== */
/*  APP — route shell. Persistent nav + quick-menu wrap a swapped page:  */
/*  / (home) · /work · /about. Contact is a shared footer on every page. */
/* ================================================================== */

/* tiny History-API router — no dependency; deep links + back/forward work
   because the server serves index.html for every path (catch-all route). */
function usePath(): [string, (to: string) => void] {
  const [path, setPath] = useState(() => (typeof window !== "undefined" ? window.location.pathname : "/"));
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const navigate = (to: string) => {
    // different page → let the marshmallow curtain reset scroll under cover (no
    // pre-transition jump); same page → just hop to the top.
    if (to !== window.location.pathname) { window.history.pushState({}, "", to); setPath(to); }
    else window.scrollTo(0, 0);
  };
  return [path, navigate];
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(() => typeof window !== "undefined" && window.location.hash === "#menu");
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<SectionId>("home");

  // every nav/menu click smooth-scrolls to a section on the one page (no route change)
  const go = (id: SectionId) => {
    setMenuOpen(false);
    document.body.style.overflow = "";
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      history.replaceState(null, "", window.location.pathname);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }
  };

  // solid cream background, no grid
  useEffect(() => {
    document.body.style.backgroundColor = "#efece4";
    document.body.style.backgroundImage = "none";
  }, []);

  // ⌘K / Ctrl-K toggles the quick-menu (a power-user bonus) · Esc closes it
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); setMenuOpen((v) => !v); }
      else if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // lock page scroll while the full-screen mobile menu is open
  useEffect(() => { document.body.style.overflow = menuOpen ? "hidden" : ""; }, [menuOpen]);

  // SCROLL — sticky-shrink the nav + SCROLLSPY (highlight the section you're in).
  // Uses viewport-relative tops so it's robust to the pinned hero. React de-dupes
  // same-value setState, so this stays cheap despite firing every scroll frame.
  useEffect(() => {
    const ids: SectionId[] = ["about", "experience", "work", "contact"];
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const line = window.innerHeight * 0.32;
      let cur: SectionId = "home";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) cur = id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // deep link: /#about (etc.) or the old /work, /about paths land on the right section
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const fromPath = window.location.pathname.replace("/", ""); // "work" | "about" | ""
    const id = ["about", "experience", "work", "contact"].includes(hash) ? hash
      : ["about", "work"].includes(fromPath) ? fromPath : "";
    if (!id) return;
    const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: "start" }), 420);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <GlobalDefs />

      <SiteNav active={active} scrolled={scrolled} onNavigate={go} onOpenMenu={() => setMenuOpen(true)} />

      {/* ONE PAGE — Hero → About → Experience → Work → Contact, every section reachable
          by a short scroll or one click from the always-visible nav. */}
      <HomePage onNavigate={go} />
      <AboutSection />
      <ExperienceSection />
      <WorkPage />
      <ContactSection />

      {/* full-screen menu — the mobile navigation (and a ⌘K bonus on desktop) */}
      <QuickMenu open={menuOpen} active={active} onClose={() => setMenuOpen(false)} onNavigate={go} />
    </>
  );
}

export default App;
