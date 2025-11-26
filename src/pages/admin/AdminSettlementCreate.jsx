// src/pages/admin/AdminSettlementCreate.jsx

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import SEO from "../../components/SEO";
import { useNavigate } from "react-router-dom";

const AdminSettlementCreate = () => {
    const { api } = useAuth();
    const navigate = useNavigate();

    const [canteens, setCanteens] = useState([]);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        canteenId: "",
        settlementDate: "",
    });

    // Load list of all canteens
    const fetchCanteens = async () => {
        try {
            const res = await api.get("/canteens");
            setCanteens(res.data || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load canteens");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCanteens();
    }, []);

    const handleCreateSettlement = async () => {
        if (!form.canteenId || !form.settlementDate) {
            toast.error("Please select both canteen and date");
            return;
        }

        try {
            const res = await api.post("/settlements/create", {
                canteenId: form.canteenId,
                settlementDate: form.settlementDate
            });

            toast.success("Settlement created successfully");

            // Redirect to details page
            navigate(`/admin/settlements/${res.data.settlement._id}`);

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to create settlement");
        }
    };

    return (
        <div className="p-6">
            <SEO title="Create Settlement" />

            <h2 className="text-2xl font-bold mb-4">Create Settlement</h2>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="border p-4 bg-background rounded shadow max-w-xl">

                    {/* Canteen Selector */}
                    <label className="block mb-1 font-medium">Select Canteen</label>
                    <select
                        value={form.canteenId}
                        onChange={(e) => setForm({ ...form, canteenId: e.target.value })}
                        className="border p-2 rounded w-full mb-4"
                    >
                        <option value="">-- Select Canteen --</option>
                        {canteens.map((c) => (
                            <option key={c._id} value={c._id}>
                                {c.name} ({c.college?.name})
                            </option>
                        ))}
                    </select>

                    {/* Date Selector */}
                    <label className="block mb-1 font-medium">Settlement Date</label>
                    <input
                        type="date"
                        value={form.settlementDate}
                        onChange={(e) => setForm({ ...form, settlementDate: e.target.value })}
                        className="border p-2 rounded w-full mb-4"
                    />

                    {/* Action Button */}
                    <button
                        onClick={handleCreateSettlement}
                        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
                    >
                        Create Settlement
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminSettlementCreate;
