// components/SignupModal.jsx
// Updated: explicit "I'm a Student / Canteen Owner" toggle so users are never confused.
// After OTP is sent, OTPModal handles verification -> redirects to onboarding (not login).

import { useState } from "react";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import Modal from "./Modal";

const roleOptions = [
    { key: "student", label: "I'm a Student" },
    { key: "canteenOwner", label: "I'm a Canteen Owner" },
];

const SignupModal = ({ isOpen, onClose, onOTPSent, userType = "student", onOpenLogin }) => {
    const { registerUser } = useAuth();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [agree, setAgree] = useState(false);
    const [busy, setBusy] = useState(false);

    // NEW: explicit toggle (defaults from prop)
    const [role, setRole] = useState(userType);

    // ---------- Handle account creation ----------
    const handleCreateAccount = async (e) => {
        e.preventDefault();
        if (!agree) {
            toast.error("Please accept Terms and Privacy Policy.");
            return;
        }
        setBusy(true);
        try {
            const res = await registerUser(fullName, email, role);
            if (res.success) {
                toast.success("OTP sent to your email.");
                onClose?.();
                onOTPSent?.(email); // parent opens OTP modal
            }
        } catch {
            toast.error("Something went wrong while sending OTP.");
        } finally {
            setBusy(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create your Kantevo account">
            <form onSubmit={handleCreateAccount} className="space-y-5">
                {/* Role Toggle (NEW) */}
                <div className="grid grid-cols-2 gap-3">
                    {roleOptions.map((opt) => (
                        <button
                            key={opt.key}
                            type="button"
                            onClick={() => setRole(opt.key)}
                            className={`p-3 rounded-lg border text-sm font-medium transition ${role === opt.key
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-gray-300 dark:border-gray-600 hover:border-primary"
                                }`}
                            aria-pressed={role === opt.key}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {/* Full Name */}
                <div className="relative">
                    <FaUser className="absolute top-3 left-3 text-text/50" />
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full pl-10 p-3 rounded-lg bg-background text-text border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </div>

                {/* Email */}
                <div className="relative">
                    <FaEnvelope className="absolute top-3 left-3 text-text/50" />
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full pl-10 p-3 rounded-lg bg-background text-text border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                </div>

                {/* Terms & Conditions */}
                <label className="flex items-start gap-2 text-sm">
                    <input
                        type="checkbox"
                        className="mt-1"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                    />
                    <span>
                        I agree to Kantevo’s{" "}
                        <a href="/terms-of-use" className="text-primary hover:underline">Terms of Service</a>,{" "}
                        <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>{" "}
                        and Content Policies.
                    </span>
                </label>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={busy}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition"
                >
                    {busy ? "Sending OTP..." : "Create account"}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-2">
                    <span className="h-px flex-1 bg-text/10" />
                    <span className="text-xs text-text/60">or</span>
                    <span className="h-px flex-1 bg-text/10" />
                </div>

                {/* Login Link */}
                <p className="text-sm text-center">
                    Already have an account?{" "}
                    <button
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => {
                            onClose?.(); // close signup modal first
                            onOpenLogin?.(); // then open login modal
                        }}
                    >
                        Login
                    </button>
                </p>
            </form>
        </Modal>
    );
};

export default SignupModal;
