import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { FaTrash, FaPlus, FaEdit, FaSave, FaTimes, FaSort } from "react-icons/fa";
import SEO from "../../components/SEO";

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

    // New fields
    const [dailyLimit, setDailyLimit] = useState(0);
    const [currentStock, setCurrentStock] = useState(0);
    const [category, setCategory] = useState("Other");
    const [availableFrom, setAvailableFrom] = useState("");
    const [availableTill, setAvailableTill] = useState("");

    const observer = useRef();
    const fileInputRef = useRef(null);

    const fetchItems = useCallback(
        async (pageNum = 1, append = false) => {
            try {
                const res = await api.get("/items/my");
                let fetched = res.data;

                if (filterAvailable !== "all") {
                    fetched = fetched.filter(
                        (item) => item.available === (filterAvailable === "true")
                    );
                }

                fetched.sort((a, b) =>
                    sortOrder === "newest"
                        ? new Date(b.createdAt) - new Date(a.createdAt)
                        : new Date(a.createdAt) - new Date(b.createdAt)
                );

                const pageSize = 5;
                const paginated = fetched.slice(0, pageNum * pageSize);

                setItems((prevItems) =>
                    append
                        ? [...prevItems, ...paginated.slice(prevItems.length)]
                        : paginated
                );
                setHasMore(paginated.length < fetched.length);
            } catch (err) {
                toast.error("Failed to load items");
                console.error(err);
            }
        },
        [filterAvailable, sortOrder, api]
    );

    useEffect(() => {
        setPage(1);
        fetchItems(1, false);
    }, [filterAvailable, sortOrder, fetchItems]);

    const lastItemRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    useEffect(() => {
        if (page > 1) fetchItems(page, true);
    }, [page, fetchItems]);

    // ------------------- SOCKET LISTENERS -------------------
    useEffect(() => {
        if (!socket) return;

        const handleItemUpdated = (updatedItem) => {
            setItems((prev) =>
                prev.map((item) => (item._id === updatedItem._id ? updatedItem : item))
            );
            toast.info(`Item "${updatedItem.name}" updated`);
        };

        const handleItemCreated = (newItem) => {
            setItems((prev) => [newItem, ...prev]);
            toast.success(`New item "${newItem.name}" added`);
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
                await api.put(`/items/${editingItemId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Item updated successfully");
            } else {
                await api.post("/items/", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Item added successfully");
            }

            resetForm();
            fetchItems(1, false);
        } catch (err) {
            toast.error(editingItemId ? "Failed to update item" : "Failed to add item");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (itemId) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        try {
            await api.delete(`/items/${itemId}`);
            toast.success("Item deleted");
            fetchItems(1, false);
        } catch (err) {
            toast.error("Failed to delete item");
            console.error(err);
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
    };

    return (
        <div className="p-4 sm:p-6 bg-background text-text min-h-full">

            <SEO
                title="Manage Items"
                description="Add, edit, or remove food items from your canteen’s digital menu on Kantevo."
                canonicalPath="/canteen/items"
            />

            <h1 className="text-2xl font-semibold mb-6 text-center sm:text-left">
                Manage Your Items
            </h1>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
                <select
                    value={filterAvailable}
                    onChange={(e) => setFilterAvailable(e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="all">All</option>
                    <option value="true">Available</option>
                    <option value="false">Not Available</option>
                </select>
                <button
                    onClick={() =>
                        setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
                    }
                    className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded flex items-center gap-2 bg-background text-text hover:bg-primary hover:text-white transition"
                >
                    <FaSort /> {sortOrder === "newest" ? "Newest First" : "Oldest First"}
                </button>
            </div>

            {/* Add/Update Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-background border border-gray-300 dark:border-gray-600 p-4 sm:p-6 rounded shadow mb-6 space-y-4"
            >
                <h2 className="text-lg font-semibold text-text">
                    {editingItemId ? "Update Item" : "Add New Item"}
                </h2>

                {/* Main fields with labels */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                        <label className="mb-1 text-text font-medium">Item Name</label>
                        <input
                            type="text"
                            placeholder="Enter item name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded w-full bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-text font-medium">Price (₹)</label>
                        <input
                            type="number"
                            placeholder="Enter price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded w-full bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="flex items-center gap-2 mt-6 sm:mt-0">
                        <input
                            type="checkbox"
                            checked={available}
                            onChange={(e) => setAvailable(e.target.checked)}
                            className="toggle-checkbox"
                        />
                        <label className="text-text font-medium">Available</label>
                    </div>
                </div>

                {/* Additional fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                        <label className="mb-1 text-text font-medium">Daily Limit</label>
                        <input
                            type="number"
                            placeholder="0 = unlimited"
                            value={dailyLimit}
                            onChange={(e) => setDailyLimit(Number(e.target.value))}
                            className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded w-full bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-text font-medium">Current Stock</label>
                        <input
                            type="number"
                            placeholder="Available stock"
                            value={currentStock}
                            onChange={(e) => setCurrentStock(Number(e.target.value))}
                            className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded w-full bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-text font-medium">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded w-full bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="Breakfast">Breakfast</option>
                            <option value="Meal">Meal</option>
                            <option value="Beverage">Beverage</option>
                            <option value="Snack">Snack</option>
                            <option value="Dessert">Dessert</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                {/* Time slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="mb-1 text-text font-medium">Available From</label>
                        <input
                            type="time"
                            value={availableFrom}
                            onChange={(e) => setAvailableFrom(e.target.value)}
                            className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded w-full bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-text font-medium">Available Till</label>
                        <input
                            type="time"
                            value={availableTill}
                            onChange={(e) => setAvailableTill(e.target.value)}
                            className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded w-full bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                {/* Image upload */}
                <div className="flex flex-col">
                    <label className="mb-1 text-text font-medium">Item Image</label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded w-full bg-background text-text"
                    />
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="mt-2 w-32 h-32 object-cover rounded"
                        />
                    )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark flex items-center justify-center gap-2 disabled:opacity-50 transition"
                    >
                        {loading ? "Saving..." : (editingItemId ? "Update Item" : "Add Item")}
                    </button>
                    {editingItemId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 flex items-center justify-center gap-2 transition"
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>

            {/* Item List */}
            <div className="bg-background border border-gray-300 dark:border-gray-600 p-4 sm:p-6 rounded shadow">
                <h2 className="text-lg font-semibold mb-4 text-text">Your Items</h2>
                {items.length === 0 ? (
                    <p className="text-text/80">No items found.</p>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((item, index) => {
                            const isLast = index === items.length - 1;
                            return (
                                <div
                                    key={item._id}
                                    ref={isLast ? lastItemRef : null}
                                    className="rounded-lg p-3 sm:p-4 shadow flex flex-col sm:flex-row items-center sm:items-start gap-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 hover:shadow-lg transition"
                                >
                                    {item.image && (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 sm:w-16 sm:h-16 object-cover rounded"
                                        />
                                    )}
                                    <div className="flex-1 text-center sm:text-left flex flex-col gap-1">
                                        <div className="text-md font-semibold text-text">{item.name}</div>
                                        <div className="text-sm text-gray-700 dark:text-gray-300">
                                            ₹{item.price}
                                        </div>
                                        <div className={`text-xs px-2 py-0.5 rounded inline-block mt-1 ${item.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                            {item.available ? "Available" : "Not Available"}
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-1 text-xs">
                                            <span className="px-1 py-0.5 bg-blue-100 dark:bg-blue-700 rounded text-blue-800 dark:text-blue-200">
                                                Stock: {item.currentStock} / {item.dailyLimit === 0 ? "∞" : item.dailyLimit}
                                            </span>
                                            <span className="px-1 py-0.5 bg-purple-100 dark:bg-purple-700 rounded text-purple-800 dark:text-purple-200">
                                                {item.category}
                                            </span>
                                            {(item.availableFrom || item.availableTill) && (
                                                <span className="px-1 py-0.5 bg-yellow-100 dark:bg-yellow-700 rounded text-yellow-800 dark:text-yellow-200">
                                                    {item.availableFrom || "00:00"} - {item.availableTill || "23:59"}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-2 sm:mt-0 sm:flex-col sm:items-end">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="text-primary hover:underline flex items-center gap-1 text-sm"
                                        >
                                            <FaEdit /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="text-red-500 hover:underline flex items-center gap-1 text-sm"
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItemManager;
