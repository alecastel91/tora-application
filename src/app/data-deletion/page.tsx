"use client";

import Link from "next/link";
import { TopNav, BottomNav, PageBrand } from "@/components/ui/PageNav";
import { AnimatedTitle } from "@/components/ui/AnimatedTitle";
import { GlassCard } from "@/components/ui/GlassCard";

export default function DataDeletion() {
    return (
        <main className="min-h-screen bg-black">
            <TopNav />
            <div className="pt-32 pb-20 px-8 max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <AnimatedTitle>Data Deletion</AnimatedTitle>
                    <p className="text-white/40 text-sm uppercase tracking-widest" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                        Your data, your control
                    </p>
                </div>

                <div className="prose prose-invert max-w-none text-white/70 space-y-8 leading-relaxed" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                    <p className="text-lg">
                        You have the right to request deletion of your personal data from TORA at any time.
                    </p>

                    <GlassCard className="space-y-4">
                        <h3 className="text-white font-semibold text-lg font-tech">How to Request Data Deletion</h3>
                        <p>
                            To request deletion of your data, send an email to{" "}
                            <a href="mailto:support@torahub.io" className="text-infrared hover:underline">support@torahub.io</a>
                            {" "}with the subject line <strong className="text-white">"Data Deletion Request"</strong> and include:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Your full name</li>
                            <li>The email address associated with your TORA account or application</li>
                            <li>Whether you want to delete your application data, account data, or both</li>
                        </ul>
                    </GlassCard>

                    <GlassCard className="space-y-4">
                        <h3 className="text-white font-semibold text-lg font-tech">What Happens Next</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>We will confirm receipt of your request as soon as possible</li>
                            <li>Your data will be permanently deleted within a reasonable timeframe</li>
                            <li>You will receive a confirmation email once deletion is complete</li>
                            <li>This action is irreversible — deleted data cannot be recovered</li>
                        </ul>
                    </GlassCard>

                    <GlassCard className="space-y-4">
                        <h3 className="text-white font-semibold text-lg font-tech">What Data Is Deleted</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Your application data (name, email, phone, location, genres, social links)</li>
                            <li>Your account and profile data (if you have an active account)</li>
                            <li>All messages and connection history</li>
                            <li>Any uploaded media or documents</li>
                        </ul>
                        <p className="text-sm text-white/50 mt-4">
                            Note: We may retain anonymized, non-identifiable data for analytics purposes in accordance with GDPR guidelines.
                        </p>
                    </GlassCard>
                </div>
                <div className="text-center">
                    <Link href="/" className="text-white/30 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>&lsaquo; Back</Link>
                </div>
                <PageBrand />
            </div>
            <BottomNav />
        </main>
    );
}
