import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

const StudentHome = () => {
    const { user, api, socket } = useAuth();

    const [canteens, setCanteens] = useState([]);
    const [selectedCanteen, setSelectedCanteen] = useState("");
    const [items, setItems] = useState([]);
    const [loadingItem, setLoadingItem] = useState(null);
    const [canteenOpen, setCanteenOpen] = useState(true); // ✅ backend canteen status
    const [nextOpeningText, setNextOpeningText] = useState(""); // ✅ new: next opening info
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [nowTime, setNowTime] = useState(dayjs()); // live timer

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
            } catch (err) {
                toast.error("Failed to load canteens");
            }
        };

        fetchCanteens();
    }, [api, user]);

    // -------------------- FETCH ITEMS WHEN CANTEEN CHANGES --------------------
    useEffect(() => {
        if (!selectedCanteen) return;

        const fetchItems = async () => {
            try {
                const res = await api.get(`/canteens/${selectedCanteen}/items`);
                setItems(res.data.items);
                setCanteenOpen(res.data.canteenOpen);
                setNextOpeningText(res.data.nextOpeningText || "");

                // Join canteen room via socket
                socket?.emit("joinCanteen", selectedCanteen);
            } catch (err) {
                toast.error("Failed to load items");
            }
        };

        fetchItems();
    }, [selectedCanteen, api, socket]);

    // -------------------- SOCKET LISTENERS --------------------
    useEffect(() => {
        if (!socket) return;

        const handleStockUpdated = ({ itemId, currentStock }) => {
            setItems(prev =>
                prev.map(i => (i._id === itemId ? { ...i, currentStock } : i))
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

    // -------------------- ADD ITEM TO CART --------------------
    const handleAddToCart = async (itemId) => {
        try {
            setLoadingItem(itemId);
            const res = await api.post("/cart", { itemId, quantity: 1 });
            if (res.data?.message?.toLowerCase().includes("quantity")) {
                toast.info("Quantity updated in cart");
            } else {
                toast.success("Item added to cart");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add to cart");
        } finally {
            setLoadingItem(null);
        }
    };

    // -------------------- FILTERED ITEMS --------------------
    const filteredItems = useMemo(() => {
        return items.filter(item => {
            if (categoryFilter !== "All" && item.category !== categoryFilter) return false;
            return true;
        });
    }, [items, categoryFilter]);

    // -------------------- HELPER: GET COUNTDOWN TEXT & STATUS --------------------
    const getCountdownAndStatus = (item) => {
        const from = item.availableFrom
            ? dayjs().hour(item.availableFrom.split(":")[0])
                .minute(item.availableFrom.split(":")[1])
                .second(0)
            : null;
        const till = item.availableTill
            ? dayjs().hour(item.availableTill.split(":")[0])
                .minute(item.availableTill.split(":")[1])
                .second(0)
            : null;

        // If canteen is closed, override all item availability
        if (!canteenOpen) {
            return { text: nextOpeningText || "Canteen Closed", isAvailable: false };
        }

        // Check individual item availability
        if (from && nowTime.isBefore(from)) {
            const diff = dayjs.duration(from.diff(nowTime));
            return { text: `Starts in ${diff.hours()}h ${diff.minutes()}m ${diff.seconds()}s`, isAvailable: false };
        }
        if (till && nowTime.isAfter(till)) {
            return { text: "Ended", isAvailable: false };
        }
        if (till) {
            const diff = dayjs.duration(till.diff(nowTime));
            return { text: `Time left: ${diff.hours()}h ${diff.minutes()}m ${diff.seconds()}s`, isAvailable: true };
        }

        return { text: "", isAvailable: true };
    };

    return (
        <div className="p-4 md:p-8 space-y-8 bg-background text-text transition-colors duration-300 min-h-screen max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-6">
                Welcome, {user?.name} 👋
            </h1>

            {/* -------------------- CANTEENS LIST -------------------- */}
            {canteens.length > 0 ? (
                <div>
                    <h2 className="text-lg font-semibold mb-4 text-text">Canteens Near You</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 max-w-5xl mx-auto">
                        {canteens.map((canteen) => (
                            <div
                                key={canteen._id}
                                onClick={() => setSelectedCanteen(canteen._id)}
                                className={`cursor-pointer rounded-lg p-3 shadow-md transition transform hover:scale-[1.03] hover:shadow-xl border ${selectedCanteen === canteen._id
                                    ? "border-primary shadow-lg"
                                    : "border-gray-300 dark:border-gray-600"
                                    } bg-background text-text flex flex-col justify-between min-h-[110px]`}
                                aria-label={`Select canteen ${canteen.name}`}
                            >
                                <h3 className="font-semibold text-lg truncate">{canteen.name}</h3>

                                {/* Closed indicator */}
                                {selectedCanteen === canteen._id && !canteenOpen && (
                                    <span className="text-red-500 font-bold text-sm mt-1">
                                        Closed
                                    </span>
                                )}

                                <button
                                    onClick={() => setSelectedCanteen(canteen._id)}
                                    className={`mt-auto py-1 rounded text-white text-sm font-semibold ${selectedCanteen === canteen._id
                                        ? "bg-primary hover:bg-primary-dark cursor-default"
                                        : "bg-primary hover:bg-primary-dark"
                                        } transition`}
                                >
                                    {selectedCanteen === canteen._id ? "Selected" : "Select"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-center text-text/70 mt-6">No canteens found</p>
            )}

            {/* -------------------- CATEGORY FILTER -------------------- */}
            {selectedCanteen && (
                <div className="flex gap-2 items-center mb-4">
                    <span className="font-semibold text-text">Filter by Category:</span>
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
                    <h2 className="text-lg font-semibold mb-4 text-text">Menu</h2>

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
                                const isAvailableNow = item.canAddToCart && countdown.isAvailable && canteenOpen;

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
                                                loading="lazy"
                                            />
                                        )}

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="mb-1">
                                                <h3 className="font-semibold text-sm sm:text-md truncate">{item.name}</h3>
                                                <p className="text-text/70 text-xs sm:text-sm mb-1">₹{item.price}</p>
                                            </div>

                                            <div className="flex flex-wrap justify-between items-center gap-1 mb-1">
                                                <div className="flex flex-wrap gap-1 text-[10px] sm:text-xs">
                                                    <span
                                                        className={`px-2 py-0.5 rounded ${isAvailableNow ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
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
                                                <p className="text-[10px] sm:text-sm text-yellow-800 font-semibold whitespace-nowrap">
                                                    {countdown.text}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            disabled={!isAvailableNow || loadingItem === item._id}
                                            onClick={() => handleAddToCart(item._id)}
                                            className="bg-primary hover:bg-primary-dark text-white px-2 sm:px-3 py-1 rounded-full font-semibold disabled:bg-gray-400 transition-colors duration-300 mt-1"
                                            aria-label={`Add ${item.name} to cart`}
                                        >
                                            {loadingItem === item._id ? "Adding..." : "Add"}
                                        </button>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-center text-text/70 col-span-full mt-6">No items found</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentHome;
