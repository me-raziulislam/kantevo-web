// src/pages/canteen/Profile.jsx
// Premium canteen profile page

import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
    UserIcon,
    PhoneIcon,
    ClockIcon,
    CameraIcon,
    InformationCircleIcon
} from "@heroicons/react/24/outline";
import SEO from "../../components/SEO";

const Profile = () => {
    const { user, api } = useAuth();
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({ name: "", phone: "", about: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef();

    // Canteen settings state
    const [canteen, setCanteen] = useState(null);
    const [canteenLoading, setCanteenLoading] = useState(true);
    const [canteenSaving, setCanteenSaving] = useState(false);
    const [canteenError, setCanteenError] = useState(null);

    useEffect(() => {
        if (!user) return;

        const fetchProfile = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/canteen-owners/profile`);
                setProfile(res.data);
                setForm({
                    name: res.data.name || "",
                    phone: res.data.phone || "",
                    about: res.data.about || "",
                });
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        const fetchCanteen = async () => {
            setCanteenLoading(true);
            try {
                const res = await api.get(`/canteens/owner/${user._id}`);
                setCanteen(res.data);
            } catch (err) {
                setCanteenError(err.response?.data?.message || "Failed to load canteen settings");
            } finally {
                setCanteenLoading(false);
            }
        };

        fetchProfile();
        fetchCanteen();
    }, [user, api]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "phone") {
            setForm((prev) => ({ ...prev, [name]: value.replace(/\D/g, "").slice(0, 10) }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        setSaving(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("phone", form.phone);
            formData.append("about", form.about);

            if (fileInputRef.current?.files[0]) {
                formData.append("profilePicture", fileInputRef.current.files[0]);
            }

            const res = await api.put(`/canteen-owners/profile/${user._id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setProfile(res.data);
            setPreview(null);
            toast.success("Profile updated successfully!");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile");
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleCanteenChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCanteen((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleCanteenSave = async (e) => {
        e.preventDefault();
        if (!canteen?._id) return;

        setCanteenSaving(true);
        setCanteenError(null);

        try {
            // Save status
            await api.patch(`/canteens/${canteen._id}/status`, {
                isOpen: canteen.isOpen,
            });

            // Save timings
            await api.patch(`/canteens/${canteen._id}/timings`, {
                openingTime: canteen.openingTime,
                closingTime: canteen.closingTime,
                isOpenOnSunday: canteen.isOpenOnSunday,
                specialOpenings: canteen.specialOpenings || [],
                specialClosings: canteen.specialClosings || [],
            });

            toast.success("Canteen settings updated!");
        } catch (err) {
            setCanteenError(err.response?.data?.message || "Failed to update canteen settings");
            toast.error("Failed to update canteen settings");
        } finally {
            setCanteenSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="card p-12 text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-text-secondary">Loading profile...</p>
            </div>
        );
    }

    if (error && !profile) {
        return (
            <div className="card p-12 text-center">
                <p className="text-error font-medium">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <SEO title="Profile Settings" description="Manage your profile and canteen settings." canonicalPath="/canteen/profile" />

            <h1 className="text-2xl md:text-3xl font-bold">Profile Settings</h1>

            {/* Owner Profile */}
            <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="card p-6 space-y-6"
            >
                <h2 className="font-semibold text-lg border-b border-border pb-3">Owner Information</h2>

                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-primary/20">
                            <img
                                src={preview || profile?.profilePicture || `https://api.dicebear.com/7.x/thumbs/svg?seed=${profile?.name || "user"}`}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary-dark transition-colors"
                        >
                            <CameraIcon className="w-4 h-4" />
                        </button>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    </div>
                    <div>
                        <h3 className="font-semibold">{profile?.name}</h3>
                        <p className="text-text-muted text-sm">{profile?.email}</p>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-primary text-sm mt-1 hover:underline"
                        >
                            Change photo
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
                        <div className="relative">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="input input-with-icon"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Phone Number</label>
                        <div className="relative">
                            <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                maxLength={10}
                                className="input input-with-icon"
                                placeholder="10-digit phone"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">About</label>
                        <textarea
                            name="about"
                            value={form.about}
                            onChange={handleChange}
                            rows={3}
                            className="input min-h-[80px] resize-none"
                            placeholder="Tell us about yourself..."
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-error/10 border border-error/20">
                        <p className="text-sm text-error">{error}</p>
                    </div>
                )}

                <div className="flex justify-end pt-4 border-t border-border">
                    <button type="submit" disabled={saving} className="btn-primary px-6 py-2.5 disabled:opacity-50">
                        {saving ? "Saving..." : "Save Profile"}
                    </button>
                </div>
            </motion.form>

            {/* Canteen Settings */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-6"
            >
                <h2 className="font-semibold text-lg border-b border-border pb-3 mb-6">Canteen Settings</h2>

                {canteenLoading ? (
                    <div className="text-center py-8">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <p className="text-text-muted text-sm">Loading canteen settings...</p>
                    </div>
                ) : canteenError && !canteen ? (
                    <div className="p-4 rounded-xl bg-error/10 border border-error/20">
                        <p className="text-sm text-error">{canteenError}</p>
                    </div>
                ) : canteen ? (
                    <form onSubmit={handleCanteenSave} className="space-y-5">
                        {/* Status Toggle */}
                        <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl bg-background-subtle">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    name="isOpen"
                                    className="sr-only peer"
                                    checked={canteen.isOpen || false}
                                    onChange={handleCanteenChange}
                                />
                                <div className={`w-11 h-6 rounded-full transition-colors ${canteen.isOpen ? "bg-success" : "bg-border"}`}>
                                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${canteen.isOpen ? "translate-x-5" : ""}`} />
                                </div>
                            </div>
                            <div>
                                <span className="font-medium">Currently Open</span>
                                <p className="text-xs text-text-muted">Toggle to open/close your canteen</p>
                            </div>
                        </label>

                        {/* Operating Hours */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Opening Time</label>
                                <div className="relative">
                                    <ClockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                                    <input
                                        type="time"
                                        name="openingTime"
                                        value={canteen.openingTime || ""}
                                        onChange={handleCanteenChange}
                                        className="input input-with-icon"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">Closing Time</label>
                                <div className="relative">
                                    <ClockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                                    <input
                                        type="time"
                                        name="closingTime"
                                        value={canteen.closingTime || ""}
                                        onChange={handleCanteenChange}
                                        className="input input-with-icon"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sunday Toggle */}
                        <label className="flex items-center gap-3 cursor-pointer">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    name="isOpenOnSunday"
                                    className="sr-only peer"
                                    checked={canteen.isOpenOnSunday || false}
                                    onChange={handleCanteenChange}
                                />
                                <div className={`w-11 h-6 rounded-full transition-colors ${canteen.isOpenOnSunday ? "bg-success" : "bg-border"}`}>
                                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${canteen.isOpenOnSunday ? "translate-x-5" : ""}`} />
                                </div>
                            </div>
                            <span className="text-sm font-medium">Open on Sundays</span>
                        </label>

                        {/* Special Days */}
                        <div className="card-flat p-4 space-y-4">
                            <div className="flex items-center gap-2 text-sm text-text-muted">
                                <InformationCircleIcon className="w-4 h-4" />
                                <span>Special days override regular schedule</span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Special Openings <span className="text-text-muted font-normal">(comma-separated: YYYY-MM-DD)</span>
                                </label>
                                <input
                                    type="text"
                                    value={(canteen.specialOpenings || []).join(", ")}
                                    onChange={(e) =>
                                        setCanteen((prev) => ({
                                            ...prev,
                                            specialOpenings: e.target.value.split(",").map((d) => d.trim()).filter(Boolean),
                                        }))
                                    }
                                    className="input"
                                    placeholder="2025-12-25, 2025-01-01"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Special Closings <span className="text-text-muted font-normal">(comma-separated: YYYY-MM-DD)</span>
                                </label>
                                <input
                                    type="text"
                                    value={(canteen.specialClosings || []).join(", ")}
                                    onChange={(e) =>
                                        setCanteen((prev) => ({
                                            ...prev,
                                            specialClosings: e.target.value.split(",").map((d) => d.trim()).filter(Boolean),
                                        }))
                                    }
                                    className="input"
                                    placeholder="2025-08-15, 2025-10-02"
                                />
                            </div>
                        </div>

                        {canteenError && (
                            <div className="p-4 rounded-xl bg-error/10 border border-error/20">
                                <p className="text-sm text-error">{canteenError}</p>
                            </div>
                        )}

                        <div className="flex justify-end pt-4 border-t border-border">
                            <button type="submit" disabled={canteenSaving} className="btn-primary px-6 py-2.5 disabled:opacity-50">
                                {canteenSaving ? "Saving..." : "Save Canteen Settings"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="text-center py-8 text-text-muted">
                        No canteen found for your account.
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Profile;
