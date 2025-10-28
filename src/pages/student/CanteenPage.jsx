// src/pages/student/CanteenPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import SEO from "../../components/SEO";
import ItemCard from "../../components/ItemCard";
import ViewCartButton from "../../components/ViewCartButton";

dayjs.extend(duration);

const CanteenPage = () => {
    const { user, api, socket } = useAuth();
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
    const [loading, setLoading] = useState(false); // added loading state

    // Live clock
    useEffect(() => {
        const t = setInterval(() => setNowTime(dayjs()), 1000);
        return () => clearInterval(t);
    }, []);

    // Fetch canteen info + items
    useEffect(() => {
        (async () => {
            try {
                setLoading(true); // start loading
                const [canteenRes, itemsRes, cartRes] = await Promise.all([
                    api.get(`/canteens/${canteenId}`),
                    api.get(`/canteens/${canteenId}/items`),
                    api.get("/cart"),
                ]);

                setCanteen(canteenRes.data);
                setItems(itemsRes.data.items);
                setCanteenOpen(itemsRes.data.canteenOpen);
                setNextOpeningText(itemsRes.data.nextOpeningText || "");

                const map = {};
                cartRes.data?.items?.forEach((i) => (map[i.item._id] = i.quantity));
                setCart(map);
            } catch {
                toast.error("Failed to load canteen data");
            } finally {
                setLoading(false); // end loading
            }
        })();
    }, [api, canteenId]);

    // Socket listeners
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

    // Update cart logic
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

    // Filtered items
    const filteredItems = useMemo(
        () =>
            items.filter((item) => (categoryFilter !== "All" ? item.category === categoryFilter : true)),
        [items, categoryFilter]
    );

    // Time availability display
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
        <div className="min-h-screen space-y-8">
            <SEO
                title={canteen ? `${canteen.name} - Menu` : "Canteen Menu"}
                description="View canteen details and browse available items for ordering."
                canonicalPath={`/student/canteen/${canteenId}`}
            />

            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="text-primary hover:underline font-semibold text-sm"
            >
                ← Back to Canteens
            </button>

            {/* Show loading placeholder first */}
            {loading ? (
                <p className="text-text/70">Loading canteen items</p>
            ) : (
                <>
                    {/* Canteen header */}
                    {canteen && (
                        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm bg-background">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                <div>
                                    <h1 className="text-2xl font-bold">{canteen.name}</h1>
                                    <p className="text-sm text-text/70">
                                        {canteen.cuisines?.join(", ") || "Canteen"} ·{" "}
                                        {canteen.isOpen ? (
                                            <span className="text-green-600 font-medium">Open Now</span>
                                        ) : (
                                            <span className="text-red-600 font-medium">Closed</span>
                                        )}
                                    </p>
                                    <p className="text-xs text-text/60 mt-1">
                                        {canteen.openingTime} - {canteen.closingTime}{" "}
                                        {!canteen.isOpenOnSunday && "(Closed on Sundays)"}
                                    </p>
                                </div>
                                {canteen.upiId && (
                                    <div className="text-sm text-text/80">
                                        <p className="font-medium">UPI ID</p>
                                        <p className="font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">
                                            {canteen.upiId}
                                        </p>
                                    </div>
                                )}
                            </div>
                            {canteen.about && (
                                <p className="text-text/80 text-sm mt-3 leading-relaxed">
                                    {canteen.about}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Category filter */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">Filter by Category:</span>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="border border-gray-300 dark:border-gray-600 px-2 py-1 rounded bg-background focus:ring-2 focus:ring-primary"
                        >
                            <option>All</option>
                            <option>Breakfast</option>
                            <option>Meal</option>
                            <option>Beverage</option>
                            <option>Snack</option>
                            <option>Dessert</option>
                            <option>Other</option>
                        </select>
                    </div>

                    {/* Items */}
                    <div className="space-y-4">
                        {filteredItems.length ? (
                            filteredItems.map((item) => {
                                const { text, isAvailable } = getCountdownAndStatus(item);
                                const qty = cart[item._id] || 0;
                                const availableNow = item.canAddToCart && isAvailable && canteenOpen;
                                const disabled = !availableNow || loadingItem === item._id;
                                return (
                                    <ItemCard
                                        key={item._id}
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
                                );
                            })
                        ) : (
                            <p className="text-text/70">No items found.</p>
                        )}
                    </div>

                    {/* Floating View Cart Button */}
                    {cartCount > 0 && <ViewCartButton itemCount={cartCount} />}
                </>
            )}
        </div>
    );
};

export default CanteenPage;
