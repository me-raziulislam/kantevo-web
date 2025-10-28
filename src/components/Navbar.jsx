// src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import ThemeToggle from "./ThemeToggle";
import { Helmet } from "@dr.pogodin/react-helmet";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import OTPModal from "./OTPModal";

const shortName = (full = "") => {
    if (!full.trim()) return "";
    const parts = full.trim().split(/\s+/);
    if (parts.length === 1) return parts[0];
    // Prefer First + Last initial (Raziul I.)
    return `${parts[0]} ${parts[parts.length - 1][0]}.`;
};

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // ---------- Auth modals ----------
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [otpEmail, setOtpEmail] = useState("");
    const loginInitialFocusRef = useRef(null);

    // ---------- Profile dropdown ----------
    const [openMenu, setOpenMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const onDoc = (e) => {
            if (!menuRef.current) return;
            if (!menuRef.current.contains(e.target)) setOpenMenu(false);
        };
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    // ---------- Handle logout ----------
    const handleLogout = async () => {
        const prevRole = user?.role;
        await logout();
        if (prevRole === "canteenOwner") navigate("/partner-with-us", { replace: true });
        else navigate("/", { replace: true });
    };

    // ---------- Logo link logic ----------
    const getLogoLink = () => {
        if (user?.role === "canteenOwner") return "/partner-with-us";
        if (user?.role === "admin" || user?.role === "student") return "/";
        return location.pathname.includes("partner-with-us") ? "/partner-with-us" : "/";
    };

    // ---------- Signup user type ----------
    const signupUserType = location.pathname.includes("partner-with-us")
        ? "canteenOwner"
        : "student";

    // ---------- Structured data ----------
    const navStructuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: [
            { "@type": "SiteNavigationElement", position: 1, name: "Home", url: "https://kantevo.com/" },
        ],
    };

    return (
        <>
            <Helmet>
                <script type="application/ld+json">{JSON.stringify(navStructuredData)}</script>
            </Helmet>

            <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    {/* Logo */}
                    <Link to={getLogoLink()} className="flex items-center gap-2">
                        <span className="text-2xl font-extrabold tracking-tight">
                            Kantevo{" "}
                            {(user?.role === "canteenOwner" || location.pathname.includes("partner-with-us")) && (
                                <span className="text-primary">Partner</span>
                            )}
                        </span>
                    </Link>

                    {/* Right Section */}
                    <div className="flex items-center gap-3">
                        {!user ? (
                            <>
                                <button
                                    ref={loginInitialFocusRef}
                                    onClick={() => setShowLogin(true)}
                                    className="px-4 py-2 rounded-full border border-text/20 hover:border-primary transition hover:shadow-sm text-sm"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => setShowSignup(true)}
                                    className="px-4 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition text-sm"
                                >
                                    Sign Up
                                </button>
                            </>
                        ) : (
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setOpenMenu((v) => !v)}
                                    className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 px-2 py-1 hover:shadow-sm"
                                >
                                    <img
                                        src={
                                            user.profilePicture ||
                                            `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(
                                                user.name || "user"
                                            )}`
                                        }
                                        alt="avatar"
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                    <span className="text-sm font-medium">{shortName(user.name)}</span>
                                    <svg className="h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M5.5 7.5l4.5 4.5 4.5-4.5" />
                                    </svg>
                                </button>

                                {openMenu && (
                                    <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-gray-200 dark:border-gray-700 bg-background shadow-lg overflow-hidden">
                                        {/* Profile */}
                                        <Link
                                            to={
                                                user.role === "student"
                                                    ? "/student/profile"
                                                    : user.role === "canteenOwner"
                                                    ? "/canteen/profile"
                                                    : "/admin/colleges"
                                            }
                                            className="block px-4 py-2 text-sm hover:bg-primary/10"
                                            onClick={() => setOpenMenu(false)}
                                        >
                                            Profile
                                        </Link>

                                        {/* Student Links */}
                                        {user.role === "student" && (
                                            <>
                                                <Link
                                                    to="/student/home"
                                                    className="block px-4 py-2 text-sm hover:bg-primary/10"
                                                    onClick={() => setOpenMenu(false)}
                                                >
                                                    Browse Canteens
                                                </Link>
                                                <Link
                                                    to="/student/cart"
                                                    className="block px-4 py-2 text-sm hover:bg-primary/10"
                                                    onClick={() => setOpenMenu(false)}
                                                >
                                                    Cart
                                                </Link>
                                                <Link
                                                    to="/student/orders"
                                                    className="block px-4 py-2 text-sm hover:bg-primary/10"
                                                    onClick={() => setOpenMenu(false)}
                                                >
                                                    Orders
                                                </Link>
                                            </>
                                        )}

                                        {/* Canteen Owner Links */}
                                        {user.role === "canteenOwner" && (
                                            <>
                                                <Link
                                                    to="/canteen/home"
                                                    className="block px-4 py-2 text-sm hover:bg-primary/10"
                                                    onClick={() => setOpenMenu(false)}
                                                >
                                                    Dashboard
                                                </Link>
                                                <Link
                                                    to="/canteen/items"
                                                    className="block px-4 py-2 text-sm hover:bg-primary/10"
                                                    onClick={() => setOpenMenu(false)}
                                                >
                                                    Manage Items
                                                </Link>
                                                <Link
                                                    to="/canteen/orders"
                                                    className="block px-4 py-2 text-sm hover:bg-primary/10"
                                                    onClick={() => setOpenMenu(false)}
                                                >
                                                    Orders
                                                </Link>
                                            </>
                                        )}

                                        {/* Admin Links */}
                                        {user.role === "admin" && (
                                            <>
                                                <Link
                                                    to="/admin/colleges"
                                                    className="block px-4 py-2 text-sm hover:bg-primary/10"
                                                    onClick={() => setOpenMenu(false)}
                                                >
                                                    Colleges
                                                </Link>
                                                <Link
                                                    to="/admin/canteens"
                                                    className="block px-4 py-2 text-sm hover:bg-primary/10"
                                                    onClick={() => setOpenMenu(false)}
                                                >
                                                    Canteens
                                                </Link>
                                                <Link
                                                    to="/admin/orders"
                                                    className="block px-4 py-2 text-sm hover:bg-primary/10"
                                                    onClick={() => setOpenMenu(false)}
                                                >
                                                    Orders
                                                </Link>
                                            </>
                                        )}

                                        {/* Common */}
                                        <Link
                                            to="/settings"
                                            className="block px-4 py-2 text-sm hover:bg-primary/10"
                                            onClick={() => setOpenMenu(false)}
                                        >
                                            Settings
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* ---------- Auth Modals ---------- */}
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
                    userType={signupUserType}
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
                    }}
                    mode="signup"
                />
            )}
        </>
    );
};

export default Navbar;
