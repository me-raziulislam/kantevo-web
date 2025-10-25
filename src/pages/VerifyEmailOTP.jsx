import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import SEO from "../components/SEO";

const VerifyEmailOTP = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { api } = useAuth(); // Use centralized API

    // Try to get email passed from registration page
    const initialEmail = location.state?.email || '';

    const [email, setEmail] = useState(initialEmail);
    const [otp, setOTP] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    // Handle OTP verify submit
    const handleVerify = async (e) => {
        e.preventDefault();
        if (!email || !otp) {
            toast.error('Please fill all fields');
            return;
        }
        setLoading(true);
        try {
            const res = await api.post('/auth/verify-email-otp', { email, otp });
            toast.success(res.data.message || 'Email verified successfully!');
            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                err.response?.data?.msg ||
                'Verification failed'
            );
        } finally {
            setLoading(false);
        }
    };

    // Handle resend OTP
    const handleResend = async () => {
        if (!email) {
            toast.error('Please enter your email first');
            return;
        }
        setResendLoading(true);
        try {
            const res = await api.post('/auth/resend-email-otp', { email });
            toast.success(res.data.message || res.data.msg || 'OTP resent successfully');
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                err.response?.data?.msg ||
                'Failed to resend OTP'
            );
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">

            <SEO
                title="Verify Email"
                description="Verify your email address to complete registration and start ordering on Kantevo."
                canonicalPath="/verify-email"
            />

            <div
                className="bg-background p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-200 dark:border-gray-700 transition-colors duration-300"
            >
                <h2 className="text-3xl font-extrabold text-center text-primary mb-4">
                    Verify Your Email
                </h2>
                <p className="text-text/80 text-center mb-6">
                    Enter the 6-digit OTP sent to your email.
                </p>

                <form onSubmit={handleVerify} className="space-y-5">
                    <div className="relative">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 rounded-lg bg-background text-text border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition"
                        />
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            name="otp"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOTP(e.target.value)}
                            maxLength={6}
                            required
                            className="w-full p-3 rounded-lg bg-background text-text border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition transform hover:scale-[1.02]"
                    >
                        {loading ? 'Verifying...' : 'Verify Email'}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        onClick={handleResend}
                        disabled={resendLoading}
                        className="text-sm text-primary hover:underline"
                    >
                        {resendLoading ? 'Resending OTP...' : 'Resend OTP'}
                    </button>
                </div>

                <p className="text-center text-sm text-text mt-6">
                    Remembered your password?{' '}
                    <Link to="/login" className="text-primary hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default VerifyEmailOTP;
