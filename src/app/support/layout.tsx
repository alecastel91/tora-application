import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support",
  description: "Help with TORA: contact support, common questions, and links to our policies.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
