import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "The story and mission behind TORA — the professional network for the club music industry.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
