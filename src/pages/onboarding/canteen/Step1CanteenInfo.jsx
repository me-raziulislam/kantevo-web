// Step1CanteenInfo.jsx
// ✅ Validates phone + college selection, disables Next until valid
// ✅ Prefills saved data from user
// ✅ Name readonly (taken during signup)

import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

const Step1CanteenInfo = () => {
    const { saveOnboardingProgress, api, user } = useAuth();
    const { setFormValidity, setHandleStepNext } = useOutletContext();

    const [phone, setPhone] = useState(user?.phone || "");
    const [collegeId, setCollegeId] = useState(user?.college?._id || user?.college || "");
    const [colleges, setColleges] = useState([]);
    const isValidPhone = /^[0-9]{10}$/.test(phone);
    const valid = isValidPhone && !!collegeId;

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get("/colleges");
                setColleges(res.data || []);
            } catch {
                setColleges([]);
            }
        })();
    }, []);

    useEffect(() => {
        setFormValidity((prev) => ({ ...prev, step1: valid }));
    }, [valid, setFormValidity]);

    // ✅ Save only when Next is clicked (to mirror student step2)
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
        <div className="space-y-5">
            <h2 className="text-2xl font-extrabold">Canteen Owner information</h2>
            <p className="text-text/70">Please provide your contact details and college.</p>

            {/* Readonly Name from Signup */}
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

            <select
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-background"
                value={collegeId}
                onChange={(e) => setCollegeId(e.target.value)}
            >
                <option value="">Select your college</option>
                {colleges.map((c) => (
                    <option key={c._id} value={c._id}>
                        {c.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Step1CanteenInfo;
