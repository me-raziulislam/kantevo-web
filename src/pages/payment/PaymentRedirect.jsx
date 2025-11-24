// pages/payment/PaymentRedirect.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import SEO from "../../components/SEO";

const PaymentRedirect = () => {
    const { merchantOrderId } = useParams();
    const navigate = useNavigate();
    const { api, loading: authLoading } = useAuth();

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null);
    const [raw, setRaw] = useState(null);

    useEffect(() => {
        if (!merchantOrderId) {
            toast.error("Invalid payment reference.");
            return navigate("/student/cart");
        }

        // fetch once
        const fetchStatus = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/payments/status/${merchantOrderId}`);
                const state = (res.data?.state || res.data?.status || "").toString().toLowerCase();

                setStatus(state);
                setRaw(res.data?.raw || res.data);

                if (state === "paid" || state === "success") {
                    toast.success("Payment successful! Redirecting...");
                    setTimeout(() => navigate("/student/orders"), 900);
                    return;
                }

                if (state === "failed") {
                    toast.error("Payment failed. Please retry.");
                    setLoading(false);
                    return;
                }

                // PENDING or unknown -> forward to PaymentPending UI which will poll
                navigate(`/payment/pending/${merchantOrderId}`);
            } catch (err) {
                console.error("Payment status fetch failed:", err);
                navigate(`/payment/pending/${merchantOrderId}`);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) fetchStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [merchantOrderId, authLoading]);

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <SEO title="Processing Payment..." />
            <div className="p-6 rounded-2xl border bg-background">
                <h2 className="text-xl font-semibold text-primary mb-2">Processing your payment…</h2>
                <p className="text-sm text-text/70">
                    Checking payment status for <strong>{merchantOrderId}</strong>.
                </p>

                {loading ? (
                    <div className="mt-4 text-sm text-text/60">Checking status…</div>
                ) : (
                    <>
                        <p className="mt-4 text-sm">
                            Current state: <strong className="capitalize">{status}</strong>
                        </p>

                        {status === "failed" && (
                            <div className="mt-3">
                                <button
                                    onClick={() => navigate("/student/cart")}
                                    className="px-4 py-2 rounded-full bg-primary text-white"
                                >
                                    Back to Cart
                                </button>
                            </div>
                        )}

                        <pre className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded text-xs">
                            {JSON.stringify(raw, null, 2)}
                        </pre>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentRedirect;
