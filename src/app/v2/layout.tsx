import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * /v2 is a proposal for the home page, read side by side with the live one.
 * Two near-identical homepages on one domain is the textbook duplicate-content
 * case, so this one stays out of the index until it either replaces / or goes.
 */
export const metadata: Metadata = {
  title: "Home (proposal)",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function V2Layout({ children }: { children: ReactNode }) {
  return children;
}
