import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useLocation } from 'react-router-dom';
import { imageHelper } from '../utils/imageHelper';
import DiscountRedemption from '../components/DiscountRedemption';
import { ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react';

const Checkout = () => {
    const { cartItems, cartTotal, discountAmount, coinDiscount, finalTotal } = useCart();
    const location = useLocation();
    const buyNowItem = location.state?.buyNowItem;

    // Use Buy Now item if available, otherwise fallback to cart
    const effectiveCartItems = useMemo(() => {
        return buyNowItem ? [buyNowItem] : cartItems;
    }, [buyNowItem, cartItems]);

    // Calculate totals for Buy Now item if active, otherwise use global context values
    const { effectiveCartTotal, effectiveFinalTotal, effectiveDiscountAmount } = useMemo(() => {
        if (buyNowItem) {
            const itemTotal = buyNowItem.price * buyNowItem.quantity;
            return {
                effectiveCartTotal: itemTotal,
                effectiveFinalTotal: itemTotal, // No discounts applied yet for single item unless logic added
                effectiveDiscountAmount: 0 // Simplification: buy now ignores global discounts initially
            };
        }
        return {
            effectiveCartTotal: cartTotal,
            effectiveFinalTotal: finalTotal,
            effectiveDiscountAmount: discountAmount
        };
    }, [buyNowItem, cartTotal, finalTotal, discountAmount]);

    const [step, setStep] = useState(1); // 1: Info, 3: Payment
    const [loading, setLoading] = useState(false);
    const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(true);

    if (effectiveCartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-2xl font-serif font-bold mb-4">Your cart is empty</h1>
                <Link to="/" className="text-sm font-bold uppercase underline tracking-widest">Continue Shopping</Link>
            </div>
        );
    }

    const handleContinueToPayment = (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        setStep(3);
    };

    const handleCompleteOrder = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            alert('Order Placed Successfully! (This is a demo)');
            window.location.href = '/'; // Redirect to home
        }, 1500);
    };

    // Reusable Order Summary Content
    const OrderSummaryContent = ({ isMobile }) => (
        <div className={isMobile ? "text-sm" : ""}>
            <div className={`space-y-${isMobile ? '3' : '4'} ${isMobile ? 'pb-4' : 'border-b border-gray-100 pb-6'} max-h-[400px] overflow-y-auto scrollbar-thin`}>
                {effectiveCartItems.map((item, idx) => (
                    <div key={idx} className={`flex ${isMobile ? 'gap-3 items-center' : 'gap-4'}`}>
                        <div className={`${isMobile ? 'w-12 h-16 border border-gray-100' : 'w-16 h-20 bg-gray-100'} relative flex-shrink-0`}>
                            <img src={imageHelper(item.images[0])} alt={item.name} className="w-full h-full object-cover" />
                            <span className={`absolute ${isMobile ? '-top-2 -right-2 w-5 h-5 text-[10px]' : '-top-3 -right-3 w-6 h-6 text-xs'} bg-gray-500 text-white rounded-full flex items-center justify-center font-bold z-10 border-2 border-white shadow-sm`}>
                                {item.quantity}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className={`font-bold truncate ${isMobile ? 'text-xs' : 'text-sm'}`}>{item.name}</h3>
                            <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-500`}>{item.selectedSize} / {item.selectedColor}</p>
                        </div>
                        <div className={`font-bold ${isMobile ? 'text-xs' : 'text-sm'}`}>₹{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                ))}
            </div>

            <div className={isMobile ? "pt-3 border-t border-dashed border-gray-200 mt-2" : "pt-6 space-y-2"}>
                {!isMobile && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-bold">₹{effectiveCartTotal.toFixed(2)}</span>
                    </div>
                )}

                {/* Discounts in Summary */}
                {effectiveDiscountAmount > 0 && (
                    <div className={`flex justify-between ${isMobile ? 'text-xs mb-1' : 'text-sm'} text-green-600`}>
                        <span>Discount</span>
                        <span>-₹{effectiveDiscountAmount.toFixed(2)}</span>
                    </div>
                )}
                {coinDiscount > 0 && !buyNowItem && (
                    <div className={`flex justify-between ${isMobile ? 'text-xs mb-1' : 'text-sm'} text-accent`}>
                        <span>Leo Coins</span>
                        <span>-₹{coinDiscount.toFixed(2)}</span>
                    </div>
                )}

                <div className={`flex justify-between items-center ${!isMobile ? 'text-lg font-bold pt-4 border-t border-gray-100 mt-2' : ''}`}>
                    <span className={`font-bold ${isMobile ? 'text-base' : 'text-lg'}`}>Total</span>
                    <span className={`font-bold ${isMobile ? 'text-lg' : 'text-lg'}`}>₹{effectiveFinalTotal ? effectiveFinalTotal.toFixed(2) : effectiveCartTotal.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Mobile Order Summary Toggle (Only visible in Info step or generally visible on mobile) */}
            {/* Request: "order summary only show on information step" on mobile */}
            {step === 1 && (
                <div className="lg:hidden border-b border-gray-200 bg-gray-50">
                    <button
                        onClick={() => setIsOrderSummaryOpen(!isOrderSummaryOpen)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50"
                    >
                        <div className="flex items-center text-blue-600 text-sm font-medium">
                            <ShoppingCart size={16} className="mr-2" />
                            <span>{isOrderSummaryOpen ? 'Hide' : 'Show'} order summary</span>
                            {isOrderSummaryOpen ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                        </div>
                        <div className="font-bold text-lg">
                            ₹{effectiveFinalTotal ? effectiveFinalTotal.toFixed(2) : effectiveCartTotal.toFixed(2)}
                        </div>
                    </button>
                    {isOrderSummaryOpen && (
                        <div className="p-4 bg-white border-t border-gray-100 animate-fade-in">
                            <OrderSummaryContent isMobile={true} />
                        </div>
                    )}
                </div>
            )}

            <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 lg:px-4 lg:py-12">

                {/* Left Column: Form Steps */}
                {/* On Mobile, add padding X. On Desktop, padding handled by grid gap/container */}
                <div className="lg:col-span-7 space-y-8 px-4 lg:px-0 pt-8 lg:pt-0">

                    {/* Breadcrumbs */}
                    <div className="flex items-center text-xs font-bold uppercase tracking-widest space-x-2 text-gray-500 mb-8">
                        <span className={step >= 1 ? 'text-black' : ''}>Information</span>
                        <span>/</span>
                        <span className={step >= 3 ? 'text-black' : ''}>Payment</span>
                    </div>

                    {/* Step 1: Information Form */}
                    {step === 1 && (
                        <div className="bg-white p-4 md:p-8 rounded-sm shadow-sm animate-fade-in">
                            <h2 className="text-lg font-bold mb-6 uppercase tracking-wider">Contact Information</h2>
                            <form onSubmit={handleContinueToPayment} className="space-y-4">
                                <input required type="email" placeholder="Email address" className="w-full p-3 border border-gray-200 outline-none focus:border-black text-sm" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input required type="text" placeholder="First name" className="w-full p-3 border border-gray-200 outline-none focus:border-black text-sm" />
                                    <input required type="text" placeholder="Last name" className="w-full p-3 border border-gray-200 outline-none focus:border-black text-sm" />
                                </div>
                                <input required type="text" placeholder="Address" className="w-full p-3 border border-gray-200 outline-none focus:border-black text-sm" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input required type="text" placeholder="City" className="w-full p-3 border border-gray-200 outline-none focus:border-black text-sm" />
                                    <input required type="text" placeholder="Postal code" className="w-full p-3 border border-gray-200 outline-none focus:border-black text-sm" />
                                </div>
                                <input required type="tel" placeholder="Phone" className="w-full p-3 border border-gray-200 outline-none focus:border-black text-sm" />

                                {/* Buttons - Standard Layout */}
                                <div className="mt-8 flex flex-col md:flex-row justify-end items-center gap-4">
                                    <button type="submit" className="w-full md:w-auto bg-black text-white px-8 py-4 uppercase font-bold tracking-widest text-xs hover:bg-gray-800 transition-colors order-1 md:order-2">
                                        Continue to Payment
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Step 3: Payment */}
                    {step === 3 && (
                        <div className="bg-white p-4 md:p-8 rounded-sm shadow-sm animate-fade-in">

                            {/* Discount Codes Section (Moved Here) */}
                            <div className="mb-8 p-4 md:p-6 bg-gray-50 border border-gray-100 rounded-sm">
                                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Discounts & Rewards</h3>
                                <DiscountRedemption condensed={true} />
                            </div>

                            <h2 className="text-lg font-bold mb-6 uppercase tracking-wider">Payment</h2>
                            <div className="p-4 bg-gray-50 border border-gray-200 text-center mb-6">
                                <p className="text-sm text-gray-500">All transactions are secure and encrypted.</p>
                            </div>

                            {/* Mock Payment Options */}
                            <div className="space-y-4 mb-8">
                                <label className="flex items-center justify-between p-4 border border-black bg-gray-50 cursor-pointer">
                                    <div className="flex items-center space-x-3">
                                        <input type="radio" name="payment" defaultChecked className="accent-black w-4 h-4" />
                                        <span className="text-sm font-bold">Credit Card / Debit Card</span>
                                    </div>
                                    <div className="flex space-x-1">
                                        {/* Mock card icons */}
                                        <div className="w-8 h-5 bg-gray-300 rounded"></div>
                                        <div className="w-8 h-5 bg-gray-300 rounded"></div>
                                    </div>
                                </label>
                                <label className="flex items-center p-4 border border-gray-200 cursor-pointer">
                                    <div className="flex items-center space-x-3">
                                        <input type="radio" name="payment" className="accent-black w-4 h-4" />
                                        <span className="text-sm font-medium">Cash on Delivery (COD)</span>
                                    </div>
                                </label>
                            </div>

                            {/* Buttons - Standard Layout */}
                            <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                                <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-black order-2 md:order-1">
                                    &lt; Return to Information
                                </button>
                                <button
                                    onClick={handleCompleteOrder}
                                    disabled={loading}
                                    className="w-full md:w-auto bg-black text-white px-8 py-4 uppercase font-bold tracking-widest text-xs hover:bg-gray-800 transition-colors disabled:opacity-50 order-1 md:order-2"
                                >
                                    {loading ? 'Processing...' : 'Complete Order'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Order Summary (Desktop Only) */}
                <div className="hidden lg:block lg:col-span-5">
                    <div className="bg-white p-8 rounded-sm shadow-sm sticky top-8">
                        <h2 className="text-lg font-bold mb-6 uppercase tracking-wider">Order Summary</h2>
                        <OrderSummaryContent isMobile={false} />
                    </div>
                </div>

            </div>
        </div >
    );
};

export default Checkout;
