// Step2MenuDetails.jsx
// Saves full canteen details with special openings/closings (array of dates)
// Disables Next until all required fields valid
// Data persists from user.canteen if available (prefill)

import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

const Step2MenuDetails = () => {
    const { saveOnboardingProgress, user } = useAuth();
    const { setFormValidity, setHandleStepNext } = useOutletContext();

    const existing = user?.canteen || {};
    const [restaurantName, setRestaurantName] = useState(existing?.name || "");
    const [cuisines, setCuisines] = useState(existing?.cuisines || []);
    const [openTime, setOpenTime] = useState(existing?.openingTime || "09:00");
    const [closeTime, setCloseTime] = useState(existing?.closingTime || "18:00");
    const [upiId, setUpiId] = useState(existing?.upiId || "");
    const [specialOpenings, setSpecialOpenings] = useState(
        Array.isArray(existing?.specialOpenings)
            ? existing.specialOpenings.map(d => (typeof d === 'string' ? d.slice(0, 10) : new Date(d).toISOString().slice(0, 10)))
            : []
    );
    const [specialClosings, setSpecialClosings] = useState(
        Array.isArray(existing?.specialClosings)
            ? existing.specialClosings.map(d => (typeof d === 'string' ? d.slice(0, 10) : new Date(d).toISOString().slice(0, 10)))
            : []
    );
    const [isOpenOnSunday, setIsOpenOnSunday] = useState(!!existing?.isOpenOnSunday);
    const [about, setAbout] = useState(existing?.about || '');
    const [error, setError] = useState("");

    const timeOk =
        /^([01]\d|2[0-3]):([0-5]\d)$/.test(openTime) &&
        /^([01]\d|2[0-3]):([0-5]\d)$/.test(closeTime);
    const valid = restaurantName && cuisines.length > 0 && upiId && timeOk;

    const tags = ["North Indian", "South Indian", "Fast Food", "Chinese", "Biryani", "Pizza"];

    const toggleCuisine = (tag) =>
        setCuisines((prev) => (prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]));

    const addDate = (type, value) => {
        if (!value) return;
        if (type === "open" && !specialOpenings.includes(value)) setSpecialOpenings((p) => [...p, value]);
        if (type === "close" && !specialClosings.includes(value)) setSpecialClosings((p) => [...p, value]);
    };

    const removeDate = (type, idx) => {
        if (type === "open") setSpecialOpenings((p) => p.filter((_, i) => i !== idx));
        if (type === "close") setSpecialClosings((p) => p.filter((_, i) => i !== idx));
    };

    useEffect(() => {
        setFormValidity((prev) => ({ ...prev, step2: valid }));
    }, [valid, setFormValidity]);

    // Save only when "Next" is clicked (like student Step2)
    useEffect(() => {
        setHandleStepNext(() => async () => {
            if (!valid) return false;
            try {
                await saveOnboardingProgress(2, {
                    restaurantName,
                    cuisines,
                    openTime,
                    closeTime,
                    upiId,
                    specialOpenings, // send as 'YYYY-MM-DD' strings, backend converts to Date
                    specialClosings,
                    isOpenOnSunday,
                    about,
                });
                setError("");
                return true;
            } catch (err) {
                setError(err?.response?.data?.message || "Failed to save canteen setup.");
                return false;
            }
        });
    }, [
        valid,
        restaurantName,
        cuisines,
        openTime,
        closeTime,
        upiId,
        specialOpenings,
        specialClosings,
        isOpenOnSunday,
        about,
        saveOnboardingProgress,
        setHandleStepNext
    ]);

    return (
        <div className="space-y-5">
            <h2 className="text-2xl font-extrabold">Canteen setup</h2>
            <p className="text-text/70">Set up your restaurant name, timings, and payment info.</p>

            <input
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-background"
                placeholder="Canteen Name"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
            />

            {/* Cuisine Tags */}
            <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => toggleCuisine(t)}
                        className={`px-3 py-1 rounded-full border text-sm ${cuisines.includes(t)
                            ? "bg-primary text-white border-primary"
                            : "border-gray-300 dark:border-gray-600"
                            }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Timings */}
            <div className="grid md:grid-cols-2 gap-4">
                <label className="text-sm">
                    Opening Time
                    <input
                        type="time"
                        value={openTime}
                        onChange={(e) => setOpenTime(e.target.value)}
                        className="w-full mt-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-background"
                    />
                </label>
                <label className="text-sm">
                    Closing Time
                    <input
                        type="time"
                        value={closeTime}
                        onChange={(e) => setCloseTime(e.target.value)}
                        className="w-full mt-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-background"
                    />
                </label>
            </div>

            {/* UPI ID */}
            <input
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-background"
                placeholder="UPI ID (e.g. canteen@upi)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
            />

            {/* Optional about + Sunday open */}
            <div className="grid md:grid-cols-2 gap-4">
                <label className="text-sm inline-flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isOpenOnSunday}
                        onChange={(e) => setIsOpenOnSunday(e.target.checked)}
                    />
                    Open on Sunday
                </label>
                <input
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-background"
                    placeholder="Short about (optional)"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                />
            </div>

            {/* Special Days */}
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="text-sm block mb-1">Special Openings</label>
                    <div className="flex gap-2">
                        <input
                            type="date"
                            onChange={(e) => addDate("open", e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-background"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {specialOpenings.map((d, i) => (
                            <span key={i} className="px-2 py-1 text-xs rounded-full border">
                                {d}
                                <button className="ml-2 text-red-500" onClick={() => removeDate("open", i)}>×</button>
                            </span>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="text-sm block mb-1">Special Closings</label>
                    <div className="flex gap-2">
                        <input
                            type="date"
                            onChange={(e) => addDate("close", e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-background"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {specialClosings.map((d, i) => (
                            <span key={i} className="px-2 py-1 text-xs rounded-full border">
                                {d}
                                <button className="ml-2 text-red-500" onClick={() => removeDate("close", i)}>×</button>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
};

export default Step2MenuDetails;
