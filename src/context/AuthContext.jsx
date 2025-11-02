// context/AuthContext.jsx
// Updated to support OTP-based registration/login + onboarding progress for both Students and Canteen Owners.
// Secure refresh-token implementation.
// Axios interceptor that refreshes access tokens silently (15m expiry, 30d refresh).
// Logout calls backend to revoke refresh token.
// Persistent redirect logic handled by AppRoutes.

import { createContext, useContext, useEffect, useState, useRef, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';

const AuthContext = createContext();

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
// FIX: robust socket URL fallback (env → server → current origin)
const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL ||
    SERVER_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '');

// Centralized axios instance
const api = axios.create({
    baseURL: `${SERVER_URL}/api`,
});

// right after `const api = axios.create(...)`
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('kantevo:accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const AuthProvider = ({ children }) => {
    // Synchronous boot from localStorage to avoid race on reload
    const bootUser = (() => {
        try { return JSON.parse(localStorage.getItem('kantevo:user') || 'null'); } catch { return null; }
    })();
    const bootAccess = localStorage.getItem('kantevo:accessToken') || null;
    const bootRefresh = localStorage.getItem('kantevo:refreshToken') || null;

    const [user, setUser] = useState(bootUser);
    const [accessToken, setAccessToken] = useState(bootAccess);
    const [refreshToken, setRefreshToken] = useState(bootRefresh);
    const [loading, setLoading] = useState(false); // we already booted synchronously
    const socketRef = useRef(null);
    const refreshPromiseRef = useRef(null); // 🔹 prevents multiple refresh calls

    // FIX: keep socket in state so consumers re-render when it connects
    const [socket, setSocket] = useState(null);

    /* ----------------------------------------------------
       🔹 Helpers (NEW)
    ---------------------------------------------------- */
    const ensureOnboardingShape = (u) => {
        if (!u) return u;
        return {
            onboardingStep: typeof u.onboardingStep === 'number' ? u.onboardingStep : 1,
            onboardingCompleted: !!u.onboardingCompleted,
            adminVerified: !!u.adminVerified,
            ...u,
        };
    };

    const persistUser = (u, aToken = accessToken, rToken = refreshToken) => {
        const shaped = ensureOnboardingShape(u);
        setUser(shaped);
        if (aToken) setAccessToken(aToken);
        if (rToken) setRefreshToken(rToken);
        localStorage.setItem('kantevo:user', JSON.stringify(shaped));
        if (aToken) localStorage.setItem('kantevo:accessToken', aToken);
        if (rToken) localStorage.setItem('kantevo:refreshToken', rToken);
    };

    /* ----------------------------------------------------
       🔹 Login + Logout
    ---------------------------------------------------- */
    const login = (userData, aToken, rToken) => {
        persistUser(userData, aToken, rToken);
    };

    const logout = async () => {
        const rToken = localStorage.getItem('kantevo:refreshToken');
        try {
            if (rToken) {
                // tell the server to revoke this device's refresh token
                await api.post('/auth/logout', { refreshToken: rToken });
            }
        } catch (_) {
            // ignore network errors on logout; still clear client
        } finally {
            setUser(null);
            setAccessToken(null);
            setRefreshToken(null);
            localStorage.removeItem('kantevo:user');
            localStorage.removeItem('kantevo:accessToken');
            localStorage.removeItem('kantevo:refreshToken');
            if (socketRef.current) socketRef.current.disconnect();
            setSocket(null); // FIX: clear socket state
            toast.info('Logged out successfully');
        }
    };

    // Logout from all devices
    const logoutAllDevices = async () => {
        try {
            await api.post('/auth/logout-all'); // Authorization header is added by interceptor
            // Also clear this device
            await logout();
        } catch (err) {
            // Even if it fails, clear local session for safety
            await logout();
        }
    };

    // Set axios header immediately if we booted with a token
    if (bootAccess) {
        api.defaults.headers.common.Authorization = `Bearer ${bootAccess}`;
    }

    /* ----------------------------------------------------
       🔹 Secure Token Refresh (silent renewal + rotation aware)
    ---------------------------------------------------- */
    const refreshAccessToken = async () => {
        const rToken = localStorage.getItem('kantevo:refreshToken');
        if (!rToken) {
            await logout();
            throw new Error('No refresh token');
        }

        // Avoid concurrent refreshes
        if (refreshPromiseRef.current) return refreshPromiseRef.current;

        refreshPromiseRef.current = api
            .post('/auth/refresh-token', { refreshToken: rToken })
            .then((res) => {
                if (res.data.success) {
                    const newAccessToken = res.data.accessToken;
                    setAccessToken(newAccessToken);
                    localStorage.setItem('kantevo:accessToken', newAccessToken);

                    // 🔹 Rotation: server may also send back a new refresh token
                    if (res.data.refreshToken) {
                        const newRefreshToken = res.data.refreshToken;
                        setRefreshToken(newRefreshToken);
                        localStorage.setItem('kantevo:refreshToken', newRefreshToken);
                    }

                    return newAccessToken;
                } else {
                    throw new Error('Refresh failed');
                }
            })
            .catch(async (err) => {
                await logout();
                throw err;
            })
            .finally(() => {
                refreshPromiseRef.current = null;
            });

        return refreshPromiseRef.current;
    };

    /* ----------------------------------------------------
   🔹 Keep axios Authorization header always in sync
    ---------------------------------------------------- */
    useEffect(() => {
        if (accessToken) {
            api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        } else {
            delete api.defaults.headers.common.Authorization;
        }
    }, [accessToken]);

    /* ----------------------------------------------------
       🔹 Axios interceptors with silent refresh retry
    ---------------------------------------------------- */
    useEffect(() => {
        const reqInterceptor = api.interceptors.request.use((config) => {
            const token = localStorage.getItem('kantevo:accessToken');
            if (token) config.headers.Authorization = `Bearer ${token}`;
            return config;
        });

        const resInterceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // Token expired → attempt refresh
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        const newToken = await refreshAccessToken();
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return api(originalRequest); // retry original request
                    } catch (err) {
                        toast.error('Session expired. Please login again.');
                        return Promise.reject(err);
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.request.eject(reqInterceptor);
            api.interceptors.response.eject(resInterceptor);
        };
    }, [refreshToken]); // re-bind when refresh token changes

    /* ----------------------------------------------------
       🔹 SOCKET IO INIT (same)
    ---------------------------------------------------- */
    useEffect(() => {
        if (!user || !accessToken) return;

        // FIX: ensure we always tear down old socket and set state so consumers re-render
        const newSocket = io(SOCKET_URL, {
            auth: { token: accessToken },
            transports: ['websocket', 'polling'],
            withCredentials: true,
        });
        socketRef.current = newSocket;
        setSocket(newSocket);

        if (user.role === 'student') newSocket.emit('joinUser', user._id);
        else if (user.role === 'canteenOwner') {
            const canteenId = user.canteen?._id || user.canteen;
            if (canteenId) newSocket.emit('joinCanteen', canteenId);
        }

        // optional: small debug listeners (no UI changes)
        // newSocket.on('connect', () => console.debug('Socket connected', newSocket.id));
        // newSocket.on('disconnect', () => console.debug('Socket disconnected'));

        return () => {
            newSocket.disconnect();
            setSocket(null);
        };
    }, [user, accessToken]);

    /* ----------------------------------------------------
       🔹 Registration + Login (now receive both tokens)
    ---------------------------------------------------- */
    const registerUser = async (name, email, userType) => {
        try {
            const res = await api.post('/auth/register', { name, email, userType });
            toast.success(res.data.msg || 'OTP sent.');
            return { success: true, userType };
        } catch (err) {
            const msg = err.response?.data?.msg || 'Failed to send OTP.';
            toast.error(msg);
            return { success: false, error: msg };
        }
    };

    const verifyEmailOTP = async (email, otp) => {
        try {
            const res = await api.post('/auth/verify-email-otp', { email, otp });
            const { user, accessToken, refreshToken } = res.data.data;
            login(user, accessToken, refreshToken);
            toast.success('Email verified successfully!');
            return { success: true, user };
        } catch (err) {
            const msg = err.response?.data?.msg || 'Invalid or expired OTP.';
            toast.error(msg);
            return { success: false, error: msg };
        }
    };

    const sendLoginOTP = async (email) => {
        try {
            const res = await api.post('/auth/login/send-otp', { email });
            toast.success(res.data.msg || 'OTP sent.');
            return { success: true, role: res.data.data?.role };
        } catch (err) {
            const msg = err.response?.data?.msg || 'Failed to send login OTP.';
            toast.error(msg);
            return { success: false, error: msg };
        }
    };

    const verifyLoginOTP = async (email, otp) => {
        try {
            const res = await api.post('/auth/login/verify-otp', { email, otp });
            const { user, accessToken, refreshToken } = res.data.data;
            login(user, accessToken, refreshToken);
            toast.success('Login successful!');

            // Redirect by role and onboarding state
            window.location.href =
                user.role === 'admin'
                    ? '/admin/colleges'
                    : user.role === 'canteenOwner'
                        ? !user.onboardingCompleted
                            ? `/onboarding/canteen/step${user.onboardingStep || 1}`
                            : !user.adminVerified
                                ? '/pending-approval'
                                : '/canteen/home'
                        : !user.onboardingCompleted
                            ? `/onboarding/student/step${user.onboardingStep || 1}`
                            : '/student/home';

            return { success: true, user };
        } catch (err) {
            const msg = err.response?.data?.msg || 'Invalid or expired OTP.';
            toast.error(msg);
            return { success: false, error: msg };
        }
    };

    /* ----------------------------------------------------
       🔹 Onboarding + Helper Functions (same)
    ---------------------------------------------------- */
    const saveOnboardingProgress = async (step, data = {}) => {
        if (!user) return;
        const roleKey = user.role === 'canteenOwner' ? 'canteen' : 'student';
        try {
            const res = await api.put(`/${roleKey}/onboarding`, { step, data, completed: false });
            const updated = res.data.user || res.data.owner || user;
            persistUser({ ...updated, onboardingStep: step });
        } catch (err) {
            toast.error('Failed to save onboarding progress.');
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
            persistUser({ ...updated, onboardingCompleted: true });
            toast.success('Onboarding completed!');
        } catch {
            toast.error('Failed to complete onboarding.');
        }
    };

    const hasCompletedOnboarding = (u) => !!(u || user)?.onboardingCompleted;

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                refreshToken,
                login,
                logout,
                logoutAllDevices,
                registerUser,
                verifyEmailOTP,
                sendLoginOTP,
                verifyLoginOTP,
                hasCompletedOnboarding,
                saveOnboardingProgress,
                completeOnboarding,
                isLoggedIn: !!user,
                loading,
                api,
                socket, // FIX: provide stateful socket
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
