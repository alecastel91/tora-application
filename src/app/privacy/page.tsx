"use client";

import Link from "next/link";
import { TopNav, BottomNav, PageBrand } from "@/components/ui/PageNav";
import { AnimatedTitle } from "@/components/ui/AnimatedTitle";

export default function Privacy() {
    return (
        <main className="min-h-screen bg-black">
            <TopNav />
            <div className="pt-32 pb-20 px-8 max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <AnimatedTitle>Privacy Policy</AnimatedTitle>
                    <p className="text-white/40 text-sm uppercase tracking-widest" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                        Updated and effective May 2026
                    </p>
                </div>

                <div className="prose prose-invert max-w-none text-white/70 space-y-4 leading-relaxed" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>

                    <h3 className="text-white font-semibold text-lg mt-6 font-tech">Introduction</h3>
                    <p>
                        TORA ("TORA," the "Company," "we," and "us") is committed to maintaining a safe and trustworthy private community. We understand that privacy and confidentiality are of the utmost importance to our members, applicants, and other users ("you"). Your privacy is a top priority in everything that we do and every feature that we develop.
                    </p>
                    <p>
                        This Privacy Policy describes the information we collect, how that information may be used, and with whom it may be shared. By using our platform at <a href="https://torahub.io" className="text-infrared hover:underline">torahub.io</a>, including the application form, the web application, and any related services (collectively, the "Service"), you acknowledge the practices described herein.
                    </p>
                    <p>
                        We will occasionally update this Privacy Policy to reflect changes in the law, our data collection and use practices, or the features of our Service. When we make changes, we will revise the "updated" date at the top of this page. Your continued use of the Service following any changes constitutes your consent to and acceptance thereof. If you do not consent to such changes, you may terminate your account at any time.
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">Collecting Information</h3>

                    <p><strong className="text-white">Information You Provide in Connection with Membership.</strong> In order to apply for membership to TORA, you will be asked to submit an application including your name, email address, phone number, professional role (Artist, Agent, Promoter, or Venue), location (zone, country, city), music genre preferences, and social media profiles including Instagram, SoundCloud, Resident Advisor, LinkedIn, and website links. For agents, we collect your agency name; for venues, your venue capacity. This information is used to verify your professional identity, evaluate your application, and, if approved, create your account and profile.</p>

                    <p><strong className="text-white">Information Collected Through the Service.</strong> Once you are a member, you may provide additional information in connection with your use of the Service, including biographical descriptions, profile images, travel schedules, available dates, documents (press kits, tech riders, contracts, hospitality riders), booking details, deal terms, and messages exchanged with other users. Visibility of your information is subject to your privacy settings and subscription tier. Certain information may be restricted to connected users only.</p>

                    <p><strong className="text-white">Information Other Users Provide.</strong> Other users may provide information about you as they use the Service — for instance, when sending you a booking offer or connection request. If you are an artist, an agent may submit booking-related information on your behalf as part of the representation relationship.</p>

                    <p><strong className="text-white">Financial Information.</strong> TORA processes payments through third-party services. We do not store your credit card information. Your financial details are secured by and subject to the applicable third party's security and privacy policies.</p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">Sharing and Use of Information</h3>

                    <p>The personal information you provide is used only in connection with the Service. <strong className="text-white">We will never sell your personal information to any third party.</strong></p>

                    <p><strong className="text-white">Information Shared with Other Users.</strong> When you register as a user, your profile will be viewable by other users of the Service. Depending on your role and subscription tier, other users may see your name, role, location, genres, biography, social links, available dates, and travel schedule. A mutual connection between you and another user enables direct messaging through the Service.</p>

                    <p><strong className="text-white">Applicants and Waitlisted Users.</strong> Only accepted members can see your profile within the app. Applicants who have not yet been approved have no way to view your profile or know that you are a member of the TORA community.</p>

                    <p><strong className="text-white">Use of Information by TORA.</strong> We may use information that we collect about you to: (i) create and manage your account, (ii) deliver and improve the Service, including developing new features, (iii) facilitate discovery and connections among users, (iv) perform research, analysis, and analytics, (v) manage our business, (vi) communicate with you about your account, bookings, and the Service, and (vii) enforce our Terms of Service.</p>

                    <p><strong className="text-white">Service Providers.</strong> We may share non-personal, non-identifiable information with third parties that perform services on our behalf, such as database hosting (Supabase), email delivery (Resend), and analytics. These service providers may have access to information needed to perform their functions but are not permitted to share or use it for any other purposes.</p>

                    <p><strong className="text-white">Other Situations.</strong> We may disclose your information in connection with (i) legal compliance, including a subpoena, court order, or request from law enforcement, (ii) a significant corporate transaction such as the sale of our business, or (iii) your consent or request that we do so.</p>

                    <p><strong className="text-white">Legal Bases for Processing.</strong> We rely on the following legal bases: (i) performance of contract — as you use our Service, we process your information to maintain your account, display your profile, and facilitate connections; (ii) legitimate interests — we analyze user behavior to improve the Service, develop new features, and detect fraud; (iii) consent — from time to time we may ask for your consent for specific purposes. You may withdraw your consent at any time by contacting us.</p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">Keeping Your Information Secure</h3>

                    <p><strong className="text-white">Cross-Border Data Transfers.</strong> Sharing of information may involve cross-border data transfers. We take all reasonable steps to ensure that personal information remains protected, including the use of standard contract clauses approved by the European Commission where applicable.</p>

                    <p><strong className="text-white">Security Measures.</strong> We take the security of your information seriously and have implemented measures to safeguard it, including encrypted connections, secure database hosting with enterprise-grade security (Supabase), and hashed password storage. Despite our efforts, no system is guaranteed to be completely secure. We have no liability arising out of any loss, misuse, or alteration of your information resulting from circumstances beyond our reasonable control.</p>

                    <p><strong className="text-white">Retaining Your Information.</strong> We keep your personal information only as long as we need it for legitimate business purposes. Following account deletion, we implement a safety retention window of 90 days during which your data is retained but your account is not visible. After this period, your information is deleted or anonymized unless we must keep it to comply with applicable law or resolve an outstanding dispute. Declined applications are retained for 12 months, then permanently deleted.</p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">Communications</h3>

                    <p>By using the Service, you agree to receive communications from us regarding your account, application status, bookings, and the Service. You may also receive notifications about new features, invitations, and updates. You can manage your notification preferences within the app or by contacting us.</p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">Your Rights</h3>

                    <p><strong className="text-white">Tools to Control Your Information.</strong> We want you to be in control of your information. You can: (i) access, rectify, or delete information associated with your account directly within the Service; (ii) manage device permissions for notifications and location services; (iii) delete your account at any time; and (iv) withdraw any consent you have given us by contacting <a href="mailto:support@torahub.io" className="text-infrared hover:underline">support@torahub.io</a>.</p>

                    <p><strong className="text-white">Your Privacy Rights.</strong> You have the right to: (i) review the personal information we hold about you and request a copy; (ii) request rectification or deletion of inaccurate information; (iii) restrict or object to the processing of your information in certain circumstances; and (iv) obtain your personal information in a portable format. To exercise any of these rights, contact us at <a href="mailto:support@torahub.io" className="text-infrared hover:underline">support@torahub.io</a>.</p>

                    <p>For your protection, we may ask you to provide proof of identity before responding to such requests. We may reject requests that are unlawful or that may infringe on the privacy of another user.</p>

                    <p><strong className="text-white">Data Deletion.</strong> You can request complete deletion of your data at any time. Visit our <Link href="/data-deletion" className="text-infrared hover:underline">Data Deletion</Link> page for instructions, or contact us directly.</p>

                    <p><strong className="text-white">EU Residents.</strong> If you are located in the European Union, you have a right to lodge a complaint with the appropriate data protection authority if you have concerns about how we process your personal information.</p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">Age Policy</h3>

                    <p>The Service is restricted to people who are 18 years of age and older. We do not knowingly collect, maintain, or use information from anyone under the age of 18. Should we become aware of a user who does not meet this requirement, we will immediately remove that user from our Service.</p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">Contact</h3>

                    <p>
                        If you have questions regarding this Privacy Policy, please contact us at{" "}
                        <a href="mailto:support@torahub.io" className="text-infrared hover:underline">support@torahub.io</a>
                    </p>
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
