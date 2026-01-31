import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { getProducts } from '../services/productService';
import { Link } from 'react-router-dom';
import { imageHelper } from '../utils/imageHelper';

const SearchModal = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        if (isOpen) {
            getProducts().then(setAllProducts);
            // Lock body scroll
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setQuery('');
            setResults([]);
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    useEffect(() => {
        if (query.trim() === '') {
            setResults([]);
        } else {
            const lowerQuery = query.toLowerCase();
            const filtered = allProducts.filter(p =>
                p.name.toLowerCase().includes(lowerQuery) ||
                p.category.toLowerCase().includes(lowerQuery)
            );
            setResults(filtered);
        }
    }, [query, allProducts]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-white animate-fade-in flex flex-col">
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-8">
                    <span className="text-xs font-bold uppercase tracking-widest">Search</span>
                    <button onClick={onClose}><X size={24} /></button>
                </div>

                <div className="relative mb-12 border-b-2 border-black">
                    <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                    <input
                        type="text"
                        placeholder="Search for products..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full py-4 pl-10 pr-4 text-2xl font-serif outline-none placeholder-gray-300"
                        autoFocus
                    />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 overflow-y-auto pb-20">
                    {results.length > 0 ? (
                        results.map(product => (
                            <Link
                                key={product.id}
                                to={`/product/${product.slug}`}
                                onClick={onClose}
                                className="group"
                            >
                                <div className="aspect-[3/4] bg-gray-100 mb-2 overflow-hidden">
                                    <img
                                        src={imageHelper(product.images[0])}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <h4 className="text-sm font-medium group-hover:text-accent">{product.name}</h4>
                                <span className="text-sm font-bold">₹{product.price.toFixed(2)}</span>
                            </Link>
                        ))
                    ) : query.length > 0 ? (
                        <div className="col-span-full text-center text-gray-400 py-12">No results found for "{query}"</div>
                    ) : (
                        <div className="col-span-full text-center text-gray-400 py-12">Start typing to search...</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
