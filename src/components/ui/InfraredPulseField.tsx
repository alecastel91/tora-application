"use client";

import { useEffect, useState } from "react";

export function InfraredPulseField() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
            {/* === BASE AMBIENT GLOW === */}
            <div
                className="
          absolute bottom-[-20%] right-[-10%]
          w-[70vw] h-[70vw]
          opacity-40 blur-3xl
          bg-[radial-gradient(circle_at_center,rgba(255,80,0,0.35)_0%,rgba(255,60,0,0.15)_25%,rgba(255,40,0,0.08)_40%,transparent_70%)]
        "
            />

            {/* === CORE EMITTER === */}
            <div
                className="
          absolute bottom-6 right-6
          w-3 h-3 rounded-full
          bg-infrared
          shadow-[0_0_25px_10px_rgba(255,80,0,0.8)]
          animate-[pulseCore_0.5s_ease-in-out_infinite]
        "
            />

            {/* === WAVE LAYER 1 === */}
            <span className="wave wave-1" />
            <span className="wave wave-2" />
            <span className="wave wave-3" />

            {/* Grid Overlay for Texture */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(20,20,20,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(20,20,20,0.5)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] opacity-20 pointer-events-none" />
        </div>
    );
}
