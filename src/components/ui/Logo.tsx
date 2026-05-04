"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
    className?: string;
}

export function Logo({ className }: LogoProps) {
    return (
        <div className={cn("relative", className)}>
            <Image
                src="/tora_logo_v2.png"
                alt="TORA"
                width={255}
                height={78}
                className="h-full w-auto object-contain"
            />
        </div>
    );
}
