import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api'; // Use centralized api instance
import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    // Set token on axios instance globally whenever it changes
    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
        } else {
            delete api.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
        setLoading(false); // Stop loading after token check
    }, [token]);

    // Helper to request CSRF cookie (Still good to have for sanctum)
    const csrf = async () => {
        await api.get('/sanctum/csrf-cookie');
    };

    const checkUserLoggedIn = async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            // Use profile API for full details (including image URL logic)
            const response = await api.get('/api/profile/get');
            if (response.data.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.error('Check User Error', error);
            // If 401, token is invalid
            if (error.response && error.response.status === 401) {
                setToken(null);
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Only fetch profile if we have a token but no user data (e.g. on page load)
        // This prevents overwriting the full user object returned by login with potentially incomplete data from profile/get
        if (token && !user) {
            checkUserLoggedIn();
        }
    }, [token, user]); // Re-run when token changes, but respect existing user state

    const updateProfile = async (formData) => {
        try {
            // await csrf(); // Not strictly needed with Token Auth but harmless
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const response = await api.post('/api/profile/update', formData, config);

            if (response.data.success) {
                setUser(response.data.user);
                toast.success('Profile updated successfully!');
                return response.data;
            } else {
                throw new Error(response.data.message || 'Update failed');
            }
        } catch (error) {
            console.error('Update Profile Error:', error);
            let message = 'Update failed';
            if (error.response) {
                message = `Error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`;
            }
            toast.error(message);
            throw error;
        }
    };

    const generateOTP = async (mobile) => {
        try {
            await csrf();
            const response = await api.post('/api/login/generate-otp', { mobile });
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
            const response = await api.post('/api/login/verify-otp', { mobile, otp });
            // Backend returns: { success: true, token: "...", user: {...} }
            if (response.data && response.data.token) {
                setToken(response.data.token);
                setUser(response.data.user);
                setIsAuthModalOpen(false);
                toast.success('Login Successful!');
                return response.data;
            } else {
                throw new Error('Verification failed: No token received');
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
                const response = await api.post('/api/login/google', {
                    code: codeResponse.code,
                });

                // Backend returns: { success: true, token: "...", user: {...} }
                if (response.data && response.data.token) {
                    setToken(response.data.token);
                    setUser(response.data.user);
                    setIsAuthModalOpen(false);
                    toast.success('Google Login Successful!');
                } else {
                    throw new Error('Google Login failed: No token received');
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
            await api.post('/api/logout');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setToken(null);
            setUser(null);
            toast.success('Logged out successfully');
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
            updateProfile,
            isAuthModalOpen,
            setIsAuthModalOpen,
            checkUserLoggedIn
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
