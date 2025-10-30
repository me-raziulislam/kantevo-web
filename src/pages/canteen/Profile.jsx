import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import SEO from "../../components/SEO";

const Profile = () => {
    const { user, api } = useAuth(); // get centralized api instance
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({ name: "", phone: "", about: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef();

    // --- Canteen settings state ---
    const [canteen, setCanteen] = useState(null);
    const [canteenLoading, setCanteenLoading] = useState(true);
    const [canteenSaving, setCanteenSaving] = useState(false);
    const [canteenError, setCanteenError] = useState(null);
    const [upiQrPreview, setUpiQrPreview] = useState(null);
    const upiQrFileRef = useRef();

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
                // Fetch canteen linked directly to the logged-in owner
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
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

            if (fileInputRef.current.files[0]) {
                formData.append("profilePicture", fileInputRef.current.files[0]);
            }

            const res = await api.put(
                `/canteen-owners/profile/${user._id}`,
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

    // --- Handle Canteen form changes ---
    const handleCanteenChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCanteen((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleUpiQrChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUpiQrPreview(URL.createObjectURL(file));
        } else {
            setUpiQrPreview(null);
        }
    };

    const handleCanteenSave = async (e) => {
        e.preventDefault();
        if (!canteen?._id) return;

        setCanteenSaving(true);
        setCanteenError(null);

        try {
            // --- Save UPI ID and QR first ---
            const upiFormData = new FormData();
            if (canteen.upiId) upiFormData.append("upiId", canteen.upiId);
            if (upiQrFileRef.current.files[0]) {
                upiFormData.append("upiQr", upiQrFileRef.current.files[0]);
            }
            if (upiFormData.has("upiId") || upiFormData.has("upiQr")) {
                await api.put(
                    `/canteens/${canteen._id}/profile`,
                    upiFormData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
            }

            // --- Save status ---
            await api.patch(`/canteens/${canteen._id}/status`, {
                isOpen: canteen.isOpen,
            });

            // --- Save timings and special dates ---
            await api.patch(`/canteens/${canteen._id}/timings`, {
                openingTime: canteen.openingTime,
                closingTime: canteen.closingTime,
                isOpenOnSunday: canteen.isOpenOnSunday,
                specialOpenings: canteen.specialOpenings || [],
                specialClosings: canteen.specialClosings || [],
            });

            toast.success("Canteen settings updated!");
            setUpiQrPreview(null);
        } catch (err) {
            setCanteenError(err.response?.data?.message || "Failed to update canteen settings");
        } finally {
            setCanteenSaving(false);
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

            <SEO
                title="Canteen Profile"
                description="Update your canteen’s profile, UPI details, and contact information on Kantevo."
                canonicalPath="/canteen/profile"
            />

            <h1 className="text-xl font-semibold mb-6 text-text">My Profile</h1>

            {/* --- Owner Profile Form --- */}
            <form onSubmit={handleSubmit} className="space-y-6 mb-10">
                {/* profile picture */}
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

                {/* name */}
                <div>
                    <label htmlFor="name" className="block font-medium mb-1 text-text/80">
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

                {/* phone */}
                <div>
                    <label htmlFor="phone" className="block font-medium mb-1 text-text/80">
                        Phone
                    </label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Phone number"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* about */}
                <div>
                    <label htmlFor="about" className="block font-medium mb-1 text-text/80">
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

            {/* --- Canteen Settings Form --- */}
            <h2 className="text-lg font-semibold mb-4 text-text">Canteen Settings</h2>
            {canteenLoading ? (
                <p>Loading canteen settings...</p>
            ) : canteenError ? (
                <p className="text-red-500">{canteenError}</p>
            ) : canteen ? (
                <form onSubmit={handleCanteenSave} className="space-y-4">

                    {/* UPI ID */}
                    <div>
                        <label className="block font-medium mb-1">UPI ID</label>
                        <input
                            type="text"
                            name="upiId"
                            value={canteen.upiId || ""}
                            onChange={handleCanteenChange}
                            placeholder="canteen@upi"
                            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2"
                        />
                    </div>

                    {/* UPI QR */}
                    <div className="flex items-center space-x-4">
                        <div className="w-28 h-28 rounded border border-gray-300 dark:border-gray-600 overflow-hidden">
                            <img
                                src={
                                    upiQrPreview ||
                                    canteen.upiQrUrl ||
                                    "https://via.placeholder.com/150?text=QR"
                                }
                                alt="UPI QR"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="upiQr"
                                className="cursor-pointer text-primary underline text-sm"
                            >
                                Change QR
                            </label>
                            <input
                                id="upiQr"
                                name="upiQr"
                                type="file"
                                accept="image/*"
                                ref={upiQrFileRef}
                                onChange={handleUpiQrChange}
                                className="hidden"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            id="isOpen"
                            name="isOpen"
                            type="checkbox"
                            checked={canteen.isOpen}
                            onChange={handleCanteenChange}
                        />
                        <label htmlFor="isOpen">Currently Open</label>
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Opening Time</label>
                        <input
                            type="time"
                            name="openingTime"
                            value={canteen.openingTime || ""}
                            onChange={handleCanteenChange}
                            className="border rounded px-2 py-1 w-full"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Closing Time</label>
                        <input
                            type="time"
                            name="closingTime"
                            value={canteen.closingTime || ""}
                            onChange={handleCanteenChange}
                            className="border rounded px-2 py-1 w-full"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            id="isOpenOnSunday"
                            name="isOpenOnSunday"
                            type="checkbox"
                            checked={canteen.isOpenOnSunday}
                            onChange={handleCanteenChange}
                        />
                        <label htmlFor="isOpenOnSunday">Open on Sunday</label>
                    </div>

                    {/* Future: Special openings/closings date pickers */}
                    {/* For now, just text inputs or arrays can be used */}
                    <div>
                        <label className="block font-medium mb-1">Special Openings (comma-separated dates YYYY-MM-DD)</label>
                        <input
                            type="text"
                            name="specialOpenings"
                            value={(canteen.specialOpenings || []).join(",")}
                            onChange={(e) =>
                                setCanteen((prev) => ({
                                    ...prev,
                                    specialOpenings: e.target.value.split(",").map((d) => d.trim()),
                                }))
                            }
                            className="border rounded px-2 py-1 w-full"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Special Closings (comma-separated dates YYYY-MM-DD)</label>
                        <input
                            type="text"
                            name="specialClosings"
                            value={(canteen.specialClosings || []).join(",")}
                            onChange={(e) =>
                                setCanteen((prev) => ({
                                    ...prev,
                                    specialClosings: e.target.value.split(",").map((d) => d.trim()),
                                }))
                            }
                            className="border rounded px-2 py-1 w-full"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={canteenSaving}
                        className={`w-full py-2 rounded text-white ${canteenSaving
                            ? "bg-primary/50 cursor-not-allowed"
                            : "bg-primary hover:bg-primary-dark"
                            } transition`}
                    >
                        {canteenSaving ? "Saving..." : "Save Canteen Settings"}
                    </button>
                </form>
            ) : (
                <p>No canteen found for your account.</p>
            )}
        </div>
    );
};

export default Profile;
