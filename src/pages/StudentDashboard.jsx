// src/pages/student/StudentDashboard.jsx
import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const StudentDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate('/login');
    };

    const navLinks = [
        { to: '/student/home', label: 'Home' },
        { to: '/student/cart', label: 'Cart' },
        { to: '/student/orders', label: 'Order History' },
        { to: '/student/profile', label: 'Profile' },
    ];

    return (
        <div className="flex h-screen bg-background text-text transition-colors duration-300">
            {/* Sidebar */}
            <div
                className={`fixed md:static w-64 bg-background border-r border-gray-300 dark:border-gray-600 z-30 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}
            >
                <div className="p-4 border-b border-gray-300 dark:border-gray-600 text-lg font-bold text-center text-primary">
                    Cantevo Student
                </div>
                <nav className="flex flex-col p-4 space-y-2">
                    {navLinks.map(link => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `px-4 py-2 rounded text-left transition-colors duration-300 ${isActive
                                    ? 'bg-primary text-white font-semibold'
                                    : 'hover:bg-primary/10 text-text'
                                }`
                            }
                            onClick={() => setSidebarOpen(false)}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                    <button
                        onClick={handleLogout}
                        className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors duration-300"
                    >
                        Logout
                    </button>
                </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top navbar */}
                <header className="flex items-center justify-between bg-background border-b border-gray-300 dark:border-gray-600 p-4 shadow md:hidden">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-text/80 dark:text-text/60 focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                    <span className="text-lg font-bold text-primary">Cantevo Student</span>
                </header>

                <main className="flex-1 overflow-y-auto p-4 bg-background text-text transition-colors duration-300">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default StudentDashboard;
