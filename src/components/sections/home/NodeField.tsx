"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { roleBoxes, solutionBoxes, type Box } from "./morphLayout";

const INFRARED = { r: 255, g: 51, b: 102 };

type Node = {
  x: number; // globe 3D unit-sphere coords
  y: number;
  z: number;
  sx: number; // stable random 0..1, for load-scatter + within-cluster placement
  sy: number;
  phase: number;
};

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * The signature visual thread. On load the nodes assemble into a slowly-rotating
 * globe (the wow). As #roles / #solutions scroll through the viewport centre, the
 * globe blows apart and the nodes gather into clusters that sit exactly where the
 * role / solution cards resolve (shared morphLayout). Links fade out while
 * clustered so it reads as dot-clouds, not a tangle.
 *
 * Fixed full-viewport <canvas>. On mobile / reduced motion it stays a static
 * globe (the sections use their own grid/stack fallbacks, no morph).
 */
export function NodeField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const morphEnabled = isDesktop && !reduced;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const count = window.innerWidth < 768 ? 46 : 76;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const nodes: Node[] = [];
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
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

    // Node's target in/around a cluster box (stable placement from its random
    // seed). Slightly wider than the box so some dots ring the card edges sharp
    // while the ones behind the glass read as bokeh.
    const clusterPos = (i: number, boxes: Box[]): [number, number] => {
      const b = boxes[i % boxes.length];
      return [b.x + (-0.06 + 1.12 * nodes[i].sx) * b.w, b.y + (-0.08 + 1.16 * nodes[i].sy) * b.h];
    };

    // Pin progress of a tall pinned section (sticky 100vh child): 0 when the pin
    // engages, 1 when it releases. Mirrors framer's useScroll("start start" →
    // "end end") so canvas and DOM share one clock.
    const pinProgress = (id: string): number => {
      const el = document.getElementById(id);
      if (!el) return -1;
      const rect = el.getBoundingClientRect();
      const range = rect.height - height;
      if (range <= 0) return -1;
      return -rect.top / range;
    };

    const window01 = (p: number, a: number, b: number) => easeInOut(clamp01((p - a) / (b - a)));

    // Gather exactly when the cards resolve: these windows shadow the card
    // opacity transforms in RolesMorph/SolutionsMorph ([0.06,0.22,0.8,0.94]),
    // leading by a hair so the dots visibly arrive first.
    const activeness = (id: string): number => {
      const p = pinProgress(id);
      if (p <= 0 || p >= 1) return 0;
      return Math.min(window01(p, 0.03, 0.2), 1 - window01(p, 0.82, 0.97));
    };

    // Load assembly: scattered → globe over ~1.4s, once.
    const INTRO_MS = 1400;
    let introStart = -1;

    const draw = (time: number) => {
      if (introStart < 0) introStart = time;
      const intro = reduced ? 1 : easeInOut(clamp01((time - introStart) / INTRO_MS));

      const cx = width / 2;
      const cy = height / 2;
      const R = Math.min(width, height) * 0.34;
      const angle = time * 0.00006;

      const aR = morphEnabled ? activeness("roles") : 0;
      const aS = morphEnabled ? activeness("solutions") : 0;
      const clustered = Math.max(aR, aS);

      const rBoxes = aR > 0.001 ? roleBoxes(width, height) : null;
      const sBoxes = aS > 0.001 ? solutionBoxes(width, height) : null;

      ctx.clearRect(0, 0, width, height);

      const px: number[] = new Array(count);
      const py: number[] = new Array(count);
      const depth: number[] = new Array(count);

      for (let i = 0; i < count; i++) {
        const n = nodes[i];
        // globe position (rotating), with a little idle drift
        const rx = n.x * Math.cos(angle) - n.z * Math.sin(angle);
        const rz = n.x * Math.sin(angle) + n.z * Math.cos(angle);
        const drift = reduced ? 0 : Math.sin(time * 0.0008 + n.phase) * 3;
        const gx = cx + rx * R;
        const gy = cy + n.y * R + drift;
        depth[i] = (rz + 1) / 2;

        // load scatter → globe
        const scx = n.sx * width;
        const scy = n.sy * height;
        let X = scx + (gx - scx) * intro;
        let Y = scy + (gy - scy) * intro;

        // morph globe → role clusters → solution clusters
        if (rBoxes) {
          const [rcx, rcy] = clusterPos(i, rBoxes);
          X += (rcx - X) * aR;
          Y += (rcy - Y) * aR;
        }
        if (sBoxes) {
          const [sxp, syp] = clusterPos(i, sBoxes);
          X += (sxp - X) * aS;
          Y += (syp - Y) * aS;
        }
        px[i] = X;
        py[i] = Y;
      }

      // Links: strong on the globe, fade out as nodes cluster.
      const linkFade = 1 - clustered;
      if (linkFade > 0.02) {
        for (const [i, j] of links) {
          const d = (depth[i] + depth[j]) / 2;
          const a = intro * linkFade * 0.18 * (0.4 + 0.6 * d);
          if (a <= 0.005) continue;
          ctx.strokeStyle = `rgba(${INFRARED.r},${INFRARED.g},${INFRARED.b},${a})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(px[i], py[i]);
          ctx.lineTo(px[j], py[j]);
          ctx.stroke();
        }
      }

      // Constellation links inside each settled cluster — nodes i and i+k share
      // a box by construction (clusterPos uses i % k), so each cluster reads as
      // a small living network, not a loose dot pile.
      if (clustered > 0.1) {
        const k = aS >= aR ? 5 : 4;
        ctx.lineWidth = 1;
        for (let i = 0; i + k < count; i++) {
          const j = i + k;
          const dx = px[i] - px[j];
          const dy = py[i] - py[j];
          if (dx * dx + dy * dy > 170 * 170) continue;
          ctx.strokeStyle = `rgba(${INFRARED.r},${INFRARED.g},${INFRARED.b},${clustered * 0.13})`;
          ctx.beginPath();
          ctx.moveTo(px[i], py[i]);
          ctx.lineTo(px[j], py[j]);
          ctx.stroke();
        }
      }

      for (let i = 0; i < count; i++) {
        // when clustered, brighten uniformly (no globe depth); on globe, use depth
        const d = depth[i];
        const a = (0.25 + 0.55 * d) * (1 - clustered) + 0.85 * clustered;
        const size = (1 + 1.6 * d) * (1 - clustered) + 2.2 * clustered;
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
      draw(0);
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
  }, [reduced, morphEnabled]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.9 }}
    />
  );
}
