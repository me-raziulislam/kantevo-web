// src/pages/canteen/OrderManager.jsx
// Premium order manager (payment field non-editable)

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import {
    FunnelIcon,
    MagnifyingGlassIcon,
    ClockIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";
import SEO from "../../components/SEO";

const LIMIT = 10;
const STATUS_OPTIONS = ["pending", "preparing", "ready", "completed", "cancelled"];

const statusConfig = {
    pending: { color: "bg-warning/10 text-warning border-warning/20" },
    preparing: { color: "bg-accent/10 text-accent border-accent/20" },
    ready: { color: "bg-primary/10 text-primary border-primary/20" },
    completed: { color: "bg-success/10 text-success border-success/20" },
    cancelled: { color: "bg-error/10 text-error border-error/20" },
};

const paymentConfig = {
    pending: "bg-warning/10 text-warning",
    paid: "bg-success/10 text-success",
    failed: "bg-error/10 text-error",
};

const OrderManager = () => {
    const { user, api, socket } = useAuth();
    const canteenId = user?.canteen;

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    const [status, setStatus] = useState("");
    const [tokenSearch, setTokenSearch] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const lastCreatedAtRef = useRef(null);
    const [updatingStatusIds, setUpdatingStatusIds] = useState(new Set());

    const fetchOrders = useCallback(async (isLoadMore = false) => {
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
                query += `&lastCreatedAt=${encodeURIComponent(lastCreatedAtRef.current)}`;
            }

            const res = await api.get(`/orders/canteen/${canteenId}${query}`);
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
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [canteenId, status, tokenSearch, dateFrom, dateTo, api]);

    useEffect(() => {
        lastCreatedAtRef.current = null;
        fetchOrders(false);
    }, [fetchOrders]);

    useEffect(() => {
        if (!socket || !canteenId) return;

        const handleOrderUpdated = (updatedOrder) => {
            setOrders((prev) => prev.map((order) => (order._id === updatedOrder._id ? updatedOrder : order)));
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
        setShowFilters(false);
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

    const updateOrderStatus = async (orderId, newStatus) => {
        if (!orderId || !newStatus) return;
        setUpdatingStatusIds((prev) => new Set(prev).add(orderId));

        try {
            const res = await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            setOrders((prev) => prev.map((order) => (order._id === orderId ? res.data : order)));
            toast.success(`Order status updated to "${newStatus}"`);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update order status.");
        } finally {
            setUpdatingStatusIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(orderId);
                return newSet;
            });
        }
    };

    const activeFiltersCount = [status, tokenSearch, dateFrom, dateTo].filter(Boolean).length;

    return (
        <div className="space-y-6">
            <SEO title="Manage Orders" description="View and manage canteen orders." canonicalPath="/canteen/orders" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold">Order Management</h1>
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
            {showFilters && (
                <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    onSubmit={handleSubmit}
                    className="card p-5 space-y-4"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                            <label className="block text-sm text-text-muted mb-1.5">Order Token</label>
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <input
                                    type="text"
                                    value={tokenSearch}
                                    onChange={(e) => setTokenSearch(e.target.value)}
                                    placeholder="Search by token"
                                    className="input pl-9 text-sm"
                                />
                            </div>
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
                        <button type="button" onClick={clearFilters} className="btn-ghost px-4 py-2 text-sm">Clear All</button>
                        <button type="submit" className="btn-primary px-5 py-2 text-sm">Apply Filters</button>
                    </div>
                </motion.form>
            )}

            {/* Orders Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-background-subtle">
                                <th className="text-left py-4 px-4 font-medium text-text-muted">Token</th>
                                <th className="text-left py-4 px-4 font-medium text-text-muted">Customer</th>
                                <th className="text-left py-4 px-4 font-medium text-text-muted">Status</th>
                                <th className="text-left py-4 px-4 font-medium text-text-muted">Payment</th>
                                <th className="text-left py-4 px-4 font-medium text-text-muted">Items</th>
                                <th className="text-right py-4 px-4 font-medium text-text-muted">Total</th>
                                <th className="text-left py-4 px-4 font-medium text-text-muted">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && orders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12">
                                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                        <span className="text-text-muted">Loading orders...</span>
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12">
                                        <ClockIcon className="w-12 h-12 text-text-muted mx-auto mb-3" />
                                        <p className="font-semibold mb-1">No orders found</p>
                                        <p className="text-text-muted text-sm">Orders will appear here when customers place them</p>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order, i) => (
                                    <motion.tr
                                        key={order._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.02 }}
                                        className="border-b border-border hover:bg-background-subtle transition-colors"
                                    >
                                        <td className="py-4 px-4 font-semibold">#{order.token}</td>
                                        <td className="py-4 px-4 text-text-secondary">{order.user?.name || "-"}</td>
                                        <td className="py-4 px-4">
                                            <select
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${statusConfig[order.status]?.color || ""}`}
                                                value={order.status}
                                                disabled={updatingStatusIds.has(order._id)}
                                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                            >
                                                {STATUS_OPTIONS.map((opt) => (
                                                    <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="py-4 px-4">
                                            {/* Payment status - NON-EDITABLE as requested */}
                                            <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${paymentConfig[order.paymentStatus] || ""}`}>
                                                {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-text-secondary max-w-[200px] truncate">
                                            {order.items.map((i) => `${i.quantity}x ${i.item?.name || "Unknown"}`).join(", ")}
                                        </td>
                                        <td className="py-4 px-4 text-right font-semibold text-primary">₹{order.totalPrice.toFixed(2)}</td>
                                        <td className="py-4 px-4 text-text-muted">{dayjs(order.createdAt).format("DD MMM, HH:mm")}</td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Load More */}
            {hasMore && !loading && orders.length > 0 && (
                <div className="flex justify-center">
                    <button onClick={loadMore} disabled={loadingMore} className="btn-secondary px-6 py-2.5">
                        {loadingMore ? "Loading..." : "Load More"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default OrderManager;
