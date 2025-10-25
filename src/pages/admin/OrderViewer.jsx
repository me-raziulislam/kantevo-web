import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import debounce from "lodash.debounce";
import SEO from "../../components/SEO";

const LIMIT = 10;

const OrderViewer = () => {
    const { api } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

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
        if (page === 1) return; // Already handled by filter reset
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

    return (
        <div className="p-6 bg-background min-h-screen text-text">

            <SEO
                title="View Orders"
                description="Monitor and analyze all student canteen orders across the Kantevo platform."
                canonicalPath="/admin/orders"
            />

            <h2 className="text-2xl font-bold mb-6 text-text">All Orders</h2>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search Student (name/email)"
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 rounded p-2 bg-background text-text"
                />
                <input
                    type="text"
                    placeholder="Search Canteen"
                    value={searchCanteen}
                    onChange={(e) => setSearchCanteen(e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 rounded p-2 bg-background text-text"
                />
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 rounded p-2 bg-background text-text"
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 rounded p-2 bg-background text-text"
                >
                    <option value="">All Payment Status</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                </select>
                <input
                    type="date"
                    placeholder="From"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 rounded p-2 bg-background text-text"
                />
                <input
                    type="date"
                    placeholder="To"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 rounded p-2 bg-background text-text"
                />
            </div>

            {/* Orders List */}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {orders.length === 0 && !loading ? (
                <p>No orders found.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="border border-gray-300 dark:border-gray-600 rounded p-4 bg-background shadow-sm"
                        >
                            <p><strong>Order ID:</strong> {order._id}</p>
                            <p><strong>Student:</strong> {order.user?.email}</p>
                            <p><strong>Canteen:</strong> {order.canteen?.name}</p>
                            <p><strong>College:</strong> {order.canteen?.college?.name}</p>
                            <p><strong>Total:</strong> ₹{order.totalPrice}</p>
                            <p><strong>Status:</strong> {order.status}</p>
                            <p><strong>Payment:</strong> {order.paymentStatus} ({order.paymentMethod})</p>
                            <p><strong>Items:</strong></p>
                            <ul className="list-disc list-inside ml-4">
                                {order.items.map((item, idx) => (
                                    <li key={idx}>
                                        {item.item?.name} × {item.quantity} — ₹{item.item?.price}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {loading && <p className="mt-4">Loading...</p>}
        </div>
    );
};

export default OrderViewer;
