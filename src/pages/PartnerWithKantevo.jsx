// pages/PartnerWithKantevo.jsx
// Updated: Unique Kantevo text and features tailored to smart canteen ordering.
// Keeps full layout, hero, SEO, and OTP-based registration flow intact.

import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";
import { MdQrCodeScanner, MdOutlineGroups, MdAccessTime, MdPhoneAndroid, MdTrendingUp, MdHeadsetMic } from "react-icons/md";
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

    return (
        <div className="min-h-screen bg-background text-text">
            <SEO
                title="Partner with Kantevo — Smart Canteen Ordering"
                description="Join Kantevo and bring your canteen online. Let students order before breaks, manage orders easily, and reduce queues with digital QR tokens."
                canonicalPath="/partner-with-us"
            />

            {/* ---------- HERO SECTION ---------- */}
            <section
                className="relative overflow-hidden"
                style={{
                    background:
                        "radial-gradient(1200px 400px at 20% -10%, rgba(0,0,0,0.05), transparent), radial-gradient(1200px 400px at 80% -20%, rgba(0,0,0,0.05), transparent)",
                }}
            >
                <div className="max-w-7xl mx-auto px-4 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                            Partner with <span className="text-primary">Kantevo</span> — Digitize your canteen today
                        </h1>

                        <div className="mt-5 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm">
                            <span className="font-semibold">No setup fee for early partners!</span>
                            <span className="opacity-70">Join the first wave of smart canteens</span>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <button
                                onClick={() => setShowSignup(true)}
                                className="px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:brightness-110 transition transform hover:scale-[1.02]"
                            >
                                Register your canteen
                            </button>

                            <button
                                onClick={scrollToWhyPartner}
                                className="text-primary underline-offset-2 hover:underline"
                            >
                                Why partner with us?
                            </button>
                        </div>
                    </div>

                    {/* Right Info Card */}
                    <div className="bg-background rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6 md:p-7">
                        <h3 className="text-xl font-bold mb-4">
                            Fast onboarding for your canteen
                        </h3>
                        <p className="text-text/70 mb-5">
                            Keep these details ready for a smooth registration:
                        </p>
                        <ul className="space-y-3">
                            {[
                                "College details",
                                "Canteen name & timings",
                                "PAN card or basic ID proof",
                                "FSSAI license",
                                "GST number (if applicable)",
                                "Menu (simple photo or text list)",
                                "UPI ID or Bank details for payments",
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <FaCheckCircle className="mt-1 text-primary" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ---------- WHY PARTNER SECTION ---------- */}
            <section id="why-partner" className="py-12 md:py-16 border-t border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10">
                        Why should you partner with Kantevo?
                    </h2>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: <MdAccessTime />,
                                title: "Reduce Break-Time Chaos",
                                desc: "Students can order before breaks, so you prepare early and serve fast without crowding.",
                            },
                            {
                                icon: <MdQrCodeScanner />,
                                title: "QR-Based Order Pickup",
                                desc: "No more physical tokens — students show QR, you scan, and the system updates instantly.",
                            },
                            {
                                icon: <MdOutlineGroups />,
                                title: "Built for Colleges",
                                desc: "Designed specifically for college campuses — seamless student and canteen management.",
                            },
                            {
                                icon: <MdPhoneAndroid />,
                                title: "Smart Dashboard & App",
                                desc: "Manage menus, track orders, and handle payments all from one intuitive dashboard.",
                            },
                            {
                                icon: <MdTrendingUp />,
                                title: "Boost Daily Sales",
                                desc: "Reduce idle time and get more student orders by optimizing the pre-order system.",
                            },
                            {
                                icon: <MdHeadsetMic />,
                                title: "Dedicated Support Team",
                                desc: "Our support team helps you get onboarded and guides you throughout your Kantevo journey.",
                            },
                        ].map((card, i) => (
                            <div
                                key={card.title}
                                className="rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
                                data-aos="fade-up"
                                data-aos-delay={100 * (i + 1)}
                            >
                                <div className="text-3xl mb-3 text-primary">{card.icon}</div>
                                <h4 className="font-semibold text-lg mb-1">{card.title}</h4>
                                <p className="text-sm text-text/70">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------- CTA ---------- */}
            <section id="partner-cta" className="py-16 text-center border-t border-gray-200 dark:border-gray-700">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-primary">
                        Bring your canteen online with Kantevo
                    </h2>
                    <p className="text-text/80 mb-6">
                        Join Kantevo and simplify food ordering for your college.
                        Manage rush hours smartly, save student time, and serve faster than ever.
                    </p>
                    <button
                        onClick={() => setShowSignup(true)}
                        className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-lg transition transform hover:scale-[1.02]"
                    >
                        Partner with us
                    </button>
                </div>
            </section>

            {/* ---------- MODALS (Updated for OTP Flow) ---------- */}
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
                    userType="canteenOwner" // 🔹 Explicit user type
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
