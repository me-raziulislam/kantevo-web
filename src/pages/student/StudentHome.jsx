import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import SEO from "../../components/SEO";
dayjs.extend(duration);

const StudentHome = () => {
    const { user, api, socket } = useAuth();

    const [canteens, setCanteens] = useState([]);
    const [selectedCanteen, setSelectedCanteen] = useState("");
    const [items, setItems] = useState([]);
    const [loadingItem, setLoadingItem] = useState(null);
    const [canteenOpen, setCanteenOpen] = useState(true);
    const [nextOpeningText, setNextOpeningText] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [nowTime, setNowTime] = useState(dayjs());
    const [cart, setCart] = useState({}); // local cart { itemId: quantity }
    const [loadingCanteenData, setLoadingCanteenData] = useState(false); // prevent flicker

    // -------------------- LIVE TIMER --------------------
    useEffect(() => {
        const timer = setInterval(() => setNowTime(dayjs()), 1000);
        return () => clearInterval(timer);
    }, []);

    // -------------------- FETCH CANTEENS --------------------
    useEffect(() => {
        if (!user?.college) return;

        const collegeId = user.college._id || user.college;
        const fetchCanteens = async () => {
            try {
                const res = await api.get(`/canteens/college/${collegeId}`);
                setCanteens(res.data);
            } catch {
                toast.error("Failed to load canteens");
            }
        };

        fetchCanteens();
    }, [api, user]);

    // -------------------- FETCH ITEMS + CART (TOGETHER) --------------------
    useEffect(() => {
        if (!selectedCanteen) return;

        const fetchItemsAndCart = async () => {
            try {
                setLoadingCanteenData(true);

                // Fetch items and cart in parallel
                const [itemsRes, cartRes] = await Promise.all([
                    api.get(`/canteens/${selectedCanteen}/items`),
                    api.get("/cart"),
                ]);

                // Update items and canteen status
                setItems(itemsRes.data.items);
                setCanteenOpen(itemsRes.data.canteenOpen);
                setNextOpeningText(itemsRes.data.nextOpeningText || "");

                // Join socket room
                socket?.emit("joinCanteen", selectedCanteen);

                // Map cart items
                const cartMap = {};
                cartRes.data?.items?.forEach((i) => {
                    cartMap[i.item._id] = i.quantity;
                });
                setCart(cartMap);
            } catch (err) {
                toast.error("Failed to load items");
            } finally {
                setLoadingCanteenData(false);
            }
        };

        fetchItemsAndCart();
    }, [selectedCanteen, api, socket]);

    // -------------------- SOCKET LISTENERS --------------------
    useEffect(() => {
        if (!socket) return;

        const handleStockUpdated = ({ itemId, currentStock }) => {
            setItems((prev) =>
                prev.map((i) => (i._id === itemId ? { ...i, currentStock } : i))
            );
        };

        const handleCanteenStatusChanged = ({ canteenId, isOpen, nextOpeningText }) => {
            if (canteenId === selectedCanteen) {
                setCanteenOpen(isOpen);
                setNextOpeningText(nextOpeningText || "");
            }
        };

        socket.on("stockUpdated", handleStockUpdated);
        socket.on("canteenStatusChanged", handleCanteenStatusChanged);

        return () => {
            socket.off("stockUpdated", handleStockUpdated);
            socket.off("canteenStatusChanged", handleCanteenStatusChanged);
        };
    }, [socket, selectedCanteen]);

    // -------------------- UPDATE CART QUANTITY --------------------
    const updateCart = async (itemId, newQty) => {
        if (newQty < 0) return; // prevent negative
        try {
            setLoadingItem(itemId);

            if (newQty === 0) {
                // Remove item from cart
                await api.delete(`/cart/${itemId}`);
                setCart((prev) => {
                    const copy = { ...prev };
                    delete copy[itemId];
                    return copy;
                });
                toast.info("Item removed from cart");
            } else {
                if (!cart[itemId]) {
                    // Item not in cart → use POST /cart to add
                    const res = await api.post("/cart", { itemId, quantity: newQty });
                    setCart((prev) => ({ ...prev, [itemId]: newQty }));
                    toast.success(res.data?.message || "Item added to cart");
                } else {
                    // Item already in cart → use PUT /cart to update
                    const res = await api.put("/cart", { itemId, quantity: newQty });
                    setCart((prev) => ({ ...prev, [itemId]: newQty }));
                    toast.success(res.data?.message || "Quantity updated");
                }
            }
        } catch (err) {
            console.error("Cart update error:", err.response?.data || err);
            toast.error(err.response?.data?.message || "Failed to update cart");
        } finally {
            setLoadingItem(null);
        }
    };

    // -------------------- FILTERED ITEMS --------------------
    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            if (categoryFilter !== "All" && item.category !== categoryFilter)
                return false;
            return true;
        });
    }, [items, categoryFilter]);

    // -------------------- GET COUNTDOWN TEXT --------------------
    const getCountdownAndStatus = (item) => {
        const from = item.availableFrom
            ? dayjs()
                .hour(item.availableFrom.split(":")[0])
                .minute(item.availableFrom.split(":")[1])
                .second(0)
            : null;
        const till = item.availableTill
            ? dayjs()
                .hour(item.availableTill.split(":")[0])
                .minute(item.availableTill.split(":")[1])
                .second(0)
            : null;

        if (!canteenOpen)
            return {
                text: nextOpeningText || "Canteen Closed",
                isAvailable: false,
            };
        if (from && nowTime.isBefore(from)) {
            const diff = dayjs.duration(from.diff(nowTime));
            return {
                text: `Starts in ${diff.hours()}h ${diff.minutes()}m ${diff.seconds()}s`,
                isAvailable: false,
            };
        }
        if (till && nowTime.isAfter(till))
            return { text: "Ended", isAvailable: false };
        if (till) {
            const diff = dayjs.duration(till.diff(nowTime));
            return {
                text: `Time left: ${diff.hours()}h ${diff.minutes()}m ${diff.seconds()}s`,
                isAvailable: true,
            };
        }
        return { text: "", isAvailable: true };
    };

    // -------------------- QUANTITY CONTROL --------------------
    const QuantityControl = ({ itemId, quantity, disabled }) => {
        const handleIncrement = (e) => {
            e.stopPropagation();
            updateCart(itemId, quantity + 1);
        };
        const handleDecrement = (e) => {
            e.stopPropagation();
            updateCart(itemId, Math.max(0, quantity - 1));
        };

        return (
            <div
                className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden w-24 sm:w-28 h-8 sm:h-9 border border-gray-300 dark:border-gray-600"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={handleDecrement}
                    disabled={disabled || quantity <= 0}
                    className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-primary hover:bg-primary/10 transition disabled:opacity-40"
                >
                    −
                </button>
                <span className="w-8 text-center font-semibold text-text transition-all duration-200">
                    {quantity}
                </span>
                <button
                    onClick={handleIncrement}
                    disabled={disabled}
                    className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-primary hover:bg-primary/10 transition disabled:opacity-40"
                >
                    +
                </button>
            </div>
        );
    };

    // -------------------- SKELETON SHIMMER --------------------
    const MenuSkeleton = () => {
        const shimmerCount = items.length > 0 ? items.length : 10; // adaptive count
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-7xl mx-auto">
                {Array.from({ length: shimmerCount }).map((_, i) => (
                    <div
                        key={i}
                        className="border rounded-2xl p-2 flex flex-col justify-between bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 shadow-sm animate-pulse"
                    >
                        <div className="rounded-xl w-full h-20 sm:h-24 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%] animate-shimmer mb-3" />
                        <div className="space-y-2">
                            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                        <div className="mt-4 h-6 bg-gray-300 dark:bg-gray-700 rounded-full w-24 self-center"></div>
                    </div>
                ))}
            </div>
        );
    };

    // -------------------- MAIN UI --------------------
    return (
        <div className="p-4 md:p-8 space-y-8 bg-background text-text transition-colors duration-300 min-h-screen max-w-7xl mx-auto">

            <SEO
                title="Student Dashboard"
                description="Explore nearby canteens, browse menus, and place your food orders directly from Kantevo."
                canonicalPath="/student/home"
            />

            <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-6">
                Welcome, {user?.name} 👋
            </h1>

            {/* -------------------- CANTEENS -------------------- */}
            {canteens.length > 0 ? (
                <div>
                    <h2 className="text-lg font-semibold mb-4 text-text">
                        Canteens Near You
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 max-w-5xl mx-auto">
                        {canteens.map((canteen) => (
                            <div
                                key={canteen._id}
                                onClick={() => setSelectedCanteen(canteen._id)}
                                className={`cursor-pointer rounded-lg p-3 shadow-md transition transform hover:scale-[1.03] hover:shadow-xl border ${selectedCanteen === canteen._id
                                    ? "border-primary shadow-lg"
                                    : "border-gray-300 dark:border-gray-600"
                                    } bg-background text-text flex flex-col justify-between min-h-[110px]`}
                            >
                                <h3 className="font-semibold text-lg truncate">
                                    {canteen.name}
                                </h3>
                                {selectedCanteen === canteen._id && !canteenOpen && (
                                    <span className="text-red-500 font-bold text-sm mt-1">
                                        Closed
                                    </span>
                                )}
                                <button
                                    className={`mt-auto py-1 rounded text-white text-sm font-semibold ${selectedCanteen === canteen._id
                                        ? "bg-primary cursor-default"
                                        : "bg-primary hover:bg-primary-dark"
                                        } transition`}
                                >
                                    {selectedCanteen === canteen._id
                                        ? "Selected"
                                        : "Select"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-center text-text/70 mt-6">
                    No canteens found
                </p>
            )}

            {/* -------------------- CATEGORY FILTER -------------------- */}
            {selectedCanteen && (
                <div className="flex gap-2 items-center mb-4">
                    <span className="font-semibold text-text">
                        Filter by Category:
                    </span>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 px-2 py-1 rounded bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="All">All</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Meal">Meal</option>
                        <option value="Beverage">Beverage</option>
                        <option value="Snack">Snack</option>
                        <option value="Dessert">Dessert</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            )}

            {/* -------------------- ITEMS LIST -------------------- */}
            {selectedCanteen && (
                <div>
                    <h2 className="text-lg font-semibold mb-4 text-text">
                        Menu
                    </h2>

                    {loadingCanteenData ? (
                        <MenuSkeleton />
                    ) : (
                        <>
                            {!canteenOpen && (
                                <p className="text-red-500 font-semibold mb-2">
                                    Canteen is currently closed
                                    {nextOpeningText && (
                                        <span className="block text-yellow-700 text-sm mt-1">
                                            {nextOpeningText}
                                        </span>
                                    )}
                                </p>
                            )}

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-7xl mx-auto">
                                {filteredItems.length > 0 ? (
                                    filteredItems.map((item) => {
                                        const countdown = getCountdownAndStatus(item);
                                        const isAvailableNow =
                                            item.canAddToCart && countdown.isAvailable && canteenOpen;
                                        const quantity = cart[item._id] || 0;
                                        const disabled = !isAvailableNow || loadingItem === item._id;

                                        return (
                                            <div
                                                key={item._id}
                                                className="border rounded-2xl p-2 flex flex-col justify-between bg-background text-text border-gray-300 dark:border-gray-600 shadow hover:shadow-lg transition duration-300 min-h-[160px] sm:min-h-[180px]"
                                            >
                                                {item.image && (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="rounded-xl w-full h-16 sm:h-20 object-cover mb-2"
                                                    />
                                                )}

                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div className="mb-1">
                                                        <h3 className="font-semibold text-sm sm:text-md truncate">
                                                            {item.name}
                                                        </h3>
                                                        <p className="text-text/70 text-xs sm:text-sm mb-1">
                                                            ₹{item.price}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 mb-1 flex-wrap">
                                                        <div className="flex flex-wrap gap-1 text-[10px] sm:text-xs">
                                                            <span
                                                                className={`px-2 py-0.5 rounded ${isAvailableNow
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-red-100 text-red-800"
                                                                    }`}
                                                            >
                                                                {isAvailableNow ? "Available" : item.reason || "Unavailable"}
                                                            </span>
                                                            {item.category && (
                                                                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                                                                    {item.category}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Countdown / Next opening text */}
                                                        <p className="text-[10px] sm:text-sm text-yellow-800 font-semibold whitespace-normal break-words">
                                                            {countdown.text}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Modern Quantity UI */}
                                                {quantity > 0 ? (
                                                    <QuantityControl
                                                        itemId={item._id}
                                                        quantity={quantity}
                                                        disabled={disabled}
                                                    />
                                                ) : (
                                                    <button
                                                        disabled={disabled}
                                                        onClick={() => updateCart(item._id, 1)}
                                                        className="bg-primary hover:bg-primary-dark text-white px-2 sm:px-3 py-1 rounded-full font-semibold disabled:bg-gray-400 transition-colors duration-300 mt-1"
                                                    >
                                                        {loadingItem === item._id ? "Adding..." : "Add"}
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-center text-text/70 col-span-full mt-6">
                                        No items found
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentHome;
