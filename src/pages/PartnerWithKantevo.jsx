// pages/PartnerWithKantevo.jsx
// Professional partner landing page for canteen owners

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
    CheckCircleIcon,
    ArrowRightIcon,
    ClockIcon,
    QrCodeIcon,
    ChartBarIcon,
    CurrencyRupeeIcon,
    UserGroupIcon,
    DevicePhoneMobileIcon,
    ShieldCheckIcon,
    HeartIcon,
    RocketLaunchIcon,
    SparklesIcon,
    DocumentCheckIcon,
    BuildingStorefrontIcon,
    BanknotesIcon,
    IdentificationIcon,
} from "@heroicons/react/24/outline";
import SEO from "../components/SEO";
import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";
import OTPModal from "../components/OTPModal";

const PartnerWithKantevo = () => {
    // ---------- Modal State ----------
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [otpEmail, setOtpEmail] = useState("");
    const loginInitialFocusRef = useRef(null);

    const scrollToWhyPartner = () =>
        document.getElementById("why-partner")?.scrollIntoView({ behavior: "smooth" });

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const benefits = [
        {
            icon: ClockIcon,
            title: "Reduce Rush Hour Chaos",
            description: "Students order before breaks. You prepare early and serve without the usual crowd panic.",
            color: "primary",
        },
        {
            icon: QrCodeIcon,
            title: "Digital QR Token System",
            description: "No more paper tokens. Students show QR, you scan, order updates automatically.",
            color: "accent",
        },
        {
            icon: ChartBarIcon,
            title: "Smart Dashboard",
            description: "Track orders, manage menu, view analytics — everything from one intuitive dashboard.",
            color: "success",
        },
        {
            icon: CurrencyRupeeIcon,
            title: "Boost Revenue",
            description: "Capture more orders with pre-ordering. No more lost sales due to long queues.",
            color: "primary",
        },
        {
            icon: DevicePhoneMobileIcon,
            title: "Real-time Notifications",
            description: "Get instant alerts for new orders. Never miss an order during peak hours.",
            color: "accent",
        },
        {
            icon: ShieldCheckIcon,
            title: "Secure Payments",
            description: "Receive payments directly to your bank. Weekly automated settlements.",
            color: "success",
        },
    ];

    const requirements = [
        { icon: BuildingStorefrontIcon, text: "Canteen name & college details" },
        { icon: ClockIcon, text: "Operating hours & menu" },
        { icon: IdentificationIcon, text: "PAN card or basic ID proof" },
        { icon: DocumentCheckIcon, text: "FSSAI license" },
        { icon: BanknotesIcon, text: "Bank details for settlements" },
    ];

    const stats = [
        { value: "50%", label: "Less Queue Time" },
        { value: "30%", label: "More Orders" },
        { value: "₹0", label: "Setup Fee" },
        { value: "24hr", label: "Onboarding" },
    ];

    return (
        <div className="min-h-screen bg-background text-text">
            <SEO
                title="Partner with Kantevo — Smart Canteen Ordering"
                description="Join Kantevo and bring your canteen online. Let students order before breaks, manage orders easily, and reduce queues with digital QR tokens."
                canonicalPath="/partner-with-us"
            />

            {/* ---------- HERO SECTION ---------- */}
            <section className="relative overflow-hidden hero-pattern">
                {/* Decorative elements */}
                <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

                <div className="container-app relative">
                    <div className="py-12 md:py-16 lg:py-20">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                            {/* Left: Content */}
                            <div>
                                {/* Badge */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6"
                                >
                                    <RocketLaunchIcon className="w-4 h-4" />
                                    <span>Early Partner Benefits — No Setup Fee!</span>
                                </motion.div>

                                {/* Headline */}
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="heading-xl mb-6"
                                >
                                    Digitize Your{" "}
                                    <span className="text-gradient">Canteen</span>{" "}
                                    Today
                                </motion.h1>

                                {/* Subheadline */}
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="text-lg md:text-xl text-text-secondary mb-8"
                                >
                                    Join Kantevo and transform how you serve students.
                                    Receive pre-orders, manage rush hours smartly, and
                                    eliminate queue chaos with our QR token system.
                                </motion.p>

                                {/* CTA Buttons */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="flex flex-wrap items-center gap-4"
                                >
                                    <button
                                        onClick={() => setShowSignup(true)}
                                        className="btn-primary px-8 py-4 text-base flex items-center gap-2 group"
                                    >
                                        Register Your Canteen
                                        <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <button
                                        onClick={scrollToWhyPartner}
                                        className="btn-ghost px-4 py-4 text-base text-primary hover:text-primary-dark"
                                    >
                                        Learn More ↓
                                    </button>
                                </motion.div>

                                {/* Trust indicators */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                    className="mt-10 flex flex-wrap items-center gap-6 text-text-muted text-sm"
                                >
                                    <div className="flex items-center gap-2">
                                        <CheckCircleIcon className="w-5 h-5 text-success" />
                                        <span>Free Onboarding</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircleIcon className="w-5 h-5 text-success" />
                                        <span>Dedicated Support</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircleIcon className="w-5 h-5 text-success" />
                                        <span>Weekly Settlements</span>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Right: Requirements Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="card p-6 md:p-8"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="feature-icon">
                                        <SparklesIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Quick Onboarding</h3>
                                        <p className="text-sm text-text-muted">Get started in 24 hours</p>
                                    </div>
                                </div>

                                <p className="text-text-secondary mb-5">
                                    Keep these documents ready for smooth registration:
                                </p>

                                <ul className="space-y-4">
                                    {requirements.map((item) => (
                                        <li key={item.text} className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                                                <item.icon className="w-5 h-5 text-success" />
                                            </div>
                                            <span className="text-sm">{item.text}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-6 pt-6 border-t border-border">
                                    <button
                                        onClick={() => setShowSignup(true)}
                                        className="w-full btn-primary py-3"
                                    >
                                        Start Registration
                                    </button>
                                    <p className="text-center text-xs text-text-muted mt-3">
                                        Already registered?{" "}
                                        <button
                                            onClick={() => setShowLogin(true)}
                                            className="text-primary hover:underline"
                                        >
                                            Login here
                                        </button>
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ---------- STATS SECTION ---------- */}
            <section className="py-12 border-y border-border bg-background-subtle">
                <div className="container-app">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        {stats.map((stat) => (
                            <motion.div
                                key={stat.label}
                                variants={fadeInUp}
                                className="text-center"
                            >
                                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-text-muted">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ---------- WHY PARTNER SECTION ---------- */}
            <section id="why-partner" className="py-16 md:py-24">
                <div className="container-app">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <div className="badge mb-4">Benefits</div>
                        <h2 className="heading-lg mb-4">
                            Why Partner with{" "}
                            <span className="text-gradient">Kantevo</span>?
                        </h2>
                        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                            Transform your canteen operations with our smart ordering platform.
                            Built specifically for college campuses.
                        </p>
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
                                <div className={`feature-icon${benefit.color === "accent" ? "-accent" : benefit.color === "success" ? "-success" : ""} mb-4`}>
                                    <benefit.icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                                <p className="text-text-secondary text-sm">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ---------- HOW IT WORKS FOR PARTNERS ---------- */}
            <section className="py-16 md:py-24 bg-background-subtle">
                <div className="container-app">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <div className="badge badge-accent mb-4">Process</div>
                        <h2 className="heading-lg mb-4">
                            How It Works for{" "}
                            <span className="text-gradient">Partners</span>
                        </h2>
                        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                            From registration to serving customers — here's your journey with Kantevo.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto"
                    >
                        {[
                            {
                                step: "1",
                                title: "Register & Verify",
                                description: "Sign up, submit your documents, and get verified within 24 hours. Our team assists you throughout.",
                            },
                            {
                                step: "2",
                                title: "Setup Your Menu",
                                description: "Add your items, set prices, and customize availability. Upload photos for better visibility.",
                            },
                            {
                                step: "3",
                                title: "Receive Orders",
                                description: "Students order before breaks. Get notified instantly and prepare food ahead of time.",
                            },
                            {
                                step: "4",
                                title: "Scan & Serve",
                                description: "Students show QR code, you scan it, and hand over the food. Order marked complete automatically.",
                            },
                            {
                                step: "5",
                                title: "Get Paid Weekly",
                                description: "All your earnings are settled directly to your bank account every week. Transparent reports included.",
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={item.step}
                                variants={fadeInUp}
                                className="relative flex gap-6 pb-8 last:pb-0"
                            >
                                {/* Vertical line */}
                                {i < 4 && (
                                    <div className="absolute left-6 top-14 w-[2px] h-[calc(100%-3.5rem)] bg-gradient-to-b from-primary/30 to-transparent" />
                                )}

                                {/* Step number */}
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-light text-white font-bold flex items-center justify-center shrink-0 relative z-10">
                                    {item.step}
                                </div>

                                {/* Content */}
                                <div className="card-flat p-5 flex-1">
                                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                                    <p className="text-text-secondary text-sm">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ---------- TESTIMONIAL / SOCIAL PROOF ---------- */}
            <section className="py-16 md:py-24">
                <div className="container-app">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <div className="badge badge-success mb-4">Partner Love</div>
                        <div className="text-5xl mb-6">❤️</div>
                        <blockquote className="text-xl md:text-2xl font-medium mb-6 text-text">
                            "Kantevo transformed how we handle rush hours. Students order before break,
                            we prepare food on time, and there's no more chaos at the counter."
                        </blockquote>
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="font-bold text-primary">RC</span>
                            </div>
                            <div className="text-left">
                                <p className="font-semibold">Raj's Canteen</p>
                                <p className="text-sm text-text-muted">Engineering College, Hyderabad</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ---------- COMPARISON SECTION ---------- */}
            <section className="py-16 md:py-24 bg-background-subtle">
                <div className="container-app">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="text-center mb-12">
                            <div className="badge mb-4">Comparison</div>
                            <h2 className="heading-lg mb-4">
                                Before & After <span className="text-gradient">Kantevo</span>
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Before */}
                            <div className="card-flat p-6 md:p-8 border-error/20">
                                <div className="text-error font-semibold mb-4 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-error" />
                                    Before Kantevo
                                </div>
                                <ul className="space-y-3">
                                    {[
                                        "Chaotic rush during break time",
                                        "Managing paper tokens manually",
                                        "Students wait 15+ minutes",
                                        "Missed orders, frustrated students",
                                        "Cash handling hassles",
                                        "No order analytics or insights",
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-3 text-text-secondary text-sm">
                                            <span className="text-error mt-1">✗</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* After */}
                            <div className="card p-6 md:p-8 border-success/30 bg-success/5">
                                <div className="text-success font-semibold mb-4 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-success" />
                                    After Kantevo
                                </div>
                                <ul className="space-y-3">
                                    {[
                                        "Prepare food before rush starts",
                                        "Digital QR tokens — scan & serve",
                                        "Students collect in under 2 minutes",
                                        "Every order tracked automatically",
                                        "Direct bank settlements weekly",
                                        "Full analytics dashboard",
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-3 text-text-secondary text-sm">
                                            <CheckCircleIcon className="w-5 h-5 text-success shrink-0 mt-0.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ---------- FAQ SECTION ---------- */}
            <section className="py-16 md:py-24">
                <div className="container-app">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="max-w-3xl mx-auto"
                    >
                        <div className="text-center mb-12">
                            <div className="badge mb-4">FAQ</div>
                            <h2 className="heading-lg mb-4">
                                Common <span className="text-gradient">Questions</span>
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {[
                                {
                                    q: "Is there any setup fee?",
                                    a: "No, there's zero setup fee for early partners. We'll help you get onboarded completely free.",
                                },
                                {
                                    q: "How do I receive payments?",
                                    a: "All payments are collected digitally and settled to your bank account every week. You'll get detailed transaction reports.",
                                },
                                {
                                    q: "Do I need any special equipment?",
                                    a: "Just a smartphone with internet connection. You'll use our app to receive orders and scan QR codes.",
                                },
                                {
                                    q: "What if students cancel orders?",
                                    a: "Our platform has clear cancellation policies. Students can cancel before you start preparing, ensuring no wastage.",
                                },
                                {
                                    q: "How long does onboarding take?",
                                    a: "Most canteens are onboarded within 24 hours after document verification. Our team guides you through every step.",
                                },
                            ].map((faq, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeInUp}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    className="card-flat p-5"
                                >
                                    <h3 className="font-semibold mb-2">{faq.q}</h3>
                                    <p className="text-text-secondary text-sm">{faq.a}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ---------- CTA SECTION ---------- */}
            <section className="py-16 md:py-24 relative overflow-hidden bg-background-subtle">
                {/* Background decoration */}
                <div className="absolute inset-0 hero-pattern opacity-50" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />

                <div className="container-app relative">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium mb-6">
                            <HeartIcon className="w-4 h-4" />
                            <span>Join the Kantevo Partner Network</span>
                        </div>

                        <h2 className="heading-lg mb-4">
                            Ready to Transform Your{" "}
                            <span className="text-gradient">Canteen</span>?
                        </h2>

                        <p className="text-text-secondary text-lg mb-8">
                            Join the growing network of smart canteens. Serve students better,
                            boost your revenue, and eliminate queue chaos.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => setShowSignup(true)}
                                className="btn-primary px-8 py-4 text-base flex items-center gap-2 group"
                            >
                                Partner with Kantevo
                                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <p className="mt-6 text-sm text-text-muted">
                            No setup fee • Free onboarding • Dedicated support
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ---------- MODALS ---------- */}
            {showLogin && (
                <LoginModal
                    isOpen={showLogin}
                    onClose={() => setShowLogin(false)}
                    onOpenSignup={() => {
                        setShowLogin(false);
                        setShowSignup(true);
                    }}
                    initialFocusRef={loginInitialFocusRef}
                />
            )}

            {showSignup && (
                <SignupModal
                    isOpen={showSignup}
                    userType="canteenOwner"
                    onClose={() => setShowSignup(false)}
                    onOpenLogin={() => {
                        setShowSignup(false);
                        setShowLogin(true);
                    }}
                    onOTPSent={(email) => {
                        setShowSignup(false);
                        setOtpEmail(email);
                        setShowOTP(true);
                    }}
                />
            )}

            {showOTP && (
                <OTPModal
                    isOpen={showOTP}
                    email={otpEmail}
                    onClose={() => setShowOTP(false)}
                    onVerified={() => {
                        setShowOTP(false);
                        toast.success("Email verified! You can now log in.");
                        setShowLogin(true);
                    }}
                />
            )}
        </div>
    );
};

export default PartnerWithKantevo;
