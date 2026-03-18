"use client";

import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { AnimatedTitle } from "@/components/ui/AnimatedTitle";

export default function Policy() {
    return (
        <main className="min-h-screen bg-near-black">
            <Navbar />
            <div className="pt-48 pb-24 px-8 max-w-4xl mx-auto space-y-12">
                <AnimatedTitle>Privacy Policy & Terms</AnimatedTitle>

                <div className="prose prose-invert max-w-none text-white/70 space-y-12 leading-relaxed">

                    {/* Privacy Policy */}
                    <section className="space-y-6">
                        <h2 className="text-white font-bold text-2xl mb-6 tracking-wide">Privacy Policy</h2>

                        <div className="space-y-4">
                            <p className="text-sm text-white/50">Last updated: March 2026</p>

                            <h3 className="text-white font-semibold text-lg mt-6">1. Information We Collect</h3>
                            <p>
                                When you submit an application to join TORA, we collect the following information:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong className="text-white">Contact Information:</strong> Full name, email address, phone number</li>
                                <li><strong className="text-white">Professional Information:</strong> Role (Artist, Agent, Promoter, Venue), profile name, agency name (if applicable), venue capacity (if applicable)</li>
                                <li><strong className="text-white">Location Information:</strong> Zone, country, and city</li>
                                <li><strong className="text-white">Music Preferences:</strong> Selected genres</li>
                                <li><strong className="text-white">Social Media Profiles:</strong> Instagram username, Resident Advisor username (optional), SoundCloud username (optional), website (optional), LinkedIn name (optional)</li>
                            </ul>

                            <h3 className="text-white font-semibold text-lg mt-6">2. How We Use Your Information</h3>
                            <p>We use the information you provide to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Review and process your application to join TORA</li>
                                <li>Verify your professional identity and credentials</li>
                                <li>Create your account if your application is approved</li>
                                <li>Communicate with you about your application status</li>
                                <li>Pre-populate your profile information upon approval</li>
                                <li>Send you invitations and access codes when we launch</li>
                            </ul>

                            <h3 className="text-white font-semibold text-lg mt-6">3. Data Storage and Security</h3>
                            <p>
                                Your application data is securely stored using Supabase, a trusted database service with enterprise-grade security.
                                We implement industry-standard security measures to protect your personal information from unauthorized access,
                                alteration, disclosure, or destruction.
                            </p>

                            <h3 className="text-white font-semibold text-lg mt-6">4. Data Retention</h3>
                            <p>
                                We retain your application data for the following purposes:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong className="text-white">Approved Applications:</strong> Transferred to your TORA account upon launch</li>
                                <li><strong className="text-white">Pending Applications:</strong> Retained until review is complete</li>
                                <li><strong className="text-white">Declined Applications:</strong> Retained for 12 months, then permanently deleted</li>
                            </ul>

                            <h3 className="text-white font-semibold text-lg mt-6">5. Your Rights</h3>
                            <p>You have the right to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong className="text-white">Access:</strong> Request a copy of your application data</li>
                                <li><strong className="text-white">Correction:</strong> Request corrections to inaccurate information</li>
                                <li><strong className="text-white">Deletion:</strong> Request deletion of your application at any time</li>
                                <li><strong className="text-white">Withdraw:</strong> Withdraw your application before it is processed</li>
                                <li><strong className="text-white">Portability:</strong> Request your data in a machine-readable format</li>
                            </ul>
                            <p className="mt-4">
                                To exercise any of these rights, please contact us at <a href="mailto:privacy@tora.app" className="text-infrared hover:text-infrared/80">privacy@tora.app</a>
                            </p>

                            <h3 className="text-white font-semibold text-lg mt-6">6. Data Sharing</h3>
                            <p>
                                We do not sell, trade, or rent your personal information to third parties. Your application data is only:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Accessible to authorized TORA team members for application review purposes</li>
                                <li>Stored securely with our database service provider (Supabase)</li>
                                <li>Never shared with marketing companies or advertisers</li>
                            </ul>

                            <h3 className="text-white font-semibold text-lg mt-6">7. GDPR Compliance</h3>
                            <p>
                                For users in the European Union, we comply with the General Data Protection Regulation (GDPR).
                                Your application data is processed on the legal basis of consent and legitimate interest in reviewing
                                professional applications for our membership-based platform.
                            </p>

                            <h3 className="text-white font-semibold text-lg mt-6">8. Contact Information</h3>
                            <p>
                                For any privacy-related questions or concerns, please contact us at:
                            </p>
                            <p className="mt-2">
                                Email: <a href="mailto:privacy@tora.app" className="text-infrared hover:text-infrared/80">privacy@tora.app</a>
                            </p>
                        </div>
                    </section>

                    {/* Terms of Service */}
                    <section className="space-y-6 pt-8 border-t border-white/10">
                        <h2 className="text-white font-bold text-2xl mb-6 tracking-wide">Terms of Service</h2>

                        <div className="space-y-4">
                            <h3 className="text-white font-semibold text-lg mt-6">1. Application Process</h3>
                            <p>
                                By submitting an application to TORA, you acknowledge and agree that:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>All information provided is accurate and truthful</li>
                                <li>You are a professional in the electronic music industry</li>
                                <li>Submission of an application does not guarantee acceptance</li>
                                <li>TORA reserves the right to approve or decline applications at our sole discretion</li>
                                <li>You may only submit one application per person</li>
                            </ul>

                            <h3 className="text-white font-semibold text-lg mt-6">2. Membership-Only Platform</h3>
                            <p>
                                TORA is an invitation-only, membership-based platform for verified professionals in the electronic music industry.
                                Access is granted exclusively through the application and approval process.
                            </p>

                            <h3 className="text-white font-semibold text-lg mt-6">3. Professional Conduct</h3>
                            <p>
                                We expect all applicants and future members to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Maintain professional standards of conduct</li>
                                <li>Provide accurate and verifiable professional credentials</li>
                                <li>Respect the privacy and integrity of the application process</li>
                                <li>Not misrepresent their role, experience, or affiliations</li>
                            </ul>

                            <h3 className="text-white font-semibold text-lg mt-6">4. Application Review</h3>
                            <p>
                                Applications are reviewed based on:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Professional credentials and experience</li>
                                <li>Role relevance to the electronic music industry</li>
                                <li>Authenticity of provided social media profiles</li>
                                <li>Overall fit with TORA's professional community</li>
                            </ul>
                            <p className="mt-4">
                                Review timelines may vary. We will notify you via email once your application has been reviewed.
                            </p>

                            <h3 className="text-white font-semibold text-lg mt-6">5. Invitation and Access</h3>
                            <p>
                                If your application is approved:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>You will receive an invitation email with access instructions</li>
                                <li>You may be assigned a coupon code for subscription benefits</li>
                                <li>Invitations are non-transferable and personal to you</li>
                                <li>Invitation codes expire after a specified period</li>
                            </ul>

                            <h3 className="text-white font-semibold text-lg mt-6">6. Modifications to Terms</h3>
                            <p>
                                TORA reserves the right to modify these terms at any time. Changes will be communicated via email
                                to applicants and posted on this page with an updated "Last updated" date.
                            </p>

                            <h3 className="text-white font-semibold text-lg mt-6">7. Contact</h3>
                            <p>
                                For questions about these terms or the application process, contact us at:
                            </p>
                            <p className="mt-2">
                                Email: <a href="mailto:support@tora.app" className="text-infrared hover:text-infrared/80">support@tora.app</a>
                            </p>
                        </div>
                    </section>

                    {/* Application-Specific Notice */}
                    <section className="space-y-4 pt-8 border-t border-white/10">
                        <h3 className="text-white font-semibold text-lg">Notice for Pre-Launch Applicants</h3>
                        <p>
                            TORA is currently in pre-launch phase. By submitting an application now, you are applying for early access
                            to the platform when we officially launch. Early applicants may receive priority consideration and special
                            membership benefits.
                        </p>
                    </section>

                </div>
            </div>
            <Footer />
        </main>
    );
}
