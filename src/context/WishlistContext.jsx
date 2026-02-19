import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('wishlist');
            try {
                return saved ? JSON.parse(saved) : [];
            } catch (e) {
                console.error(e);
                return [];
            }
        }
        return [];
    });
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const { user } = useAuth();

    // Fetch Wishlist from API or LocalStorage
    useEffect(() => {
        const initializeWishlist = async () => {
            if (user) {
                // Sync Local Wishlist to Server
                const saved = localStorage.getItem('wishlist');
                if (saved) {
                    try {
                        const localItems = JSON.parse(saved);
                        if (Array.isArray(localItems) && localItems.length > 0) {
                            for (const item of localItems) {
                                // Check if already exists in server to avoid duplicates? 
                                // Backend usually handles duplication or we can just send.
                                await axios.post('/api/wishlist/add', { product_id: item.id });
                            }
                            localStorage.removeItem('wishlist');
                            toast.success('Wishlist merged with your account');
                        }
                    } catch (e) {
                        console.error('Failed to sync wishlist', e);
                    }
                }
                fetchWishlist();
            } else {
                const saved = localStorage.getItem('wishlist');
                if (saved) {
                    try {
                        setWishlistItems(JSON.parse(saved));
                    } catch (e) {
                        console.error(e);
                        setWishlistItems([]);
                    }
                } else {
                    setWishlistItems([]);
                }
            }
        };

        initializeWishlist();
    }, [user]);

    const fetchWishlist = async () => {
        try {
            const response = await axios.get('/api/wishlist/get');
            if (response.data.success) {
                // Map backend structure to frontend structure if needed
                // Backend returns: { success: true, data: [ { id, user_id, product_id, product: {...} } ] }
                // Frontend expects array of products
                const products = response.data.data.map(item => item.product);
                setWishlistItems(products);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    // Save to local storage only if NOT logged in
    useEffect(() => {
        if (!user) {
            localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
        }
    }, [wishlistItems, user]);

    const addToWishlist = async (product) => {
        if (user) {
            // Optimistic Update: Add to UI immediately
            setWishlistItems(prev => {
                if (prev.find(item => item.id === product.id)) return prev;
                return [...prev, product];
            });
            toast.success('Added to wishlist');

            try {
                // Background API Sync
                await axios.post('/api/wishlist/add', { product_id: product.id });
                // We don't fetchWishlist() here to avoid UI flicker/lag, unless necessary
            } catch (error) {
                console.error('Error adding to wishlist:', error);
                // Revert on failure
                setWishlistItems(prev => prev.filter(item => item.id !== product.id));
                toast.error('Failed to add to wishlist');
            }
        } else {
            setWishlistItems(prev => {
                if (prev.find(item => item.id === product.id)) return prev;
                return [...prev, product];
            });
            toast.success('Added to wishlist');
        }
    };

    const removeFromWishlist = async (productId) => {
        if (user) {
            // Save current state for rollback
            const previousItems = [...wishlistItems];
            // Optimistic Update: Remove from UI immediately
            setWishlistItems(prev => prev.filter(item => item.id !== productId));
            toast.success('Removed from wishlist');

            try {
                // Background API Sync
                await axios.post('/api/wishlist/remove', { product_id: productId });
            } catch (error) {
                console.error('Error removing from wishlist:', error);
                // Revert on failure
                setWishlistItems(previousItems);
                toast.error('Failed to remove from wishlist');
            }
        } else {
            setWishlistItems(prev => prev.filter(item => item.id !== productId));
            toast.success('Removed from wishlist');
        }
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item.id === productId);
    };

    const toggleWishlist = (product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const wishlistCount = wishlistItems.length;

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            addToWishlist,
            removeFromWishlist,
            toggleWishlist,
            isInWishlist,
            wishlistCount,
            isWishlistOpen,
            setIsWishlistOpen
        }}>
            {children}
        </WishlistContext.Provider>
    );
};
