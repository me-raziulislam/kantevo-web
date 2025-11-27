// src/pages/canteen/Settlements.jsx
// Premium settlements list page

import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
    BanknotesIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ArrowRightIcon,
    CalendarDaysIcon,
    CheckCircleIcon,
    ClockIcon
} from "@heroicons/react/24/outline";
import SEO from "../../components/SEO";

const formatDateTime = (iso) => {
    if (!iso) return "-";
    try {
        return new Date(iso).toLocaleString();
    } catch {
        return iso;
    }
};

const formatDateOnly = (iso) => {
    if (!iso) return "-";
    try {
        return new Date(iso).toLocaleDateString();
    } catch {
        return iso;
    }
};

const SummaryCard = ({ label, value, subtext, icon: Icon }) => (
    <div className="card p-5">
        <div className="flex items-center gap-3 mb-2">
            {Icon && (
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                </div>
            )}
            <span className="text-sm text-text-muted">{label}</span>
        </div>
        <p className="text-2xl font-bold text-primary">{value}</p>
        {subtext && <p className="text-xs text-text-muted mt-1">{subtext}</p>}
    </div>
);

const Settlements = () => {
    const { api, user } = useAuth();
    const canteenId = user?.canteen;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [settlements, setSettlements] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    // Month selector (YYYY-MM)
    const [month, setMonth] = useState(() => {
        const d = new Date();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        return `${d.getFullYear()}-${mm}`;
    });

    const fetchSettlements = async (pageNum = 1, append = false) => {
        if (!canteenId) return;
        try {
            setLoading(true);
            const res = await api.get(`/settlements/canteen/${canteenId}?page=${pageNum}`);
            const list = res.data?.settlements || [];
            const more = res.data?.hasMore ?? false;

            setSettlements((prev) => (append ? [...prev, ...list] : list));
            setHasMore(Boolean(more));
            setPage(Number(res.data?.page || pageNum));
        } catch (err) {
            console.error("fetchSettlements error:", err);
            toast.error("Failed to load settlements");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!canteenId) return;
        fetchSettlements(1, false);
    }, [canteenId, api]);

    // Client-side filter for selected month
    const filtered = useMemo(() => {
        if (!month) return settlements;
        const [y, m] = month.split("-");
        return settlements.filter((s) => {
            if (!s?.settlementDate) return false;
            const d = new Date(s.settlementDate);
            return d.getFullYear() === Number(y) && d.getMonth() + 1 === Number(m);
        });
    }, [settlements, month]);

    // Last settlement summary
    const lastSettlement = useMemo(() => {
        if (!settlements || settlements.length === 0) return null;
        const sorted = [...settlements].sort((a, b) => new Date(b.settlementDate) - new Date(a.settlementDate));
        return sorted[0];
    }, [settlements]);

    const loadMore = () => {
        if (!hasMore) return;
        fetchSettlements(page + 1, true);
    };

    const prevMonth = () => {
        if (!month) return;
        const [y, mm] = month.split("-");
        const d = new Date(Number(y), Number(mm) - 1, 1);
        d.setMonth(d.getMonth() - 1);
        const newMM = String(d.getMonth() + 1).padStart(2, "0");
        setMonth(`${d.getFullYear()}-${newMM}`);
    };

    const nextMonth = () => {
        if (!month) return;
        const [y, mm] = month.split("-");
        const d = new Date(Number(y), Number(mm) - 1, 1);
        d.setMonth(d.getMonth() + 1);
        const newMM = String(d.getMonth() + 1).padStart(2, "0");
        setMonth(`${d.getFullYear()}-${newMM}`);
    };

    const getStatusBadge = (s) => {
        if (s?.utrNumber) {
            return (
                <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-success/10 text-success flex items-center gap-1">
                    <CheckCircleIcon className="w-3 h-3" />
                    Settled
                </span>
            );
        }
        return (
            <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-warning/10 text-warning flex items-center gap-1">
                <ClockIcon className="w-3 h-3" />
                Pending
            </span>
        );
    };

    const getMonthLabel = () => {
        if (!month) return "All";
        return new Date(`${month}-01`).toLocaleString(undefined, { month: "long", year: "numeric" });
    };

    return (
        <div className="space-y-6">
            <SEO title="Settlements" description="View your canteen settlement history." canonicalPath="/canteen/settlements" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold">Settlements</h1>

                {/* Month Selector */}
                <div className="flex items-center gap-2 bg-background-subtle rounded-xl p-1">
                    <button onClick={prevMonth} className="p-2 hover:bg-background rounded-lg transition-colors">
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2 px-3">
                        <CalendarDaysIcon className="w-4 h-4 text-text-muted" />
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="bg-transparent border-none outline-none font-medium text-text"
                        />
                    </div>
                    <button onClick={nextMonth} className="p-2 hover:bg-background rounded-lg transition-colors">
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SummaryCard
                    icon={BanknotesIcon}
                    label="Last Settlement"
                    value={lastSettlement ? `₹${lastSettlement.finalPayableAmount}` : "—"}
                    subtext={lastSettlement ? `on ${formatDateOnly(lastSettlement.settlementDate)}` : "No settlements yet"}
                />
                <div className="sm:col-span-2 card p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-text-muted mb-1">Selected Month</p>
                            <p className="text-lg font-semibold">{getMonthLabel()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-text-muted mb-1">Settlements Found</p>
                            <p className="text-lg font-semibold">{filtered.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Settlements Table */}
            <div className="card overflow-hidden">
                <div className="p-4 border-b border-border">
                    <h2 className="font-semibold">Settlement History</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-background-subtle">
                                <th className="text-left py-4 px-4 font-medium text-text-muted">Initiated</th>
                                <th className="text-left py-4 px-4 font-medium text-text-muted">Last Updated</th>
                                <th className="text-right py-4 px-4 font-medium text-text-muted">Amount</th>
                                <th className="text-left py-4 px-4 font-medium text-text-muted">Status</th>
                                <th className="text-left py-4 px-4 font-medium text-text-muted">UTR</th>
                                <th className="text-right py-4 px-4 font-medium text-text-muted"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && settlements.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">
                                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                        <span className="text-text-muted">Loading settlements...</span>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">
                                        <BanknotesIcon className="w-12 h-12 text-text-muted mx-auto mb-3" />
                                        <p className="font-semibold mb-1">No settlements found</p>
                                        <p className="text-text-muted text-sm">No settlements for {getMonthLabel()}</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((s, i) => (
                                    <motion.tr
                                        key={s._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.02 }}
                                        className="border-b border-border hover:bg-background-subtle transition-colors cursor-pointer"
                                        onClick={() => navigate(`/canteen/settlements/${s._id}`)}
                                    >
                                        <td className="py-4 px-4 text-text-secondary">{formatDateTime(s.createdAt)}</td>
                                        <td className="py-4 px-4 text-text-secondary">{formatDateTime(s.updatedAt)}</td>
                                        <td className="py-4 px-4 text-right font-semibold text-primary">₹{s.finalPayableAmount}</td>
                                        <td className="py-4 px-4">{getStatusBadge(s)}</td>
                                        <td className="py-4 px-4 font-mono text-xs text-text-muted">{s.utrNumber || "-"}</td>
                                        <td className="py-4 px-4 text-right">
                                            <ArrowRightIcon className="w-4 h-4 text-text-muted" />
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Load More */}
            {hasMore && !loading && (
                <div className="flex justify-center">
                    <button onClick={loadMore} className="btn-secondary px-6 py-2.5">
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default Settlements;
