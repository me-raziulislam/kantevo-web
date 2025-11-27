// src/pages/student/CanteenPage.jsx
// Premium canteen menu page

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {
    ArrowLeftIcon,
    ClockIcon,
    FunnelIcon,
    BuildingStorefrontIcon
} from "@heroicons/react/24/outline";
import SEO from "../../components/SEO";
import ItemCard from "../../components/ItemCard";
import ViewCartButton from "../../components/ViewCartButton";

dayjs.extend(duration);

const categories = ["All", "Breakfast", "Meal", "Beverage", "Snack", "Dessert", "Other"];

const CanteenPage = () => {
    const { user, api, socket, accessToken, loading: authLoading } = useAuth();
    const { canteenId } = useParams();
    const navigate = useNavigate();

    const [canteen, setCanteen] = useState(null);
    const [items, setItems] = useState([]);
    const [cart, setCart] = useState({});
    const [loadingItem, setLoadingItem] = useState(null);
    const [canteenOpen, setCanteenOpen] = useState(true);
    const [nextOpeningText, setNextOpeningText] = useState("");
    const [nowTime, setNowTime] = useState(dayjs());
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const t = setInterval(() => setNowTime(dayjs()), 1000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                const [canteenRes, itemsRes] = await Promise.all([
                    api.get(`/canteens/${canteenId}`),
                    api.get(`/canteens/${canteenId}/items`),
                ]);
                if (cancelled) return;
                setCanteen(canteenRes.data);
                setItems(itemsRes.data.items);
                setCanteenOpen(itemsRes.data.canteenOpen);
                setNextOpeningText(itemsRes.data.nextOpeningText || "");
            } catch (e) {
                if (!cancelled) toast.error("Failed to load canteen data");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [api, canteenId]);

    useEffect(() => {
        if (authLoading || !accessToken) return;
        let cancelled = false;
        (async () => {
            try {
                const cartRes = await api.get("/cart");
                if (cancelled) return;
                const map = {};
                cartRes.data?.items?.forEach((i) => (map[i.item._id] = i.quantity));
                setCart(map);
            } catch (err) { }
        })();
        return () => { cancelled = true; };
    }, [api, accessToken, authLoading]);

    useEffect(() => {
        if (!socket) return;
        socket.emit("joinCanteen", canteenId);
        const handleStockUpdated = ({ itemId, currentStock }) =>
            setItems((prev) => prev.map((i) => (i._id === itemId ? { ...i, currentStock } : i)));
        const handleCanteenStatusChanged = ({ canteenId: id, isOpen, nextOpeningText: t }) => {
            if (id === canteenId) {
                setCanteenOpen(isOpen);
                setNextOpeningText(t || "");
            }
        };
        socket.on("stockUpdated", handleStockUpdated);
        socket.on("canteenStatusChanged", handleCanteenStatusChanged);
        return () => {
            socket.off("stockUpdated", handleStockUpdated);
            socket.off("canteenStatusChanged", handleCanteenStatusChanged);
        };
    }, [socket, canteenId]);

    const updateCart = async (itemId, newQty) => {
        if (newQty < 0) return;
        try {
            setLoadingItem(itemId);
            if (newQty === 0) {
                await api.delete(`/cart/${itemId}`);
                setCart((prev) => {
                    const copy = { ...prev };
                    delete copy[itemId];
                    return copy;
                });
            } else if (!cart[itemId]) {
                await api.post("/cart", { itemId, quantity: newQty });
                setCart((p) => ({ ...p, [itemId]: newQty }));
            } else {
                await api.put("/cart", { itemId, quantity: newQty });
                setCart((p) => ({ ...p, [itemId]: newQty }));
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update cart");
        } finally {
            setLoadingItem(null);
        }
    };

    const filteredItems = useMemo(
        () => items.filter((item) => (categoryFilter !== "All" ? item.category === categoryFilter : true)),
        [items, categoryFilter]
    );

    const getCountdownAndStatus = (item) => {
        const from = item.availableFrom
            ? dayjs().hour(item.availableFrom.split(":")[0]).minute(item.availableFrom.split(":")[1])
            : null;
        const till = item.availableTill
            ? dayjs().hour(item.availableTill.split(":")[0]).minute(item.availableTill.split(":")[1])
            : null;

        if (!canteenOpen) return { text: nextOpeningText || "Closed", isAvailable: false };
        if (from && nowTime.isBefore(from)) {
            const diff = dayjs.duration(from.diff(nowTime));
            return { text: `Starts in ${diff.hours()}h ${diff.minutes()}m`, isAvailable: false };
        }
        if (till && nowTime.isAfter(till)) return { text: "Ended", isAvailable: false };
        return { text: "", isAvailable: true };
    };

    const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

    return (
        <div className="space-y-6">
            <SEO
                title={canteen ? `${canteen.name} - Menu` : "Canteen Menu"}
                description="View canteen menu and order items."
                canonicalPath={`/student/canteen/${canteenId}`}
            />

            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
            >
                <ArrowLeftIcon className="w-5 h-5" />
                <span className="font-medium">Back to Canteens</span>
            </button>

            {loading ? (
                <div className="card p-12 text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-text-secondary">Loading menu...</p>
                </div>
            ) : (
                <>
                    {/* Canteen Header */}
                    {canteen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card p-6"
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-2xl font-bold">{canteen.name}</h1>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${canteen.isOpen ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}>
                                            {canteen.isOpen ? "Open" : "Closed"}
                                        </span>
                                    </div>
                                    <p className="text-text-secondary text-sm mb-2">
                                        {canteen.cuisines?.join(" • ") || "Campus Canteen"}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-text-muted">
                                        <ClockIcon className="w-4 h-4" />
                                        <span>{canteen.openingTime} - {canteen.closingTime}</span>
                                        {!canteen.isOpenOnSunday && <span className="text-warning">• Closed on Sundays</span>}
                                    </div>
                                    {canteen.about && (
                                        <p className="text-text-secondary text-sm mt-3">{canteen.about}</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Category Filter */}
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        <FunnelIcon className="w-5 h-5 text-text-muted shrink-0" />
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${categoryFilter === cat
                                        ? "bg-primary text-white"
                                        : "bg-background-subtle hover:bg-primary/10"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Items - extra padding at bottom for floating cart button */}
                    <div className="space-y-4 pb-16">
                        {filteredItems.length ? (
                            filteredItems.map((item, i) => {
                                const { text, isAvailable } = getCountdownAndStatus(item);
                                const qty = cart[item._id] || 0;
                                const availableNow = item.canAddToCart && isAvailable && canteenOpen;
                                const disabled = !availableNow || loadingItem === item._id;
                                return (
                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                    >
                                        <ItemCard
                                            item={item}
                                            quantity={qty}
                                            disabled={disabled}
                                            countdownText={text}
                                            isAvailableNow={availableNow}
                                            loading={loadingItem === item._id}
                                            onAdd={() => updateCart(item._id, 1)}
                                            onInc={() => updateCart(item._id, qty + 1)}
                                            onDec={() => updateCart(item._id, Math.max(0, qty - 1))}
                                        />
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="card p-12 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <BuildingStorefrontIcon className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">No items found</h3>
                                <p className="text-text-secondary text-sm">
                                    {categoryFilter !== "All" ? "Try a different category" : "This canteen hasn't added any items yet"}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Floating Cart Button */}
                    {cartCount > 0 && <ViewCartButton itemCount={cartCount} />}
                </>
            )}
        </div>
    );
};

export default CanteenPage;
