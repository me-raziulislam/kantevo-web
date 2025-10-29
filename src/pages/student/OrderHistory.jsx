// pages/student/OrderHistory.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { QRCodeCanvas } from "qrcode.react"; // new import
import SEO from "../../components/SEO";

const LIMIT = 10;

const STATUS_OPTIONS = ["pending", "preparing", "ready", "completed", "cancelled"];
const PAYMENT_OPTIONS = ["pending", "paid", "failed"];

const OrderHistory = () => {
    const { user, api, socket } = useAuth(); // use socket from context

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState("");

    // QR modal state
    const [qrOrder, setQrOrder] = useState(null);

    // Filters
    const [status, setStatus] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const lastCreatedAtRef = useRef(null);

    // ------------------- FETCH ORDERS -------------------
    const fetchOrders = useCallback(
        async (isLoadMore = false) => {
            if (!user) return;

            try {
                if (isLoadMore) setLoadingMore(true);
                else setLoading(true);

                let query = `?limit=${LIMIT}`;

                if (status) query += `&status=${status}`;
                if (paymentStatus) query += `&paymentStatus=${paymentStatus}`;
                if (dateFrom) query += `&dateFrom=${dateFrom}`;
                if (dateTo) query += `&dateTo=${dateTo}`;

                if (isLoadMore && lastCreatedAtRef.current) {
                    query += `&lastCreatedAt=${encodeURIComponent(lastCreatedAtRef.current)}`;
                }

                const res = await api.get(`/orders/student/${user._id}${query}`);
                const fetchedOrders = res.data;

                if (isLoadMore) {
                    setOrders((prev) => [...prev, ...fetchedOrders]);
                } else {
                    setOrders(fetchedOrders);
                }

                if (fetchedOrders.length < LIMIT) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                    lastCreatedAtRef.current = fetchedOrders[fetchedOrders.length - 1].createdAt;
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch order history");
                toast.error("Failed to fetch order history");
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        [user, api, status, paymentStatus, dateFrom, dateTo]
    );

    useEffect(() => {
        lastCreatedAtRef.current = null;
        fetchOrders(false);
    }, [fetchOrders]);

    // ------------------- SOCKET LISTENERS -------------------
    useEffect(() => {
        if (!socket) return;

        const handleOrderUpdate = (updatedOrder) => {
            setOrders((prevOrders) =>
                prevOrders.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
            );
            toast.info(`Order ${updatedOrder.token} status updated`);
        };

        const handlePaymentUpdate = (updatedOrder) => {
            setOrders((prevOrders) =>
                prevOrders.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
            );
            toast.info(`Payment for order ${updatedOrder.token} updated`);
        };

        socket.on("orderStatusUpdated", handleOrderUpdate);
        socket.on("paymentStatusUpdated", handlePaymentUpdate);

        return () => {
            socket.off("orderStatusUpdated", handleOrderUpdate);
            socket.off("paymentStatusUpdated", handlePaymentUpdate);
        };
    }, [socket]);

    const handleSubmit = (e) => {
        e.preventDefault();
        lastCreatedAtRef.current = null;
        fetchOrders(false);
    };

    const clearFilters = () => {
        setStatus("");
        setPaymentStatus("");
        setDateFrom("");
        setDateTo("");
        lastCreatedAtRef.current = null;
        fetchOrders(false);
    };

    const loadMore = () => {
        if (loadingMore || !hasMore) return;
        fetchOrders(true);
    };

    // ------------------- QR Visibility Helpers -------------------
    const isQrVisible = (order) => {
        if (!order.qrExpires || !order.qrHash) return false;
        if (order.status === "completed" || order.status === "cancelled") return false;
        return new Date(order.qrExpires) > new Date(); // still valid
    };

    const getDeliveryText = (order) => {
        if (order.deliveredAt) {
            return `Delivered on ${dayjs(order.updatedAt).format("DD MMM YYYY, HH:mm")}`;
        }
        return null;
    };

    // ------------------- RENDER -------------------
    return (
        <div className="max-w-6xl mx-auto p-6 bg-background text-text min-h-full space-y-8 transition-colors duration-300">
            <SEO
                title="Order History"
                description="View your past canteen orders and track your transactions on Kantevo."
                canonicalPath="/student/orders"
            />

            <h1 className="text-2xl font-bold text-primary">Order History 📦</h1>

            {/* Filters */}
            <form
                onSubmit={handleSubmit}
                className="border border-gray-200 dark:border-gray-700 bg-background rounded-2xl shadow-sm p-5 flex flex-col md:flex-row md:items-end md:gap-6 gap-4"
            >
                {/* Status filter */}
                <div className="flex flex-col">
                    <label htmlFor="status" className="text-sm font-medium text-text/80 mb-1">
                        Status
                    </label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-40 bg-background focus:ring-2 focus:ring-primary"
                    >
                        <option value="">All</option>
                        {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Payment status filter */}
                <div className="flex flex-col">
                    <label htmlFor="paymentStatus" className="text-sm font-medium text-text/80 mb-1">
                        Payment
                    </label>
                    <select
                        id="paymentStatus"
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-40 bg-background focus:ring-2 focus:ring-primary"
                    >
                        <option value="">All</option>
                        {PAYMENT_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date filters */}
                <div className="flex flex-col">
                    <label htmlFor="dateFrom" className="text-sm font-medium text-text/80 mb-1">
                        From
                    </label>
                    <input
                        id="dateFrom"
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-40 bg-background focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="dateTo" className="text-sm font-medium text-text/80 mb-1">
                        To
                    </label>
                    <input
                        id="dateTo"
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-40 bg-background focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        type="submit"
                        className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary-dark transition"
                    >
                        Search
                    </button>
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="bg-gray-200 dark:bg-gray-800 text-text px-5 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                    >
                        Clear
                    </button>
                </div>
            </form>

            {/* Error */}
            {error && <div className="text-red-500 text-center font-semibold">{error}</div>}

            {/* Orders List */}
            {loading ? (
                <p className="text-text/70 text-center">Loading orders...</p>
            ) : orders.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-text/70 p-10 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm"
                >
                    No orders found.
                </motion.div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const deliveredText = getDeliveryText(order);
                        const showQr = isQrVisible(order);

                        return (
                            <motion.div
                                key={order._id}
                                layout
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="border border-gray-200 dark:border-gray-700 rounded-2xl p-5 bg-background shadow-sm hover:shadow-md transition"
                            >
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
                                    <div>
                                        <h3 className="font-semibold text-lg text-primary">
                                            Token #{order.token}
                                        </h3>
                                        <p className="text-sm text-text/70">
                                            {order.canteen?.name || "Canteen"} —{" "}
                                            {dayjs(order.createdAt).format(
                                                "DD MMM YYYY, HH:mm"
                                            )}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${order.status === "completed"
                                                ? "bg-green-100 text-green-800"
                                                : order.status === "cancelled"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                                }`}
                                        >
                                            {order.status}
                                        </span>
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${order.paymentStatus === "paid"
                                                ? "bg-green-100 text-green-800"
                                                : order.paymentStatus === "failed"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {order.paymentStatus}
                                        </span>
                                        <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                                            {order.paymentMethod}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-3 text-sm text-text/80">
                                    <p>
                                        <span className="font-medium">Items:</span>{" "}
                                        {order.items
                                            .map(
                                                (i) =>
                                                    `${i.quantity}x ${i.item?.name || "Unknown"
                                                    }`
                                            )
                                            .join(", ")}
                                    </p>
                                    <p className="font-semibold text-primary mt-1">
                                        Total: ₹{order.totalPrice.toFixed(2)}
                                    </p>

                                    {/* Delivery text */}
                                    {deliveredText && (
                                        <p className="text-green-600 text-sm mt-1 font-medium">
                                            {deliveredText}
                                        </p>
                                    )}
                                </div>

                                {/* Show QR only if active */}
                                {showQr && (
                                    <div className="mt-4 flex justify-between items-center">
                                        <button
                                            onClick={() => setQrOrder(order)}
                                            className="bg-primary text-white px-4 py-1.5 rounded-full text-sm hover:bg-primary-dark transition"
                                        >
                                            Show QR
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Load More */}
            {hasMore && !loading && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-primary-dark disabled:bg-primary/50 transition"
                    >
                        {loadingMore ? "Loading..." : "Load More"}
                    </button>
                </div>
            )}

            {/* QR Modal */}
            {qrOrder && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setQrOrder(null)}
                >
                    <div
                        className="bg-background p-6 rounded-2xl shadow-lg relative border border-gray-200 dark:border-gray-700"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setQrOrder(null)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                        <h2 className="text-lg font-semibold mb-4 text-primary text-center">
                            Order QR Code
                        </h2>
                        <div className="flex justify-center">
                            <QRCodeCanvas
                                value={`${window.location.origin}/verify-qr?token=${qrOrder.token}`}
                                size={200}
                                marginSize={4}
                            />
                        </div>
                        <p className="mt-3 text-sm text-text/70 text-center break-all">
                            Token: {qrOrder.token}
                        </p>
                        <p className="text-xs text-text/50 text-center mt-1">
                            Show this QR at the canteen to receive your order.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
