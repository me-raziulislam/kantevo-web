// src/pages/AdminDashboard.jsx
// Premium admin dashboard layout

import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/SEO";

const AdminDashboard = () => {
    const { loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-background text-text">
                <div className="container-app py-12">
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-text-secondary">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-text">
            <SEO
                title="Admin Dashboard"
                description="Kantevo admin panel to manage colleges, canteens, and platform data."
                canonicalPath="/admin"
            />
            <div className="container-app py-6 md:py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminDashboard;
