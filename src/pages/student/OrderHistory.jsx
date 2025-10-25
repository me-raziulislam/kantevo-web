import React, { useState, useEffect, useCallback, useRef } from "react";
import dayjs from "dayjs";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { QRCodeCanvas } from "qrcode.react"; // new import
import SEO from "../../components/SEO";

const LIMIT = 10;

const STATUS_OPTIONS = ["pending", "preparing", "ready", "completed", "cancelled"];
const PAYMENT_OPTIONS = ["pending", "paid", "failed"];

const OrderHistory = () => {
    const { user, api, socket } = useAuth(); // ✅ use socket from context

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

    return (
        <div className="max-w-7xl mx-auto p-4 bg-background text-text min-h-full">

            <SEO
                title="Order History"
                description="View your past canteen orders and track your transactions on Kantevo."
                canonicalPath="/student/orders"
            />

            <h1 className="text-2xl font-semibold mb-4 text-text">My Order History</h1>

            {/* Filters */}
            <form
                onSubmit={handleSubmit}
                className="bg-background border border-gray-300 dark:border-gray-600 p-4 rounded shadow mb-6 flex flex-col md:flex-row md:items-end md:space-x-4 space-y-4 md:space-y-0"
            >
                {/* Status filter */}
                <div className="flex flex-col">
                    <label htmlFor="status" className="mb-1 font-medium text-text/80">
                        Status
                    </label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-40 bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
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
                    <label htmlFor="paymentStatus" className="mb-1 font-medium text-text/80">
                        Payment Status
                    </label>
                    <select
                        id="paymentStatus"
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-40 bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="">All</option>
                        {PAYMENT_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date from */}
                <div className="flex flex-col">
                    <label htmlFor="dateFrom" className="mb-1 font-medium text-text/80">
                        Date From
                    </label>
                    <input
                        id="dateFrom"
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-40 bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* Date to */}
                <div className="flex flex-col">
                    <label htmlFor="dateTo" className="mb-1 font-medium text-text/80">
                        Date To
                    </label>
                    <input
                        id="dateTo"
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-40 bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* Buttons */}
                <div className="flex space-x-2">
                    <button
                        type="submit"
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
                    >
                        Search
                    </button>
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                    >
                        Clear
                    </button>
                </div>
            </form>

            {/* Error */}
            {error && (
                <div className="mb-4 text-red-500 font-semibold text-center">{error}</div>
            )}

            {/* Orders Table */}
            <div className="overflow-x-auto bg-background border border-gray-300 dark:border-gray-600 rounded shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-text/50">Token</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-text/50">Canteen</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-text/50">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-text/50">Payment</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-text/50">Items</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-text/50">Total (₹)</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-text/50">Date</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-text/50">Payment Method</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-text/50">QR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!loading && orders.length === 0 && (
                            <tr>
                                <td colSpan={9} className="text-center py-6 text-text/80">
                                    No orders found.
                                </td>
                            </tr>
                        )}

                        {orders.map((order) => (
                            <tr
                                key={order._id}
                                className="hover:bg-primary/10 dark:hover:bg-primary/10 border-b border-gray-200 dark:border-gray-600"
                            >
                                <td className="px-4 py-3">{order.token}</td>
                                <td className="px-4 py-3">{order.canteen?.name || "-"}</td>
                                <td className="px-4 py-3 capitalize">{order.status}</td>
                                <td className="px-4 py-3 capitalize">{order.paymentStatus}</td>
                                <td className="px-4 py-3">
                                    {order.items
                                        .map((i) => `${i.quantity}x ${i.item?.name || "Unknown"}`)
                                        .join(", ")}
                                </td>
                                <td className="px-4 py-3">₹{order.totalPrice.toFixed(2)}</td>
                                <td className="px-4 py-3">{dayjs(order.createdAt).format("DD MMM YYYY, HH:mm")}</td>
                                <td className="px-4 py-3 capitalize">{order.paymentMethod}</td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => setQrOrder(order)}
                                        className="bg-primary text-white px-2 py-1 rounded hover:bg-primary-dark transition text-sm"
                                    >
                                        Show QR
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {(loading || loadingMore) && (
                            <tr>
                                <td colSpan={9} className="text-center py-6 text-text/80">
                                    Loading...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Load More Button */}
            {hasMore && !loading && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark disabled:bg-primary/50 transition"
                    >
                        {loadingMore ? "Loading..." : "Load More"}
                    </button>
                </div>
            )}

            {/* QR Modal */}
            {qrOrder && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setQrOrder(null)}
                >
                    <div
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setQrOrder(null)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                        <h2 className="text-lg font-semibold mb-4">Order QR Code</h2>
                        <QRCodeCanvas
                            value={`${window.location.origin}/verify-qr?token=${qrOrder.token}`}
                            size={200}
                            marginSize={4}
                        />
                        <p className="mt-2 text-sm text-gray-500 break-all">
                            Token: {qrOrder.token}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
