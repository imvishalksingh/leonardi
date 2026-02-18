import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductBySlug, getRelatedProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { imageHelper } from '../utils/imageHelper';
import { Star, Truck, ShieldCheck, Ruler, Heart, ChevronUp, ChevronDown } from 'lucide-react';
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
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [activeTab, setActiveTab] = useState('description');
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const [activeMobileImage, setActiveMobileImage] = useState(0);

    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();

    const handleScroll = (e) => {
        const scrollLeft = e.target.scrollLeft;
        const width = e.target.offsetWidth;
        const index = Math.round(scrollLeft / width);
        setActiveMobileImage(index);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);
        getProductBySlug(slug)
            .then(data => {
                setProduct(data);
                // Reset states
                setSelectedImage(0);
                setQuantity(1);
                // Set default color from product data
                if (data?.color?.name) {
                    setSelectedColor(data.color.name);
                } else {
                    setSelectedColor('');
                }
                // Set default size
                setSelectedSize(data?.size || '');
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

    const price = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;
    const comparePrice = product.compare_at_price
        ? (typeof product.compare_at_price === 'number' ? product.compare_at_price : parseFloat(product.compare_at_price))
        : null;

    // Build specifications from API data
    const specifications = {};
    if (product.material) specifications['Material'] = product.material;
    if (product.pattern) specifications['Pattern'] = product.pattern;
    if (product.occasion) specifications['Occasion'] = product.occasion;
    if (product.dimensions?.length) specifications['Length'] = product.dimensions.length;
    if (product.dimensions?.breadth) specifications['Breadth'] = product.dimensions.breadth;
    if (product.size) specifications['Size'] = product.size;
    if (product.sku) specifications['SKU'] = product.sku;
    if (product.color?.name) specifications['Color'] = product.color.name;

    const reviews = product.reviews || { rating: 4.5, count: 0 };

    return (
        <div className="container mx-auto px-4 py-8">
            <SEO
                title={product.name}
                description={`Buy ${product.name} - ₹${price}. High quality ${product.category} from Leonardi.`}
                image={imageHelper(product.images[0])}
                type="product"
            />
            <div className="grid lg:grid-cols-12 gap-8 mb-16">
                {/* Thumbnails - Vertical on desktop */}
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
                    {/* Wishlist Button - Bottom Right */}
                    <button
                        onClick={() => toggleWishlist(product)}
                        className={`absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-md transition-colors ${isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                        title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                        <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                    </button>
                </div>

                {/* Mobile Image Carousel */}
                <div className="lg:hidden w-full relative bg-gray-100 aspect-[3/4] group">
                    <div
                        className="flex overflow-x-auto snap-x snap-mandatory w-full h-full no-scrollbar"
                        style={{ scrollbarWidth: 'none' }}
                        onScroll={handleScroll}
                    >
                        <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                        {product.images.map((img, idx) => (
                            <div key={idx} className="w-full flex-shrink-0 snap-center relative h-full">
                                <img src={imageHelper(img)} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>

                    {/* Scroll Indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                        {product.images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-colors duration-300 ${activeMobileImage === idx ? 'bg-[#C19A6B]' : 'bg-gray-300/80'}`}
                            ></div>
                        ))}
                    </div>

                    {/* Mobile Wishlist Button */}
                    <button
                        onClick={() => toggleWishlist(product)}
                        className={`absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-md transition-colors z-10 ${isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                    >
                        <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                    </button>
                </div>

                {/* Product Info */}
                <div className="lg:col-span-7 space-y-6">
                    <h1 className="text-2xl md:text-3xl font-serif leading-tight">{product.name}</h1>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="text-2xl font-bold">₹{price.toFixed(2)}</div>
                        {comparePrice && comparePrice > price && (
                            <div className="text-gray-400 line-through">₹{comparePrice.toFixed(2)}</div>
                        )}
                        {reviews.count > 0 && (
                            <div className="flex items-center text-yellow-500 text-sm">
                                <Star size={16} fill="currentColor" />
                                <span className="ml-1 text-black font-medium">{reviews.rating} ({reviews.count} reviews)</span>
                            </div>
                        )}
                    </div>

                    <div className="bg-red-50 text-red-600 px-4 py-2 text-sm font-medium flex items-center space-x-2 animate-pulse rounded-md">
                        <span>🔥</span>
                        <span>Selling fast! 22 people have this in their carts.</span>
                    </div>

                    <hr className="border-gray-100" />

                    <div className="space-y-4">
                        {/* Color - from API data */}
                        {product.color && (
                            <div>
                                <span className="text-sm font-bold uppercase tracking-wider mb-2 block">Color: {selectedColor || product.color.name}</span>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        className={`w-8 h-8 rounded-full border-2 border-black ring-1 ring-gray-200`}
                                        style={{ backgroundColor: product.color.code || product.color.name?.toLowerCase() }}
                                        title={product.color.name}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Size - from API data */}
                        {product.size && (
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-bold uppercase tracking-wider">Size: {product.size}</span>
                                    <button className="text-xs underline flex items-center" onClick={() => setShowSizeGuide(true)}>
                                        <Ruler size={14} className="mr-1" /> Size Guide
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        className="px-4 h-10 border bg-black text-white border-black transition-colors font-medium text-sm"
                                    >
                                        {product.size}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-4 pt-4">
                            {/* Row 1: Quantity + Add to Cart */}
                            <div className="flex gap-4 w-full">
                                <div className="flex border border-gray-300 w-1/2 items-center h-12 px-4 justify-between">
                                    <span className="font-bold text-lg">{quantity}</span>
                                    <div className="flex flex-col border-l border-gray-300 h-full">
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="px-2 h-6 flex items-center justify-center hover:bg-gray-50 border-b border-gray-300"
                                        >
                                            <ChevronUp size={14} />
                                        </button>
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-2 h-6 flex items-center justify-center hover:bg-gray-50"
                                        >
                                            <ChevronDown size={14} />
                                        </button>
                                    </div>
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
                                    const buyNowItem = {
                                        ...product,
                                        selectedSize: selectedSize || product.size,
                                        selectedColor: selectedColor || product.color?.name,
                                        quantity
                                    };
                                    navigate('/checkout', { state: { buyNowItem } });
                                }}
                                className="w-full bg-[#C19A6B] text-white border border-[#C19A6B] uppercase font-bold tracking-wider hover:bg-[#a6855b] transition-colors h-12 flex items-center justify-center rounded-sm text-sm"
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
                                    <li className="flex"><span className="font-bold w-32">Material:</span> {product.material || 'N/A'}</li>
                                    <li className="flex"><span className="font-bold w-32">Material Care:</span> {product.material_care || 'Dry Clean Only'}</li>
                                    {product.occasion && (
                                        <li className="flex"><span className="font-bold w-32">Occasion:</span> {product.occasion}</li>
                                    )}
                                    {product.color?.name && (
                                        <li className="flex"><span className="font-bold w-32">Color:</span> {product.color.name}</li>
                                    )}
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
                                {Object.keys(specifications).length > 0 ? (
                                    Object.entries(specifications).map(([key, value]) => (
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
