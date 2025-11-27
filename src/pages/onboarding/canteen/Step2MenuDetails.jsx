// Step2MenuDetails.jsx
// Premium canteen menu & timings step

import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import {
    BuildingStorefrontIcon,
    ClockIcon,
    CalendarDaysIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "../../../context/AuthContext";

const cuisineTags = ["North Indian", "South Indian", "Fast Food", "Chinese", "Biryani", "Pizza", "Snacks", "Beverages"];

const Step2MenuDetails = () => {
    const { saveOnboardingProgress, user } = useAuth();
    const { setFormValidity, setHandleStepNext } = useOutletContext();

    const existing = user?.canteen || {};
    const [restaurantName, setRestaurantName] = useState(existing?.name || "");
    const [cuisines, setCuisines] = useState(existing?.cuisines || []);
    const [openTime, setOpenTime] = useState(existing?.openingTime || "09:00");
    const [closeTime, setCloseTime] = useState(existing?.closingTime || "18:00");
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
    const valid = restaurantName && cuisines.length > 0 && timeOk;

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

    useEffect(() => {
        setHandleStepNext(() => async () => {
            if (!valid) return false;
            try {
                await saveOnboardingProgress(2, {
                    restaurantName,
                    cuisines,
                    openTime,
                    closeTime,
                    specialOpenings,
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
        specialOpenings,
        specialClosings,
        isOpenOnSunday,
        about,
        saveOnboardingProgress,
        setHandleStepNext
    ]);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-2">Canteen Setup</h2>
                <p className="text-text-secondary">
                    Set up your canteen name, cuisine types, and operating hours.
                </p>
            </div>

            {/* Basic Info */}
            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        Canteen Name <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                        <BuildingStorefrontIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                        <input
                            className="input input-with-icon"
                            placeholder="Enter your canteen name"
                            value={restaurantName}
                            onChange={(e) => setRestaurantName(e.target.value)}
                        />
                    </div>
                </div>

                {/* Cuisine Tags */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-3">
                        Cuisine Types <span className="text-error">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {cuisineTags.map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => toggleCuisine(tag)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${cuisines.includes(tag)
                                        ? "bg-primary text-white shadow-md"
                                        : "bg-background-subtle border border-border hover:border-primary"
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                    {cuisines.length === 0 && (
                        <p className="text-text-muted text-sm mt-2">Select at least one cuisine type</p>
                    )}
                </div>

                {/* About (optional) */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        About Your Canteen <span className="text-text-muted">(optional)</span>
                    </label>
                    <textarea
                        className="input min-h-[80px] resize-none"
                        placeholder="Brief description about your canteen..."
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        rows={3}
                    />
                </div>
            </div>

            {/* Operating Hours */}
            <div className="card-flat p-5">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <ClockIcon className="w-5 h-5 text-primary" />
                    Operating Hours
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm text-text-muted mb-2">Opening Time</label>
                        <input
                            type="time"
                            value={openTime}
                            onChange={(e) => setOpenTime(e.target.value)}
                            className="input"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-text-muted mb-2">Closing Time</label>
                        <input
                            type="time"
                            value={closeTime}
                            onChange={(e) => setCloseTime(e.target.value)}
                            className="input"
                        />
                    </div>
                </div>

                {/* Sunday Toggle */}
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isOpenOnSunday}
                            onChange={(e) => setIsOpenOnSunday(e.target.checked)}
                        />
                        <div className={`w-11 h-6 rounded-full transition-colors ${isOpenOnSunday ? "bg-primary" : "bg-border"}`}>
                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isOpenOnSunday ? "translate-x-5" : ""}`} />
                        </div>
                    </div>
                    <span className="text-sm">Open on Sundays</span>
                </label>
            </div>

            {/* Special Days */}
            <div className="card-flat p-5">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <CalendarDaysIcon className="w-5 h-5 text-accent" />
                    Special Days <span className="text-text-muted font-normal text-sm">(optional)</span>
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Special Openings */}
                    <div>
                        <label className="block text-sm text-text-muted mb-2">Special Openings</label>
                        <input
                            type="date"
                            onChange={(e) => {
                                addDate("open", e.target.value);
                                e.target.value = "";
                            }}
                            className="input mb-2"
                        />
                        <div className="flex flex-wrap gap-2">
                            {specialOpenings.map((d, i) => (
                                <span key={i} className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-success/10 text-success border border-success/20">
                                    {d}
                                    <button onClick={() => removeDate("open", i)} className="hover:text-error">
                                        <XMarkIcon className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Special Closings */}
                    <div>
                        <label className="block text-sm text-text-muted mb-2">Special Closings</label>
                        <input
                            type="date"
                            onChange={(e) => {
                                addDate("close", e.target.value);
                                e.target.value = "";
                            }}
                            className="input mb-2"
                        />
                        <div className="flex flex-wrap gap-2">
                            {specialClosings.map((d, i) => (
                                <span key={i} className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-error/10 text-error border border-error/20">
                                    {d}
                                    <button onClick={() => removeDate("close", i)} className="hover:text-error">
                                        <XMarkIcon className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-error/10 border border-error/20">
                    <p className="text-sm text-error">{error}</p>
                </div>
            )}
        </div>
    );
};

export default Step2MenuDetails;
