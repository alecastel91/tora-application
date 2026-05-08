// Sentry initialization for client-side (browser). Captures JS errors,
// unhandled promise rejections, and console.error calls in production.
// NEXT_PUBLIC_SENTRY_DSN is the public-safe version of the DSN — Sentry
// DSNs are designed to be embedded in client bundles.

import * as Sentry from "@sentry/nextjs";

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV || "development",
    tracesSampleRate: 1.0,

    // Replays — capture user sessions for errors. Disabled to control payload
    // size + storage. Re-enable later if debugging hard-to-reproduce frontend
    // bugs becomes a recurring need.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
  });
}
