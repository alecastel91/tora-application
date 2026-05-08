// Loaded by instrumentation.ts when NEXT_RUNTIME === "nodejs".
import * as Sentry from "@sentry/nextjs";

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
    // tracesSampleRate 1.0 is fine pre-launch; lower to 0.1-0.2 once traffic ramps.
    tracesSampleRate: 1.0,
    sendDefaultPii: false,
  });
}
