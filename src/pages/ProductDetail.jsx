import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductBySlug, getRelatedProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { imageHelper } from '../utils/imageHelper';
import { Star, Truck, ShieldCheck, Ruler, Heart } from 'lucide-react';
import ProductCard from '../components/ProductCard';

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

    const calculateStockProgress = () => {
        const total = product.stock + product.sold_count;
        const progress = (product.sold_count / total) * 100;
        return progress;
    };

    return (
        <div className="container mx-auto px-4 py-8">
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
                <div className="lg:col-span-4 bg-gray-100 aspect-[1080/1440] relative overflow-hidden">
                    <img src={imageHelper(product.images[selectedImage])} alt={product.name} className="w-full h-full object-cover" />
                </div>

                {/* Mobile Thumbnails only */}
                <div className="lg:hidden flex gap-3 overflow-x-auto pb-2">
                    {product.images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            className={`border-2 ${selectedImage === idx ? 'border-black' : 'border-transparent'} w-20 h-24 flex-shrink-0 bg-gray-100`}
                        >
                            <img src={imageHelper(img)} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
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

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">
                            <span>Sold: {product.sold_count}</span>
                            <span>Available: {product.stock}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${calculateStockProgress()}%` }}></div>
                        </div>
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

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <div className="flex border border-gray-300 w-full sm:w-32 items-center h-10">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center hover:bg-gray-50">-</button>
                                <input type="text" readOnly value={quantity} className="flex-grow text-center w-full h-full border-x border-gray-300 outline-none" />
                                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center hover:bg-gray-50">+</button>
                            </div>
                            <button
                                onClick={() => handleAddToCart(true)}
                                className="flex-grow bg-black text-white uppercase font-bold tracking-wider hover:bg-gray-800 transition-colors h-10 flex items-center justify-center rounded-sm text-sm"
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={() => {
                                    handleAddToCart(false); // Don't open drawer
                                    navigate('/checkout'); // Direct to checkout
                                }}
                                className="flex-grow bg-white text-black border border-black uppercase font-bold tracking-wider hover:bg-gray-50 transition-colors h-10 flex items-center justify-center rounded-sm text-sm"
                            >
                                Buy Now
                            </button>
                            <button
                                onClick={() => toggleWishlist(product)}
                                className={`w-12 h-10 border flex items-center justify-center transition-colors ${isInWishlist(product.id)
                                    ? 'bg-black text-white border-black'
                                    : 'border-gray-300 hover:border-black text-black'
                                    }`}
                                title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                            >
                                <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                            </button>
                        </div>
                    </div>


                </div>
            </div>

            <div className="max-w-4xl mx-auto mb-16">
                <div className="flex justify-center border-b border-gray-200 mb-8">
                    {['description', 'delivery', 'ask_question'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`mx-6 pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === tab ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
                        >
                            {tab.replace('_', ' ')}
                        </button>
                    ))}
                </div>
                <div className="text-sm text-gray-600 leading-relaxed text-center min-h-[100px]">
                    {activeTab === 'description' && (
                        <p className="max-w-2xl mx-auto">
                            Elevate your wardrobe with this exquisite piece from Leonardi.
                            Crafted with precision and attention to detail, it features premium materials
                            ensuring both durability and style. Perfect for formal occasions or adding a
                            touch of sophistication to your casual look.
                        </p>
                    )}
                    {activeTab === 'delivery' && (
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center"><Truck size={16} className="mr-2" /> Free shipping on orders over ₹2000</div>
                            <div className="flex items-center"><ShieldCheck size={16} className="mr-2" /> 7 Days Easy Return Policy</div>
                        </div>
                    )}
                    {activeTab === 'ask_question' && (
                        <p>Have a question? Contact our support team at info@leonardi.in.</p>
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
