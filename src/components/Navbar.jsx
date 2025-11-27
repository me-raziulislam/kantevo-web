// src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { Helmet } from "@dr.pogodin/react-helmet";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import OTPModal from "./OTPModal";
import {
    UserCircleIcon,
    HomeIcon,
    ShoppingCartIcon,
    ClipboardDocumentListIcon,
    Cog6ToothIcon,
    ArrowRightStartOnRectangleIcon,
    BuildingStorefrontIcon,
    ChartBarIcon,
    CurrencyDollarIcon,
    UserGroupIcon,
    Bars3Icon,
    XMarkIcon,
    PlusCircleIcon,
    BanknotesIcon,
} from "@heroicons/react/24/outline";

const shortName = (full = "") => {
    if (!full.trim()) return "";
    const parts = full.trim().split(/\s+/);
    if (parts.length === 1) return parts[0];
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // ---------- Scroll state for navbar background ----------
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const onDoc = (e) => {
            if (!menuRef.current) return;
            if (!menuRef.current.contains(e.target)) setOpenMenu(false);
        };
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

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

    const isPartnerPage = user?.role === "canteenOwner" || location.pathname.includes("partner-with-us");

    // ---------- Menu items based on role ----------
    const getMenuItems = () => {
        if (!user) return [];

        const baseItems = [
            {
                label: "Profile",
                icon: UserCircleIcon,
                to: user.role === "student" ? "/student/profile" : user.role === "canteenOwner" ? "/canteen/profile" : "/admin/colleges",
            },
        ];

        if (user.role === "student") {
            return [
                ...baseItems,
                { label: "Browse Canteens", icon: HomeIcon, to: "/student/home" },
                { label: "Cart", icon: ShoppingCartIcon, to: "/student/cart" },
                { label: "Orders", icon: ClipboardDocumentListIcon, to: "/student/orders" },
            ];
        }

        if (user.role === "canteenOwner") {
            return [
                ...baseItems,
                { label: "Dashboard", icon: ChartBarIcon, to: "/canteen/home" },
                { label: "Manage Items", icon: BuildingStorefrontIcon, to: "/canteen/items" },
                { label: "Manage Orders", icon: ClipboardDocumentListIcon, to: "/canteen/orders" },
                { label: "Settlements", icon: CurrencyDollarIcon, to: "/canteen/settlements" },
            ];
        }

        if (user.role === "admin") {
            return [
                ...baseItems,
                { label: "Colleges", icon: BuildingStorefrontIcon, to: "/admin/colleges" },
                { label: "Canteens", icon: UserGroupIcon, to: "/admin/canteens" },
                { label: "Orders", icon: ClipboardDocumentListIcon, to: "/admin/orders" },
                { label: "Create Settlement", icon: PlusCircleIcon, to: "/admin/settlements-create" },
                { label: "Settlements", icon: BanknotesIcon, to: "/admin/settlements" },
            ];
        }

        return baseItems;
    };

    // ---------- Structured data ----------
    const navStructuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: [
            { "@type": "SiteNavigationElement", position: 1, name: "Home", url: "https://kantevo.com/" },
        ],
    };

    const dropdownVariants = {
        hidden: { opacity: 0, scale: 0.95, y: -10 },
        visible: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: -10 },
    };

    return (
        <>
            <Helmet>
                <script type="application/ld+json">{JSON.stringify(navStructuredData)}</script>
            </Helmet>

            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-background-elevated/80 backdrop-blur-xl shadow-sm border-b border-border"
                    : "bg-transparent"
                    }`}
            >
                <div className="container-app">
                    <div className="flex items-center justify-between h-16 md:h-18">
                        {/* Logo */}
                        <Link to={getLogoLink()} className="flex items-center gap-2 group">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                                <span className="text-white font-bold text-lg">K</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight">
                                Kantevo
                                {isPartnerPage && (
                                    <span className="text-primary ml-1">Partner</span>
                                )}
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-2">
                            {!user ? (
                                <>
                                    <button
                                        ref={loginInitialFocusRef}
                                        onClick={() => setShowLogin(true)}
                                        className="px-5 py-2.5 rounded-xl font-medium text-text hover:text-primary hover:bg-primary/5 transition-all"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => setShowSignup(true)}
                                        className="btn-primary px-5 py-2.5 text-sm"
                                    >
                                        Get Started
                                    </button>
                                </>
                            ) : (
                                <div className="relative" ref={menuRef}>
                                    <button
                                        onClick={() => setOpenMenu((v) => !v)}
                                        className={`flex items-center gap-3 rounded-xl px-3 py-2 transition-all ${openMenu
                                            ? "bg-primary/10"
                                            : "hover:bg-background-subtle"
                                            }`}
                                    >
                                        <img
                                            src={
                                                user.profilePicture ||
                                                `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(
                                                    user.name || "user"
                                                )}`
                                            }
                                            alt="avatar"
                                            className="h-9 w-9 rounded-full object-cover ring-2 ring-border"
                                        />
                                        <div className="text-left hidden lg:block">
                                            <p className="text-sm font-semibold leading-tight">{shortName(user.name)}</p>
                                            <p className="text-xs text-text-muted capitalize">{user.role === "canteenOwner" ? "Partner" : user.role}</p>
                                        </div>
                                        <svg
                                            className={`h-4 w-4 text-text-muted transition-transform ${openMenu ? "rotate-180" : ""}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    <AnimatePresence>
                                        {openMenu && (
                                            <motion.div
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                variants={dropdownVariants}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-background-elevated shadow-xl overflow-hidden"
                                            >
                                                {/* User Info Header */}
                                                <div className="px-4 py-3 border-b border-border bg-background-subtle/50">
                                                    <p className="font-semibold text-sm">{user.name}</p>
                                                    <p className="text-xs text-text-muted">{user.email}</p>
                                                </div>

                                                {/* Menu Items */}
                                                <div className="py-2">
                                                    {getMenuItems().map((item) => (
                                                        <Link
                                                            key={item.label}
                                                            to={item.to}
                                                            className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-primary/5 text-text-secondary hover:text-primary transition-colors"
                                                            onClick={() => setOpenMenu(false)}
                                                        >
                                                            <item.icon className="w-5 h-5" />
                                                            {item.label}
                                                        </Link>
                                                    ))}
                                                </div>

                                                {/* Settings & Logout */}
                                                <div className="border-t border-border py-2">
                                                    {/* <Link
                                                        to="/settings"
                                                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-primary/5 text-text-secondary hover:text-primary transition-colors"
                                                        onClick={() => setOpenMenu(false)}
                                                    >
                                                        <Cog6ToothIcon className="w-5 h-5" />
                                                        Settings
                                                    </Link> */}
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error/5 transition-colors"
                                                    >
                                                        <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
                                                        Logout
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            <div className="ml-2 pl-2 border-l border-border">
                                <ThemeToggle />
                            </div>
                        </nav>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center gap-2 md:hidden">
                            <ThemeToggle />
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 rounded-xl hover:bg-background-subtle transition-colors"
                            >
                                {mobileMenuOpen ? (
                                    <XMarkIcon className="w-6 h-6" />
                                ) : (
                                    <Bars3Icon className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden border-t border-border bg-background-elevated/95 backdrop-blur-xl"
                        >
                            <div className="container-app py-4">
                                {!user ? (
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => {
                                                setMobileMenuOpen(false);
                                                setShowLogin(true);
                                            }}
                                            className="w-full py-3 rounded-xl font-medium text-text hover:bg-background-subtle transition-colors"
                                        >
                                            Login
                                        </button>
                                        <button
                                            onClick={() => {
                                                setMobileMenuOpen(false);
                                                setShowSignup(true);
                                            }}
                                            className="w-full btn-primary py-3"
                                        >
                                            Get Started
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {/* User Info */}
                                        <div className="flex items-center gap-3 px-3 py-3 mb-3 bg-background-subtle rounded-xl">
                                            <img
                                                src={
                                                    user.profilePicture ||
                                                    `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(
                                                        user.name || "user"
                                                    )}`
                                                }
                                                alt="avatar"
                                                className="h-12 w-12 rounded-full object-cover ring-2 ring-border"
                                            />
                                            <div>
                                                <p className="font-semibold">{user.name}</p>
                                                <p className="text-sm text-text-muted">{user.email}</p>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        {getMenuItems().map((item) => (
                                            <Link
                                                key={item.label}
                                                to={item.to}
                                                className="flex items-center gap-3 px-3 py-3 rounded-xl text-text-secondary hover:bg-primary/5 hover:text-primary transition-colors"
                                            >
                                                <item.icon className="w-5 h-5" />
                                                {item.label}
                                            </Link>
                                        ))}

                                        <div className="border-t border-border my-2 pt-2">
                                            <Link
                                                to="/settings"
                                                className="flex items-center gap-3 px-3 py-3 rounded-xl text-text-secondary hover:bg-primary/5 hover:text-primary transition-colors"
                                            >
                                                <Cog6ToothIcon className="w-5 h-5" />
                                                Settings
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-error hover:bg-error/5 transition-colors"
                                            >
                                                <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Spacer for fixed navbar */}
            <div className="h-16 md:h-18" />

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
