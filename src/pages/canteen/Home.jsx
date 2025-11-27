// src/pages/canteen/Home.jsx
// Premium canteen dashboard home

import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
    QrCodeIcon,
    CurrencyRupeeIcon,
    ShoppingBagIcon,
    CheckCircleIcon,
    ClockIcon,
    ChartBarIcon,
    XMarkIcon,
    FireIcon
} from "@heroicons/react/24/outline";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import SEO from "../../components/SEO";
import dayjs from "dayjs";

const StatCard = ({ icon: Icon, label, value, subtext, color = "primary", loading }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-5"
    >
        {loading ? (
            <div className="animate-pulse space-y-3">
                <div className="h-4 w-20 bg-background-subtle rounded" />
                <div className="h-8 w-28 bg-background-subtle rounded" />
                <div className="h-3 w-16 bg-background-subtle rounded" />
            </div>
        ) : (
            <>
                <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-xl bg-${color}/10 flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 text-${color}`} />
                    </div>
                    <span className="text-sm text-text-muted">{label}</span>
                </div>
                <p className="text-2xl font-bold">{value}</p>
                {subtext && <p className="text-sm text-text-muted mt-1">{subtext}</p>}
            </>
        )}
    </motion.div>
);

const Home = () => {
    const { user, api, socket } = useAuth();
    const canteenId = user?.canteen;

    const [itemsCount, setItemsCount] = useState(0);
    const [ordersCount, setOrdersCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [recentOrders, setRecentOrders] = useState([]);
    const [moneyStats, setMoneyStats] = useState(null);
    const [mostSoldItemToday, setMostSoldItemToday] = useState(null);
    const [last7DaysRevenue, setLast7DaysRevenue] = useState([]);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingChart, setLoadingChart] = useState(true);

    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [scanError, setScanError] = useState(null);
    const [lastScanned, setLastScanned] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const videoRef = useRef(null);
    const readerRef = useRef(null);
    const streamRef = useRef(null);
    const scanningLockedRef = useRef(false);

    useEffect(() => {
        if (!canteenId) return;

        const fetchStats = async () => {
            try {
                setLoadingStats(true);
                setLoadingChart(true);

                const itemsRes = await api.get(`/items/${canteenId}`);
                setItemsCount(Array.isArray(itemsRes?.data) ? itemsRes.data.length : 0);

                const ordersRes = await api.get(`/orders/canteen/${canteenId}`);
                const allOrders = Array.isArray(ordersRes?.data) ? ordersRes.data : [];
                setOrdersCount(allOrders.length);

                const completed = allOrders.filter((order) => order.status === "completed");
                setCompletedCount(completed.length);

                const sorted = allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setRecentOrders(sorted.slice(0, 5));

                const statsRes = await api.get(`/canteens/${canteenId}/stats`);
                const ro = statsRes?.data?.revenueAndOrders || {};

                setMoneyStats({
                    revenue: { today: ro?.day?.totalRevenue || 0, week: ro?.week?.totalRevenue || 0, month: ro?.month?.totalRevenue || 0 },
                    orders: { today: ro?.day?.orderCount || 0, week: ro?.week?.orderCount || 0, month: ro?.month?.orderCount || 0 },
                });

                const top = statsRes?.data?.mostSoldToday || null;
                setMostSoldItemToday(top ? { name: top.name, count: top.qty } : null);

                const raw7 = Array.isArray(statsRes?.data?.revenueLast7Days) ? statsRes.data.revenueLast7Days : [];
                const map = new Map();
                raw7.forEach((r) => {
                    if (!r?._id) return;
                    map.set(`${r._id.year}-${r._id.month}-${r._id.day}`, r.totalRevenue || 0);
                });

                const today = new Date();
                const series = [];
                for (let i = 6; i >= 0; i--) {
                    const dt = new Date(today);
                    dt.setDate(today.getDate() - i);
                    const key = `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`;
                    series.push({ date: dt.toLocaleDateString(undefined, { month: "short", day: "numeric" }), revenue: map.get(key) || 0 });
                }
                setLast7DaysRevenue(series);
            } catch (err) {
                console.error("Error fetching stats:", err);
                setMoneyStats({ revenue: { today: 0, week: 0, month: 0 }, orders: { today: 0, week: 0, month: 0 } });
            } finally {
                setLoadingStats(false);
                setLoadingChart(false);
            }
        };

        fetchStats();
    }, [canteenId, api]);

    useEffect(() => {
        if (!socket || !canteenId) return;

        const handleNewOrder = (newOrder) => {
            if (!newOrder) return;
            setOrdersCount((prev) => (typeof prev === "number" ? prev + 1 : 1));
            setRecentOrders((prev) => [newOrder, ...(prev || [])].slice(0, 5));
            toast.success(`🆕 New order ${newOrder.token || ""} received`);
        };

        socket.on("newOrder", handleNewOrder);
        return () => socket.off("newOrder", handleNewOrder);
    }, [socket, canteenId]);

    const handleScan = async (text) => {
        if (!text || text === lastScanned) return;
        setLastScanned(text);
        stopScanner();

        try {
            const qrHash = text.split("/").pop();
            const res = await api.get(`/orders/verify-qr/${qrHash}`);
            setScanResult(res?.data?.order || null);
            setScanError(null);
            setModalOpen(true);
        } catch (err) {
            setScanError(err?.response?.data?.msg || "Invalid or expired QR code");
            setScanResult(null);
        }
    };

    const markAsDelivered = async () => {
        try {
            if (!scanResult?._id) return;
            await api.patch(`/orders/${scanResult._id}/deliver`);
            toast.success("Order marked as delivered ✅");
            setModalOpen(false);
        } catch {
            toast.error("Failed to mark as delivered");
        }
    };

    const startScanner = async () => {
        try {
            setScanError(null);
            setScanResult(null);
            setScanning(true);
            scanningLockedRef.current = false;

            const reader = new BrowserMultiFormatReader();
            readerRef.current = reader;

            const devices = await BrowserMultiFormatReader.listVideoInputDevices();
            if (!devices.length) throw new Error("No camera devices found");
            const backCam = devices.find((d) => d.label.toLowerCase().includes("back")) || devices[0];

            const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: backCam.deviceId }, audio: false });
            streamRef.current = stream;
            if (videoRef.current) videoRef.current.srcObject = stream;

            reader.decodeFromVideoDevice(backCam.deviceId, videoRef.current, (result, err) => {
                if (result && !scanningLockedRef.current) handleScan(result.getText());
            });
        } catch (err) {
            setScanError(err.message.includes("Permission") ? "Camera permission denied." : "Unable to start camera.");
            setScanning(false);
        }
    };

    const stopScanner = () => {
        try {
            if (readerRef.current) { readerRef.current.reset(); readerRef.current = null; }
            if (streamRef.current) { streamRef.current.getTracks().forEach((t) => { t.stop(); t.enabled = false; }); streamRef.current = null; }
            if (videoRef.current) videoRef.current.srcObject = null;
            setScanning(false);
        } catch (e) { console.warn("Error stopping scanner:", e); }
    };

    useEffect(() => {
        if (scanning) startScanner();
        else stopScanner();
        return () => stopScanner();
    }, [scanning]);

    const statusColors = {
        pending: "bg-warning/10 text-warning",
        preparing: "bg-accent/10 text-accent",
        ready: "bg-primary/10 text-primary",
        completed: "bg-success/10 text-success",
        cancelled: "bg-error/10 text-error",
    };

    return (
        <div className="space-y-6">
            <SEO title="Canteen Dashboard" description="Monitor canteen performance on Kantevo." canonicalPath="/canteen/home" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {user?.name?.split(" ")[0]}! 👋</h1>
                    <p className="text-text-secondary mt-1">Here's how your canteen is performing</p>
                </div>
                <button
                    onClick={() => setScanning(!scanning)}
                    className={`btn-primary px-5 py-2.5 flex items-center gap-2 ${scanning ? "bg-error hover:bg-error" : ""}`}
                >
                    <QrCodeIcon className="w-5 h-5" />
                    {scanning ? "Stop Scanner" : "Scan QR Code"}
                </button>
            </div>

            {scanning && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="card p-4">
                    <div className="max-w-sm mx-auto rounded-xl overflow-hidden border border-border">
                        <video ref={videoRef} className="w-full" autoPlay muted playsInline />
                    </div>
                    <p className="text-center text-sm text-text-muted mt-3">Point camera at the order QR code</p>
                </motion.div>
            )}

            {scanError && (
                <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-center">{scanError}</div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard icon={CurrencyRupeeIcon} label="Today's Revenue" value={`₹${moneyStats?.revenue?.today || 0}`} subtext={`${moneyStats?.orders?.today || 0} orders`} color="success" loading={loadingStats} />
                <StatCard icon={CurrencyRupeeIcon} label="This Week" value={`₹${moneyStats?.revenue?.week || 0}`} subtext={`${moneyStats?.orders?.week || 0} orders`} color="accent" loading={loadingStats} />
                <StatCard icon={CurrencyRupeeIcon} label="This Month" value={`₹${moneyStats?.revenue?.month || 0}`} subtext={`${moneyStats?.orders?.month || 0} orders`} color="primary" loading={loadingStats} />
            </div>

            {/* Most Sold + Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {mostSoldItemToday && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                                <FireIcon className="w-5 h-5 text-warning" />
                            </div>
                            <span className="text-sm text-text-muted">Top Seller Today</span>
                        </div>
                        <p className="font-semibold text-lg">{mostSoldItemToday.name}</p>
                        <p className="text-sm text-text-muted">{mostSoldItemToday.count} sold</p>
                    </motion.div>
                )}
                <StatCard icon={ShoppingBagIcon} label="Total Items" value={itemsCount} color="accent" loading={loadingStats} />
                <StatCard icon={ClockIcon} label="Total Orders" value={ordersCount} color="primary" loading={loadingStats} />
                <StatCard icon={CheckCircleIcon} label="Completed" value={completedCount} color="success" loading={loadingStats} />
            </div>

            {/* Revenue Chart */}
            <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                    <ChartBarIcon className="w-5 h-5 text-primary" />
                    <h2 className="font-semibold">Revenue (Last 7 Days)</h2>
                </div>
                {loadingChart ? (
                    <div className="h-[300px] bg-background-subtle rounded-xl animate-pulse" />
                ) : last7DaysRevenue.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={last7DaysRevenue}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                            <XAxis dataKey="date" stroke="var(--color-text-muted)" fontSize={12} />
                            <YAxis stroke="var(--color-text-muted)" fontSize={12} />
                            <Tooltip contentStyle={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)", borderRadius: "12px" }} />
                            <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} dot={{ fill: "var(--color-primary)" }} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-text-muted text-center py-12">No revenue data available</p>
                )}
            </div>

            {/* Recent Orders */}
            <div className="card p-5">
                <h2 className="font-semibold mb-4">Recent Orders</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border text-text-muted">
                                <th className="text-left py-3 px-2">Token</th>
                                <th className="text-left py-3 px-2">Status</th>
                                <th className="text-left py-3 px-2">Payment</th>
                                <th className="text-left py-3 px-2">Items</th>
                                <th className="text-right py-3 px-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-8 text-text-muted">No recent orders</td></tr>
                            ) : (
                                recentOrders.map((order) => (
                                    <tr key={order._id} className="border-b border-border hover:bg-background-subtle transition-colors">
                                        <td className="py-3 px-2 font-medium">#{order.token || "-"}</td>
                                        <td className="py-3 px-2">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || ""}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-2">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${order.paymentStatus === "paid" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                                                {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="py-3 px-2 text-text-secondary">
                                            {order.items.map((i) => `${i.quantity}x ${i.item?.name || "Unknown"}`).join(", ")}
                                        </td>
                                        <td className="py-3 px-2 text-right font-semibold">₹{order.totalPrice}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* QR Scan Modal */}
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <DialogPanel className="card p-6 max-w-md w-full">
                        <div className="flex items-center justify-between mb-4">
                            <DialogTitle className="text-lg font-bold">Order Details</DialogTitle>
                            <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-background-subtle rounded-lg">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                        {scanResult ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div><span className="text-text-muted">Token:</span> <span className="font-semibold">#{scanResult.token}</span></div>
                                    <div><span className="text-text-muted">Status:</span> <span className={`px - 2 py - 0.5 rounded - full text - xs ${statusColors[scanResult.status]}`}>{scanResult.status}</span></div>
                                    <div><span className="text-text-muted">Payment:</span> <span className="font-semibold">{scanResult.paymentStatus}</span></div>
                                    <div><span className="text-text-muted">Total:</span> <span className="font-semibold text-primary">₹{scanResult.totalPrice}</span></div>
                                </div>
                                <div>
                                    <p className="text-sm text-text-muted mb-2">Items:</p>
                                    <div className="space-y-1">
                                        {scanResult.items?.map((i) => (
                                            <div key={i._id} className="text-sm">{i.quantity}x {i.item?.name || "Item"}</div>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={markAsDelivered} className="btn-primary w-full py-3">
                                    <CheckCircleIcon className="w-5 h-5 mr-2 inline" />
                                    Mark as Delivered
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-text-muted">Loading...</div>
                        )}
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    );
};

export default Home;
