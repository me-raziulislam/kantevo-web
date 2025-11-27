// components/SignupModal.jsx
// Premium signup with role selection and OTP verification

import { useState } from "react";
import { toast } from "react-toastify";
import { UserIcon, EnvelopeIcon, ArrowRightIcon, AcademicCapIcon, BuildingStorefrontIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import Modal from "./Modal";

const roleOptions = [
    {
        key: "student",
        label: "Student",
        description: "Order food from your canteen",
        icon: AcademicCapIcon,
    },
    {
        key: "canteenOwner",
        label: "Canteen Owner",
        description: "Manage your canteen digitally",
        icon: BuildingStorefrontIcon,
    },
];

const SignupModal = ({ isOpen, onClose, onOTPSent, userType = "student", onOpenLogin }) => {
    const { registerUser } = useAuth();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [agree, setAgree] = useState(false);
    const [busy, setBusy] = useState(false);
    const [role, setRole] = useState(userType);

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
                onOTPSent?.(email);
            }
        } catch {
            toast.error("Something went wrong while sending OTP.");
        } finally {
            setBusy(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create your account"
            subtitle="Join Kantevo and start ordering smarter"
        >
            <form onSubmit={handleCreateAccount} className="space-y-5">
                {/* Role Toggle */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-3">
                        I am a
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {roleOptions.map((opt) => (
                            <button
                                key={opt.key}
                                type="button"
                                onClick={() => setRole(opt.key)}
                                className={`relative p-4 rounded-xl border-2 text-left transition-all ${role === opt.key
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                    }`}
                                aria-pressed={role === opt.key}
                            >
                                <opt.icon className={`w-6 h-6 mb-2 ${role === opt.key ? "text-primary" : "text-text-muted"}`} />
                                <p className={`font-semibold text-sm ${role === opt.key ? "text-primary" : "text-text"}`}>
                                    {opt.label}
                                </p>
                                <p className="text-xs text-text-muted mt-0.5">{opt.description}</p>
                                {role === opt.key && (
                                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Full Name */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        Full name
                    </label>
                    <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                        <input
                            type="text"
                            placeholder="John Doe"
                            className="input input-with-icon"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        Email address
                    </label>
                    <div className="relative">
                        <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                        <input
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

                {/* Terms & Conditions */}
                <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-0.5">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={agree}
                            onChange={(e) => setAgree(e.target.checked)}
                        />
                        <div className={`w-5 h-5 rounded-md border-2 transition-all ${agree
                            ? "bg-primary border-primary"
                            : "border-border group-hover:border-primary/50"
                            }`}>
                            {agree && (
                                <svg className="w-full h-full text-white p-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                    </div>
                    <span className="text-sm text-text-secondary leading-relaxed">
                        I agree to Kantevo's{" "}
                        <a href="/terms-of-service" className="text-primary hover:underline">Terms of Service</a> and{" "}
                        <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>
                    </span>
                </label>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={busy}
                    className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {busy ? (
                        <>
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Creating account...
                        </>
                    ) : (
                        <>
                            Create account
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

                {/* Login Link */}
                <p className="text-sm text-center text-text-secondary">
                    Already have an account?{" "}
                    <button
                        type="button"
                        className="text-primary font-medium hover:underline"
                        onClick={() => {
                            onClose?.();
                            onOpenLogin?.();
                        }}
                    >
                        Sign in
                    </button>
                </p>
            </form>
        </Modal>
    );
};

export default SignupModal;
