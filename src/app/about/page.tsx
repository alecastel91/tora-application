"use client";

import Link from "next/link";
import { TopNav, BottomNav, PageBrand } from "@/components/ui/PageNav";
import { AnimatedTitle } from "@/components/ui/AnimatedTitle";

export default function About() {
    return (
        <main className="min-h-screen bg-black">
            <TopNav />
            <div className="pt-32 pb-20 px-8 max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <AnimatedTitle>About</AnimatedTitle>
                    <p className="text-white/40 text-sm uppercase tracking-widest" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                        Our mission and vision
                    </p>
                </div>

                <div className="space-y-6" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                    <p className="text-white/70 leading-relaxed">
                        TORA was born from a simple observation: the club music industry still runs on fragmented connections, informal networks, and uneven access to opportunity. Talented artists struggle to get visibility beyond their local scene. Promoters and venues face rising costs with no efficient way to discover emerging talent. Touring remains a privilege reserved for those with the right contacts.
                    </p>
                    <p className="text-white/70 leading-relaxed">
                        This platform exists to change that. TORA gives artists the tools to share their availability, get discovered globally, and build touring careers — regardless of where they started. For promoters and venues, it opens a direct channel to find artists already planning to be in their city, enabling cost-sharing and smarter booking in an increasingly expensive global landscape.
                    </p>
                    <p className="text-white/70 leading-relaxed">
                        But TORA is not only about global reach. It's equally about nurturing local scenes — making it easy to search for upcoming talent nearby, support emerging artists, and strengthen the cultural fabric of each city from within.
                    </p>
                    <p className="text-white/70 leading-relaxed">
                        The booking process has never been optimized for this industry. TORA brings discovery, negotiation, contracts, and payments into one seamless platform — giving artists, promoters, venues, and agents a single space to manage the entire journey from first contact to final settlement.
                    </p>
                    <p className="text-white/70 leading-relaxed">
                        At its core, TORA is a manifesto for a more connected, more transparent, and more accessible music industry — one where opportunity is earned through talent and dedication, not gatekept by geography or connections.
                    </p>
                </div>

                <div className="text-center">
                    <Link href="/" className="text-white/30 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>&lsaquo; Back</Link>
                </div>
                <PageBrand />
            </div>
            <BottomNav />
        </main>
    );
}
