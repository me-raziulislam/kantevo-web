// src/pages/admin/AdminSettlementCreate.jsx

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import SEO from "../../components/SEO";
import { useNavigate } from "react-router-dom";
import { FaEye, FaCheckCircle, FaClock } from "react-icons/fa";

const AdminSettlementCreate = () => {
    const { api } = useAuth();
    const navigate = useNavigate();

    const [canteens, setCanteens] = useState([]);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        canteenId: "",
        settlementDate: "",
    });

    // NEW: preview state
    const [preview, setPreview] = useState(null);
    const [previewLoading, setPreviewLoading] = useState(false);

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

    const handlePreview = async () => {
        if (!form.canteenId || !form.settlementDate) {
            toast.error("Please select both canteen and date");
            return;
        }

        try {
            setPreviewLoading(true);
            setPreview(null);

            const res = await api.post("/settlements/preview", {
                canteenId: form.canteenId,
                settlementDate: form.settlementDate
            });

            setPreview(res.data);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Preview failed");
        } finally {
            setPreviewLoading(false);
        }
    };

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
                <>
                    <div className="border p-4 bg-background rounded shadow max-w-xl">

                        {/* Canteen Selector */}
                        <label className="block mb-1 font-medium">Select Canteen</label>
                        <select
                            value={form.canteenId}
                            onChange={(e) => {
                                setForm({ ...form, canteenId: e.target.value });
                                setPreview(null); // reset preview
                            }}
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
                            onChange={(e) => {
                                setForm({ ...form, settlementDate: e.target.value });
                                setPreview(null); // reset preview
                            }}
                            className="border p-2 rounded w-full mb-4"
                        />

                        {/* Preview Button */}
                        <button
                            onClick={handlePreview}
                            disabled={previewLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 mb-4"
                        >
                            <FaEye /> {previewLoading ? "Loading Preview..." : "Preview Settlement"}
                        </button>

                        {/* Create Button */}
                        <button
                            onClick={handleCreateSettlement}
                            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
                        >
                            Create Settlement
                        </button>
                    </div>

                    {/* PREVIEW CARD */}
                    {preview && (
                        <div className="mt-6 border rounded bg-background shadow p-6 max-w-3xl">
                            <h3 className="text-xl font-semibold mb-3">Settlement Preview</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <p><strong>Canteen:</strong> {preview.canteen?.name}</p>
                                <p><strong>Owner:</strong> {preview.owner?.name}</p>
                                <p><strong>Date:</strong> {new Date(preview.settlementDate).toLocaleDateString()}</p>
                                <p><strong>Total Orders:</strong> {preview.totalOrders}</p>

                                <p><strong>Total Collected:</strong> ₹{preview.totalAmountCollected}</p>
                                <p><strong>Platform Fee:</strong> ₹{preview.platformFeeAmount}</p>
                                <p><strong>GST on Fee:</strong> ₹{preview.gstOnFee}</p>
                                <p><strong>Final Payable:</strong> ₹{preview.finalPayableAmount}</p>
                            </div>

                            <h4 className="text-lg font-medium mt-6 mb-2">Included Payments</h4>

                            {preview.payments?.length === 0 ? (
                                <p className="text-text/70">No payments found for this date.</p>
                            ) : (
                                <div className="space-y-3">
                                    {preview.payments.map((p) => (
                                        <div key={p._id} className="border rounded p-3 bg-background shadow-sm">
                                            <p><strong>Amount:</strong> ₹{p.amount}</p>
                                            <p><strong>User:</strong> {p.user?.name || "-"}</p>
                                            <p><strong>Date:</strong> {new Date(p.createdAt).toLocaleString()}</p>
                                            <p><strong>Transaction ID:</strong> {p.transactionId || "-"}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminSettlementCreate;
