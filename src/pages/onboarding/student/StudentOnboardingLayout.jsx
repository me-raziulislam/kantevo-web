// pages/onboarding/student/StudentOnboardingLayout.jsx
// Premium student onboarding layout with modern design

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../../../context/AuthContext";
import ScreenTransition from "../../../components/ScreenTransition";

const steps = [
    { key: "step1", title: "Student information", description: "Your basic details" },
    { key: "step2", title: "College details", description: "Select your college" },
    { key: "step3", title: "Confirm & finish", description: "Review and complete" },
];

const StudentOnboardingLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [busy, setBusy] = useState(false);
    const [formValidity, setFormValidity] = useState({ step1: false, step2: false });
    const [handleStepNext, setHandleStepNext] = useState(null);

    const currentKey = location.pathname.split("/").pop() || "step1";
    const activeIndex = Math.max(0, steps.findIndex((s) => s.key === currentKey));

    const goToStep = (idx) => {
        if (idx < 0 || idx >= steps.length) return;
        setBusy(true);
        setTimeout(() => {
            navigate(`/onboarding/student/${steps[idx].key}`, { replace: false });
            setBusy(false);
        }, 450);
    };

    const canProceed =
        (activeIndex === 0 && formValidity.step1) ||
        (activeIndex === 1 && formValidity.step2) ||
        activeIndex === 2;

    const handleNextClick = async () => {
        if (handleStepNext) {
            const ok = await handleStepNext();
            if (!ok) return;
        }
        goToStep(activeIndex + 1);
    };

    return (
        <div className="min-h-screen bg-background text-text">
            <div className="container-app pt-6 pb-8">
                <h1 className="text-xl md:text-2xl font-semibold text-text mb-8">
                    Just a few steps to get started with Kantevo
                </h1>
                <div className="grid lg:grid-cols-[300px,1fr] gap-8">
                    {/* Left Sidebar - Steps */}
                    <aside className="hidden lg:block">
                        <div className="card p-6 sticky top-24">
                            <h3 className="font-semibold text-sm uppercase tracking-wider text-text-muted mb-6">
                                Registration Steps
                            </h3>
                            <ol className="space-y-4">
                                {steps.map((s, i) => {
                                    const done = i < activeIndex;
                                    const active = i === activeIndex;
                                    return (
                                        <li key={s.key} className="flex items-start gap-4">
                                            <div
                                                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all ${done
                                                    ? "bg-success text-white"
                                                    : active
                                                        ? "bg-primary text-white shadow-md"
                                                        : "bg-background-subtle text-text-muted border border-border"
                                                    }`}
                                            >
                                                {done ? <CheckIcon className="w-4 h-4" /> : i + 1}
                                            </div>
                                            <div className="flex-1 pt-1">
                                                <div className={`font-medium ${active ? "text-text" : "text-text-secondary"}`}>
                                                    {s.title}
                                                </div>
                                                <div className="text-xs text-text-muted mt-0.5">
                                                    {s.description}
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ol>
                        </div>
                    </aside>

                    {/* Mobile Steps Indicator */}
                    <div className="lg:hidden mb-6">
                        <div className="flex items-center justify-between mb-4">
                            {steps.map((s, i) => {
                                const done = i < activeIndex;
                                const active = i === activeIndex;
                                return (
                                    <div key={s.key} className="flex items-center">
                                        <div
                                            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${done
                                                ? "bg-success text-white"
                                                : active
                                                    ? "bg-primary text-white"
                                                    : "bg-background-subtle text-text-muted border border-border"
                                                }`}
                                        >
                                            {done ? <CheckIcon className="w-4 h-4" /> : i + 1}
                                        </div>
                                        {i < steps.length - 1 && (
                                            <div className={`w-12 sm:w-20 h-1 mx-2 rounded ${i < activeIndex ? "bg-success" : "bg-border"}`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <p className="text-sm font-medium">{steps[activeIndex].title}</p>
                    </div>

                    {/* Main Content */}
                    <section className="card p-6 md:p-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentKey}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Outlet
                                    context={{
                                        goToStep,
                                        activeIndex,
                                        steps,
                                        setFormValidity,
                                        setHandleStepNext,
                                    }}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </section>
                </div>
            </div>

            {/* Fixed Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-20 bg-background-elevated/95 backdrop-blur-lg border-t border-border">
                <div className="container-app py-3 flex items-center justify-between">
                    <div className="text-sm text-text-muted">
                        Step <span className="font-semibold text-text">{activeIndex + 1}</span> of {steps.length}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => goToStep(activeIndex - 1)}
                            disabled={activeIndex === 0}
                            className="btn-secondary px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleNextClick}
                            disabled={!canProceed || activeIndex === steps.length - 1}
                            className="btn-primary px-5 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>

            {/* Spacer for fixed bottom bar */}
            <div className="h-20" />

            <ScreenTransition show={busy} />
        </div>
    );
};

export default StudentOnboardingLayout;
