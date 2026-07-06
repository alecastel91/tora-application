# TORA landing-page scroll redesign — handoff

Context handoff for continuing this work in a fresh Claude Code session (e.g. Fable 5).
Read this first, then `git log --oneline -15` on the branch below to see the history.

## What this is

Redesign of the **home page only** of the TORA marketing site (torahub.io) into a
single **cinematic scroll journey** — inspired by systemonesoftware.com. The other
pages (`/about`, `/roles`, `/features`) are intentionally **left untouched** and stay
as "read more" detail pages.

- **Repo:** `~/Desktop/TORA_PROJECT/tora-application` (Next.js 16 App Router, React 19, Tailwind v4, framer-motion v12)
- **Branch:** `feature/landing-scroll` (off `main`; independent of the `feature/tailwind` branch)
- **Restore points (tags):** `pre-pattern-checkpoint` (58f7726, before the wave-mesh) and `pre-fable-handoff` (latest committed state at handoff). Revert with `git reset --hard <tag>`.
- **Latest work is committed** — `git log --oneline -8` on `feature/landing-scroll`. Recent commits: visual pass (fixed sticky pins, morph pacing), refinement pass (synced morph, blur crossfade, glass cards), wave-mesh, then a handoff checkpoint.
- **Do NOT push to prod / merge to main** without the user's explicit OK — a collaborator (Max) is also working, and prod deploys from `main`.

## Run / test locally

```bash
cd ~/Desktop/TORA_PROJECT/tora-application
npm run dev        # http://localhost:3000
```
- Phone (same Wi-Fi): **http://192.168.2.129:3000** (start with `npm run dev -- -H 0.0.0.0` if only localhost is shown).
- The **morph + pins are desktop-only**; mobile / `prefers-reduced-motion` get clean stack/grid fallbacks.
- Do NOT leave long-running dev servers running for the user — they run it themselves.

## The narrative (7 beats, Problem → Solution)

1. **Hero** — existing logo + "WHERE MUSIC MEETS" + Apply (kept).
2. **Problem** — "The scene runs on DMs, spreadsheets and word of mouth."
3. **Shift** — "One network for everyone who moves the music."
4. **Roles** — 4 roles as value props (Artists/Agents/Promoters/Venues).
5. **Solutions** — the 10 platform features regrouped into 5 solutions (Discover / Book / Contract / Tour / Connect).
6. **Ethos** — invite-only / curated.
7. **Final CTA** — Apply.

Copy is **new**, added as `home_*` keys to all 8 translation files (`src/translations/*.json`).
EN drafted; ES/FR/IT/PT translated; **JP/KR/CN machine-drafted, flag for native check**.

## Signature interaction: globe → boxes morph ("nodes gather, cards resolve")

- On page load, a canvas of pink nodes **assembles into a rotating globe** (the wow).
- As you scroll into **Roles**, the globe **blows apart** and nodes **gather into 4 clusters**; the 4 role cards **resolve on top** of them.
- Into **Solutions**, clusters **regroup into 5**; the 5 solution cards resolve.
- A subtle **pink wireframe wave-mesh** ripples along the lower viewport (breaks the black), masked to fade toward the top.

## Key files (all under `src/`)

- `app/page.tsx` — composition: LenisProvider → HomeNav, ParallaxBackdrop, WaveMesh, NodeField, `<main>` with the beat sections, BottomNav.
- `components/sections/home/`
  - `NodeField.tsx` — the canvas. Globe on load; scene-aware morph driven by reading `#roles` / `#solutions` position each frame; links fade out while clustered. **This is the trickiest file.**
  - `morphLayout.ts` — `roleBoxes()` (2×2) and `solutionBoxes()` (3+2) in viewport px. **Shared by NodeField and the morph sections so nodes and cards align.**
  - `NetworkFormation.tsx` — pinned problem→shift headline crossfade.
  - `RolesSection.tsx` → picks `RolesMorph` (desktop) or `RolesStack` (fallback).
  - `SolutionsSection.tsx` → picks `SolutionsMorph` (desktop) or `SolutionsGrid` (fallback).
  - `RolesMorph.tsx` / `SolutionsMorph.tsx` — cards absolutely positioned on the shared boxes, fade in as the section centers.
  - `RolesStack.tsx` / `SolutionsGrid.tsx` — mobile / reduced-motion fallbacks.
  - `EthosSection.tsx`, `FinalCtaSection.tsx`, `HeroSection.tsx`.
  - `WaveMesh.tsx` — pink wireframe wave background.
  - `ParallaxBackdrop.tsx` — faint grid + radial glow parallax.
  - `home.data.tsx` — ROLES (value props) + SOLUTIONS (5 groups) with icons/colors.
