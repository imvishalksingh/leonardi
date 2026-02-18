import React, { useState } from 'react';
import { Eye, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { imageHelper } from '../utils/imageHelper';
import { Link } from 'react-router-dom';

const QuickViewModal = ({ product, isOpen, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    if (!isOpen || !product) return null;

    const price = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;
    const colorName = product.color?.name || 'Black';
    const colorCode = product.color?.code || colorName.toLowerCase();
    const sizeName = product.size || '';

    const handleAddToCart = () => {
        addToCart(product, quantity, { size: sizeName, color: colorName, openDrawer: false });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white w-full max-w-4xl relative shadow-2xl animate-fade-in flex flex-col md:flex-row overflow-hidden max-h-[90vh] md:h-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-black hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Image Section */}
                <div className="md:w-1/2 bg-gray-100 aspect-[3/4] md:aspect-auto relative">
                    <img
                        src={imageHelper(product.images[0])}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Details Section */}
                <div className="md:w-1/2 p-8 flex flex-col justify-center overflow-y-auto">
                    <h2 className="text-2xl font-serif font-bold mb-2">{product.name}</h2>
                    <div className="text-xl font-bold mb-6">₹{price.toFixed(2)}</div>

                    <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                        {product.description || 'Elevate your wardrobe with this exquisite piece. Crafted with precision and attention to detail, it features premium materials ensuring both durability and style.'}
                    </p>

                    <div className="space-y-4 mb-8">
                        {/* Color */}
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider mb-2 block">Color: {colorName}</span>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    className="w-6 h-6 rounded-full border-2 border-black ring-1 ring-gray-200"
                                    style={{ backgroundColor: colorCode }}
                                />
                            </div>
                        </div>

                        {/* Size */}
                        {sizeName && (
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider mb-2 block">Size: {sizeName}</span>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        className="px-3 h-8 border text-xs font-medium bg-black text-white border-black"
                                    >
                                        {sizeName}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <div className="flex border border-gray-300 w-24 items-center h-10 px-3 justify-between">
                            <span className="font-bold text-sm w-8 text-center">{quantity}</span>
                            <div className="flex flex-col border-l border-gray-300 h-full">
                                <button onClick={() => setQuantity(quantity + 1)} className="px-1 h-5 flex items-center justify-center hover:bg-gray-50 border-b border-gray-300">
                                    <ChevronUp size={12} />
                                </button>
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-1 h-5 flex items-center justify-center hover:bg-gray-50">
                                    <ChevronDown size={12} />
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            className="flex-grow bg-black text-white uppercase font-bold text-sm tracking-wider hover:bg-accent transition-colors h-10 flex items-center justify-center"
                        >
                            Add to Cart
                        </button>
                    </div>

                    <Link to={`/product/${product.slug}`} onClick={onClose} className="text-center text-xs underline mt-4 text-gray-500 hover:text-black">
                        View Full Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default QuickViewModal;
