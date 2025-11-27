// src/pages/admin/AdminSettlementList.jsx
// Premium settlement list page

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
    BanknotesIcon,
    FunnelIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EyeIcon,
    XMarkIcon,
    BuildingStorefrontIcon,
    UserIcon,
    CalendarDaysIcon,
    CheckCircleIcon,
    ClockIcon
} from "@heroicons/react/24/outline";
import SEO from "../../components/SEO";

const AdminSettlementList = () => {
    const { api } = useAuth();

    const [loading, setLoading] = useState(true);
    const [settlements, setSettlements] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        canteen: "",
        owner: "",
        dateFrom: "",
        dateTo: ""
    });

    const fetchSettlements = async (pageNum = 1) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: pageNum,
                limit: 20,
                ...Object.fromEntries(
                    Object.entries(filters).filter(([_, v]) => v)
                )
            }).toString();

            const res = await api.get(`/settlements?${params}`);
            setSettlements(res.data.settlements || []);
            setPages(res.data.pages || 1);
            setPage(res.data.page || 1);
        } catch (err) {
            toast.error("Failed to load settlements");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettlements(1);
    }, []);

    const applyFilters = () => {
        fetchSettlements(1);
        setShowFilters(false);
    };

    const clearFilters = () => {
        setFilters({
            canteen: "",
            owner: "",
            dateFrom: "",
            dateTo: ""
        });
    };

    const activeFiltersCount = Object.values(filters).filter(Boolean).length;

    // Helper to check if settlement is settled (same logic as details page)
    const isSettled = (s) => s.status === 'settled' || s.utrNumber;

    // Calculate totals
    const totalPayable = settlements.reduce((sum, s) => sum + (s.finalPayableAmount || 0), 0);
    const settledCount = settlements.filter(s => isSettled(s)).length;
    const pendingCount = settlements.filter(s => !isSettled(s)).length;

    return (
        <div className="space-y-6">
            <SEO title="Admin Settlements" canonicalPath="/admin/settlements" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">All Settlements</h1>
                    <p className="text-text-secondary mt-1">View and manage all settlements</p>
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

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="card p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <BanknotesIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{settlements.length}</p>
                            <p className="text-sm text-text-muted">Total Settlements</p>
                        </div>
                    </div>
                </div>
                <div className="card p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                            <CheckCircleIcon className="w-5 h-5 text-success" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{settledCount}</p>
                            <p className="text-sm text-text-muted">Settled</p>
                        </div>
                    </div>
                </div>
                <div className="card p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                            <ClockIcon className="w-5 h-5 text-warning" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{pendingCount}</p>
                            <p className="text-sm text-text-muted">Pending</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="card p-5 space-y-4"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">Filter Settlements</h3>
                            <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-background-subtle rounded-lg">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm text-text-muted mb-1.5">Canteen ID</label>
                                <input
                                    type="text"
                                    placeholder="Enter canteen ID"
                                    value={filters.canteen}
                                    onChange={e => setFilters({ ...filters, canteen: e.target.value })}
                                    className="input text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-text-muted mb-1.5">Owner ID</label>
                                <input
                                    type="text"
                                    placeholder="Enter owner ID"
                                    value={filters.owner}
                                    onChange={e => setFilters({ ...filters, owner: e.target.value })}
                                    className="input text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-text-muted mb-1.5">From Date</label>
                                <input
                                    type="date"
                                    value={filters.dateFrom}
                                    onChange={e => setFilters({ ...filters, dateFrom: e.target.value })}
                                    className="input text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-text-muted mb-1.5">To Date</label>
                                <input
                                    type="date"
                                    value={filters.dateTo}
                                    onChange={e => setFilters({ ...filters, dateTo: e.target.value })}
                                    className="input text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end pt-2">
                            <button onClick={clearFilters} className="btn-ghost px-4 py-2 text-sm">
                                Clear All
                            </button>
                            <button onClick={applyFilters} className="btn-primary px-5 py-2 text-sm">
                                Apply Filters
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Settlement List */}
            {loading ? (
                <div className="card p-12 text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-text-secondary">Loading settlements...</p>
                </div>
            ) : settlements.length === 0 ? (
                <div className="card p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <BanknotesIcon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">No settlements found</h3>
                    <p className="text-text-secondary text-sm">Create a new settlement to get started</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {settlements.map((s, i) => (
                        <motion.div
                            key={s._id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="card p-5"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isSettled(s) ? 'bg-success/10' : 'bg-warning/10'
                                        }`}>
                                        {isSettled(s) ? (
                                            <CheckCircleIcon className="w-6 h-6 text-success" />
                                        ) : (
                                            <ClockIcon className="w-6 h-6 text-warning" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h3 className="font-semibold text-lg">
                                                {s.canteen?.name || "Unknown Canteen"}
                                            </h3>
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${isSettled(s)
                                                    ? 'bg-success/10 text-success'
                                                    : 'bg-warning/10 text-warning'
                                                }`}>
                                                {isSettled(s) ? 'Settled' : 'Pending'}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-text-muted">
                                            <span className="flex items-center gap-1">
                                                <UserIcon className="w-4 h-4" />
                                                {s.owner?.name} ({s.owner?.email})
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <CalendarDaysIcon className="w-4 h-4" />
                                                {new Date(s.settlementDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-primary">₹{s.finalPayableAmount}</p>
                                        <p className="text-xs text-text-muted">Final Payable</p>
                                    </div>
                                    <Link
                                        to={`/admin/settlements/${s._id}`}
                                        className="btn-secondary px-4 py-2 flex items-center gap-2"
                                    >
                                        <EyeIcon className="w-5 h-5" />
                                        View
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-4">
                    <button
                        disabled={page === 1}
                        onClick={() => fetchSettlements(page - 1)}
                        className="btn-secondary px-4 py-2 flex items-center gap-2 disabled:opacity-50"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                        Previous
                    </button>
                    <span className="text-text-secondary">
                        Page <span className="font-semibold text-text">{page}</span> of {pages}
                    </span>
                    <button
                        disabled={page === pages}
                        onClick={() => fetchSettlements(page + 1)}
                        className="btn-secondary px-4 py-2 flex items-center gap-2 disabled:opacity-50"
                    >
                        Next
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminSettlementList;
