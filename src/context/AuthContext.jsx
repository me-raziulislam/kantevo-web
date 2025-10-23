import { createContext, useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';

const AuthContext = createContext();

// Create centralized axios instance
const api = axios.create({
    baseURL: 'http://localhost:5050/api',
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); // for spinner
    const socketRef = useRef(null); // ✅ socket instance stored in ref

    // ------------------- LOGIN -------------------
    const login = (userData, token) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
    };

    // ------------------- LOGOUT -------------------
    const logout = () => {
        setUser(null);
        setToken(null);
        if (socketRef.current) {
            socketRef.current.disconnect(); // ✅ disconnect socket on logout
            socketRef.current = null;
        }
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    // ------------------- LOAD FROM STORAGE -------------------
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }

        setLoading(false);
    }, []);

    // ------------------- SOCKET INIT -------------------
    useEffect(() => {
        if (!user) return;

        const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5050');
        socketRef.current = newSocket;

        // Automatically join room based on user type
        if (user.role === 'student') {
            newSocket.emit('joinUser', user._id); // ✅ student joins user room
        } else if (user.role === 'canteenOwner') {
            const canteenId = user.canteen?._id || user.canteen;
            if (canteenId) {
                newSocket.emit('joinCanteen', canteenId); // ✅ owner joins canteen room
            }
        }

        return () => {
            newSocket.disconnect();
            socketRef.current = null;
        };
    }, [user]);

    // ------------------- AXIOS INTERCEPTORS -------------------
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

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                isLoggedIn: !!user,
                loading,
                api, // ✅ expose centralized api
                socket: socketRef.current, // ✅ expose socket globally
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
