# tora-application

The public-facing Next.js app for [TORA](https://torahub.io) — a curated network for the club music industry. Hosts:

- **Marketing site** at `torahub.io` (homepage, /about, /roles, /features, /privacy, /terms)
- **Application form** at `torahub.io/apply`
- **Admin dashboard** at `torahub.io/admin` (password-protected, server-side JWT cookie auth)
- **Transactional email templates** sent via [Resend](https://resend.com)

The other two repos in the system:
- [`tora-backend`](https://github.com/alecastel91/tora-backend) — Express + Prisma API
- [`tora-app`](https://github.com/alecastel91/tora-app) — the main Vite/React app at `app.torahub.io`

## Tech stack

- Next.js 16 (App Router, Turbopack)
- TypeScript
- Tailwind CSS, Framer Motion
- [Supabase](https://supabase.com) for the `waitlist` table
- [Resend](https://resend.com) for transactional emails
- [Sentry](https://sentry.io) for error monitoring
- [Vercel Web Analytics](https://vercel.com/analytics) (cookie-free)
- Hosted on Vercel; auto-deploys from `main`

## Local setup

```bash
git clone https://github.com/alecastel91/tora-application.git
cd tora-application
npm install
cp .env.local.example .env.local        # then fill in real values — see SECRETS.md
npm run dev                             # localhost:3000
```

You'll need values for: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `RESEND_API_KEY`, `BACKEND_API_URL`, `INVITATION_API_KEY`, `ADMIN_PASSWORD`, `ADMIN_JWT_SECRET`. See `SECRETS.md` for where each one lives.

## Useful commands

| | |
|---|---|
| `npm run dev` | Local dev server on port 3000 |
| `npm run build` | Production build (verifies it compiles) |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Type-check without emitting files |

## Project structure

```
src/
├── app/                   # Next.js App Router pages + API routes
│   ├── admin/page.tsx     # Admin dashboard
│   ├── apply/page.tsx     # Application form (waitlist)
│   ├── api/admin/         # Admin auth + GDPR delete endpoints
│   └── api/send-*/        # Resend-powered email send endpoints
├── components/sections/   # Marketing page sections
├── components/ui/         # Reusable UI primitives
├── lib/adminAuth.ts       # JWT helpers for admin session cookie
├── middleware.ts          # Protects /api/admin/* routes
└── translations/          # 8 language files (EN, ES, FR, IT, PT, JP, CN, KR)

emails/                    # React Email templates
sentry.{server,edge,client}.config.ts  # Sentry runtime configs
instrumentation.ts         # Next.js Sentry init
```

## Documentation

- **`CLAUDE.md`** — full project context, recent updates, architectural decisions
- **`SECRETS.md`** — where every secret lives (Vercel, Railway, Supabase) + rotation procedures
- **`docs/LIGHTHOUSE_BASELINE.md`** — perf/a11y/best-practices/SEO scores snapshot

## Conventions

- Pre-commit: husky runs `gitleaks protect --staged` to block accidental secret leaks
- Push to `main` auto-deploys to Vercel production
- Commit messages: short imperative, no conventional-commit prefix
