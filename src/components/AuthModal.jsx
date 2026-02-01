import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ isOpen, onClose }) => {
    const [mode, setMode] = useState('login'); // 'login' or 'register'
    const { login } = useAuth();
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock authentication
        const emailInput = e.target.querySelector('input[type="email"]');
        const email = emailInput ? emailInput.value : 'user@example.com';

        login(email);
        alert(`Successfully ${mode === 'login' ? 'logged in' : 'registered'}!`);
        onClose();
        navigate('/profile');
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white w-full max-w-md relative shadow-2xl animate-fade-in p-8">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-serif font-bold uppercase tracking-widest mb-2">
                        {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {mode === 'login' ? 'Sign in to access your account' : 'Register to track orders and save details'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'register' && (
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Full Name</label>
                            <input type="text" className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-black transition-colors" required />
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Email Address</label>
                        <input type="email" className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-black transition-colors" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Password</label>
                        <input type="password" className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-black transition-colors" required />
                    </div>

                    <button className="w-full bg-black text-white py-4 uppercase font-bold text-sm tracking-wider hover:bg-accent transition-colors mt-4">
                        {mode === 'login' ? 'Sign In' : 'Register'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    {mode === 'login' ? (
                        <p>
                            Don't have an account?{' '}
                            <button type="button" onClick={() => setMode('register')} className="font-bold underline">Create one</button>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{' '}
                            <button type="button" onClick={() => setMode('login')} className="font-bold underline">Sign in</button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
