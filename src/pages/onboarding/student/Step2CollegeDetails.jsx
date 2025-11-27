// Step2CollegeDetails.jsx
// Premium college details step

import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { BuildingLibraryIcon, IdentificationIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../../context/AuthContext";

const Step2CollegeDetails = () => {
    const { saveOnboardingProgress, api, user } = useAuth();
    const { setFormValidity, setHandleStepNext } = useOutletContext();

    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
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
            } finally {
                setLoading(false);
            }
        })();
    }, [api]);

    useEffect(() => {
        setFormValidity((prev) => ({ ...prev, step2: valid }));
    }, [valid, setFormValidity]);

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
    }, [collegeId, rollNo, valid, saveOnboardingProgress, setHandleStepNext]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">College Details</h2>
                <p className="text-text-secondary">
                    Select your college to see available canteens and menus.
                </p>
            </div>

            <div className="space-y-5">
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

                {/* Roll Number */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        Roll Number <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                        <IdentificationIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                        <input
                            className="input input-with-icon uppercase"
                            placeholder="Enter your roll number"
                            value={rollNo}
                            onChange={(e) => setRollNo(e.target.value.toUpperCase())}
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-error/10 border border-error/20">
                        <p className="text-sm text-error">{error}</p>
                    </div>
                )}
            </div>

            {/* Info card */}
            <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
                <p className="text-sm text-text-secondary">
                    <span className="font-medium text-accent">Don't see your college?</span>
                    <br />
                    We're expanding rapidly! Contact us at support@kantevo.com to add your college.
                </p>
            </div>
        </div>
    );
};

export default Step2CollegeDetails;
