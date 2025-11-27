// pages/Home.jsx
// Modern, premium landing page for students

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
    ClockIcon,
    QrCodeIcon,
    DevicePhoneMobileIcon,
    SparklesIcon,
    CheckCircleIcon,
    ArrowRightIcon,
    BoltIcon,
    ShieldCheckIcon,
    CurrencyRupeeIcon,
} from "@heroicons/react/24/outline";
import SEO from "../components/SEO";
import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";
import OTPModal from "../components/OTPModal";

const Home = () => {
    // ---------- Modal State ----------
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [otpEmail, setOtpEmail] = useState("");
    const loginInitialFocusRef = useRef(null);

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

    const features = [
        {
            icon: ClockIcon,
            title: "Skip the Queue",
            description: "Order before break starts. Your food is ready when you reach the canteen.",
            color: "primary",
        },
        {
            icon: QrCodeIcon,
            title: "QR Token System",
            description: "Get a digital QR token instantly. Just show, scan, and collect your food.",
            color: "accent",
        },
        {
            icon: DevicePhoneMobileIcon,
            title: "Order from Anywhere",
            description: "From classroom to library — order food from anywhere on campus.",
            color: "success",
        },
        {
            icon: ShieldCheckIcon,
            title: "Secure Payments",
            description: "Multiple payment options with secure transactions. Pay with UPI, cards, or wallet.",
            color: "primary",
        },
    ];

    const howItWorks = [
        {
            step: "01",
            title: "Browse & Order",
            description: "Explore your canteen menu and add items to cart before break time.",
        },
        {
            step: "02",
            title: "Pay Securely",
            description: "Complete payment with UPI, cards, or wallet. Get instant confirmation.",
        },
        {
            step: "03",
            title: "Get QR Token",
            description: "Receive a unique QR code as your digital token for the order.",
        },
        {
            step: "04",
            title: "Collect & Enjoy",
            description: "Show QR at canteen, get your food ready, and enjoy your break!",
        },
    ];

    const stats = [
        { value: "15+", label: "Minutes Saved" },
        { value: "0", label: "Queue Time" },
        { value: "100%", label: "Digital Tokens" },
        { value: "24/7", label: "Order Anytime" },
    ];

    return (
        <div className="min-h-screen bg-background text-text">
            <SEO
                title="Kantevo — Smart Canteen Ordering for Students"
                description="Kantevo connects students and canteens through a seamless digital food ordering experience. Browse menus, place orders, and pay effortlessly."
                canonicalPath="/"
            />

            {/* ---------- HERO SECTION ---------- */}
            <section className="relative overflow-hidden hero-pattern">
                {/* Decorative elements */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

                <div className="container-app relative">
                    <div className="py-12 md:py-16 lg:py-20">
                        <div className="max-w-4xl mx-auto text-center">
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
                            >
                                <SparklesIcon className="w-4 h-4" />
                                <span>Smart Campus Food Ordering</span>
                            </motion.div>

                            {/* Headline */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="heading-xl mb-6"
                            >
                                Skip the Queue,{" "}
                                <span className="text-gradient">Not Your Meal</span>
                            </motion.h1>

                            {/* Subheadline */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8"
                            >
                                Order food from your college canteen before break. Get a QR token,
                                skip the queue, and make the most of your break time.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                            >
                                <button
                                    onClick={() => setShowSignup(true)}
                                    className="btn-primary px-8 py-4 text-base flex items-center gap-2 group"
                                >
                                    Start Ordering Now
                                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => setShowLogin(true)}
                                    ref={loginInitialFocusRef}
                                    className="btn-secondary px-8 py-4 text-base"
                                >
                                    I have an account
                                </button>
                            </motion.div>

                            {/* Trust indicators */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="mt-12 flex flex-wrap items-center justify-center gap-6 text-text-muted text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <CheckCircleIcon className="w-5 h-5 text-success" />
                                    <span>Free for Students</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircleIcon className="w-5 h-5 text-success" />
                                    <span>No App Download</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircleIcon className="w-5 h-5 text-success" />
                                    <span>Instant QR Tokens</span>
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
                        {stats.map((stat, i) => (
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

            {/* ---------- PROBLEM SECTION ---------- */}
            <section className="py-16 md:py-24">
                <div className="container-app">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="text-center mb-12"
                        >
                            <div className="badge mb-4">The Problem</div>
                            <h2 className="heading-lg mb-4">
                                Break Time is <span className="text-error">Wasted</span> in Queues
                            </h2>
                            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                                College breaks are just 30-40 minutes. By the time you get a token,
                                wait in line, and get your food — break's over. Sound familiar?
                            </p>
                        </motion.div>

                        {/* Problem illustration cards */}
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid md:grid-cols-3 gap-6"
                        >
                            {[
                                { time: "5 min", label: "Getting physical token", icon: "🎟️" },
                                { time: "10 min", label: "Waiting in food queue", icon: "⏳" },
                                { time: "5 min", label: "Actually eating", icon: "😔" },
                            ].map((item, i) => (
                                <motion.div
                                    key={item.label}
                                    variants={fadeInUp}
                                    className="card-flat p-6 text-center"
                                >
                                    <div className="text-4xl mb-3">{item.icon}</div>
                                    <div className="text-2xl font-bold text-error mb-1">{item.time}</div>
                                    <div className="text-sm text-text-muted">{item.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ---------- SOLUTION / HOW IT WORKS ---------- */}
            <section className="py-16 md:py-24 bg-background-subtle">
                <div className="container-app">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <div className="badge badge-success mb-4">The Solution</div>
                        <h2 className="heading-lg mb-4">
                            How <span className="text-gradient">Kantevo</span> Works
                        </h2>
                        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                            Pre-order your food, get a digital QR token, and collect your meal
                            without any waiting. It's that simple.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {howItWorks.map((item, i) => (
                            <motion.div
                                key={item.step}
                                variants={fadeInUp}
                                className="relative"
                            >
                                {/* Connector line for desktop */}
                                {i < howItWorks.length - 1 && (
                                    <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary/30 to-transparent" />
                                )}

                                <div className="card p-6 h-full">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-light text-white font-bold flex items-center justify-center mb-4">
                                        {item.step}
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                                    <p className="text-text-secondary text-sm">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ---------- FEATURES SECTION ---------- */}
            <section className="py-16 md:py-24">
                <div className="container-app">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <div className="badge mb-4">Features</div>
                        <h2 className="heading-lg mb-4">
                            Why Students <span className="text-gradient">Love</span> Kantevo
                        </h2>
                        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                            Built specifically for college campuses. Fast, simple, and designed
                            to make your canteen experience seamless.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 gap-6"
                    >
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                variants={fadeInUp}
                                className="card p-6 md:p-8 flex gap-5"
                            >
                                <div className={`feature-icon${feature.color === "accent" ? "-accent" : feature.color === "success" ? "-success" : ""} shrink-0`}>
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                                    <p className="text-text-secondary">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ---------- BENEFITS COMPARISON ---------- */}
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
                            <div className="badge badge-accent mb-4">Comparison</div>
                            <h2 className="heading-lg mb-4">
                                Traditional vs <span className="text-gradient">Kantevo</span>
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Traditional */}
                            <div className="card-flat p-6 md:p-8 border-error/20">
                                <div className="text-error font-semibold mb-4 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-error" />
                                    Traditional Way
                                </div>
                                <ul className="space-y-3">
                                    {[
                                        "Wait 10+ minutes for physical token",
                                        "Stand in long queues",
                                        "Rush to eat in remaining time",
                                        "Miss out on favorite items",
                                        "Cash only at some counters",
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-3 text-text-secondary">
                                            <span className="text-error mt-1">✗</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Kantevo */}
                            <div className="card p-6 md:p-8 border-success/30 bg-success/5">
                                <div className="text-success font-semibold mb-4 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-success" />
                                    With Kantevo
                                </div>
                                <ul className="space-y-3">
                                    {[
                                        "Order from classroom before break",
                                        "Instant digital QR token",
                                        "Skip queue, collect food directly",
                                        "Browse full menu, never miss items",
                                        "Multiple payment options",
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-3 text-text-secondary">
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

            {/* ---------- CTA SECTION ---------- */}
            <section className="py-16 md:py-24 relative overflow-hidden">
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
                            <BoltIcon className="w-4 h-4" />
                            <span>Ready to save time?</span>
                        </div>

                        <h2 className="heading-lg mb-4">
                            Make Your Break <span className="text-gradient">Worth It</span>
                        </h2>

                        <p className="text-text-secondary text-lg mb-8">
                            Join thousands of students who've already upgraded their canteen
                            experience. Start ordering smarter today.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => setShowSignup(true)}
                                className="btn-primary px-8 py-4 text-base flex items-center gap-2 group"
                            >
                                Get Started — It's Free
                                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <p className="mt-6 text-sm text-text-muted">
                            No credit card required • Works on any device • Takes 30 seconds
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
                    userType="student"
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

export default Home;
