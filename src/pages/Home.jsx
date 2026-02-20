import React, { useEffect, useState } from 'react';
import { getProducts, getProductsByCategory, getProductsByFlag, getCategories } from '../services/productService';
import { slugify } from '../services/categoryStore';
import ProductCard from '../components/ProductCard';
import { Link, useParams } from 'react-router-dom';
import { imageHelper } from '../utils/imageHelper';
import HeroCarousel from '../components/HeroCarousel';
import SEO from '../components/SEO';
import { X, Check, ChevronDown, ChevronUp } from 'lucide-react';

import Footer from '../components/Footer';

const Home = () => {
    const { category, subcategory } = useParams();
    const [products, setProducts] = useState([]);
    const [activeCategoryData, setActiveCategoryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('best_sellers');
    const [tabProducts, setTabProducts] = useState({ best_sellers: [], on_sale: [], new_arrivals: [] });

    // Filter Logic State
    const [sortBy, setSortBy] = useState('featured');
    const [priceRange, setPriceRange] = useState('all');
    const [availability, setAvailability] = useState('all');
    const [selectedColor, setSelectedColor] = useState('all');

    // New Filters for Neckties
    const [selectedQuality, setSelectedQuality] = useState('all');
    const [selectedSize, setSelectedSize] = useState('all');
    const [selectedPattern, setSelectedPattern] = useState('all');

    const [isFilterOpen, setIsFilterOpen] = useState(false); // Mobile filter toggle
    const [isSortOpen, setIsSortOpen] = useState(false); // Mobile sort toggle
    const [openAccordion, setOpenAccordion] = useState('Sort By'); // For mobile filter accordion

    // Responsive Limit Logic for Featured Products
    const [limit, setLimit] = useState(8);
    const [isExpanded, setIsExpanded] = useState(false);


    // Dynamic filter options derived from products
    const [filterOptions, setFilterOptions] = useState({
        colors: [],
        qualities: [],
        sizes: [],
        patterns: [],
    });

    // Toggle Accordion Helper
    const toggleAccordion = (section) => {
        setOpenAccordion(openAccordion === section ? null : section);
    };

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

    useEffect(() => {
        if (category && window.innerWidth < 1024) {
            // Optional: Lock body scroll if needed
        }
        if (isFilterOpen || isSortOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isFilterOpen, isSortOpen, category]);

    // Fetch products and Category Data
    useEffect(() => {
        setLoading(true);

        // 1. Fetch Products
        if (category) {
            getProductsByCategory(category, subcategory || null).then((data) => {
                setProducts(data);
                setLoading(false);
            });

            // 2. Fetch Category Meta Data for SEO
            getCategories().then(allCategories => {
                if (!allCategories) return;

                // Find top-level category
                let matched = allCategories.find(c =>
                    (c.slug === category) || (slugify(c.title || c.name || '') === category)
                );

                // If subcategory exists, drill down
                if (subcategory && matched && matched.subcategories) {
                    matched = matched.subcategories.find(s =>
                        (s.slug === subcategory) || (slugify(s.title || s.name || '') === subcategory)
                    );
                }

                setActiveCategoryData(matched);
            });

        } else {
            getProducts().then((data) => {
                setProducts(data);
                setLoading(false);
            });
            setActiveCategoryData(null);
        }
    }, [category, subcategory]);

    // Static Categories
    const STATIC_CATEGORIES = [
        { name: 'Pocket Square', image: '/assets/pocket-square.webp', link: '/collection/pocket-square' },
        { name: 'Necktie', image: '/assets/necktie.webp', link: '/collection/necktie' },
        { name: 'Tie pin', image: '/assets/tie-pin.webp', link: '/collection/tie-pin' },
        { name: 'Bowtie', image: '/assets/bowtie.webp', link: '/collection/bowtie' },
        { name: 'Lapel pin', image: '/assets/lapel-pin.webp', link: '/collection/lapel-pin' },
        { name: 'Brooch', image: '/assets/brooch.webp', link: '/collection/brooch' },
        { name: 'Cufflink', image: '/assets/cufflink.webp', link: '/collection/cufflink' },
        { name: 'Cravat', image: '/assets/cravat.webp', link: '/collection/cravat' },
    ];


    // Fetch tab products (best sellers, on sale, new arrivals)
    useEffect(() => {
        Promise.all([
            getProductsByFlag('best_seller'),
            getProductsByFlag('on_sale'),
            getProductsByFlag('new_arrival'),
        ]).then(([bestSellers, onSale, newArrivals]) => {
            setTabProducts({ best_sellers: bestSellers, on_sale: onSale, new_arrivals: newArrivals });
        });
    }, []);

    // Derive filter options from loaded products
    useEffect(() => {
        if (products.length === 0) return;

        const colors = [...new Set(products.filter(p => p.color?.name).map(p => p.color.name))];
        const qualities = [...new Set(products.filter(p => p.material).map(p => p.material))];
        const sizes = [...new Set(products.filter(p => p.size).map(p => p.size))];
        const patterns = [...new Set(products.filter(p => p.pattern).map(p => p.pattern))];

        setFilterOptions({ colors, qualities, sizes, patterns });
    }, [products]);

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
            const colorMatch = product.color?.name?.toLowerCase() === selectedColor.toLowerCase() ||
                product.name.toLowerCase().includes(selectedColor.toLowerCase());
            if (!colorMatch) return false;
        }

        // Quality (Material) Filter
        if (selectedQuality !== 'all') {
            if (!product.material || product.material !== selectedQuality) return false;
        }

        // Size Filter
        if (selectedSize !== 'all') {
            if (!product.size || product.size !== selectedSize) return false;
        }

        // Pattern Filter
        if (selectedPattern !== 'all') {
            if (!product.pattern || product.pattern !== selectedPattern) return false;
        }

        return true;
    }).sort((a, b) => {
        if (sortBy === 'price-low-high') return a.price - b.price;
        if (sortBy === 'price-high-low') return b.price - a.price;
        return 0; // Featured / Default
    });

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
        const displayName = subcategory
            ? subcategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            : category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        return (
            <div className="w-full max-w-[1800px] mx-auto lg:px-12 lg:py-8 h-[calc(100vh-64px)] lg:h-auto lg:min-h-screen flex flex-col lg:block">
                <SEO
                    title={activeCategoryData?.seo_title || activeCategoryData?.title || `${displayName} Collection`}
                    description={activeCategoryData?.seo_description || `Shop the exclusive ${displayName} collection at Leonardi. Premium accessories for the modern wardrobe.`}
                    keywords={activeCategoryData?.seo_keyword || ''}
                />

                {/* Fixed Header Container for Mobile (Non-scrolling part) */}
                <div className="flex-shrink-0 bg-white z-40 shadow-sm lg:static lg:bg-transparent lg:z-auto lg:shadow-none pb-4">
                    <div className="py-4 lg:mb-8 text-center bg-white px-4">
                        <h1 className="text-xl md:text-3xl font-serif font-bold uppercase tracking-widest mb-2">
                            {displayName} Collection
                        </h1>
                        <div className="w-16 h-1 bg-accent mx-auto"></div>
                    </div>

                    {/* Mobile Filter/Sort Bar */}
                    <div className="mx-4 flex lg:hidden border border-[#C19A6B] divide-x divide-[#C19A6B] bg-orange-50/50">
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="flex-1 py-3 text-sm font-bold uppercase tracking-widest hover:bg-orange-100 transition-colors text-black"
                        >
                            Filter
                        </button>
                        <button
                            onClick={() => setIsSortOpen(true)}
                            className="flex-1 py-3 text-sm font-bold uppercase tracking-widest hover:bg-orange-100 transition-colors text-black"
                        >
                            Sort
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 relative flex-1 overflow-y-auto w-full lg:overflow-visible pb-8 lg:pb-0 px-4 lg:px-0 pt-8 lg:pt-0">

                    {/* Mobile Sort Bottom Sheet/Drawer */}
                    {isSortOpen && (
                        <div className="fixed inset-0 z-50 lg:hidden">
                            <div className="absolute inset-0 bg-black/50" onClick={() => setIsSortOpen(false)}></div>
                            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-6 animate-slide-up">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold uppercase tracking-widest">Sort By</h3>
                                    <button onClick={() => setIsSortOpen(false)}><X size={24} /></button>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Featured', value: 'featured' },
                                        { label: 'Price: Low to High', value: 'price-low-high' },
                                        { label: 'Price: High to Low', value: 'price-high-low' }
                                    ].map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                setSortBy(option.value);
                                                setIsSortOpen(false);
                                            }}
                                            className={`w-full text-left py-3 border-b border-gray-100 flex justify-between items-center ${sortBy === option.value ? 'font-bold text-black' : 'text-gray-600'}`}
                                        >
                                            {option.label}
                                            {sortBy === option.value && <Check size={16} />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mobile Filter Drawer (Right-Side Slide) */}
                    <div className={`fixed inset-0 z-50 lg:hidden transition-visibility duration-300 ${isFilterOpen ? 'visible' : 'invisible'}`}>
                        {/* Backdrop */}
                        <div
                            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isFilterOpen ? 'opacity-100' : 'opacity-0'}`}
                            onClick={() => setIsFilterOpen(false)}
                        ></div>

                        {/* Drawer */}
                        <div className={`absolute top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-xl transform transition-transform duration-300 flex flex-col ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
                                <span className="font-bold text-lg uppercase tracking-widest">Filters</span>
                                <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto">
                                {/* Color Accordion */}
                                {filterOptions.colors.length > 0 && (
                                    <div className="border-b border-gray-100">
                                        <button
                                            onClick={() => toggleAccordion('color')}
                                            className="w-full flex items-center justify-between p-5 text-sm font-bold uppercase tracking-widest hover:bg-gray-50"
                                        >
                                            Color
                                            {openAccordion === 'color' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </button>
                                        {openAccordion === 'color' && (
                                            <div className="px-5 pb-5 grid grid-cols-2 gap-3 bg-gray-50/50">
                                                {['all', ...filterOptions.colors].map(color => (
                                                    <button
                                                        key={color}
                                                        onClick={() => setSelectedColor(color)}
                                                        className={`flex items-center gap-3 px-3 py-2 text-xs font-bold uppercase rounded-md border transition-all ${selectedColor === color ? 'bg-black text-white border-black' : 'bg-white border-gray-200 text-gray-700'}`}
                                                    >
                                                        {color}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Quality Accordion */}
                                {filterOptions.qualities.length > 0 && (
                                    <div className="border-b border-gray-100">
                                        <button
                                            onClick={() => toggleAccordion('quality')}
                                            className="w-full flex items-center justify-between p-5 text-sm font-bold uppercase tracking-widest hover:bg-gray-50"
                                        >
                                            Quality
                                            {openAccordion === 'quality' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </button>
                                        {openAccordion === 'quality' && (
                                            <div className="px-5 pb-5 flex flex-wrap gap-2 bg-gray-50/50">
                                                {['all', ...filterOptions.qualities].map(quality => (
                                                    <button
                                                        key={quality}
                                                        onClick={() => setSelectedQuality(quality)}
                                                        className={`px-3 py-2 text-xs font-medium rounded-md border transition-all ${selectedQuality === quality ? 'bg-black text-white border-black' : 'bg-white border-gray-200 text-gray-600'}`}
                                                    >
                                                        {quality === 'all' ? 'All' : quality}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Size Accordion */}
                                {filterOptions.sizes.length > 0 && (
                                    <div className="border-b border-gray-100">
                                        <button
                                            onClick={() => toggleAccordion('size')}
                                            className="w-full flex items-center justify-between p-5 text-sm font-bold uppercase tracking-widest hover:bg-gray-50"
                                        >
                                            Size
                                            {openAccordion === 'size' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </button>
                                        {openAccordion === 'size' && (
                                            <div className="px-5 pb-5 space-y-2 bg-gray-50/50">
                                                {['all', ...filterOptions.sizes].map(size => (
                                                    <button
                                                        key={size}
                                                        onClick={() => setSelectedSize(size)}
                                                        className={`w-full text-left px-3 py-2 text-xs font-medium rounded-md border transition-all ${selectedSize === size ? 'bg-black text-white border-black' : 'bg-white border-gray-200 text-gray-600'}`}
                                                    >
                                                        {size === 'all' ? 'All Sizes' : size}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Pattern Accordion */}
                                {filterOptions.patterns.length > 0 && (
                                    <div className="border-b border-gray-100">
                                        <button
                                            onClick={() => toggleAccordion('pattern')}
                                            className="w-full flex items-center justify-between p-5 text-sm font-bold uppercase tracking-widest hover:bg-gray-50"
                                        >
                                            Pattern
                                            {openAccordion === 'pattern' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </button>
                                        {openAccordion === 'pattern' && (
                                            <div className="px-5 pb-5 flex flex-wrap gap-2 bg-gray-50/50">
                                                {['all', ...filterOptions.patterns].map(pattern => (
                                                    <button
                                                        key={pattern}
                                                        onClick={() => setSelectedPattern(pattern)}
                                                        className={`px-3 py-2 text-xs font-medium rounded-md border transition-all ${selectedPattern === pattern ? 'bg-black text-white border-black' : 'bg-white border-gray-200 text-gray-600'}`}
                                                    >
                                                        {pattern === 'all' ? 'All' : pattern}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Price Accordion */}
                                <div className="border-b border-gray-100">
                                    <button
                                        onClick={() => toggleAccordion('price')}
                                        className="w-full flex items-center justify-between p-5 text-sm font-bold uppercase tracking-widest hover:bg-gray-50"
                                    >
                                        Price
                                        {openAccordion === 'price' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </button>
                                    {openAccordion === 'price' && (
                                        <div className="px-5 pb-5 space-y-2 bg-gray-50/50">
                                            {['all', '0-500', '500-1000', '1000+'].map(range => (
                                                <button
                                                    key={range}
                                                    onClick={() => setPriceRange(range)}
                                                    className={`w-full text-left px-3 py-2 text-xs font-medium rounded-md border transition-all ${priceRange === range ? 'bg-black text-white border-black' : 'bg-white border-gray-200 text-gray-600'}`}
                                                >
                                                    {range === 'all' ? 'All Prices' : range.includes('+') ? `Above ₹${range.replace('+', '')}` : `₹${range}`}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer / Apply Button */}
                            <div className="p-4 border-t border-gray-100 bg-white shrink-0">
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="w-full bg-[#C19A6B] text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#a6855b] transition-colors"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Filter Sidebar */}
                    <div className={`hidden lg:block lg:w-1/4`}>
                        <div className="sticky top-24 space-y-8 bg-white p-6 border border-gray-100 shadow-sm">
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

                            {/* Color (dynamic) */}
                            {filterOptions.colors.length > 0 && (
                                <div>
                                    <h3 className="font-bold uppercase text-sm mb-3 tracking-wider border-b pb-2">Color</h3>
                                    <div className="space-y-2">
                                        {['all', ...filterOptions.colors].map(color => (
                                            <label key={color} className="flex items-center space-x-2 cursor-pointer group">
                                                <div className={`w-4 h-4 border flex items-center justify-center ${selectedColor === color ? 'border-black bg-black' : 'border-gray-300'}`}>
                                                    {selectedColor === color && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                                </div>
                                                <input type="radio" name="color" value={color} checked={selectedColor === color} onChange={() => setSelectedColor(color)} className="hidden" />
                                                <span className="text-sm text-gray-600 group-hover:text-black capitalize">{color === 'all' ? 'All Colors' : color}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quality Filter (dynamic) */}
                            {filterOptions.qualities.length > 0 && (
                                <div>
                                    <h3 className="font-bold uppercase text-sm mb-3 tracking-wider border-b pb-2">By Quality</h3>
                                    <div className="space-y-2">
                                        {['all', ...filterOptions.qualities].map(quality => (
                                            <label key={quality} className="flex items-center space-x-2 cursor-pointer group">
                                                <div className={`w-4 h-4 border flex items-center justify-center ${selectedQuality === quality ? 'border-black bg-black' : 'border-gray-300'}`}>
                                                    {selectedQuality === quality && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                                </div>
                                                <input type="radio" name="quality" value={quality} checked={selectedQuality === quality} onChange={() => setSelectedQuality(quality)} className="hidden" />
                                                <span className="text-sm text-gray-600 group-hover:text-black capitalize">{quality === 'all' ? 'All Qualities' : quality}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Size Filter (dynamic) */}
                            {filterOptions.sizes.length > 0 && (
                                <div>
                                    <h3 className="font-bold uppercase text-sm mb-3 tracking-wider border-b pb-2">By Size</h3>
                                    <div className="space-y-2">
                                        {['all', ...filterOptions.sizes].map(size => (
                                            <label key={size} className="flex items-center space-x-2 cursor-pointer group">
                                                <div className={`w-4 h-4 border flex items-center justify-center ${selectedSize === size ? 'border-black bg-black' : 'border-gray-300'}`}>
                                                    {selectedSize === size && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                                </div>
                                                <input type="radio" name="size" value={size} checked={selectedSize === size} onChange={() => setSelectedSize(size)} className="hidden" />
                                                <span className="text-sm text-gray-600 group-hover:text-black capitalize">{size === 'all' ? 'All Sizes' : size}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Pattern Filter (dynamic) */}
                            {filterOptions.patterns.length > 0 && (
                                <div>
                                    <h3 className="font-bold uppercase text-sm mb-3 tracking-wider border-b pb-2">By Pattern</h3>
                                    <div className="space-y-2">
                                        {['all', ...filterOptions.patterns].map(pattern => (
                                            <label key={pattern} className="flex items-center space-x-2 cursor-pointer group">
                                                <div className={`w-4 h-4 border flex items-center justify-center ${selectedPattern === pattern ? 'border-black bg-black' : 'border-gray-300'}`}>
                                                    {selectedPattern === pattern && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                                </div>
                                                <input type="radio" name="pattern" value={pattern} checked={selectedPattern === pattern} onChange={() => setSelectedPattern(pattern)} className="hidden" />
                                                <span className="text-sm text-gray-600 group-hover:text-black capitalize">{pattern === 'all' ? 'All Patterns' : pattern}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Grid Area */}
                    <div className="lg:w-3/4">
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
                                        setSelectedQuality('all');
                                        setSelectedSize('all');
                                        setSelectedPattern('all');
                                    }}
                                    className="text-black underline text-sm"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}

                        {/* Mobile Footer in Scroll View */}
                        <div className="lg:hidden mt-0 mb-4">
                            <Footer />
                        </div>
                    </div>
                </div>
            </div>
        );
    }



    // Standard Home Page
    return (
        <div className="space-y-12 pb-0">
            <SEO
                title="Premium Fashion & Accessories"
                description="Discover Leonardi's exquisite collection of brooches, neckties, belts, and more. Handcrafted luxury for discerning tastes."
            />
            <section className="w-full max-w-[1800px] mx-auto px-4 lg:px-12">
                <HeroCarousel />
            </section>

            {/* Shop By Category — Static */}
            <section className="w-full max-w-[1800px] mx-auto px-4 lg:px-12">
                <h2 className="text-xl font-bold text-center mb-8 uppercase tracking-widest">Shop By Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {STATIC_CATEGORIES.map((cat, idx) => (
                        <Link key={idx} to={cat.link} className="group relative aspect-square overflow-hidden block bg-gray-100">
                            <img
                                src={cat.image}
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


            <section className="w-full max-w-[1800px] mx-auto px-4 lg:px-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold uppercase tracking-widest">Featured Products</h2>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-sm border-b border-black hover:text-accent hover:border-accent"
                    >
                        {isExpanded ? 'View Less' : 'View All'}
                    </button>
                </div>
                {renderProductGrid(isExpanded ? products : products.slice(0, limit))}
            </section>

            <section className="w-full max-w-[1800px] mx-auto px-4 lg:px-12">
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
                            {tab.replace(/_/g, ' ')}
                        </button>
                    ))}
                </div>

                <div className="transition-opacity duration-500 animate-fade-in relative group">
                    {tabProducts[activeTab] && tabProducts[activeTab].length > 0 ? (
                        renderProductSlider(tabProducts[activeTab])
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            No items in this category yet.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
