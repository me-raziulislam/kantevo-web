import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const Profile = () => {
    const { user, api } = useAuth(); // centralized auth + api instance
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
        if (!user) return;

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
    }, [user, api]);

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
        <div className="p-6 max-w-xl mx-auto bg-background border border-gray-200 dark:border-gray-700 text-text rounded shadow">
            <h1 className="text-xl font-semibold mb-6 text-text">My Profile</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600">
                        <img
                            src={
                                preview ||
                                profile?.profilePicture ||
                                "https://via.placeholder.com/150?text=Profile"
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
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
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
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
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
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
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
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 resize-none bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className={`w-full py-2 rounded text-white ${saving
                        ? "bg-primary/50 cursor-not-allowed"
                        : "bg-primary hover:bg-primary-dark"
                        } transition`}
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
};

export default Profile;
