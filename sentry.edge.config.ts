// Loaded by instrumentation.ts when NEXT_RUNTIME === "edge" (middleware,
// edge route handlers). Edge runtime needs its own Sentry init separate
// from the Node config.
import * as Sentry from "@sentry/nextjs";

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
    tracesSampleRate: 1.0,
    sendDefaultPii: false,
  });
}
