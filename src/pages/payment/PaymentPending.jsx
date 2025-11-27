// src/pages/payment/PaymentPending.jsx
// Premium payment pending page

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowPathIcon,
    ShoppingCartIcon
} from "@heroicons/react/24/outline";
import SEO from "../../components/SEO";
import SuccessAnimation from "../../components/SuccessAnimation";

const POLL_INTERVAL_MS = 3000;

const PaymentPending = () => {
    const { merchantOrderId } = useParams();
    const navigate = useNavigate();
    const { api } = useAuth();

    const [status, setStatus] = useState("pending");
    const [loading, setLoading] = useState(true);
    const pollingRef = useRef(null);

    const fetchStatus = async () => {
        try {
            const res = await api.get(`/payments/status/${merchantOrderId}`);
            const st = (res.data?.state || res.data?.status || "").toString().toLowerCase();
            setStatus(st);

            if (st === "paid" || st === "success") {
                toast.success("Payment completed!");
                clearInterval(pollingRef.current);
                setTimeout(() => navigate("/student/orders"), 1500);
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

        fetchStatus();
        pollingRef.current = setInterval(fetchStatus, POLL_INTERVAL_MS);

        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [merchantOrderId]);

    const isSuccess = status === "paid" || status === "success";
    const isFailed = status === "failed";
    const isPending = !isSuccess && !isFailed;

    return (
        <div className="min-h-screen bg-background text-text">
            <SEO title="Payment Pending" canonicalPath="/payment/pending" />

            <div className="container-app py-12 md:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-lg mx-auto"
                >
                    <div className="card p-8 text-center">
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
                                <button
                                    onClick={() => navigate("/student/cart")}
                                    className="btn-primary px-6 py-3 flex items-center gap-2 mx-auto"
                                >
                                    <ShoppingCartIcon className="w-5 h-5" />
                                    Back to Cart
                                </button>
                            </motion.div>
                        )}

                        {/* Pending State */}
                        {isPending && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="space-y-6"
                            >
                                <div className="w-20 h-20 rounded-full bg-warning/10 flex items-center justify-center mx-auto">
                                    <ClockIcon className="w-10 h-10 text-warning" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold mb-2">
                                        Payment Pending
                                    </h1>
                                    <p className="text-text-secondary">
                                        Waiting for payment confirmation
                                    </p>
                                </div>

                                {/* Order ID */}
                                <div className="p-4 rounded-xl bg-background-subtle">
                                    <p className="text-sm text-text-muted mb-1">Order Reference</p>
                                    <p className="font-mono font-semibold text-sm break-all">
                                        {merchantOrderId}
                                    </p>
                                </div>

                                {/* Status */}
                                <div className="flex items-center justify-center gap-3">
                                    <ArrowPathIcon className="w-5 h-5 text-primary animate-spin" />
                                    <span className="text-text-secondary">
                                        Current status:{" "}
                                        <span className="font-semibold text-text capitalize">
                                            {status}
                                        </span>
                                    </span>
                                </div>

                                <p className="text-xs text-text-muted">
                                    This page will automatically update when payment is confirmed
                                </p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PaymentPending;
