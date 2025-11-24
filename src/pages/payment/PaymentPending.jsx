// pages/payment/PaymentPending.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import SEO from "../../components/SEO";

const POLL_INTERVAL_MS = 3000;

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
                toast.success("Payment completed!");
                clearInterval(pollingRef.current);
                setTimeout(() => navigate("/student/orders"), 800);
                return;
            }

            if (st === "failed") {
                toast.error("Payment failed. Try again from cart.");
                clearInterval(pollingRef.current);
                setLoading(false);
                return;
            }

            setLoading(false);
        } catch (err) {
            console.warn("Polling error:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!merchantOrderId) {
            toast.error("Missing reference");
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
                    Waiting for confirmation for <strong>{merchantOrderId}</strong>.
                </p>

                <p className="mt-4 text-sm">
                    Current status:{" "}
                    <strong className="capitalize">{status}</strong>
                </p>

                {status === "failed" && (
                    <button
                        onClick={() => navigate("/student/cart")}
                        className="mt-4 px-4 py-2 rounded-full bg-primary text-white"
                    >
                        Back to Cart
                    </button>
                )}

                <pre className="mt-4 p-3 rounded text-xs bg-gray-50 dark:bg-gray-900">
                    {JSON.stringify(raw, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default PaymentPending;
