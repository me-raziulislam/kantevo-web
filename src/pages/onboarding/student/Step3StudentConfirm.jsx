// Step3StudentConfirm.jsx
// Premium confirmation step

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircleIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../../context/AuthContext";

const Step3StudentConfirm = () => {
    const { completeOnboarding, user } = useAuth();
    const navigate = useNavigate();

    const finish = async () => {
        await completeOnboarding();
        navigate("/student/home", { replace: true });
    };

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center"
            >
                <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircleIcon className="w-10 h-10 text-success" />
                </div>
                <h2 className="text-2xl font-bold mb-2">You're All Set!</h2>
                <p className="text-text-secondary">
                    Your profile is complete. You can now browse canteen menus and place orders.
                </p>
            </motion.div>

            {/* Summary Card */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="card-flat p-6"
            >
                <h3 className="font-semibold mb-4">Profile Summary</h3>
                <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-text-muted">Name</span>
                        <span className="font-medium">{user?.name || "-"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-text-muted">Email</span>
                        <span className="font-medium">{user?.email || "-"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-text-muted">Phone</span>
                        <span className="font-medium">{user?.phone || "-"}</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-text-muted">Roll Number</span>
                        <span className="font-medium">{user?.rollNo || "-"}</span>
                    </div>
                </div>
            </motion.div>

            {/* CTA */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-center"
            >
                <button
                    onClick={finish}
                    className="btn-primary px-8 py-4 text-base flex items-center gap-2 mx-auto"
                >
                    <RocketLaunchIcon className="w-5 h-5" />
                    Start Ordering
                </button>
                <p className="text-sm text-text-muted mt-4">
                    You can update your profile anytime from settings
                </p>
            </motion.div>
        </div>
    );
};

export default Step3StudentConfirm;
