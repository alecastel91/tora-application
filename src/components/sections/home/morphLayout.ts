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

/** 4 role cards in a centered 2×2 grid. */
export function roleBoxes(w: number, h: number): Box[] {
  const cardW = clamp(w * 0.34, 240, 340);
  const cardH = clamp(h * 0.24, 120, 160);
  const gapX = clamp(w * 0.05, 24, 56);
  const gapY = clamp(h * 0.05, 24, 48);
  const totalW = cardW * 2 + gapX;
  const totalH = cardH * 2 + gapY;
  const x0 = (w - totalW) / 2;
  const y0 = (h - totalH) / 2 + h * 0.03;
  const boxes: Box[] = [];
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      boxes.push({ x: x0 + c * (cardW + gapX), y: y0 + r * (cardH + gapY), w: cardW, h: cardH });
    }
  }
  return boxes; // [topL, topR, botL, botR]
}

/** 5 solution cards: 3 across the top, 2 across the bottom, centered. */
export function solutionBoxes(w: number, h: number): Box[] {
  const cardW = clamp(w * 0.22, 200, 280);
  const cardH = clamp(h * 0.3, 175, 235);
  const gap = clamp(w * 0.025, 18, 40);
  const totalH = cardH * 2 + gap;
  const y0 = (h - totalH) / 2 + h * 0.03;
  const rowWidth = (n: number) => n * cardW + (n - 1) * gap;
  const boxes: Box[] = [];
  let x0 = (w - rowWidth(3)) / 2;
  for (let i = 0; i < 3; i++) boxes.push({ x: x0 + i * (cardW + gap), y: y0, w: cardW, h: cardH });
  x0 = (w - rowWidth(2)) / 2;
  for (let i = 0; i < 2; i++) boxes.push({ x: x0 + i * (cardW + gap), y: y0 + cardH + gap, w: cardW, h: cardH });
  return boxes;
}
