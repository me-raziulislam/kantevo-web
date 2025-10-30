import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import SEO from "../../components/SEO";
import { motion } from "framer-motion";

const Profile = () => {
    const { user, api, loading: authLoading, accessToken } = useAuth(); // centralized auth + api instance
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({ name: "", phone: "", about: "", college: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef();

    // Fetch preferred colleges list for select dropdown
    const [colleges, setColleges] = useState([]);

    useEffect(() => {
        if (authLoading || !user || !accessToken) return;

        const fetchProfileAndColleges = async () => {
            setLoading(true);
            try {
                // Fetch user profile
                const profileRes = await api.get("/users/profile");
                setProfile(profileRes.data);
                setForm({
                    name: profileRes.data.name || "",
                    phone: profileRes.data.phone || "",
                    about: profileRes.data.about || "",
                    college: profileRes.data.college?._id || "",
                });

                // Fetch colleges
                const collegesRes = await api.get("/colleges");
                setColleges(collegesRes.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load profile or colleges");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileAndColleges();
    }, [user, api, accessToken, authLoading]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phone") {
            // Allow only digits and limit to 10 characters
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

        // Validate phone number length if phone field is not empty
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

            const res = await api.put(
                `/users/profile/${user._id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setProfile(res.data);
            setPreview(null);
            toast.success("Profile updated successfully!");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading)
        return (
            <div className="p-6 text-text/80 bg-background min-h-[150px] text-center">
                Loading profile...
            </div>
        );
    if (error)
        return (
            <div className="p-6 text-red-500 bg-background min-h-[150px] text-center font-semibold">
                Error: {error}
            </div>
        );

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="max-w-2xl"
        >
            <SEO
                title="Profile"
                description="Manage your account information, college details, and preferences in Kantevo."
                canonicalPath="/student/profile"
            />

            <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-4">My Profile</h1>

            <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm bg-background">
                <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary shadow">
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
                    <div>
                        <label
                            htmlFor="profilePicture"
                            className="cursor-pointer text-primary underline text-sm"
                        >
                            Change Picture
                        </label>
                        <input
                            id="profilePicture"
                            name="profilePicture"
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="name"
                        className="block font-medium mb-1 text-text/80"
                    >
                        Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </div>

                <div>
                    <label
                        htmlFor="phone"
                        className="block font-medium mb-1 text-text/80"
                    >
                        Phone
                    </label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Phone number"
                        pattern="\d{10}"
                        maxLength={10}
                        minLength={10}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label
                        htmlFor="college"
                        className="block font-medium mb-1 text-text/80"
                    >
                        College
                    </label>
                    <select
                        id="college"
                        name="college"
                        value={form.college}
                        onChange={handleChange}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="">-- Select a College --</option>
                        {colleges.map((college) => (
                            <option key={college._id} value={college._id}>
                                {college.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="about"
                        className="block font-medium mb-1 text-text/80"
                    >
                        About
                    </label>
                    <textarea
                        id="about"
                        name="about"
                        rows={3}
                        value={form.about}
                        onChange={handleChange}
                        placeholder="About you"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 resize-none bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className={`px-6 py-2 rounded-full text-white ${saving ? "bg-primary/60 cursor-not-allowed" : "bg-primary hover:brightness-110"
                            } transition`}
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default Profile;
