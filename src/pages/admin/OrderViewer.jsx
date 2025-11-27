// src/pages/admin/OrderViewer.jsx
// Premium order viewer

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import debounce from "lodash.debounce";
import { motion, AnimatePresence } from "framer-motion";
import {
    FunnelIcon,
    MagnifyingGlassIcon,
    ClipboardDocumentListIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";
import SEO from "../../components/SEO";

const LIMIT = 10;

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

const OrderViewer = () => {
    const { api } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Filters
    const [searchStudent, setSearchStudent] = useState("");
    const [searchCanteen, setSearchCanteen] = useState("");
    const [status, setStatus] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const fetchOrders = async (filters = {}, append = false) => {
        if (loading) return;
        setLoading(true);
        setError("");
        try {
            const res = await api.get("/orders/all", {
                params: {
                    ...filters,
                    page,
                    limit: LIMIT,
                },
            });

            if (append) {
                setOrders((prev) => [...prev, ...res.data.orders]);
            } else {
                setOrders(res.data.orders);
            }

            setHasMore(page < res.data.pages);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    // Debounced filter fetch
    const debouncedFetch = useCallback(
        debounce(() => {
            setPage(1);
            fetchOrders(
                {
                    student: searchStudent || undefined,
                    canteen: searchCanteen || undefined,
                    status: status || undefined,
                    paymentStatus: paymentStatus || undefined,
                    dateFrom: dateFrom || undefined,
                    dateTo: dateTo || undefined,
                },
                false
            );
        }, 400),
        [searchStudent, searchCanteen, status, paymentStatus, dateFrom, dateTo]
    );

    // Filters change → reset page & fetch
    useEffect(() => {
        debouncedFetch();
        return debouncedFetch.cancel;
    }, [searchStudent, searchCanteen, status, paymentStatus, dateFrom, dateTo]);

    // Infinite scroll listener
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 300 &&
                hasMore &&
                !loading
            ) {
                setPage((prev) => prev + 1);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore, loading]);

    // Page change → append fetch
    useEffect(() => {
        if (page === 1) return;
        fetchOrders(
            {
                student: searchStudent || undefined,
                canteen: searchCanteen || undefined,
                status: status || undefined,
                paymentStatus: paymentStatus || undefined,
                dateFrom: dateFrom || undefined,
                dateTo: dateTo || undefined,
            },
            true
        );
    }, [page]);

    const clearFilters = () => {
        setSearchStudent("");
        setSearchCanteen("");
        setStatus("");
        setPaymentStatus("");
        setDateFrom("");
        setDateTo("");
    };

    const activeFiltersCount = [searchStudent, searchCanteen, status, paymentStatus, dateFrom, dateTo].filter(Boolean).length;

    return (
        <div className="space-y-6">
            <SEO
                title="View Orders"
                description="Monitor and analyze all student canteen orders across the Kantevo platform."
                canonicalPath="/admin/orders"
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">All Orders</h1>
                    <p className="text-text-secondary mt-1">Monitor orders across all canteens</p>
                </div>
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
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="card p-5 space-y-4"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">Filter Orders</h3>
                            <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-background-subtle rounded-lg">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm text-text-muted mb-1.5">Student</label>
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                                    <input
                                        type="text"
                                        placeholder="Name or email"
                                        value={searchStudent}
                                        onChange={(e) => setSearchStudent(e.target.value)}
                                        className="input input-with-icon text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-text-muted mb-1.5">Canteen</label>
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                                    <input
                                        type="text"
                                        placeholder="Canteen name"
                                        value={searchCanteen}
                                        onChange={(e) => setSearchCanteen(e.target.value)}
                                        className="input input-with-icon text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-text-muted mb-1.5">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="input text-sm"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="preparing">Preparing</option>
                                    <option value="ready">Ready</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-text-muted mb-1.5">Payment</label>
                                <select
                                    value={paymentStatus}
                                    onChange={(e) => setPaymentStatus(e.target.value)}
                                    className="input text-sm"
                                >
                                    <option value="">All Payment Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-text-muted mb-1.5">From Date</label>
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="input text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-text-muted mb-1.5">To Date</label>
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="input text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button onClick={clearFilters} className="btn-ghost px-4 py-2 text-sm">
                                Clear All
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error */}
            {error && (
                <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-center">
                    {error}
                </div>
            )}

            {/* Orders List */}
            {orders.length === 0 && !loading ? (
                <div className="card p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <ClipboardDocumentListIcon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">No orders found</h3>
                    <p className="text-text-secondary text-sm">Try adjusting your filters</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order, i) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.02 }}
                            className="card p-5"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <span className="font-mono text-sm text-text-muted">
                                            {order._id}
                                        </span>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig[order.status]?.color || ""}`}>
                                            {order.status}
                                        </span>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${paymentConfig[order.paymentStatus] || ""}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="text-text-muted">Student:</span>{" "}
                                            <span className="font-medium">{order.user?.email || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="text-text-muted">Canteen:</span>{" "}
                                            <span className="font-medium">{order.canteen?.name || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="text-text-muted">College:</span>{" "}
                                            <span className="font-medium">{order.canteen?.college?.name || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="text-text-muted">Payment Method:</span>{" "}
                                            <span className="font-medium">{order.paymentMethod || '-'}</span>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <span className="text-text-muted text-sm">Items:</span>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {order.items.map((item, idx) => (
                                                <span key={idx} className="px-2.5 py-1 rounded-lg text-xs bg-background-subtle">
                                                    {item.item?.name} × {item.quantity}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-2xl font-bold text-primary">₹{order.totalPrice}</p>
                                    <p className="text-xs text-text-muted mt-1">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-text-secondary">Loading orders...</p>
                </div>
            )}

            {/* Load More Indicator */}
            {hasMore && !loading && orders.length > 0 && (
                <p className="text-center text-text-muted text-sm">Scroll for more...</p>
            )}
        </div>
    );
};

export default OrderViewer;
