import React, { useState, useEffect } from 'react';
import { User, Package, Coins, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    // Form State (Initialized from user context)
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.mobile || '',
        address: user?.address || '',
        userId: user?.user_id || 'N/A'
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.mobile || '',
                address: user.address || '',
                userId: user.user_id || 'N/A'
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogout = () => {
        logout();
        // Optional: Redirect to home or stay here to show "Sign In" message
        // navigate('/'); 
    };

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-20 min-h-screen text-center">
                <h2 className="text-2xl font-serif font-bold mb-4">Please Sign In</h2>
                <p className="text-gray-600 mb-8">You need to be logged in to view your profile.</p>
                <div className="p-8 border border-dashed border-gray-300 rounded-lg inline-block">
                    <p className="text-sm text-gray-500">
                        Click the "User Icon" in the header to login or register.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 bg-gray-50 min-h-screen">
            <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">

                {/* LEFT SIDEBAR */}
                <div className="w-full lg:w-1/4">
                    <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
                        {/* Profile Image */}
                        <div className="relative w-24 h-24 mx-auto mb-4">
                            <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                                {user?.profile_image ? (
                                    <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={40} className="text-gray-400" />
                                )}
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900">{formData.name || 'Guest User'}</h3>
                        <p className="text-sm text-gray-500 mb-6">{formData.email || formData.phone}</p>

                        {/* Navigation Menu */}
                        <div className="space-y-1">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <User size={18} />
                                My Profile
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <Package size={18} />
                                Orders History
                            </button>
                            <button
                                onClick={() => setActiveTab('coins')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'coins' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <Coins size={18} />
                                Leo Coins
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors mt-4"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="w-full lg:w-3/4">
                    <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Information</h2>

                                {/* Avatar Upload Section */}
                                <div className="mb-8">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Avatar:</label>
                                    <div className="flex items-start gap-6">
                                        <div className="w-24 h-24 bg-white border border-gray-200 rounded-lg flex items-center justify-center p-2 overflow-hidden">
                                            {user?.profile_image ? (
                                                <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover rounded-md" />
                                            ) : (
                                                <div className="text-center">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">LEONARDI</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-900 mb-2">Upload File:</p>
                                            <div className="flex items-center gap-3">
                                                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold py-2 px-4 rounded-md transition-colors">
                                                    Choose File
                                                    <input type="file" className="hidden" />
                                                </label>
                                                <span className="text-xs text-gray-400">No file chosen</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* User ID (Read-only) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                                    <div className="bg-gray-100 text-gray-600 px-4 py-3 rounded-lg text-sm font-medium">
                                        {formData.userId}
                                    </div>
                                </div>

                                {/* Form Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Full Name */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter your name"
                                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition-colors"
                                        />
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="Phone number"
                                            value={formData.phone}
                                            readOnly
                                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none bg-gray-50 text-gray-500 cursor-not-allowed"
                                        />
                                        <p className="text-[10px] text-gray-400 mt-1">Contact support to change number</p>
                                    </div>
                                    {/* Email Address */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            readOnly={!!user.google_id || !!user.email} // If verified email exists or google login
                                            className={`w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none ${user.email ? 'bg-gray-50' : 'bg-white focus:border-black'}`}
                                        />
                                    </div>
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <textarea
                                        name="address"
                                        placeholder="Enter your address"
                                        rows="3"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition-colors resize-none placeholder:text-gray-300"
                                    ></textarea>
                                </div>

                                {/* Save Button */}
                                <div className="mt-8">
                                    <button className="bg-black text-white text-xs font-bold uppercase tracking-wider px-8 py-3 rounded-md hover:bg-gray-800 transition-colors shadow-lg">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="text-center py-12">
                                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-bold text-gray-900">No Orders Yet</h3>
                                <p className="text-gray-500 text-sm">Your order history will appear here.</p>
                                <Link to="/" className="inline-block mt-4 text-xs font-bold uppercase tracking-wider underline">Start Shopping</Link>
                            </div>
                        )}

                        {activeTab === 'coins' && (
                            <div className="text-center py-12">
                                <Coins size={48} className="mx-auto text-yellow-500 mb-4" />
                                <h3 className="text-2xl font-bold text-gray-900">{parseFloat(user.leo_coin || 0).toFixed(2)}</h3>
                                <p className="text-gray-500 text-sm uppercase tracking-wider font-bold">Leo Coins</p>
                                <p className="text-xs text-gray-400 mt-2">Earn coins with every purchase!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
