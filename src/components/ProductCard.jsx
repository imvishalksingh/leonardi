import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Heart } from 'lucide-react';
import { imageHelper } from '../utils/imageHelper';
import { useWishlist } from '../context/WishlistContext';
import QuickViewModal from './QuickViewModal';

const ProductCard = ({ product }) => {
    const { isInWishlist, toggleWishlist } = useWishlist();
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    if (!product) return null;

    // Mock colors if not present in product data
    const colors = product.colors || ['Black', 'Blue', 'Gold'];

    return (
        <>
            <div className="group relative bg-white">
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    <Link to={`/product/${product.slug}`}>
                        <img
                            src={imageHelper(product.images[0])}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {product.images[1] && (
                            <img
                                src={imageHelper(product.images[1])}
                                alt={product.name}
                                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                            />
                        )}
                    </Link>

                    {/* Actions - Top Right */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                        <button
                            className="bg-white text-black p-3 hover:bg-black hover:text-white transition-colors shadow-lg rounded-full"
                            title="Quick View"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsQuickViewOpen(true);
                            }}
                        >
                            <Eye size={18} />
                        </button>
                        <button
                            className={`p-3 transition-colors shadow-lg rounded-full ${isInWishlist(product.id)
                                ? 'bg-black text-white'
                                : 'bg-white text-black hover:bg-black hover:text-white'
                                }`}
                            title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                            onClick={(e) => {
                                e.preventDefault();
                                toggleWishlist(product);
                            }}
                        >
                            <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                        </button>
                    </div>

                    {product.compare_at_price && (
                        <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] uppercase font-bold px-2 py-1 tracking-wider">
                            Sale
                        </span>
                    )}
                </div>

                <div className="pt-4 text-center">
                    <Link to={`/product/${product.slug}`} className="block text-sm text-gray-900 hover:text-accent font-medium line-clamp-2 min-h-[40px] px-2 mb-2">
                        {product.name}
                    </Link>

                    <div className="flex justify-center items-center space-x-2 mb-3">
                        <span className="text-black font-semibold">₹{product.price.toFixed(2)}</span>
                        {product.compare_at_price && (
                            <span className="text-gray-400 text-sm line-through">₹{product.compare_at_price.toFixed(2)}</span>
                        )}
                    </div>

                    {/* Color Swatches */}
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {colors.slice(0, 4).map((color, idx) => (
                            <div
                                key={idx}
                                className="w-3 h-3 rounded-full border border-gray-300"
                                style={{ backgroundColor: color.toLowerCase() }}
                                title={color}
                            ></div>
                        ))}
                        {colors.length > 4 && <span className="text-xs text-gray-400">+</span>}
                    </div>
                </div>
            </div>

            <QuickViewModal
                product={product}
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
            />
        </>
    );
};

export default ProductCard;
