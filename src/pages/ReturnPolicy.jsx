// pages/ReturnPolicy.jsx
// Premium Return Policy page

import { motion } from "framer-motion";
import { ArrowPathIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import SEO from "../components/SEO";

export default function ReturnPolicy() {
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
    };

    const studentEligible = [
        "The wrong item was prepared or provided.",
        "The food is spoiled, cold, or contaminated at the time of pickup.",
        "The order was charged but not prepared due to technical or system errors.",
    ];

    const studentNotEligible = [
        "Change of mind or taste preference.",
        "Delay in pickup leading to cold or stale food.",
        "Food consumed partially or completely.",
        "Incorrect customization due to user entry errors.",
    ];

    const canteenEligible = [
        "The student fails to collect the order after preparation (and the canteen followed pickup timing correctly).",
        "A system error caused duplicate or invalid orders.",
        "Food was prepared but payment failed on the student's end due to a platform issue.",
    ];

    const canteenNotEligible = [
        "Orders cancelled by the student after preparation has started.",
        "Errors in food quality or hygiene that result in verified student complaints.",
        "Misreporting or failure to prepare food within the specified time.",
    ];

    return (
        <div className="min-h-screen bg-background text-text">
            <SEO
                title="Return Policy — Kantevo"
                description="Understand Kantevo's return policy for canteen orders and payments."
                canonicalPath="/return-policy"
            />

            {/* Hero Section */}
            <section className="relative overflow-hidden hero-pattern">
                <div className="absolute top-20 left-10 w-72 h-72 bg-success/10 rounded-full blur-3xl" />

                <div className="container-app relative">
                    <div className="py-12 md:py-16 lg:py-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-3xl mx-auto text-center"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-6">
                                <ArrowPathIcon className="w-8 h-8 text-success" />
                            </div>
                            <h1 className="heading-xl mb-6">
                                Return <span className="text-gradient">Policy</span>
                            </h1>
                            <p className="text-lg text-text-secondary">
                                Ensuring fairness and transparency for both students and canteen owners.
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
                                Once an order is placed and payment is confirmed, the canteen begins
                                preparing your meal immediately. To maintain freshness and hygiene,
                                orders cannot be returned or refunded after collection, except in specific cases.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                {/* Eligible */}
                                <div className="card p-6 border-success/30 bg-success/5">
                                    <div className="flex items-center gap-2 text-success font-semibold mb-4">
                                        <CheckCircleIcon className="w-5 h-5" />
                                        Eligible for Return/Replacement
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
                                        Not Eligible for Return
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
                                <h3 className="font-semibold text-lg mb-3">Resolution Process</h3>
                                <div className="space-y-3 text-text-secondary text-sm">
                                    <p>1. Visit the Help/Support section or contact{" "}
                                        <a href="mailto:support@kantevo.com" className="text-primary hover:underline">
                                            support@kantevo.com
                                        </a>{" "}within 30 minutes of pickup.
                                    </p>
                                    <p>2. Provide your Order ID, issue description, and (if applicable) a photo of the received food.</p>
                                    <p>3. The canteen and Kantevo team will review your request.</p>
                                    <p>4. If approved, you may receive a replacement or refund (at the canteen's discretion).</p>
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
                                Canteen Owners prepare food based on confirmed and prepaid orders from
                                students. Since ingredients and preparation costs are incurred immediately,
                                it's important that returns and cancellations are handled fairly.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                {/* Eligible */}
                                <div className="card p-6 border-success/30 bg-success/5">
                                    <div className="flex items-center gap-2 text-success font-semibold mb-4">
                                        <CheckCircleIcon className="w-5 h-5" />
                                        Eligible for Adjustments
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
                                <h3 className="font-semibold text-lg mb-3">Resolution Process</h3>
                                <div className="space-y-3 text-text-secondary text-sm">
                                    <p>1. Report any issue to{" "}
                                        <a href="mailto:support@kantevo.com" className="text-primary hover:underline">
                                            support@kantevo.com
                                        </a>{" "}within 24 hours.
                                    </p>
                                    <p>2. Provide order details and supporting proof (like photos or logs).</p>
                                    <p>3. Kantevo will mediate between the student and canteen for a fair outcome.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
