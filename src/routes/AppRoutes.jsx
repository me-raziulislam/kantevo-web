import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

import Home from '../pages/Home';
import PartnerWithKantevo from '../pages/PartnerWithKantevo';
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

// NEW: Onboarding pages
import StudentOnboardingLayout from '../pages/onboarding/student/StudentOnboardingLayout';
import Step1StudentInfo from '../pages/onboarding/student/Step1StudentInfo';
import Step2CollegeDetails from '../pages/onboarding/student/Step2CollegeDetails';
import Step3StudentConfirm from '../pages/onboarding/student/Step3StudentConfirm';
import PendingApproval from '../pages/onboarding/PendingApproval';

import CanteenOnboardingLayout from '../pages/onboarding/canteen/CanteenOnboardingLayout';
import Step1CanteenInfo from '../pages/onboarding/canteen/Step1CanteenInfo';
import Step2MenuDetails from '../pages/onboarding/canteen/Step2MenuDetails';
import Step3CanteenDocs from '../pages/onboarding/canteen/Step3CanteenDocs';

// Legal pages
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsOfUse from '../pages/TermsOfUse';
import About from '../pages/About';
import RefundPolicy from '../pages/RefundPolicy';
import ReturnPolicy from '../pages/ReturnPolicy';

const AppRoutes = () => {
    const { user, hasCompletedOnboarding } = useAuth();
    const completed = hasCompletedOnboarding(user);
    const location = useLocation();

    // Redirect unverified canteen owners ONLY after completing onboarding
    if (
        user?.role === 'canteenOwner' &&
        user?.onboardingCompleted &&
        !user?.adminVerified &&
        location.pathname !== '/pending-approval'
    ) {
        return <Navigate to="/pending-approval" replace />;
    }

    // Resumable onboarding guard
    if (
        user &&
        user.role !== 'admin' && // skip admins entirely
        !completed &&
        !location.pathname.startsWith('/onboarding') &&
        !location.pathname.startsWith('/pending-approval')
    ) {
        const role = user.role === 'canteenOwner' ? 'canteen' : 'student';
        const step = user.onboardingStep || 1;
        return <Navigate to={`/onboarding/${role}/step${step}`} replace />;
    }


    // Existing onboarding guard logic
    const onboardingGuard = (role) => {
        if (!user) return <Navigate to="/" replace />;
        const expect = role === 'canteen' ? 'canteenOwner' : 'student';
        if (user.role !== expect) return <Navigate to="/" replace />;
        if (completed) {
            return <Navigate to={user.role === 'canteenOwner' ? '/canteen/home' : '/student/home'} replace />;
        }
        return null;
    };

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/partner-with-us" element={<PartnerWithKantevo />} />
            <Route path="/payment/verify/:orderId" element={<PaymentVerification />} />

            {/* Legal */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/return-policy" element={<ReturnPolicy />} />
            <Route path="/about" element={<About />} />

            {/* Pending Approval Page */}
            <Route path="/pending-approval" element={<PendingApproval />} />

            {/* Onboarding (Student) */}
            <Route
                path="/onboarding/student"
                element={onboardingGuard('student') ?? <StudentOnboardingLayout />}
            >
                <Route path="step1" element={<Step1StudentInfo />} />
                <Route path="step2" element={<Step2CollegeDetails />} />
                <Route path="step3" element={<Step3StudentConfirm />} />
                <Route index element={<Navigate to="step1" replace />} />
            </Route>

            {/* Onboarding (Canteen) */}
            <Route
                path="/onboarding/canteen"
                element={onboardingGuard('canteen') ?? <CanteenOnboardingLayout />}
            >
                <Route path="step1" element={<Step1CanteenInfo />} />
                <Route path="step2" element={<Step2MenuDetails />} />
                <Route path="step3" element={<Step3CanteenDocs />} />
                <Route index element={<Navigate to="step1" replace />} />
            </Route>

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
            <Route
                path="*"
                element={
                    user ? (
                        user.role === "canteenOwner" ? (
                            <Navigate to="/canteen/home" replace />
                        ) : user.role === "student" ? (
                            <Navigate to="/student/home" replace />
                        ) : user.role === "admin" ? (
                            <Navigate to="/admin/colleges" replace />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    ) : (
                        <Navigate to="/" replace />
                    )
                }
            />
        </Routes>
    );
};

export default AppRoutes;
