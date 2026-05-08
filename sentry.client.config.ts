// Browser-side init. NEXT_PUBLIC_SENTRY_DSN gets bundled into the client
// — Sentry DSNs are public-by-design (rate-limited at the Sentry edge).
import * as Sentry from "@sentry/nextjs";

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV || "development",
    tracesSampleRate: 1.0,
    // Replays disabled to keep payload small; re-enable if hard-to-reproduce
    // frontend bugs become a recurring need.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
  });
}
