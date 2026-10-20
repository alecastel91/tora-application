/**
 * Reports a lost application to Sentry.
 *
 * WHY THIS IS NEEDED SEPARATELY
 *   Sentry captures crashes. A failed application is not a crash — the form
 *   handles it, tells the applicant and carries on — so Sentry would never see
 *   it. Without this call, switching the DSN on would report nothing at all.
 *
 * ACCEPTANCE CRITERIA
 *   P1. No-op unless NEXT_PUBLIC_SENTRY_DSN is set, which it is not today.
 *       Nothing changes for anyone until that is switched on in Vercel.
 *   P2. Sentry is imported dynamically, so the SDK is only fetched when a
 *       report actually has to be sent. No weight on a normal page load.
 *   P3. NO PERSONAL DATA. Not the email, not the name, not the campaign.
 *       Sentry is not named as a processor in the privacy policy, so this
 *       sends only technical detail: what failed and why. It tells you that
 *       an application was lost and when — never who. If you ever want the
 *       "who", the policy has to name Sentry first.
 *   P4. Never throws. A reporting failure must not break the form that is
 *       already having a bad day.
 */

export async function reportLostApplication(detail: {
  role?: string;
  directError?: string;
  fallbackStatus?: number | string;
}): Promise<void> {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return; // P1

  try {
    const Sentry = await import("@sentry/nextjs"); // P2
    Sentry.captureMessage("Application could not be saved", {
      level: "error",
      extra: {
        // P3 — technical only.
        role: detail.role ?? "unknown",
        directError: detail.directError ?? "unknown",
        fallbackStatus: detail.fallbackStatus ?? "unreachable",
      },
    });
  } catch {
    /* P4 */
  }
}
