import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Heart, User } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const BottomNav = ({ onOpenMenu, onOpenWishlist, onOpenAuth }) => {
    const location = useLocation();
    const { wishlistCount } = useWishlist();
    const { cartCount, setIsCartOpen } = useCart(); // Use Cart Context

    const isActive = (path) => location.pathname === path;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-6 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-[40] flex justify-between items-center safe-area-bottom">
            <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-black' : 'text-gray-400'}`}>
                <Home size={20} className={isActive('/') ? 'fill-black' : ''} />
                <span className="text-[10px] uppercase font-bold tracking-wider">Home</span>
            </Link>

            <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center gap-1 text-gray-400 focus:outline-none relative">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full border border-white">
                        {cartCount}
                    </span>
                )}
                <span className="text-[10px] uppercase font-bold tracking-wider">Cart</span>
            </button>

            <button onClick={onOpenWishlist} className="flex flex-col items-center gap-1 text-gray-400 focus:outline-none relative">
                <Heart size={20} />
                {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full border border-white">
                        {wishlistCount}
                    </span>
                )}
                <span className="text-[10px] uppercase font-bold tracking-wider">Wishlist</span>
            </button>

            <button onClick={onOpenAuth} className="flex flex-col items-center gap-1 text-gray-400 focus:outline-none">
                <User size={20} />
                <span className="text-[10px] uppercase font-bold tracking-wider">Account</span>
            </button>
        </div>
    );
};

export default BottomNav;
