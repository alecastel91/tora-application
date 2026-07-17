import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roles",
  description: "Artists, agents, promoters and venues — how each role connects and works on TORA.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
