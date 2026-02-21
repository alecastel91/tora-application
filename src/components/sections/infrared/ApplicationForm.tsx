"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { InfraredInput } from "@/components/ui/InfraredInput";
import { InfraredButton } from "@/components/ui/InfraredButton";
import { motion } from "framer-motion";
import { useState } from "react";

interface ApplicationFormProps {
    onSubmit: () => void;
}

export function ApplicationForm({ onSubmit }: ApplicationFormProps) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            onSubmit();
        }, 1500);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4">
            <GlassPanel className="p-8 md:p-12 max-w-xl w-full">
                <div className="mb-8 text-center">
                    <h2 className="text-xl font-orbitron tracking-[0.1em] text-white">ACCESS REQUEST</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <InfraredInput
                            label="Full Name"
                            placeholder="ENTER DESIGNATION"
                            required
                        />

                        <InfraredInput
                            label="Email Address"
                            type="email"
                            placeholder="ENTER CONTACT FREQUENCY"
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfraredInput
                                label="Role"
                                placeholder="ARTIST / AGENT / PROMOTER"
                                required
                            />
                            <InfraredInput
                                label="Location"
                                placeholder="PRIMARY SECTOR"
                                required
                            />
                        </div>

                        <InfraredInput
                            label="Portfolio / Social"
                            placeholder="LINK TO CREDENTIALS"
                        />
                    </div>

                    <div className="pt-4 flex justify-center">
                        <InfraredButton type="submit" disabled={loading} className="w-full">
                            {loading ? "TRANSMITTING..." : "SUBMIT APPLICATION"}
                        </InfraredButton>
                    </div>
                </form>
            </GlassPanel>
        </div>
    );
}
