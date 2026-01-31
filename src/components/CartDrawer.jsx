import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, ShoppingBag } from 'lucide-react';
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
        applyDiscount,
        removeDiscount,
        discountCode,
        discountAmount,
        toggleRedeemCoins,
        isRedeemingCoins,
        coinDiscount,
        finalTotal
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
                                            src={imageHelper(item.images[0])}
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
                                            <div className="text-xs font-semibold text-gray-400">
                                                Qty: <span className="text-black">{item.quantity}</span>
                                            </div>
                                            <div className="font-bold text-sm">
                                                ₹{(item.price * item.quantity).toFixed(2)}
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
                        {/* Leo Coins Banner */}
                        <div className="bg-white border border-gray-200 text-gray-800 text-xs py-2 px-3 text-center uppercase tracking-wide font-bold">
                            You will earn <span className="text-accent">{leoCoins}</span> Leo Coins with this order
                        </div>

                        {/* Discount & Coins Section */}
                        <div className="space-y-3 pt-2">
                            {/* Coupon Code */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Discount Code"
                                    className="flex-grow border border-gray-300 px-3 py-2 text-sm uppercase outline-none focus:border-black"
                                    onChange={(e) => {
                                        // Ideally managed by local state before applying, leveraging context for now if needed or simple local state
                                        // For simplicity, let's just use a ref or local state in the component. 
                                        // Wait, I need to add local state for the input here.
                                    }}
                                    id="coupon-input"
                                />
                                <button
                                    onClick={() => {
                                        const input = document.getElementById('coupon-input');
                                        if (input) applyDiscount(input.value);
                                    }}
                                    className="bg-black text-white px-4 text-xs font-bold uppercase tracking-wider hover:bg-gray-800"
                                >
                                    Apply
                                </button>
                            </div>
                            {discountAmount > 0 && (
                                <div className="flex justify-between items-center text-xs text-green-600 font-bold bg-green-50 p-2 rounded">
                                    <span>Code {discountCode} applied!</span>
                                    <button onClick={removeDiscount} className="text-red-500 underline">Remove</button>
                                </div>
                            )}

                            {/* Redeem Coins */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="redeem-coins"
                                    checked={isRedeemingCoins}
                                    onChange={toggleRedeemCoins}
                                    className="w-4 h-4 accent-black"
                                />
                                <label htmlFor="redeem-coins" className="text-sm cursor-pointer select-none">
                                    Redeem 500 Leo Coins (Get ₹50 Off)
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2 border-t border-gray-200 pt-4">
                            <div className="flex justify-between text-sm text-gray-600 uppercase tracking-wide">
                                <span>Subtotal</span>
                                <span>₹{cartTotal.toFixed(2)}</span>
                            </div>

                            {discountAmount > 0 && (
                                <div className="flex justify-between text-sm text-green-600 uppercase tracking-wide">
                                    <span>Discount</span>
                                    <span>-₹{discountAmount.toFixed(2)}</span>
                                </div>
                            )}

                            {coinDiscount > 0 && (
                                <div className="flex justify-between text-sm text-accent uppercase tracking-wide">
                                    <span>Leo Coins</span>
                                    <span>-₹{coinDiscount.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-lg font-bold uppercase tracking-wider pt-2 border-t border-gray-100">
                                <span>Total</span>
                                <span>₹{finalTotal.toFixed(2)}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 text-center">Shipping & taxes calculated at checkout</p>
                        </div>

                        <button
                            onClick={() => {
                                setIsCartOpen(false);
                                navigate('/checkout');
                            }}
                            className="w-full bg-black text-white py-4 uppercase font-bold tracking-[0.2em] hover:bg-gray-800 transition-all duration-300 text-xs"
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
