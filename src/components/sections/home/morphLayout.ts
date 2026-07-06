/**
 * Shared viewport-space layouts for the "globe → boxes" morph. Both NodeField
 * (canvas particle clusters) and the morph sections (DOM cards) read these, so
 * the nodes gather exactly where the cards resolve. Coordinates are in CSS px
 * relative to the viewport (the canvas is fixed full-viewport; the cards live in
 * a sticky full-viewport child), so they line up.
 *
 * Desktop-only — mobile / reduced motion use the grid/stack fallbacks.
 */
export type Box = { x: number; y: number; w: number; h: number };

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** 4 role cards in one elegant row of squares spanning the page. */
export function roleBoxes(w: number, h: number): Box[] {
  const gap = clamp(w * 0.02, 16, 32);
  const side = Math.min(clamp((w * 0.86 - gap * 3) / 4, 200, 300), h * 0.42);
  const x0 = (w - (side * 4 + gap * 3)) / 2;
  const y0 = (h - side) / 2 + h * 0.02;
  const boxes: Box[] = [];
  for (let i = 0; i < 4; i++) boxes.push({ x: x0 + i * (side + gap), y: y0, w: side, h: side });
  return boxes;
}

/** 5 solution cards in one row — the booking pipeline, left to right. */
export function solutionBoxes(w: number, h: number): Box[] {
  const gap = clamp(w * 0.016, 14, 26);
  const cardW = clamp((w * 0.9 - gap * 4) / 5, 190, 260);
  const cardH = clamp(h * 0.36, 260, 330);
  const x0 = (w - (cardW * 5 + gap * 4)) / 2;
  const y0 = (h - cardH) / 2 + h * 0.02;
  const boxes: Box[] = [];
  for (let i = 0; i < 5; i++) boxes.push({ x: x0 + i * (cardW + gap), y: y0, w: cardW, h: cardH });
  return boxes;
}
