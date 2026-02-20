import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, Heart, User } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const BottomNav = ({ onOpenMenu, onOpenWishlist, onOpenAuth }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { wishlistCount } = useWishlist();
    const { cartCount, setIsCartOpen } = useCart();
    const { user } = useAuth(); // Get user state

    const isActive = (path) => location.pathname === path;

    const handleAccountClick = () => {
        if (user) {
            navigate('/account');
        } else {
            onOpenAuth();
        }
    };

    const handleHomeClick = (e) => {
        if (isActive('/')) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-6 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-[40] flex justify-between items-center safe-area-bottom">
            <Link
                to="/"
                onClick={handleHomeClick}
                className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-black' : 'text-gray-400'}`}
            >
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

            <button
                onClick={handleAccountClick}
                className={`flex flex-col items-center gap-1 focus:outline-none ${isActive('/account') ? 'text-black' : 'text-gray-400'}`}
            >
                <User size={20} className={isActive('/account') ? 'fill-black' : ''} />
                <span className="text-[10px] uppercase font-bold tracking-wider">Account</span>
            </button>
        </div>
    );
};

export default BottomNav;
