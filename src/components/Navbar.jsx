import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import ThemeToggle from "./ThemeToggle";
import { Helmet } from "@dr.pogodin/react-helmet";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import OTPModal from "./OTPModal";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // ---------- Modal states ----------
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [otpEmail, setOtpEmail] = useState("");
    const loginInitialFocusRef = useRef(null);

    // ---------- Logout ----------
    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully", { autoClose: 2000 });

        // Navigate appropriately after logout
        if (user?.role === "canteenOwner") {
            navigate("/partner-with-us");
        } else {
            navigate("/");
        }
    };

    // ---------- Determine Logo Link Dynamically ----------
    const getLogoLink = () => {
        if (user?.role === "canteenOwner") return "/partner-with-us";
        if (user?.role === "admin" || user?.role === "student") return "/";
        return location.pathname.includes("partner-with-us")
            ? "/partner-with-us"
            : "/";
    };

    // ---------- Determine User Type for Signup ----------
    // This ensures if a user is on /partner-with-us, we register them as canteenOwner.
    const signupUserType = location.pathname.includes("partner-with-us")
        ? "canteenOwner"
        : "student";

    // Structured data for SEO (Google sitelinks, schema.org)
    const navStructuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: [
            {
                "@type": "SiteNavigationElement",
                position: 1,
                name: "Home",
                url: "https://kantevo.com/",
            },
        ],
    };

    return (
        <>
            {/* Helmet for injecting schema markup for structured navigation */}
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(navStructuredData)}
                </script>
            </Helmet>

            {/* 🔹 Sticky Navbar */}
            <header className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    {/* Logo */}
                    <Link to={getLogoLink()} className="flex items-center gap-2">
                        <span className="text-2xl font-extrabold tracking-tight">
                            Kantevo{" "}
                            {(user?.role === "canteenOwner" ||
                                location.pathname.includes("partner-with-us")) && (
                                    <span className="text-primary">Partner</span>
                                )}
                        </span>
                    </Link>

                    {/* Right-side buttons */}
                    <div className="flex items-center gap-4">
                        {!user ? (
                            <>
                                {/* Login Button */}
                                <button
                                    ref={loginInitialFocusRef}
                                    onClick={() => setShowLogin(true)}
                                    className="px-5 py-2 rounded-full border border-text/20 hover:border-primary transition hover:shadow-sm text-sm"
                                >
                                    Login
                                </button>
                                {/* Signup Button (optional: visible only on homepage/partner page) */}
                                <button
                                    onClick={() => setShowSignup(true)}
                                    className="px-5 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition text-sm"
                                >
                                    Sign Up
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="text-sm font-medium">
                                    Hi, {user.name}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm text-red-500 hover:text-red-700 font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        )}

                        {/* Theme Toggle Button */}
                        <ThemeToggle />
                    </div>
                </div>
            </header>

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
                    userType={signupUserType} // 🔹 new prop to indicate type (student / canteenOwner)
                    onClose={() => setShowSignup(false)}
                    onOpenLogin={() => {
                        setShowSignup(false);
                        setShowLogin(true);
                    }}
                    onOTPSent={(email) => {
                        // 🔹 Trigger OTP modal after registration
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
                        // 🔹 After OTP verification, prompt user to login
                        setShowOTP(false);
                        toast.success("Email verified! You can now log in.");
                    }}
                    mode="signup"
                />
            )}
        </>
    );
};

export default Navbar;
