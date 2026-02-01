import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const DiscountRedemption = ({ condensed = false }) => {
    const {
        leoCoins,
        applyDiscount,
        removeDiscount,
        discountCode,
        discountAmount,
        toggleRedeemCoins,
        isRedeemingCoins
    } = useCart();

    const [inputCode, setInputCode] = useState('');

    const handleApply = () => {
        if (inputCode.trim()) {
            applyDiscount(inputCode);
            setInputCode('');
        }
    };

    return (
        <div className="space-y-3">
            {/* Leo Coins Banner (Conditional) */}
            {!condensed && (
                <div className="bg-white border border-gray-200 text-gray-800 text-xs py-2 px-3 text-center uppercase tracking-wide font-bold">
                    You will earn <span className="text-accent">{leoCoins}</span> Leo Coins with this order
                </div>
            )}

            {/* Support Text for Checkout */}
            {condensed && (
                <div className="text-xs text-gray-500 font-medium mb-2">
                    Have a coupon or Leo Coins?
                </div>
            )}

            {/* Coupon Code Input */}
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Discount Code"
                    className="flex-grow border border-gray-300 px-3 py-2 text-sm uppercase outline-none focus:border-black"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                />
                <button
                    onClick={handleApply}
                    className="bg-black text-white px-4 text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
                >
                    Apply
                </button>
            </div>

            {/* Applied Discount Badge */}
            {discountAmount > 0 && (
                <div className="flex justify-between items-center text-xs text-green-600 font-bold bg-green-50 p-2 rounded border border-green-100 animate-fade-in">
                    <span>Code {discountCode} applied!</span>
                    <button onClick={removeDiscount} className="text-red-500 underline hover:text-red-700">Remove</button>
                </div>
            )}

            {/* Redeem Coins Checkbox */}
            <div className="flex items-center space-x-2 pt-1">
                <input
                    type="checkbox"
                    id="redeem-coins-shared"
                    checked={isRedeemingCoins}
                    onChange={toggleRedeemCoins}
                    className="w-4 h-4 accent-black cursor-pointer"
                />
                <label htmlFor="redeem-coins-shared" className="text-sm cursor-pointer select-none text-gray-700">
                    Redeem 500 Leo Coins (Get ₹50 Off)
                </label>
            </div>
        </div>
    );
};

export default DiscountRedemption;
