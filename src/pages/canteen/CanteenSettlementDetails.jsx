// src/pages/canteen/CanteenSettlementDetails.jsx
// Premium settlement details page

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
    ArrowLeftIcon,
    DocumentArrowDownIcon,
    CheckCircleIcon,
    ClockIcon,
    BanknotesIcon,
    CalendarDaysIcon
} from "@heroicons/react/24/outline";
import SEO from "../../components/SEO";

const CanteenSettlementDetails = () => {
    const { id } = useParams();
    const { api } = useAuth();

    const [loading, setLoading] = useState(true);
    const [settlement, setSettlement] = useState(null);

    const fetchDetails = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/settlements/${id}`);
            setSettlement(res.data);
        } catch (err) {
            console.error("fetchDetails error:", err);
            toast.error("Failed to load settlement details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const downloadPDF = () => {
        if (!settlement) return;
        const doc = new jsPDF({ unit: "pt" });
        doc.setFontSize(14);
        doc.text("Kantevo — Settlement Report", 40, 40);

        doc.setFontSize(10);
        const left = 40;
        let y = 70;
        doc.text(`Settlement ID: ${settlement._id}`, left, y); y += 14;
        doc.text(`Canteen: ${settlement.canteen?.name || "-"}`, left, y); y += 14;
        doc.text(`Owner: ${settlement.owner?.name || "-"}`, left, y); y += 14;
        doc.text(`Email: ${settlement.owner?.email || "-"}`, left, y); y += 14;
        doc.text(`Date: ${new Date(settlement.settlementDate).toLocaleDateString()}`, left, y); y += 18;

        autoTable(doc, {
            startY: y,
            head: [["Field", "Value"]],
            theme: "grid",
            headStyles: { fillColor: [240, 240, 240] },
            body: [
                ["Total Orders", settlement.totalOrders || 0],
                ["Total Collected", `₹${settlement.totalAmountCollected || 0}`],
                ["Platform Fee", `₹${settlement.platformFeeAmount || 0}`],
                ["GST on Fee", `₹${settlement.gstOnFee || 0}`],
                ["Final Payable", `₹${settlement.finalPayableAmount || 0}`],
                ["UTR Number", settlement.utrNumber || "Pending"],
                ["Notes", settlement.notes || "-"],
            ],
        });

        const paymentsStart = doc.lastAutoTable.finalY + 20;
        autoTable(doc, {
            startY: paymentsStart,
            head: [["Amount (₹)", "User", "Date", "Transaction ID"]],
            body: (settlement.payments || []).map((p) => [
                `₹${p.amount || 0}`,
                p.user?.name || "-",
                p.createdAt ? new Date(p.createdAt).toLocaleString() : "-",
                p.transactionId || "-",
            ]),
            styles: { fontSize: 9 },
            headStyles: { fillColor: [240, 240, 240] },
        });

        doc.save(`Settlement-${settlement._id}.pdf`);
    };

    if (loading) {
        return (
            <div className="card p-12 text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-text-secondary">Loading settlement details...</p>
            </div>
        );
    }

    if (!settlement) {
        return (
            <div className="card p-12 text-center">
                <p className="text-error font-medium">Settlement not found.</p>
            </div>
        );
    }

    const isSettled = Boolean(settlement.utrNumber);

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <SEO title="Settlement Details" description="View settlement details." canonicalPath={`/canteen/settlements/${id}`} />

            {/* Back Button */}
            <Link
                to="/canteen/settlements"
                className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
            >
                <ArrowLeftIcon className="w-5 h-5" />
                <span className="font-medium">Back to Settlements</span>
            </Link>

            {/* Header Card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <p className="text-sm text-text-muted mb-1">Settlement ID</p>
                        <h1 className="text-xl font-bold font-mono">{settlement._id}</h1>
                    </div>
                    {isSettled ? (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 text-success border border-success/20 font-medium">
                            <CheckCircleIcon className="w-5 h-5" />
                            Settled
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-warning/10 text-warning border border-warning/20 font-medium">
                            <ClockIcon className="w-5 h-5" />
                            Pending
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-text-muted mb-1">Final Payable Amount</p>
                            <p className="text-3xl font-bold text-primary">₹{settlement.finalPayableAmount}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <CalendarDaysIcon className="w-4 h-4" />
                            <span>Settlement Date: {new Date(settlement.settlementDate).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-text-muted">Total Collected</span>
                            <span className="font-medium">₹{settlement.totalAmountCollected}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-text-muted">Total Orders</span>
                            <span className="font-medium">{settlement.totalOrders}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-text-muted">Platform Fee</span>
                            <span className="font-medium">₹{settlement.platformFeeAmount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-text-muted">GST on Fee</span>
                            <span className="font-medium">₹{settlement.gstOnFee}</span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t border-border">
                            <span className="text-text-muted">UTR Number</span>
                            <span className="font-mono text-xs">{settlement.utrNumber || "Awaiting Admin"}</span>
                        </div>
                        {settlement.notes && (
                            <div className="flex justify-between text-sm">
                                <span className="text-text-muted">Notes</span>
                                <span className="font-medium">{settlement.notes}</span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Included Payments */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card overflow-hidden"
            >
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <h2 className="font-semibold">Included Payments ({settlement.payments?.length || 0})</h2>
                </div>

                {!settlement.payments || settlement.payments.length === 0 ? (
                    <div className="p-8 text-center">
                        <BanknotesIcon className="w-10 h-10 text-text-muted mx-auto mb-2" />
                        <p className="text-text-muted">No payments in this settlement</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-background-subtle">
                                    <th className="text-right py-3 px-4 font-medium text-text-muted">Amount</th>
                                    <th className="text-left py-3 px-4 font-medium text-text-muted">Customer</th>
                                    <th className="text-left py-3 px-4 font-medium text-text-muted">Date</th>
                                    <th className="text-left py-3 px-4 font-medium text-text-muted">Transaction ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {settlement.payments.map((p, i) => (
                                    <tr key={p._id || i} className="border-b border-border last:border-0">
                                        <td className="py-3 px-4 text-right font-semibold text-primary">₹{p.amount}</td>
                                        <td className="py-3 px-4 text-text-secondary">{p.user?.name || "-"}</td>
                                        <td className="py-3 px-4 text-text-muted">{p.createdAt ? new Date(p.createdAt).toLocaleString() : "-"}</td>
                                        <td className="py-3 px-4 font-mono text-xs text-text-muted">{p.transactionId || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>

            {/* Actions */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex justify-end"
            >
                <button onClick={downloadPDF} className="btn-primary px-5 py-2.5 flex items-center gap-2">
                    <DocumentArrowDownIcon className="w-5 h-5" />
                    Download PDF Report
                </button>
            </motion.div>
        </div>
    );
};

export default CanteenSettlementDetails;
