"use client";

import { motion } from "framer-motion";

interface AnimatedTitleProps {
    children: React.ReactNode;
    className?: string;
}

export function AnimatedTitle({ children, className }: AnimatedTitleProps) {
    return (
        <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`text-4xl md:text-6xl font-black uppercase tracking-tight italic ${className}`}
        >
            {children}
        </motion.h2>
    );
}
