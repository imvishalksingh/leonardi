import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, ChevronRight, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getNavigationTree } from '../services/navigationService';
import { getProducts } from '../services/productService'; // Added getProducts
import { imageHelper } from '../utils/imageHelper'; // Added imageHelper
import { useAuth } from '../context/AuthContext';
import SearchModal from './SearchModal';
import WishlistDrawer from './WishlistDrawer';
import AuthModal from './AuthModal';

const Header = () => {
    const [navTree, setNavTree] = useState([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [expandedCategory, setExpandedCategory] = useState(null);

    // Feature States
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    // Search Data
    const [allProducts, setAllProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const { cartCount, setIsCartOpen } = useCart();
    const { wishlistCount } = useWishlist();
    const { user } = useAuth();

    // Scroll & Transparency Logic
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const isHome = location.pathname === '/';

    useEffect(() => {
        getNavigationTree().then(setNavTree);
        getProducts().then(setAllProducts);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    // Calculate transparency (Temporarily disabled for stability)
    const isTransparent = false; // Forced to false to ensure visibility
    // Helper classes
    const textColorClass = 'text-gray-700'; // Always dark text
    const logoColorClass = 'text-black'; // Always black logo
    const borderColorClass = 'border-gray-100'; // Always visible border

    // Handle Search Input
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim().length > 0) {
            const filtered = allProducts.filter(p =>
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.category.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(filtered.slice(0, 5)); // Limit to 5 results
        } else {
            setSearchResults([]);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
    };

    return (
        <div className="w-full relative z-50">
            {/* ... Top Bar ... */}
            <div className={`bg-black text-white text-center text-xs py-2 tracking-wide relative z-50 transition-all duration-300`}>
                New customers save 10% with the code GET10
            </div>

            <header className={`transition-all duration-300 z-50 w-full border-b sticky top-0 bg-white shadow-sm ${borderColorClass}`}>
                <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

                    {/* LEFT: Menu Toggle & Search Bar */}
                    <div className="flex items-center gap-4 flex-1 justify-start">
                        <button
                            className={`mr-2 transition-colors ${textColorClass}`}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        {/* Desktop Search Bar (Restored & Moved Left) */}
                        <div className="hidden lg:block relative group z-50">
                            <div className={`flex items-center rounded-full px-4 py-2 w-64 transition-colors focus-within:ring-1 focus-within:ring-gray-300 ${isTransparent ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'}`}>
                                <input
                                    type="text"
                                    placeholder="What are you looking for?"
                                    className={`bg-transparent border-none outline-none text-xs flex-grow w-full ${isTransparent ? 'placeholder-white/70 text-white' : 'placeholder-gray-400 text-black'}`}
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                                <Search size={16} className={isTransparent ? 'text-white' : 'text-gray-500'} />
                            </div>

                            {/* Inline Search Results Dropdown */}
                            {searchResults.length > 0 && searchQuery && (
                                <div className="absolute top-full left-0 w-80 bg-white shadow-xl border border-gray-100 rounded-md mt-2 overflow-hidden z-50">
                                    <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                                        Products
                                    </div>
                                    <ul>
                                        {searchResults.map(product => (
                                            <li key={product.id}>
                                                <Link
                                                    to={`/product/${product.slug}`}
                                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                                                    onClick={clearSearch}
                                                >
                                                    <img
                                                        src={imageHelper(product.images[0])}
                                                        alt={product.name}
                                                        className="w-10 h-10 object-cover rounded-md"
                                                    />
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</h4>
                                                        <span className="text-xs text-gray-500">₹{product.price}</span>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Mobile Search Icon (Only visible on small screens) */}
                        <button
                            className={`lg:hidden transition-colors flex items-center gap-2 ${textColorClass}`}
                            onClick={() => {
                                setIsSearchOpen(!isSearchOpen);
                                setIsMobileMenuOpen(false);
                            }}
                        >
                            <Search size={20} />
                        </button>
                    </div>

                    {/* CENTER: Logo */}
                    <div className="flex-1 flex justify-center">
                        <Link to="/" className={`text-2xl md:text-3xl font-serif font-black tracking-widest uppercase transition-colors ${logoColorClass}`}>
                            Leonardi
                        </Link>
                    </div>

                    {/* RIGHT: User, Wishlist, Cart */}
                    <div className="flex items-center justify-end gap-4 flex-1">
                        <button className={`hover:text-accent transition-colors ${textColorClass}`} onClick={() => setIsAuthOpen(true)}>
                            <User size={20} />
                        </button>

                        <button className={`hover:text-accent transition-colors relative ${textColorClass}`} onClick={() => setIsWishlistOpen(true)}>
                            <Heart size={20} />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{wishlistCount}</span>
                            )}
                        </button>

                        <button className={`hover:text-accent transition-colors relative ${textColorClass}`} onClick={() => setIsCartOpen(true)}>
                            <ShoppingBag size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{cartCount}</span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Inline Search */}
                {isSearchOpen && (
                    <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 animate-fade-in shadow-md">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for products..."
                                className="w-full bg-gray-50 border-none rounded-md px-4 py-3 pl-10 text-sm outline-none focus:ring-1 focus:ring-gray-200"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                autoFocus
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            {searchQuery && (
                                <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 bg-gray-200 rounded-full p-0.5">
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Mobile Search Results */}
                        {searchResults.length > 0 && (
                            <div className="mt-4 max-h-[60vh] overflow-y-auto">
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    Products
                                </div>
                                <ul className="space-y-2">
                                    {searchResults.map(product => (
                                        <li key={product.id}>
                                            <Link
                                                to={`/product/${product.slug}`}
                                                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
                                                onClick={() => {
                                                    clearSearch();
                                                    setIsSearchOpen(false);
                                                }}
                                            >
                                                <img
                                                    src={imageHelper(product.images[0])}
                                                    alt={product.name}
                                                    className="w-12 h-12 object-cover rounded-md"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</h4>
                                                    <span className="text-xs text-gray-500">₹{product.price}</span>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {searchQuery && searchResults.length === 0 && (
                            <div className="mt-4 text-center text-gray-400 text-xs py-2">
                                No results found
                            </div>
                        )}
                    </div>
                )}
            </header>

            {/* Mobile Menu (Rothy's Style - Under Header) */}
            <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}>
                <div
                    className={`fixed inset-y-0 left-0 w-full md:w-1/2 bg-white shadow-xl transition-transform duration-300 transform flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Scrollable Navigation Content (Below Header) */}
                    <div className="flex-1 overflow-y-auto pt-[105px]">

                        {/* Drawer Logo (Centered) */}
                        <div className="text-center py-6 border-b border-gray-100 mb-2">
                            <span className="text-2xl font-serif font-black tracking-widest uppercase text-black">
                                MENU
                            </span>
                        </div>

                        <div className="px-0">
                            {navTree.map(item => (
                                <div key={item.id} className="border-b border-gray-100 last:border-none">
                                    <div className="flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <Link
                                            to={item.path || '#'}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex-1 py-5 pl-6 text-left text-sm font-bold uppercase tracking-widest text-gray-900"
                                        >
                                            {item.label}
                                        </Link>

                                        {item.subs && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setExpandedCategory(expandedCategory === item.id ? null : item.id);
                                                }}
                                                className="py-5 pr-6 pl-4 text-gray-900"
                                            >
                                                {/* Plus / Minus Icons for Accordion */}
                                                {expandedCategory === item.id ? (
                                                    <Minus size={20} strokeWidth={1.5} />
                                                ) : (
                                                    <Plus size={20} strokeWidth={1.5} />
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    {/* Submenu */}
                                    <div className={`overflow-hidden transition-all duration-300 bg-gray-50 ${expandedCategory === item.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <ul className="flex flex-col py-2">
                                            {item.subs && item.subs.map(sub => (
                                                <li key={sub.id}>
                                                    <Link
                                                        to={sub.path}
                                                        className="block px-8 py-3 text-sm text-gray-600 hover:text-black hover:font-medium transition-colors border-b border-gray-100 last:border-none"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        {sub.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Extra Links (re-styled) */}
                        <div className="mt-4 px-6 space-y-4 pb-8">
                            <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-sm font-bold uppercase tracking-widest text-gray-900 border-b border-gray-100">
                                Wishlist
                            </Link>
                            <Link to="/stores" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-sm font-bold uppercase tracking-widest text-gray-900 border-b border-gray-100">
                                Stores
                            </Link>
                        </div>

                        {/* Sidebar Footer Buttons (Restored) */}
                        <div className="mt-2 px-6 pb-8 space-y-4 border-t border-gray-100 pt-6">
                            <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-gray-900 hover:text-accent transition-colors group">
                                <User size={20} strokeWidth={1.5} className="group-hover:text-accent" />
                                <span className="text-sm font-bold uppercase tracking-widest">My Account</span>
                            </Link>
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setIsWishlistOpen(true);
                                }}
                                className="flex items-center gap-3 text-gray-900 hover:text-accent transition-colors group w-full text-left"
                            >
                                <Heart size={20} strokeWidth={1.5} className="group-hover:text-accent" />
                                <span className="text-sm font-bold uppercase tracking-widest">Wishlist</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals & Drawers */}
            <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </div>
    );
};

export default Header;
