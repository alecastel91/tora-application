"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/* ---------------------------------------------------------------- content */

const INFRARED = "#FF3366";
const ROLE_COLOR: Record<string, string> = {
  artist: "#6B5FFF",
  agent: "#00C875",
  promoter: "#FFB800",
  venue: "#FF5757",
};

export type DrawerItem = {
  kind: "role" | "feature";
  label: string;
  color: string;
  shot: string;
  video?: string;
  title: string;
  body: string;
};

/** Localizable drawer chrome. Defaults keep the untranslated homepage in English. */
export type DrawerLabels = { role: string; feature: string; join: string; scroll: string };
const DEFAULT_LABELS: DrawerLabels = {
  role: "Role",
  feature: "Feature",
  join: "Join TORA",
  scroll: "Scroll",
};

export const DRAWER_CONTENT: Record<string, DrawerItem> = {
  // roles
  artist: {
    kind: "role", label: "Artist", color: ROLE_COLOR.artist, shot: "/home/artist.png",
    title: "Get discovered. Book globally.",
    body: "A verified artist profile — genres, socials, availability, press kit and past highlights — visible to promoters and venues worldwide, not just in your city.",
  },
  agent: {
    kind: "role", label: "Agent", color: ROLE_COLOR.agent, shot: "/home/agent.png",
    title: "Manage your roster. Close deals.",
    body: "One dashboard for your whole roster: track every deal, calendar, contract and payment across all your artists, and book on their behalf.",
  },
  promoter: {
    kind: "role", label: "Promoter", color: ROLE_COLOR.promoter, shot: "/home/promoter.png",
    title: "Find the right act. Build the right lineup.",
    body: "Search artists by genre, location and availability and send proposals straight to them or their agents. Get notified in advance when an artist you're after is passing through your area — and split touring costs with Tour Kickstart.",
  },
  venue: {
    kind: "role", label: "Venue", color: ROLE_COLOR.venue, shot: "/home/venue.png",
    title: "Host the best talents.",
    body: "From intimate rooms to landmark clubs, your venue profile puts you in front of the artists and agents planning tours. Get in touch with the right promoters, set your dates, capacity and genres, and get notified in advance when an artist you want is coming through your city.",
  },
  // features
  discover: {
    kind: "feature", label: "Discover", color: INFRARED, shot: "/home/discover.png", video: "/home/discover.mp4",
    title: "Search & discovery",
    body: "Explore the whole network on a live globe. Filter by role, genre, location and availability and find the right professional in seconds — wherever they are.",
  },
  connect: {
    kind: "feature", label: "Connect", color: INFRARED, shot: "/home/connect.png",
    title: "Connect & message",
    body: "Send a connection request, then talk directly. Negotiate dates and fees, share documents and keep the whole conversation in one thread.",
  },
  book: {
    kind: "feature", label: "Book", color: INFRARED, shot: "/home/book.png",
    title: "The full booking workflow",
    body: "Offer, negotiate, accept — every step tracked. Real deals with fees, dates and status, from first contact all the way to payment received.",
  },
  contract: {
    kind: "feature", label: "Contract", color: INFRARED, shot: "/home/contract.png",
    title: "Sign the contract",
    body: "Generate, send and sign booking contracts digitally — a real e-signature, right inside the platform. No emailing PDFs back and forth.",
  },
  tour: {
    kind: "feature", label: "Tour", color: INFRARED, shot: "/home/tour.png",
    title: "Tour Kickstart",
    body: "Promoters and venues co-host the same touring artist — splitting travel costs and sharing risk, making previously impossible bookings viable.",
  },
  // journey steps + touring (used by /foundingmembers)
  offer: {
    kind: "feature", label: "Offer & negotiate", color: INFRARED, shot: "/home/offer.png",
    title: "Make an offer. Agree the terms.",
    body: "Submit a booking offer with dates, fee and terms, then counter and refine until both sides agree — every step tracked, right up to a signed deal.",
  },
  confirmed: {
    kind: "feature", label: "Confirmed", color: INFRARED, shot: "/home/book.png",
    title: "Booking confirmed.",
    body: "Contract signed, payment confirmed — the deal is done. Offer, contract, documents and payment status all live in one place, with multi-currency support, from first contact to final settlement.",
  },
  travel: {
    kind: "feature", label: "Travel & alerts", color: INFRARED, shot: "/home/calendar.png",
    title: "Travel schedule & smart alerts",
    body: "Publish where you'll be and when. TORA surfaces you to the right market and notifies venues and promoters in advance when a relevant artist is coming to their city.",
  },
};

