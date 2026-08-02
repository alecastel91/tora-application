import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply",
  description: "Apply to join TORA, the professional network for the club music industry.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
