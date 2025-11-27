import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/SEO";

const CanteenDashboard = () => {
    const { loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-56px)] bg-background text-text">
                <div className="max-w-7xl mx-auto px-4 py-10">
                    Loading…
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-56px)] bg-background text-text transition-colors duration-300">

            <SEO
                title="Canteen Dashboard"
                description="Manage your canteen, view orders, update menu items, and track performance on Kantevo."
                canonicalPath="/canteen/dashboard"
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

export default CanteenDashboard;
