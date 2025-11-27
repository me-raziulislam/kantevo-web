// src/pages/admin/CollegeManager.jsx
// Premium college manager

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    BuildingLibraryIcon,
    MapPinIcon,
    HashtagIcon,
    XMarkIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import SEO from "../../components/SEO";

const CollegeManager = () => {
    const [colleges, setColleges] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        location: '',
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingCollege, setEditingCollege] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [collegeToDelete, setCollegeToDelete] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const { api } = useAuth();

    // Fetch all colleges
    const fetchColleges = async () => {
        try {
            setLoading(true);
            const res = await api.get('/colleges');
            setColleges(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load colleges');
        } finally {
            setLoading(false);
        }
    };

    // Handle form input changes
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // Add or update college
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.code) {
            toast.error('Please fill in required fields');
            return;
        }

        try {
            setSaving(true);
            if (editingCollege) {
                const res = await api.patch(`/colleges/${editingCollege._id}`, formData);
                toast.success(`College "${res.data.name}" updated!`);
                setEditingCollege(null);
            } else {
                const res = await api.post('/colleges', formData);
                toast.success(`College "${res.data.name}" added!`);
            }

            setFormData({ name: '', code: '', location: '' });
            setShowForm(false);
            fetchColleges();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Error saving college');
        } finally {
            setSaving(false);
        }
    };

    // Edit college (populate form)
    const handleEdit = (college) => {
        setEditingCollege(college);
        setFormData({
            name: college.name,
            code: college.code,
            location: college.location || '',
        });
        setShowForm(true);
    };

    // Open delete modal
    const handleDelete = (college) => {
        setCollegeToDelete(college);
        setDeleteModalOpen(true);
    };

    // Confirm deletion
    const confirmDelete = async () => {
        try {
            await api.delete(`/colleges/${collegeToDelete._id}`);
            toast.success(`College "${collegeToDelete.name}" deleted`);
            setDeleteModalOpen(false);
            setCollegeToDelete(null);
            fetchColleges();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Error deleting college');
        }
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingCollege(null);
        setFormData({ name: '', code: '', location: '' });
        setShowForm(false);
    };

    useEffect(() => {
        fetchColleges();
    }, []);

    return (
        <div className="space-y-6">
            <SEO
                title="Manage Colleges"
                description="Admin tool to add and manage colleges using the Kantevo canteen ordering system."
                canonicalPath="/admin/colleges"
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Manage Colleges</h1>
                    <p className="text-text-secondary mt-1">Add and manage colleges on the platform</p>
                </div>
                <button
                    onClick={() => { setShowForm(true); setEditingCollege(null); setFormData({ name: '', code: '', location: '' }); }}
                    className="btn-primary px-5 py-2.5 flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add College
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="card p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <BuildingLibraryIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{colleges.length}</p>
                            <p className="text-sm text-text-muted">Total Colleges</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add/Edit Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={cancelEdit}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="card p-6 max-w-lg w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">
                                    {editingCollege ? 'Edit College' : 'Add New College'}
                                </h2>
                                <button onClick={cancelEdit} className="p-2 hover:bg-background-subtle rounded-lg">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        College Name <span className="text-error">*</span>
                                    </label>
                                    <div className="relative">
                                        <BuildingLibraryIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter college name"
                                            className="input input-with-icon"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        College Code <span className="text-error">*</span>
                                    </label>
                                    <div className="relative">
                                        <HashtagIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                                        <input
                                            type="text"
                                            name="code"
                                            value={formData.code}
                                            onChange={handleChange}
                                            placeholder="e.g. NITD123"
                                            className="input input-with-icon uppercase"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        Location
                                    </label>
                                    <div className="relative">
                                        <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="City, State"
                                            className="input input-with-icon"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-border">
                                    <button type="button" onClick={cancelEdit} className="btn-secondary flex-1 py-2.5">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={saving} className="btn-primary flex-1 py-2.5">
                                        {saving ? 'Saving...' : editingCollege ? 'Update College' : 'Add College'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Colleges List */}
            {loading ? (
                <div className="card p-12 text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-text-secondary">Loading colleges...</p>
                </div>
            ) : colleges.length === 0 ? (
                <div className="card p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <BuildingLibraryIcon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">No colleges yet</h3>
                    <p className="text-text-secondary text-sm">Add your first college to get started</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {colleges.map((college, i) => (
                        <motion.div
                            key={college._id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="card p-5"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <BuildingLibraryIcon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{college.name}</h3>
                                        <div className="flex flex-wrap items-center gap-3 mt-1">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                                                {college.code}
                                            </span>
                                            {college.location && (
                                                <span className="text-sm text-text-muted flex items-center gap-1">
                                                    <MapPinIcon className="w-4 h-4" />
                                                    {college.location}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(college)}
                                        className="p-2.5 hover:bg-primary/10 rounded-xl text-primary transition-colors"
                                    >
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(college)}
                                        className="p-2.5 hover:bg-error/10 rounded-xl text-error transition-colors"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteModalOpen && collegeToDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setDeleteModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="card p-6 max-w-md w-full text-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
                                <ExclamationTriangleIcon className="w-8 h-8 text-error" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Delete College?</h3>
                            <p className="text-text-secondary mb-6">
                                Are you sure you want to delete "{collegeToDelete.name}"? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteModalOpen(false)}
                                    className="btn-secondary flex-1 py-2.5"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 py-2.5 rounded-xl bg-error text-white font-medium hover:bg-error/90 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CollegeManager;
