/**
 * Plausible custom events.
 *
 * ACCEPTANCE CRITERIA
 *   D1. Sends a named event through the Plausible tracker already loaded in
 *       the root layout. No new script, no new third party.
 *   D2. Never carries personal data. The event name is the whole payload —
 *       no email, no name, no campaign values, nothing that identifies a
 *       person. Plausible stores no identity and we keep it that way.
 *   D3. Safe before the deferred tracker has loaded: the queue stub in the
 *       root layout buffers the call. If neither exists, this is a silent
 *       no-op rather than a crash.
 *   D4. Never throws. Analytics must not be able to fail a submission.
 */

declare global {
  interface Window {
    plausible?: ((event: string, options?: { props?: Record<string, string | number | boolean> }) => void) & {
      q?: unknown[];
    };
  }
}

export function trackEvent(name: string): void {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(name); // D1, D2, D3
  } catch {
    /* D4 */
  }
}
