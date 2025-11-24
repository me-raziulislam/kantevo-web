// pages/student/Cart.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import SEO from "../../components/SEO";

// ---- Configurable charges ----
const GST_PERCENT = 0; // %
const CANTEEN_CHARGE = 0; // flat ₹
const PLATFORM_FEE = 1; // flat ₹

const Cart = () => {
    const { user, api, socket, accessToken, loading: authLoading } = useAuth();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingItem, setLoadingItem] = useState(null);
    const [clearing, setClearing] = useState(false);
    const [processing, setProcessing] = useState(false);

    // NEW — pickup time state
    const [pickupTime, setPickupTime] = useState("");
    const [customTime, setCustomTime] = useState("");
    const [isCustomMode, setIsCustomMode] = useState(false);
    const [timeSlots, setTimeSlots] = useState([]);

    // -----------------------------
    // Generate time slots
    // -----------------------------
    const generateTimeSlots = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 30); // First slot = now + 30m

        const slots = [];
        const endOfDay = new Date();
        endOfDay.setHours(23, 45, 0, 0);

        const cur = new Date(now);

        while (cur <= endOfDay) {
            const h = cur.getHours().toString().padStart(2, "0");
            const m = cur.getMinutes().toString().padStart(2, "0");
            slots.push(`${h}:${m}`);
            cur.setMinutes(cur.getMinutes() + 15);
        }

        setTimeSlots(slots);

        // Default first slot
        if (!pickupTime && slots.length > 0) setPickupTime(slots[0]);
    };

    useEffect(() => {
        generateTimeSlots();
    }, []);

    // -----------------------------
    // Fetch cart items
    // -----------------------------
    const fetchCart = async () => {
        setLoading(true);
        try {
            const res = await api.get("/cart");
            setCart(res.data.items || []);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load cart");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authLoading || !accessToken) return;
        fetchCart();
    }, [api, accessToken, authLoading]);

    // ------------------- SOCKET LISTENER -------------------
    useEffect(() => {
        if (!socket) return;

        const handleNewOrder = (order) => {
            toast.success(`🎉 New order placed! Token: ${order.token}`);
        };

        const handleOrderStatus = ({ orderId, status }) => {
            toast.info(`Order #${orderId} status: ${status}`);
        };

        const handlePaymentUpdate = ({ orderId, paymentStatus }) => {
            if (paymentStatus === "success") toast.success(`✅ Payment successful for order #${orderId}`);
            else toast.error(`❌ Payment failed for order #${orderId}`);
        };

        socket.on("newOrder", handleNewOrder);
        socket.on("orderStatusUpdated", handleOrderStatus);
        socket.on("paymentUpdated", handlePaymentUpdate);

        return () => {
            socket.off("newOrder", handleNewOrder);
            socket.off("orderStatusUpdated", handleOrderStatus);
            socket.off("paymentUpdated", handlePaymentUpdate);
        };
    }, [socket]);

    // Update quantity
    const handleQuantityChange = async (itemId, quantity) => {
        if (quantity < 1) return;
        setLoadingItem(itemId);
        try {
            await api.put("/cart", { itemId, quantity });
            toast.success("Quantity updated");
            await fetchCart();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update quantity");
        } finally {
            setLoadingItem(null);
        }
    };

    // Remove item
    const handleRemoveItem = async (itemId) => {
        setLoadingItem(itemId);
        try {
            await api.delete(`/cart/${itemId}`);
            toast.success("Item removed");
            await fetchCart();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to remove item");
        } finally {
            setLoadingItem(null);
        }
    };

    // Clear cart
    const handleClearCart = async () => {
        if (cart.length === 0) {
            toast.info("Cart is already empty");
            return;
        }
        setClearing(true);
        try {
            await api.delete("/cart");
            toast.success("Cart cleared");
            setCart([]);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to clear cart");
        } finally {
            setClearing(false);
        }
    };

    // ---- Calculations ----
    const itemTotal = cart.reduce((sum, ci) => sum + ci.quantity * ci.item.price, 0);
    const grandTotal = itemTotal + PLATFORM_FEE;

    // ----------------------------------
    // Validate custom time (HH:mm)
    // ----------------------------------
    const validateCustomTime = () => {
        if (!customTime) return false;

        const [ch, cm] = customTime.split(":").map(Number);
        const customDate = new Date();
        customDate.setHours(ch, cm, 0, 0);

        const minAllowed = new Date();
        minAllowed.setMinutes(minAllowed.getMinutes() + 30);

        return customDate >= minAllowed;
    };

    // ----------------------------------
    // Checkout handler (ONLINE ONLY)
    // ----------------------------------
    const handleCheckout = async () => {
        if (cart.length === 0) {
            toast.info("Your cart is empty");
            return;
        }

        if (isCustomMode) {
            if (!customTime || !validateCustomTime()) {
                toast.error("Custom time must be at least 30 minutes from now.");
                return;
            }
        }

        const finalPickupTime = isCustomMode ? customTime : pickupTime;

        if (!finalPickupTime) {
            toast.error("Please select a pickup time.");
            return;
        }

        const canteenIds = cart.map((ci) => ci.item.canteen?._id?.toString());
        const uniqueCanteens = [...new Set(canteenIds)];
        if (uniqueCanteens.length !== 1) {
            toast.error("All items must be from the same canteen to checkout");
            return;
        }
        const canteenId = uniqueCanteens[0];

        const orderItems = cart.map((ci) => ({
            item: ci.item._id,
            quantity: ci.quantity,
        }));

        setProcessing(true);

        try {
            // OPTION A FLOW: Create a PaymentIntent — NOT an Order
            const paymentIntent = await api.post("/payments/initiate", {
                canteen: canteenId,
                items: orderItems,
                totalPrice: Number(grandTotal),
                pickupTime: finalPickupTime,
            });

            if (paymentIntent.data?.redirectUrl) {
                window.location.href = paymentIntent.data.redirectUrl;
            } else {
                toast.error("Failed to start payment, please try again.");
            }
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data?.message || "Checkout failed";
            toast.error(msg);
        } finally {
            setProcessing(false);
        }
    };

    // ---------------------------------------
    // UI — TIME PICKER (Scrollable UI)
    // ---------------------------------------
    const renderTimePicker = () => (
        <div className="p-4 border rounded-2xl bg-background shadow-sm mb-6">
            <h3 className="font-semibold text-primary mb-2">Select Pickup Time ⏱</h3>

            {/* Toggle between preset slots and custom time */}
            <div className="flex gap-4 mb-4">
                <button
                    className={`px-4 py-2 rounded-full text-sm font-medium ${!isCustomMode
                        ? "bg-primary text-white"
                        : "bg-gray-200 dark:bg-gray-800"
                        }`}
                    onClick={() => setIsCustomMode(false)}
                >
                    Choose Slot
                </button>

                <button
                    className={`px-4 py-2 rounded-full text-sm font-medium ${isCustomMode
                        ? "bg-primary text-white"
                        : "bg-gray-200 dark:bg-gray-800"
                        }`}
                    onClick={() => setIsCustomMode(true)}
                >
                    Custom Time
                </button>
            </div>

            {/* PRESET TIME SLOTS */}
            {!isCustomMode && (
                <div className="max-h-48 overflow-y-auto border rounded-xl p-3 space-y-2">
                    {timeSlots.map((slot) => (
                        <div
                            key={slot}
                            onClick={() => setPickupTime(slot)}
                            className={`p-2 rounded-lg cursor-pointer text-sm ${pickupTime === slot
                                ? "bg-primary text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-text"
                                }`}
                        >
                            {slot}
                        </div>
                    ))}
                </div>
            )}

            {/* CUSTOM TIME */}
            {isCustomMode && (
                <div className="mt-4">
                    <input
                        type="time"
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value)}
                        className="p-3 rounded-xl border w-full dark:bg-gray-800"
                    />
                    <p className="text-xs text-text/60 mt-1">
                        Must be minimum 30 minutes from now.
                    </p>
                </div>
            )}
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8 bg-background text-text transition-colors duration-300">
            <SEO
                title="Your Cart"
                description="Review your selected canteen items before checkout and payment on Kantevo."
                canonicalPath="/student/cart"
            />

            <h1 className="text-2xl font-bold text-primary">Cart 🛒</h1>

            {loading ? (
                <p className="text-text/70">Loading cart...</p>
            ) : cart.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-text/70 p-10 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm"
                >
                    Your cart is empty.
                </motion.div>
            ) : (
                <>
                    {renderTimePicker()}

                    {/* Cart Items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {cart.map((cartItem) => (
                            <motion.div
                                key={cartItem.item._id}
                                layout
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="flex flex-col border border-gray-200 dark:border-gray-700 rounded-2xl p-4 bg-background shadow-sm hover:shadow-md transition"
                            >
                                <div className="flex gap-4">
                                    <img
                                        src={cartItem.item.image}
                                        alt={cartItem.item.name}
                                        className="w-24 h-24 object-cover rounded-xl"
                                    />
                                    <div className="flex flex-col justify-between">
                                        <h3 className="font-semibold text-base text-primary">{cartItem.item.name}</h3>
                                        <p className="text-sm text-text/70">
                                            Price: ₹{cartItem.item.price.toFixed(2)}
                                        </p>
                                        <p className="text-sm text-text/70">
                                            Subtotal: ₹{(cartItem.item.price * cartItem.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {/* Quantity controls */}
                                <div className="flex items-center gap-2 mt-3 self-center">
                                    <button
                                        onClick={() => handleQuantityChange(cartItem.item._id, cartItem.quantity - 1)}
                                        className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 font-bold text-primary hover:bg-primary/10 disabled:opacity-40"
                                        disabled={loadingItem === cartItem.item._id}
                                    >
                                        −
                                    </button>
                                    <span className="font-semibold">{cartItem.quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(cartItem.item._id, cartItem.quantity + 1)}
                                        className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 font-bold text-primary hover:bg-primary/10 disabled:opacity-40"
                                        disabled={loadingItem === cartItem.item._id}
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Remove button */}
                                <button
                                    onClick={() => handleRemoveItem(cartItem.item._id)}
                                    className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm disabled:opacity-50 transition"
                                    disabled={loadingItem === cartItem.item._id}
                                >
                                    Remove
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bill Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm bg-background"
                    >
                        <h2 className="text-xl font-bold text-primary mb-2">Bill Summary</h2>
                        <div className="space-y-1 text-sm text-text/80">
                            <p>Item Total: ₹{itemTotal.toFixed(2)}</p>

                            {/* UPDATED: showing only platform fee */}
                            <p>Platform Fee: ₹{PLATFORM_FEE.toFixed(2)}</p>
                        </div>

                        <h3 className="text-lg font-bold mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-primary">
                            To Pay: ₹{grandTotal.toFixed(2)}
                        </h3>
                    </motion.div>

                    {/* Actions */}
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={handleClearCart}
                            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full font-semibold transition"
                            disabled={clearing || processing}
                        >
                            {clearing ? "Clearing..." : "Clear Cart"}
                        </button>

                        <button
                            onClick={handleCheckout}
                            className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-full font-semibold transition"
                            disabled={processing || clearing}
                        >
                            {processing ? "Processing..." : "Pay & Order"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
