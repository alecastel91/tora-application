// Sentry initialization for Next.js Edge runtime (middleware, edge route
// handlers). Required because middleware runs in a different runtime than
// Node — needs its own Sentry init.

import * as Sentry from "@sentry/nextjs";

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
    tracesSampleRate: 1.0,
    sendDefaultPii: false,
  });
}
