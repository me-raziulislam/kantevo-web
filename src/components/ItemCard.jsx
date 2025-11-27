// src/components/ItemCard.jsx
// Premium item card for canteen menu

import { motion } from "framer-motion";
import { MinusIcon, PlusIcon, ClockIcon } from "@heroicons/react/24/outline";

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
            className="card p-4 flex flex-col sm:flex-row gap-4"
        >
            {/* Item Image */}
            {item.image && (
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full sm:w-28 h-28 object-cover rounded-xl shrink-0"
                />
            )}

            {/* Item Info */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-base sm:text-lg">{item.name}</h3>
                        <p className="text-primary font-bold text-lg shrink-0">₹{item.price}</p>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${isAvailableNow
                                ? "bg-success/10 text-success"
                                : "bg-error/10 text-error"
                                }`}
                        >
                            {isAvailableNow ? "Available" : item.reason || "Unavailable"}
                        </span>

                        {item.category && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                                {item.category}
                            </span>
                        )}

                        {countdownText && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning flex items-center gap-1">
                                <ClockIcon className="w-3 h-3" />
                                {countdownText}
                            </span>
                        )}
                    </div>

                    {item.description && (
                        <p className="text-sm text-text-muted line-clamp-2">{item.description}</p>
                    )}
                </div>

                {/* Add/Quantity Controls */}
                <div className="mt-3 flex justify-end">
                    {quantity > 0 ? (
                        <div
                            className="flex items-center gap-1 bg-primary/10 rounded-full p-1"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={onDec}
                                disabled={disabled}
                                className="w-9 h-9 rounded-full flex items-center justify-center text-primary hover:bg-primary/20 disabled:opacity-40 transition-colors"
                            >
                                <MinusIcon className="w-5 h-5" />
                            </button>
                            <span className="w-8 text-center font-bold text-primary">{quantity}</span>
                            <button
                                onClick={onInc}
                                disabled={disabled}
                                className="w-9 h-9 rounded-full flex items-center justify-center text-primary hover:bg-primary/20 disabled:opacity-40 transition-colors"
                            >
                                <PlusIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            disabled={disabled}
                            onClick={onAdd}
                            className={`px-6 py-2.5 rounded-xl font-semibold transition-colors ${disabled
                                ? "bg-background-subtle text-text-muted cursor-not-allowed border border-border"
                                : "bg-primary text-white hover:bg-primary-dark"
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    Adding...
                                </span>
                            ) : (
                                "Add"
                            )}
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ItemCard;
