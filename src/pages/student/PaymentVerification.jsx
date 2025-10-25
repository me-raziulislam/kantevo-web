// frontend/src/pages/PaymentVerification.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import SEO from "../../components/SEO";

const PaymentVerification = () => {
    const { orderId } = useParams();
    const { api } = useAuth();
    const [status, setStatus] = useState("checking...");
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const res = await api.get(`/payments/status/${orderId}`);
                setStatus(res.data.state);
                setDetails(res.data);
                if (res.data.state === "paid") {
                    toast.success("✅ Payment successful!");
                } else if (res.data.state === "failed") {
                    toast.error("❌ Payment failed");
                }
            } catch (err) {
                toast.error("Could not verify payment");
                setStatus("error");
            } finally {
                setLoading(false);
            }
        };
        verifyPayment();
    }, [api, orderId]);

    return (
        <div className="p-6 max-w-xl mx-auto text-center bg-background text-text">

            <SEO
                title="Payment Verification"
                description="Verifying your payment for a secure and seamless canteen ordering experience on Kantevo."
                canonicalPath="/payment/verify"
            />

            <h2 className="text-2xl font-bold mb-4 text-primary">Payment Verification</h2>

            {loading ? (
                <p>Checking payment status...</p>
            ) : (
                <>
                    <p className="text-lg mb-2">
                        Status:{" "}
                        <span
                            className={`font-semibold ${status === "paid"
                                ? "text-green-600"
                                : status === "failed"
                                    ? "text-red-600"
                                    : "text-yellow-600"
                                }`}
                        >
                            {status}
                        </span>
                    </p>

                    {details && (
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mt-4 text-left">
                            <p><strong>Order ID:</strong> {details.orderId}</p>
                            <p><strong>Payment ID:</strong> {details.paymentId}</p>
                            <p><strong>State:</strong> {details.state}</p>
                        </div>
                    )}

                    <Link
                        to="/"
                        className="mt-6 inline-block bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition-colors"
                    >
                        Back to Home
                    </Link>
                </>
            )}
        </div>
    );
};

export default PaymentVerification;