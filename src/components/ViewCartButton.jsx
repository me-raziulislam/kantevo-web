import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ViewCartButton = ({ itemCount }) => {
    const navigate = useNavigate();
    return (
        <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate("/student/cart")}
            className="fixed bottom-6 right-6 bg-primary text-white font-semibold px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition"
        >
            🛒 View Cart ({itemCount} items)
        </motion.button>
    );
};

export default ViewCartButton;
