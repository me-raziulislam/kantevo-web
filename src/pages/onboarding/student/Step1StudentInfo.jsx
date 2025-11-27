// Step1StudentInfo.jsx
// Premium student info step

import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { UserIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../../context/AuthContext";

const Step1StudentInfo = () => {
    const { saveOnboardingProgress, user } = useAuth();
    const { setFormValidity, setHandleStepNext } = useOutletContext();

    const [phone, setPhone] = useState(user?.phone || "");
    const isValidPhone = /^[0-9]{10}$/.test(phone);

    useEffect(() => {
        setFormValidity((prev) => ({ ...prev, step1: isValidPhone }));
    }, [isValidPhone, setFormValidity]);

    useEffect(() => {
        if (isValidPhone && phone !== user?.phone) {
            saveOnboardingProgress(1, { phone });
        }
    }, [phone, isValidPhone, user?.phone, saveOnboardingProgress]);

    useEffect(() => setHandleStepNext(null), [setHandleStepNext]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Student Information</h2>
                <p className="text-text-secondary">
                    Please confirm your basic details to get started with Kantevo.
                </p>
            </div>

            <div className="space-y-5">
                {/* Name (readonly) */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        Full Name
                    </label>
                    <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                        <input
                            value={user?.name || ""}
                            readOnly
                            className="input input-with-icon bg-background-subtle cursor-not-allowed opacity-70"
                        />
                    </div>
                    <p className="text-xs text-text-muted mt-1.5">
                        Name is taken from your signup and cannot be changed here.
                    </p>
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        Phone Number <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                        <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                        <input
                            className={`input input-with-icon ${!isValidPhone && phone.length > 0 ? "border-error focus:border-error" : ""}`}
                            placeholder="Enter your 10-digit phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                            maxLength={10}
                        />
                    </div>
                    {!isValidPhone && phone.length > 0 && (
                        <p className="text-error text-sm mt-1.5">
                            Please enter a valid 10-digit phone number
                        </p>
                    )}
                </div>
            </div>

            {/* Info card */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-sm text-text-secondary">
                    <span className="font-medium text-primary">Why we need this?</span>
                    <br />
                    Your phone number helps us send order updates and important notifications.
                </p>
            </div>
        </div>
    );
};

export default Step1StudentInfo;
