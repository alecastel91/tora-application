import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply",
  description: "Apply for membership to TORA, the professional network for the club music industry.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
