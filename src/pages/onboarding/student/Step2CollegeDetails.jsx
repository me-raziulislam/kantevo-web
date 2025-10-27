// Step2CollegeDetails.jsx
// Prefills saved data & saves only when clicking "Next"

import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

const Step2CollegeDetails = () => {
    const { saveOnboardingProgress, api, user } = useAuth();
    const { setFormValidity, setHandleStepNext } = useOutletContext();

    const [colleges, setColleges] = useState([]);
    const [collegeId, setCollegeId] = useState(user?.college?._id || user?.college || "");
    const [rollNo, setRollNo] = useState(user?.rollNo || "");
    const [error, setError] = useState("");

    const valid = collegeId && rollNo;

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
        setFormValidity((prev) => ({ ...prev, step2: valid }));
    }, [valid]);

    useEffect(() => {
        setHandleStepNext(() => async () => {
            if (!valid) return false;
            try {
                await saveOnboardingProgress(2, { college: collegeId, rollNo });
                setError("");
                return true;
            } catch (err) {
                const msg = err.response?.data?.message || "Failed to save college details.";
                setError(msg);
                return false;
            }
        });
    }, [collegeId, rollNo]);

    return (
        <div className="space-y-5">
            <h2 className="text-2xl font-extrabold">College details</h2>
            <p className="text-text/70">Select your college and enter your roll number.</p>

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

            <input
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-background"
                placeholder="Roll number"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value.toUpperCase())}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
};

export default Step2CollegeDetails;
