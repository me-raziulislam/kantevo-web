import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import VerifyEmailOTP from '../pages/VerifyEmailOTP';
import StudentDashboard from '../pages/StudentDashboard';

// Import new pages
import StudentHome from '../pages/student/StudentHome';
import Cart from '../pages/student/Cart';
import OrderHistory from '../pages/student/OrderHistory';
import Profile from '../pages/student/Profile';
import PaymentVerification from '../pages/student/PaymentVerification';

// Admin
import AdminDashboard from '../pages/AdminDashboard';
import CollegeManager from '../pages/admin/CollegeManager';
import CanteenManager from '../pages/admin/CanteenManager';
import OrderViewer from '../pages/admin/OrderViewer';

// Canteen
import CanteenDashboard from '../pages/CanteenDashboard'; // layout
import CanteenHome from '../pages/canteen/Home';
import ItemManager from '../pages/canteen/ItemManager';
import OrderManager from '../pages/canteen/OrderManager';
import CanteenProfile from '../pages/canteen/Profile';

// Legal pages
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsOfUse from '../pages/TermsOfUse';
import About from '../pages/About';
import RefundPolicy from '../pages/RefundPolicy';
import ReturnPolicy from '../pages/ReturnPolicy';

const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmailOTP />} />
            <Route path="/payment/verify/:orderId" element={<PaymentVerification />} />

            {/* Legal */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/return-policy" element={<ReturnPolicy />} />
            <Route path="/about" element={<About />} />

            {/* Student */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="/student" element={<StudentDashboard />}>
                    <Route path="home" element={<StudentHome />} />
                    <Route path="home/:canteenId" element={<StudentHome />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="orders" element={<OrderHistory />} />
                    <Route path="profile" element={<Profile />} />
                </Route>
            </Route>


            {/* Canteen */}
            <Route element={<ProtectedRoute allowedRoles={['canteenOwner']} />}>
                <Route path="/canteen" element={<CanteenDashboard />}>
                    <Route index element={<Navigate to="/canteen/home" />} />
                    <Route path="home" element={<CanteenHome />} />
                    <Route path="items" element={<ItemManager />} />
                    <Route path="orders" element={<OrderManager />} />
                    <Route path="profile" element={<CanteenProfile />} />
                </Route>
            </Route>

            {/* Admin */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminDashboard />}>
                    <Route path="colleges" element={<CollegeManager />} />
                    <Route path="canteens" element={<CanteenManager />} />
                    <Route path="orders" element={<OrderViewer />} />
                    <Route index element={<Navigate to="/admin/colleges" />} />
                </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to={user ? `/${user.role}/home` : '/login'} replace />} />
        </Routes>
    );
};

export default AppRoutes;
