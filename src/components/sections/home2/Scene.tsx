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
  id,
  photo,
  dim = 1,
  className = "",
  innerClassName = "",
  children,
}: {
  /** Anchor for in-page links, the chapter nav and NodeField's narrative. */
  id?: string;
  photo?: string;
  /** Multiplier on the photograph's brightness — the pipeline runs quieter. */
  dim?: number;
  className?: string;
  /** Layout for the content layer — a full-height scene centres its own. */
  innerClassName?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, dim, dim, 0]);
  // Slow push through the whole pass, so a held room never freezes
  const scale = useTransform(scrollYProgress, [0, 1], [1.06, 1.18]);

  return (
    <section id={id} ref={ref} className={`relative scroll-mt-20 ${className}`}>
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
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(118% 82% at 50% 50%, transparent 36%, rgba(10,10,10,0.78) 100%)" }}
          />
        </motion.div>
      )}
      <div className={`relative z-10 ${innerClassName}`}>{children}</div>
    </section>
  );
}
