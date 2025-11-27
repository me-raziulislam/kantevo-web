// pages/student/OrderHistory.jsx
// Premium order history page

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { QRCodeCanvas } from "qrcode.react";
import { 
    FunnelIcon, 
    XMarkIcon, 
    QrCodeIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowPathIcon
} from "@heroicons/react/24/outline";
import SEO from "../../components/SEO";

const LIMIT = 10;
const STATUS_OPTIONS = ["pending", "preparing", "ready", "completed", "cancelled"];
const PAYMENT_OPTIONS = ["pending", "paid", "failed"];

const statusConfig = {
    pending: { color: "bg-warning/10 text-warning border-warning/20", icon: ClockIcon },
    preparing: { color: "bg-accent/10 text-accent border-accent/20", icon: ArrowPathIcon },
    ready: { color: "bg-primary/10 text-primary border-primary/20", icon: CheckCircleIcon },
    completed: { color: "bg-success/10 text-success border-success/20", icon: CheckCircleIcon },
    cancelled: { color: "bg-error/10 text-error border-error/20", icon: XCircleIcon },
};

const paymentConfig = {
    pending: "bg-warning/10 text-warning",
    paid: "bg-success/10 text-success",
    failed: "bg-error/10 text-error",
};

const OrderHistory = () => {
    const { user, api, socket, loading: authLoading, accessToken } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState("");
    const [qrOrder, setQrOrder] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const [status, setStatus] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const lastCreatedAtRef = useRef(null);

    const fetchOrders = useCallback(
        async (isLoadMore = false) => {
            if (authLoading || !user || !accessToken) return;

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

                setHasMore(fetchedOrders.length === LIMIT);
                if (fetchedOrders.length > 0) {
                    lastCreatedAtRef.current = fetchedOrders[fetchedOrders.length - 1].createdAt;
                }
            } catch (err) {
                setError("Failed to fetch order history");
                toast.error("Failed to fetch order history");
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        [authLoading, user, accessToken, api, status, paymentStatus, dateFrom, dateTo]
    );

    useEffect(() => {
        lastCreatedAtRef.current = null;
        fetchOrders(false);
    }, [fetchOrders]);

    useEffect(() => {
        if (!socket) return;

        const handleOrderUpdate = (updatedOrder) => {
            setOrders((prevOrders) =>
                prevOrders.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
            );
            toast.info(`Order ${updatedOrder.token} status updated`);
            if (qrOrder && qrOrder._id === updatedOrder._id && ["completed", "cancelled"].includes(updatedOrder.status)) {
                setQrOrder(null);
            }
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
    }, [socket, qrOrder]);

    const handleSubmit = (e) => {
        e.preventDefault();
        lastCreatedAtRef.current = null;
        fetchOrders(false);
        setShowFilters(false);
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

    const isQrVisible = (order) => {
        if (!order.qrExpires || !order.qrHash) return false;
        if (order.status === "completed" || order.status === "cancelled") return false;
        return new Date(order.qrExpires) > new Date();
    };

    const getDeliveryText = (order) => {
        if (order.deliveredAt) {
            return `Delivered on ${dayjs(order.deliveredAt).format("DD MMM YYYY, HH:mm")}`;
        }
        return null;
    };

    const activeFiltersCount = [status, paymentStatus, dateFrom, dateTo].filter(Boolean).length;

    return (
        <div className="space-y-6">
            <SEO
                title="Order History"
                description="View your past canteen orders on Kantevo."
                canonicalPath="/student/orders"
            />

            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-bold">Order History</h1>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`btn-secondary px-4 py-2 flex items-center gap-2 ${activeFiltersCount > 0 ? "ring-2 ring-primary" : ""}`}
                >
                    <FunnelIcon className="w-5 h-5" />
                    Filters
                    {activeFiltersCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                            {activeFiltersCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
                {showFilters && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmit}
                        className="card p-5 space-y-4"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm text-text-muted mb-1.5">Status</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value)} className="input text-sm">
                                    <option value="">All</option>
                                    {STATUS_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-text-muted mb-1.5">Payment</label>
                                <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className="input text-sm">
                                    <option value="">All</option>
                                    {PAYMENT_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-text-muted mb-1.5">From</label>
                                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="input text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm text-text-muted mb-1.5">To</label>
                                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="input text-sm" />
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end pt-2">
                            <button type="button" onClick={clearFilters} className="btn-ghost px-4 py-2 text-sm">
                                Clear All
                            </button>
                            <button type="submit" className="btn-primary px-5 py-2 text-sm">
                                Apply Filters
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {error && <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-center">{error}</div>}

            {/* Orders List */}
            {loading ? (
                <div className="card p-12 text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-text-secondary">Loading orders...</p>
                </div>
            ) : orders.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <ClockIcon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">No orders found</h3>
                    <p className="text-text-secondary text-sm">Your order history will appear here</p>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order, i) => {
                        const deliveredText = getDeliveryText(order);
                        const showQr = isQrVisible(order);
                        const StatusIcon = statusConfig[order.status]?.icon || ClockIcon;

                        return (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className="card p-5 hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-bold text-lg">#{order.token}</h3>
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig[order.status]?.color}`}>
                                                {order.status}
                                            </span>
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${paymentConfig[order.paymentStatus]}`}>
                                                {order.paymentStatus}
                                            </span>
                                        </div>
                                        <p className="text-sm text-text-secondary mb-3">
                                            {order.canteen?.name || "Canteen"} • {dayjs(order.createdAt).format("DD MMM YYYY, HH:mm")}
                                        </p>
                                        <div className="text-sm text-text-secondary">
                                            <p className="mb-1">
                                                <span className="font-medium text-text">Items:</span>{" "}
                                                {order.items.map((i) => `${i.quantity}x ${i.item?.name || "Unknown"}`).join(", ")}
                                            </p>
                                            <p className="font-semibold text-primary text-base">₹{order.totalPrice.toFixed(2)}</p>
                                            {deliveredText && <p className="text-success text-sm mt-1">{deliveredText}</p>}
                                        </div>
                                    </div>

                                    {showQr && (
                                        <button
                                            onClick={() => setQrOrder(order)}
                                            className="btn-primary px-4 py-2 flex items-center gap-2 self-start"
                                        >
                                            <QrCodeIcon className="w-5 h-5" />
                                            Show QR
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Load More */}
            {hasMore && !loading && orders.length > 0 && (
                <div className="flex justify-center pt-4">
                    <button onClick={loadMore} disabled={loadingMore} className="btn-secondary px-6 py-2.5">
                        {loadingMore ? "Loading..." : "Load More"}
                    </button>
                </div>
            )}

            {/* QR Modal */}
            <AnimatePresence>
                {qrOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setQrOrder(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="card p-6 md:p-8 max-w-sm w-full text-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button onClick={() => setQrOrder(null)} className="absolute top-4 right-4 text-text-muted hover:text-text">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <QrCodeIcon className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold mb-4">Order QR Code</h2>
                            <div className="bg-white p-4 rounded-xl inline-block mb-4">
                                <QRCodeCanvas value={qrOrder.qrHash} size={180} marginSize={2} />
                            </div>
                            <p className="font-semibold text-lg">Token: #{qrOrder.token}</p>
                            <p className="text-sm text-text-muted mt-2">
                                Show this QR at the canteen to receive your order
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrderHistory;
