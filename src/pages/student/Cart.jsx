// pages/student/Cart.jsx
// Premium cart page

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { 
    ShoppingCartIcon, 
    TrashIcon, 
    ClockIcon,
    MinusIcon,
    PlusIcon
} from "@heroicons/react/24/outline";
import SEO from "../../components/SEO";

const PLATFORM_FEE = 1;

const Cart = () => {
    const { user, api, socket, accessToken, loading: authLoading } = useAuth();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingItem, setLoadingItem] = useState(null);
    const [clearing, setClearing] = useState(false);
    const [processing, setProcessing] = useState(false);

    const [pickupTime, setPickupTime] = useState("");
    const [customTime, setCustomTime] = useState("");
    const [isCustomMode, setIsCustomMode] = useState(false);
    const [timeSlots, setTimeSlots] = useState([]);

    const generateTimeSlots = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 30);
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
        if (!pickupTime && slots.length > 0) setPickupTime(slots[0]);
    };

    useEffect(() => {
        generateTimeSlots();
    }, []);

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

    useEffect(() => {
        if (!socket) return;
        const handleNewOrder = (order) => toast.success(`🎉 Order placed! Token: ${order.token}`);
        const handleOrderStatus = ({ orderId, status }) => toast.info(`Order #${orderId} status: ${status}`);
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

    const handleClearCart = async () => {
        if (cart.length === 0) return;
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

    const itemTotal = cart.reduce((sum, ci) => sum + ci.quantity * ci.item.price, 0);
    const grandTotal = itemTotal + PLATFORM_FEE;

    const validateCustomTime = () => {
        if (!customTime) return false;
        const [ch, cm] = customTime.split(":").map(Number);
        const customDate = new Date();
        customDate.setHours(ch, cm, 0, 0);
        const minAllowed = new Date();
        minAllowed.setMinutes(minAllowed.getMinutes() + 30);
        return customDate >= minAllowed;
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        if (isCustomMode && (!customTime || !validateCustomTime())) {
            toast.error("Custom time must be at least 30 minutes from now.");
            return;
        }

        const finalPickupTime = isCustomMode ? customTime : pickupTime;
        if (!finalPickupTime) {
            toast.error("Please select a pickup time.");
            return;
        }

        const canteenIds = cart.map((ci) => ci.item.canteen?._id?.toString());
        const uniqueCanteens = [...new Set(canteenIds)];
        if (uniqueCanteens.length !== 1) {
            toast.error("All items must be from the same canteen");
            return;
        }

        const canteenId = uniqueCanteens[0];
        const orderItems = cart.map((ci) => ({ item: ci.item._id, quantity: ci.quantity }));

        setProcessing(true);
        try {
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
            toast.error(err.response?.data?.error || err.response?.data?.message || "Checkout failed");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            <SEO title="Your Cart" description="Review your cart before checkout on Kantevo." canonicalPath="/student/cart" />

            <h1 className="text-2xl md:text-3xl font-bold">Your Cart</h1>

            {loading ? (
                <div className="card p-12 text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-text-secondary">Loading cart...</p>
                </div>
            ) : cart.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <ShoppingCartIcon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
                    <p className="text-text-secondary text-sm">Add items from a canteen to get started</p>
                </motion.div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence>
                            {cart.map((cartItem) => (
                                <motion.div
                                    key={cartItem.item._id}
                                    layout
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="card p-4 flex gap-4"
                                >
                                    <img
                                        src={cartItem.item.image}
                                        alt={cartItem.item.name}
                                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl"
                                    />
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-semibold">{cartItem.item.name}</h3>
                                            <p className="text-sm text-text-secondary">₹{cartItem.item.price.toFixed(2)} each</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-1 bg-background-subtle rounded-full p-1">
                                                <button
                                                    onClick={() => handleQuantityChange(cartItem.item._id, cartItem.quantity - 1)}
                                                    disabled={loadingItem === cartItem.item._id || cartItem.quantity <= 1}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary/10 disabled:opacity-40"
                                                >
                                                    <MinusIcon className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center font-semibold">{cartItem.quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(cartItem.item._id, cartItem.quantity + 1)}
                                                    disabled={loadingItem === cartItem.item._id}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary/10 disabled:opacity-40"
                                                >
                                                    <PlusIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <p className="font-semibold text-primary">₹{(cartItem.item.price * cartItem.quantity).toFixed(2)}</p>
                                                <button
                                                    onClick={() => handleRemoveItem(cartItem.item._id)}
                                                    disabled={loadingItem === cartItem.item._id}
                                                    className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <button
                            onClick={handleClearCart}
                            disabled={clearing}
                            className="text-error text-sm hover:underline disabled:opacity-50"
                        >
                            {clearing ? "Clearing..." : "Clear entire cart"}
                        </button>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Pickup Time */}
                        <div className="card p-5">
                            <h3 className="font-semibold flex items-center gap-2 mb-4">
                                <ClockIcon className="w-5 h-5 text-primary" />
                                Pickup Time
                            </h3>

                            <div className="flex gap-2 mb-4">
                                <button
                                    onClick={() => setIsCustomMode(false)}
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${!isCustomMode ? "bg-primary text-white" : "bg-background-subtle hover:bg-background-subtle/80"}`}
                                >
                                    Choose Slot
                                </button>
                                <button
                                    onClick={() => setIsCustomMode(true)}
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${isCustomMode ? "bg-primary text-white" : "bg-background-subtle hover:bg-background-subtle/80"}`}
                                >
                                    Custom
                                </button>
                            </div>

                            {!isCustomMode ? (
                                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                                    {timeSlots.map((slot) => (
                                        <button
                                            key={slot}
                                            onClick={() => setPickupTime(slot)}
                                            className={`w-full p-2.5 rounded-lg text-sm text-left transition-colors ${pickupTime === slot ? "bg-primary text-white" : "bg-background-subtle hover:bg-primary/10"}`}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div>
                                    <input
                                        type="time"
                                        value={customTime}
                                        onChange={(e) => setCustomTime(e.target.value)}
                                        className="input"
                                    />
                                    <p className="text-xs text-text-muted mt-2">Min 30 minutes from now</p>
                                </div>
                            )}
                        </div>

                        {/* Bill Summary */}
                        <div className="card p-5">
                            <h3 className="font-semibold mb-4">Bill Summary</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Item Total</span>
                                    <span>₹{itemTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Platform Fee</span>
                                    <span>₹{PLATFORM_FEE.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-border pt-3 mt-3 flex justify-between font-semibold text-base">
                                    <span>To Pay</span>
                                    <span className="text-primary">₹{grandTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <button
                            onClick={handleCheckout}
                            disabled={processing || clearing}
                            className="btn-primary w-full py-3.5 text-base font-semibold disabled:opacity-50"
                        >
                            {processing ? "Processing..." : `Pay ₹${grandTotal.toFixed(2)}`}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
