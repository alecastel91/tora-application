"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export interface InfraredInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const InfraredInput = forwardRef<HTMLInputElement, InfraredInputProps>(
    ({ className, type, label, placeholder, ...props }, ref) => {
        return (
            <div className="space-y-2 w-full">
                {label && (
                    <label className="text-xs uppercase tracking-widest text-[#ff7a3a] font-orbitron ml-1 opacity-80" style={{ textShadow: "0 0 6px rgba(255,120,60,0.4)" }}>
                        {label}
                    </label>
                )}
                <div className="relative group">
                    <input
                        type={type}
                        placeholder={placeholder}
                        className={cn(
                            "w-full rounded-xl px-4 py-3",
                            "bg-[rgba(10,10,10,0.85)] backdrop-blur-lg",
                            "border border-[rgba(255,120,60,0.2)]",
                            "text-gray-200 placeholder-gray-500",
                            "shadow-[inset_0_2px_12px_rgba(0,0,0,0.9)]",
                            "transition-all duration-200",
                            "focus:outline-none focus:border-[rgba(255,120,60,0.6)]",
                            "focus:shadow-[0_0_20px_rgba(255,80,0,0.35),inset_0_2px_12px_rgba(0,0,0,0.9)]",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />

                    {/* subtle internal reflection */}
                    <div
                        className="
              pointer-events-none absolute inset-0 rounded-xl
              bg-[linear-gradient(to_bottom,rgba(255,140,80,0.18),transparent_40%)]
              opacity-30
            "
                    />
                </div>
            </div>
        );
    }
);
InfraredInput.displayName = "InfraredInput";