- `components/providers/LenisProvider.tsx` — home-only smooth scroll (Lenis; off under reduced motion).
- `components/ui/HomeNav.tsx` — nav linking to /about /roles /features.
- `hooks/useMediaQuery.ts`, `hooks/usePrefersReducedMotion.ts`, `lib/scroll.ts`.
- `app/globals.css` — has a `@media (prefers-reduced-motion)` guard. NOTE: on this branch the Tailwind `@theme` tokens live **inline in globals.css** (the shared `tora-theme.css` refactor is only on `feature/tailwind`).

## Refinements already made — DO NOT UNDO these

These fixed real problems; keep them unless the user asks otherwise:
- **`overflow-x-clip` (NOT `overflow-x-hidden`) on `<main>`** in `page.tsx`. `-hidden` makes `<main>` a scroll container, which **breaks `position: sticky`** in every pinned section. Keep `-clip`.
- **Negative-margin section overlaps** to kill the viewport-high dead gap after a pin releases: `RolesMorph` / `SolutionsMorph` have `marginTop: -50vh`; `EthosSection` `-25vh`. If you retune pin heights, keep the overlaps in sync.
- **`HomeBottomNav`** (in `page.tsx`) fades the bottom nav out during the scroll journey and back in at hero + final CTA (via page `useScroll`), so the cinematic beats get the full viewport.
- **NodeField gather is synced to the cards**: `activeness()` uses `pinProgress()` windows that shadow the card-opacity transforms in the Morph sections (`[0.06,0.22,0.8,0.94]`), leading slightly so dots arrive first. Change them together.
- **Glass cards + in-cluster constellation links** in NodeField make each settled cluster read as a small network, not a dot pile.

## Open / pending tuning (user is reviewing visually)

Resolved in the 2026-07-06 visual pass (verified with headless-Chrome screenshots at 1440×900):

- **Sticky pinning was broken site-journey-wide** — `overflow-x-hidden` on `<main>` made it a
  scroll container, defeating `position: sticky` in every pinned section (cards scrolled away
  while node clusters stayed). Fixed with `overflow-x-clip` in `page.tsx`.
- **Hero logo black box** — `tora_logo_v2.png` has baked-in black pixels that blocked the globe
  (`mix-blend-screen` can't fix it: the framer wrappers create isolated stacking contexts).
  Generated `public/tora_logo_transparent.png` (white-luminance → alpha) and use it in the hero.
- **Morph timing** — card opacity windows widened to [0.06, 0.22, 0.8, 0.94] and both morph
  sections pulled up with `marginTop: -50vh`, halving the viewport-high dots-only gap between
  pin releases. ~½ viewport of pure cluster-regroup remains as the intentional transition beat.
- **Text-over-nodes legibility** — soft radial scrim added behind the NetworkFormation headlines.
- **Bottom nav** — on home it now fades out during the journey (visible on the hero so the
  language picker stays discoverable, and again from ~85% scroll for the CTA/footer beat).
  Implemented as `HomeBottomNav` wrapper in `page.tsx`; `PageNav.tsx` untouched for other pages.

Still open:

- **Wave-mesh intensity/placement** — currently a bottom "horizon", low opacity. Knobs: canvas
  `opacity`, per-line alpha, and the `maskImage` gradient in `WaveMesh.tsx`. Looked good in
  screenshots; awaiting user's eye.
- Scroll-feel (Lenis easing, pin lengths) — only judgeable by hand-scrolling, not screenshots.
- JP/KR/CN copy native check.

## Verify before any commit
`npm run build` must pass. gitleaks pre-commit hook runs. Commit messages end with the Co-Authored-By line.
