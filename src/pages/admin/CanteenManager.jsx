// src/pages/admin/CanteenManager.jsx
// Premium canteen manager

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
    MagnifyingGlassIcon,
    BuildingStorefrontIcon,
    ClockIcon,
    XMarkIcon,
    AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import SEO from "../../components/SEO";

const CanteenManager = () => {
    const [canteens, setCanteens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [editTimingsModal, setEditTimingsModal] = useState(null);
    const [timingsForm, setTimingsForm] = useState({
        openingTime: '',
        closingTime: '',
        isOpenOnSunday: false
    });
    const [savingTimings, setSavingTimings] = useState(false);

    const { api } = useAuth();

    const fetchCanteens = async () => {
        setLoading(true);
        try {
            const res = await api.get('/canteens');
            const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
            setCanteens(sorted);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load canteens');
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        if (!window.confirm(`Are you sure you want to mark this canteen as ${currentStatus ? 'Closed' : 'Open'}?`)) {
            return;
        }
        try {
            const res = await api.patch(`/canteens/${id}/status`, {
                isOpen: !currentStatus,
            });
            toast.success(`Canteen is now ${res.data.isOpen ? 'Open' : 'Closed'}`);
            fetchCanteens();
        } catch (err) {
            console.error(err);
            toast.error('Failed to update status');
        }
    };

    const openTimingsModal = (canteen) => {
        setEditTimingsModal(canteen);
        setTimingsForm({
            openingTime: canteen.openingTime || '09:00',
            closingTime: canteen.closingTime || '18:00',
            isOpenOnSunday: canteen.isOpenOnSunday || false
        });
    };

    const saveTimings = async () => {
        if (!editTimingsModal) return;
        try {
            setSavingTimings(true);
            await api.patch(`/canteens/${editTimingsModal._id}/timings`, {
                openingTime: timingsForm.openingTime,
                closingTime: timingsForm.closingTime,
                isOpenOnSunday: timingsForm.isOpenOnSunday,
            });
            toast.success('Canteen timings updated');
            setEditTimingsModal(null);
            fetchCanteens();
        } catch (err) {
            console.error(err);
            toast.error('Failed to update timings');
        } finally {
            setSavingTimings(false);
        }
    };

    useEffect(() => {
        fetchCanteens();
    }, []);

    const filteredCanteens = canteens.filter((canteen) =>
        canteen.name.toLowerCase().includes(search.toLowerCase()) ||
        canteen.college?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const openCount = filteredCanteens.filter(c => c.isOpen).length;
    const closedCount = filteredCanteens.filter(c => !c.isOpen).length;

    return (
        <div className="space-y-6">
            <SEO
                title="Manage Canteens"
                description="View and manage all registered canteens across colleges on Kantevo."
                canonicalPath="/admin/canteens"
            />

            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">Manage Canteens</h1>
                <p className="text-text-secondary mt-1">View and manage all registered canteens</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="card p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <BuildingStorefrontIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{canteens.length}</p>
                            <p className="text-sm text-text-muted">Total Canteens</p>
                        </div>
                    </div>
                </div>
                <div className="card p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-success" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{openCount}</p>
                            <p className="text-sm text-text-muted">Currently Open</p>
                        </div>
                    </div>
                </div>
                <div className="card p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-error" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{closedCount}</p>
                            <p className="text-sm text-text-muted">Currently Closed</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                <input
                    type="text"
                    placeholder="Search by canteen or college name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input input-with-icon"
                />
            </div>

            {/* Canteens List */}
            {loading ? (
                <div className="card p-12 text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-text-secondary">Loading canteens...</p>
                </div>
            ) : filteredCanteens.length === 0 ? (
                <div className="card p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <BuildingStorefrontIcon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">No canteens found</h3>
                    <p className="text-text-secondary text-sm">
                        {search ? 'Try a different search term' : 'No canteens registered yet'}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredCanteens.map((canteen, i) => (
                        <motion.div
                            key={canteen._id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="card p-5"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${canteen.isOpen ? 'bg-success/10' : 'bg-error/10'}`}>
                                        <BuildingStorefrontIcon className={`w-6 h-6 ${canteen.isOpen ? 'text-success' : 'text-error'}`} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h3 className="font-semibold text-lg">{canteen.name}</h3>
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${canteen.isOpen ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                                                {canteen.isOpen ? 'Open' : 'Closed'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-text-secondary mt-1">
                                            {canteen.college?.name || 'No college assigned'}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-text-muted">
                                            <span className="flex items-center gap-1">
                                                <ClockIcon className="w-4 h-4" />
                                                {canteen.openingTime || '09:00'} – {canteen.closingTime || '18:00'}
                                            </span>
                                            <span className={canteen.isOpenOnSunday ? 'text-success' : 'text-warning'}>
                                                Sunday: {canteen.isOpenOnSunday ? 'Open' : 'Closed'}
                                            </span>
                                        </div>
                                        {(canteen.specialOpenings?.length > 0 || canteen.specialClosings?.length > 0) && (
                                            <div className="flex gap-3 mt-2 text-xs">
                                                {canteen.specialOpenings?.length > 0 && (
                                                    <span className="text-accent">
                                                        {canteen.specialOpenings.length} special opening(s)
                                                    </span>
                                                )}
                                                {canteen.specialClosings?.length > 0 && (
                                                    <span className="text-warning">
                                                        {canteen.specialClosings.length} special closing(s)
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button
                                        onClick={() => toggleStatus(canteen._id, canteen.isOpen)}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${canteen.isOpen
                                                ? 'bg-error/10 text-error hover:bg-error/20'
                                                : 'bg-success/10 text-success hover:bg-success/20'
                                            }`}
                                    >
                                        {canteen.isOpen ? 'Close' : 'Open'}
                                    </button>
                                    <button
                                        onClick={() => openTimingsModal(canteen)}
                                        className="px-4 py-2 rounded-xl text-sm font-medium bg-accent/10 text-accent hover:bg-accent/20 transition-colors flex items-center gap-2"
                                    >
                                        <AdjustmentsHorizontalIcon className="w-4 h-4" />
                                        Timings
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Edit Timings Modal */}
            <AnimatePresence>
                {editTimingsModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setEditTimingsModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="card p-6 max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">Edit Timings</h2>
                                <button onClick={() => setEditTimingsModal(null)} className="p-2 hover:bg-background-subtle rounded-lg">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-text-secondary mb-6">
                                Update timings for <span className="font-medium text-text">{editTimingsModal.name}</span>
                            </p>

                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                            Opening Time
                                        </label>
                                        <input
                                            type="time"
                                            value={timingsForm.openingTime}
                                            onChange={(e) => setTimingsForm(prev => ({ ...prev, openingTime: e.target.value }))}
                                            className="input"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                            Closing Time
                                        </label>
                                        <input
                                            type="time"
                                            value={timingsForm.closingTime}
                                            onChange={(e) => setTimingsForm(prev => ({ ...prev, closingTime: e.target.value }))}
                                            className="input"
                                        />
                                    </div>
                                </div>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={timingsForm.isOpenOnSunday}
                                            onChange={(e) => setTimingsForm(prev => ({ ...prev, isOpenOnSunday: e.target.checked }))}
                                        />
                                        <div className={`w-11 h-6 rounded-full transition-colors ${timingsForm.isOpenOnSunday ? 'bg-success' : 'bg-border'}`}>
                                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${timingsForm.isOpenOnSunday ? 'translate-x-5' : ''}`} />
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium">Open on Sundays</span>
                                </label>

                                <div className="flex gap-3 pt-4 border-t border-border">
                                    <button onClick={() => setEditTimingsModal(null)} className="btn-secondary flex-1 py-2.5">
                                        Cancel
                                    </button>
                                    <button onClick={saveTimings} disabled={savingTimings} className="btn-primary flex-1 py-2.5">
                                        {savingTimings ? 'Saving...' : 'Save Timings'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CanteenManager;
