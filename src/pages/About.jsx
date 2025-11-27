// pages/About.jsx
// Premium About page with modern design

import { motion } from "framer-motion";
import {
    ClockIcon,
    QrCodeIcon,
    CurrencyRupeeIcon,
    SparklesIcon,
    RocketLaunchIcon,
    HeartIcon,
    EnvelopeIcon,
    PhoneIcon,
    GlobeAltIcon,
} from "@heroicons/react/24/outline";
import SEO from "../components/SEO";

export default function About() {
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const benefits = [
        {
            icon: ClockIcon,
            title: "No More Waiting Lines",
            description: "Order before you arrive and pick up your meal instantly.",
        },
        {
            icon: RocketLaunchIcon,
            title: "Time-Saving",
            description: "Focus on your classes, not queues. Your food will be ready when you are.",
        },
        {
            icon: CurrencyRupeeIcon,
            title: "Hassle-Free Payments",
            description: "Pay online securely through UPI, wallet, or card — no need to carry cash.",
        },
        {
            icon: SparklesIcon,
            title: "Fresh & Hot Meals",
            description: "Since your order is scheduled in advance, the canteen prepares it just in time.",
        },
        {
            icon: QrCodeIcon,
            title: "Eco-Friendly & Digital",
            description: "QR-based pickup means less paper, fewer receipts, and zero confusion.",
        },
        {
            icon: HeartIcon,
            title: "Fair for Everyone",
            description: "Canteens manage orders efficiently, reduce crowding, and improve service quality.",
        },
    ];

    const howItWorks = [
        { step: "01", title: "Order meals in advance", description: "Directly through the website or app" },
        { step: "02", title: "Scan the QR code", description: "At the canteen counter" },
        { step: "03", title: "Collect your food", description: "No waiting, no confusion" },
    ];

    return (
        <div className="min-h-screen bg-background text-text">
            <SEO
                title="About Us — Kantevo"
                description="Learn about Kantevo — the platform revolutionizing college canteen food ordering."
                canonicalPath="/about"
            />

            {/* Hero Section */}
            <section className="relative overflow-hidden hero-pattern">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

                <div className="container-app relative">
                    <div className="py-12 md:py-16 lg:py-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-3xl mx-auto text-center"
                        >
                            <div className="badge mb-4">About Us</div>
                            <h1 className="heading-xl mb-6">
                                About <span className="text-gradient">Kantevo</span>
                            </h1>
                            <p className="text-lg md:text-xl text-text-secondary mb-4">
                                Smarter Meals. No Waiting. Just Scanning.
                            </p>
                            <p className="text-text-secondary">
                                Kantevo is a smart and efficient college canteen food ordering platform
                                designed to make campus dining faster, simpler, and more enjoyable.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Problem Statement */}
            <section className="py-16 md:py-20 bg-background-subtle">
                <div className="container-app">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <p className="text-lg text-text-secondary leading-relaxed">
                            We know how precious every minute is between lectures — and standing in
                            long canteen lines just to grab a snack or meal can be frustrating.
                            That's where Kantevo steps in.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 md:py-20">
                <div className="container-app">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-12"
                    >
                        <div className="badge badge-accent mb-4">Process</div>
                        <h2 className="heading-lg">How It Works</h2>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
                    >
                        {howItWorks.map((item, i) => (
                            <motion.div
                                key={item.step}
                                variants={fadeInUp}
                                className="card p-6 text-center"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-light text-white font-bold flex items-center justify-center mx-auto mb-4">
                                    {item.step}
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                                <p className="text-text-secondary text-sm">{item.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Vision */}
            <section className="py-16 md:py-20 bg-background-subtle">
                <div className="container-app">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <div className="badge badge-success mb-4">Vision</div>
                        <h2 className="heading-lg mb-6">Our Vision</h2>
                        <p className="text-text-secondary text-lg leading-relaxed">
                            To revolutionize campus dining by combining technology and convenience —
                            ensuring that every student can enjoy fresh food without wasting time in queues.
                            Kantevo aims to become a bridge between students and canteen owners, making the
                            food ordering process effortless, transparent, and reliable.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Why Kantevo */}
            <section className="py-16 md:py-20">
                <div className="container-app">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-12"
                    >
                        <div className="badge mb-4">Benefits</div>
                        <h2 className="heading-lg">Why Kantevo?</h2>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {benefits.map((benefit) => (
                            <motion.div
                                key={benefit.title}
                                variants={fadeInUp}
                                className="card p-6"
                            >
                                <div className="feature-icon mb-4">
                                    <benefit.icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                                <p className="text-text-secondary text-sm">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Mission */}
            <section className="py-16 md:py-20 bg-background-subtle">
                <div className="container-app">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <div className="badge mb-4">Mission</div>
                        <h2 className="heading-lg mb-6">Our Mission</h2>
                        <p className="text-text-secondary text-lg leading-relaxed">
                            To make every college canteen smarter, faster, and more organized, while
                            helping students save time and canteen owners serve more efficiently —
                            all through one seamless digital platform.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact */}
            <section className="py-16 md:py-20">
                <div className="container-app">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="max-w-2xl mx-auto"
                    >
                        <div className="text-center mb-10">
                            <div className="badge badge-accent mb-4">Get in Touch</div>
                            <h2 className="heading-lg mb-4">Contact Us</h2>
                            <p className="text-text-secondary">
                                Have questions, feedback, or partnership inquiries? We'd love to hear from you!
                            </p>
                        </div>

                        <div className="card p-6 md:p-8">
                            <div className="space-y-4">
                                <a
                                    href="mailto:support@kantevo.com"
                                    className="flex items-center gap-4 p-4 rounded-xl bg-background-subtle hover:bg-primary/5 transition-colors group"
                                >
                                    <div className="feature-icon">
                                        <EnvelopeIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-muted">Email</p>
                                        <p className="font-medium group-hover:text-primary transition-colors">support@kantevo.com</p>
                                    </div>
                                </a>

                                <div className="flex items-center gap-4 p-4 rounded-xl bg-background-subtle">
                                    <div className="feature-icon-accent">
                                        <PhoneIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-muted">Phone</p>
                                        <p className="font-medium">+91-8135812526</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-xl bg-background-subtle">
                                    <div className="feature-icon-success">
                                        <GlobeAltIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-muted">Website</p>
                                        <p className="font-medium">www.kantevo.com</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-xl bg-background-subtle">
                                    <div className="feature-icon">
                                        <ClockIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-muted">Working Hours</p>
                                        <p className="font-medium">Monday – Saturday, 9:00 AM – 4:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
