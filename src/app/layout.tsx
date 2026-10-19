import type { Metadata } from "next";
import { Orbitron, Rajdhani, Inter, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { AttributionCapture } from "@/components/AttributionCapture";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "900"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Used selectively on the home tagline, the Apply CTA, and subpage subtitles.
// Falls back to Space Grotesk for any 600 weight (Supreme has no SemiBold).
const supreme = localFont({
  variable: "--font-supreme",
  src: [
    { path: "./fonts/supreme/Supreme-Light.otf", weight: "300", style: "normal" },
    { path: "./fonts/supreme/Supreme-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/supreme/Supreme-Medium.otf", weight: "500", style: "normal" },
    { path: "./fonts/supreme/Supreme-Bold.otf", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.torahub.io"),
  title: {
    default: "TORA - Where Music Meets",
    template: "%s — TORA",
  },
  description: "The professional network for the club music industry. Connect with artists, agents, venues, and promoters.",
  openGraph: {
    title: "TORA - Where Music Meets",
    description: "The professional network for the club music industry.",
    url: "https://www.torahub.io",
    siteName: "TORA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TORA - Where Music Meets",
    description: "The professional network for the club music industry.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} ${rajdhani.variable} ${inter.variable} ${spaceGrotesk.variable} ${supreme.variable} font-sans antialiased`}
      >
        {/* Campaign attribution: remembers which campaign brought a visitor so
            the application they submit later can be labelled with it. Renders
            nothing — see src/lib/attribution.ts. */}
        <AttributionCapture />
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
        {/* Plausible's documented queue stub. The tracker below is deferred, so
            without this a plausible() call made before it loads would be lost.
            No extra third-party script — it only queues into the existing one. */}
        <Script id="plausible-queue" strategy="beforeInteractive">
          {`window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments) }`}
        </Script>
        <Script
          defer
          data-domain="torahub.io"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
