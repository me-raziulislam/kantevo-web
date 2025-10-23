import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaStore, FaUniversity, FaPhone, FaIdBadge } from 'react-icons/fa';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        rollNumber: '',
        password: '',
        role: 'student',
        collegeId: '',
        canteenName: '',
    });

    const [colleges, setColleges] = useState([]);
    const [error, setError] = useState('');
    const [agree, setAgree] = useState(false); // Checkbox state
    const navigate = useNavigate();
    const { api } = useAuth(); // Use centralized API instance

    useEffect(() => {
        fetchColleges();
    }, []);

    const fetchColleges = async () => {
        try {
            const res = await api.get('/colleges'); // use api instead of axios
            setColleges(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (e) => {
        const role = e.target.value;
        setFormData({
            ...formData,
            role,
            canteenName: '',
            rollNumber: '',
        });
    };

    // Add this function inside your Register component
    const handleDevNotice = (e) => {
        e.preventDefault(); // Prevent form submission
        toast.info(
            "Our website is currently under development. Registration will be available soon. Thank you for your patience.",
            { autoClose: 5000 }
        );
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ Terms agreement validation
        if (!agree) {
            toast.error('You must agree to the Terms of Use & Privacy Policy', { autoClose: 3000 });
            return;
        }

        // Basic validation for phone and roll number
        if (!/^\d{10}$/.test(formData.phone)) {
            toast.error('Phone number must be exactly 10 digits', { autoClose: 3000 });
            return;
        }

        if (!formData.collegeId) {
            toast.error('Please select your College', { autoClose: 3000 });
            return;
        }

        if (formData.role === 'student' && !formData.rollNumber.trim()) {
            toast.error('Please enter your Roll Number', { autoClose: 3000 });
            return;
        }

        if (formData.role === 'canteen' && !formData.canteenName.trim()) {
            toast.error('Please enter your Canteen Name', { autoClose: 3000 });
            return;
        }

        try {
            const endpoint =
                formData.role === 'canteen'
                    ? '/auth/register/canteen'
                    : '/auth/register/student';

            // Prepare payload differently for student and canteen
            const payload =
                formData.role === 'canteen'
                    ? {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        password: formData.password,
                        collegeId: formData.collegeId,
                        canteenName: formData.canteenName,
                    }
                    : {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        password: formData.password,
                        collegeId: formData.collegeId,
                        rollNumber: formData.rollNumber.trim().toUpperCase(),
                    };

            await api.post(endpoint, payload); // use centralized api

            toast.success(
                'Account created! Please verify your email via OTP sent to your inbox.',
                { autoClose: 4000 }
            );

            setTimeout(() => {
                navigate('/verify-email', { state: { email: formData.email } });
            }, 4000);
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.response?.data?.msg ||
                'Registration failed';
            toast.error(msg, { autoClose: 3000 });
            setError(msg);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div
                className="bg-background p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-200 dark:border-gray-700 transition-colors duration-300"
                data-aos="fade-up"
            >
                {/* Title */}
                <h2 className="text-3xl font-extrabold text-center text-primary mb-2">
                    Create Your Account
                </h2>
                <p className="text-text/80 text-center mb-6">
                    Sign up to start ordering your favorite meals
                </p>

                {/* Error */}
                {error && (
                    <div className="text-red-500 mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleDevNotice} className="space-y-5">
                    {/* Full Name */}
                    <div className="relative">
                        <FaUser className="absolute top-3 left-3 text-text/50" />
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 p-3 rounded-lg bg-background text-text border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition"
                        />
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <FaEnvelope className="absolute top-3 left-3 text-text/50" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 p-3 rounded-lg bg-background text-text border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition"
                        />
                    </div>

                    {/* Phone */}
                    <div className="relative">
                        <FaPhone className="absolute top-3 left-3 text-text/50" />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone (10 digits)"
                            value={formData.phone}
                            onChange={handleChange}
                            maxLength={10}
                            required
                            className="w-full pl-10 p-3 rounded-lg bg-background text-text border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <FaLock className="absolute top-3 left-3 text-text/50" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 p-3 rounded-lg bg-background text-text border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition"
                        />
                    </div>

                    {/* Role */}
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleRoleChange}
                        className="w-full p-3 rounded-lg bg-background text-text border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition"
                    >
                        <option value="student">Student</option>
                        <option value="canteen">Canteen Owner</option>
                    </select>

                    {/* College Selection (for both roles) */}
                    <div className="relative">
                        <FaUniversity className="absolute top-3 left-3 text-text/50" />
                        <select
                            name="collegeId"
                            value={formData.collegeId}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 p-3 rounded-lg bg-background text-text border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition"
                        >
                            <option value="">Select College</option>
                            {colleges.map((college) => (
                                <option key={college._id} value={college._id}>
                                    {college.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Roll Number (Student only) */}
                    {formData.role === 'student' && (
                        <div className="relative">
                            <FaIdBadge className="absolute top-3 left-3 text-text/50" />
                            <input
                                type="text"
                                name="rollNumber"
                                placeholder="Roll Number"
                                value={formData.rollNumber}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 p-3 rounded-lg bg-background text-text border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition"
                            />
                        </div>
                    )}

                    {/* Canteen Name (Canteen owner only) */}
                    {formData.role === 'canteen' && (
                        <div className="relative">
                            <FaStore className="absolute top-3 left-3 text-text/50" />
                            <input
                                type="text"
                                name="canteenName"
                                placeholder="Canteen Name"
                                value={formData.canteenName}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 p-3 rounded-lg bg-background text-text border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition"
                            />
                        </div>
                    )}

                    {/* Terms & Privacy Agreement */}
                    <div className="flex items-center text-sm">
                        <input
                            type="checkbox"
                            id="agree"
                            checked={agree}
                            onChange={(e) => setAgree(e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor="agree" className="text-text">
                            I agree to the{" "}
                            <Link to="/terms-of-use" className="text-primary hover:underline">
                                Terms of Use
                            </Link>{" "}
                            and{" "}
                            <Link to="/privacy-policy" className="text-primary hover:underline">
                                Privacy Policy
                            </Link>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition transform hover:scale-[1.02]"
                    >
                        Register
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-sm text-text mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div >
    );
};

export default Register;
