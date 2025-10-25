import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import SEO from "../../components/SEO";

// ---- Configurable charges ----
const GST_PERCENT = 0; // %
const CANTEEN_CHARGE = 0; // flat ₹
const PLATFORM_FEE = 1; // flat ₹

const Cart = () => {
    const { user, api, socket } = useAuth(); // ✅ added socket from context
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
        fetchCart();
    }, [api]);

    // ------------------- SOCKET LISTENER -------------------
    useEffect(() => {
        if (!socket) return;

        // const handleCartUpdate = (updatedCart) => {
        //     setCart(updatedCart.items || []);
        //     toast.info("Cart updated in real-time");
        // };

        const handleNewOrder = (order) => {
            toast.success(`🎉 New order placed! Token: ${order.token}`);
        };

        const handleOrderStatus = ({ orderId, status }) => {
            toast.info(`Order #${orderId} status: ${status}`);
        };

        const handlePaymentUpdate = ({ orderId, paymentStatus }) => {
            if (paymentStatus === "success") {
                toast.success(`✅ Payment successful for order #${orderId}`);
            } else {
                toast.error(`❌ Payment failed for order #${orderId}`);
            }
        };

        // socket.on("cartUpdated", handleCartUpdate);
        socket.on("newOrder", handleNewOrder);
        socket.on("orderStatusUpdated", handleOrderStatus);
        socket.on("paymentUpdated", handlePaymentUpdate);

        return () => {
            // socket.off("cartUpdated", handleCartUpdate);
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

        const canteenIds = cart.map(ci => ci.item.canteen?._id?.toString());
        const uniqueCanteens = [...new Set(canteenIds)];
        if (uniqueCanteens.length !== 1) {
            toast.error("All items must be from the same canteen to checkout");
            return;
        }
        const canteenId = uniqueCanteens[0];

        const orderItems = cart.map(ci => ({
            item: ci.item._id,
            quantity: ci.quantity
        }));

        setProcessing(true);

        try {
            // Step 1: Create order in backend
            const res = await api.post("/orders", {
                canteen: canteenId,
                items: orderItems,
                totalPrice: Number(grandTotal),
                paymentMethod
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

                if (paymentRes.data?.redirectUrl) {
                    // Step 3: Redirect user to PhonePe hosted checkout page
                    window.location.href = paymentRes.data.redirectUrl;
                } else {
                    toast.error("Failed to start payment, please try again.");
                }
            }
        } catch (err) {
            // ✅ Show exact backend message if available
            const msg =
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Order creation failed";
            toast.error(msg);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto bg-background text-text transition-colors duration-300">

            <SEO
                title="Your Cart"
                description="Review your selected canteen items before checkout and payment on Kantevo."
                canonicalPath="/student/cart"
            />

            <h1 className="text-2xl font-semibold text-text">{user?.name}'s Cart 🛒</h1>

            {loading ? (
                <p className="text-text/80">Loading cart...</p>
            ) : cart.length === 0 ? (
                <p className="text-text/80">Your cart is empty.</p>
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
                                className="cursor-pointer"
                            />
                            Offline Payment
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value="online"
                                checked={paymentMethod === "online"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="cursor-pointer"
                            />
                            Online Payment
                        </label>
                    </div>

                    {/* Cart Items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {cart.map((cartItem) => (
                            <div
                                key={cartItem.item._id}
                                className="border border-gray-300 dark:border-gray-600 rounded-2xl p-4 flex flex-col justify-between shadow-sm bg-background text-text transition-colors duration-300"
                            >
                                <div className="flex gap-4">
                                    <img
                                        src={cartItem.item.image}
                                        alt={cartItem.item.name}
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                    <div>
                                        <h3 className="font-bold text-primary">{cartItem.item.name}</h3>
                                        <p className="text-text/70">Price: ₹{cartItem.item.price.toFixed(2)}</p>
                                        <p className="text-text/70">Subtotal: ₹{(cartItem.item.price * cartItem.quantity).toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-2">
                                    <button
                                        onClick={() => handleQuantityChange(cartItem.item._id, cartItem.quantity - 1)}
                                        className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 transition-colors duration-300 cursor-pointer"
                                        disabled={loadingItem === cartItem.item._id}
                                    >
                                        -
                                    </button>
                                    <span className="w-6 text-center">{cartItem.quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(cartItem.item._id, cartItem.quantity + 1)}
                                        className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 transition-colors duration-300 cursor-pointer"
                                        disabled={loadingItem === cartItem.item._id}
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    onClick={() => handleRemoveItem(cartItem.item._id)}
                                    className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded disabled:opacity-50 transition-colors duration-300"
                                    disabled={loadingItem === cartItem.item._id}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Bill Summary */}
                    <div className="mt-8 p-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm bg-background text-text transition-colors duration-300">
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
                        <h2 className="text-xl font-semibold text-primary">Bill Summary</h2>
                        <div className="space-y-1 mt-2 text-text">
                            <p>Item Total: ₹{itemTotal.toFixed(2)}</p>
                            <p>GST ({GST_PERCENT}%): ₹{gstAmount.toFixed(2)}</p>
                            <p>Canteen Charges: ₹{CANTEEN_CHARGE.toFixed(2)}</p>
                            <p>Platform Fee: ₹{PLATFORM_FEE.toFixed(2)}</p>
                            <h3 className="text-lg font-bold mt-2 border-t border-gray-300 dark:border-gray-600 pt-2 text-primary">
                                To Pay: ₹{grandTotal.toFixed(2)}
                            </h3>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center mt-8 border-t border-gray-300 dark:border-gray-600 pt-4">
                        <button
                            onClick={handleClearCart}
                            className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 disabled:opacity-50 transition-colors duration-300"
                            disabled={clearing || processing}
                        >
                            {clearing ? "Clearing..." : "Clear Cart"}
                        </button>

                        <button
                            onClick={handleCheckout}
                            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 disabled:opacity-50 transition-colors duration-300"
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
