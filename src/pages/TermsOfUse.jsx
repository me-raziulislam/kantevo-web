// pages/TermsOfUse.jsx

import SEO from "../components/SEO";

export default function TermsOfUse() {
    return (
        <div className="flex flex-col items-center px-4 sm:px-8 bg-background text-text transition-colors duration-300 min-h-screen">
            <SEO
                title="Terms of Service"
                description="Kantevo Terms of Service: user rights, responsibilities, and platform policies for our campus canteen ordering experience."
                canonicalPath="/terms-of-use"
            />

            {/* Hero */}
            <section className="text-center mt-10 max-w-4xl mx-auto" data-aos="fade-up">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-primary">📜 Terms of Service</h1>
                <p className="mt-2 text-sm text-text/70">Operated by: <strong>Kantevo</strong> (Registered under Udyam MSME Scheme, India)</p>
                <p className="mt-1 text-sm text-text/70">Last updated: November 2025</p>
                <p className="mt-4 text-lg text-text/80 leading-relaxed">
                    Welcome to <strong>Kantevo</strong>—a digital platform that helps students pre-order from verified campus canteens. By accessing or
                    using Kantevo’s website, mobile app, or related APIs (the “Platform”), you agree to these Terms of Service (“Terms”) and to our
                    other policies referenced here (Privacy Policy, Refund & Cancellation Policy, etc.).
                </p>
            </section>

            {/* Legal Content */}
            <main className="w-full max-w-5xl mx-auto">
                {/* 1. Acceptance of Terms */}
                <section className="mt-16" data-aos="fade-up">
                    <h2 className="text-3xl font-bold mb-4">1. Acceptance of Terms</h2>
                    <p className="text-text/80 leading-relaxed">
                        Kantevo connects college/school students with registered canteens to browse menus, place advance orders, and pay digitally.
                        Kantevo is a <em>technology facilitator</em> and not a food manufacturer, seller, or delivery provider. By using the Platform,
                        you enter a legally binding agreement with Kantevo and accept all policies linked on the Platform.
                    </p>
                </section>

                {/* 2. Definitions */}
                <section className="mt-12" data-aos="fade-up">
                    <h2 className="text-3xl font-bold mb-4">2. Definitions</h2>
                    <div className="text-text/80 leading-relaxed space-y-2">
                        <p><strong>“User” / “You”</strong>: Anyone using the Platform (students, canteen owners, or visitors).</p>
                        <p><strong>“Canteen Partner”</strong>: A verified college/school canteen registered on Kantevo.</p>
                        <p><strong>“Order”</strong>: A confirmed request by a student to a Canteen Partner through the Platform.</p>
                        <p><strong>“Platform”</strong>: Kantevo’s website, mobile applications, and APIs.</p>
                        <p><strong>“Content”</strong>: Menus, images, reviews, data, messages, and media uploaded by Users or Canteen Partners.</p>
                        <p><strong>“Kantevo Content”</strong>: Proprietary design, interface, software code, and data owned by Kantevo.</p>
                    </div>
                </section>

                {/* 3. Eligibility */}
                <section className="mt-12" data-aos="fade-up">
                    <h2 className="text-3xl font-bold mb-4">3. Eligibility</h2>
                    <p className="text-text/80 leading-relaxed">
                        Students must be at least 16 years old and belong to a participating institution. Canteen Partners must be institution-authorized
                        and verified by Kantevo. All Users must comply with Indian laws, including the Information Technology Act, 2000 and the Consumer
                        Protection Act, 2019.
                    </p>
                </section>

                {/* 4. Changes to the Terms */}
                <section className="mt-12" data-aos="fade-up">
                    <h2 className="text-3xl font-bold mb-4">4. Changes to the Terms</h2>
                    <p className="text-text/80 leading-relaxed">
                        We may update these Terms as our services evolve. Continued use of the Platform after updates means you accept the revised Terms.
                        Please review this page periodically.
                    </p>
                </section>

                {/* 5. Provision of Services */}
                <section className="mt-12" data-aos="fade-up">
                    <h2 className="text-3xl font-bold mb-4">5. Provision of Services</h2>
                    <p className="text-text/80 leading-relaxed mb-3">
                        Kantevo enables discovery of campus canteens, digital menu browsing, advance ordering, and payment. Kantevo does not cook, pack,
                        or deliver food; these are handled by Canteen Partners. Services may be modified, paused, or removed at any time to improve the
                        experience or for operational reasons.
                    </p>
                    <p className="text-text/80 leading-relaxed">
                        <strong>Disclaimer:</strong> Kantevo is a technology platform. Food preparation, pricing, availability, and quality remain solely
                        the responsibility of the respective Canteen Partner.
                    </p>
                </section>

                {/* 6. User Accounts */}
                <section className="mt-12" data-aos="fade-up">
                    <h2 className="text-3xl font-bold mb-4">6. User Accounts</h2>
                    <ul className="list-disc ml-6 text-text/80 leading-relaxed space-y-2">
                        <li>Account creation requires valid details and verification (students via institutional identity; canteens via authorization).</li>
                        <li>You are responsible for safeguarding passwords and for all activity under your account.</li>
                        <li>Impersonation, fake registrations, or misuse of tokens/payments may result in immediate suspension.</li>
                        <li>We may send you essential communications (order status, service messages, security alerts).</li>
                        <li>Kantevo may deactivate accounts for policy violations, fraud, or risk to the Platform or users.</li>
                    </ul>
                </section>

                {/* 7. Content Ownership & Licensing */}
                <section className="mt-12" data-aos="fade-up">
                    <h2 className="text-3xl font-bold mb-4">7. Content Ownership and Licensing</h2>
                    <p className="text-text/80 leading-relaxed mb-3">
                        You own the content you upload (e.g., reviews, menu photos, descriptions). By uploading, you grant Kantevo a non-exclusive,
                        worldwide, royalty-free license to host, display, adapt, and promote such content for Platform functionality and communication.
                    </p>
                    <p className="text-text/80 leading-relaxed">
                        Kantevo owns all rights in its name, logos, interface, software, and databases. Unauthorized use, scraping, framing, or reproduction
                        of Kantevo Content is prohibited.
                    </p>
                </section>

                {/* 8. Prohibited Activities */}
                <section className="mt-12" data-aos="fade-up">
                    <h2 className="text-3xl font-bold mb-4">8. Prohibited Activities</h2>
                    <ul className="list-disc ml-6 text-text/80 leading-relaxed space-y-2">
                        <li>Posting offensive, misleading, infringing, or unlawful content.</li>
                        <li>Impersonation, fake accounts, or misrepresentation of identity/affiliation.</li>
                        <li>Circumventing payments or order tokens; chargebacks without basis.</li>
                        <li>Using bots, scrapers, or automated scripts to access the Platform.</li>
                        <li>Spamming, unsolicited promotions, or chain messages.</li>
                        <li>Interfering with security features, APIs, or normal operation of the Platform.</li>
                        <li>Any misuse that harms students, canteens, institutions, or Kantevo.</li>
                    </ul>
                </section>

                {/* 9. Orders & Payments */}
                <section className="mt-12" data-aos="fade-up">
                    <h2 className="text-3xl font-bold mb-4">9. Orders and Payments</h2>
                    <p className="text-text/80 leading-relaxed mb-3">
                        Orders placed via Kantevo are processed by the respective Canteen Partner. A collection token or QR generated by the Platform
                        represents a confirmed order. Payments are facilitated through integrated third-party gateways; Kantevo does not handle cash or
                        prepare food. Canteen Partners are solely responsible for fulfillment.
                    </p>
                    <p className="text-text/80 leading-relaxed">
                        Once an order is confirmed, cancellation and refunds (if any) are governed by our Refund & Cancellation Policy and the Canteen
                        Partner’s operational status.
                    </p>
                </section>

                {/* 10. Pricing, Cancellation & Refund */}
                <section className="mt-12" data-aos="fade-up">
                    <h2 className="text-3xl font-bold mb-4">10. Pricing, Cancellation, and Refund</h2>
                    <ul className="list-disc ml-6 text-text/80 leading-relaxed space-y-2">
                        <li>Menu prices are listed by Canteen Partners; occasional discrepancies may occur at source.</li>
                        <li>Confirmed orders cannot be modified except with Canteen Partner approval.</li>
                        <li>No refunds for change of mind. Refunds may apply for non-fulfillment, item unavailability, or duplicate payment.</li>
                        <li>Refund timelines depend on payment processors; Kantevo isn’t liable for processor delays.</li>
                    </ul>
                </section>

                {/* 11. Advertising & Promotions */}
                <section className="mt-12" data-aos="fade-up">
                    <h2 className="text-3xl font-bold mb-4">11. Advertising and Promotions</h2>
                    <p className="text-text/80 leading-relaxed">
                        The Platform may display sponsored placements, coupons, or canteen highlights. Such content will be clearly identified where
                        feasible. Your dealings with third-party advertisers are solely between you and them; Kantevo isn’t responsible for external
                        offers or charitable campaigns run outside the Platform.
                    </p>
                </section>

                {/* 12. Warranties & Liability */}
                <section className="mt-12" data-aos="fade-up">
                    <h2 className="text-3xl font-bold mb-4">12. Warranties and Liability</h2>
                    <p className="text-text/80 leading-relaxed">
                        The Platform is provided “as is” and “as available.” We do not guarantee uninterrupted, timely, or error-free access. Food quality,
                        taste, hygiene, and safety are the responsibility of Canteen Partners. To the maximum extent permitted by law, Kantevo is not
                        liable for indirect, incidental, special, or consequential damages. You are responsible for your device, data, and internet charges.
                    </p>
                </section>

                {/* 13. Indemnification */}
                <section className="mt-12" data-aos="fade-up">
                    <h2 className="text-3xl font-bold mb-4">13. Indemnification</h2>
                    <p className="text-text/80 leading-relaxed">
                        You agree to indemnify and hold harmless Kantevo, its team, and affiliates from any claims, losses, or liabilities arising from
                        your misuse of the Platform, breach of these Terms, or violation of third-party rights. Kantevo may assume exclusive defense and
                        control of matters subject to indemnification.
                    </p>
                </section>

                {/* 14. Account Termination */}
                <section className="mt-12" data-aos="fade-up">
                    <h2 className="text-3xl font-bold mb-4">14. Account Termination</h2>
                    <p className="text-text/80 leading-relaxed">
                        You can delete your account at any time via in-app settings or by contacting support. Kantevo may suspend or terminate access for
                        violations, fraud, or inactivity. Order and payment records may be retained as required by law and for legitimate business purposes.
                    </p>
                </section>

                {/* 15. General Terms */}
                <section className="mt-12" data-aos="fade-up">
                    <h2 className="text-3xl font-bold mb-4">15. General Terms</h2>
                    <ul className="list-disc ml-6 text-text/80 leading-relaxed space-y-2">
                        <li>These Terms, along with our Privacy Policy and Refund & Cancellation Policy, form the entire agreement.</li>
                        <li>If any provision is unenforceable, the remainder remains in effect.</li>
                        <li>No partnership, employment, or agency relationship is created by these Terms.</li>
                        <li>Governing Law: India; exclusive jurisdiction of the courts in <strong>[Your City]</strong>.</li>
                        <li>Any claim must be initiated within one (1) year from when it arose.</li>
                    </ul>
                </section>

                {/* 16. Copyright & IP Infringement */}
                <section className="mt-12" data-aos="fade-up">
                    <h2 className="text-3xl font-bold mb-4">16. Copyright & IP Infringement</h2>
                    <p className="text-text/80 leading-relaxed mb-3">
                        Kantevo respects intellectual property rights. If you believe your copyrighted work is used on the Platform without authorization,
                        please email a detailed notice to <a href="mailto:legal@kantevo.com" className="text-primary underline hover:text-primary/80">legal@kantevo.com</a>{" "}
                        including description of the work, proof of ownership, URL/screenshot, your contact details, and a statement made under good faith.
                    </p>
                </section>

                {/* 17. Feedback & Suggestions */}
                <section className="mt-12" data-aos="fade-up">
                    <h2 className="text-3xl font-bold mb-4">17. Feedback and Suggestions</h2>
                    <p className="text-text/80 leading-relaxed">
                        We welcome product ideas and feedback. By submitting suggestions, you agree they are non-confidential and may be used by Kantevo
                        without obligation to compensate or credit you. Please avoid sending unsolicited marketing proposals.
                    </p>
                </section>

                {/* 18. Contact & Grievance */}
                <section className="mt-12" data-aos="fade-up">
                    <h2 className="text-3xl font-bold mb-1">18. Contact & Grievance</h2>
                    <p className="text-text/80 leading-relaxed">
                        <strong>Kantevo</strong> (Udyam Registered MSME) <br />
                        Email:{" "}
                        <a href="mailto:support@kantevo.com" className="text-primary underline hover:text-primary/80">
                            support@kantevo.com
                        </a>{" "}
                        • Response Time: within 48 business hours • Operating Hours: Mon–Fri, 10:00 AM–6:00 PM (IST)
                    </p>
                    <p className="text-text/80 leading-relaxed mt-2">
                        For legal notices:{" "}
                        <a href="mailto:legal@kantevo.com" className="text-primary underline hover:text-primary/80">
                            legal@kantevo.com
                        </a>
                    </p>
                </section>

                {/* 19. Anti-Fraud & Safety Notice */}
                <section className="mt-12 mb-20" data-aos="fade-up">
                    <h2 className="text-3xl font-bold mb-4">19. Anti-Fraud & Safety Notice</h2>
                    <p className="text-text/80 leading-relaxed">
                        Kantevo representatives will never ask for your OTP, card PIN, full card number, or passwords. If you receive such a request,
                        do not share any information and report it immediately to{" "}
                        <a href="mailto:security@kantevo.com" className="text-primary underline hover:text-primary/80">
                            security@kantevo.com
                        </a>.
                    </p>
                </section>
            </main>
        </div>
    );
}
