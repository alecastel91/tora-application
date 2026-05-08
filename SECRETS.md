# Secrets — where they live and who owns rotation

Internal reference for tora-application (landing + admin). Keep this file but **never paste actual secret values into it** — only locations and rotation procedures.

## Production secrets (Vercel env vars)

| Variable | Where it lives | Source of truth | Sensitive flag | Rotation |
|---|---|---|---|---|
| `RESEND_API_KEY` | Vercel → tora-application → Settings → Env Vars (Production, Sensitive) | Resend dashboard → API Keys | ✅ ON | Resend dashboard → revoke old + create new → paste into Vercel. ~3 min. |
| `INVITATION_API_KEY` | Vercel (Production, Sensitive) | Generated with `tora-prod-$(openssl rand -hex 24)` | ✅ ON | **Must rotate on BOTH Vercel + Railway simultaneously**. Update Vercel first. Last rotated: 2026-05-08. |
| `BACKEND_API_URL` | Vercel (server-side, not Sensitive — public Railway URL) | Railway dashboard | ❌ OFF | Only changes if Railway URL changes. |
| `ADMIN_PASSWORD` | Vercel (Production, Sensitive) | Generated locally — password manager only | ✅ ON | Rotate via Vercel UI → user re-logs in. Currently `JeffMills-909!`. ~2 min. |
| `ADMIN_JWT_SECRET` | Vercel (Production, Sensitive) | Generated with `openssl rand -base64 64` | ✅ ON | Rotation kills all active admin sessions immediately. ~2 min. |
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel (Production) | Supabase Project 2 dashboard | ❌ Not a secret | n/a |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel (Production) | Supabase Project 2 dashboard | ❌ Not a secret (public-by-design) | If service-role key compromised, can rotate both via Supabase dashboard. |
| `NEXT_PUBLIC_APP_URL` | Vercel (Production) | Just `https://app.torahub.io` | ❌ Not a secret | n/a |
| `NEXT_PUBLIC_ENV_MODE` | Vercel (Production) | `production` literal | ❌ Not a secret | n/a |

## Local dev secrets (.env.local file, gitignored)

| Variable | Note |
|---|---|
| `RESEND_API_KEY` | Same as production (dev shares Resend account) — should consider separate dev key in the future |
| `INVITATION_API_KEY` | Local-only dev string — meaningless |
| `ADMIN_PASSWORD` | Same as production currently (`JeffMills-909!`) — consider separate dev value |
| `ADMIN_JWT_SECRET` | Same as production currently — consider separate |
| `NEXT_PUBLIC_*` | Same as production (anon keys are designed to be public) |

## After-incident response

If a real production secret leaks (commit, screenshot, accidentally shared):

1. **Rotate immediately** — do not wait to rewrite git history.
2. For `ADMIN_*`: log in to admin panel after rotation to verify new password works.
3. For `INVITATION_API_KEY`: rotate on BOTH Vercel and Railway, then test the admin → invitation flow end-to-end (login on production admin, send a test invitation, verify it succeeds).
4. Update `.gitleaksignore` with the new fingerprint of the historical leak.
5. Document the incident below.

## Incidents

### 2026-05-08 — INVITATION_API_KEY in CLAUDE.md history
- Discovered via `gitleaks detect`: production INVITATION_API_KEY had been pasted into `tora-backend-sql/CLAUDE.md` line 23 since April 11.
- Action: rotated the key on Railway + Vercel simultaneously. Old value retired. Verified end-to-end (old key returns 401, new key passes through Vercel proxy to Railway with 200).
- Files updated: `tora-backend-sql/CLAUDE.md` (literal value removed, replaced with pointer), `.gitleaksignore` added with the historical fingerprint.

## Pre-commit defense

Run gitleaks before committing anything that might contain secrets:

```bash
gitleaks detect --source . --no-banner
```
