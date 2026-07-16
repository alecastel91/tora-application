"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export interface InfraredInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const InfraredInput = forwardRef<HTMLInputElement, InfraredInputProps>(
    ({ className, type, label, placeholder, "aria-label": ariaLabel, ...props }, ref) => {
        // Most call sites use the placeholder as the only label. Derive an
        // accessible name so screen readers announce the field even once it
        // has a value (placeholders alone are not an accessible name).
        const accessibleName = ariaLabel || label || (typeof placeholder === "string" ? placeholder : undefined);
        return (
            <div className="space-y-2 w-full">
                {label && (
                    <label className="text-xs uppercase tracking-widest text-white/50 font-[var(--font-geist-sans)] ml-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    <input
                        type={type}
                        placeholder={placeholder}
                        aria-label={label ? undefined : accessibleName}
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
