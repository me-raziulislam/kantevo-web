import { useState } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import SEO from "../components/SEO";

const AdminDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinks = [
        { to: '/admin/colleges', label: 'Manage Colleges' },
        { to: '/admin/canteens', label: 'Manage Canteens' },
        { to: '/admin/orders', label: 'View Orders' },
        { to: '/admin/settlements-create', label: 'Create Settlement' },
        { to: '/admin/settlements', label: 'Settlements' },
    ];

    return (
        <div className="flex h-screen bg-background text-text transition-colors duration-300">

            <SEO
                title="Admin Dashboard"
                description="Kantevo admin panel to manage colleges, canteens, and platform data."
                canonicalPath="/admin"
            />

            {/* Sidebar */}
            <div className={`fixed md:static w-64 bg-background border-r border-gray-300 dark:border-gray-600 z-30 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
                <div className="p-4 border-b border-gray-300 dark:border-gray-600 text-lg font-bold text-center text-primary">
                    Kantevo Admin Panel
                </div>
                <nav className="flex flex-col p-4 space-y-2">
                    {navLinks.map(link => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `px-4 py-2 rounded text-left transition-colors duration-200 ${isActive
                                    ? 'bg-primary/10 text-primary font-semibold'
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
                        className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors duration-200"
                    >
                        Logout
                    </button>
                </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top navbar for mobile */}
                <header className="flex items-center justify-between bg-background border-b border-gray-300 dark:border-gray-600 p-4 shadow md:hidden">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-text focus:outline-none"
                        aria-label="Toggle sidebar"
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
                    <span className="text-lg font-bold text-primary">Kantevo Admin Panel</span>
                </header>

                <main className="flex-1 overflow-y-auto p-4 bg-background text-text">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
