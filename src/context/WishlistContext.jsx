import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false); // Used by header to toggle drawer if exists

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem('wishlist');
        if (saved) {
            try {
                setWishlistItems(JSON.parse(saved));
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const addToWishlist = (product) => {
        setWishlistItems(prev => {
            if (prev.find(item => item.id === product.id)) return prev;
            return [...prev, product];
        });
        // Optional: Open wishlist drawer
        // setIsWishlistOpen(true);
    };

    const removeFromWishlist = (productId) => {
        setWishlistItems(prev => prev.filter(item => item.id !== productId));
    };

    const toggleWishlist = (product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item.id === productId);
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
