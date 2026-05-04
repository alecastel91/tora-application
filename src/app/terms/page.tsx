"use client";

import Link from "next/link";
import { TopNav, BottomNav, PageBrand } from "@/components/ui/PageNav";
import { AnimatedTitle } from "@/components/ui/AnimatedTitle";

export default function Terms() {
    return (
        <main className="min-h-screen bg-black">
            <TopNav />
            <div className="pt-32 pb-20 px-8 max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <AnimatedTitle>Terms of Service</AnimatedTitle>
                    <p className="text-white/40 text-sm uppercase tracking-widest" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                        Updated and effective May 2026
                    </p>
                </div>

                <div className="prose prose-invert max-w-none text-white/70 space-y-4 leading-relaxed" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>

                    <h3 className="text-white font-semibold text-lg mt-6 font-tech">Acceptance of Terms</h3>
                    <p>
                        By accessing or using the TORA platform at <a href="https://torahub.io" className="text-infrared hover:underline">torahub.io</a>, including the application form, web application, and any related services (collectively, the "Service"), you agree to be bound by these Terms of Service (the "Terms"). If you do not agree to these Terms, do not use the Service. We may modify these Terms at any time. Changes will be posted on this page with an updated effective date. Your continued use of the Service following any modifications constitutes acceptance of the revised Terms.
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">Eligibility</h3>
                    <p>
                        The Service is available only to individuals who are at least 18 years of age and are professionals in the music industry. By using the Service, you represent and warrant that you meet these requirements. TORA reserves the right to refuse access to anyone who does not meet the eligibility criteria or for any other reason at our sole discretion.
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">Membership and Application</h3>
                    <p>
                        TORA is a membership-only platform. Access is granted exclusively through the application and approval process. By submitting an application, you acknowledge and agree that:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>All information provided is accurate, truthful, and up to date</li>
                        <li>Submission of an application does not guarantee acceptance</li>
                        <li>TORA reserves the right to approve, decline, or waitlist applications at our sole discretion without obligation to provide a reason</li>
                        <li>Approved members may be assigned invitation codes and subscription benefits based on their membership tier</li>
                        <li>Invitation codes are personal, non-transferable, and may expire after a specified period</li>
                    </ul>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">Your Account</h3>
                    <p>
                        You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to notify us immediately of any unauthorized use of your account. TORA is not liable for any loss or damage arising from your failure to maintain the security of your account. You may maintain multiple profiles under one account (e.g. Artist and Agent), but each profile must accurately represent your professional role.
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">Subscriptions and Payments</h3>
                    <p>
                        TORA offers tiered subscription plans that provide varying levels of access and features. By subscribing, you agree to the pricing and terms displayed at the time of purchase. Subscription fees are billed in advance on a recurring basis (monthly or yearly) and are non-refundable except where required by applicable law. TORA reserves the right to change subscription pricing at any time. Any price changes will apply to the next billing cycle following notice of the change. Free trial periods, founding member benefits, and promotional offers are subject to their own terms and may be modified or discontinued at any time.
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">Professional Conduct</h3>
                    <p>
                        TORA is a professional network. By using the Service, you agree to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Maintain professional standards of conduct in all interactions</li>
                        <li>Provide accurate and verifiable professional credentials</li>
                        <li>Respect the privacy, confidentiality, and reputation of other members</li>
                        <li>Not misrepresent your role, experience, affiliations, or identity</li>
                        <li>Not use the Service for any unlawful, abusive, or fraudulent purpose</li>
                        <li>Not solicit, harass, or send unsolicited commercial communications to other members</li>
                        <li>Not attempt to circumvent subscription restrictions or access controls</li>
                        <li>Honor booking agreements and deal terms made through the platform in good faith</li>
                    </ul>
                    <p>
                        Violation of these standards may result in warning, suspension, or permanent removal from the platform at TORA's sole discretion.
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">Bookings and Deals</h3>
                    <p>
                        TORA provides tools for users to discover, negotiate, and manage professional bookings. While the platform facilitates the process, <strong className="text-white">TORA is not a party to any booking agreement, contract, or financial transaction between users.</strong> All deals, fees, contracts, and payments are between the parties involved. TORA does not guarantee the performance, reliability, or conduct of any user. Users are responsible for conducting their own due diligence before entering into any agreement.
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">Content and Intellectual Property</h3>
                    <p>
                        You retain ownership of all content you submit to the Service, including profile information, images, documents, press kits, and messages. By submitting content, you grant TORA a non-exclusive, worldwide, royalty-free license to use, display, and distribute such content solely in connection with operating and providing the Service. You represent that you have the right to submit all content you provide and that such content does not infringe on the rights of any third party.
                    </p>
                    <p>
                        The TORA name, logo, design, and all related trademarks, service marks, and intellectual property are owned by TORA and may not be used without prior written permission. You may not copy, modify, distribute, or create derivative works based on any part of the Service.
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">Agent Representation</h3>
                    <p>
                        Agents may represent artists on the platform and act on their behalf in booking-related matters. By accepting representation, an artist authorizes the agent to manage bookings, negotiate deals, and communicate with other users on their behalf. Either party may terminate the representation at any time through the platform. TORA is not responsible for disputes between agents and artists.
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">Confidentiality</h3>
                    <p>
                        The TORA community is built on trust. Members agree not to disclose, screenshot, record, or share the profiles, content, or personal information of other members outside of the platform without their explicit consent. Violation of this confidentiality is a serious breach of these Terms and may result in immediate account termination.
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">Limitation of Liability</h3>
                    <p>
                        The Service is provided on an "as is" and "as available" basis. TORA makes no warranties, express or implied, regarding the Service, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. To the fullest extent permitted by law, TORA shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, business opportunities, or goodwill, arising out of or in connection with your use of the Service.
                    </p>
                    <p>
                        TORA's total liability to you for any claim arising out of or relating to these Terms or the Service shall not exceed the amount you have paid to TORA in the twelve (12) months preceding the claim.
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">Indemnification</h3>
                    <p>
                        You agree to indemnify, defend, and hold harmless TORA, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising out of or in connection with your use of the Service, your violation of these Terms, or your violation of any rights of a third party.
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">Termination</h3>
                    <p>
                        You may terminate your account at any time by deleting it through the Service or by contacting us. TORA reserves the right to suspend or terminate any account that violates these Terms, engages in fraudulent activity, or behaves in a manner detrimental to the community, at our sole discretion and without prior notice. Upon termination, your right to access the Service ceases immediately. Provisions of these Terms that by their nature should survive termination shall remain in effect, including but not limited to intellectual property, limitation of liability, and indemnification.
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">Dispute Resolution</h3>
                    <p>
                        Any dispute arising out of or relating to these Terms or the Service shall be resolved through good faith negotiation between the parties. If the dispute cannot be resolved through negotiation, it shall be submitted to binding arbitration in accordance with the rules of the jurisdiction in which TORA is established. You agree that you will not file or participate in a class action against TORA.
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">Governing Law</h3>
                    <p>
                        These Terms are governed by and construed in accordance with the laws of the Republic of Singapore. By using the Service, you consent to the exclusive jurisdiction of the courts of Singapore. In the event there is a discrepancy between any translated version of these Terms and the English version, the English version shall prevail.
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">Severability</h3>
                    <p>
                        If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect. The invalid or unenforceable provision shall be modified to the minimum extent necessary to make it valid and enforceable.
                    </p>

                    <h3 className="text-white font-semibold text-lg mt-8 font-tech">Contact</h3>
                    <p>
                        If you have questions regarding these Terms of Service, please contact us at{" "}
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
