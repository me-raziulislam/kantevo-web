// src/components/ViewCartButton.jsx
// Compact floating cart button

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

const ViewCartButton = ({ itemCount }) => {
    const navigate = useNavigate();

    return (
        <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/student/cart")}
            className="fixed bottom-4 right-4 bg-primary text-white font-medium px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2 z-40 text-sm"
        >
            <div className="relative">
                <ShoppingCartIcon className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white text-primary text-[10px] font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                </span>
            </div>
            <span>View Cart</span>
        </motion.button>
    );
};

export default ViewCartButton;
