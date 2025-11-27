// Step1CanteenInfo.jsx
// Premium canteen owner info step

import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { UserIcon, PhoneIcon, BuildingLibraryIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../../context/AuthContext";

const Step1CanteenInfo = () => {
    const { saveOnboardingProgress, api, user } = useAuth();
    const { setFormValidity, setHandleStepNext } = useOutletContext();

    const [phone, setPhone] = useState(user?.phone || "");
    const [collegeId, setCollegeId] = useState(user?.college?._id || user?.college || "");
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);

    const isValidPhone = /^[0-9]{10}$/.test(phone);
    const valid = isValidPhone && !!collegeId;

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get("/colleges");
                setColleges(res.data || []);
            } catch {
                setColleges([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [api]);

    useEffect(() => {
        setFormValidity((prev) => ({ ...prev, step1: valid }));
    }, [valid, setFormValidity]);

    useEffect(() => {
        setHandleStepNext(() => async () => {
            if (!valid) return false;
            try {
                await saveOnboardingProgress(1, { phone, college: collegeId });
                return true;
            } catch {
                return false;
            }
        });
    }, [phone, collegeId, valid, saveOnboardingProgress, setHandleStepNext]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Owner Information</h2>
                <p className="text-text-secondary">
                    Please provide your contact details and select your college.
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

                {/* College Select */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        Select College <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                        <BuildingLibraryIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                        <select
                            className="input input-with-icon appearance-none cursor-pointer"
                            value={collegeId}
                            onChange={(e) => setCollegeId(e.target.value)}
                            disabled={loading}
                        >
                            <option value="">
                                {loading ? "Loading colleges..." : "Select your college"}
                            </option>
                            {colleges.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info card */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-sm text-text-secondary">
                    <span className="font-medium text-primary">Note:</span>{" "}
                    Make sure to select the correct college where your canteen is located.
                </p>
            </div>
        </div>
    );
};

export default Step1CanteenInfo;
