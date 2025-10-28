// pages/Home.jsx
// Updated to use OTP-based signup/login flow for Students.
// Simplified registration handled through SignupModal and OTPModal.
// Design and layout remain identical — only logic updated.

import { useRef, useState } from "react";
import { FaUtensils, FaMobileAlt, FaClock, FaUsers } from "react-icons/fa";
import { toast } from "react-toastify";
import SEO from "../components/SEO";

// Reusable modals for login/signup/OTP flow
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

    return (
        <div className="min-h-screen bg-background text-text transition-colors duration-300">
            <SEO
                title="Kantevo — Smart Canteen Ordering for Students"
                description="Kantevo connects students and canteens through a seamless digital food ordering experience. Browse menus, place orders, and pay effortlessly."
                canonicalPath="/"
            />

            {/* ---------- HERO SECTION ---------- */}
            <section
                className="relative overflow-hidden"
                style={{
                    background:
                        "radial-gradient(1200px 400px at 20% -10%, rgba(0,0,0,0.05), transparent), radial-gradient(1200px 400px at 80% -20%, rgba(0,0,0,0.05), transparent)",
                }}
            >
                <div className="max-w-6xl mx-auto px-4 py-14 md:py-20 flex flex-col items-center text-center">
                    <h1
                        className="text-4xl md:text-5xl font-extrabold leading-tight text-primary"
                        data-aos="fade-up"
                    >
                        Welcome to Kantevo 🍽️
                    </h1>
                    <p
                        className="mt-4 text-lg text-text/80 max-w-2xl"
                        data-aos="fade-up"
                        data-aos-delay="150"
                    >
                        Your campus food ordering made simple! Discover, order, and pick up your
                        favorite meals from your college canteen with just a few taps.
                    </p>

                    {/* Buttons */}
                    {/* <div
                        className="mt-8 flex flex-wrap justify-center gap-4"
                        data-aos="zoom-in"
                        data-aos-delay="200"
                    >
                        <button
                            onClick={() => setShowLogin(true)}
                            ref={loginInitialFocusRef}
                            className="px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:brightness-110 transition transform hover:scale-[1.02]"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setShowSignup(true)}
                            className="px-6 py-3 rounded-lg border border-text/20 hover:border-primary transition hover:shadow-sm text-sm"
                        >
                            Register
                        </button>
                    </div> */}
                </div>
            </section>

            {/* ---------- PROBLEM SECTION ---------- */}
            <section className="py-16 border-t border-gray-200 dark:border-gray-700" data-aos="fade-up">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                        The Problem We Solve
                    </h2>
                    <p className="text-text/80 leading-relaxed">
                        Students often face long queues, lack of menu visibility, and uncertainty
                        about food availability. Canteen owners struggle with managing rush hours
                        and tracking orders effectively. Kantevo bridges this gap with a digital
                        ordering experience tailored for campus life.
                    </p>
                </div>
            </section>

            {/* ---------- FEATURES SECTION ---------- */}
            <section className="py-16 border-t border-gray-200 dark:border-gray-700">
                <div className="max-w-6xl mx-auto px-4">
                    <h2
                        className="text-3xl md:text-4xl font-extrabold text-center mb-12"
                        data-aos="fade-up"
                    >
                        Why Choose Kantevo?
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[{
                            icon: <FaUtensils />,
                            title: "Easy Ordering",
                            desc: "Browse canteen menus and place orders without leaving your seat."
                        }, {
                            icon: <FaMobileAlt />,
                            title: "Mobile Friendly",
                            desc: "Access Kantevo anywhere, anytime with a fully responsive experience."
                        }, {
                            icon: <FaClock />,
                            title: "Save Time",
                            desc: "Skip long queues — order ahead and get notified when your meal is ready."
                        }, {
                            icon: <FaUsers />,
                            title: "For Everyone",
                            desc: "Designed to make dining easy for both students and canteen owners."
                        }].map((feature, i) => (
                            <div
                                key={feature.title}
                                className="p-6 border border-gray-300 dark:border-gray-600 rounded-2xl shadow-sm hover:shadow-lg transition"
                                data-aos="fade-up"
                                data-aos-delay={100 * (i + 1)}
                            >
                                <div className="text-primary text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                <p className="text-text/80 text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------- CTA SECTION ---------- */}
            <section className="py-16 text-center border-t border-gray-200 dark:border-gray-700" data-aos="zoom-in">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-primary">
                        Ready to make your campus dining effortless?
                    </h2>
                    <p className="text-text/80 mb-6">
                        Join thousands of students experiencing hassle-free canteen orders with Kantevo.
                    </p>
                    <button
                        onClick={() => setShowSignup(true)}
                        className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-lg transition transform hover:scale-[1.02]"
                    >
                        Get Started
                    </button>
                </div>
            </section>

            {/* ---------- MODALS (Updated to OTP-based flow) ---------- */}
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
                    userType="student" // 🔹 Explicitly mark this as student signup
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
