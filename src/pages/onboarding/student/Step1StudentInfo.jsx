// Step1StudentInfo.jsx
// Prefills saved data, keeps state persistent between navigation

import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const Step1StudentInfo = () => {
    const { saveOnboardingProgress, user } = useAuth();
    const { setFormValidity, setHandleStepNext } = useOutletContext();

    const [phone, setPhone] = useState(user?.phone || "");
    const isValidPhone = /^[0-9]{10}$/.test(phone);

    // Update validity
    useEffect(() => {
        setFormValidity((prev) => ({ ...prev, step1: isValidPhone }));
    }, [isValidPhone]);

    // Save automatically when valid
    useEffect(() => {
        if (isValidPhone && phone !== user?.phone) {
            saveOnboardingProgress(1, { phone });
        }
    }, [phone]);

    // No manual handler (auto-save)
    useEffect(() => setHandleStepNext(null), []);

    return (
        <div className="space-y-5">
            <h2 className="text-2xl font-extrabold">Student information</h2>
            <p className="text-text/70">Please confirm your basic details to get started.</p>

            <input
                value={user?.name || ""}
                readOnly
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 cursor-not-allowed"
            />

            <input
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-background"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                maxLength={10}
            />

            {!isValidPhone && phone.length > 0 && (
                <p className="text-red-500 text-sm">Phone number must be 10 digits</p>
            )}
        </div>
    );
};

export default Step1StudentInfo;
