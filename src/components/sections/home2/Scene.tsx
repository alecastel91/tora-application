"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * A beat of the page, carrying its own full-screen backdrop.
 *
 * The first build drove one shared film off page progress with hand-written
 * percentages, and the rooms drifted out of step with the copy the moment any
 * section changed height — the venue paragraph arrived over the agent's green
 * room. Here each scene owns its backdrop and fades it on its OWN scroll
 * range, so a room can never be out of step with the words on top of it.
 *
 * Neighbouring scenes overlap while one is leaving and the next arriving, which
 * is what produces the cross-fade: nothing cuts, and a scene with no photo (the
 * hero, the turn, the way out) simply lets the node globe show through.
 */
export function Scene({
  photo,
  tint,
  dim = 1,
  className = "",
  children,
}: {
  photo?: string;
  tint?: string;
  /** Multiplier on the photograph's brightness — the pipeline runs quieter. */
  dim?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, dim, dim, 0]);
  // Slow push through the whole pass, so a held room never freezes
  const scale = useTransform(scrollYProgress, [0, 1], [1.06, 1.18]);

  return (
    <section ref={ref} className={`relative ${className}`}>
      {photo && (
        <motion.div aria-hidden="true" style={{ opacity }} className="pointer-events-none fixed inset-0 z-[1]">
          <motion.div style={{ scale }} className="absolute inset-0">
            <Image src={photo} alt="" fill sizes="100vw" className="object-cover" />
          </motion.div>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.6) 28%, rgba(10,10,10,0.64) 72%, rgba(10,10,10,0.92) 100%)",
            }}
          />
          {/* Light, not a filter: a flat fill at any usable strength turned the
              room into one colour and threw the photograph away. */}
          {tint && (
            <div
              className="absolute inset-0"
              style={{ background: `radial-gradient(90% 70% at 50% 88%, ${tint}, transparent 72%)`, opacity: 0.3 }}
            />
          )}
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(118% 82% at 50% 50%, transparent 36%, rgba(10,10,10,0.78) 100%)" }}
          />
        </motion.div>
      )}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
