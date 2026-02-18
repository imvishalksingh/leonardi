import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [leoCoins, setLeoCoins] = useState(0); // Mock or fetch from user

    // Load cart from local storage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart', e);
            }
        }
    }, []);

    // Save cart to local storage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1, options = {}) => {
        setCartItems(prev => {
            const existingItemIndex = prev.findIndex(item =>
                item.id === product.id &&
                item.selectedSize === options.size &&
                item.selectedColor === options.color
            );

            if (existingItemIndex > -1) {
                const newCart = [...prev];
                newCart[existingItemIndex].quantity += quantity;
                return newCart;
            } else {
                return [...prev, {
                    ...product,
                    quantity,
                    selectedSize: options.size,
                    selectedColor: options.color
                }];
            }
        });

        if (options.openDrawer) {
            setIsCartOpen(true);
        }
    };

    const removeFromCart = (productId, options = {}) => {
        setCartItems(prev => prev.filter(item =>
            !(item.id === productId &&
                item.selectedSize === options.size &&
                item.selectedColor === options.color)
        ));
    };

    const updateQuantity = (productId, newQuantity, options = {}) => {
        if (newQuantity < 1) return;
        setCartItems(prev => prev.map(item => {
            if (item.id === productId &&
                item.selectedSize === options.size &&
                item.selectedColor === options.color) {
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const cartTotal = cartItems.reduce((acc, item) => {
        const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
        return acc + (price * item.quantity);
    }, 0);

    // Mock calculations for now
    const shipping = 0;
    const finalTotal = cartTotal + shipping;

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            isCartOpen,
            setIsCartOpen,
            cartTotal,
            finalTotal,
            leoCoins
        }}>
            {children}
        </CartContext.Provider>
    );
};
