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
                <div className="lg:col-span-7 space-y-8">
                    <div>
                        <h1 className="text-3xl font-serif text-gray-900 mb-2">{product.name}</h1>
                        <div className="flex items-center gap-4">
                            <span className="text-xl font-bold">₹{price.toFixed(2)}</span>
                            {/* Rating */}
                            <div className="flex items-center text-yellow-500 text-sm">
                                <Star size={16} fill="currentColor" />
                                <span className="ml-1 text-gray-500 font-medium">4.5 (28 reviews)</span>
                            </div>
                        </div>
                    </div>

                    {/* Color Selector */}
                    {product.color && product.color.name && (
                        <div>
                            <p className="text-sm font-bold uppercase mb-3 text-gray-700">COLOR: {selectedColor || product.color.name}</p>
                            <div className="flex gap-3">
                                {/* Assuming product might have color options in future, but for now showing the single product color or a preset list if available */}
                                {/* Mocking a few colors for visual match if data implies, otherwise just the product color */}
                                <button
                                    className={`w-8 h-8 rounded-full border border-gray-300 ring-2 ring-offset-2 ${selectedColor === product.color.name ? 'ring-black' : 'ring-transparent'}`}
                                    style={{ backgroundColor: product.color.code || product.color.name?.toLowerCase() }}
                                    onClick={() => setSelectedColor(product.color.name)}
                                    title={product.color.name}
                                />
                                {/* Example mock colors to match screenshot aesthetic (Red, Blue, Black) if strictly requested, 
                                    but sticking to data is safer. If product has variants, they should be mapped here. 
                                    For now, displaying the current product color. */}
                            </div>
                        </div>
                    )}

                    {/* Size Selector */}
                    {product.size && (
                        <div>
                            <div className="flex items-center justify-between max-w-md mb-3">
                                <p className="text-sm font-bold uppercase text-gray-700">SIZE: {selectedSize || product.size}</p>
                                <button
                                    onClick={() => setShowSizeGuide(true)}
                                    className="text-gray-500 text-xs flex items-center hover:text-black transition-colors"
                                >
                                    <Ruler size={14} className="mr-1" /> Size Guide
                                </button>
                            </div>
                            <div className="flex gap-3">
                                {['S', 'M', 'L', 'XL'].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-10 h-10 flex items-center justify-center border text-sm font-medium transition-all
                                            ${selectedSize === size
                                                ? 'border-black bg-black text-white'
                                                : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity and Buttons */}
                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex flex-col gap-5 max-w-xl">
                            {/* Quantity Row */}
                            <div className="flex items-center gap-4">
                                <div className="border border-gray-300 rounded-sm flex items-center h-10 w-32">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="flex-1 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 text-lg"
                                    >
                                        -
                                    </button>
                                    <div className="flex-1 h-full flex items-center justify-center font-bold text-gray-900">
                                        {quantity}
                                    </div>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="flex-1 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 text-lg"
                                    >
                                        +
                                    </button>
                                </div>
                                {/* Green Check icon as seen in design */}
                                <div className="text-green-600">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleAddToCart(true)}
                                    className="bg-black text-white h-12 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-sm"
                                >
                                    Add to Cart
                                </button>
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
                                    className="bg-[#C19A6B] text-white h-12 text-sm font-bold uppercase tracking-widest hover:bg-[#a6855b] transition-colors shadow-sm"
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Trust Badges - 5 Icons */}
                    <div className="grid grid-cols-5 gap-2 max-w-xl py-6">
                        <div className="flex flex-col items-center text-center">
                            <img src="/assets/authority_1.webp" alt="Since 2003" className="h-12 w-auto object-contain mb-2" />
                            <span className="text-[10px] uppercase font-bold text-gray-600 leading-tight">Since<br />2003</span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <img src="/assets/authority_2.webp" alt="Secure Payment" className="h-12 w-auto object-contain mb-2" />
                            <span className="text-[10px] uppercase font-bold text-gray-600 leading-tight">Secure<br />Payment</span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <img src="/assets/authority_3.webp" alt="Free Delivery" className="h-12 w-auto object-contain mb-2" />
                            <span className="text-[10px] uppercase font-bold text-gray-600 leading-tight">Free<br />Delivery</span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <img src="/assets/authority_4.webp" alt="3-5 Days Delivery" className="h-12 w-auto object-contain mb-2" />
                            <span className="text-[10px] uppercase font-bold text-gray-600 leading-tight">3-5 Days<br />Delivery</span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <img src="/assets/authority_5.webp" alt="Easy Return" className="h-12 w-auto object-contain mb-2" />
                            <span className="text-[10px] uppercase font-bold text-gray-600 leading-tight">Easy<br />Return</span>
                        </div>
                    </div>

                    {/* Description Paragraph */}
                    <div className="border-t border-gray-100 pt-6">
                        <p className="text-gray-600 text-sm leading-7 mb-6">
                            {product.description || `Luxurious fine wool stole in deep red with a contrasting silk border. Jacquard is the technique used in weaving this stole, giving it a luxurious and elegant feel. The fine wool blended with silk gives it an ultra soft & elegant feel.`}
                        </p>

                        <ul className="space-y-2 text-sm text-gray-700">
                            {/* Bullet points mimicking the screenshot style */}
                            {product.material && (
                                <li className="flex items-start">
                                    <span className="mr-2 text-black">•</span>
                                    {product.material} {product.item_type ? `- ${product.item_type}` : ''}
                                </li>
                            )}
                            <li className="flex items-start">
                                <span className="mr-2 text-black">•</span>
                                Self fringed
                            </li>
                            {product.dimensions && (
                                <li className="flex items-start">
                                    <span className="mr-2 text-black">•</span>
                                    {product.dimensions.length} x {product.dimensions.breadth} cm
                                </li>
                            )}
                            <li className="flex items-start">
                                <span className="mr-2 text-black">•</span>
                                Care : {product.material_care || 'Dry clean only, warm iron'}
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-black">•</span>
                                Packing : Each piece comes with our muslin cotton bag
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-black">•</span>
                                Made in India with Love ♥
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* This div was the tabs container - removing consistent with "Window view" screenshot implementation */}
            <div className="hidden">
                {/* Preserving hidden if we ever want to revert, effectively "deleting" from view */}
                {/* ... old tabs code ... */}
            </div>

            {/* Related Products */}
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
