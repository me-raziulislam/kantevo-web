// src/pages/student/Profile.jsx
// Premium student profile page

import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { CameraIcon, UserIcon, PhoneIcon, BuildingLibraryIcon } from "@heroicons/react/24/outline";
import SEO from "../../components/SEO";

const Profile = () => {
    const { user, api, loading: authLoading, accessToken } = useAuth();
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({ name: "", phone: "", about: "", college: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef();
    const [colleges, setColleges] = useState([]);

    useEffect(() => {
        if (authLoading || !user || !accessToken) return;

        const fetchProfileAndColleges = async () => {
            setLoading(true);
            try {
                const profileRes = await api.get("/users/profile");
                setProfile(profileRes.data);
                setForm({
                    name: profileRes.data.name || "",
                    phone: profileRes.data.phone || "",
                    about: profileRes.data.about || "",
                    college: profileRes.data.college?._id || "",
                });

                const collegesRes = await api.get("/colleges");
                setColleges(collegesRes.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileAndColleges();
    }, [user, api, accessToken, authLoading]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "phone") {
            const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
            setForm((prev) => ({ ...prev, [name]: digitsOnly }));
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
        if (form.phone && form.phone.length !== 10) {
            toast.error("Phone number must be exactly 10 digits");
            return;
        }
        if (!user) return;

        setSaving(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("phone", form.phone);
            formData.append("about", form.about);
            formData.append("college", form.college);

            if (fileInputRef.current.files[0]) {
                formData.append("profilePicture", fileInputRef.current.files[0]);
            }

            const res = await api.put(`/users/profile/${user._id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setProfile(res.data);
            setPreview(null);
            toast.success("Profile updated successfully!");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setSaving(false);
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
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
        >
            <SEO
                title="My Profile"
                description="Manage your account information on Kantevo."
                canonicalPath="/student/profile"
            />

            <h1 className="text-2xl md:text-3xl font-bold mb-6">My Profile</h1>

            <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary/20">
                            <img
                                src={
                                    preview ||
                                    profile?.profilePicture ||
                                    `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(
                                        profile?.name || user?.name || "user"
                                    )}`
                                }
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary-dark transition-colors"
                        >
                            <CameraIcon className="w-4 h-4" />
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">{profile?.name}</h3>
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

                {/* Form Fields */}
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                            <input
                                name="name"
                                type="text"
                                value={form.name}
                                onChange={handleChange}
                                className="input input-with-icon"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Phone Number
                        </label>
                        <div className="relative">
                            <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                            <input
                                name="phone"
                                type="tel"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="10-digit phone number"
                                maxLength={10}
                                className="input input-with-icon"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            College
                        </label>
                        <div className="relative">
                            <BuildingLibraryIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                            <select
                                name="college"
                                value={form.college}
                                onChange={handleChange}
                                className="input input-with-icon appearance-none cursor-pointer"
                            >
                                <option value="">Select a college</option>
                                {colleges.map((college) => (
                                    <option key={college._id} value={college._id}>
                                        {college.name}
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

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            About
                        </label>
                        <textarea
                            name="about"
                            rows={3}
                            value={form.about}
                            onChange={handleChange}
                            placeholder="Tell us about yourself..."
                            className="input min-h-[100px] resize-none"
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-error/10 border border-error/20">
                        <p className="text-sm text-error">{error}</p>
                    </div>
                )}

                {/* Submit */}
                <div className="flex justify-end pt-4 border-t border-border">
                    <button
                        type="submit"
                        disabled={saving}
                        className="btn-primary px-6 py-2.5 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default Profile;
