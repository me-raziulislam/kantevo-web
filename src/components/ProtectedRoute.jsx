import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    // 🕒 Wait for session restoration
    if (loading) {
        return (
            <div className="flex flex-col items-center gap-3 mt-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-lime-500 border-solid"></div>
                <p className="text-gray-600 font-medium">Loading your session...</p>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;
    if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

    return <Outlet />;
};

export default ProtectedRoute;
