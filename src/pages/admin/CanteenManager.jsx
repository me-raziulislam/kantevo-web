import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import SEO from "../../components/SEO";

const CanteenManager = () => {
    const [canteens, setCanteens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

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

    const updateTimings = async (id, openingTime, closingTime, isOpenOnSunday) => {
        try {
            await api.patch(`/canteens/${id}/timings`, {
                openingTime,
                closingTime,
                isOpenOnSunday,
            });
            toast.success('Canteen timings updated');
            fetchCanteens();
        } catch (err) {
            console.error(err);
            toast.error('Failed to update timings');
        }
    };

    useEffect(() => {
        fetchCanteens();
    }, []);

    const filteredCanteens = canteens.filter((canteen) =>
        canteen.name.toLowerCase().includes(search.toLowerCase()) ||
        canteen.college?.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6">

            <SEO
                title="Manage Canteens"
                description="View and manage all registered canteens across colleges on Kantevo."
                canonicalPath="/admin/canteens"
            />

            <h2 className="text-2xl font-bold mb-4">Registered Canteens</h2>

            <input
                type="text"
                placeholder="Search by canteen or college name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-4 w-full md:w-1/2 p-2 border rounded"
            />

            {loading ? (
                <p>Loading canteens...</p>
            ) : filteredCanteens.length === 0 ? (
                <p>No matching canteens found.</p>
            ) : (
                <ul className="space-y-3">
                    {filteredCanteens.map((canteen) => (
                        <li
                            key={canteen._id}
                            className={`border p-3 rounded shadow-sm ${!canteen.isOpen ? 'bg-red-50' : 'bg-green-50'}`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-semibold text-lg">{canteen.name}</div>
                                    <div className="text-gray-600 text-sm">
                                        College: {canteen.college?.name || 'N/A'}
                                    </div>
                                    <div className="text-sm">
                                        Status:{' '}
                                        <span
                                            className={`px-2 py-0.5 rounded text-white ${canteen.isOpen ? 'bg-green-600' : 'bg-red-600'}`}
                                        >
                                            {canteen.isOpen ? 'Open' : 'Closed'}
                                        </span>
                                    </div>
                                    <div className="text-xs mt-1">
                                        ⏰ {canteen.openingTime} – {canteen.closingTime}
                                    </div>
                                    <div className="text-xs">
                                        Sunday: {canteen.isOpenOnSunday ? 'Open' : 'Closed'}
                                    </div>
                                    {canteen.specialOpenings?.length > 0 && (
                                        <div className="text-xs mt-1 text-blue-700">
                                            Special Openings: {canteen.specialOpenings.length}
                                        </div>
                                    )}
                                    {canteen.specialClosings?.length > 0 && (
                                        <div className="text-xs text-red-700">
                                            Special Closings: {canteen.specialClosings.length}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => toggleStatus(canteen._id, canteen.isOpen)}
                                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                    >
                                        Toggle Status
                                    </button>
                                    {/* Inline edit timings */}
                                    <button
                                        onClick={() => {
                                            const openingTime = prompt('Enter opening time (HH:mm)', canteen.openingTime);
                                            const closingTime = prompt('Enter closing time (HH:mm)', canteen.closingTime);
                                            const sundayOpen = window.confirm('Should be open on Sundays?');
                                            if (openingTime && closingTime) {
                                                updateTimings(canteen._id, openingTime, closingTime, sundayOpen);
                                            }
                                        }}
                                        className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                                    >
                                        Edit Timings
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CanteenManager;
