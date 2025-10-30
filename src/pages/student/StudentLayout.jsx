// src/pages/student/StudentLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import SEO from "../../components/SEO";

const StudentLayout = () => {
    const { loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-56px)] bg-background text-text">
                <div className="max-w-7xl mx-auto px-4 py-10">Loading…</div>
            </div>
        );
    }
    return (
        <div className="min-h-[calc(100vh-56px)] bg-background text-text">
            <SEO
                title="Student"
                description="Browse your college canteens, order food, and track orders on Kantevo."
                canonicalPath="/student"
            />
            <div className="max-w-7xl mx-auto px-4 py-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default StudentLayout;
