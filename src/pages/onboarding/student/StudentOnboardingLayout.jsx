// pages/onboarding/student/StudentOnboardingLayout.jsx
// Fixed: "Next" now triggers save explicitly (no auto-save during typing).
// Uses framer-motion for transitions, keeps existing design same.

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import ScreenTransition from "../../../components/ScreenTransition";

const steps = [
    { key: "step1", title: "Student information" },
    { key: "step2", title: "College details" },
    { key: "step3", title: "Confirm & finish" },
];

const StudentOnboardingLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [busy, setBusy] = useState(false);
    const [formValidity, setFormValidity] = useState({ step1: false, step2: false });
    const [handleStepNext, setHandleStepNext] = useState(null); // step-specific save handler

    const currentKey = location.pathname.split("/").pop() || "step1";
    const activeIndex = Math.max(0, steps.findIndex((s) => s.key === currentKey));

    // mimic Zomato: blur + spinner between steps
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
        activeIndex === 2; // last step always active

    const handleNextClick = async () => {
        if (handleStepNext) {
            const ok = await handleStepNext(); // run the step’s own save logic
            if (!ok) return; // if save failed, stop
        }
        goToStep(activeIndex + 1);
    };

    return (
        <div className="min-h-[calc(100vh-56px)] bg-background text-text">
            <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-[320px,1fr] gap-8">
                {/* Left stepper */}
                <aside className="bg-background-card border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
                    <h3 className="text-lg font-semibold mb-4">Complete your registration</h3>
                    <ol className="space-y-4">
                        {steps.map((s, i) => {
                            const done = i < activeIndex;
                            const active = i === activeIndex;
                            return (
                                <li key={s.key} className="flex items-start gap-3">
                                    <span
                                        className={`mt-1 inline-flex h-6 w-6 rounded-full items-center justify-center text-xs font-bold ${done
                                            ? "bg-primary text-white"
                                            : active
                                                ? "border-2 border-primary text-primary"
                                                : "border border-gray-300 dark:border-gray-600 text-text/70"
                                            }`}
                                    >
                                        {done ? "✓" : i + 1}
                                    </span>
                                    <div className="flex-1">
                                        <div className="font-medium">{s.title}</div>
                                        {active && (
                                            <div className="text-xs text-text/60">Continue ▸</div>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                </aside>

                {/* Right content */}
                <section className="bg-background-card border border-gray-200 dark:border-gray-700 rounded-2xl p-6 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentKey}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25 }}
                        >
                            <Outlet
                                context={{
                                    goToStep,
                                    activeIndex,
                                    steps,
                                    setFormValidity,
                                    setHandleStepNext, // pass down so each step can set its handler
                                }}
                            />
                        </motion.div>
                    </AnimatePresence>
                </section>
            </div>

            {/* Fixed bottom bar */}
            <div className="sticky bottom-0 z-10 bg-background/90 backdrop-blur border-t border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="text-sm text-text/70">
                        Step {activeIndex + 1} of {steps.length}
                    </div>
                    <div className="space-x-2">
                        <button
                            onClick={() => goToStep(activeIndex - 1)}
                            disabled={activeIndex === 0}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleNextClick}
                            disabled={!canProceed || activeIndex === steps.length - 1}
                            className="px-5 py-2 rounded-lg bg-primary text-white disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <ScreenTransition show={busy} />
        </div>
    );
};

export default StudentOnboardingLayout;
