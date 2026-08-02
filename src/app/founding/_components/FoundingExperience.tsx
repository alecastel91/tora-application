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
import { FoundingBackdrop } from "./FoundingBackdrop";
import { LangMenu } from "./LangMenu";
import {
  Eyebrow,
  Reveal,
  ROLE,
  ScrollInsidePhone,
  ScrollProgress,
  Section,
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
      <motion.div aria-hidden style={{ opacity, y }} className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <motion.div
          className="absolute h-[62vh] max-h-[560px] w-[62vh] max-w-[560px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,51,102,0.16) 0%, transparent 62%)" }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={reduce ? { opacity: 0.7, scale: 1 } : { opacity: [0.45, 0.8, 0.45], scale: [0.94, 1.06, 0.94] }}
          transition={reduce ? { duration: 1.2, ease: EASE } : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute h-[46vh] max-h-[420px] w-[46vh] max-w-[420px] opacity-[0.06]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.07, rotate: reduce ? 0 : 360 }}
          transition={{ opacity: { duration: 1.4, ease: EASE }, rotate: { duration: 90, repeat: Infinity, ease: "linear" } }}
        >
          <Image src="/loading-globe.png" alt="" width={420} height={420} className="h-full w-full object-contain" />
        </motion.div>
      </motion.div>

      <motion.div style={{ opacity, y }} className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: EASE }}
        >
          <Image src="/tora_logo_transparent.png" alt="TORA" width={500} height={166} priority className="h-auto w-[210px] md:w-[300px]" />
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-8 text-[11px] md:text-xs uppercase tracking-[0.34em] text-infrared"
          style={{ ...supreme, fontWeight: 500 }}
        >
          {c.hero.eyebrow}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8, ease: EASE }}
          className="mt-5 max-w-3xl text-3xl font-semibold leading-tight text-white text-balance md:text-5xl"
          style={supreme}
        >
          {c.hero.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: EASE }}
          className="mt-5 max-w-xl text-white/55 text-sm leading-relaxed md:text-base"
          style={grotesk}
        >
          {c.hero.subline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Link href="/apply" className="rounded-full bg-infrared px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(255,51,102,0.5)] hover:brightness-110" style={supreme}>
            {c.hero.ctaPrimary}
          </Link>
          <a href="#problem" className="rounded-full border border-white/30 px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/10" style={supreme}>
            {c.hero.ctaSecondary}
          </a>
        </motion.div>
      </motion.div>

      <motion.div style={{ opacity }} className="absolute bottom-10 flex flex-col items-center gap-2 text-white/50">
        <span className="text-[10px] uppercase tracking-[0.3em]" style={supreme}>{c.hero.footer}</span>
        <motion.svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
          <path d="M12 5v14" /><path d="M19 12l-7 7-7-7" />
        </motion.svg>
      </motion.div>
    </section>
  );
}

