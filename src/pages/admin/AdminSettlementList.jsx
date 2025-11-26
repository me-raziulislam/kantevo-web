import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import SEO from "../../components/SEO";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const AdminSettlementList = () => {
    const { api } = useAuth();

    const [loading, setLoading] = useState(true);
    const [settlements, setSettlements] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

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
                ...filters
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
    };

    return (
        <div className="p-6">
            <SEO title="Admin Settlements" />

            <h2 className="text-2xl font-bold mb-4">All Settlements</h2>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Canteen ID"
                    value={filters.canteen}
                    onChange={e => setFilters({ ...filters, canteen: e.target.value })}
                    className="border p-2 rounded"
                />
                <input
                    type="text"
                    placeholder="Owner ID"
                    value={filters.owner}
                    onChange={e => setFilters({ ...filters, owner: e.target.value })}
                    className="border p-2 rounded"
                />
                <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={e => setFilters({ ...filters, dateFrom: e.target.value })}
                    className="border p-2 rounded"
                />
                <input
                    type="date"
                    value={filters.dateTo}
                    onChange={e => setFilters({ ...filters, dateTo: e.target.value })}
                    className="border p-2 rounded"
                />
            </div>

            <button
                onClick={applyFilters}
                className="px-4 py-2 bg-primary text-white rounded mb-4"
            >
                Apply Filters
            </button>

            {/* Settlement List */}
            <div className="space-y-3">
                {loading ? (
                    <p>Loading settlements...</p>
                ) : settlements.length === 0 ? (
                    <p>No settlements found.</p>
                ) : (
                    settlements.map(s => (
                        <div
                            key={s._id}
                            className="border p-4 rounded shadow-sm bg-background"
                        >
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-semibold text-lg">
                                        {s.canteen?.name || "Unknown Canteen"}
                                    </p>
                                    <p className="text-sm text-text/70">
                                        Owner: {s.owner?.name} ({s.owner?.email})
                                    </p>
                                    <p className="text-sm text-text/70">
                                        Date: {new Date(s.settlementDate).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-text/70">
                                        Amount: ₹{s.finalPayableAmount}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Link
                                        to={`/admin/settlements/${s._id}`}
                                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {pages > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => fetchSettlements(page - 1)}
                        className="px-3 py-1 bg-gray-300 rounded"
                    >
                        Prev
                    </button>
                    <span>Page {page} of {pages}</span>
                    <button
                        disabled={page === pages}
                        onClick={() => fetchSettlements(page + 1)}
                        className="px-3 py-1 bg-gray-300 rounded"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminSettlementList;
