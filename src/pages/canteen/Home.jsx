import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaBox, FaClipboardList, FaCheckCircle, FaQrcode, FaChartLine } from "react-icons/fa";
import { Html5Qrcode } from "html5-qrcode"; // ✅ direct Html5Qrcode for manual control
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Simple skeleton component
const SkeletonBox = ({ className }) => (
    <div className={`bg-gray-300 dark:bg-gray-700 animate-pulse rounded ${className}`} />
);

const Home = () => {
    const { user, api } = useAuth();
    const canteenId = user?.canteen;

    const [itemsCount, setItemsCount] = useState(0);
    const [ordersCount, setOrdersCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [recentOrders, setRecentOrders] = useState([]);
    const [stats, setStats] = useState({ today: 0, total: 0 });

    // New stats states
    const [moneyStats, setMoneyStats] = useState(null); // revenue + orders for day/week/month
    const [mostSoldItemToday, setMostSoldItemToday] = useState(null);
    const [last7DaysRevenue, setLast7DaysRevenue] = useState([]);

    // Loading states for skeletons
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingChart, setLoadingChart] = useState(true);

    // QR scanner states
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [scanError, setScanError] = useState(null);
    const [lastScanned, setLastScanned] = useState(null);

    const scannerRef = useRef(null); // store scanner instance
    const dailyRefreshIntervalRef = useRef(null); // keep interval id so we can clear it

    // Fetch normal stats + new backend stats
    useEffect(() => {
        if (!canteenId) return;

        const fetchStats = async () => {
            try {
                setLoadingStats(true);
                setLoadingChart(true);

                // Fetch items
                const itemsRes = await api.get(`/items/${canteenId}`);
                setItemsCount(Array.isArray(itemsRes?.data) ? itemsRes.data.length : 0);

                // Fetch orders
                const ordersRes = await api.get(`/orders/canteen/${canteenId}`);
                const allOrders = Array.isArray(ordersRes?.data) ? ordersRes.data : [];
                setOrdersCount(allOrders.length);

                const completed = allOrders.filter(
                    (order) => order.status === "completed"
                );
                setCompletedCount(completed.length);

                const sorted = allOrders.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setRecentOrders(sorted.slice(0, 5));

                // ✅ Fetch new money + orders stats from backend
                const statsRes = await api.get(`/canteens/${canteenId}/stats`);

                // match backend response to state
                // Backend returns:
                // {
                //   revenueAndOrders: { day: { totalRevenue, orderCount }, week: {...}, month: {...} },
                //   mostSoldToday: { name, qty } | null,
                //   revenueLast7Days: [{ _id:{year,month,day}, totalRevenue }]
                // }
                const ro = statsRes?.data?.revenueAndOrders || {};

                // Normalize to the shape the UI expects (today/week/month)
                const normalized = {
                    revenue: {
                        today: ro?.day?.totalRevenue || 0,
                        week: ro?.week?.totalRevenue || 0,
                        month: ro?.month?.totalRevenue || 0,
                    },
                    orders: {
                        today: ro?.day?.orderCount || 0,
                        week: ro?.week?.orderCount || 0,
                        month: ro?.month?.orderCount || 0,
                    },
                };
                setMoneyStats(normalized);

                // Normalize most sold (backend uses `qty`; UI shows `count`)
                const top = statsRes?.data?.mostSoldToday || null;
                setMostSoldItemToday(top ? { name: top.name, count: top.qty } : null);

                // Transform last 7 days into { date: "DD Mon", revenue } and fill missing days with 0
                const raw7 = Array.isArray(statsRes?.data?.revenueLast7Days) ? statsRes.data.revenueLast7Days : [];
                const map = new Map();
                raw7.forEach((r) => {
                    if (!r?._id) return;
                    const y = r._id.year;
                    const m = r._id.month; // 1-12
                    const d = r._id.day;
                    const key = `${y}-${m}-${d}`;
                    map.set(key, r.totalRevenue || 0);
                });

                const today = new Date();
                const series = [];
                for (let i = 6; i >= 0; i--) {
                    const dt = new Date(today);
                    dt.setDate(today.getDate() - i);
                    const y = dt.getFullYear();
                    const m = dt.getMonth() + 1; // 1-12
                    const d = dt.getDate();
                    const key = `${y}-${m}-${d}`;
                    const label = dt.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                    });
                    series.push({
                        date: label,
                        revenue: map.get(key) || 0,
                    });
                }
                setLast7DaysRevenue(series);
            } catch (err) {
                console.error("Error fetching stats:", err);
                // Ensure UI doesn't crash
                setMoneyStats({
                    revenue: { today: 0, week: 0, month: 0 },
                    orders: { today: 0, week: 0, month: 0 },
                });
                setMostSoldItemToday(null);
                setLast7DaysRevenue([]);
            } finally {
                setLoadingStats(false);
                setLoadingChart(false);
            }
        };

        fetchStats();

        // ✅ Auto-refresh at midnight without reload
        const now = new Date();
        const msUntilMidnight =
            new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
        const midnightTimeout = setTimeout(() => {
            fetchStats();
            // clear any previous interval just in case
            if (dailyRefreshIntervalRef.current) clearInterval(dailyRefreshIntervalRef.current);
            dailyRefreshIntervalRef.current = setInterval(fetchStats, 24 * 60 * 60 * 1000); // refresh every day
        }, msUntilMidnight);

        return () => {
            clearTimeout(midnightTimeout);
            if (dailyRefreshIntervalRef.current) clearInterval(dailyRefreshIntervalRef.current);
        };
    }, [canteenId, api]);

    // Handle QR scan
    const handleScan = async (text) => {
        if (!text) return;
        if (text === lastScanned) return; // Prevent duplicate scans
        setLastScanned(text);

        stopScanner(); // ✅ Stop scanning after first result

        try {
            const qrHash = text.split("/").pop(); // if URL, take last part
            const res = await api.get(`/orders/verify-qr/${qrHash}`);
            setScanResult(res?.data?.order || null);
            setScanError(null);
        } catch (err) {
            console.error(err);
            setScanError(err?.response?.data?.msg || "Invalid or expired QR code");
            setScanResult(null);
        }
    };

    // Start scanner
    const startScanner = () => {
        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;

        scanner.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            (decodedText) => {
                handleScan(decodedText);
            },
            (error) => {
                if (error.name !== "NotFoundException") {
                    console.error("QR Scan Error:", error);
                }
            }
        ).catch(err => {
            console.error("Scanner start error:", err);
            setScanError("Unable to start camera. Please check permissions.");
        });
    };

    // Stop scanner
    const stopScanner = () => {
        if (scannerRef.current) {
            scannerRef.current.stop()
                .then(() => scannerRef.current.clear())
                .catch(err => console.error("Stop scanner error:", err));
        }
        setScanning(false);
    };

    // Manage scanner start/stop on scanning state
    useEffect(() => {
        if (scanning) {
            setScanResult(null);
            setScanError(null);
            startScanner();
        } else {
            stopScanner();
        }
        return () => stopScanner(); // Cleanup on unmount
    }, [scanning]);

    return (
        <div className="p-6 bg-background text-text min-h-full">
            <h1 className="text-2xl font-semibold mb-6 text-text">
                Welcome, {user?.name} 👋
            </h1>

            {/* QR Scanner Section */}
            <div className="mb-8">
                <button
                    onClick={() => setScanning(!scanning)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    <FaQrcode /> {scanning ? "Stop Scanning" : "Start Scanning"}
                </button>

                {scanning && (
                    <div className="mt-4 border border-gray-300 rounded overflow-hidden max-w-sm">
                        <div id="qr-reader" style={{ width: "100%" }}></div>
                    </div>
                )}

                {/* Scan results */}
                {scanResult && (
                    <div className="mt-4 p-4 border border-green-400 rounded bg-green-50 text-green-800">
                        <h3 className="font-semibold mb-2">Order Verified ✅</h3>
                        <p><strong>Token:</strong> {scanResult.token}</p>
                        <p><strong>Status:</strong> {scanResult.status}</p>
                        <p><strong>Payment:</strong> {scanResult.paymentStatus}</p>
                        <p>
                            <strong>Items:</strong>{" "}
                            {Array.isArray(scanResult.items)
                                ? scanResult.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")
                                : "-"}
                        </p>
                        <p><strong>Total:</strong> ₹{scanResult.totalPrice}</p>
                    </div>
                )}

                {scanError && (
                    <div className="mt-4 p-4 border border-red-400 rounded bg-red-50 text-red-800">
                        ❌ {scanError}
                    </div>
                )}
            </div>

            {/* Money & Orders Stats with Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                {loadingStats
                    ? Array(3)
                        .fill(0)
                        .map((_, i) => (
                            <div
                                key={i}
                                className="bg-background border border-gray-300 p-5 rounded shadow text-center"
                            >
                                <SkeletonBox className="h-4 w-20 mx-auto mb-2" />
                                <SkeletonBox className="h-6 w-24 mx-auto mb-1" />
                                <SkeletonBox className="h-4 w-16 mx-auto" />
                            </div>
                        ))
                    : moneyStats && (
                        <>
                            <div className="bg-background border border-gray-300 p-5 rounded shadow text-center">
                                <p className="text-sm text-text/80">Today</p>
                                <h2 className="text-xl font-bold text-green-600">
                                    ₹{moneyStats.revenue.today}
                                </h2>
                                <p className="text-text/70">
                                    {moneyStats.orders.today} orders
                                </p>
                            </div>
                            <div className="bg-background border border-gray-300 p-5 rounded shadow text-center">
                                <p className="text-sm text-text/80">This Week</p>
                                <h2 className="text-xl font-bold text-green-600">
                                    ₹{moneyStats.revenue.week}
                                </h2>
                                <p className="text-text/70">
                                    {moneyStats.orders.week} orders
                                </p>
                            </div>
                            <div className="bg-background border border-gray-300 p-5 rounded shadow text-center">
                                <p className="text-sm text-text/80">This Month</p>
                                <h2 className="text-xl font-bold text-green-600">
                                    ₹{moneyStats.revenue.month}
                                </h2>
                                <p className="text-text/70">
                                    {moneyStats.orders.month} orders
                                </p>
                            </div>
                        </>
                    )}
            </div>

            {/* Most Sold Item Today */}
            {mostSoldItemToday && (
                <div className="bg-background border border-gray-300 p-5 rounded shadow mb-8">
                    <h2 className="text-lg font-semibold mb-2">Most Sold Item Today</h2>
                    <p>{mostSoldItemToday.name} — <strong>{mostSoldItemToday.count} sold</strong></p>
                </div>
            )}

            {/* 7-Day Revenue Chart */}
            {/* Chart with Skeleton */}
            <div className="bg-background border border-gray-300 p-5 rounded shadow mb-8">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaChartLine /> Revenue (Last 7 Days)
                </h2>
                {loadingChart ? (
                    <SkeletonBox className="h-[300px] w-full" />
                ) : last7DaysRevenue.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={last7DaysRevenue}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#4CAF50"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-text/70">No revenue data available.</p>
                )}
            </div>

            {/* Old Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-background border border-gray-300 dark:border-gray-600 p-5 rounded shadow flex items-center gap-4">
                    <FaBox className="text-3xl text-blue-500" />
                    <div>
                        <p className="text-text/80 text-sm">Total Items</p>
                        <h2 className="text-xl font-bold text-text">{itemsCount}</h2>
                    </div>
                </div>

                <div className="bg-background border border-gray-300 dark:border-gray-600 p-5 rounded shadow flex items-center gap-4">
                    <FaClipboardList className="text-3xl text-green-500" />
                    <div>
                        <p className="text-text/80 text-sm">Total Orders</p>
                        <h2 className="text-xl font-bold text-text">{ordersCount}</h2>
                    </div>
                </div>

                <div className="bg-background border border-gray-300 dark:border-gray-600 p-5 rounded shadow flex items-center gap-4">
                    <FaCheckCircle className="text-3xl text-purple-500" />
                    <div>
                        <p className="text-text/80 text-sm">Completed Orders</p>
                        <h2 className="text-xl font-bold text-text">{completedCount}</h2>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-background border border-gray-300 dark:border-gray-600 p-5 rounded shadow">
                <h2 className="text-lg font-semibold mb-4 text-text">Recent Orders</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-text">
                        <thead>
                            <tr className="border-b border-gray-300 dark:border-gray-600 text-text/80">
                                <th className="py-2">Token</th>
                                <th className="py-2">Status</th>
                                <th className="py-2">Payment</th>
                                <th className="py-2">Items</th>
                                <th className="py-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr
                                    key={order._id}
                                    className="border-b border-gray-300 dark:border-gray-600 hover:bg-primary/10"
                                >
                                    <td className="py-2">{order.token || "-"}</td>
                                    <td className="py-2 capitalize">{order.status}</td>
                                    <td className="py-2 capitalize">{order.paymentStatus}</td>
                                    <td className="py-2">
                                        {Array.isArray(order.items)
                                            ? order.items.map((i) => `${i.quantity}x`).join(", ")
                                            : "-"}
                                    </td>
                                    <td className="py-2">₹{order.totalPrice}</td>
                                </tr>
                            ))}
                            {recentOrders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-text/80">
                                        No recent orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Home;
