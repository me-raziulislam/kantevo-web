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
    const [paymentMethod, setPaymentMethod] = useState("offline");

    // Fetch cart items
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
    const gstAmount = (itemTotal * GST_PERCENT) / 100;
    const grandTotal = itemTotal + gstAmount + CANTEEN_CHARGE + PLATFORM_FEE;

    // Checkout handler
    const handleCheckout = async () => {
        if (cart.length === 0) {
            toast.info("Your cart is empty");
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
            // Step 1: Create order in backend
            const res = await api.post("/orders", {
                canteen: canteenId,
                items: orderItems,
                totalPrice: Number(grandTotal),
                paymentMethod,
            });

            if (paymentMethod === "offline") {
                // Offline payment
                toast.success(`Order placed! Token: ${res.data.token}`);
                await handleClearCart();
            } else {
                // Online payment flow (PhonePe)
                const createdOrderId = res.data._id;

                // Step 2: Initiate payment with backend
                const paymentRes = await api.post("/payments/initiate", {
                    orderId: createdOrderId,
                    amount: Number(grandTotal),
                });

                if (paymentRes.data?.redirectUrl) window.location.href = paymentRes.data.redirectUrl;
                else toast.error("Failed to start payment, please try again.");
            }
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data?.message || "Order creation failed";
            toast.error(msg);
        } finally {
            setProcessing(false);
        }
    };

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
                    {/* Payment method selection */}
                    <div className="flex gap-6 mb-4 text-text">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value="offline"
                                checked={paymentMethod === "offline"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            Offline Payment
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value="online"
                                checked={paymentMethod === "online"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            Online Payment
                        </label>
                    </div>

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
                        <div
                            className={`mb-3 p-2 rounded text-sm font-medium text-center ${paymentMethod === "offline"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                                }`}
                        >
                            {paymentMethod === "offline"
                                ? "You will pay at the canteen counter"
                                : "You will pay online securely"}
                        </div>

                        <h2 className="text-xl font-bold text-primary mb-2">Bill Summary</h2>
                        <div className="space-y-1 text-sm text-text/80">
                            <p>Item Total: ₹{itemTotal.toFixed(2)}</p>
                            <p>GST ({GST_PERCENT}%): ₹{gstAmount.toFixed(2)}</p>
                            <p>Canteen Charges: ₹{CANTEEN_CHARGE.toFixed(2)}</p>
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
                            {processing
                                ? paymentMethod === "offline"
                                    ? "Placing order..."
                                    : "Processing payment..."
                                : paymentMethod === "offline"
                                    ? "Proceed to order"
                                    : "Pay and order"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
