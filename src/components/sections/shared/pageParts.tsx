"use client";

import { useId, useState, useRef, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * The parts /v2 and /founding both build out of.
 *
 * They were written twice, once per page, and had already drifted: the role
 * wall on one page sat under its own room's backdrop because only the other
 * page had been given the z-index. Anything the two pages show identically
 * lives here now, so a fix lands on both.
 */

const EASE = [0.16, 1, 0.3, 1] as const;
const display = { fontFamily: "var(--font-rajdhani), var(--font-space-grotesk), sans-serif" };
const body = { fontFamily: "var(--font-space-grotesk), sans-serif" };

/**
 * The rendered role palette, and the photograph that carries each role.
 *
 * Both were written out in five files and three files respectively, in a repo
 * where the role colours have already gone wrong once by being copied from a
 * stale table. These values are the pixel-verified ones; a different set lives
 * in src/lib/roleColors.ts for admin views and must never be consolidated onto.
 */
export const ROLE_COLORS = {
  artist: "#6B5FFF",
  agent: "#00C875",
  promoter: "#FFB800",
  venue: "#FF5757",
} as const;

export type RoleId = keyof typeof ROLE_COLORS;

export const ROLE_FACES: Record<RoleId, string> = {
  artist: "/home/v2/face-artist.jpg",
  agent: "/home/v2/face-agent.jpg",
  promoter: "/home/v2/face-promoter.jpg",
  venue: "/home/v2/face-venue.jpg",
};

/** Scroll-into-view reveal — fade, rise, and a gentle deblur. Sits still for
 *  anyone who asked their system for less motion. */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** One mark per symptom: a calendar with nothing in it, a cost curve nobody
 *  else carries, a closed door, two nodes that never meet. */
export const PROBLEM_MARKS: ReactNode[] = [
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

/** A symptom: the headline, and the sentence on request. Four paragraphs at
 *  once was a wall of text where the page needed a list. */
export function Symptom({
  mark,
  title,
  sentence,
  defaultOpen = false,
}: {
  mark: ReactNode;
  title: string;
  sentence: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className="bg-black/55 backdrop-blur-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.03] md:gap-4 md:px-6 md:py-4"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="shrink-0 text-infrared"
        >
          {mark}
        </svg>
        <span className="min-w-0 flex-1 text-[14px] font-semibold leading-snug text-white md:text-[15px]" style={body}>
          {title}
        </span>
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="shrink-0 text-white/40"
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.25, ease: EASE }}
        >
          <path d="M9 18l6-6-6-6" />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="sentence"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
            className="overflow-hidden"
          >
            <p
              className="px-4 pb-4 pl-[2.75rem] text-[13.5px] leading-relaxed text-white/55 md:px-6 md:pb-5 md:pl-[3.5rem] md:text-sm"
              style={body}
            >
              {sentence}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** The row drifts as one. It used to stand in an arc, highest in the middle,
 *  which left five screenshots of the same app at five different heights —
 *  the shapes read as misalignment rather than as a shape. */
const ROW_DRIFT = 26;

/**
 * One app screen in a phone frame, drifting at its own speed as the section
 * passes. The drift is what keeps five static PNGs from reading as a product
 * sheet, and it rides inside the transform — as a margin it pushed the caption
 * down with it and the captions lost their shared line.
 *
 * With `onOpen` the frame is the tap target for that screen's drawer.
 */
export function PhoneScreen({
  src,
  drift,
  priority = false,
  onOpen,
  label,
}: {
  src: string;
  drift: number;
  priority?: boolean;
  onOpen?: () => void;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [drift, -drift]);

  const frame = (
    <Image
      src={src}
      alt=""
      aria-hidden="true"
      width={860}
      height={1962}
      priority={priority}
      sizes="(min-width: 768px) 196px, 64vw"
      className="h-auto w-full rounded-[1.6rem]"
    />
  );
  const shell =
    "relative block w-[64vw] max-w-[260px] rounded-[2rem] border border-white/10 bg-black p-1.5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] md:w-[clamp(126px,13.4vw,196px)]";

  return (
    <div ref={ref} className="shrink-0">
      {onOpen ? (
        <motion.button
          type="button"
          onClick={onOpen}
          aria-label={label}
          style={{ y }}
          className={`${shell} group transition-colors hover:border-infrared/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-infrared/70`}
        >
          {frame}
        </motion.button>
      ) : (
        <motion.div style={{ y }} className={shell}>
          {frame}
        </motion.div>
      )}
    </div>
  );
}

/**
 * The photograph on a role card: tinted with the role's colour, stopping above
 * the words and dissolving into the card. Full-bleed, the names sat across
 * people's faces — only Venue escaped it, because her head happens to sit high
 * in frame.
 */
export function RoleFace({ src, color }: { src: string; color: string }) {
  return (
    <>
      <div
        className="absolute inset-x-0 top-0 h-[72%] overflow-hidden"
        style={{
          maskImage: "linear-gradient(180deg, #000 58%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(180deg, #000 58%, transparent 100%)",
        }}
      >
        <Image
          src={src}
          alt=""
          aria-hidden="true"
          fill
          sizes="(min-width: 1152px) 248px, (min-width: 768px) 24vw, 74vw"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 mix-blend-color" style={{ background: color, opacity: 0.22 }} />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.2) 52%, rgba(10,10,10,0.92) 100%)",
        }}
      />
      <span className="absolute left-0 top-0 h-1 w-full" style={{ background: color }} />
    </>
  );
}

