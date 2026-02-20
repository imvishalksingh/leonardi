import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { imageHelper } from '../utils/imageHelper';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('cart');
            try {
                const parsed = saved ? JSON.parse(saved) : [];
                // Filter out corrupted items (missing name or price)
                return Array.isArray(parsed) ? parsed.filter(i => i && i.name && i.id) : [];
            } catch (e) {
                console.error(e);
                return [];
            }
        }
        return [];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [leoCoins, setLeoCoins] = useState(0);
    const { user } = useAuth();

    // Fetch Cart from API or LocalStorage
    useEffect(() => {
        const initializeCart = async () => {
            if (user) {
                // Sync Local Cart to Server
                const savedCart = localStorage.getItem('cart');
                if (savedCart) {
                    try {
                        const localItems = JSON.parse(savedCart);
                        if (Array.isArray(localItems) && localItems.length > 0) {
                            for (const item of localItems) {
                                await axios.post('/api/cart/add', {
                                    product_id: item.id,
                                    quantity: item.quantity
                                });
                            }
                            localStorage.removeItem('cart');
                            toast.success('Cart merged with your account');
                        }
                    } catch (e) {
                        console.error('Failed to sync cart', e);
                    }
                }
                // Always fetch fresh server state
                fetchCart();
            } else {
                // Load Local Cart
                const savedCart = localStorage.getItem('cart');
                if (savedCart) {
                    try {
                        setCartItems(JSON.parse(savedCart));
                    } catch (e) {
                        console.error('Failed to parse cart', e);
                        setCartItems([]);
                    }
                } else {
                    setCartItems([]);
                }
            }
        };

        initializeCart();
    }, [user]);

    const fetchCart = async () => {
        try {
            const response = await axios.get('/api/cart/get');
            if (response.data.success) {
                // Backend returns: { success: true, data: [ { id, user_id, product_id, quantity, product: {...} } ] }
                const items = response.data.data
                    .filter(item => item.product && item.product.id) // Filter out orphan items
                    .map(item => {
                        const productData = item.product;
                        return {
                            ...productData,
                            id: productData.id,
                            name: productData.name || productData.title || 'Unknown Product',
                            price: parseFloat(productData.sale_price || productData.price || 0),
                            images: productData.images || [],
                            quantity: item.quantity,
                            selectedSize: null,
                            selectedColor: null
                        };
                    });
                setCartItems(items);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    // Save cart to local storage only if NOT logged in
    useEffect(() => {
        if (!user) {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }
    }, [cartItems, user]);

    const addToCart = async (product, quantity = 1, options = {}) => {
        if (!product || !product.id || !product.name) {
            console.error("Invalid product passed to addToCart", product);
            toast.error("Could not add item: Invalid product data");
            return;
        }

        if (user) {
            // Optimistic Update
            setCartItems(prev => {
                const existingItemIndex = prev.findIndex(item => item.id === product.id);
                if (existingItemIndex > -1) {
                    const newCart = [...prev];
                    newCart[existingItemIndex].quantity += quantity;
                    return newCart;
                } else {
                    return [...prev, { ...product, quantity, selectedSize: null, selectedColor: null }];
                }
            });
            toast.success('Added to cart');
            if (options.openDrawer) setIsCartOpen(true);

            try {
                await axios.post('/api/cart/add', {
                    product_id: product.id,
                    quantity: quantity
                });
                // Background sync - optional fetchCart() if needed for strict consistency
            } catch (error) {
                console.error('Error adding to cart:', error);
                toast.error('Failed to add to cart');
                fetchCart(); // Revert/Sync on error
            }
        } else {
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
            toast.success('Added to cart');
        }
    };

    const removeFromCart = async (productId, options = {}) => {
        if (user) {
            // Optimistic Update
            const previousCart = [...cartItems];
            setCartItems(prev => prev.filter(item => item.id !== productId));
            toast.success('Removed from cart');

            try {
                await axios.post('/api/cart/remove', { product_id: productId });
            } catch (error) {
                console.error('Error removing from cart:', error);
                toast.error('Failed to remove from cart');
                setCartItems(previousCart); // Revert
            }
        } else {
            setCartItems(prev => prev.filter(item =>
                !(item.id === productId &&
                    item.selectedSize === options.size &&
                    item.selectedColor === options.color)
            ));
            toast.success('Removed from cart');
        }
    };

    const updateQuantity = async (productId, newQuantity, options = {}) => {
        if (newQuantity < 1) return;

        if (user) {
            // Optimistic Update
            setCartItems(prev => prev.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            ));
            toast.success('Cart updated');

            // Complex logic for backend that only supports "increment"
            // We need to fetch the *actual* server state to calculate diff if we want to use 'add' endpoint strictly,
            // but for now we rely on the optimistic state being reasonably close.
            // A safer backend endpoint would be /cart/update { quantity: N } 

            // To be safe with the current "increment/remove" logic, we might need to rely on fetchCart or just do the logic blindly.
            // Let's try to assume the previous state was correct.
            // Actually, for consistency with the backend limitation (only 'add' adds to quantity), 
            // the robust way is:
            // 1. Remove Item
            // 2. Add Item with New Quantity
            // (This is what we did before, but now we do it in background)

            try {
                await axios.post('/api/cart/remove', { product_id: productId });
                await axios.post('/api/cart/add', { product_id: productId, quantity: newQuantity });
            } catch (error) {
                console.error('Update quantity failed', error);
                fetchCart(); // Sync on error
            }
        } else {
            setCartItems(prev => prev.map(item => {
                if (item.id === productId &&
                    item.selectedSize === options.size &&
                    item.selectedColor === options.color) {
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }));
        }
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
