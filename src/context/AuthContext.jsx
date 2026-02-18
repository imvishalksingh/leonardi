import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

// ====================================================
// 🔧 REPLACE THIS with your actual backend API URL
// We use an empty string to leverage the Vite proxy (see vite.config.js)
// This avoids CORS issues by treating requests as same-origin
const API_BASE_URL = '';
// ====================================================

// Configure Axios
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true; // IMPORTANT: To handle cookies/sessions

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Helper to request CSRF cookie
    const csrf = async () => {
        await axios.get('/sanctum/csrf-cookie');
    };

    const checkUserLoggedIn = async () => {
        try {
            const response = await axios.get('/api/user');
            setUser(response.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const generateOTP = async (mobile) => {
        try {
            await csrf();
            const response = await axios.post('/api/login/generate-otp', { mobile });
            const data = response.data;

            if (!data.success) {
                throw new Error(data.message || 'Failed to generate OTP');
            }
            return data;
        } catch (error) {
            console.error('Error generating OTP:', error);
            let message = 'Server error';
            if (error.response) {
                message = `Server Error: ${error.response.status} ${error.response.statusText}`;
                if (error.response.data && error.response.data.message) {
                    message += ` - ${error.response.data.message}`;
                }
            } else if (error.request) {
                message = 'No response from server. Check your connection.';
            } else {
                message = error.message;
            }
            toast.error(message);
            throw error;
        }
    };

    const verifyOTP = async (mobile, otp) => {
        try {
            await csrf();
            const response = await axios.post('/api/login/verify-otp', { mobile, otp });
            if (response.data && (response.data.user || response.data.token)) {
                // Assume response contains user object or we fetch it
                if (response.data.user) {
                    setUser(response.data.user);
                } else {
                    await checkUserLoggedIn();
                }
                setIsAuthModalOpen(false);
                toast.success('Login Successful!');
                return response.data;
            } else {
                throw new Error('Verification failed');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            let message = 'Verification failed';
            if (error.response) {
                message = `Error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`;
            }
            toast.error(message);
            throw error;
        }
    };

    // Google Login Implementation (Authorization Code Flow)
    const googleLogin = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (codeResponse) => {
            try {
                console.log("Google Auth Code Received:", codeResponse);
                await csrf();
                const response = await axios.post('/api/login/google', {
                    code: codeResponse.code,
                });

                if (response.data && response.data.user) {
                    setUser(response.data.user);
                    setIsAuthModalOpen(false);
                    toast.success('Google Login Successful!');
                } else {
                    // Maybe just logged in, fetch user
                    await checkUserLoggedIn();
                    setIsAuthModalOpen(false);
                    toast.success('Google Login Successful!');
                }
            } catch (error) {
                console.error('Google Login Error:', error);
                toast.error('Google Login Failed. See console for details.');
            }
        },
        onError: errorResponse => console.log(errorResponse),
    });

    const logout = async () => {
        try {
            await axios.post('/api/logout');
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
            setUser(null); // Force logout on frontend
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            generateOTP,
            verifyOTP,
            googleLogin,
            logout,
            isAuthModalOpen,
            setIsAuthModalOpen,
            checkUserLoggedIn
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext; // Default export needed?!