/**
 * The row of five screens: swiped on a phone, a row on a desktop, centred under
 * the headings now that they are centred too.
 *
 * With `onOpen` each frame opens that screen's drawer.
 */
export function ScreenStrip({
  items,
  className = "",
  onOpen,
}: {
  items: { shot: string; title: string; body: string }[];
  className?: string;
  onOpen?: (index: number) => void;
}) {
  return (
    <div
      className={`flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:justify-center md:gap-6 md:overflow-visible md:pb-0 lg:gap-8 [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {items.map((item, i) => (
        <div key={item.shot} className="flex shrink-0 snap-center flex-col items-start md:shrink">
          <PhoneScreen
            src={item.shot}
            drift={ROW_DRIFT}
            label={item.title}
            onOpen={onOpen ? () => onOpen(i) : undefined}
          />
          <div className="mt-5 w-[64vw] max-w-[260px] md:w-[clamp(126px,13.4vw,196px)]">
            <h3
              className="text-[17px] font-black uppercase leading-[1.05] tracking-tight text-white md:min-h-[2.2em] md:text-base lg:text-lg"
              style={display}
            >
              {item.title}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-white/55 md:text-[12px] lg:text-[13px]" style={body}>
              {item.body}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * The four roles as four people: swiped on a phone, a wall on a desktop. A
 * card either links somewhere or opens something, and may carry one more line
 * under its blurb.
 */
export function RoleWall({
  items,
  className = "",
  cardHeight,
  footer,
}: {
  items: { id: string; label: string; color: string; face: string; blurb: string; href?: string; onSelect?: () => void }[];
  className?: string;
  /** Tailwind height for the card — the two walls stand at their own scale. */
  cardHeight: string;
  footer?: ReactNode;
}) {
  return (
    <div
      className={`flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-4 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {items.map((role) => {
        const shell = `group relative block w-[74vw] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] text-left md:w-full ${cardHeight}`;
        const inside = (
          <>
            <RoleFace src={role.face} color={role.color} />
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
              <h3
                className="text-[clamp(28px,4.4vw,40px)] font-black uppercase leading-[0.9] tracking-tight"
                style={{ ...display, color: role.color }}
              >
                {role.label}
              </h3>
              <p className="mt-3 min-h-[5em] text-[13px] leading-relaxed text-white/70 md:min-h-[6.6em] md:text-sm" style={body}>
                {role.blurb}
              </p>
              {footer}
            </div>
          </>
        );
        return (
          <div key={role.id} className="shrink-0 snap-center md:shrink">
            {role.href ? (
              <Link href={role.href} className={shell}>
                {inside}
              </Link>
            ) : (
              <button type="button" onClick={role.onSelect} className={shell}>
                {inside}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export { EASE, display, body };
