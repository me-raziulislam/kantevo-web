// context/AuthContext.jsx
// Updated to support OTP-based registration/login + onboarding progress for both Students and Canteen Owners.
// NEW: optimistic onboarding fields, saveOnboardingProgress(), completeOnboarding(), and helpers.

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';

const AuthContext = createContext();

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

// Create centralized axios instance
const api = axios.create({
    baseURL: `${SERVER_URL}/api`,
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); // for spinner
    const socketRef = useRef(null);

    /* ----------------------------------------------------
       🔹 Helpers (NEW)
    ---------------------------------------------------- */
    const ensureOnboardingShape = (u) => {
        if (!u) return u;
        // default values if missing (until backend provides them)
        return {
            onboardingStep: typeof u.onboardingStep === 'number' ? u.onboardingStep : 1,
            onboardingCompleted: !!u.onboardingCompleted,
            adminVerified: !!u.adminVerified,
            ...u,
        };
    };

    const persistUser = (u, t = token) => {
        const shaped = ensureOnboardingShape(u);
        setUser(shaped);
        if (t) setToken(t);
        localStorage.setItem('user', JSON.stringify(shaped));
        if (t) localStorage.setItem('token', t);
    };

    /* ----------------------------------------------------
       🔹 Store user + token in localStorage after login
    ---------------------------------------------------- */
    const login = (userData, token) => {
        persistUser(userData, token);
    };

    /* ----------------------------------------------------
       🔹 Logout — clears session + socket
    ---------------------------------------------------- */
    const logout = () => {
        setUser(null);
        setToken(null);
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    /* ----------------------------------------------------
       🔹 Load user session from localStorage on startup
    ---------------------------------------------------- */
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            const parsed = JSON.parse(storedUser);
            setUser(ensureOnboardingShape(parsed));
            setToken(storedToken);
        }

        setLoading(false);
    }, []);

    /* ----------------------------------------------------
       🔹 SOCKET INITIALIZATION
    ---------------------------------------------------- */
    useEffect(() => {
        if (!user) return;

        const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5050', {
            auth: { token },
        });
        socketRef.current = newSocket;

        // Automatically join room based on user type
        if (user.role === 'student') {
            newSocket.emit('joinUser', user._id);
        } else if (user.role === 'canteenOwner') {
            const canteenId = user.canteen?._id || user.canteen;
            if (canteenId) {
                newSocket.emit('joinCanteen', canteenId);
            }
        }

        return () => {
            newSocket.disconnect();
            socketRef.current = null;
        };
    }, [user, token]);

    /* ----------------------------------------------------
       🔹 AXIOS INTERCEPTORS
    ---------------------------------------------------- */
    useEffect(() => {
        const reqInterceptor = api.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        const resInterceptor = api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    toast.error('Session expired. Please login again.');
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.request.eject(reqInterceptor);
            api.interceptors.response.eject(resInterceptor);
        };
    }, []);

    /* ----------------------------------------------------
       🔹 REGISTER (Step 1) - Send OTP
       Minimal signup: { name, email, userType }
    ---------------------------------------------------- */
    const registerUser = async (name, email, userType) => {
        try {
            const res = await api.post('/auth/register', { name, email, userType });
            toast.success(res.data.msg || 'OTP sent to your email.');
            return { success: true, userType };
        } catch (err) {
            const msg = err.response?.data?.msg || 'Failed to send OTP.';
            toast.error(msg);
            return { success: false, error: msg };
        }
    };

    /* ----------------------------------------------------
       🔹 VERIFY EMAIL OTP (Step 2)
       Marks user as verified and logs them in
    ---------------------------------------------------- */
    const verifyEmailOTP = async (email, otp) => {
        try {
            const res = await api.post('/auth/verify-email-otp', { email, otp });
            const { user, token } = res.data.data;

            // Store session (shape + persist)
            login(user, token);

            toast.success('Email verified successfully!');
            return { success: true, user };
        } catch (err) {
            const msg = err.response?.data?.msg || 'Invalid or expired OTP.';
            toast.error(msg);
            return { success: false, error: msg };
        }
    };

    /* ----------------------------------------------------
       🔹 LOGIN (Step 1) - Send OTP
    ---------------------------------------------------- */
    const sendLoginOTP = async (email) => {
        try {
            const res = await api.post('/auth/login/send-otp', { email });
            toast.success(res.data.msg || 'OTP sent to your email.');
            return { success: true, role: res.data.data?.role };
        } catch (err) {
            const msg = err.response?.data?.msg || 'Failed to send login OTP.';
            toast.error(msg);
            return { success: false, error: msg };
        }
    };

    /* ----------------------------------------------------
       🔹 LOGIN (Step 2) - Verify OTP
       On success, saves token + user
    ---------------------------------------------------- */
    const verifyLoginOTP = async (email, otp) => {
        try {
            const res = await api.post('/auth/login/verify-otp', { email, otp });
            const { user, token } = res.data.data;
            login(user, token);
            toast.success('Login successful!');

            // Handle redirect conditions correctly
            if (user.role === 'admin') {
                window.location.href = '/admin/colleges';
                return { success: true, user };
            }

            if (user.role === 'canteenOwner') {
                if (!user.onboardingCompleted) {
                    const step = user.onboardingStep || 1;
                    window.location.href = `/onboarding/canteen/step${step}`;
                    return { success: true, user };
                }

                if (!user.adminVerified) {
                    window.location.href = '/pending-approval';
                    return { success: true, user };
                }

                window.location.href = '/canteen/home';
                return { success: true, user };
            }

            // Students
            if (!user.onboardingCompleted) {
                const step = user.onboardingStep || 1;
                window.location.href = `/onboarding/student/step${step}`;
            } else {
                window.location.href = '/student/home';
            }

            return { success: true, user };

        } catch (err) {
            const msg = err.response?.data?.msg || 'Invalid or expired OTP.';
            toast.error(msg);
            return { success: false, error: msg };
        }
    };

    /* ----------------------------------------------------
       🔹 ONBOARDING HELPERS (NEW)
       Persist to API when available; always keep local user in sync for UX.
    ---------------------------------------------------- */
    const saveOnboardingProgress = async (step, data = {}) => {
        if (!user) return;
        const roleKey = user.role === 'canteenOwner' ? 'canteen' : 'student';
        try {
            const res = await api.put(`/${roleKey}/onboarding`, { step, data, completed: false });
            const updated = res.data.user || res.data.owner || user;
            // keep step updated locally but don't mark completed
            const merged = { ...updated, onboardingStep: step, onboardingCompleted: false };
            persistUser(merged);
            return merged;
        } catch (err) {
            console.error("Onboarding save error:", err);
            const msg = err.response?.data?.message || "Failed to save onboarding progress.";
            toast.error(msg);
            throw err;
        }
    };

    const completeOnboarding = async (data = {}) => {
        if (!user) return;
        const roleKey = user.role === 'canteenOwner' ? 'canteen' : 'student';
        try {
            const res = await api.put(`/${roleKey}/onboarding`, {
                step: 'complete',
                data,
                completed: true,
            });
            const updated = res.data.user || res.data.owner || user;
            const merged = { ...updated, onboardingCompleted: true };
            persistUser(merged);
            toast.success("Onboarding completed!");
        } catch (err) {
            console.error("Complete onboarding error:", err);
            toast.error(err.response?.data?.message || "Failed to complete onboarding.");
        }
    };

    /* ----------------------------------------------------
       🔹 CHECK IF USER HAS COMPLETED ONBOARDING
       Helps decide where to redirect post-login
    ---------------------------------------------------- */
    const hasCompletedOnboarding = (u) => {
        const usr = u || user;
        if (!usr) return false;
        return !!usr.onboardingCompleted; // only rely on this flag now
    };

    /* ----------------------------------------------------
       🔹 EXPORT PROVIDER
    ---------------------------------------------------- */
    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                registerUser,
                verifyEmailOTP,
                sendLoginOTP,
                verifyLoginOTP,
                hasCompletedOnboarding,
                // NEW
                saveOnboardingProgress,
                completeOnboarding,
                isLoggedIn: !!user,
                loading,
                api,
                socket: socketRef.current,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
