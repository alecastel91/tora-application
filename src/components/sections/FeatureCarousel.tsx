"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "../ui/GlassCard";
import { cn } from "@/lib/utils";

const categories = [
    {
        id: "artists",
        title: "Artists",
        description: "Algorithmic discovery for talent with verified track records.",
        preview: {
            name: "AX-01 GENRE",
            tags: ["RAW", "BERLIN", "ANALOG"],
            bio: "High-fidelity industrial soundscapes. 142 BPM focus.",
            meta: "Uptime: 98%"
        }
    },
    {
        id: "venues",
        title: "Venues",
        description: "Performance metrics for spaces and local crowd dynamics.",
        preview: {
            name: "SECTOR-7",
            tags: ["CONCRETE", "FUNCTION-ONE", "24H"],
            bio: "Underground structural resonance. Optimized for heavy frequency.",
            meta: "Status: Operational"
        }
    },
    {
        id: "promoters",
        title: "Promoters",
        description: "Roster optimization and automated deal structural logic.",
        preview: {
            name: "VOID OPS",
            tags: ["LOGISTICS", "PR", "NETWORK"],
            bio: "Global circuit deployment and talent resource management.",
            meta: "Tier: Executive"
        }
    },
    {
        id: "tours",
        title: "Tour Circuit",
        description: "Pooled capital funding for cross-regional tours.",
        preview: {
            name: "NORTHERN CROSS",
            tags: ["5 NODES", "COLLECTIVE"],
            bio: "Multi-layered tour routing with decentralized risk pooling.",
            meta: "Funding: 85% SIG"
        }
    }
];

export function FeatureCarousel() {
    const [activeTab, setActiveTab] = useState(categories[0].id);
    const activeCategory = categories.find(c => c.id === activeTab)!;

    return (
        <div className="w-full space-y-16">
            {/* Minimal Tabs */}
            <div className="flex flex-wrap justify-center gap-2">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveTab(cat.id)}
                        className={cn(
                            "px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 skew-btn",
                            activeTab === cat.id
                                ? "bg-tora-orange text-white shadow-glow"
                                : "bg-white/5 text-white/30 border border-white/5 hover:border-white/20"
                        )}
                    >
                        <span className="block unskew-text">{cat.title}</span>
                    </button>
                ))}
            </div>

            {/* Grid Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="border-l border-tora-orange/40 pl-8"
                        >
                            <h3 className="text-2xl font-black uppercase tracking-widest mb-4 italic">{activeCategory.title}</h3>
                            <p className="text-sm text-white/40 leading-relaxed uppercase tracking-wider">
                                {activeCategory.description}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                        >
                            <GlassCard className="border-white/5 relative bg-white/[0.02]">
                                <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-tora-orange/20 to-transparent" />

                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-12 h-12 border border-tora-orange/20 flex items-center justify-center">
                                        <div className="w-4 h-4 bg-tora-orange/40" />
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-tora-orange bg-tora-orange/5 px-3 py-1 border border-tora-orange/10">
                                        Verified ID
                                    </div>
                                </div>

                                <h4 className="text-xl font-black mb-4 tracking-tighter italic">{activeCategory.preview.name}</h4>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {activeCategory.preview.tags.map(tag => (
                                        <span key={tag} className="text-[9px] font-bold px-2 py-1 bg-white/5 text-white/40 border border-white/10 uppercase">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <p className="text-white/30 text-xs mb-8 leading-relaxed uppercase tracking-wide">
                                    {activeCategory.preview.bio}
                                </p>

                                <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                                    <span className="text-[9px] text-white/20 uppercase font-black">{activeCategory.preview.meta}</span>
                                    <div className="flex space-x-1">
                                        <div className="w-4 h-1 bg-tora-orange" />
                                        <div className="w-1 h-1 bg-white/10" />
                                        <div className="w-1 h-1 bg-white/10" />
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
