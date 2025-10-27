// components/OTPModal.jsx
// Unified OTP verification for both signup and login.
// Includes 60-second resend cooldown to prevent abuse.
// UPDATED: after signup verification -> go directly to onboarding step1 based on user.role.

import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
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
            setTimeout(() => inputsRef.current[0]?.focus(), 50);
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

    const code = digits.join("");

    // ---------- Verify OTP ----------
    const verify = async (e) => {
        e.preventDefault();
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

                // NEW: redirect to onboarding directly after signup flow
                if (mode !== "login") {
                    const role = (result.user?.role || user?.role);
                    const base = role === "canteenOwner" ? "canteen" : "student";
                    navigate(`/onboarding/${base}/step1`, { replace: true });
                }
            }
        } catch {
            toast.error("Invalid or expired OTP.");
        } finally {
            setBusy(false);
        }
    };

    // ---------- Resend OTP ----------
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
        <Modal isOpen={isOpen} onClose={onClose} title="Verify OTP" size="sm">
            <form onSubmit={verify} className="space-y-5">
                <p className="text-sm text-text/70">
                    We’ve sent a 6-digit code to <span className="font-medium">{email}</span>.
                </p>

                {/* OTP Inputs */}
                <div className="flex items-center justify-between gap-2">
                    {digits.map((d, i) => (
                        <input
                            key={i}
                            ref={(el) => (inputsRef.current[i] = el)}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={d}
                            onChange={(e) => onChangeDigit(i, e.target.value)}
                            onKeyDown={(e) => onKeyDown(i, e)}
                            className="w-11 h-12 text-center text-lg font-semibold rounded-lg border border-gray-300 dark:border-gray-600 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    ))}
                </div>

                {/* Verify Button */}
                <button
                    type="submit"
                    disabled={busy}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition"
                >
                    {busy ? "Verifying..." : "Verify"}
                </button>

                {/* Resend OTP */}
                <div className="text-center text-sm">
                    Didn’t get the code?{" "}
                    <button
                        type="button"
                        disabled={resendBusy || cooldown > 0}
                        onClick={resend}
                        className="text-primary hover:underline disabled:opacity-60"
                    >
                        Resend OTP{cooldown > 0 ? ` (${cooldown}s)` : ""}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default OTPModal;
