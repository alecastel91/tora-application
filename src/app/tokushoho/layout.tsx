import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記",
  description: "特定商取引法に基づく表記（TORA）",
  // Reachable for anyone who needs it, but kept out of search results — the
  // law asks that consumers can read the disclosure, not that it be indexed.
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
