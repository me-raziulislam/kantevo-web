import { motion } from "framer-motion";

const ItemCard = ({
    item,
    quantity,
    disabled,
    onAdd,
    onInc,
    onDec,
    countdownText,
    isAvailableNow,
    loading,
}) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 border rounded-2xl p-3 bg-background text-text border-gray-200 dark:border-gray-700 shadow hover:shadow-md transition"
        >
            {/* ---------- Item Image ---------- */}
            {item.image && (
                <img
                    src={item.image}
                    alt={item.name}
                    className="rounded-xl w-full sm:w-28 h-28 object-cover sm:flex-shrink-0"
                />
            )}

            {/* ---------- Item Info ---------- */}
            <div className="flex flex-col flex-1 justify-between w-full">
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-base sm:text-lg truncate">{item.name}</h3>
                    <p className="text-primary font-semibold text-sm sm:text-base">₹{item.price}</p>
                </div>

                {/* ---------- Availability Badges ---------- */}
                <div className="flex items-start justify-between gap-2 mb-2 flex-wrap mt-1">
                    <div className="flex flex-wrap gap-1 text-[10px]">
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
                    {countdownText && (
                        <p className="text-[10px] text-yellow-800 font-semibold">{countdownText}</p>
                    )}
                </div>

                {/* ---------- Add Button / Quantity Control ---------- */}
                <div className="mt-auto">
                    {quantity > 0 ? (
                        <div
                            className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden w-28 h-9 border border-gray-300 dark:border-gray-600"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={onDec}
                                disabled={disabled}
                                className="w-9 h-9 font-bold text-primary hover:bg-primary/10 disabled:opacity-40"
                            >
                                −
                            </button>
                            <span className="w-8 text-center font-semibold">{quantity}</span>
                            <button
                                onClick={onInc}
                                disabled={disabled}
                                className="w-9 h-9 font-bold text-primary hover:bg-primary/10 disabled:opacity-40"
                            >
                                +
                            </button>
                        </div>
                    ) : (
                        <button
                            disabled={disabled}
                            onClick={onAdd}
                            className="bg-primary hover:bg-primary-dark text-white px-4 py-1.5 rounded-full font-semibold disabled:bg-gray-400 transition-colors duration-300"
                        >
                            {loading ? "Adding..." : "Add"}
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ItemCard;
