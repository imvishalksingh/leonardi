import React from 'react';
import { X, ShoppingBag, HeartCrack, HeartPlus } from 'lucide-react';
import { imageHelper } from '../utils/imageHelper';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const WishlistDrawer = ({ isOpen, onClose }) => {
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleMoveToCart = (item) => {
        addToCart(item);
        removeFromWishlist(item.id);
    };

    return (
        <div className={`fixed inset-0 z-50 transition-visibility duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
            <div
                className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            ></div>

            <div className={`absolute top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-serif font-bold uppercase tracking-wider">Wishlist ({wishlistItems.length})</h2>
                    <button onClick={onClose} className="hover:rotate-90 transition-transform duration-300">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-6 scrollbar-thin">
                    {wishlistItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <span className="text-4xl text-gray-300"><HeartPlus size={48} /></span>
                            <p className="text-gray-500">Your wishlist is empty.</p>
                            <Link to="/" onClick={onClose} className="text-black underline font-bold">Start Shopping</Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {wishlistItems.map(item => (
                                <div key={item.id} className="flex gap-4 animate-slide-up">
                                    <div className="w-24 aspect-[3/4] bg-gray-100 flex-shrink-0">
                                        <img
                                            src={imageHelper(item.images[0])}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-grow flex flex-col justify-between py-1">
                                        <div>
                                            <Link to={`/product/${item.slug}`} onClick={onClose} className="font-bold text-sm hover:text-accent line-clamp-2 mb-1">
                                                {item.name}
                                            </Link>
                                            <div className="text-sm font-semibold">₹{item.price.toFixed(2)}</div>
                                        </div>

                                        <div className="flex gap-3 mt-3">
                                            <button
                                                onClick={() => handleMoveToCart(item)}
                                                className="flex items-center text-xs font-bold uppercase border-b border-black hover:text-accent hover:border-accent transition-colors pb-1"
                                            >
                                                <ShoppingBag size={14} className="mr-1" /> Move to Cart
                                            </button>
                                            <button
                                                onClick={() => removeFromWishlist(item.id)}
                                                className="text-xs text-gray-400 hover:text-red-500 transition-colors pb-1"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WishlistDrawer;
