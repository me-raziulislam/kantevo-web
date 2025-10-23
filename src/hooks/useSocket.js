// src/hooks/useSocket.js
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

/**
 * Custom hook to listen to socket events from AuthContext.
 *
 * @param {object} handlers - Event handlers for socket events
 * @param {function} handlers.onCanteenStatusChanged
 * @param {function} handlers.onNewOrder
 * @param {function} handlers.onOrderStatusUpdated
 * @param {function} handlers.onPaymentUpdated
 * @param {function} handlers.onStockUpdated
 */
export default function useSocket({
    onCanteenStatusChanged,
    onNewOrder,
    onOrderStatusUpdated,
    onPaymentUpdated,
    onStockUpdated,
} = {}) {
    const { socket, user } = useAuth();

    useEffect(() => {
        if (!user || !socket?.current) return;
        const s = socket.current;

        // ================== EVENT LISTENERS ==================
        const handleCanteenStatusChanged = (data) => {
            console.log("📢 Canteen status changed:", data);
            onCanteenStatusChanged?.(data);

            // Try to show name instead of ID if available
            const displayName = data.canteenName || `Canteen ${data.canteenId}`;
            toast.info(
                `${data.isOpen ? "✅" : "❌"} ${displayName} is now ${data.isOpen ? "OPEN" : "CLOSED"
                }`
            );
        };

        const handleNewOrder = (order) => {
            if (user.role !== "canteenOwner") return; // ✅ only owners should see this
            console.log("🆕 New Order:", order);
            onNewOrder?.(order);
            toast.success("📦 New order received!");
        };

        const handleOrderStatusUpdated = (order) => {
            console.log("🔄 Order Status Updated:", order);
            onOrderStatusUpdated?.(order);
            toast.info(`Order status updated: ${order.status}`);
        };

        const handlePaymentUpdated = (order) => {
            console.log("💳 Payment Status Updated:", order);
            onPaymentUpdated?.(order);
            toast.info(`Payment status: ${order.paymentStatus}`);
        };

        const handleStockUpdated = (data) => {
            console.log("📉 Stock Updated:", data);
            onStockUpdated?.(data);

            if (user.role === "canteenOwner") {
                toast.warning("📦 Stock updated!");
            } else if (user.role === "student") {
                toast.error("⚠️ An item just went out of stock!");
            }
        };

        // ✅ register listeners
        s.on("canteenStatusChanged", handleCanteenStatusChanged);
        s.on("newOrder", handleNewOrder);
        s.on("orderStatusUpdated", handleOrderStatusUpdated);
        s.on("paymentUpdated", handlePaymentUpdated);
        s.on("stockUpdated", handleStockUpdated);

        // ✅ cleanup on unmount
        return () => {
            s.off("canteenStatusChanged", handleCanteenStatusChanged);
            s.off("newOrder", handleNewOrder);
            s.off("orderStatusUpdated", handleOrderStatusUpdated);
            s.off("paymentUpdated", handlePaymentUpdated);
            s.off("stockUpdated", handleStockUpdated);
        };
    }, [
        socket,
        user,
        onCanteenStatusChanged,
        onNewOrder,
        onOrderStatusUpdated,
        onPaymentUpdated,
        onStockUpdated,
    ]);

    // ✅ still return socket instance if you want to emit manually
    return socket?.current?.connected ? socket.current : null;
}
