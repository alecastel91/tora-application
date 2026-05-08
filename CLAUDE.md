# TORA Landing Page Application - Project Documentation

## Overview
TORA Landing Page is a Next.js application for collecting pre-launch applications for the TORA platform. The application uses Supabase for database storage, Resend for email notifications, and supports multi-language translations. It's designed to collect applications from Artists, Agents, Promoters, and Venues interested in joining the TORA network.

- **Production URL**: https://tora-application.vercel.app
- **Admin URL**: https://tora-application.vercel.app/admin (password: `tora2026admin`)
- **Tech**: Next.js 16, TypeScript, Tailwind, Framer Motion, Supabase, Resend, Vercel

## Deployment Topology (as of April 12, 2026)

**Local dev** (`npm run dev` → `localhost:3000`) → Supabase **Project 1** (`kujkzoaobkpqnbtpskpo`)
- Reads `.env.local` (in repo root, gitignored)
- Submissions land in Project 1 `waitlist` table
- Local admin dashboard manages Project 1 applications

**Production** (`tora-application.vercel.app`) → Supabase **Project 2** (`jzhrtaivrfegxbvpkfjg`)
- Vercel env vars (Production scope):
  - `NEXT_PUBLIC_SUPABASE_URL` = `https://jzhrtaivrfegxbvpkfjg.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Project 2 anon key
  - `NEXT_PUBLIC_BACKEND_API_URL` = Railway URL (legacy, kept for any client-side reads)
  - `BACKEND_API_URL` = Railway URL (server-side only, used by `/api/admin/send-invitation`)
  - `INVITATION_API_KEY` = Railway's value (server-side only — never `NEXT_PUBLIC_`)
  - `NEXT_PUBLIC_ENV_MODE` = `production`
  - `RESEND_API_KEY` = Resend key

## Recent Updates (May 8, 2026)

### Email Deliverability & UX Pass
- **TORALoader** (`src/components/ui/TORALoader.tsx`) — new reusable rotating pink-globe loader. Replaces text/Unicode spinners across `ApplicationForm`, `WaitlistModal`, and the admin dashboard loading state. Stroke widths scale inversely with size for consistent display weight (~1.5px primary, ~1px secondary).
- **Country code dropdown bug fix** (`ApplicationForm.tsx`): display order changed from `+1876 Jamaica` to `Jamaica (+1876)` so browser typeahead matches by country name. Was unmatchable because every option started with `+`.
- **Invitation email rewrite** (`api/send-invitation/route.ts` + `emails/invitation-accepted.tsx`):
  - Personalized subject: `${firstName}, your TORA invitation is ready`
  - Plain-text fallback added (Gmail/Outlook penalize HTML-only)
  - `replyTo: support@torahub.io` (positive emails only — decline email intentionally has no replyTo)
  - `List-Unsubscribe` + `List-Unsubscribe-Post` headers
  - CTA URL now reads `NEXT_PUBLIC_APP_URL` env var (dev → local app, prod → app.torahub.io)
- **Email dark-mode forcing** (all 5 templates): added `<meta name="color-scheme" content="dark" />` + `<style>` block with `prefers-color-scheme` media queries + `!important` overrides. Defeats most clients' auto-inversion. Extracted to shared `<EmailHead>` component (`emails/EmailHead.tsx`).
- **Email asset**: `public/email-assets/check.svg` — transparent SVG (pink check + circle) replaces the old dark-bg PNG in `application-received.tsx`. Renders correctly on both dark email body and Gmail-iOS-inverted white body. URL uses canonical `www.torahub.io` to skip the apex-to-www redirect.
- **Vercel Web Analytics** added (cookie-free, GDPR-compliant). Package `@vercel/analytics` + `<Analytics />` in `src/app/layout.tsx`. Enabled in Vercel dashboard → Analytics tab.

### Gmail iOS rendering note
Gmail iOS auto-inverts dark emails for some users in light mode — discovered to be **non-deterministic across users**, likely Gmail A/B test buckets. Decision: ship dark theme as-designed; ~80–90% of users see emails correctly. The minority who get inversion see a "stamp" variant (logo + globe as black squares on white body) which is still readable.

## Recent Updates (May 6, 2026)

### Phase 1 Pre-Launch Hardening — Admin Auth + Email Deliverability
- **Admin dashboard auth fully rewritten** (replaces hardcoded `tora2026admin` + sessionStorage flag)
  - New routes: `POST /api/admin/login`, `POST /api/admin/logout`, `GET /api/admin/session`
  - New file `src/lib/adminAuth.ts` — JWT signing/verification helpers (uses `jose` library, ~6.2.3, Edge-runtime compatible)
  - New `src/middleware.ts` — protects `/api/admin/*` (except login/logout/session) plus `/api/send-invitation`, `/api/send-decline`, `/api/send-add-profile-approved`. Public routes (`/`, `/apply`, `/api/waitlist`, `/api/send-email`) unaffected.
  - `src/app/admin/page.tsx` updated: handleLogin POSTs to login route; useEffect hits session route; handleLogout POSTs to logout route. No more client-side password comparison.
  - Cookie: `admin_session`, httpOnly, secure (in prod), sameSite=lax, HS256-signed, 24h TTL
  - DevTools `sessionStorage.admin_authenticated = true` bypass no longer works
  - Required env vars: `ADMIN_PASSWORD`, `ADMIN_JWT_SECRET` (server-side only, set in Vercel Production scope)
  - Shipped via PR #1 (merged to main, Vercel auto-deployed)
- **Email DMARC upgraded to `p=quarantine`** for `torahub.io`
  - Previous: `v=DMARC1; p=none;` (monitor-only, no enforcement, no reports)
  - New: `v=DMARC1; p=quarantine; pct=100; rua=mailto:admin@torahub.io,mailto:alessandro.castelbuono@gmail.com; sp=quarantine; adkim=r; aspf=r;`
  - DKIM (`resend._domainkey.mail.torahub.io`) and SPF (`send.mail.torahub.io`) were already verified — no changes needed there
  - DNS managed at Namecheap; record edited under torahub.io → Advanced DNS → `_dmarc` TXT record
  - Verified deliverability via mail-tester.com: **10/10 score**
- **Next.js deprecation warning**: `middleware.ts` convention is deprecated in Next.js 16.1 (rename to `proxy.ts` pending in future major version). Auto-aliased for now, no functional impact.

## Recent Updates (May 5, 2026)

### Navigation Refinements
- Removed "Apply" from top nav — replaced with rotating pink globe SVG linking to home
- "Apply For Membership" CTA added at bottom of About, Roles, Features pages (not legal pages)
- ADMIN coupon package added to admin dashboard (lifetime premium)

## Recent Updates (May 3-4, 2026)

### Website Redesign — Raya-Inspired Presentation
- **New homepage** (`/`): TORA logo, "WHERE MUSIC MEETS" tagline, "Apply For Membership" CTA (pink hover)
- **Application form** moved to `/apply` — skips splash, goes straight to globe screen
- **New pages**: `/about` (manifesto), `/roles` (4 role cards with color-coded icons), `/features` (10 feature cards with pink icons)
- **Legal pages**: `/privacy` (comprehensive, Raya-level), `/terms` (Singapore governing law), `/data-deletion`
- **Navigation**: TopNav (Apply, About, Roles, Features) + BottomNav (Privacy, Terms, Social, Language picker)
- **Fonts**: Rajdhani for titles, Space Grotesk for all body text
- **Deleted old pages**: `/mission`, `/whats-coming`, `/policy`, `/who-we-are`
- **Deleted unused components**: `Navbar.tsx`, `Footer.tsx`, `LandingPage.tsx`

### Full i18n — 8 Languages
- All pages translated: EN, ES, FR, IT, PT, JP, CN, KR (516 keys per language)
- Language picker in bottom nav with native labels (日本語, 中文, 한국어)
- Legal pages translated with proper legal register per language
- "WHERE MUSIC MEETS" stays in English across all languages (brand tagline)

### Existing-User Invitation Collision (Option B)
- Backend auto-creates second profile when admin sends invitation to existing email
- Application form warns user: "An account already exists, new profile will be added to existing account"
- Admin dashboard confirms before adding profile to existing user

### Custom Domain
- `app.torahub.io` → tora-app-sql (main app) — live
- `torahub.io` → tora-application (website + apply + admin) — configured

## Recent Updates (May 2, 2026)

### Application Decline Email
- **New email template**: `emails/application-declined.tsx` — matches existing email design (black bg, TORA logo, pink accents)
- **New API route**: `src/app/api/send-decline/route.ts` — sends decline email via Resend
- **Admin dashboard**: Decline button now sends email automatically (fire-and-forget)
- Subject: "Application Update - TORA", from: `noreply@mail.torahub.io`
- Tone: respectful, encourages re-applying in the future

### Application Form Improvements
- **Early duplicate check**: Email duplicate validation moved from final submit to email step (step 2)
- User sees "already applied" error immediately when entering email, not after completing the whole form
- **Declined applications can re-apply**: Duplicate check excludes `DECLINED` status entries
- **Spam folder note**: Error message now says "Check your inbox (and spam folder) for updates"

## Recent Updates (April 11-12, 2026)

### Admin Invitation Flow — Server-Side Proxy Route
- **Critical bug fix**: The previous "Send Invitation" flow called the backend's `/api/invitations/create` endpoint **directly from the browser** with `INVITATION_API_KEY` read from `process.env`. But Next.js refuses to expose any non-`NEXT_PUBLIC_*` env var to the browser, so the API key was ALWAYS undefined client-side, and the hardcoded fallback didn't match Railway's real key. The call always returned 401, and the failure was swallowed by a fire-and-forget fetch.
- **Result of the bug**: Supabase row got marked `INVITED`, an email got sent with a coupon code, but no row was ever created in the backend's `invitations` table. Users received codes that didn't exist → signup always failed.
- **Fix**: New server-side route at `src/app/api/admin/send-invitation/route.ts` reads `INVITATION_API_KEY` and `BACKEND_API_URL` from `process.env` (which works server-side) and proxies the POST to Railway with the correct `x-api-key` header.
- **Reordered admin flow**: backend invitation is now created FIRST. If backend rejects (wrong key, downtime, validation error), Supabase is NOT updated and the admin sees a clear error (not silent failure).
- **Error handling**: replaces fire-and-forget `console.error` with thrown errors that propagate to the UI.

### Email Tier Label — Now Reflects Coupon Package
- `src/app/api/send-invitation/route.ts` was hardcoding "Founding Member" regardless of which package the admin selected.
- Now maps `couponPackage` to:
  - `FOUNDING` → "Founding Member · 3 months Premium · Complimentary"
  - `LAUNCH` → "Launch Member · 1 month Premium · Complimentary"
  - `INFLUENCER` → "Influencer Member · 12 months Premium · Complimentary"
  - `STANDARD` → "TORA Member · 7-day Premium Trial" (intentionally avoids saying "Standard")

### Local Dev Env Vars
- `.env.local` now includes `BACKEND_API_URL` (server-side, no `NEXT_PUBLIC_`) and `INVITATION_API_KEY` for the new admin proxy route to work locally
- The existing `NEXT_PUBLIC_BACKEND_API_URL` is kept for any legacy client-side reads — both can coexist

### Known Issue (deferred)
- **Existing-user invitation collision**: when admin re-sends an invitation for an email that already has a User in the backend, the backend creates a new invitation row but does NOT update the existing user's profile or change subscription tier. New application data is silently ignored. Two possible fixes (Option A: block; Option C: create a second profile under existing user). Track for next session.

## Recent Updates (April 1, 2026)

### Database Schema Migration - Name Fields Split  
- **Migration Complete**: Split \`full_name\` field into \`first_name\` and \`last_name\`
  - **Date**: March 31, 2026
  - **Migration File**: supabase-add-name-columns.sql
  - **Changes**:
    - Added \`first_name TEXT\` column to both \`waitlist\` and \`waitlist_test\`
    - Added \`last_name TEXT\` column to both \`waitlist\` and \`waitlist_test\`
    - Removed \`full_name\` column from both tables
  - **Code Updates**:
    - ApplicationForm.tsx: Updated to save separate name fields (lines 362-363, 412-413)
    - admin/page.tsx: Updated TypeScript interface and all references
  - **Status**: ✅ Deployed to production (Vercel)

### Environment Separation System
- **Test Environment**: Created separate \`waitlist_test\` table for development/testing
  - **Purpose**: Allows testing without affecting production data
  - **Implementation**: Dynamic table selection based on \`NEXT_PUBLIC_ENV_MODE\`
  - **Local Development**: Uses \`test\` mode by default
  - **Production (Vercel)**: Uses \`production\` mode

- **Environment Modes**:
  - \`production\`: Uses \`waitlist\` table (real production data)
  - \`test\`: Uses \`waitlist_test\` table (test/development data)

### Admin Dashboard Updates
- **Dynamic Table Selection**: Admin dashboard now respects \`NEXT_PUBLIC_ENV_MODE\`
  - Test mode: Shows data from \`waitlist_test\`
  - Production mode: Shows data from \`waitlist\`
- **Name Field Updates**: All 8 references to \`full_name\` updated to use \`first_name\` and \`last_name\`
  - Display name calculation: \`\${first_name} \${last_name}\`
  - Search functionality: Searches both first and last names
  - Email sending: Uses \`first_name\` for personalization

### Genres List Update
- **Removed**: "Acid"
- **Added**: "Pop" (in alphabetical order)
- **Total Genres**: 36 music genres supported

### Debugging Enhancements
- **Console Logging**: Added comprehensive logging to ApplicationForm.tsx
  - Logs environment mode, table name, and Supabase URL before insert
  - Logs success/failure with detailed error messages
  - Helps troubleshoot production deployment issues

## Key Features

### Multi-Step Application Form
1. **Step 1**: Contact Information (phone, role, name, email)
2. **Step 2**: Location & Music Profile (zone/country/city, genres)
3. **Step 3**: Professional Links (social media, website, etc.)

### Admin Dashboard
- Password-protected management interface
- View/filter/search applications
- Approve, decline, or send invitations
- Dynamic table selection based on environment mode

### Multi-Language Support
8 languages supported: English, Spanish, French, German, Italian, Portuguese, Japanese, Chinese

### Email Integration
- Resend API for transactional emails
- Application confirmation emails
- Invitation emails with coupon codes

## Environment Configuration

### Local Development (.env.local)
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://kujkzoaobkpqnbtpskpo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon key]
NEXT_PUBLIC_ENV_MODE=test
RESEND_API_KEY=[resend key]
\`\`\`

### Vercel Production
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://kujkzoaobkpqnbtpskpo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon key]
NEXT_PUBLIC_ENV_MODE=production
RESEND_API_KEY=[resend key]
\`\`\`

### Switching Modes Locally
\`\`\`bash
# Switch to test mode
sed -i '' 's/NEXT_PUBLIC_ENV_MODE=production/NEXT_PUBLIC_ENV_MODE=test/' .env.local
rm -rf .next && npm run dev

# Switch to production mode
sed -i '' 's/NEXT_PUBLIC_ENV_MODE=test/NEXT_PUBLIC_ENV_MODE=production/' .env.local
rm -rf .next && npm run dev
\`\`\`

## Database Schema

### Tables
- **waitlist** - Production applications
- **waitlist_test** - Test/development applications

### Key Columns
\`\`\`
id, created_at, phone_number, role
first_name, last_name, profile_name, email
zone, country, city, genres
instagram, resident_advisor, soundcloud, website, linkedin
agency_name, venue_capacity
status, coupon_code, invited_at
\`\`\`

### RLS Policies
- Row Level Security: DISABLED (public insert access required)

## Supported Data

### Roles
Artist, Agent, Promoter, Venue

### Genres (36 total)
Afro House, Afrobeat, Amapiano, Ambient, Bass, Dancehall, Deep House, Disco, Downtempo, Drum & Bass, Dub Techno, Dubstep, EBM, Electro, Experimental, Funk/Soul, Garage, Hardcore, Hip Hop, House, IDM, Industrial, Italo Disco, Jazz, Jungle, Melodic Techno, Minimal, Noise, **Pop**, Progressive House, Psytrance, R&B, Reggaeton, Tech House, Techno, Trance

### Zones & Locations
- **Zones**: Africa, Americas, Asia, Europe, Oceania
- **Countries**: 40+ across all zones
- **Cities**: 200+ major cities worldwide

## Running the Application

\`\`\`bash
# Install
npm install

# Development
npm run dev

# Build
npm run build

# Access
http://localhost:3000 (local)
http://192.168.2.101:3000 (network)
\`\`\`

## Admin Access
- **URL**: /admin
- **Password**: tora2026admin
- **Features**: View, filter, approve, decline, send invitations

## Common Tasks

### Add a Genre
1. Edit \`src/components/sections/infrared/ApplicationForm.tsx\`
2. Find \`genresList\` array (line ~171)
3. Add in alphabetical order
4. Commit and push

### Change Admin Password
1. Edit \`src/app/admin/page.tsx\`
2. Find line 71: \`password === "tora2026admin"\`
3. Update password string
4. Commit and push

### Database Migrations
1. Write SQL migration file
2. Test on Supabase SQL Editor
3. Run on production Supabase
4. Update TypeScript code
5. Deploy via Git push

## Tech Stack
- Next.js 16.1.6 with Turbopack
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase (PostgreSQL)
- Resend (Email)
- Vercel (Hosting)

## Status
✅ **Production Ready**
- All features working
- Database migrations complete
- Environment separation implemented
- Vercel deployment successful

---

**Last Updated**: April 1, 2026  
**Version**: 2.0.0  
**Repository**: https://github.com/alecastel91/tora-application
