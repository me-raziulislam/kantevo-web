// src/pages/canteen/CanteenSettlementDetails.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import SEO from "../../components/SEO";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaArrowLeft, FaDownload, FaCheckCircle, FaClock } from "react-icons/fa";

/**
 * CanteenSettlementDetails
 * - GET /settlements/:id
 * - Shows settlement breakdown and list of included payments
 * - Download PDF export (jsPDF)
 */

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

        // Summary table
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

        // Payments list table
        const paymentsStart = doc.lastAutoTable.finalY + 20;
        autoTable(doc, {
            startY: paymentsStart,
            head: [["Amount (₹)", "User", "Date", "Transaction ID"]],
            body: (settlement.payments || []).map(p => [
                `₹${p.amount || 0}`,
                p.user?.name || "-",
                p.createdAt ? new Date(p.createdAt).toLocaleString() : "-",
                p.transactionId || "-"
            ]),
            styles: { fontSize: 9 },
            headStyles: { fillColor: [240, 240, 240] },
        });

        doc.save(`Settlement-${settlement._id}.pdf`);
    };

    if (loading) return <p className="p-6">Loading...</p>;
    if (!settlement) return <p className="p-6">Settlement not found.</p>;

    const isSettled = Boolean(settlement.utrNumber);

    return (
        <div className="p-6 bg-background text-text min-h-full">
            <SEO title="Settlement Details" description="Details for a single settlement." />

            <div className="flex justify-between items-center mb-4">
                <Link to="/canteen/settlements" className="text-primary flex items-center gap-2">
                    <FaArrowLeft /> Back to settlements
                </Link>

                <div className="flex items-center gap-3">
                    <button onClick={downloadPDF} className="px-4 py-2 bg-primary text-white rounded flex items-center gap-2">
                        <FaDownload /> Download Settlement PDF
                    </button>
                </div>
            </div>

            <div className="border rounded bg-background p-4 mb-6 shadow">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Settlement Summary</h2>
                    {isSettled ? (
                        <span className="px-3 py-1 bg-green-600 text-white rounded flex items-center gap-2 text-xs">
                            <FaCheckCircle /> SETTLED
                        </span>
                    ) : (
                        <span className="px-3 py-1 bg-yellow-600 text-white rounded flex items-center gap-2 text-xs">
                            <FaClock /> PENDING
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-sm">
                    <div><strong>Date:</strong> {new Date(settlement.settlementDate).toLocaleDateString()}</div>
                    <div><strong>Total Collected:</strong> ₹{settlement.totalAmountCollected}</div>
                    <div><strong>Total Orders:</strong> {settlement.totalOrders}</div>
                    <div><strong>Platform Fee:</strong> ₹{settlement.platformFeeAmount}</div>
                    <div><strong>GST on Fee:</strong> ₹{settlement.gstOnFee}</div>
                    <div><strong>Final Payable:</strong> ₹{settlement.finalPayableAmount}</div>
                    <div><strong>UTR:</strong> {settlement.utrNumber || "Awaiting Admin"}</div>
                    <div><strong>Notes:</strong> {settlement.notes || "-"}</div>
                </div>
            </div>

            <div className="border rounded bg-background p-4 shadow">
                <h3 className="text-lg font-semibold mb-3">Included Payments</h3>

                {(!settlement.payments || settlement.payments.length === 0) ? (
                    <div className="text-text/70">No payments included in this settlement.</div>
                ) : (
                    <div className="space-y-3">
                        {settlement.payments.map(p => (
                            <div key={p._id} className="border rounded p-3 bg-background dark:border-gray-700">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-semibold">₹{p.amount}</div>
                                        <div className="text-sm text-text/70">{p.user?.name || "-"}</div>
                                    </div>
                                    <div className="text-sm text-text/70">
                                        <div>{new Date(p.createdAt).toLocaleString()}</div>
                                        <div className="mt-1">Txn: {p.transactionId || "-"}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CanteenSettlementDetails;
