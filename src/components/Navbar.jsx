import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate("/login");
    };

    return (
        <nav className="bg-background text-text shadow-md px-6 py-3 flex justify-between items-center transition-colors duration-300">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold">
                Kantevo
            </Link>

            {/* Links */}
            <div className="flex items-center space-x-4">
                {user ? (
                    <>
                        <span className="font-medium">Hi, {user.name}</span>
                        <button
                            onClick={handleLogout}
                            className="text-red-500 hover:text-red-700 font-medium"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="hover:text-primary font-medium transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="hover:text-primary font-medium transition-colors"
                        >
                            Register
                        </Link>
                    </>
                )}

                {/* Theme Toggle Button */}
                <ThemeToggle />
            </div>
        </nav>
    );
};

export default Navbar;
