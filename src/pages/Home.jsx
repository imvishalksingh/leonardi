import React, { useEffect, useState } from 'react';
import { getProducts, getProductsByCategory } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { Link, useParams } from 'react-router-dom';
import { imageHelper } from '../utils/imageHelper';
import HeroCarousel from '../components/HeroCarousel';
import SEO from '../components/SEO';

const Home = () => {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('best_sellers');

    // Filter Logic State
    const [sortBy, setSortBy] = useState('featured');
    const [priceRange, setPriceRange] = useState('all');
    const [availability, setAvailability] = useState('all');
    const [selectedColor, setSelectedColor] = useState('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false); // Mobile filter toggle

    useEffect(() => {
        setLoading(true);
        if (category) {
            getProductsByCategory(category).then((data) => {
                setProducts(data);
                setLoading(false);
            });
        } else {
            getProducts().then((data) => {
                setProducts(data);
                setLoading(false);
            });
        }
    }, [category]);

    // Derived Filtered Products
    const filteredProducts = products.filter(product => {
        // Price Filter
        if (priceRange !== 'all') {
            if (priceRange === '0-500' && product.price > 500) return false;
            if (priceRange === '500-1000' && (product.price < 500 || product.price > 1000)) return false;
            if (priceRange === '1000+' && product.price < 1000) return false;
        }
        // Availability Filter
        if (availability === 'in-stock' && product.stock <= 0) return false;
        if (availability === 'out-of-stock' && product.stock > 0) return false;

        // Color Filter
        if (selectedColor !== 'all') {
            const colorMatch = product.name.toLowerCase().includes(selectedColor.toLowerCase()) ||
                (product.slug && product.slug.includes(selectedColor.toLowerCase()));
            if (!colorMatch) return false;
        }

        return true;
    }).sort((a, b) => {
        if (sortBy === 'price-low-high') return a.price - b.price;
        if (sortBy === 'price-high-low') return b.price - a.price;
        return 0; // Featured / Default
    });


    const categories = [
        { name: 'Brooch', image: 'cat-brooch.png', link: '/collection/brooch' },
        { name: 'Belt', image: 'cat-belt.png', link: '/collection/belt' },
        { name: 'Tie Pin', image: 'cat-tie-pin.png', link: '/collection/tie-pin' },
        { name: 'Suspender', image: 'cat-suspender.png', link: '/collection/suspender' },
    ];

    const renderProductGrid = (items = products) => (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );

    const renderProductSlider = (items = products) => (
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scroll-snap-x">
            {items.map(product => (
                <div key={product.id} className="w-[85%] md:w-[40%] lg:w-[calc(25%-18px)] flex-shrink-0 scroll-snap-align-start">
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );

    // If viewing a specific collection
    if (category) {
        return (
            <div className="container mx-auto px-4 py-8 min-h-screen">
                <SEO
                    title={`${category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Collection`}
                    description={`Shop the exclusive ${category.replace(/-/g, ' ')} collection at Leonardi. Premium accessories for the modern wardrobe.`}
                />
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-serif font-bold uppercase tracking-widest mb-2">
                        {category.replace('-', ' ')} Collection
                    </h1>
                    <div className="w-16 h-1 bg-accent mx-auto"></div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filter Sidebar */}
                    <div className={`lg:w-1/4 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
                        <div className="sticky top-24 space-y-8 bg-white p-6 border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center lg:hidden mb-4">
                                <span className="font-bold text-lg">Filters</span>
                                <button onClick={() => setIsFilterOpen(false)} className="text-gray-500">&times;</button>
                            </div>

                            {/* Sort By */}
                            <div>
                                <h3 className="font-bold uppercase text-sm mb-3 tracking-wider border-b pb-2">Sort By</h3>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full p-2 border border-gray-300 text-sm focus:border-black outline-none"
                                >
                                    <option value="featured">Featured</option>
                                    <option value="price-low-high">Price: Low to High</option>
                                    <option value="price-high-low">Price: High to Low</option>
                                </select>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h3 className="font-bold uppercase text-sm mb-3 tracking-wider border-b pb-2">Price</h3>
                                <div className="space-y-2">
                                    {['all', '0-500', '500-1000', '1000+'].map(range => (
                                        <label key={range} className="flex items-center space-x-2 cursor-pointer group">
                                            <div className={`w-4 h-4 border flex items-center justify-center ${priceRange === range ? 'border-black bg-black' : 'border-gray-300'}`}>
                                                {priceRange === range && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                            </div>
                                            <input
                                                type="radio"
                                                name="price"
                                                value={range}
                                                checked={priceRange === range}
                                                onChange={() => setPriceRange(range)}
                                                className="hidden"
                                            />
                                            <span className="text-sm text-gray-600 group-hover:text-black capitalize">
                                                {range === 'all' ? 'All Prices' : range.includes('+') ? `Above ₹${range.replace('+', '')}` : `₹${range}`}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Availability */}
                            <div>
                                <h3 className="font-bold uppercase text-sm mb-3 tracking-wider border-b pb-2">Availability</h3>
                                <div className="space-y-2">
                                    {['all', 'in-stock', 'out-of-stock'].map(status => (
                                        <label key={status} className="flex items-center space-x-2 cursor-pointer group">
                                            <div className={`w-4 h-4 border flex items-center justify-center ${availability === status ? 'border-black bg-black' : 'border-gray-300'}`}>
                                                {availability === status && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                            </div>
                                            <input
                                                type="radio"
                                                name="availability"
                                                value={status}
                                                checked={availability === status}
                                                onChange={() => setAvailability(status)}
                                                className="hidden"
                                            />
                                            <span className="text-sm text-gray-600 group-hover:text-black capitalize">{status.replace(/-/g, ' ')}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Color */}
                            <div>
                                <h3 className="font-bold uppercase text-sm mb-3 tracking-wider border-b pb-2">Color</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['all', 'Black', 'Blue', 'Green', 'Gold', 'Silver', 'Red', 'Pink', 'Brown'].map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${selectedColor === color ? 'border-black scale-110' : 'border-transparent ring-1 ring-gray-200'}`}
                                            title={color}
                                            style={color !== 'all' ? { backgroundColor: color.toLowerCase() } : {}}
                                        >
                                            {color === 'all' && <span className="text-[10px] font-bold">ALL</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid Area */}
                    <div className="lg:w-3/4">
                        <div className="lg:hidden mb-4">
                            <button onClick={() => setIsFilterOpen(true)} className="w-full border border-black py-2 uppercase font-bold text-sm tracking-wider">
                                Filter & Sort
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">Loading...</div>
                        ) : filteredProducts.length > 0 ? (
                            <>
                                <div className="mb-4 text-sm text-gray-500">Showing {filteredProducts.length} results</div>
                                {renderProductGrid(filteredProducts)}
                            </>
                        ) : (
                            <div className="text-center py-12 text-gray-500 bg-gray-50">
                                <p className="mb-2 text-lg">No products match your filters.</p>
                                <button
                                    onClick={() => {
                                        setPriceRange('all');
                                        setAvailability('all');
                                        setSelectedColor('all');
                                    }}
                                    className="text-black underline text-sm"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Responsive Limit Logic for Featured Products
    const [limit, setLimit] = useState(8);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const updateLimit = () => {
            const width = window.innerWidth;
            if (width < 768) setLimit(4); // 2 rows of 2 cols
            else if (width < 1024) setLimit(6); // 2 rows of 3 cols
            else setLimit(8); // 2 rows of 4 cols
        };

        updateLimit(); // Initial calculation
        window.addEventListener('resize', updateLimit);
        return () => window.removeEventListener('resize', updateLimit);
    }, []);

    // Standard Home Page
    return (
        <div className="space-y-12 pb-16">
            <SEO
                title="Premium Fashion & Accessories"
                description="Discover Leonardi's exquisite collection of brooches, neckties, belts, and more. Handcrafted luxury for discerning tastes."
            />
            <section className="container mx-auto px-4">
                <HeroCarousel />
            </section>

            <section className="container mx-auto px-4">
                <h2 className="text-xl font-bold text-center mb-8 uppercase tracking-widest">Shop By Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map((cat, idx) => (
                        <Link key={idx} to={cat.link} className="group relative aspect-square overflow-hidden block bg-gray-100">
                            <img
                                src={imageHelper(cat.image)}
                                alt={cat.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                            <div className="absolute inset-0 flex items-end justify-center pb-6">
                                <span className="bg-white text-black px-6 py-2 text-xs uppercase font-bold tracking-wider hover:bg-black hover:text-white transition-colors cursor-pointer">
                                    {cat.name}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold uppercase tracking-widest">Featured Products</h2>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-sm border-b border-black hover:text-accent hover:border-accent"
                    >
                        {isExpanded ? 'View Less' : 'View All'}
                    </button>
                    {/* fallback link if needed: <Link to="/collection/all" ...>View All</Link> */}
                </div>
                {renderProductGrid(isExpanded ? products : products.slice(0, limit))}
            </section>

            {/* <section className="bg-gray-50 py-12">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
                    <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
                        <img
                            src={imageHelper('perfect-fit.png')}
                            alt="The Perfect Fit"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-3xl font-serif">The Perfect Fit</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Discover our range of premium accessories designed to elevate your style.
                            From handcrafted belts to exquisite brooches, every piece tells a story.
                        </p>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase">
                                <span>Available: 15</span>
                                <span>Sold: 45</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-accent w-3/4"></div>
                            </div>
                        </div>

                        <button className="border border-black px-8 py-3 uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-colors">
                            Shop Collection
                        </button>
                    </div>
                </div>
            </section> */}

            <section className="container mx-auto px-4">
                <div className="flex justify-center space-x-8 mb-8 border-b border-gray-100">
                    {['best_sellers', 'on_sale', 'new_arrivals'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === tab
                                ? 'border-black text-black'
                                : 'border-transparent text-gray-400 hover:text-black'
                                }`}
                        >
                            {tab.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                <div className="transition-opacity duration-500 animate-fade-in relative group">
                    {/* Active Tab Content with Slider */}
                    {activeTab === 'best_sellers' && renderProductSlider(products)}

                    {activeTab === 'on_sale' && (
                        <div className="text-center py-10 text-gray-500">No items currently on sale.</div>
                    )}

                    {activeTab === 'new_arrivals' && renderProductSlider(products.slice(0, 5))}
                </div>
            </section>
        </div>
    );
};

export default Home;
