import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import SEO from "../../components/SEO";

const AdminSettlementDetails = () => {
    const { api } = useAuth();
    const { id } = useParams();

    const [settlement, setSettlement] = useState(null);
    const [loading, setLoading] = useState(true);
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
        try {
            const res = await api.patch(`/settlements/${id}/mark-settled`, {
                utrNumber: utr,
                notes
            });
            toast.success("Settlement marked as settled");
            fetchDetails();
        } catch (err) {
            toast.error("Failed to mark settled");
        }
    };

    if (loading) return <p>Loading...</p>;

    if (!settlement) return <p>Settlement not found</p>;

    return (
        <div className="p-6">
            <SEO title="Settlement Details" />

            <h2 className="text-2xl font-bold mb-4">Settlement Details</h2>

            <div className="border p-4 rounded bg-background shadow mb-6">
                <p><strong>Canteen:</strong> {settlement.canteen?.name}</p>
                <p><strong>Owner:</strong> {settlement.owner?.name} ({settlement.owner?.email})</p>
                <p><strong>Date:</strong> {new Date(settlement.settlementDate).toLocaleDateString()}</p>
                <p><strong>Total Orders:</strong> {settlement.totalOrders}</p>
                <p><strong>Total Collected:</strong> ₹{settlement.totalAmountCollected}</p>
                <p><strong>Platform Fee:</strong> ₹{settlement.platformFeeAmount}</p>
                <p><strong>GST On Fee:</strong> ₹{settlement.gstOnFee}</p>
                <p><strong>Final Payable:</strong> ₹{settlement.finalPayableAmount}</p>
                <p><strong>UTR:</strong> {settlement.utrNumber || "Not Settled"}</p>
            </div>

            <h3 className="text-xl font-semibold mb-2">Settle Payment</h3>

            <div className="border p-4 rounded bg-background shadow mb-6">
                <label className="block text-sm mb-1">UTR Number</label>
                <input
                    value={utr}
                    onChange={e => setUtr(e.target.value)}
                    className="border p-2 rounded w-full mb-3"
                />

                <label className="block text-sm mb-1">Notes</label>
                <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="border p-2 rounded w-full h-24"
                />

                <button
                    onClick={markSettled}
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
                >
                    Mark Settled
                </button>
            </div>

            <h3 className="text-xl font-semibold mb-2">Included Payments</h3>

            <div className="space-y-2">
                {settlement.payments.map(p => (
                    <div key={p._id} className="border p-3 rounded bg-background">
                        <p><strong>Amount:</strong> ₹{p.amount}</p>
                        <p><strong>User:</strong> {p.user?.name}</p>
                        <p><strong>Date:</strong> {new Date(p.createdAt).toLocaleString()}</p>
                        <p><strong>Txn ID:</strong> {p.transactionId || "-"}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminSettlementDetails;
