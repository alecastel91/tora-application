"use client";

import { Logo } from "./Logo";

export function Footer() {
    return (
        <footer className="py-20 px-8 border-t border-white/5 bg-near-black">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
                <div className="space-y-4">
                    <Logo className="h-6 text-white" />
                    <p className="text-[10px] text-white/20 uppercase tracking-widest max-w-xs leading-relaxed">
                        The next generation music industry protocol. Decentralized, direct, and automated.
                    </p>
                </div>

                <div className="flex space-x-12">
                    {["Network", "Social", "Terms"].map((group) => (
                        <div key={group} className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-tora-orange">{group}</h4>
                            <ul className="space-y-2">
                                {[1, 2].map((i) => (
                                    <li key={i} className="text-[9px] text-white/30 uppercase tracking-widest hover:text-white cursor-pointer transition-colors">
                                        Link_{i}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex justify-between items-center text-[8px] text-white/10 uppercase tracking-[0.5em]">
                <span>© 2024 TORA OPS</span>
                <div className="flex space-x-4">
                    <span>TX_READY</span>
                    <div className="w-2 h-2 bg-tora-orange/20" />
                </div>
            </div>
        </footer>
    );
}
