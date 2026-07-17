import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features",
  description: "Discover, connect, book, contract and tour. Everything a booking takes, in one place.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
