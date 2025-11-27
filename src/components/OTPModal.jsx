// components/OTPModal.jsx
// Premium OTP verification modal with auto-focus and animations

import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ShieldCheckIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import Modal from "./Modal";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const OTPModal = ({ isOpen, onClose, email, onVerified, mode = "signup" }) => {
    const { verifyEmailOTP, verifyLoginOTP, api, user } = useAuth();
    const inputsRef = useRef([]);
    const [digits, setDigits] = useState(["", "", "", "", "", ""]);
    const [busy, setBusy] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [resendBusy, setResendBusy] = useState(false);
    const navigate = useNavigate();

    // Focus the first input when opened
    useEffect(() => {
        if (isOpen) {
            setDigits(["", "", "", "", "", ""]);
            setTimeout(() => inputsRef.current[0]?.focus(), 100);
        }
    }, [isOpen]);

    const onChangeDigit = (idx, val) => {
        if (!/^\d?$/.test(val)) return;
        const copy = [...digits];
        copy[idx] = val;
        setDigits(copy);
        if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
    };

    const onKeyDown = (idx, e) => {
        if (e.key === "Backspace" && !digits[idx] && idx > 0) {
            inputsRef.current[idx - 1]?.focus();
        }
    };

    // Handle paste
    const onPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length === 6) {
            setDigits(pasted.split(""));
            inputsRef.current[5]?.focus();
        }
    };

    const code = digits.join("");

    // Auto-submit when all 6 digits are entered
    useEffect(() => {
        if (code.length === 6 && !busy) {
            handleVerify();
        }
    }, [code]);

    const handleVerify = async (e) => {
        e?.preventDefault();
        if (code.length !== 6) {
            toast.error("Please enter the 6-digit OTP.");
            return;
        }
        setBusy(true);
        try {
            const result =
                mode === "login"
                    ? await verifyLoginOTP(email, code)
                    : await verifyEmailOTP(email, code);

            if (result.success) {
                onVerified?.();

                if (mode !== "login") {
                    const role = result.user?.role || user?.role;
                    const base = role === "canteenOwner" ? "canteen" : "student";
                    navigate(`/onboarding/${base}/step1`, { replace: true });
                }
            }
        } catch {
            toast.error("Invalid or expired OTP.");
            setDigits(["", "", "", "", "", ""]);
            inputsRef.current[0]?.focus();
        } finally {
            setBusy(false);
        }
    };

    const resend = async () => {
        if (cooldown > 0 || resendBusy) return;
        setResendBusy(true);
        try {
            await api.post("/auth/resend-email-otp", { email });
            toast.success("OTP sent again.");
            setCooldown(60);
            const timer = setInterval(() => {
                setCooldown((c) => {
                    if (c <= 1) clearInterval(timer);
                    return c - 1;
                });
            }, 1000);
        } catch (err) {
            const msg = err.response?.data?.msg || "Please wait before requesting a new OTP.";
            toast.error(msg);
        } finally {
            setResendBusy(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Verify your email"
            size="sm"
        >
            <form onSubmit={handleVerify} className="space-y-6">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <ShieldCheckIcon className="w-8 h-8 text-primary" />
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-text-secondary text-center">
                    We've sent a 6-digit code to{" "}
                    <span className="font-medium text-text">{email}</span>
                </p>

                {/* OTP Inputs */}
                <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={onPaste}>
                    {digits.map((d, i) => (
                        <motion.input
                            key={i}
                            ref={(el) => (inputsRef.current[i] = el)}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={d}
                            onChange={(e) => onChangeDigit(i, e.target.value)}
                            onKeyDown={(e) => onKeyDown(i, e)}
                            className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border-2 bg-background transition-all focus:outline-none ${d
                                    ? "border-primary bg-primary/5"
                                    : "border-border focus:border-primary"
                                }`}
                        />
                    ))}
                </div>

                {/* Verify Button */}
                <button
                    type="submit"
                    disabled={busy || code.length !== 6}
                    className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {busy ? (
                        <>
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Verifying...
                        </>
                    ) : (
                        "Verify & Continue"
                    )}
                </button>

                {/* Resend OTP */}
                <div className="text-center">
                    <p className="text-sm text-text-muted mb-2">Didn't receive the code?</p>
                    <button
                        type="button"
                        disabled={resendBusy || cooldown > 0}
                        onClick={resend}
                        className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {resendBusy ? (
                            <>
                                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                                Sending...
                            </>
                        ) : cooldown > 0 ? (
                            `Resend in ${cooldown}s`
                        ) : (
                            <>
                                <ArrowPathIcon className="w-4 h-4" />
                                Resend OTP
                            </>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default OTPModal;
