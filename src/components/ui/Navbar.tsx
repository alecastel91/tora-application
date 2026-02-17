"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "./Logo";

const navLinks = [
    { name: "Who We Are", href: "/who-we-are" },
    { name: "The Mission", href: "/mission" },
    { name: "What's Coming", href: "/whats-coming" },
    { name: "Policy", href: "/policy" },
];

export function Navbar() {
    return (
        <motion.nav
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center bg-near-black/80 backdrop-blur-xl border-b border-glass-border"
        >
            <div className="flex items-center justify-between w-full max-w-7xl px-8 py-4">
                <Link href="/" className="hover:opacity-80 transition-opacity">
                    <Logo className="h-6 md:h-8 text-white" />
                </Link>
                <div className="hidden md:flex items-center space-x-12">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
                <div className="w-6 h-6 border border-white/20 flex items-center justify-center text-[10px] md:hidden">
                    M
                </div>
            </div>
        </motion.nav>
    );
}