/* Problem flowing directly into Solution, one continuous argument. */
function ProblemSolution() {
  const c = useC();
  return (
    <Section id="problem">
      <Reveal><Eyebrow>{c.problem.eyebrow}</Eyebrow></Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-5 max-w-2xl text-3xl font-black uppercase leading-[1.05] tracking-tight text-white text-balance md:text-5xl" style={rajdhani}>
          {c.problem.heading}
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2">
        {c.problem.items.map((p, i) => (
          <Reveal key={i} delay={i * 0.06}>
            <motion.div
              className="border-t border-white/10 pt-5 transition-colors"
              whileHover={{ borderColor: "rgba(255,51,102,0.5)" }}
            >
              <span className="text-2xl font-black text-infrared" style={rajdhani}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 text-lg font-semibold text-white" style={supreme}>{p.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/55" style={grotesk}>{p.body}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mx-auto mt-24 flex flex-col items-center">
          <span className="h-16 w-px bg-gradient-to-b from-transparent to-infrared/60" />
          <div className="mt-8 flex justify-center"><Eyebrow>{c.solution.eyebrow}</Eyebrow></div>
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mx-auto mt-6 max-w-4xl text-center text-4xl font-black uppercase leading-[1.02] tracking-tight text-white md:text-7xl" style={rajdhani}>
          {c.solution.headingLead}{" "}
          <span className="text-infrared">{c.solution.headingAccent}</span>
        </h2>
      </Reveal>
      <Reveal delay={0.12}>
        <p className="mx-auto mt-8 max-w-2xl text-center text-base leading-relaxed text-white/60 md:text-lg" style={grotesk}>
          {c.solution.body}
        </p>
      </Reveal>
      <RolePicker />
    </Section>
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
        </div>
        <ScrollInsidePhone src={meta.shot} alt={`${label} profile in the TORA app`} glow={meta.color} scrollLabel={c.drawer.scroll} className="md:order-2" />
      </div>
    </motion.div>
  );
}

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
    <div className="mt-14 md:mt-16">
      <AnimatePresence mode="wait" initial={false}>
        {selected === null ? (
          <motion.div key="picker"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }} transition={{ duration: 0.4, ease: EASE }}>
            <p className="mb-8 text-center text-[11px] uppercase tracking-[0.3em] text-white/45" style={supreme}>{c.solution.chooseRole}</p>
            <div className="grid gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-4">
              {ROLE_META.map((r, i) => (
                <button key={r.id} onClick={() => setSelected(i)}
                  className="group flex flex-row items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.04] md:flex-col md:items-center md:gap-5 md:px-6 md:py-10 md:text-center">
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-105 [&_svg]:h-8 [&_svg]:w-8 md:h-24 md:w-24 md:[&_svg]:h-12 md:[&_svg]:w-12" style={{ background: `${r.color}18`, border: `1px solid ${r.color}55` }}>
                    {r.icon(r.color)}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col items-start md:items-center">
                    <span className="text-lg font-bold uppercase tracking-wide md:text-xl" style={{ ...rajdhani, color: r.color }}>{ROLE_LABELS[i]}</span>
                    <span className="mt-1 text-[13px] leading-relaxed text-white/45 md:max-w-[16rem]" style={grotesk}>{c.roles[i].body}</span>
                    <span className="mt-2 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-white/35 transition-colors group-hover:text-white/70 md:mt-3" style={supreme}>
                      {c.solution.tapToExplore}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <RoleDetail key={"detail-" + selected} index={selected} onPick={setSelected} onBack={() => setSelected(null)} reduce={reduce} />
        )}
      </AnimatePresence>
    </div>
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

function Journey() {
  const c = useC();
  const { open } = useHomeDrawer();
  return (
    <Section id="journey">
      <Reveal className="text-center"><div className="flex justify-center"><Eyebrow>{c.journey.eyebrow}</Eyebrow></div></Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-5 text-center text-3xl font-black uppercase leading-[1.05] tracking-tight text-white text-balance md:text-5xl" style={rajdhani}>
          {c.journey.heading}
        </h2>
      </Reveal>
      <div className="mt-16 grid gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-5">
        {c.journey.steps.map((s, i) => (
          <Reveal key={i} delay={i * 0.06}>
            <ExploreTile n={String(i + 1)} title={s.title} body={s.body} onOpen={() => open(JOURNEY_IDS[i])} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function Touring() {
  const c = useC();
  const { open } = useHomeDrawer();
  return (
    <Section id="touring">
      <Reveal><Eyebrow>{c.touring.eyebrow}</Eyebrow></Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-5 max-w-2xl text-3xl font-black uppercase leading-[1.03] tracking-tight text-white text-balance md:text-5xl" style={rajdhani}>
          {c.touring.heading}
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/60 md:text-base" style={grotesk}>
          {c.touring.body}
        </p>
      </Reveal>
      <div className="mt-14 grid gap-3 md:grid-cols-2 md:gap-5">
        {c.touring.tiles.map((t, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <ExploreTile icon={TOURING_META[i].icon} title={t.title} body={t.body} onOpen={() => open(TOURING_META[i].id)} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function WhyTora() {
  const c = useC();
  return (
    <Section id="why" className="text-center">
      <Reveal className="flex justify-center"><Eyebrow>{c.why.eyebrow}</Eyebrow></Reveal>
      <Reveal delay={0.05}>
        <h2 className="mx-auto mt-6 max-w-4xl text-4xl font-black uppercase leading-[1.02] tracking-tight text-white md:text-6xl" style={rajdhani}>
          {c.why.headingLead}{" "}
          <span className="text-infrared">{c.why.headingAccent}</span>
        </h2>
      </Reveal>
      <Reveal delay={0.12}>
        <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg" style={grotesk}>
          {c.why.body}
        </p>
      </Reveal>
    </Section>
  );
}

function FoundingCTA() {
  const c = useC();
  return (
    <Section id="join" className="text-center">
      <Reveal className="flex justify-center"><Eyebrow>{c.cta.eyebrow}</Eyebrow></Reveal>
      <Reveal delay={0.05}>
        <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-black uppercase leading-[1.0] tracking-tight text-white md:text-7xl" style={rajdhani}>
          {c.cta.headingLine1}<br />{c.cta.headingLine2}
        </h2>
      </Reveal>
      <Reveal delay={0.12}>
        <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg" style={grotesk}>
          {c.cta.body}
        </p>
      </Reveal>
      <div className="mx-auto mt-12 grid max-w-3xl gap-5 md:grid-cols-2">
        {c.cta.cards.map((f, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-left" style={{ borderTop: `2px solid ${INFRARED}` }}>
              <h3 className="text-base font-semibold text-white" style={supreme}>{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55" style={grotesk}>{f.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.2}>
        <div className="mt-12 flex flex-col items-center gap-4">
          <Link href="/apply" className="rounded-full bg-infrared px-10 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_34px_rgba(255,51,102,0.55)] hover:brightness-110" style={supreme}>
            {c.cta.button}
          </Link>
          <span className="text-sm text-white/45" style={grotesk}>{c.cta.foot}</span>
        </div>
      </Reveal>
    </Section>
  );
}

function Closing() {
  const c = useC();
  return (
    <section className="flex flex-col items-center justify-center gap-6 px-6 py-28 text-center">
      <Reveal>
        <Image src="/tora_logo_transparent.png" alt="TORA" width={400} height={133} className="h-auto w-[150px] opacity-90" />
      </Reveal>
      <Reveal delay={0.08}>
        <span className="text-[11px] uppercase tracking-[0.4em] text-white/45" style={supreme}>{c.hero.footer}</span>
      </Reveal>
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
      <HomeDrawerProvider content={map} labels={labels}>
        <LangMenu current={lang} label={content.ui.language} />
        <main className="relative overflow-x-clip font-sans text-white selection:bg-infrared/30">
          <ScrollProgress />
          <ChapterNav />
          <FoundingBackdrop />
          <Hero />
          <ProblemSolution />
          <Journey />
          <Touring />
          <WhyTora />
          <FoundingCTA />
          <Closing />
        </main>
      </HomeDrawerProvider>
    </Cx.Provider>
  );
}
