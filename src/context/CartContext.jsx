import React, { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    // Initialize from localStorage
    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem('leonardi_cart');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error("Failed to load cart from localStorage", error);
            return [];
        }
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    const [discountCode, setDiscountCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [isRedeemingCoins, setIsRedeemingCoins] = useState(false);

    // Persist to localStorage whenever cartItems changes
    React.useEffect(() => {
        localStorage.setItem('leonardi_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1, options = {}) => {
        const { openDrawer = true, ...restOptions } = options;

        setCartItems(prev => {
            const existingItem = prev.find(item =>
                item.id === product.id &&
                item.selectedSize === restOptions.size &&
                item.selectedColor === restOptions.color
            );

            if (existingItem) {
                return prev.map(item =>
                    (item.id === product.id && item.selectedSize === restOptions.size && item.selectedColor === restOptions.color)
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prev, { ...product, quantity, selectedSize: restOptions.size, selectedColor: restOptions.color }];
            }
        });

        if (openDrawer) {
            setIsCartOpen(true);
        }
    };

    const removeFromCart = (itemId, options = {}) => {
        setCartItems(prev => prev.filter(item =>
            !(item.id === itemId && item.selectedSize === options.size && item.selectedColor === options.color)
        ));
    };

    const applyDiscount = (code) => {
        if (code.toUpperCase() === 'SAVE10') {
            setDiscountCode(code);
            setDiscountAmount(cartTotal * 0.10); // 10% off
            return { success: true, message: 'Coupon applied successfully!' };
        } else if (code.toUpperCase() === 'SAVE20') {
            setDiscountCode(code);
            setDiscountAmount(cartTotal * 0.20); // 20% off
            return { success: true, message: 'Coupon applied successfully!' };
        }
        return { success: false, message: 'Invalid coupon code' };
    };

    const removeDiscount = () => {
        setDiscountCode('');
        setDiscountAmount(0);
    };

    const toggleRedeemCoins = () => {
        setIsRedeemingCoins(!isRedeemingCoins);
    };

    const cartTotal = useMemo(() => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [cartItems]);

    const coinDiscount = useMemo(() => {
        // Mock logic: user has 500 coins, 10 coins = 1 rupee.
        // Or simply: Redeem Max 100 coins = ₹100 off.
        // Let's say user has 'leoCoins' earned from previous orders? 
        // For now, let's assume we can redeem the *current* session's earned coins (as if they were existing balance) for demo purposes, 
        // OR better: Mock a "User Balance" separate from "Coins earning this order".
        // Let's assume user has 200 coins balance = ₹50 off.
        return isRedeemingCoins ? 50 : 0;
    }, [isRedeemingCoins]);

    const finalTotal = useMemo(() => {
        let total = cartTotal - discountAmount - coinDiscount;
        return total > 0 ? total : 0;
    }, [cartTotal, discountAmount, coinDiscount]);


    const cartCount = useMemo(() => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    }, [cartItems]);

    const leoCoins = useMemo(() => {
        return Math.floor(cartTotal * 0.05);
    }, [cartTotal]);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        cartCount,
        leoCoins,
        applyDiscount,
        removeDiscount,
        discountCode,
        discountAmount,
        toggleRedeemCoins,
        isRedeemingCoins,
        coinDiscount,
        finalTotal
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
