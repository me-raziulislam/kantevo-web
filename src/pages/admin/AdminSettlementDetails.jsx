// src/pages/admin/AdminSettlementDetails.jsx
// Premium settlement details page

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
    ArrowLeftIcon,
    CheckCircleIcon,
    ClockIcon,
    BanknotesIcon,
    BuildingStorefrontIcon,
    UserIcon,
    CalendarDaysIcon,
    CurrencyRupeeIcon,
    ReceiptPercentIcon,
    DocumentTextIcon
} from "@heroicons/react/24/outline";
import SEO from "../../components/SEO";

const AdminSettlementDetails = () => {
    const { api } = useAuth();
    const { id } = useParams();

    const [settlement, setSettlement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [settling, setSettling] = useState(false);
    const [utr, setUtr] = useState("");
    const [notes, setNotes] = useState("");

    const fetchDetails = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/settlements/${id}`);
            setSettlement(res.data);
            setUtr(res.data.utrNumber || "");
            setNotes(res.data.notes || "");
        } catch (err) {
            toast.error("Failed to load settlement");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const markSettled = async () => {
        if (!utr) {
            toast.error("Please enter UTR number");
            return;
        }

        try {
            setSettling(true);
            await api.patch(`/settlements/${id}/mark-settled`, {
                utrNumber: utr,
                notes
            });
            toast.success("Settlement marked as settled");
            fetchDetails();
        } catch (err) {
            toast.error("Failed to mark settled");
        } finally {
            setSettling(false);
        }
    };

    if (loading) {
        return (
            <div className="card p-12 text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-text-secondary">Loading settlement...</p>
            </div>
        );
    }

    if (!settlement) {
        return (
            <div className="card p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center mx-auto mb-4">
                    <BanknotesIcon className="w-8 h-8 text-error" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Settlement not found</h3>
                <Link to="/admin/settlements" className="text-primary hover:underline">
                    Go back to settlements
                </Link>
            </div>
        );
    }

    const isSettled = settlement.status === 'settled' || settlement.utrNumber;

    return (
        <div className="space-y-6">
            <SEO title="Settlement Details" canonicalPath={`/admin/settlements/${id}`} />

            {/* Back Navigation */}
            <Link
                to="/admin/settlements"
                className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
            >
                <ArrowLeftIcon className="w-5 h-5" />
                <span className="font-medium">Back to Settlements</span>
            </Link>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Settlement Details</h1>
                    <p className="text-text-secondary mt-1">
                        {settlement.canteen?.name} • {new Date(settlement.settlementDate).toLocaleDateString()}
                    </p>
                </div>
                <span className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 ${isSettled
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    }`}>
                    {isSettled ? (
                        <>
                            <CheckCircleIcon className="w-5 h-5" />
                            Settled
                        </>
                    ) : (
                        <>
                            <ClockIcon className="w-5 h-5" />
                            Pending
                        </>
                    )}
                </span>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Settlement Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card p-6"
                    >
                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <BuildingStorefrontIcon className="w-5 h-5 text-primary" />
                            Settlement Information
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-background-subtle">
                                <p className="text-sm text-text-muted mb-1">Canteen</p>
                                <p className="font-semibold">{settlement.canteen?.name}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-background-subtle">
                                <p className="text-sm text-text-muted mb-1">Owner</p>
                                <p className="font-semibold">{settlement.owner?.name}</p>
                                <p className="text-xs text-text-muted">{settlement.owner?.email}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-background-subtle">
                                <p className="text-sm text-text-muted mb-1">Settlement Date</p>
                                <p className="font-semibold">
                                    {new Date(settlement.settlementDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-background-subtle">
                                <p className="text-sm text-text-muted mb-1">Total Orders</p>
                                <p className="font-semibold">{settlement.totalOrders}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Financial Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card p-6"
                    >
                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <CurrencyRupeeIcon className="w-5 h-5 text-accent" />
                            Financial Breakdown
                        </h2>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-border">
                                <span className="text-text-muted">Total Collected</span>
                                <span className="font-semibold text-lg">₹{settlement.totalAmountCollected}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-border">
                                <span className="text-text-muted">Platform Fee</span>
                                <span className="font-medium text-error">- ₹{settlement.platformFeeAmount}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-border">
                                <span className="text-text-muted">GST on Fee</span>
                                <span className="font-medium text-error">- ₹{settlement.gstOnFee}</span>
                            </div>
                            <div className="flex justify-between items-center py-4 bg-success/5 rounded-xl px-4">
                                <span className="font-semibold text-lg">Final Payable</span>
                                <span className="font-bold text-2xl text-success">₹{settlement.finalPayableAmount}</span>
                            </div>
                        </div>

                        {settlement.utrNumber && (
                            <div className="mt-6 p-4 rounded-xl bg-success/10 border border-success/20">
                                <p className="text-sm text-success font-medium">UTR Number</p>
                                <p className="font-mono text-lg">{settlement.utrNumber}</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Included Payments */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card p-6"
                    >
                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <ReceiptPercentIcon className="w-5 h-5 text-primary" />
                            Included Payments ({settlement.payments?.length || 0})
                        </h2>

                        {settlement.payments?.length === 0 ? (
                            <div className="text-center py-8 text-text-muted">
                                No payments in this settlement
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {settlement.payments.map((p) => (
                                    <div key={p._id} className="p-4 rounded-xl bg-background-subtle">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-lg">₹{p.amount}</p>
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
                    </motion.div>
                </div>

                {/* Sidebar - Settle Payment */}
                <div className="lg:col-span-1">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card p-6 sticky top-24"
                    >
                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <DocumentTextIcon className="w-5 h-5 text-success" />
                            {isSettled ? 'Settlement Details' : 'Settle Payment'}
                        </h2>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    UTR Number {!isSettled && <span className="text-error">*</span>}
                                </label>
                                <input
                                    type="text"
                                    value={utr}
                                    onChange={(e) => setUtr(e.target.value)}
                                    placeholder="Enter UTR number"
                                    className="input"
                                    disabled={isSettled}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Notes
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add any notes..."
                                    className="input min-h-[100px] resize-none"
                                    disabled={isSettled}
                                />
                            </div>

                            {!isSettled && (
                                <button
                                    onClick={markSettled}
                                    disabled={settling || !utr}
                                    className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <CheckCircleIcon className="w-5 h-5" />
                                    {settling ? 'Processing...' : 'Mark as Settled'}
                                </button>
                            )}

                            {isSettled && (
                                <div className="p-4 rounded-xl bg-success/10 border border-success/20 text-center">
                                    <CheckCircleIcon className="w-8 h-8 text-success mx-auto mb-2" />
                                    <p className="font-medium text-success">Payment Settled</p>
                                    <p className="text-sm text-text-muted mt-1">
                                        Settlement has been processed
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettlementDetails;
