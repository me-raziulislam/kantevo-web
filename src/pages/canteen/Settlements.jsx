// src/pages/canteen/Settlements.jsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import SEO from "../../components/SEO";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";

/**
 * Canteen Settlements page
 *
 * - Shows a summary card (last settlement)
 * - Month selector (client-side filter)
 * - Tabular list (initiatedAt, lastUpdatedAt, amount, status, utr)
 * - Pagination (load more)
 *
 * Notes:
 *  - Uses centralized `api` from useAuth()
 *  - Backend endpoint: GET /settlements/canteen/:canteenId?page=1
 *  - Row click navigates to /canteen/settlements/:id
 */

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

const SummaryCard = ({ label, value, sub }) => (
    <div className="bg-background p-4 rounded shadow border border-gray-200 dark:border-gray-700">
        <div className="text-sm text-text/70">{label}</div>
        <div className="text-2xl font-bold text-text mt-1">{value}</div>
        {sub && <div className="text-xs text-text/60 mt-1">{sub}</div>}
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

    // UI: month selector uses yyyy-mm (HTML month input)
    const [month, setMonth] = useState(() => {
        const d = new Date();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        return `${d.getFullYear()}-${mm}`;
    });

    // Fetch settlements for this canteen (paged)
    const fetchSettlements = async (pageNum = 1, append = false) => {
        if (!canteenId) return;
        try {
            setLoading(true);
            const res = await api.get(`/settlements/canteen/${canteenId}?page=${pageNum}`);
            // backend returns { settlements, page, hasMore }
            const list = res.data?.settlements || [];
            const more = res.data?.hasMore ?? false;

            setSettlements(prev => (append ? [...prev, ...list] : list));
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

    // client-side filter for selected month (month is "YYYY-MM")
    const filtered = useMemo(() => {
        if (!month) return settlements;
        const [y, m] = month.split("-");
        return settlements.filter(s => {
            if (!s?.settlementDate) return false;
            const d = new Date(s.settlementDate);
            return d.getFullYear() === Number(y) && (d.getMonth() + 1) === Number(m);
        });
    }, [settlements, month]);

    // last settlement summary (most recent by settlementDate)
    const lastSettlement = useMemo(() => {
        if (!settlements || settlements.length === 0) return null;
        const sorted = [...settlements].sort((a, b) => new Date(b.settlementDate) - new Date(a.settlementDate));
        return sorted[0];
    }, [settlements]);

    const loadMore = () => {
        if (!hasMore) return;
        const next = page + 1;
        fetchSettlements(next, true);
    };

    // navigate to details
    const openDetails = (id) => {
        navigate(`/canteen/settlements/${id}`);
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

    // Display helpers for table columns to match PhonePe-ish labels
    const getStatusLabel = (s) => {
        if (s?.utrNumber) return "SUCCESS";
        return "PENDING";
    };

    return (
        <div className="p-6 bg-background text-text min-h-full">
            <SEO title="Canteen Settlements" description="View settlements and payouts for your canteen." />

            <h1 className="text-2xl font-semibold mb-6">Settlements</h1>

            {/* Top: summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <SummaryCard
                    label="Last Settlement"
                    value={lastSettlement ? `₹${lastSettlement.finalPayableAmount}` : "—"}
                    sub={lastSettlement ? `on ${formatDateOnly(lastSettlement.settlementDate)}` : "No settlements yet"}
                />

                <div className="col-span-2 flex gap-4 items-center">
                    <div className="flex items-center gap-2 border p-2 rounded bg-background">
                        <FaCalendarAlt />
                        <button onClick={prevMonth} className="p-2 rounded hover:bg-primary/10">
                            <FaChevronLeft />
                        </button>

                        <input
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="appearance-none border-none outline-none bg-transparent text-text font-medium"
                        />

                        <button onClick={nextMonth} className="p-2 rounded hover:bg-primary/10">
                            <FaChevronRight />
                        </button>
                    </div>

                    <div className="flex-1 text-sm text-text/70">
                        <div className="font-medium">Selected month</div>
                        <div>{month ? new Date(`${month}-01`).toLocaleString(undefined, { month: 'long', year: 'numeric' }) : 'All'}</div>
                    </div>

                    {/* Action / Help area — leave room for future export/create */}
                    <div className="ml-auto text-right">
                        <div className="text-xs text-text/60">Report Template</div>
                        <div className="font-medium">Default Settlement Template</div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-background border border-gray-300 dark:border-gray-700 rounded shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold">Settlement History</h2>
                </div>

                <div className="p-4">
                    {loading && settlements.length === 0 ? (
                        <div className="text-text/70">Loading settlements...</div>
                    ) : filtered.length === 0 ? (
                        <div className="text-text/70">No settlements found for this month.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead>
                                    <tr className="text-text/70 border-b border-gray-200 dark:border-gray-700">
                                        <th className="py-3 px-4">Initiated At</th>
                                        <th className="py-3 px-4">Last Updated At</th>
                                        <th className="py-3 px-4">Amount (₹)</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4">UTR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(s => (
                                        <tr
                                            key={s._id}
                                            className="cursor-pointer hover:bg-primary/10"
                                            onClick={() => openDetails(s._id)}
                                        >
                                            <td className="py-3 px-4">{formatDateTime(s.createdAt)}</td>
                                            <td className="py-3 px-4">{formatDateTime(s.updatedAt)}</td>
                                            <td className="py-3 px-4 font-medium">₹{s.finalPayableAmount}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded text-xs ${s.utrNumber ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {getStatusLabel(s)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">{s.utrNumber || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {hasMore && !loading && (
                        <div className="text-center mt-4">
                            <button onClick={loadMore} className="px-4 py-2 bg-primary text-white rounded">
                                Load More
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settlements;
