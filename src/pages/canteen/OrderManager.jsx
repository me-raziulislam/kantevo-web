import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import SEO from "../../components/SEO";
import dayjs from "dayjs";

const LIMIT = 10;

const STATUS_OPTIONS = [
    "pending",
    "preparing",
    "ready",
    "completed",
    "cancelled",
];

const PAYMENT_OPTIONS = ["pending", "paid", "failed"];

const OrderManager = () => {
    const { user, api, socket } = useAuth(); // get centralized api instance
    const canteenId = user?.canteen;

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState("");

    const [status, setStatus] = useState("");
    const [tokenSearch, setTokenSearch] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const lastCreatedAtRef = useRef(null);

    // Track updating states per order (by id)
    const [updatingStatusIds, setUpdatingStatusIds] = useState(new Set());
    const [updatingPaymentIds, setUpdatingPaymentIds] = useState(new Set());

    const fetchOrders = useCallback(
        async (isLoadMore = false) => {
            if (!canteenId) return;

            try {
                if (isLoadMore) setLoadingMore(true);
                else setLoading(true);

                let query = `?limit=${LIMIT}`;

                if (status) query += `&status=${status}`;
                if (tokenSearch) query += `&token=${tokenSearch}`;
                if (dateFrom) query += `&from=${dateFrom}`;
                if (dateTo) query += `&to=${dateTo}`;

                if (isLoadMore && lastCreatedAtRef.current) {
                    query += `&lastCreatedAt=${encodeURIComponent(
                        lastCreatedAtRef.current
                    )}`;
                }

                const res = await api.get(
                    `/orders/canteen/${canteenId}${query}`
                );

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
                    lastCreatedAtRef.current =
                        fetchedOrders[fetchedOrders.length - 1].createdAt;
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch orders");
                toast.error("Failed to fetch orders");
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        [canteenId, status, tokenSearch, dateFrom, dateTo, api]
    );

    useEffect(() => {
        lastCreatedAtRef.current = null;
        fetchOrders(false);
    }, [fetchOrders]);

    // ------------------- SOCKET LISTENER -------------------
    useEffect(() => {
        if (!socket || !canteenId) return;

        // ✅ optionally join canteen room if your backend supports it
        // socket.current.emit("joinCanteen", canteenId);

        const handleOrderUpdated = (updatedOrder) => {
            setOrders((prev) =>
                prev.map((order) =>
                    order._id === updatedOrder._id ? updatedOrder : order
                )
            );
            toast.info(`Order "${updatedOrder.token}" updated`);
        };

        const handleOrderCreated = (newOrder) => {
            setOrders((prev) => [newOrder, ...prev]);
            toast.success(`New order "${newOrder.token}" received`);
        };

        socket.on("orderStatusUpdated", handleOrderUpdated);
        socket.on("newOrder", handleOrderCreated);

        return () => {
            socket.off("orderStatusUpdated", handleOrderUpdated);
            socket.off("newOrder", handleOrderCreated);
        };
    }, [socket, canteenId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        lastCreatedAtRef.current = null;
        fetchOrders(false);
    };

    const clearFilters = () => {
        setStatus("");
        setTokenSearch("");
        setDateFrom("");
        setDateTo("");
        lastCreatedAtRef.current = null;
        fetchOrders(false);
    };

    const loadMore = () => {
        if (loadingMore || !hasMore) return;
        fetchOrders(true);
    };

    // Update order status function
    const updateOrderStatus = async (orderId, newStatus) => {
        if (!orderId || !newStatus) return;
        setUpdatingStatusIds((prev) => new Set(prev).add(orderId));

        try {
            const res = await api.patch(
                `/orders/${orderId}/status`,
                { status: newStatus }
            );

            const updatedOrder = res.data;

            setOrders((prev) =>
                prev.map((order) => (order._id === orderId ? updatedOrder : order))
            );
            toast.success(`Order status updated to "${newStatus}"`);
        } catch (err) {
            console.error(err);
            toast.error(
                err.response?.data?.message || "Failed to update order status."
            );
        } finally {
            setUpdatingStatusIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(orderId);
                return newSet;
            });
        }
    };

    // Update payment status function
    const updatePaymentStatus = async (orderId, newPaymentStatus) => {
        if (!orderId || !newPaymentStatus) return;
        setUpdatingPaymentIds((prev) => new Set(prev).add(orderId));

        try {
            const res = await api.patch(
                `/orders/${orderId}/payment`,
                { paymentStatus: newPaymentStatus }
            );

            const updatedOrder = res.data;

            setOrders((prev) =>
                prev.map((order) => (order._id === orderId ? updatedOrder : order))
            );
            toast.success(`Payment status updated to "${newPaymentStatus}"`);
        } catch (err) {
            console.error(err);
            toast.error(
                err.response?.data?.message || "Failed to update payment status."
            );
        } finally {
            setUpdatingPaymentIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(orderId);
                return newSet;
            });
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 bg-background text-text min-h-full">

            <SEO
                title="Manage Orders"
                description="View and fulfill student orders efficiently with Kantevo’s canteen order management system."
                canonicalPath="/canteen/orders"
            />

            <h1 className="text-2xl font-semibold mb-4 text-text">Orders Management</h1>

            {/* Filters Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-background border border-gray-300 dark:border-gray-600 p-4 rounded shadow mb-6 flex flex-col md:flex-row md:items-end md:space-x-4 space-y-4 md:space-y-0"
            >
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

                <div className="flex flex-col flex-1 min-w-[150px]">
                    <label htmlFor="tokenSearch" className="mb-1 font-medium text-text/80">
                        Order Token
                    </label>
                    <input
                        id="tokenSearch"
                        type="text"
                        value={tokenSearch}
                        onChange={(e) => setTokenSearch(e.target.value)}
                        placeholder="Search by token"
                        className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

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
                            <th className="px-4 py-3 text-left text-sm font-medium text-text/50">
                                Token
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-text/50">
                                User
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-text/50">
                                Status
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-text/50">
                                Payment
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-text/50">
                                Items
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-text/50">
                                Total (₹)
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-text/50">
                                Created At
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 && !loading && (
                            <tr>
                                <td colSpan={7} className="text-center py-6 text-text/80">
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
                                <td className="px-4 py-3">{order.user?.name || "-"}</td>

                                {/* Order Status dropdown */}
                                <td className="px-4 py-3">
                                    <select
                                        className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={order.status}
                                        disabled={updatingStatusIds.has(order._id)}
                                        onChange={(e) =>
                                            updateOrderStatus(order._id, e.target.value)
                                        }
                                    >
                                        {STATUS_OPTIONS.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </td>

                                {/* Payment Status dropdown */}
                                <td className="px-4 py-3">
                                    <select
                                        className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={order.paymentStatus}
                                        disabled={updatingPaymentIds.has(order._id)}
                                        onChange={(e) =>
                                            updatePaymentStatus(order._id, e.target.value)
                                        }
                                    >
                                        {PAYMENT_OPTIONS.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </td>

                                <td className="px-4 py-3 text-text">
                                    {order.items
                                        .map((i) => `${i.quantity}x ${i.item?.name || "Unknown"}`)
                                        .join(", ")}
                                </td>
                                <td className="px-4 py-3">₹{order.totalPrice.toFixed(2)}</td>
                                <td className="px-4 py-3">
                                    {dayjs(order.createdAt).format("DD MMM YYYY, HH:mm")}
                                </td>
                            </tr>
                        ))}
                        {loading && (
                            <tr>
                                <td colSpan={7} className="text-center py-6 text-text/80">
                                    Loading...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Load More */}
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
        </div>
    );
};

export default OrderManager;
