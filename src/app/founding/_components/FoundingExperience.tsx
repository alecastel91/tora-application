"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import {
  HomeDrawerProvider,
  useHomeDrawer,
  DRAWER_CONTENT,
  type DrawerItem,
} from "@/components/sections/home/HomeDrawer";
import { Scene } from "@/components/sections/home2/Scene";
import { FoundingBackdrop } from "./FoundingBackdrop";
import { LangMenu } from "./LangMenu";
import {
  Eyebrow,
  Reveal,
  ROLE,
  ScrollInsidePhone,
  ScrollProgress,
  EASE,
  grotesk,
  rajdhani,
  supreme,
} from "./primitives";
import type { FoundingContent, LangCode, DrawerId } from "../_content/types";

/* --------------------------------------------------------------- constants */

const INFRARED = "#FF3366";
const GHOST = "rgba(255,255,255,0.45)";

// Role labels stay in English to match the pills shown inside the app screenshots.
const ROLE_LABELS = ["Artist", "Agent", "Promoter", "Venue"] as const;

// Non-translatable role visuals (id, accent, icon). Copy comes from content.roles.
const ROLE_META = [
  {
    id: "artist",
    color: ROLE.artist,
    icon: (c: string) => (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
        <rect x="3" y="14" width="4" height="6" rx="1.5" />
        <rect x="17" y="14" width="4" height="6" rx="1.5" />
      </svg>
    ),
  },
  {
    id: "agent",
    color: ROLE.agent,
    icon: (c: string) => (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="8" r="3" />
        <path d="M3 19.5c0-3.3 2.7-5.7 6-5.7s6 2.4 6 5.7" />
        <circle cx="16.8" cy="9" r="2.4" opacity="0.5" />
        <path d="M16.6 13.9c2.6.4 4.4 2.5 4.4 5.1" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: "promoter",
    color: ROLE.promoter,
    icon: (c: string) => (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 4 6.8 8.6H4.2a1.7 1.7 0 0 0-1.7 1.7v3.4a1.7 1.7 0 0 0 1.7 1.7h2.6L17.5 20z" />
        <path d="M7.2 15.6v3.2a1.2 1.2 0 0 0 1.2 1.2h1.4" opacity="0.5" />
        <path d="M20.2 9.2a4.2 4.2 0 0 1 0 5.6" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: "venue",
    color: ROLE.venue,
    icon: (c: string) => (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20V9l8-5 8 5v11" />
        <path d="M9 20v-5a3 3 0 0 1 6 0v5" />
      </svg>
    ),
  },
] as const;

const DEEPDIVE_META = [
  { color: ROLE.artist, shot: "/founding/shots/artist-full.png" },
  { color: ROLE.agent, shot: "/founding/shots/agent-full.png" },
  { color: ROLE.promoter, shot: "/founding/shots/promoter-full.png" },
  { color: ROLE.venue, shot: "/founding/shots/venue-full.png" },
] as const;

const JOURNEY_IDS = ["discover", "connect", "offer", "contract", "confirmed"] as const;

/** The screen each step of the run actually shows, in the drawer's own order. */
const JOURNEY_SHOTS = [
  "/home/discover.png",
  "/home/connect.png",
  "/home/offer.png",
  "/home/contract.png",
  "/home/book.png",
] as const;

/** The row stands in an arc, highest in the middle, and drifts hardest there. */
const ARC = [
  { drift: 22, lift: 0 },
  { drift: 32, lift: -18 },
  { drift: 44, lift: -30 },
  { drift: 32, lift: -18 },
  { drift: 22, lift: 0 },
] as const;

/** The homepage's role photographs — the same four faces /roles carries. */
const ROLE_FACE = [
  "/home/v2/face-artist.jpg",
  "/home/v2/face-agent.jpg",
  "/home/v2/face-promoter.jpg",
  "/home/v2/face-venue.jpg",
] as const;

/** One mark per symptom: a calendar with nothing in it, a cost curve nobody
 *  else carries, a closed door, two nodes that never meet. Drawn here rather
 *  than imported so the four stay a set. */
const PROBLEM_MARKS = [
  <>
    <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
    <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
    <path d="M9 14.5l6 4M15 14.5l-6 4" />
  </>,
  <>
    <path d="M3 19.5h18" />
    <path d="M4 16l5-5 3.5 3.5L20 7" />
    <path d="M15.5 7H20v4.5" />
  </>,
  <>
    <rect x="5" y="3.5" width="14" height="17" rx="2" />
    <path d="M15 12h.01" />
    <path d="M9.5 8.5V7a2.5 2.5 0 0 1 5 0v1.5" opacity="0.55" />
  </>,
  <>
    <circle cx="6" cy="7" r="2.6" />
    <circle cx="18" cy="17" r="2.6" />
    <path d="M8.3 8.9l2.4 2.4M13.3 13.9l2.4 2.4" />
  </>,
];

/* Line icons in the /features language — ghost-white base, one infrared accent. */
const IconBell = (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 8.6a5.8 5.8 0 0 0-11.6 0c0 6.2-2.4 7.8-2.4 7.8h16.4s-2.4-1.6-2.4-7.8" stroke={GHOST} />
    <path d="M10.4 19.8a1.9 1.9 0 0 0 3.2 0" stroke={GHOST} />
    <circle cx="18.6" cy="4.6" r="1.7" fill="#FF3366" stroke="none" />
  </svg>
);
const IconPlane = (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" stroke={GHOST} />
    <circle cx="19.4" cy="4.6" r="1.5" fill="#FF3366" stroke="none" />
  </svg>
);
const TOURING_META = [
  { id: "travel", icon: IconBell },
  { id: "tour", icon: IconPlane },
] as const;

/* --------------------------------------------------------------- content ctx */

const Cx = createContext<FoundingContent | null>(null);
const useC = () => {
  const c = useContext(Cx);
  if (!c) throw new Error("FoundingContent missing");
  return c;
};

/** Page language — CTAs carry it to /apply so the form opens pre-translated. */
const LangCx = createContext<LangCode>("en");
const useApplyHref = () => `/apply?start=role&lang=${useContext(LangCx)}`;

/** Merge translated title/body/label over the English drawer base (keeps shot/video/color). */
function buildDrawer(content: FoundingContent) {
  const map: Record<string, DrawerItem> = {};
  (Object.keys(content.drawer.items) as DrawerId[]).forEach((id) => {
    map[id] = { ...DRAWER_CONTENT[id], ...content.drawer.items[id] };
  });
  const labels = {
    role: content.drawer.role,
    feature: content.drawer.feature,
    join: content.drawer.join,
    scroll: content.drawer.scroll,
  };
  return { map, labels };
}

/* --------------------------------------------------------------- utilities */

function Bullet({ text, color }: { text: string; color: string }) {
  return (
    <li className="flex items-start gap-3" style={grotesk}>
      <svg className="mt-1 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      <span className="text-white/70 text-[15px] leading-relaxed">{text}</span>
    </li>
  );
}

/**
 * One app screen in a phone frame, drifting at its own speed as the section
 * passes, and tappable: it opens that step's drawer. The drift is what keeps
 * five static PNGs from reading as a product sheet; `lift` raises the middle
 * phone so the row has a shape, and rides inside the same transform — as a
 * margin it pushed the caption down with it and the captions lost their line.
 */
function StepPhone({ src, drift, lift = 0, label, onOpen }: { src: string; drift: number; lift?: number; label: string; onOpen: () => void; }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [drift + lift, -drift + lift]);
  return (
    <div ref={ref} className="shrink-0">
      <motion.button
        type="button"
        onClick={onOpen}
        aria-label={label}
        style={{ y }}
        className="group relative block w-[64vw] max-w-[260px] rounded-[2rem] border border-white/10 bg-black p-1.5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] transition-colors hover:border-infrared/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-infrared/70 md:w-[clamp(126px,13.4vw,196px)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" aria-hidden="true" loading="lazy" className="block h-auto w-full rounded-[1.6rem]" />
      </motion.button>
    </div>
  );
}

/* ---------------------------------------------------------------- sections */

function Hero() {
  const c = useC();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const reduce = useReducedMotion();

  return (
    <section id="top" ref={ref} className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <motion.div style={{ opacity, y }} className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: EASE }}
        >
          <Image src="/tora_logo_transparent.png" alt="TORA" width={500} height={166} priority className="h-auto w-[236px] md:w-[280px]" />
        </motion.div>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-4 text-[10px] uppercase tracking-[0.34em] text-white/55 md:mt-5 md:text-[11px]"
          style={supreme}
        >
          {c.hero.footer}
        </motion.span>

        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-14 text-[9.5px] leading-[1.9] uppercase tracking-[0.22em] text-infrared/90 md:mt-16 md:text-[11px] md:tracking-[0.3em]"
          style={{ ...supreme, fontWeight: 500 }}
        >
          {c.hero.eyebrow.split("·").map((p) => p.trim()).join(" · ")}
        </motion.span>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="mt-9 flex flex-col items-center gap-5 md:mt-10"
        >
          <Link href={useApplyHref()} className="rounded-full border border-white/40 px-9 py-3.5 text-[11px] font-medium uppercase tracking-[0.26em] text-white/90 transition-all duration-300 hover:border-white hover:bg-white/5 hover:text-white" style={supreme}>
            {c.hero.ctaPrimary}
          </Link>
          <a href="#problem" className="text-[10px] uppercase tracking-[0.26em] text-white/40 transition-colors hover:text-white" style={supreme}>
            {c.hero.ctaSecondary}
          </a>
        </motion.div>
      </motion.div>

      <motion.div style={{ opacity }} className="absolute bottom-10 flex flex-col items-center gap-2 text-white/50">
                <motion.svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
          <path d="M12 5v14" /><path d="M19 12l-7 7-7-7" />
        </motion.svg>
      </motion.div>
    </section>
  );
}


