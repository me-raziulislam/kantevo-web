// src/pages/student/StudentHome.jsx
// Premium student home page

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon, BuildingStorefrontIcon } from "@heroicons/react/24/outline";
import SEO from "../../components/SEO";
import CanteenCard from "../../components/CanteenCard";
import ViewCartButton from "../../components/ViewCartButton";

const StudentHome = () => {
    const { user, api, accessToken, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [canteens, setCanteens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [cartCount, setCartCount] = useState(0);

    // Fetch canteens
    useEffect(() => {
        if (authLoading || !user?.college) return;
        const collegeId = user.college._id || user.college;
        (async () => {
            try {
                setLoading(true);
                const res = await api.get(`/canteens/college/${collegeId}`);
                setCanteens(res.data || []);
            } catch {
                toast.error("Failed to load canteens");
            } finally {
                setLoading(false);
            }
        })();
    }, [api, user, authLoading]);

    // Fetch cart count
    useEffect(() => {
        if (authLoading || !accessToken) return;
        (async () => {
            try {
                const res = await api.get("/cart");
                const items = res.data?.items || [];
                const count = items.reduce((sum, item) => sum + item.quantity, 0);
                setCartCount(count);
            } catch {
                // Silently fail - cart is optional context
            }
        })();
    }, [api, accessToken, authLoading]);

    const onSelectCanteen = (id) => {
        navigate(`/student/canteen/${id}`);
    };

    const filteredCanteens = canteens.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openCanteens = filteredCanteens.filter((c) => c.isOpen);
    const closedCanteens = filteredCanteens.filter((c) => !c.isOpen);

    return (
        <div className="space-y-8 pb-16">
            <SEO
                title="Explore Canteens"
                description="Browse nearby canteens, view menus, and order your favorite dishes easily on Kantevo."
                canonicalPath="/student/home"
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl md:text-3xl font-bold"
                    >
                        Hey, {user?.name?.split(" ")[0]}! 👋
                    </motion.h1>
                    <p className="text-text-secondary mt-1">
                        What would you like to eat today?
                    </p>
                </div>

                {/* Search */}
                <div className="relative w-full md:w-80">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search canteens..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input input-with-icon"
                    />
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="card p-12 text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-text-secondary">Loading canteens...</p>
                </div>
            ) : filteredCanteens.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-12 text-center"
                >
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <BuildingStorefrontIcon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">No canteens found</h3>
                    <p className="text-text-secondary text-sm">
                        {searchQuery
                            ? "Try a different search term"
                            : "No canteens are available in your college yet"}
                    </p>
                </motion.div>
            ) : (
                <div className="space-y-8">
                    {/* Open Canteens */}
                    {openCanteens.length > 0 && (
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                <h2 className="font-semibold text-lg">Open Now</h2>
                                <span className="text-text-muted text-sm">({openCanteens.length})</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {openCanteens.map((c, i) => (
                                    <motion.div
                                        key={c._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <CanteenCard
                                            canteen={c}
                                            onSelect={onSelectCanteen}
                                            detailed
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Closed Canteens */}
                    {closedCanteens.length > 0 && (
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 rounded-full bg-text-muted" />
                                <h2 className="font-semibold text-lg text-text-secondary">Closed</h2>
                                <span className="text-text-muted text-sm">({closedCanteens.length})</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-60">
                                {closedCanteens.map((c, i) => (
                                    <motion.div
                                        key={c._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <CanteenCard
                                            canteen={c}
                                            onSelect={onSelectCanteen}
                                            detailed
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}

            {/* Floating Cart Button */}
            {cartCount > 0 && <ViewCartButton itemCount={cartCount} />}
        </div>
    );
};

export default StudentHome;
