// Browser-side Sentry init.
//
// WHY THIS FILE REPLACES sentry.client.config.ts
//   The DSN has been set in Vercel since May, yet no browser error has ever
//   reached Sentry. Cause: @sentry/nextjs v10 on Next 16 loads client init
//   from `instrumentation-client.ts`. `sentry.client.config.ts` is simply not
//   read any more, so the init never ran. Reproduced locally: build with a
//   DSN present and `window.__SENTRY__` is still undefined; a thrown error
//   sends nothing. Server-side init was unaffected — that goes through
//   instrumentation.ts, which is still the supported path.
//
// ACCEPTANCE CRITERIA
//   Q1. Same behaviour as the file it replaces: no-op without a DSN, so local
//       and tokenless builds stay silent.
//   Q2. Sentry DSNs are public by design (rate-limited at Sentry's edge), so
//       shipping it in the client bundle is expected.
//   Q3. Router transitions are instrumented, which the old file could not do —
//       that hook did not exist when it was written.
import * as Sentry from "@sentry/nextjs";

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN, // Q2
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV || "development",
    tracesSampleRate: 1.0,
    // Replays stay off to keep the payload small; re-enable if hard-to-
    // reproduce frontend bugs become a recurring need.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
  });
}

// Q3
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
