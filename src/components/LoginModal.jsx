// components/LoginModal.jsx
// Premium passwordless login with OTP

import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { EnvelopeIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
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

    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (!email) return toast.error("Please enter your email.");
        setBusy(true);

        try {
            const res = await sendLoginOTP(email);
            if (res.success) {
                setShowOTPModal(true);
                setCooldown(60);
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

    const handleVerified = () => {
        setShowOTPModal(false);
        onClose();

        if (hasCompletedOnboarding(user)) {
            if (user.role === "canteenOwner") navigate("/canteen/home");
            else navigate("/student/home");
        } else {
            navigate(`/onboarding/${user?.role}`);
        }
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Welcome back"
                subtitle="Enter your email to receive a login code"
                initialFocusRef={emailRef}
            >
                <form onSubmit={handleSendOTP} className="space-y-5">
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Email address
                        </label>
                        <div className="relative">
                            <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                            <input
                                ref={emailRef}
                                type="email"
                                placeholder="you@example.com"
                                className="input input-with-icon"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={busy || cooldown > 0}
                        className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {busy ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Sending...
                            </>
                        ) : cooldown > 0 ? (
                            `Resend in ${cooldown}s`
                        ) : (
                            <>
                                Continue
                                <ArrowRightIcon className="w-4 h-4" />
                            </>
                        )}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4">
                        <span className="h-px flex-1 bg-border" />
                        <span className="text-xs text-text-muted uppercase tracking-wide">or</span>
                        <span className="h-px flex-1 bg-border" />
                    </div>

                    {/* Signup prompt */}
                    <p className="text-sm text-center text-text-secondary">
                        New to Kantevo?{" "}
                        <button
                            type="button"
                            className="text-primary font-medium hover:underline"
                            onClick={onOpenSignup}
                        >
                            Create an account
                        </button>
                    </p>
                </form>
            </Modal>

            {/* OTP Modal */}
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
