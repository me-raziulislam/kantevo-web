// src/components/CanteenCard.jsx
// Premium canteen card component

import { motion } from "framer-motion";
import { ClockIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

const CanteenCard = ({ canteen, active, onSelect, detailed = false }) => {
    if (detailed) {
        return (
            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onSelect(canteen._id)}
                className={`text-left cursor-pointer card p-5 transition-all w-full ${
                    active ? "ring-2 ring-primary shadow-md" : "hover:shadow-md"
                }`}
            >
                <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                            <h3 className="text-lg font-bold mb-1">{canteen.name}</h3>
                            <p className="text-sm text-text-secondary">
                                {canteen.cuisines?.join(" • ") || "Campus Canteen"}
                            </p>
                        </div>
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${
                                canteen.isOpen
                                    ? "bg-success/10 text-success"
                                    : "bg-error/10 text-error"
                            }`}
                        >
                            {canteen.isOpen ? "Open" : "Closed"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-text-muted">
                        <ClockIcon className="w-4 h-4" />
                        <span>{canteen.openingTime} - {canteen.closingTime}</span>
                        {!canteen.isOpenOnSunday && (
                            <span className="text-warning text-xs">• Closed Sundays</span>
                        )}
                    </div>

                    {canteen.nextOpeningText && !canteen.isOpen && (
                        <p className="text-xs text-text-muted italic">{canteen.nextOpeningText}</p>
                    )}

                    {canteen.about && (
                        <p className="text-sm text-text-secondary line-clamp-2">{canteen.about}</p>
                    )}

                    <div className="flex justify-end pt-2">
                        <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                            View Menu
                            <ArrowRightIcon className="w-4 h-4" />
                        </span>
                    </div>
                </div>
            </motion.button>
        );
    }

    // Compact layout
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(canteen._id)}
            className={`text-left cursor-pointer card p-4 transition-all w-full ${
                active ? "ring-2 ring-primary shadow-md" : "hover:shadow-md"
            }`}
        >
            <div className="flex gap-4 items-center">
                <img
                    src={canteen.coverImage || "https://via.placeholder.com/160x90?text=Canteen"}
                    alt={canteen.name}
                    className="h-16 w-24 object-cover rounded-xl"
                />
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{canteen.name}</h3>
                    <p className="text-xs text-text-muted truncate">
                        {canteen.cuisines?.slice(0, 2).join(" • ") || "Canteen"}
                    </p>
                    <span
                        className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            canteen.isOpen
                                ? "bg-success/10 text-success"
                                : "bg-error/10 text-error"
                        }`}
                    >
                        {canteen.isOpen ? "Open" : "Closed"}
                    </span>
                </div>
            </div>
        </motion.button>
    );
};

export default CanteenCard;
