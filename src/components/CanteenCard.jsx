// src/components/CanteenCard.jsx
import { motion } from "framer-motion";

const CanteenCard = ({ canteen, active, onSelect, detailed = false }) => {
    if (detailed) {
        // --- Detailed layout (like CanteenPage header) ---
        return (
            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => onSelect(canteen._id)}
                className={`text-left cursor-pointer rounded-2xl p-5 border shadow-sm transition ${
                    active
                        ? "border-primary shadow-md"
                        : "border-gray-200 dark:border-gray-700"
                } bg-background w-full hover:shadow-md`}
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                        <h3 className="text-xl font-bold">{canteen.name}</h3>
                        <p className="text-sm text-text/70">
                            {canteen.cuisines?.join(", ") || "Canteen"} ·{" "}
                            {canteen.isOpen ? (
                                <span className="text-green-600 font-medium">
                                    Open Now
                                </span>
                            ) : (
                                <span className="text-red-600 font-medium">
                                    Closed
                                </span>
                            )}
                        </p>
                        <p className="text-xs text-text/60 mt-1">
                            {canteen.openingTime} - {canteen.closingTime}{" "}
                            {!canteen.isOpenOnSunday && "(Closed on Sundays)"}
                        </p>
                        {canteen.nextOpeningText && !canteen.isOpen && (
                            <p className="text-xs text-text/60 mt-1 italic">
                                {canteen.nextOpeningText}
                            </p>
                        )}
                    </div>
                </div>

                {canteen.about && (
                    <p className="text-text/80 text-sm mt-3 leading-relaxed line-clamp-3">
                        {canteen.about}
                    </p>
                )}

                <div className="mt-4 flex justify-end">
                    <span className="text-primary text-sm font-medium hover:underline">
                        View Menu →
                    </span>
                </div>
            </motion.button>
        );
    }

    // --- Compact layout (default) ---
    return (
        <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => onSelect(canteen._id)}
            className={`text-left cursor-pointer rounded-2xl p-3 border shadow-sm transition ${
                active
                    ? "border-primary shadow-md"
                    : "border-gray-200 dark:border-gray-700"
            } bg-background w-full`}
        >
            <div className="flex gap-3 items-center">
                <img
                    src={
                        canteen.coverImage ||
                        "https://via.placeholder.com/160x90?text=Canteen"
                    }
                    alt={canteen.name}
                    className="h-16 w-24 object-cover rounded-xl"
                />
                <div className="flex-1">
                    <div className="font-semibold truncate">{canteen.name}</div>
                    <div className="text-xs text-text/70 truncate">
                        {canteen.tags?.slice(0, 2).join(" · ") || "Canteen"}
                    </div>
                </div>
            </div>
            <div className="mt-3">
                <div
                    className={`inline-flex text-xs px-2 py-0.5 rounded-full ${
                        canteen.isOpen
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                    }`}
                >
                    {canteen.isOpen ? "Open" : "Closed"}
                </div>
            </div>
        </motion.button>
    );
};

export default CanteenCard;
