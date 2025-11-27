// src/pages/canteen/ItemManager.jsx
// Premium item manager

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    PhotoIcon,
    FunnelIcon,
    ArrowsUpDownIcon,
    XMarkIcon,
    ClockIcon
} from "@heroicons/react/24/outline";
import SEO from "../../components/SEO";
import ConfirmModal from "../../components/ConfirmModal";

const categories = ["Breakfast", "Meal", "Beverage", "Snack", "Dessert", "Other"];

const ItemManager = () => {
    const { api, socket } = useAuth();
    const [items, setItems] = useState([]);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [available, setAvailable] = useState(true);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editingItemId, setEditingItemId] = useState(null);
    const [sortOrder, setSortOrder] = useState("newest");
    const [filterAvailable, setFilterAvailable] = useState("all");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [dailyLimit, setDailyLimit] = useState(0);
    const [currentStock, setCurrentStock] = useState(0);
    const [category, setCategory] = useState("Other");
    const [availableFrom, setAvailableFrom] = useState("");
    const [availableTill, setAvailableTill] = useState("");

    // Delete confirmation modal state
    const [deleteModal, setDeleteModal] = useState({ open: false, item: null });

    const observer = useRef();
    const fileInputRef = useRef(null);

    const fetchItems = useCallback(async (pageNum = 1, append = false) => {
        try {
            const res = await api.get("/items/my");
            let fetched = res.data;

            if (filterAvailable !== "all") {
                fetched = fetched.filter((item) => item.available === (filterAvailable === "true"));
            }

            fetched.sort((a, b) => sortOrder === "newest" ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt));

            const pageSize = 6;
            const paginated = fetched.slice(0, pageNum * pageSize);

            setItems((prevItems) => append ? [...prevItems, ...paginated.slice(prevItems.length)] : paginated);
            setHasMore(paginated.length < fetched.length);
        } catch (err) {
            toast.error("Failed to load items");
        }
    }, [filterAvailable, sortOrder, api]);

    useEffect(() => {
        setPage(1);
        fetchItems(1, false);
    }, [filterAvailable, sortOrder, fetchItems]);

    const lastItemRef = useCallback((node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) setPage((prev) => prev + 1);
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        if (page > 1) fetchItems(page, true);
    }, [page, fetchItems]);

    useEffect(() => {
        if (!socket) return;
        const handleItemUpdated = (updatedItem) => {
            setItems((prev) => prev.map((item) => (item._id === updatedItem._id ? updatedItem : item)));
        };
        const handleItemCreated = (newItem) => {
            setItems((prev) => [newItem, ...prev]);
        };
        socket.on("itemUpdated", handleItemUpdated);
        socket.on("itemCreated", handleItemCreated);
        return () => {
            socket.off("itemUpdated", handleItemUpdated);
            socket.off("itemCreated", handleItemCreated);
        };
    }, [socket]);

    const resetForm = () => {
        setName("");
        setPrice("");
        setAvailable(true);
        setImage(null);
        setImagePreview(null);
        setEditingItemId(null);
        setDailyLimit(0);
        setCurrentStock(0);
        setCategory("Other");
        setAvailableFrom("");
        setAvailableTill("");
        setShowForm(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !price) {
            toast.warn("Please enter item name and price");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("available", available);
        formData.append("dailyLimit", dailyLimit);
        formData.append("currentStock", currentStock);
        formData.append("category", category);
        if (availableFrom) formData.append("availableFrom", availableFrom);
        if (availableTill) formData.append("availableTill", availableTill);
        if (image) formData.append("image", image);

        try {
            setLoading(true);
            if (editingItemId) {
                await api.put(`/items/${editingItemId}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
                toast.success("Item updated successfully");
            } else {
                await api.post("/items/", formData, { headers: { "Content-Type": "multipart/form-data" } });
                toast.success("Item added successfully");
            }
            resetForm();
            fetchItems(1, false);
        } catch (err) {
            toast.error(editingItemId ? "Failed to update item" : "Failed to add item");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (item) => {
        setDeleteModal({ open: true, item });
    };

    const confirmDelete = async () => {
        if (!deleteModal.item) return;
        try {
            await api.delete(`/items/${deleteModal.item._id}`);
            toast.success("Item deleted");
            fetchItems(1, false);
        } catch {
            toast.error("Failed to delete item");
        } finally {
            setDeleteModal({ open: false, item: null });
        }
    };

    const handleEdit = (item) => {
        setEditingItemId(item._id);
        setName(item.name);
        setPrice(item.price);
        setAvailable(item.available);
        setImagePreview(item.image || null);
        setImage(null);
        setDailyLimit(item.dailyLimit || 0);
        setCurrentStock(item.currentStock || 0);
        setCategory(item.category || "Other");
        setAvailableFrom(item.availableFrom || "");
        setAvailableTill(item.availableTill || "");
        setShowForm(true);
    };

    return (
        <div className="space-y-6">
            <SEO title="Manage Items" description="Add, edit, or remove food items from your canteen menu." canonicalPath="/canteen/items" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold">Manage Items</h1>
                <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary px-5 py-2.5 flex items-center gap-2">
                    <PlusIcon className="w-5 h-5" />
                    Add New Item
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2">
                    <FunnelIcon className="w-5 h-5 text-text-muted" />
                    <select
                        value={filterAvailable}
                        onChange={(e) => setFilterAvailable(e.target.value)}
                        className="input py-2 text-sm w-auto"
                    >
                        <option value="all">All Items</option>
                        <option value="true">Available</option>
                        <option value="false">Unavailable</option>
                    </select>
                </div>
                <button
                    onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
                    className="btn-secondary px-4 py-2 flex items-center gap-2 text-sm"
                >
                    <ArrowsUpDownIcon className="w-4 h-4" />
                    {sortOrder === "newest" ? "Newest First" : "Oldest First"}
                </button>
            </div>

            {/* Add/Edit Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => resetForm()}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">{editingItemId ? "Edit Item" : "Add New Item"}</h2>
                                <button onClick={resetForm} className="p-2 hover:bg-background-subtle rounded-lg">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">Item Name *</label>
                                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Enter item name" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">Price (₹) *</label>
                                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="input" placeholder="0.00" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">Category</label>
                                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
                                            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">Daily Limit</label>
                                        <input type="number" value={dailyLimit} onChange={(e) => setDailyLimit(Number(e.target.value))} className="input" placeholder="0 = unlimited" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">Current Stock</label>
                                        <input type="number" value={currentStock} onChange={(e) => setCurrentStock(Number(e.target.value))} className="input" placeholder="Available qty" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">Available From</label>
                                        <input type="time" value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} className="input" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">Available Till</label>
                                        <input type="time" value={availableTill} onChange={(e) => setAvailableTill(e.target.value)} className="input" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">Item Image</label>
                                    <div className="flex items-center gap-4">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-xl" />
                                        ) : (
                                            <div className="w-20 h-20 rounded-xl bg-background-subtle flex items-center justify-center">
                                                <PhotoIcon className="w-8 h-8 text-text-muted" />
                                            </div>
                                        )}
                                        <div>
                                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="item-image" />
                                            <label htmlFor="item-image" className="btn-secondary px-4 py-2 text-sm cursor-pointer">
                                                Choose Image
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="relative">
                                        <input type="checkbox" className="sr-only peer" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
                                        <div className={`w-11 h-6 rounded-full transition-colors ${available ? "bg-success" : "bg-border"}`}>
                                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${available ? "translate-x-5" : ""}`} />
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium">Available for ordering</span>
                                </label>

                                <div className="flex gap-3 pt-4 border-t border-border">
                                    <button type="button" onClick={resetForm} className="btn-secondary flex-1 py-2.5">Cancel</button>
                                    <button type="submit" disabled={loading} className="btn-primary flex-1 py-2.5">
                                        {loading ? "Saving..." : editingItemId ? "Update Item" : "Add Item"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Items Grid */}
            {items.length === 0 ? (
                <div className="card p-12 text-center">
                    <PhotoIcon className="w-12 h-12 text-text-muted mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No items yet</h3>
                    <p className="text-text-secondary text-sm">Add your first menu item to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item, index) => {
                        const isLast = index === items.length - 1;
                        return (
                            <motion.div
                                key={item._id}
                                ref={isLast ? lastItemRef : null}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className="card p-4"
                            >
                                <div className="flex gap-4">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                                    ) : (
                                        <div className="w-20 h-20 rounded-xl bg-background-subtle flex items-center justify-center">
                                            <PhotoIcon className="w-8 h-8 text-text-muted" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold truncate">{item.name}</h3>
                                        <p className="text-primary font-bold">₹{item.price}</p>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.available ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}>
                                                {item.available ? "Available" : "Unavailable"}
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">{item.category}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                                    <div className="flex items-center gap-2 text-xs text-text-muted">
                                        <span>Stock: {item.currentStock}/{item.dailyLimit === 0 ? "∞" : item.dailyLimit}</span>
                                        {(item.availableFrom || item.availableTill) && (
                                            <span className="flex items-center gap-1">
                                                <ClockIcon className="w-3 h-3" />
                                                {item.availableFrom || "00:00"} - {item.availableTill || "23:59"}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(item)} className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors">
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(item)} className="p-2 hover:bg-error/10 rounded-lg text-error transition-colors">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {hasMore && items.length > 0 && (
                <div className="text-center py-4">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteModal.open && (
                    <ConfirmModal
                        title="Delete Item"
                        onClose={() => setDeleteModal({ open: false, item: null })}
                        onConfirm={confirmDelete}
                        confirmText="Delete"
                        cancelText="Cancel"
                        variant="danger"
                    >
                        <p>
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-text">"{deleteModal.item?.name}"</span>?
                        </p>
                        <p className="text-sm text-text-muted mt-2">
                            This action cannot be undone.
                        </p>
                    </ConfirmModal>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ItemManager;
