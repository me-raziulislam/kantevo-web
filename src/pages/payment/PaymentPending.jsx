// src/pages/payment/PaymentPending.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import SEO from "../../components/SEO";

const POLL_INTERVAL_MS = 3000; // 3 seconds

const PaymentPending = () => {
    const { merchantOrderId } = useParams();
    const navigate = useNavigate();
    const { api } = useAuth();

    const [status, setStatus] = useState("pending");
    const [raw, setRaw] = useState(null);
    const [loading, setLoading] = useState(true);
    const pollingRef = useRef(null);

    const fetchStatus = async () => {
        try {
            const res = await api.get(`/payments/status/${merchantOrderId}`);
            const st = (res.data?.state || res.data?.status || "").toString().toLowerCase();
            setStatus(st);
            setRaw(res.data?.raw || res.data);
            if (st === "paid" || st === "success") {
                toast.success("Payment completed! Redirecting to Orders...");
                clearInterval(pollingRef.current);
                // small delay to allow toast to show
                setTimeout(() => navigate("/student/orders"), 900);
                return;
            }
            if (st === "failed") {
                toast.error("Payment failed. Please try again from your Cart.");
                clearInterval(pollingRef.current);
                setLoading(false);
                return;
            }
            setLoading(false);
        } catch (err) {
            console.warn("Polling error:", err);
            // keep polling — we don't want transient network errors to cancel the flow
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!merchantOrderId) {
            toast.error("Missing payment reference");
            return navigate("/student/cart");
        }

        // initial fetch
        fetchStatus();

        // start polling
        pollingRef.current = setInterval(fetchStatus, POLL_INTERVAL_MS);

        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [merchantOrderId]);

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <SEO title="Payment Pending" />
            <div className="p-6 rounded-2xl border bg-background">
                <h2 className="text-xl font-semibold text-primary mb-2">Payment pending</h2>
                <p className="text-sm text-text/70">
                    We're waiting for the payment to complete for <strong>{merchantOrderId}</strong>. This may take a few moments.
                </p>

                <div className="mt-4">
                    <p className="text-sm">Current status: <strong className="capitalize">{status}</strong></p>
                    {loading && <p className="text-sm text-text/60 mt-2">Checking status…</p>}
                </div>

                {status === "failed" && (
                    <div className="mt-4 flex gap-3">
                        <button onClick={() => navigate("/student/cart")} className="px-4 py-2 rounded-full bg-primary text-white">
                            Back to Cart
                        </button>
                    </div>
                )}

                <pre className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 text-xs rounded">{JSON.stringify(raw, null, 2)}</pre>
            </div>
        </div>
    );
};

export default PaymentPending;
