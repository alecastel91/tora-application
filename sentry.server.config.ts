// Sentry initialization for Next.js server-side runtime (API routes,
// server components, getServerSideProps). Loaded by instrumentation.ts.
// No-op when SENTRY_DSN is unset (e.g. local dev) so test errors stay local.

import * as Sentry from "@sentry/nextjs";

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",

    // Pre-launch low-volume — capture every error and trace.
    // Dial down (0.1-0.2) once production traffic ramps.
    tracesSampleRate: 1.0,

    // Don't auto-send personal data; we set user context explicitly when needed.
    sendDefaultPii: false,
  });
}