/* The problem and the turn out of it, in ONE room.
   They were two screens with a hundred-pixel gap between them, and the four
   symptoms were an unmarked 2x2 of text. Each symptom now carries a mark, the
   four stand in one band, and the answer lands in the same frame. */
function ProblemSolution() {
  const c = useC();
  return (
    <Scene photo="/home/v2/room-open.jpg" className="px-6 py-20 md:px-10 md:py-24">
      <div id="problem" className="absolute -top-24" />
      <div className="mx-auto w-full max-w-6xl">
        <Reveal><Eyebrow>{c.problem.eyebrow}</Eyebrow></Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 max-w-3xl text-[clamp(30px,5.4vw,64px)] font-black uppercase leading-[0.98] tracking-tight text-white text-balance" style={rajdhani}>
            {c.problem.heading}
          </h2>
        </Reveal>

        <div className="mt-9 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 md:mt-11 md:grid-cols-4">
          {c.problem.items.map((p, i) => (
            <Reveal key={i} delay={0.08 + i * 0.07}>
              <div className="flex h-full flex-col gap-3 bg-black/55 px-5 py-5 backdrop-blur-sm md:px-5 md:py-6">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-infrared">
                  {PROBLEM_MARKS[i]}
                </svg>
                <h3 className="text-[15px] font-semibold leading-snug text-white" style={supreme}>{p.title}</h3>
                <p className="text-[13.5px] leading-relaxed text-white/55" style={grotesk}>{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.16}>
          <div className="mt-14 md:mt-16">
            <Eyebrow>{c.solution.eyebrow}</Eyebrow>
            <h2 className="mt-5 max-w-4xl text-[clamp(32px,6vw,76px)] font-black uppercase leading-[0.96] tracking-tight text-white" style={rajdhani}>
              {c.solution.headingLead}{" "}
              <span className="text-infrared">{c.solution.headingAccent}</span>
            </h2>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/60 md:text-base" style={grotesk}>
              {c.solution.body}
            </p>
          </div>
        </Reveal>
      </div>
    </Scene>
  );
}

function RoleDetail({ index, onPick, onBack, reduce }: { index: number; onPick: (i: number) => void; onBack: () => void; reduce: boolean | null; }) {
  const c = useC();
  const meta = DEEPDIVE_META[index];
  const d = c.deepdives[index];
  const label = ROLE_LABELS[index];
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
        <button onClick={onBack} className="mr-2 flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-white/70 transition-colors hover:bg-white/10" style={supreme}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          {c.solution.allRoles}
        </button>
        {ROLE_META.map((r, i) => (
          <button key={r.id} onClick={() => onPick(i)}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors [&_svg]:h-4 [&_svg]:w-4"
            style={i === index ? { background: `${r.color}22`, border: `1px solid ${r.color}`, color: r.color } : { border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.55)" }}>
            {r.icon(i === index ? r.color : "currentColor")}
            <span style={supreme}>{ROLE_LABELS[i]}</span>
          </button>
        ))}
      </div>
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div>
          <Eyebrow color={meta.color}>{label}</Eyebrow>
          <h2 className="mt-5 text-3xl font-black uppercase leading-[1.03] tracking-tight text-balance md:text-4xl" style={rajdhani}>
            <span className="text-white">{d.headline[0]}</span> <span style={{ color: meta.color }}>{d.headline[1]}</span>
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-white/60" style={grotesk}>{d.body}</p>
          <ul className="mt-6 space-y-3">{d.points.map((p) => <Bullet key={p} text={p} color={meta.color} />)}</ul>
          <Link href={useApplyHref()} className="mt-8 inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-transform hover:-translate-y-0.5" style={{ background: meta.color }}>
            {c.drawer.join}
          </Link>
        </div>
        <ScrollInsidePhone src={meta.shot} alt={`${label} profile in the TORA app`} glow={meta.color} scrollLabel={c.drawer.scroll} className="md:order-2" />
      </div>
    </motion.div>
  );
}


/* The four, as four people. The icon-in-a-ring tiles made four different
   trades read as four instances of one thing; the photograph says who the
   role is for before the sentence does. Tapping still opens the deep-dive. */
function RolePicker() {
  const c = useC();
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<number | null>(null);
  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get("role");
    const i = ROLE_META.findIndex((m) => m.id === (r || "").toLowerCase());
    // Deep-link must run post-mount (window read) to avoid an SSR hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (i >= 0) setSelected(i);
  }, []);
  return (
    <section id="roles" className="relative z-10 scroll-mt-20 py-12 md:py-16">
      <AnimatePresence mode="wait" initial={false}>
        {selected === null ? (
          <motion.div key="picker"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }} transition={{ duration: 0.4, ease: EASE }}>
            <div className="mx-auto w-full max-w-6xl px-6">
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/45" style={supreme}>{c.solution.chooseRole}</p>
            </div>
            {/* A swipe on a phone, a wall on a desktop — the roles cost one screen either way. */}
            <div className="mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:mx-auto md:max-w-6xl md:grid md:grid-cols-4 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
              {ROLE_META.map((r, i) => (
                <div key={r.id} className="shrink-0 snap-center md:shrink">
                  <button type="button" onClick={() => setSelected(i)}
                    className="group relative block h-[58vh] w-[74vw] overflow-hidden rounded-2xl border border-white/10 text-left md:h-[54vh] md:w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ROLE_FACE[i]} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
                    <div className="absolute inset-0 mix-blend-color" style={{ background: r.color, opacity: 0.22 }} />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,10,10,0.1) 0%, rgba(10,10,10,0.45) 48%, rgba(10,10,10,0.95) 100%)" }} />
                    <span className="absolute left-0 top-0 h-1 w-full" style={{ background: r.color }} />
                    <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                      <h3 className="text-[clamp(28px,4.4vw,40px)] font-black uppercase leading-[0.9] tracking-tight" style={{ ...rajdhani, color: r.color }}>
                        {ROLE_LABELS[i]}
                      </h3>
                      <p className="mt-3 min-h-[4.6em] text-[13px] leading-relaxed text-white/70 md:min-h-[5.8em] md:text-sm" style={grotesk}>
                        {c.roles[i].body}
                      </p>
                      <span className="mt-3 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-white/45 transition-colors group-hover:text-white" style={supreme}>
                        {c.solution.tapToExplore}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                      </span>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="mx-auto w-full max-w-6xl px-6">
            <RoleDetail key={"detail-" + selected} index={selected} onPick={setSelected} onBack={() => setSelected(null)} reduce={reduce} />
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* Shared tappable card — opens the (localized) homepage drawer for `id`. */
function ExploreTile({ n, icon, title, body, onOpen }: { n?: string; icon?: ReactNode; title: string; body: string; onOpen: () => void; }) {
  const c = useC();
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative flex h-full flex-row items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-infrared/60 hover:bg-white/[0.04] hover:shadow-[0_18px_50px_-24px_rgba(255,51,102,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-infrared/70 md:flex-col md:gap-0 md:p-6"
    >
      <div className="shrink-0">
        {n ? (
          <span className="text-3xl font-black leading-none text-infrared md:text-4xl lg:text-5xl" style={rajdhani}>{n}</span>
        ) : null}
        {icon ? (
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-infrared/40 bg-infrared/10 [&>svg]:h-6 [&>svg]:w-6 md:h-12 md:w-12">{icon}</span>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col md:mt-4">
        <h3 className="text-base font-bold uppercase tracking-wide text-white md:text-lg" style={rajdhani}>{title}</h3>
        <p className="mt-1.5 flex-1 text-[14px] leading-relaxed text-white/55 md:mt-2 md:text-[15px]" style={grotesk}>{body}</p>
        <span className="mt-3 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-white/35 transition-colors group-hover:text-infrared md:mt-5" style={supreme}>
          {c.solution.tapToExplore}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </span>
      </div>
    </button>
  );
}


/* The run, in five real screens, with touring in the same room.
   Five numbered cards described the app; five screens show it. Each phone is
   still the tap target that opens that step's drawer. */
function Journey() {
  const c = useC();
  const { open } = useHomeDrawer();
  return (
    <Scene photo="/home/v2/room-close.jpg" dim={0.38} className="px-6 py-16 md:px-10 md:py-20">
      <div id="journey" className="absolute -top-24" />
      <div className="mx-auto w-full max-w-6xl">
        <Reveal><Eyebrow>{c.journey.eyebrow}</Eyebrow></Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 max-w-3xl text-[clamp(28px,5vw,60px)] font-black uppercase leading-[0.98] tracking-tight text-white text-balance" style={rajdhani}>
            {c.journey.heading}
          </h2>
        </Reveal>

        <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:mt-12 md:justify-center md:gap-6 md:overflow-visible md:pb-0 lg:gap-8 [&::-webkit-scrollbar]:hidden">
          {c.journey.steps.map((s, i) => (
            <div key={i} className="flex shrink-0 snap-center flex-col items-start md:shrink">
              <StepPhone src={JOURNEY_SHOTS[i]} drift={ARC[i].drift} lift={ARC[i].lift} label={s.title} onOpen={() => open(JOURNEY_IDS[i])} />
              <div className="mt-5 w-[64vw] max-w-[260px] md:w-[clamp(126px,13.4vw,196px)]">
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] text-infrared" style={{ ...supreme, fontVariantNumeric: "tabular-nums" }}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-[17px] font-black uppercase leading-[1.05] tracking-tight text-white md:min-h-[2.2em] md:text-base lg:text-lg" style={rajdhani}>
                    {s.title}
                  </h3>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-white/55 md:text-[12px] lg:text-[13px]" style={grotesk}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Touring was a section of its own with one heading and two cards in
            it; it belongs to the same run, so it lands in the same room. */}
        <div id="touring" className="mt-14 border-t border-white/10 pt-12 md:mt-16">
          <Reveal><Eyebrow>{c.touring.eyebrow}</Eyebrow></Reveal>
          <div className="mt-5 grid gap-8 md:grid-cols-2 md:items-start md:gap-12">
            <Reveal delay={0.05}>
              <h2 className="text-[clamp(26px,4.2vw,48px)] font-black uppercase leading-[1.02] tracking-tight text-white text-balance" style={rajdhani}>
                {c.touring.heading}
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-white/60" style={grotesk}>{c.touring.body}</p>
            </Reveal>
            <div className="grid gap-3 md:gap-4">
              {c.touring.tiles.map((t, i) => (
                <Reveal key={i} delay={0.08 + i * 0.08}>
                  <ExploreTile icon={TOURING_META[i].icon} title={t.title} body={t.body} onOpen={() => open(TOURING_META[i].id)} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Scene>
  );
}


/* The door — why, the invitation and the sign-off in one frame.
   They were three sections, each with its own full padding, saying one thing:
   this is who it is for, and here is the way in. */
function Door() {
  const c = useC();
  return (
    <section className="relative z-10 px-6 pb-20 pt-16 text-center md:pt-20">
      <div id="why" className="absolute -top-24" />
      <Reveal className="flex justify-center"><Eyebrow>{c.why.eyebrow}</Eyebrow></Reveal>
      <Reveal delay={0.05}>
        <h2 className="mx-auto mt-6 max-w-4xl text-[clamp(32px,5.6vw,68px)] font-black uppercase leading-[1.0] tracking-tight text-white" style={rajdhani}>
          {c.why.headingLead}{" "}
          <span className="text-infrared">{c.why.headingAccent}</span>
        </h2>
      </Reveal>
      <Reveal delay={0.12}>
        <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg" style={grotesk}>
          {c.why.body}
        </p>
      </Reveal>

      <div id="join" className="relative mt-16 scroll-mt-20 md:mt-20">
        <Reveal className="flex justify-center"><Eyebrow>{c.cta.eyebrow}</Eyebrow></Reveal>
        <Reveal delay={0.05}>
          <h2 className="mx-auto mt-6 max-w-3xl break-keep text-[clamp(34px,6.2vw,80px)] font-black uppercase leading-[0.96] tracking-tight text-white" style={rajdhani}>
            {c.cta.headingLine1}<br />{c.cta.headingLine2}
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-white/60" style={grotesk}>{c.cta.body}</p>
        </Reveal>
        <div className="mx-auto mt-10 grid max-w-3xl gap-4 md:grid-cols-2">
          {c.cta.cards.map((f, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-white/10 bg-black/40 p-6 text-left backdrop-blur-sm" style={{ borderTop: `2px solid ${INFRARED}` }}>
                <h3 className="text-base font-semibold text-white" style={supreme}>{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55" style={grotesk}>{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-8 max-w-2xl text-sm leading-relaxed text-white/50" style={grotesk}>{c.cta.pricingNote}</p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-9 flex flex-col items-center gap-4">
            <Link href={useApplyHref()} className="rounded-full bg-infrared px-10 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_34px_rgba(255,51,102,0.55)] hover:brightness-110" style={supreme}>
              {c.cta.button}
            </Link>
            <span className="text-sm text-white/45" style={grotesk}>{c.cta.foot}</span>
          </div>
        </Reveal>
        <Reveal delay={0.26}>
          <div className="mt-16 flex flex-col items-center gap-4">
            <Image src="/tora_logo_transparent.png" alt="TORA" width={400} height={133} className="h-auto w-[132px] opacity-90" />
            <span className="text-[11px] uppercase tracking-[0.4em] text-white/45" style={supreme}>{c.hero.footer}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- shell */

function ChapterNav() {
  const c = useC();
  const chapters = [
    { id: "top", label: c.chapters.intro },
    { id: "problem", label: c.chapters.pitch },
    { id: "journey", label: c.chapters.how },
    { id: "touring", label: c.chapters.touring },
    { id: "why", label: c.chapters.why },
    { id: "join", label: c.chapters.join },
  ];
  const [active, setActive] = useState("top");
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => { entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }); }, { rootMargin: "-45% 0px -45% 0px" });
    chapters.forEach((c2) => { const el = document.getElementById(c2.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <nav aria-label="Chapters" className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
      {chapters.map((c2) => (
        <a key={c2.id} href={`#${c2.id}`} aria-label={c2.label} className="group flex items-center justify-end gap-2">
          <span className="pointer-events-none rounded-full bg-black/70 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-white/70 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100" style={supreme}>{c2.label}</span>
          <span className={`h-2.5 w-2.5 rounded-full border transition-all ${active === c2.id ? "scale-110 border-infrared bg-infrared" : "border-white/30 group-hover:border-white/60"}`} />
        </a>
      ))}
    </nav>
  );
}


export function FoundingExperience({ content, lang }: { content: FoundingContent; lang: LangCode }) {
  const { map, labels } = buildDrawer(content);
  return (
    <Cx.Provider value={content}>
      <LangCx.Provider value={lang}>
      <HomeDrawerProvider content={map} labels={labels}>
        <LangMenu current={lang} label={content.ui.language} />
        <main className="relative overflow-x-clip font-sans text-white selection:bg-infrared/30">
          <ScrollProgress />
          <ChapterNav />
          <FoundingBackdrop />
          <Hero />
          <ProblemSolution />
          <RolePicker />
          <Journey />
          <Door />
        </main>
      </HomeDrawerProvider>
      </LangCx.Provider>
    </Cx.Provider>
  );
}
