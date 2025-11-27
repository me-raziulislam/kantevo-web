// src/pages/onboarding/PendingApproval.jsx
// Premium pending approval page

import { motion } from "framer-motion";
import {
    ClockIcon,
    CheckCircleIcon,
    EnvelopeIcon,
    PhoneIcon
} from "@heroicons/react/24/outline";
import SEO from "../../components/SEO";

const PendingApproval = () => {
    const steps = [
        { label: "Registration Submitted", completed: true },
        { label: "Under Review", completed: false, active: true },
        { label: "Approved", completed: false },
    ];

    return (
        <div className="min-h-screen bg-background text-text">
            <SEO
                title="Pending Approval"
                description="Your canteen registration is under review."
                canonicalPath="/pending-approval"
            />

            <div className="container-app py-12 md:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto text-center"
                >
                    {/* Icon */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="w-24 h-24 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-8"
                    >
                        <ClockIcon className="w-12 h-12 text-warning" />
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl md:text-4xl font-bold mb-4"
                    >
                        Awaiting Admin Approval
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-text-secondary text-lg mb-10 max-w-lg mx-auto"
                    >
                        Your canteen registration is complete and is currently being reviewed by our team.
                        You'll receive an email notification once approved.
                    </motion.p>

                    {/* Progress Steps */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="card p-6 md:p-8 mb-8"
                    >
                        <h2 className="font-semibold text-lg mb-6">Application Status</h2>

                        <div className="flex items-center justify-center gap-4 md:gap-8">
                            {steps.map((step, i) => (
                                <div key={step.label} className="flex items-center">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step.completed
                                                ? "bg-success text-white"
                                                : step.active
                                                    ? "bg-warning/20 text-warning border-2 border-warning"
                                                    : "bg-background-subtle text-text-muted border border-border"
                                                }`}
                                        >
                                            {step.completed ? (
                                                <CheckCircleIcon className="w-5 h-5" />
                                            ) : step.active ? (
                                                <div className="w-3 h-3 rounded-full bg-warning animate-pulse" />
                                            ) : (
                                                <span className="text-sm font-medium">{i + 1}</span>
                                            )}
                                        </div>
                                        <span className={`text-xs md:text-sm font-medium text-center ${step.completed ? "text-success" : step.active ? "text-warning" : "text-text-muted"
                                            }`}>
                                            {step.label}
                                        </span>
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div className={`w-8 md:w-16 h-0.5 mx-2 md:mx-4 mb-6 ${step.completed ? "bg-success" : "bg-border"
                                            }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Info Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="card-flat p-6"
                    >
                        <h3 className="font-semibold mb-4">What happens next?</h3>
                        <ul className="space-y-3 text-left text-text-secondary text-sm">
                            <li className="flex items-start gap-3">
                                <CheckCircleIcon className="w-5 h-5 text-success shrink-0 mt-0.5" />
                                <span>Our team will verify your submitted documents within 24-48 hours</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircleIcon className="w-5 h-5 text-success shrink-0 mt-0.5" />
                                <span>You'll receive an email once your canteen is approved</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircleIcon className="w-5 h-5 text-success shrink-0 mt-0.5" />
                                <span>After approval, you can start adding menu items and receiving orders</span>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Contact Support */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-10 pt-8 border-t border-border"
                    >
                        <p className="text-text-muted text-sm mb-4">Need help or have questions?</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="mailto:partner@kantevo.com"
                                className="btn-secondary px-5 py-2.5 flex items-center gap-2"
                            >
                                <EnvelopeIcon className="w-5 h-5" />
                                partner@kantevo.com
                            </a>
                            <a
                                href="tel:+919876543210"
                                className="btn-ghost px-5 py-2.5 flex items-center gap-2"
                            >
                                <PhoneIcon className="w-5 h-5" />
                                +91 98765 43210
                            </a>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default PendingApproval;
