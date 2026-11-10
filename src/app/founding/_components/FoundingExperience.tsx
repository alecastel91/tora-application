"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  HomeDrawerProvider,
  useHomeDrawer,
  DRAWER_CONTENT,
  type DrawerItem,
} from "@/components/sections/home/HomeDrawer";
import { PROBLEM_MARKS, ROLE_FACES, RoleWall, ScreenStrip, Symptom } from "@/components/sections/shared/pageParts";
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

/** One of the five screens, worded by the site catalogue (see [lang]/page.tsx). */
export type JourneyStep = { title: string; body: string };

/* --------------------------------------------------------------- constants */

const INFRARED = "#FF3366";

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

/** The homepage's five screens, in use order: find the people, see when they
 *  are near, build the tour, agree the deal, keep the record. Each is still
 *  the tap target for its own drawer. */
const JOURNEY_IDS = ["discover", "travel", "tour", "offer", "confirmed"] as const;

const JOURNEY_SHOTS = [
  "/home/discover.png",
  "/home/calendar.png",
  "/home/tour.png",
  "/home/offer.png",
  "/home/book.png",
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
      {/* The wordmark sits at the centre of the node globe, which is drawn at the
          centre of the viewport; everything else hangs below it. Stacked in one
          centred column the logo rode above the sphere. */}
      <motion.div style={{ opacity, y }} className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: EASE }}
        >
          <Image src="/tora_logo_transparent.png" alt="TORA" width={500} height={166} priority className="h-auto w-[190px] md:w-[260px]" />
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

      </motion.div>

      <motion.div style={{ opacity, y }} className="absolute inset-x-0 bottom-[16vh] z-10 flex flex-col items-center px-6">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-[9.5px] leading-[1.9] uppercase tracking-[0.22em] text-infrared/90 md:text-[11px] md:tracking-[0.3em]"
          style={{ ...supreme, fontWeight: 500 }}
        >
          {c.hero.eyebrow.split("·").map((p) => p.trim()).join(" · ")}
        </motion.span>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="mt-7 flex flex-col items-center gap-4 md:mt-8"
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
    <section id="problem" className="relative scroll-mt-20 px-6 py-20 md:px-10 md:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal><Eyebrow>{c.problem.eyebrow}</Eyebrow></Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 max-w-3xl text-[clamp(28px,5vw,60px)] font-black uppercase leading-[0.98] tracking-tight text-white text-balance" style={rajdhani}>
            {c.problem.heading}
          </h2>
        </Reveal>

        <div className="mt-9 max-w-3xl divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 md:mt-11">
          {c.problem.items.map((p, i) => (
            <Reveal key={i} delay={0.08 + i * 0.07}>
              <Symptom mark={PROBLEM_MARKS[i]} title={p.title} sentence={p.body} defaultOpen={i === 0} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.16}>
          <div className="mt-14 md:mt-16">
            <Eyebrow>{c.solution.eyebrow}</Eyebrow>
            <h2 className="mt-5 max-w-4xl text-[clamp(28px,5.2vw,64px)] font-black uppercase leading-[0.96] tracking-tight text-white" style={rajdhani}>
              {c.solution.headingLead}{" "}
              <span className="text-infrared">{c.solution.headingAccent}</span>
            </h2>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/60 md:text-base" style={grotesk}>
              {c.solution.body}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
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
    <section id="roles" className="scroll-mt-20 py-12 md:py-16">
      <AnimatePresence mode="wait" initial={false}>
        {selected === null ? (
          <motion.div key="picker"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }} transition={{ duration: 0.4, ease: EASE }}>
            <div className="mx-auto w-full max-w-6xl px-6 md:px-0">
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/45" style={supreme}>{c.solution.chooseRole}</p>
            </div>
            {/* A swipe on a phone, a wall on a desktop — the roles cost one screen either way. */}
            <RoleWall
              className="mt-7 px-6 md:mx-auto md:max-w-6xl md:px-0"
              cardHeight="h-[58vh] md:h-[54vh]"
              items={ROLE_META.map((r, i) => ({
                id: r.id,
                label: ROLE_LABELS[i],
                color: r.color,
                face: ROLE_FACES[r.id],
                blurb: c.roles[i].body,
                onSelect: () => setSelected(i),
              }))}
              footer={
                <span className="mt-3 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-white/45 transition-colors group-hover:text-white" style={supreme}>
                  {c.solution.tapToExplore}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </span>
              }
            />
          </motion.div>
        ) : (
          <div className="mx-auto w-full max-w-6xl px-6 md:px-0">
            <RoleDetail key={"detail-" + selected} index={selected} onPick={setSelected} onBack={() => setSelected(null)} reduce={reduce} />
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Journey({ journey }: { journey: JourneyStep[] }) {
  const c = useC();
  const { open } = useHomeDrawer();
  return (
    <section id="journey" className="relative scroll-mt-20 px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal><Eyebrow>{c.journey.eyebrow}</Eyebrow></Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 max-w-3xl text-[clamp(28px,5vw,60px)] font-black uppercase leading-[0.98] tracking-tight text-white text-balance" style={rajdhani}>
            {c.journey.heading}
          </h2>
        </Reveal>

        <ScreenStrip
          className="mt-10 md:mt-12"
          items={journey.map((step, i) => ({ shot: JOURNEY_SHOTS[i], title: step.title, body: step.body }))}
          onOpen={(i) => open(JOURNEY_IDS[i])}
        />
      </div>
    </section>
  );
}

/* The door — why, the invitation and the sign-off in one frame.
   They were three sections, each with its own full padding, saying one thing:
   this is who it is for, and here is the way in. */
function Door() {
  const c = useC();
  return (
    <section id="why" className="scroll-mt-20 px-6 pb-20 pt-16 text-center md:pt-20">
      <Reveal className="flex justify-center"><Eyebrow>{c.why.eyebrow}</Eyebrow></Reveal>
      <Reveal delay={0.05}>
        <h2 className="mx-auto mt-6 max-w-4xl text-[clamp(28px,5.2vw,64px)] font-black uppercase leading-[1.0] tracking-tight text-white" style={rajdhani}>
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
          <h2 className="mx-auto mt-6 max-w-3xl break-keep text-[clamp(30px,5.6vw,68px)] font-black uppercase leading-[0.96] tracking-tight text-white" style={rajdhani}>
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


export function FoundingExperience({ content, lang, journey }: { content: FoundingContent; lang: LangCode; journey: JourneyStep[] }) {
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
          <Journey journey={journey} />
          <Door />
        </main>
      </HomeDrawerProvider>
      </LangCx.Provider>
    </Cx.Provider>
  );
}
