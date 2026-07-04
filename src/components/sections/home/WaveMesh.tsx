"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const INFRARED = "255,51,102";

/**
 * Ambient pink wireframe wave-mesh — a perspective grid that ripples along the
 * lower portion of the viewport like a horizon, to break up the flat black.
 * Fixed and subtle; masked to fade out toward the top so it never competes with
 * the hero text or the node globe. Static single frame under reduced motion.
 *
 * Drawn as polylines (one stroke per row / per column) to keep it cheap.
 */
export function WaveMesh() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    const COLS = 40;
    const ROWS = 22;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      const t = time * 0.001;
      const horizon = h * 0.3;
      ctx.clearRect(0, 0, w, h);

      // Build the displaced grid points.
      const pts: [number, number, number][][] = [];
      for (let r = 0; r <= ROWS; r++) {
        const dr = r / ROWS; // 0 far → 1 near
        const rowY = horizon + Math.pow(dr, 1.7) * (h - horizon);
        const spread = 0.5 + 1.5 * dr;
        const row: [number, number, number][] = [];
        for (let c = 0; c <= COLS; c++) {
          const nx = c / COLS - 0.5;
          const x = w / 2 + nx * w * spread;
          const wave =
            Math.sin(nx * 6 + t * 1.1 + dr * 3) * 0.5 +
            Math.sin(nx * 11 - t * 0.7) * 0.3 +
            Math.sin(dr * 8 + t * 0.9) * 0.4;
          const y = rowY - wave * (30 * dr);
          row.push([x, y, dr]);
        }
        pts.push(row);
      }

      ctx.lineWidth = 1;

      // Horizontal lines — one polyline per row, brighter as it nears.
      for (let r = 0; r <= ROWS; r++) {
        const dr = r / ROWS;
        ctx.strokeStyle = `rgba(${INFRARED},${0.05 + 0.22 * dr})`;
        ctx.beginPath();
        for (let c = 0; c <= COLS; c++) {
          const [x, y] = pts[r][c];
          if (c === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Vertical lines — one polyline per column, low uniform alpha.
      ctx.strokeStyle = `rgba(${INFRARED},0.08)`;
      for (let c = 0; c <= COLS; c++) {
        ctx.beginPath();
        for (let r = 0; r <= ROWS; r++) {
          const [x, y] = pts[r][c];
          if (r === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    if (reduced) {
      draw(0);
    } else {
      const loop = (time: number) => {
        if (!document.hidden) draw(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 -z-[5] pointer-events-none"
      style={{
        opacity: 0.75,
        maskImage: "linear-gradient(to top, black 45%, transparent 92%)",
        WebkitMaskImage: "linear-gradient(to top, black 45%, transparent 92%)",
      }}
    />
  );
}
