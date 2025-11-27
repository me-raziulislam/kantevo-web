// pages/PrivacyPolicy.jsx
// Premium Privacy Policy page

import { motion } from "framer-motion";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import SEO from "../components/SEO";

export default function PrivacyPolicy() {
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen bg-background text-text">
            <SEO
                title="Privacy Policy — Kantevo"
                description="Read Kantevo's privacy policy to understand how we collect, use, and protect your personal data."
                canonicalPath="/privacy-policy"
            />

            {/* Hero Section */}
            <section className="relative overflow-hidden hero-pattern">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />

                <div className="container-app relative">
                    <div className="py-12 md:py-16 lg:py-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-3xl mx-auto text-center"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                                <ShieldCheckIcon className="w-8 h-8 text-primary" />
                            </div>
                            <h1 className="heading-xl mb-6">
                                Privacy <span className="text-gradient">Policy</span>
                            </h1>
                            <p className="text-lg text-text-secondary">
                                At Kantevo, we are committed to safeguarding your privacy. This policy
                                explains how we collect, use, and protect information for both students
                                and canteen owners.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 md:py-16">
                <div className="container-app">
                    <div className="max-w-3xl mx-auto space-y-12">
                        {/* For Students */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="card p-6 md:p-8"
                        >
                            <div className="badge badge-accent mb-4">For Students</div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-lg mb-3">Information We Collect</h3>
                                    <ul className="space-y-2 text-text-secondary">
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary mt-1">•</span>
                                            Personal details: name, email, mobile number, college.
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary mt-1">•</span>
                                            Order details: items purchased, transaction amounts, tokens.
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary mt-1">•</span>
                                            Device and usage data: browser type, IP address, app usage.
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg mb-3">How We Use Your Information</h3>
                                    <p className="text-text-secondary">
                                        We process your information to place orders, confirm payments, generate
                                        order tokens, notify about order status, and improve personalization
                                        (e.g., showing your frequent items).
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg mb-3">Sharing of Data</h3>
                                    <p className="text-text-secondary">
                                        We only share essential order details with the respective canteen to
                                        fulfill your request. We never sell your personal data to third parties.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg mb-3">Your Rights</h3>
                                    <p className="text-text-secondary">
                                        You can request account deletion, correction of details, or opt-out from
                                        marketing communication. Contact{" "}
                                        <a href="mailto:support@kantevo.com" className="text-primary hover:underline">
                                            support@kantevo.com
                                        </a>{" "}
                                        for assistance.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* For Canteen Owners */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="card p-6 md:p-8"
                        >
                            <div className="badge badge-success mb-4">For Canteen Owners</div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-lg mb-3">Information We Collect</h3>
                                    <ul className="space-y-2 text-text-secondary">
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary mt-1">•</span>
                                            Business details: canteen name, registration, contact info.
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary mt-1">•</span>
                                            Menu and pricing details, operational timings.
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary mt-1">•</span>
                                            Financial details: bank/UPI account for order settlements.
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg mb-3">How We Use Your Information</h3>
                                    <p className="text-text-secondary">
                                        Information is used to display your canteen to students, process incoming
                                        orders, calculate settlements, and provide performance analytics.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg mb-3">Data Security</h3>
                                    <p className="text-text-secondary">
                                        We use encryption, role-based access, and secure servers. Financial data
                                        is handled by trusted payment gateways and not stored by us.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg mb-3">Retention</h3>
                                    <p className="text-text-secondary">
                                        Business data is retained as long as your canteen is active on our
                                        platform or as required by law.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Footer note */}
                        <motion.p
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="text-center text-text-muted text-sm"
                        >
                            This policy may be updated from time to time. Continued use of Kantevo
                            after updates constitutes acceptance of changes.
                        </motion.p>
                    </div>
                </div>
            </section>
        </div>
    );
}
