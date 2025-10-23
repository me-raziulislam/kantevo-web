import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const CollegeManager = () => {
    const [colleges, setColleges] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        location: '',
    });
    const [loading, setLoading] = useState(false);

    const { api } = useAuth(); // ✅ use centralized API instance

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

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const addCollege = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/colleges', formData);
            toast.success(`College "${res.data.name}" added!`);
            setFormData({ name: '', code: '', location: '' });
            fetchColleges();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Error adding college');
        }
    };

    useEffect(() => {
        fetchColleges();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Manage Colleges</h2>

            <form
                onSubmit={addCollege}
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
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Add College
                </button>
            </form>

            {loading ? (
                <p>Loading colleges...</p>
            ) : (
                <ul className="space-y-2">
                    {colleges.map((college) => (
                        <li
                            key={college._id}
                            className="border p-3 rounded shadow-sm"
                        >
                            <strong>{college.name}</strong> ({college.code}) -{' '}
                            {college.location}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CollegeManager;
