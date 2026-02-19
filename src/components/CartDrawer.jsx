import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, ShoppingBag, ChevronUp, ChevronDown } from 'lucide-react';
import { imageHelper } from '../utils/imageHelper';
import { Link, useNavigate } from 'react-router-dom';

const CartDrawer = () => {
    const {
        isCartOpen,
        setIsCartOpen,
        cartItems,
        removeFromCart,
        cartTotal,
        leoCoins,
        finalTotal,
        updateQuantity
    } = useCart();
    const navigate = useNavigate();

    return (
        <div className={`fixed inset-0 z-[60] transition-visibility duration-300 ${isCartOpen ? 'visible' : 'invisible'}`}>
            <div
                className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={() => setIsCartOpen(false)}
            ></div>

            <div className={`absolute top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl transform transition-transform duration-300 flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                    <h2 className="text-xl font-serif font-bold uppercase tracking-wider">Shopping Cart ({cartItems.length})</h2>
                    <button onClick={() => setIsCartOpen(false)} className="hover:rotate-90 transition-transform duration-300 p-1">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-grow overflow-y-auto p-6 scrollbar-thin">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <span className="text-4xl text-gray-300"><ShoppingBag size={48} /></span>
                            <p className="text-gray-500 font-medium">Your cart is empty.</p>
                            <button onClick={() => setIsCartOpen(false)} className="text-black underline font-bold uppercase tracking-wide text-sm">Continue Shopping</button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {cartItems.map((item, idx) => (
                                <div key={`${item.id}-${idx}`} className="flex gap-5 animate-slide-up group">
                                    <div className="w-24 aspect-[3/4] bg-gray-100 flex-shrink-0 relative overflow-hidden">
                                        <img
                                            src={imageHelper(item.images?.[0] || item.image || '')}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="flex-grow flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-relaxed uppercase tracking-wide">
                                                    {item.name}
                                                </h3>
                                                <button
                                                    onClick={() => removeFromCart(item.id, { size: item.selectedSize, color: item.selectedColor })}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                                                {item.selectedSize} / {item.selectedColor}
                                            </div>
                                        </div>

                                        <div className="flex items-end justify-between mt-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center border border-gray-200 rounded-sm">
                                                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                                    <div className="flex flex-col border-l border-gray-200">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1, { size: item.selectedSize, color: item.selectedColor })}
                                                            className="px-1 hover:bg-gray-100 border-b border-gray-200 h-4 flex items-center justify-center"
                                                        >
                                                            <ChevronUp size={10} />
                                                        </button>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), { size: item.selectedSize, color: item.selectedColor })}
                                                            className="px-1 hover:bg-gray-100 h-4 flex items-center justify-center"
                                                        >
                                                            <ChevronDown size={10} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="font-bold text-sm">
                                                ₹{((item.price || 0) * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0 space-y-4">




                        <div className="space-y-2 border-t border-gray-200 pt-4">
                            <div className="flex justify-between text-lg font-bold uppercase tracking-wider">
                                <span>Total</span>
                                <span>₹{finalTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setIsCartOpen(false);
                                navigate('/checkout');
                            }}
                            className="w-full bg-[#C19A6B] text-white py-4 uppercase font-bold tracking-[0.2em] hover:bg-[#a6855b] transition-all duration-300 text-xs"
                        >
                            Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;