/* ---------------------------------------------------------------- context */

type Ctx = { open: (id: string) => void };
const HomeDrawerCtx = createContext<Ctx>({ open: () => {} });
export const useHomeDrawer = () => useContext(HomeDrawerCtx);

export function HomeDrawerProvider({
  children,
  content,
  labels,
}: {
  children: ReactNode;
  /** Override the English DRAWER_CONTENT map (e.g. a translated /founding). */
  content?: Record<string, DrawerItem>;
  labels?: DrawerLabels;
}) {
  const [id, setId] = useState<string | null>(null);
  const open = useCallback((next: string) => setId(next), []);
  const close = useCallback(() => setId(null), []);

  useEffect(() => {
    if (!id) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [id, close]);

  return (
    <HomeDrawerCtx.Provider value={{ open }}>
      {children}
      <HomeDrawer id={id} onClose={close} content={content} labels={labels} />
    </HomeDrawerCtx.Provider>
  );
}

/* ----------------------------------------------------------------- drawer */

const rajdhani = { fontFamily: "var(--font-rajdhani), sans-serif" };
const grotesk = { fontFamily: "var(--font-space-grotesk), sans-serif" };

function HomeDrawer({
  id,
  onClose,
  content,
  labels,
}: {
  id: string | null;
  onClose: () => void;
  content?: Record<string, DrawerItem>;
  labels?: DrawerLabels;
}) {
  const reduce = useReducedMotion();
  const map = content ?? DRAWER_CONTENT;
  const lbl = labels ?? DEFAULT_LABELS;
  const item = id ? map[id] : null;

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={item.title}
            data-lenis-prevent
            className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-y-auto overscroll-contain rounded-t-3xl border border-white/10 bg-[#0a0a0f] shadow-2xl sm:max-h-[86vh] sm:rounded-3xl md:flex-row md:overflow-hidden"
            initial={reduce ? { opacity: 0 } : { y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: 40, opacity: 0 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* soft accent glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl"
              style={{ background: item.color, opacity: 0.14 }}
            />

            {/* close */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/70 backdrop-blur transition-colors hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>

            {/* phone / screenshot */}
            <div className="order-2 flex shrink-0 items-center justify-center p-6 sm:p-8 md:order-1 md:w-[46%]">
              <div className="relative w-[240px] rounded-[2rem] bg-black p-2 shadow-2xl sm:w-[260px]">
                {item.kind === "role" ? (
                  <>
                    {/* tall profile — scroll inside the frame */}
                    <div
                      data-lenis-prevent
                      className="h-[360px] overflow-y-auto overscroll-contain rounded-[1.6rem] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20 sm:h-[470px]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.shot} alt={`${item.label} screen`} className="block w-full" />
                    </div>
                    <span className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/75 px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-white/75 backdrop-blur-sm">
                      {lbl.scroll}
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M8 9l4-4 4 4" /><path d="M8 15l4 4 4-4" /></svg>
                    </span>
                  </>
                ) : item.video ? (
                  <video src={item.video} autoPlay muted loop playsInline className="block w-full rounded-[1.6rem]" />
                ) : (
                  <div className="overflow-hidden rounded-[1.6rem]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.shot} alt={`${item.label} screen`} className="block w-full" />
                  </div>
                )}
              </div>
            </div>

            {/* text */}
            <div className="order-1 flex flex-1 flex-col justify-center px-7 pb-9 pt-7 sm:px-9 sm:pb-10 md:order-2 md:py-10">
              <div className="flex items-center gap-3">
                <span className="h-px w-7" style={{ background: item.color }} />
                <span
                  className="text-[11px] uppercase tracking-[0.3em]"
                  style={{ ...grotesk, color: item.color, fontWeight: 600 }}
                >
                  {item.kind === "role" ? lbl.role : lbl.feature} · {item.label}
                </span>
              </div>
              <h3
                className="mt-4 text-2xl font-black uppercase leading-[1.06] tracking-tight text-white md:text-3xl"
                style={rajdhani}
              >
                {item.title}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-white/65" style={grotesk}>
                {item.body}
              </p>
              <a
                href="/apply"
                className="mt-7 inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-transform hover:-translate-y-0.5"
                style={{ background: item.color }}
              >
                {lbl.join}
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
