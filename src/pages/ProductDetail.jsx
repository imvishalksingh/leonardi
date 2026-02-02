import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductBySlug, getRelatedProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { imageHelper } from '../utils/imageHelper';
import { Star, Truck, ShieldCheck, Ruler, Heart } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';

const ProductDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('Black');
    const [activeTab, setActiveTab] = useState('description');
    const [showSizeGuide, setShowSizeGuide] = useState(false);

    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);
        getProductBySlug(slug)
            .then(data => {
                setProduct(data);
                // Reset states
                setSelectedImage(0);
                setQuantity(1);
                // Fetch related products
                getRelatedProducts(data.category, data.id).then(setRelatedProducts);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
    if (!product) return <div className="h-screen flex items-center justify-center">Product not found.</div>;

    const handleAddToCart = (openDrawer = true) => {
        addToCart(product, quantity, { size: selectedSize, color: selectedColor, openDrawer });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <SEO
                title={product.name}
                description={`Buy ${product.name} - ₹${product.price}. High quality ${product.category} from Leonardi.`}
                image={imageHelper(product.images[0])}
                type="product"
            />
            <div className="grid lg:grid-cols-12 gap-8 mb-16">
                {/* Thumbnails - Vertical on desktop, Horizontal on mobile */}
                <div className="lg:col-span-1 hidden lg:flex flex-col gap-4">
                    {product.images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            className={`border-2 ${selectedImage === idx ? 'border-black' : 'border-transparent'} w-full aspect-[1080/1440] bg-gray-100`}
                        >
                            <img src={imageHelper(img)} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>

                {/* Main Image */}
                <div className="hidden lg:block lg:col-span-4 bg-gray-100 aspect-[1080/1440] relative overflow-hidden group">
                    <img src={imageHelper(product.images[selectedImage])} alt={product.name} className="w-full h-full object-cover" />
                    {/* Wishlist Button - Top Right */}
                    <button
                        onClick={() => toggleWishlist(product)}
                        className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-md transition-colors ${isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                        title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                        <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                    </button>
                </div>

                {/* Mobile Image Carousel */}
                <div className="lg:hidden w-full relative bg-gray-100 aspect-[3/4]">
                    <div className="flex overflow-x-auto snap-x snap-mandatory w-full h-full no-scrollbar" style={{ scrollbarWidth: 'none' }}>
                        <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                        {product.images.map((img, idx) => (
                            <div key={idx} className="w-full flex-shrink-0 snap-center relative h-full">
                                <img src={imageHelper(img)} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                    {/* Mobile Wishlist Button */}
                    <button
                        onClick={() => toggleWishlist(product)}
                        className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-md transition-colors z-10 ${isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                    >
                        <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                    </button>
                </div>

                {/* Product Info */}
                <div className="lg:col-span-7 space-y-6">
                    <h1 className="text-2xl md:text-3xl font-serif leading-tight">{product.name}</h1>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="text-2xl font-bold">₹{product.price.toFixed(2)}</div>
                        {product.compare_at_price && (
                            <div className="text-gray-400 line-through">₹{product.compare_at_price.toFixed(2)}</div>
                        )}
                        <div className="flex items-center text-yellow-500 text-sm">
                            <Star size={16} fill="currentColor" />
                            <span className="ml-1 text-black font-medium">{product.reviews.rating} ({product.reviews.count} reviews)</span>
                        </div>
                    </div>

                    <div className="bg-red-50 text-red-600 px-4 py-2 text-sm font-medium flex items-center space-x-2 animate-pulse rounded-md">
                        <span>🔥</span>
                        <span>Selling fast! 22 people have this in their carts.</span>
                    </div>

                    <hr className="border-gray-100" />

                    <div className="space-y-4">
                        <div>
                            <span className="text-sm font-bold uppercase tracking-wider mb-2 block">Color: {selectedColor}</span>
                            <div className="flex flex-wrap gap-3">
                                {['Blue', 'Red', 'Black'].map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-black' : 'border-transparent'} ring-1 ring-gray-200`}
                                        style={{ backgroundColor: color.toLowerCase() }}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-bold uppercase tracking-wider">Size: {selectedSize}</span>
                                <button className="text-xs underline flex items-center" onClick={() => setShowSizeGuide(true)}>
                                    <Ruler size={14} className="mr-1" /> Size Guide
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {['S', 'M', 'L', 'XL'].map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-12 h-10 border ${selectedSize === size ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'} transition-colors font-medium text-sm`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 pt-4">
                            {/* Row 1: Quantity + Add to Cart */}
                            <div className="flex gap-4 w-full">
                                <div className="flex border border-gray-300 w-1/2 items-center h-12">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center hover:bg-gray-50">-</button>
                                    <input type="text" readOnly value={quantity} className="flex-grow text-center w-full h-full border-x border-gray-300 outline-none" />
                                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center hover:bg-gray-50">+</button>
                                </div>
                                <button
                                    onClick={() => handleAddToCart(false)}
                                    className="w-1/2 bg-black text-white uppercase font-bold tracking-wider hover:bg-gray-800 transition-colors h-12 flex items-center justify-center rounded-sm text-sm"
                                >
                                    Add to Cart
                                </button>
                            </div>

                            {/* Row 2: Buy Now */}
                            <button
                                onClick={() => {
                                    // Buy Now: Direct checkout with single item, ignoring cart
                                    const buyNowItem = {
                                        ...product,
                                        selectedSize,
                                        selectedColor,
                                        quantity
                                    };
                                    navigate('/checkout', { state: { buyNowItem } });
                                }}
                                className="w-full bg-white text-black border border-black uppercase font-bold tracking-wider hover:bg-gray-50 transition-colors h-12 flex items-center justify-center rounded-sm text-sm"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>


                </div>
            </div>

            <div className="max-w-4xl mx-auto mb-16">
                <div className="flex justify-center mb-8 gap-4">
                    {['description', 'specifications'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-2 text-sm font-bold capitalize rounded-full transition-all shadow-sm ${activeTab === tab
                                ? 'bg-white text-black ring-1 ring-black'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
                    {activeTab === 'description' && (
                        <div className="grid md:grid-cols-2 gap-12 text-left">
                            <div>
                                <h3 className="text-lg font-bold mb-4">About This Product</h3>
                                <ul className="space-y-3 text-sm text-gray-700">
                                    <li className="flex"><span className="font-bold w-32">Item Type:</span> {product.item_type || product.category}</li>
                                    <li className="flex"><span className="font-bold w-32">Pattern:</span> {product.pattern || 'Solid'}</li>
                                    <li className="flex"><span className="font-bold w-32">Material Care:</span> {product.material_care || 'Dry Clean Only'}</li>
                                    <li className="flex"><span className="font-bold w-32">Number of Items:</span> {product.items_count || 1}</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-4">Description</h3>
                                <p className="text-sm text-gray-600 leading-relaxed max-w-xl whitespace-pre-line">
                                    {product.description || `The ${product.name.toLowerCase()} gives you a sophisticated look within seconds. Designed to create a perfect appearance without any difficulty.`}
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'specifications' && (
                        <div className="text-left max-w-2xl mx-auto">
                            <h3 className="text-lg font-bold mb-6 border-b pb-2">Specifications</h3>
                            <div className="space-y-4 text-sm">
                                {product.specifications ? (
                                    Object.entries(product.specifications).map(([key, value]) => (
                                        <div key={key} className="grid grid-cols-3 pb-2 border-b border-gray-50">
                                            <span className="font-bold">{key}</span>
                                            <span className="col-span-2 text-gray-600">{value}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-gray-500 italic">No specifications available.</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {relatedProducts.length > 0 && (
                <div className="mt-16 border-t border-gray-100 pt-12">
                    <h2 className="text-2xl font-serif font-bold text-center mb-8">You May Also Like</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {relatedProducts.map(rp => (
                            <ProductCard key={rp.id} product={rp} />
                        ))}
                    </div>
                </div>
            )}

            {showSizeGuide && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white p-6 max-w-lg w-full relative animate-fade-in">
                        <button onClick={() => setShowSizeGuide(false)} className="absolute top-4 right-4 font-bold text-xl">&times;</button>
                        <h3 className="text-xl font-bold uppercase mb-4 text-center">Size Guide</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="border p-2">Size</th>
                                        <th className="border p-2">Bust (in)</th>
                                        <th className="border p-2">Waist (in)</th>
                                        <th className="border p-2">Low Hip (in)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td className="border p-2">S</td><td className="border p-2">32-34</td><td className="border p-2">26-28</td><td className="border p-2">36-38</td></tr>
                                    <tr><td className="border p-2">M</td><td className="border p-2">34-36</td><td className="border p-2">28-30</td><td className="border p-2">38-40</td></tr>
                                    <tr><td className="border p-2">L</td><td className="border p-2">36-38</td><td className="border p-2">30-32</td><td className="border p-2">40-42</td></tr>
                                    <tr><td className="border p-2">XL</td><td className="border p-2">38-40</td><td className="border p-2">32-34</td><td className="border p-2">42-44</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
