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

    // Signal strand: instead of dot piles under each card, the nodes settle
    // into a thin horizontal band running behind the single card row — the
    // network threading the cards together. Stable placement from each node's
    // random seed.
    const rowMetrics = (boxes: Box[]) => {
      let left = Infinity;
      let right = -Infinity;
      let cy = 0;
      for (const b of boxes) {
        left = Math.min(left, b.x);
        right = Math.max(right, b.x + b.w);
        cy += b.y + b.h / 2;
      }
      return { left, right, cy: cy / boxes.length, h: boxes[0].h };
    };
    // The strand extends past the row edges and stays vertically tight, so it
    // reads as one thin network line threading through the gaps between cards.
    const strandPos = (i: number, m: ReturnType<typeof rowMetrics>): [number, number] => {
      const reach = width * 0.07;
      return [
        m.left - reach + nodes[i].sx * (m.right - m.left + reach * 2),
        m.cy + (nodes[i].sy - 0.5) * Math.min(m.h * 0.35, 90),
      ];
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
    // opacity transforms in RolesMorph/SolutionsMorph ([0.04,0.18,0.8,0.94]),
    // leading by a hair so the dots visibly arrive first.
    const activeness = (id: string): number => {
      const p = pinProgress(id);
      if (p <= 0 || p >= 1) return 0;
      return Math.min(window01(p, 0.0, 0.16), 1 - window01(p, 0.82, 0.97));
    };

    const draw = (time: number) => {
      // The hero lands with no globe — only the ambient background. The nodes
      // fly out of scatter and assemble into the globe over the first ~0.7
      // viewports of scroll (static-visible under reduced motion).
      const intro = reduced
        ? 1
        : easeInOut(clamp01((window.scrollY - height * 0.12) / (height * 0.55)));

      const cx = width / 2;
      const cy = height / 2;
      const R = Math.min(width, height) * 0.34;
      const angle = time * 0.00006;

      const aR = morphEnabled ? activeness("roles") : 0;
      const aS = morphEnabled ? activeness("solutions") : 0;
      const clustered = Math.max(aR, aS);

      const rM = aR > 0.001 ? rowMetrics(roleBoxes(width, height)) : null;
      const sM = aS > 0.001 ? rowMetrics(solutionBoxes(width, height)) : null;

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

        // morph globe → roles strand → solutions strand
        if (rM) {
          const [rcx, rcy] = strandPos(i, rM);
          X += (rcx - X) * aR;
          Y += (rcy - Y) * aR;
        }
        if (sM) {
          const [sxp, syp] = strandPos(i, sM);
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

      // Strand links — short connections between nearby nodes in the band, so
      // the settled strand reads as one continuous network line threading the
      // cards, not a loose dot pile.
      if (clustered > 0.1) {
        const k = aS >= aR ? 5 : 4;
        ctx.lineWidth = 1;
        for (let i = 0; i + k < count; i++) {
          const j = i + k;
          const dx = px[i] - px[j];
          const dy = py[i] - py[j];
          if (dx * dx + dy * dy > 150 * 150) continue;
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
        const a = ((0.25 + 0.55 * d) * (1 - clustered) + 0.85 * clustered) * Math.max(intro, clustered);
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
