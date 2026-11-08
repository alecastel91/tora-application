"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const EASE_TORA = [0.16, 1, 0.3, 1] as const;
const labelFont = { fontFamily: "var(--font-space-grotesk), sans-serif" };

/**
 * Beat 3 coda — the one place on the page where the network stops being a
 * metaphor. Six portraits rise out of the node field under the shift headline,
 * each tagged with a ROLE, never a name and never a city: these are category
 * illustrations in the same job the role icons do further down, not members.
 *
 * The middle two sit lower and the third higher, so the row reads as nodes at
 * different depths rather than as a contact sheet.
 */
const FACES = [
  { src: "/home/faces/1.jpg", role: "Artist", color: "#6B5FFF", offset: "translate-y-0" },
  { src: "/home/faces/2.jpg", role: "Agent", color: "#00C875", offset: "md:translate-y-6" },
  { src: "/home/faces/3.jpg", role: "Artist", color: "#6B5FFF", offset: "md:-translate-y-5" },
  { src: "/home/faces/4.jpg", role: "Promoter", color: "#FFB800", offset: "md:translate-y-4" },
  { src: "/home/faces/5.jpg", role: "Artist", color: "#6B5FFF", offset: "md:-translate-y-3" },
  { src: "/home/faces/6.jpg", role: "Venue", color: "#FF5757", offset: "md:translate-y-7" },
];

export function FacesStrip() {
  return (
    <div className="relative mx-auto mt-12 grid w-full max-w-4xl grid-cols-3 gap-2 md:mt-14 md:grid-cols-6 md:gap-3">
      {FACES.map((face, i) => (
        <motion.div
          key={face.src}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE_TORA, delay: i * 0.08 }}
          className={`relative aspect-[3/4] overflow-hidden rounded-sm bg-[#101015] ${face.offset}`}
        >
          <Image
            src={face.src}
            alt=""
            aria-hidden="true"
            fill
            sizes="(min-width: 768px) 160px, 33vw"
            className="object-cover opacity-90"
          />
          {/* Foot scrim so the role tag reads on any of the six frames */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(10,10,10,0.82), transparent 52%)" }}
          />
          <span
            className="absolute bottom-1.5 left-2 text-[8px] font-medium uppercase tracking-[0.18em] md:bottom-2 md:text-[9px]"
            style={{ ...labelFont, color: face.color }}
          >
            {face.role}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
