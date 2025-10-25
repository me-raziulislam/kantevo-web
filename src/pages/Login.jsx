import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { FaLock, FaEnvelope } from "react-icons/fa";
import SEO from "../components/SEO";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login, api } = useAuth(); // use api from context instead of axios

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            // Use centralized axios instance from AuthContext
            const res = await api.post("/auth/login", formData);

            toast.success("Login successful!", { autoClose: 2000 });

            // Store user + token via AuthContext
            login(res.data.user, res.data.token);

            // Role-based navigation
            setTimeout(() => {
                if (res.data.user.role === "canteenOwner") {
                    navigate("/canteen");
                } else if (res.data.user.role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/student/home");
                }
            }, 1000);
        } catch (err) {
            const status = err.response?.status;
            const msg =
                err.response?.data?.message ||
                err.response?.data?.msg ||
                "Login failed";

            if (status === 403 && msg.toLowerCase().includes("verify your email")) {
                toast.error(msg, { autoClose: 4000 });

                // Redirect to VerifyEmailOTP page, pass email so user doesn't have to type again
                return navigate('/verify-email', { state: { email: formData.email } });
            }

            toast.error(msg, { autoClose: 3000 });
            setError(msg);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 transition-colors duration-300">

            <SEO
                title="Login"
                description="Login to your Kantevo account to order food and manage your college canteen experience."
                canonicalPath="/login"
            />

            <div
                className="bg-background text-text p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-200 dark:border-gray-700 transition-colors duration-300"
                data-aos="fade-up"
            >
                {/* Title */}
                <h2 className="text-3xl font-extrabold text-center text-primary mb-2">
                    Welcome Back
                </h2>
                <p className="text-center mb-6 text-text/80">
                    Login to continue ordering your favorite meals
                </p>

                {/* Error */}
                {error && (
                    <div className="text-red-500 mb-4 text-sm text-center">{error}</div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
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
                            className="w-full pl-10 p-3 rounded-lg bg-background text-text border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
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
                            className="w-full pl-10 p-3 rounded-lg bg-background text-text border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition transform hover:scale-[1.02]"
                    >
                        Login
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-sm text-text/80 mt-6">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-primary hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
