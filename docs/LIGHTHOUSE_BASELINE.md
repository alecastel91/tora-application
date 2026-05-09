# Lighthouse / PageSpeed Insights Baseline

Snapshot of TORA's performance + a11y + best-practices + SEO scores. Re-run after major changes (Tailwind migration, Stripe wiring, image optimization, etc.) and append to the history below.

## Current baseline — 2026-05-09

Source: PageSpeed Insights (https://pagespeed.web.dev/), powered by Lighthouse v12.

| URL | Form | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|---|
| torahub.io | Mobile | **83** 🟠 | 95 🟢 | 100 🟢 | 100 🟢 |
| torahub.io | Desktop | 100 🟢 | 95 🟢 | 100 🟢 | 100 🟢 |
| app.torahub.io | Mobile | 89 🟠 | **89** 🟠 | 92 🟢 | 92 🟢 |
| app.torahub.io | Desktop | 99 🟢 | **89** 🟠 | 92 🟢 | 92 🟢 |

(Bold = lowest score per row, marking the fix-target.)

## Interpretation

### torahub.io (Next.js landing + admin)
- Desktop perf 100 / mobile 83: classic split — desktop fast hardware, mobile is the bottleneck.
- Mobile perf 83 likely caused by: globe SVG render, Google fonts (Orbitron/Rajdhani/Inter/Space Grotesk = 4 font families!), Vercel Analytics + Sentry scripts loading sequentially.
- A11y 95: missing 5 points likely from contrast on the dark theme or missing alt text on 1-2 images.
- BP + SEO at 100: CSP + security headers help here. Hard to improve further.

### app.torahub.io (Vite/React main app, login screen tested — auth-gated past)
- Same desktop/mobile pattern as landing.
- A11y 89: lowest score. Likely cause = form inputs missing `<label for>` associations, or hint text with low contrast. **Easiest win.**
- BP + SEO 92: lower than landing. Acceptable for an auth-gated app (search engines can't crawl past login anyway).

## Realistic targets before September launch

| URL | Metric | From | To | How |
|---|---|---|---|---|
| torahub.io mobile | Performance | 83 | 90+ | Preload critical fonts; lazy-load globe SVG; subset Google Fonts |
| app.torahub.io | A11y | 89 | 95+ | Add `<label for>` to form inputs; verify hint-text contrast |

Lower-priority wins (skip until after launch):
- app.torahub.io BP/SEO from 92 to 100 — marginal value for an authenticated app
- torahub.io A11y from 95 to 100 — already very high

## Re-test schedule

| When | Why |
|---|---|
| After Phase 6 (Tailwind migration) | Tailwind CSS bundle size could affect performance |
| After Phase 4 (Stripe wiring) | Stripe.js adds ~150KB to bundle |
| Pre-launch (August) | Final pre-September check; should be 90+ everywhere |
| Post-launch monthly | Catch regressions from new features |

## How to re-run

Either:
- Visit https://pagespeed.web.dev/ and paste the URL (results page is shareable)
- Chrome DevTools → Lighthouse tab → Analyze page load (more accurate, no Google network factored in)

## History

| Date | URL/form | Perf | A11y | BP | SEO | Notes |
|---|---|---|---|---|---|---|
| 2026-05-09 | torahub.io / mobile | 83 | 95 | 100 | 100 | Baseline. |
| 2026-05-09 | torahub.io / desktop | 100 | 95 | 100 | 100 | Baseline. |
| 2026-05-09 | app.torahub.io / mobile | 89 | 89 | 92 | 92 | Baseline. Login screen only (auth gates everything else). |
| 2026-05-09 | app.torahub.io / desktop | 99 | 89 | 92 | 92 | Baseline. |
