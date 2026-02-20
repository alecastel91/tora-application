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
                    <label className="text-xs uppercase tracking-widest text-white/50 font-orbitron ml-1">
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
                            "border border-white/10",
                            "text-gray-200 placeholder-gray-500",
                            "transition-all duration-200",
                            "focus:outline-none focus:border-white/30",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
            </div>
        );
    }
);
InfraredInput.displayName = "InfraredInput";
