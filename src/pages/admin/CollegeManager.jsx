import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import SEO from "../../components/SEO";

const CollegeManager = () => {
    const [colleges, setColleges] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        location: '',
    });
    const [loading, setLoading] = useState(false);

    const [editingCollege, setEditingCollege] = useState(null); // for edit mode
    const [deleteModalOpen, setDeleteModalOpen] = useState(false); // delete confirmation
    const [collegeToDelete, setCollegeToDelete] = useState(null);

    const { api } = useAuth(); // ✅ use centralized API instance

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
        try {
            if (editingCollege) {
                // Update existing college
                const res = await api.patch(`/colleges/${editingCollege._id}`, formData);
                toast.success(`College "${res.data.name}" updated!`);
                setEditingCollege(null);
            } else {
                // Add new college
                const res = await api.post('/colleges', formData);
                toast.success(`College "${res.data.name}" added!`);
            }

            setFormData({ name: '', code: '', location: '' });
            fetchColleges();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Error saving college');
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
        window.scrollTo({ top: 0, behavior: 'smooth' }); // scroll to form
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
    };

    useEffect(() => {
        fetchColleges();
    }, []);

    return (
        <div className="p-6">

            <SEO
                title="Manage Colleges"
                description="Admin tool to add and manage colleges using the Kantevo canteen ordering system."
                canonicalPath="/admin/colleges"
            />

            <h2 className="text-2xl font-bold mb-4">Manage Colleges</h2>

            {/* Add / Edit College Form */}
            <form
                onSubmit={handleSubmit}
                className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4"
            >
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="College Name"
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="College Code (e.g. NITD123)"
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Location"
                    className="border p-2 rounded"
                />
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className={`px-4 py-2 rounded text-white ${editingCollege ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'
                            }`}
                    >
                        {editingCollege ? 'Update College' : 'Add College'}
                    </button>
                    {editingCollege && (
                        <button
                            type="button"
                            onClick={cancelEdit}
                            className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>

            {loading ? (
                <p>Loading colleges...</p>
            ) : (
                <ul className="space-y-2">
                    {colleges.map((college) => (
                        <li
                            key={college._id}
                            className="border p-3 rounded shadow-sm flex justify-between items-center"
                        >
                            <div>
                                <strong>{college.name}</strong> ({college.code}) -{' '}
                                {college.location || '-'}
                            </div>
                            <div className="flex gap-2">
                                {/* Edit Button */}
                                <button
                                    onClick={() => handleEdit(college)}
                                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                                >
                                    Edit
                                </button>

                                {/* Delete Button */}
                                <button
                                    onClick={() => handleDelete(college)}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                    {colleges.length === 0 && (
                        <li className="text-center text-text/70 py-4">No colleges found.</li>
                    )}
                </ul>
            )}

            {/* Delete Confirmation Modal using existing Modal component */}
            {deleteModalOpen && collegeToDelete && (
                <Modal
                    title="Confirm Delete"
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                >
                    Are you sure you want to delete college "{collegeToDelete.name}"? This action cannot be undone.
                </Modal>
            )}
        </div>
    );
};

export default CollegeManager;
