"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LANGS, type LangCode } from "../_content/types";
import { grotesk, supreme } from "./primitives";

/**
 * Fixed language switcher (top-left, opposite the chapter rail). Each option is
 * a real link to /founding/<code>, so the chosen language lives in the URL and
 * can be shared directly.
 */
export function LangMenu({ current, label }: { current: LangCode; label: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const cur = LANGS.find((l) => l.code === current) ?? LANGS[0];

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className="fixed left-4 top-4 z-50 md:left-6 md:top-6">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-3.5 py-2 text-[11px] uppercase tracking-[0.14em] text-white/80 backdrop-blur transition-colors hover:border-white/35 hover:text-white"
        style={supreme}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3z" />
        </svg>
        <span>{cur.native}</span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-44 overflow-hidden rounded-2xl border border-white/12 bg-[#0a0a0f]/95 p-1.5 shadow-2xl backdrop-blur" role="menu">
          {LANGS.map((l) => (
            <Link
              key={l.code}
              href={`/founding/${l.code}`}
              role="menuitem"
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-[13px] transition-colors ${
                l.code === current ? "bg-infrared/15 text-white" : "text-white/65 hover:bg-white/5 hover:text-white"
              }`}
              style={grotesk}
            >
              <span>{l.native}</span>
              {l.code === current ? <span className="h-1.5 w-1.5 rounded-full bg-infrared" /> : null}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
