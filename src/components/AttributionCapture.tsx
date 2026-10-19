"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/**
 * Runs the campaign capture once per page load. Mounted in the root layout so
 * it covers every route — a visitor who lands on /founding from a campaign
 * link and opens /apply days later still carries the campaign.
 *
 * ACCEPTANCE CRITERIA
 *   C1. Renders nothing. No DOM, no visible change anywhere on the site.
 *   C2. Runs on mount only. Campaign links are always an external click, i.e.
 *       a full page load, so mount is the right and cheapest hook. Reading
 *       useSearchParams here instead would force the whole layout to render
 *       dynamically and cost the founding pages their static generation.
 *   C3. Never throws into the React tree: captureAttribution() handles its own
 *       failures, and the call is wrapped again here so a surprise cannot take
 *       the page down.
 */
export function AttributionCapture() {
  useEffect(() => {
    try {
      captureAttribution();
    } catch {
      /* C3: attribution must never break a page render */
    }
  }, []);

  return null; // C1
}
