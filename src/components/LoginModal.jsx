// components/LoginModal.jsx
// Updated to passwordless login flow (email + OTP).
// Keeps same UI but removes password field and adds 60s resend cooldown.

import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { FaEnvelope } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import OTPModal from "./OTPModal";

const LoginModal = ({ isOpen, onClose, onOpenSignup, initialFocusRef }) => {
    const emailRef = initialFocusRef || useRef(null);
    const [email, setEmail] = useState("");
    const [busy, setBusy] = useState(false);
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const { sendLoginOTP, hasCompletedOnboarding, user } = useAuth();
    const navigate = useNavigate();

    // ---------- Handle login OTP request ----------
    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (!email) return toast.error("Please enter your email.");
        setBusy(true);

        try {
            const res = await sendLoginOTP(email);
            if (res.success) {
                setShowOTPModal(true);
                setCooldown(60); // 60s cooldown before re-sending OTP
                const timer = setInterval(() => {
                    setCooldown((c) => {
                        if (c <= 1) clearInterval(timer);
                        return c - 1;
                    });
                }, 1000);
            }
        } catch (err) {
            toast.error("Could not send OTP.");
        } finally {
            setBusy(false);
        }
    };

    // ---------- After OTP verified ----------
    const handleVerified = () => {
        setShowOTPModal(false);
        onClose();

        // Redirect based on user type and onboarding completion
        if (hasCompletedOnboarding(user)) {
            if (user.role === "canteenOwner") navigate("/canteen/home");
            else navigate("/student/home");
        } else {
            // redirect to onboarding flow
            navigate(`/onboarding/${user?.role}`);
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="Login" initialFocusRef={emailRef}>
                <form onSubmit={handleSendOTP} className="space-y-4">
                    {/* Email Field */}
                    <div className="relative">
                        <FaEnvelope className="absolute top-3 left-3 text-text/50" />
                        <input
                            ref={emailRef}
                            type="email"
                            placeholder="Email"
                            className="w-full pl-10 p-3 rounded-lg bg-background text-text border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={busy || cooldown > 0}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition disabled:opacity-70"
                    >
                        {busy ? "Sending OTP..." : cooldown > 0 ? `Resend in ${cooldown}s` : "Send OTP"}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-2">
                        <span className="h-px flex-1 bg-text/10" />
                        <span className="text-xs text-text/60">or</span>
                        <span className="h-px flex-1 bg-text/10" />
                    </div>

                    {/* Signup prompt */}
                    <p className="text-sm text-center">
                        New to Kantevo?{" "}
                        <button
                            type="button"
                            className="text-primary hover:underline"
                            onClick={onOpenSignup}
                        >
                            Create account
                        </button>
                    </p>
                </form>
            </Modal>

            {/* OTP Modal for login verification */}
            {showOTPModal && (
                <OTPModal
                    isOpen={showOTPModal}
                    onClose={() => setShowOTPModal(false)}
                    email={email}
                    onVerified={handleVerified}
                    mode="login"
                />
            )}
        </>
    );
};

export default LoginModal;
