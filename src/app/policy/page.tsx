"use client";

import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { AnimatedTitle } from "@/components/ui/AnimatedTitle";

export default function Policy() {
    return (
        <main className="min-h-screen bg-near-black">
            <Navbar />
            <div className="pt-48 pb-24 px-8 max-w-3xl mx-auto space-y-12">
                <AnimatedTitle>Policy & Terms</AnimatedTitle>
                <div className="prose prose-invert max-w-none text-white/50 space-y-8">
                    <section>
                        <h2 className="text-white font-bold text-xl mb-4">Privacy Policy</h2>
                        <p>Your data is yours. We only collect what is necessary to connect you with the industry.</p>
                    </section>
                    <section>
                        <h2 className="text-white font-bold text-xl mb-4">Terms of Service</h2>
                        <p>Tora is a platform for professionals. We expect a high standard of conduct from all users.</p>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}
