"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const INFRARED = { r: 255, g: 51, b: 102 };

type Node = {
  // globe (connected) position in 3D unit-sphere space
  x: number;
  y: number;
  z: number;
  // scattered position, as a fraction of viewport (0..1)
  sx: number;
  sy: number;
  // per-node drift phase
  phase: number;
};

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * The signature visual thread: pink nodes that sit scattered while the "problem"
 * beat is on screen, then connect into a slowly-rotating globe/constellation as
 * the #network section scrolls through ("the shift"), and linger as a faint
 * living web behind the rest of the page.
 *
 * A fixed full-viewport <canvas>. Formation progress is read from the #network
 * section's position each frame (self-syncing, no cross-component wiring).
 * Reduced motion → a single static connected frame, no RAF.
 */
export function NodeField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const count = window.innerWidth < 768 ? 46 : 74;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const nodes: Node[] = [];
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2; // 1 .. -1
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = i * golden;
      nodes.push({
        x: Math.cos(theta) * r,
        y,
        z: Math.sin(theta) * r,
        sx: Math.random(),
        sy: Math.random(),
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Precompute links between nodes that are near on the sphere (wireframe feel).
    const links: [number, number][] = [];
    const LINK_DIST = 0.62;
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dz = nodes[i].z - nodes[j].z;
        if (dx * dx + dy * dy + dz * dz < LINK_DIST * LINK_DIST) links.push([i, j]);
      }
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // The globe assembles once on load (scattered → connected over ~1.4s) — the
    // initial wow — then holds and rotates. No scroll dependency.
    const INTRO_MS = 1400;
    let introStart = -1;
    const formation = (time: number) => {
      if (reduced) return 1;
      if (introStart < 0) introStart = time;
      return clamp01((time - introStart) / INTRO_MS);
    };

    const draw = (time: number) => {
      const f = formation(time);
      const ef = easeInOut(f);
      const cx = width / 2;
      const cy = height / 2;
      const R = Math.min(width, height) * 0.34;
      const angle = time * 0.00006; // slow globe rotation

      ctx.clearRect(0, 0, width, height);

      // Positions for this frame
      const px: number[] = new Array(count);
      const py: number[] = new Array(count);
      const depth: number[] = new Array(count);
      for (let i = 0; i < count; i++) {
        const n = nodes[i];
        const rx = n.x * Math.cos(angle) - n.z * Math.sin(angle);
        const rz = n.x * Math.sin(angle) + n.z * Math.cos(angle);
        const drift = reduced ? 0 : Math.sin(time * 0.0008 + n.phase) * 3;
        const gx = cx + rx * R;
        const gy = cy + n.y * R + drift;
        const scx = n.sx * width;
        const scy = n.sy * height;
        px[i] = scx + (gx - scx) * ef;
        py[i] = scy + (gy - scy) * ef;
        depth[i] = (rz + 1) / 2; // 0 back .. 1 front
      }

      // Links (only meaningful once forming)
      if (f > 0.01) {
        for (const [i, j] of links) {
          const d = (depth[i] + depth[j]) / 2;
          const a = f * 0.18 * (0.4 + 0.6 * d);
          ctx.strokeStyle = `rgba(${INFRARED.r},${INFRARED.g},${INFRARED.b},${a})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(px[i], py[i]);
          ctx.lineTo(px[j], py[j]);
          ctx.stroke();
        }
      }

      // Nodes
      for (let i = 0; i < count; i++) {
        const d = depth[i];
        const a = 0.25 + 0.55 * d;
        const size = 1 + 1.6 * d;
        ctx.fillStyle = `rgba(${INFRARED.r},${INFRARED.g},${INFRARED.b},${a})`;
        ctx.beginPath();
        ctx.arc(px[i], py[i], size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    if (reduced) {
      draw(0); // single static connected frame
    } else {
      const loop = (t: number) => {
        if (!document.hidden) draw(t);
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
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.85 }}
    />
  );
}
