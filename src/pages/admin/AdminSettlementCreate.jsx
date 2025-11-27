// src/pages/admin/AdminSettlementCreate.jsx
// Premium settlement creation page

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    EyeIcon,
    PlusCircleIcon,
    BuildingStorefrontIcon,
    CalendarDaysIcon,
    BanknotesIcon,
    UserIcon,
    CurrencyRupeeIcon,
    ReceiptPercentIcon
} from "@heroicons/react/24/outline";
import SEO from "../../components/SEO";

const AdminSettlementCreate = () => {
    const { api } = useAuth();
    const navigate = useNavigate();

    const [canteens, setCanteens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    const [form, setForm] = useState({
        canteenId: "",
        settlementDate: "",
    });

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
            setCreating(true);
            const res = await api.post("/settlements/create", {
                canteenId: form.canteenId,
                settlementDate: form.settlementDate
            });

            toast.success("Settlement created successfully");
            navigate(`/admin/settlements/${res.data.settlement._id}`);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to create settlement");
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="space-y-6">
            <SEO title="Create Settlement" canonicalPath="/admin/settlements-create" />

            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">Create Settlement</h1>
                <p className="text-text-secondary mt-1">Generate settlement for canteen owners</p>
            </div>

            {loading ? (
                <div className="card p-12 text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-text-secondary">Loading canteens...</p>
                </div>
            ) : (
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Form Card */}
                    <div className="card p-6">
                        <h2 className="text-lg font-semibold mb-6">Settlement Details</h2>

                        <div className="space-y-5">
                            {/* Canteen Selector */}
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Select Canteen <span className="text-error">*</span>
                                </label>
                                <div className="relative">
                                    <BuildingStorefrontIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                                    <select
                                        value={form.canteenId}
                                        onChange={(e) => {
                                            setForm({ ...form, canteenId: e.target.value });
                                            setPreview(null);
                                        }}
                                        className="input input-with-icon appearance-none cursor-pointer"
                                    >
                                        <option value="">-- Select Canteen --</option>
                                        {canteens.map((c) => (
                                            <option key={c._id} value={c._id}>
                                                {c.name} ({c.college?.name})
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

                            {/* Date Selector */}
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Settlement Date <span className="text-error">*</span>
                                </label>
                                <div className="relative">
                                    <CalendarDaysIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                                    <input
                                        type="date"
                                        value={form.settlementDate}
                                        onChange={(e) => {
                                            setForm({ ...form, settlementDate: e.target.value });
                                            setPreview(null);
                                        }}
                                        className="input input-with-icon"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-border">
                                <button
                                    onClick={handlePreview}
                                    disabled={previewLoading || !form.canteenId || !form.settlementDate}
                                    className="btn-secondary flex-1 py-2.5 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <EyeIcon className="w-5 h-5" />
                                    {previewLoading ? "Loading..." : "Preview"}
                                </button>
                                <button
                                    onClick={handleCreateSettlement}
                                    disabled={creating || !form.canteenId || !form.settlementDate}
                                    className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <PlusCircleIcon className="w-5 h-5" />
                                    {creating ? "Creating..." : "Create"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Preview Card */}
                    <AnimatePresence mode="wait">
                        {preview && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="card p-6"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                                        <BanknotesIcon className="w-5 h-5 text-success" />
                                    </div>
                                    <h2 className="text-lg font-semibold">Settlement Preview</h2>
                                </div>

                                {/* Summary */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="p-4 rounded-xl bg-background-subtle">
                                        <p className="text-sm text-text-muted mb-1">Canteen</p>
                                        <p className="font-semibold">{preview.canteen?.name}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-background-subtle">
                                        <p className="text-sm text-text-muted mb-1">Owner</p>
                                        <p className="font-semibold">{preview.owner?.name}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-background-subtle">
                                        <p className="text-sm text-text-muted mb-1">Date</p>
                                        <p className="font-semibold">
                                            {new Date(preview.settlementDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-background-subtle">
                                        <p className="text-sm text-text-muted mb-1">Total Orders</p>
                                        <p className="font-semibold">{preview.totalOrders}</p>
                                    </div>
                                </div>

                                {/* Financial Breakdown */}
                                <div className="card-flat p-5 mb-6">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <CurrencyRupeeIcon className="w-5 h-5 text-primary" />
                                        Financial Breakdown
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">Total Collected</span>
                                            <span className="font-medium">₹{preview.totalAmountCollected}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">Platform Fee</span>
                                            <span className="font-medium text-error">- ₹{preview.platformFeeAmount}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">GST on Fee</span>
                                            <span className="font-medium text-error">- ₹{preview.gstOnFee}</span>
                                        </div>
                                        <div className="border-t border-border pt-3 flex justify-between">
                                            <span className="font-semibold">Final Payable</span>
                                            <span className="font-bold text-success text-lg">₹{preview.finalPayableAmount}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payments List */}
                                <div>
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <ReceiptPercentIcon className="w-5 h-5 text-accent" />
                                        Included Payments ({preview.payments?.length || 0})
                                    </h3>

                                    {preview.payments?.length === 0 ? (
                                        <div className="p-4 rounded-xl bg-warning/10 border border-warning/20 text-center">
                                            <p className="text-warning text-sm">No payments found for this date</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 max-h-64 overflow-y-auto">
                                            {preview.payments.map((p) => (
                                                <div key={p._id} className="p-4 rounded-xl bg-background-subtle">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-medium">₹{p.amount}</p>
                                                            <p className="text-sm text-text-muted flex items-center gap-1 mt-1">
                                                                <UserIcon className="w-4 h-4" />
                                                                {p.user?.name || "-"}
                                                            </p>
                                                        </div>
                                                        <div className="text-right text-sm">
                                                            <p className="text-text-muted">
                                                                {new Date(p.createdAt).toLocaleString()}
                                                            </p>
                                                            <p className="text-xs font-mono text-text-muted mt-1">
                                                                {p.transactionId || "-"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Empty State */}
                    {!preview && (
                        <div className="card p-12 text-center flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                <EyeIcon className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Preview Settlement</h3>
                            <p className="text-text-secondary text-sm">
                                Select a canteen and date, then click "Preview" to see the settlement details
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminSettlementCreate;
