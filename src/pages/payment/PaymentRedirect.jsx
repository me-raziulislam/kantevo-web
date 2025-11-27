// src/pages/payment/PaymentRedirect.jsx
// Premium payment redirect page

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
    CheckCircleIcon,
    XCircleIcon,
    ShoppingCartIcon
} from "@heroicons/react/24/outline";
import SEO from "../../components/SEO";
import SuccessAnimation from "../../components/SuccessAnimation";

const PaymentRedirect = () => {
    const { merchantOrderId } = useParams();
    const navigate = useNavigate();
    const { api, loading: authLoading } = useAuth();

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        if (!merchantOrderId) {
            toast.error("Invalid payment reference.");
            return navigate("/student/cart");
        }

        const fetchStatus = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/payments/status/${merchantOrderId}`);
                const state = (res.data?.state || res.data?.status || "").toString().toLowerCase();
                setStatus(state);

                if (state === "paid" || state === "success") {
                    toast.success("Payment successful!");
                    setTimeout(() => navigate("/student/orders"), 1500);
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
    }, [merchantOrderId, authLoading]);

    const isSuccess = status === "paid" || status === "success";
    const isFailed = status === "failed";

    return (
        <div className="min-h-screen bg-background text-text">
            <SEO title="Processing Payment" canonicalPath="/payment/redirect" />

            <div className="container-app py-12 md:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-lg mx-auto"
                >
                    <div className="card p-8 text-center">
                        {/* Loading State */}
                        {loading && !status && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="space-y-6"
                            >
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                    <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold mb-2">
                                        Processing Payment
                                    </h1>
                                    <p className="text-text-secondary">
                                        Please wait while we verify your payment...
                                    </p>
                                </div>

                                {/* Order ID */}
                                <div className="p-4 rounded-xl bg-background-subtle">
                                    <p className="text-sm text-text-muted mb-1">Order Reference</p>
                                    <p className="font-mono font-semibold text-sm break-all">
                                        {merchantOrderId}
                                    </p>
                                </div>

                                <p className="text-xs text-text-muted">
                                    Do not close this page
                                </p>
                            </motion.div>
                        )}

                        {/* Success State */}
                        {isSuccess && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="space-y-6"
                            >
                                <SuccessAnimation size={150} />
                                <div>
                                    <h1 className="text-2xl font-bold text-success mb-2">
                                        Payment Successful!
                                    </h1>
                                    <p className="text-text-secondary">
                                        Your order has been placed successfully.
                                    </p>
                                </div>
                                <p className="text-sm text-text-muted">
                                    Redirecting to your orders...
                                </p>
                            </motion.div>
                        )}

                        {/* Failed State */}
                        {isFailed && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="space-y-6"
                            >
                                <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mx-auto">
                                    <XCircleIcon className="w-10 h-10 text-error" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-error mb-2">
                                        Payment Failed
                                    </h1>
                                    <p className="text-text-secondary">
                                        Something went wrong with your payment. Please try again.
                                    </p>
                                </div>

                                {/* Order ID */}
                                <div className="p-4 rounded-xl bg-background-subtle">
                                    <p className="text-sm text-text-muted mb-1">Order Reference</p>
                                    <p className="font-mono font-semibold text-sm break-all">
                                        {merchantOrderId}
                                    </p>
                                </div>

                                <button
                                    onClick={() => navigate("/student/cart")}
                                    className="btn-primary px-6 py-3 flex items-center gap-2 mx-auto"
                                >
                                    <ShoppingCartIcon className="w-5 h-5" />
                                    Back to Cart
                                </button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PaymentRedirect;
