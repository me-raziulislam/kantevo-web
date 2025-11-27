// pages/RefundPolicy.jsx
// Premium Refund Policy page

import { motion } from "framer-motion";
import { BanknotesIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import SEO from "../components/SEO";

export default function RefundPolicy() {
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
    };

    const studentEligible = [
        "The payment was made, but the order did not get confirmed due to a system error.",
        "The order was cancelled by the canteen before preparation began (e.g., item unavailable).",
        "The student received the wrong order or spoiled/contaminated food, verified by the Kantevo support team.",
        "The order was charged multiple times accidentally.",
    ];

    const studentNotEligible = [
        "Change of mind or wrong item selection by the student.",
        "Late pickup leading to food cooling or spoilage.",
        "Partial consumption of food before raising a complaint.",
        "Disputes raised after 1 hour of order collection.",
    ];

    const canteenEligible = [
        "The student fails to collect a prepaid order, despite the canteen preparing it correctly and on time.",
        "A system error or app malfunction resulted in an invalid or duplicate order.",
        "The payment from a student failed due to a technical glitch, even though the canteen prepared the order as per confirmation.",
    ];

    const canteenNotEligible = [
        "Orders cancelled by the student after preparation has started.",
        "Verified food quality or hygiene complaints raised by students.",
        "Claims submitted after 24 hours of the transaction.",
        "Misuse or manipulation of the refund/compensation system.",
    ];

    return (
        <div className="min-h-screen bg-background text-text">
            <SEO
                title="Refund Policy — Kantevo"
                description="Learn about Kantevo's refund process and conditions for transactions made on our platform."
                canonicalPath="/refund-policy"
            />

            {/* Hero Section */}
            <section className="relative overflow-hidden hero-pattern">
                <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />

                <div className="container-app relative">
                    <div className="py-12 md:py-16 lg:py-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-3xl mx-auto text-center"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
                                <BanknotesIcon className="w-8 h-8 text-accent" />
                            </div>
                            <h1 className="heading-xl mb-6">
                                Refund <span className="text-gradient">Policy</span>
                            </h1>
                            <p className="text-lg text-text-secondary">
                                Clear and fair guidelines for students and canteen partners.
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
                        >
                            <div className="badge badge-accent mb-6">For Students</div>
                            <p className="text-text-secondary mb-6">
                                Kantevo and our canteen partners strive to provide you with accurate,
                                fresh, and timely food orders. Refunds are applicable only under specific
                                conditions, as outlined below.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                {/* Eligible */}
                                <div className="card p-6 border-success/30 bg-success/5">
                                    <div className="flex items-center gap-2 text-success font-semibold mb-4">
                                        <CheckCircleIcon className="w-5 h-5" />
                                        Eligible for Refund
                                    </div>
                                    <ul className="space-y-3">
                                        {studentEligible.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                                                <CheckCircleIcon className="w-4 h-4 text-success shrink-0 mt-0.5" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Not Eligible */}
                                <div className="card-flat p-6 border-error/20">
                                    <div className="flex items-center gap-2 text-error font-semibold mb-4">
                                        <XCircleIcon className="w-5 h-5" />
                                        Not Eligible for Refund
                                    </div>
                                    <ul className="space-y-3">
                                        {studentNotEligible.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                                                <XCircleIcon className="w-4 h-4 text-error shrink-0 mt-0.5" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="card p-6">
                                <h3 className="font-semibold text-lg mb-3">Refund Process</h3>
                                <div className="space-y-3 text-text-secondary text-sm">
                                    <p>1. Report the issue via the Kantevo App/Website or by emailing{" "}
                                        <a href="mailto:support@kantevo.com" className="text-primary hover:underline">
                                            support@kantevo.com
                                        </a>{" "}within 30 minutes of receiving the order.
                                    </p>
                                    <p>2. Provide your Order ID, payment reference, and (if applicable) a clear photo of the item.</p>
                                    <p>3. The Kantevo support team will verify the claim with the canteen.</p>
                                    <p>4. Once approved, the refund will be processed within 5–7 business days to your original payment method.</p>
                                    <p>5. If the payment was made using the Kantevo Wallet, the refund will be credited back to your wallet balance.</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* For Canteen Owners */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <div className="badge badge-success mb-6">For Canteen Owners</div>
                            <p className="text-text-secondary mb-6">
                                Canteen Owners are valued partners on the Kantevo platform and receive
                                payments for every confirmed order they fulfill. Refunds or payment
                                adjustments apply only under certain verified circumstances.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                {/* Eligible */}
                                <div className="card p-6 border-success/30 bg-success/5">
                                    <div className="flex items-center gap-2 text-success font-semibold mb-4">
                                        <CheckCircleIcon className="w-5 h-5" />
                                        Eligible for Compensation
                                    </div>
                                    <ul className="space-y-3">
                                        {canteenEligible.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                                                <CheckCircleIcon className="w-4 h-4 text-success shrink-0 mt-0.5" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Not Eligible */}
                                <div className="card-flat p-6 border-error/20">
                                    <div className="flex items-center gap-2 text-error font-semibold mb-4">
                                        <XCircleIcon className="w-5 h-5" />
                                        Not Eligible
                                    </div>
                                    <ul className="space-y-3">
                                        {canteenNotEligible.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                                                <XCircleIcon className="w-4 h-4 text-error shrink-0 mt-0.5" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="card p-6">
                                <h3 className="font-semibold text-lg mb-3">Adjustment Process</h3>
                                <div className="space-y-3 text-text-secondary text-sm">
                                    <p>1. Report any concern to{" "}
                                        <a href="mailto:support@kantevo.com" className="text-primary hover:underline">
                                            support@kantevo.com
                                        </a>{" "}within 24 hours of the incident.
                                    </p>
                                    <p>2. Provide your Order ID, date/time, and any supporting evidence.</p>
                                    <p>3. The Kantevo Support Team will review the issue and communicate the outcome.</p>
                                    <p>4. Approved adjustments will be processed as credits or deductions in the next payout cycle.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
