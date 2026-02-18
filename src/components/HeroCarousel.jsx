import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { imageHelper } from '../utils/imageHelper';

const FALLBACK_SLIDES = [
    {
        id: 1,
        title: "Elegance Redefined",
        sub_title: "The Royal Collection",
        description: "Discover our latest assortment of handcrafted neckties and pocket squares.",
        button_text: "Shop The Collection",
        button_link: "/collection/necktie",
        desktop_image: "hero-slide-1.png",
        mobile_image: "hero-slide-1.png",
    },
];

const HeroCarousel = () => {
    const [slides, setSlides] = useState([]);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);

    // Fetch banners from API
    useEffect(() => {
        api.get('/api/banners')
            .then(({ data }) => {
                const banners = Array.isArray(data) ? data : (data.data || []);
                const activeBanners = banners.filter(b => b.status === 'Active' || b.status === 'active');
                setSlides(activeBanners.length > 0 ? activeBanners : FALLBACK_SLIDES);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch banners:', err.message);
                setSlides(FALLBACK_SLIDES);
                setLoading(false);
            });
    }, []);

    const nextSlide = useCallback(() => {
        setCurrent(prev => (prev >= slides.length - 1 ? 0 : prev + 1));
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        setCurrent(prev => (prev <= 0 ? slides.length - 1 : prev - 1));
    }, [slides.length]);

    // Auto-advance
    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [nextSlide, slides.length]);

    // Touch/swipe support
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > minSwipeDistance) nextSlide();
        if (distance < -minSwipeDistance) prevSlide();
    };

    if (loading) {
        return (
            <div className="w-full aspect-[720/860] md:aspect-auto md:h-[70vh] bg-gray-100 animate-pulse" />
        );
    }

    return (
        <div
            className="relative w-full aspect-[720/860] md:aspect-auto md:h-[70vh] bg-gray-50 overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <div
                className="flex transition-transform duration-700 ease-in-out h-full"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {slides.map((slide) => {
                    // Logic to handle images:
                    // On mobile, we prefer mobile_image, falling back to desktop_image
                    // On desktop, we prefer desktop_image, falling back to mobile_image
                    // Note: In this layout, we render BOTH and hide/show via CSS for the split layout
                    const desktopImg = slide.desktop_image || slide.mobile_image;
                    const mobileImg = slide.mobile_image || slide.desktop_image;

                    const isExternalLink = slide.button_link && (
                        slide.button_link.startsWith('http') ||
                        slide.button_link.startsWith('//')
                    );
                    const linkTo = isExternalLink ? '#' : (slide.button_link || '/');

                    return (
                        <div key={slide.id} className="min-w-full h-full relative md:grid md:grid-cols-2">
                            {/* Image Content (Background on Mobile, Right Side on Desktop) */}
                            <div className="absolute inset-0 md:relative md:order-2 h-full w-full">
                                {/* Desktop Image */}
                                <img
                                    src={imageHelper(desktopImg)}
                                    alt={slide.title}
                                    className="hidden md:block w-full h-full object-cover"
                                />
                                {/* Mobile Image */}
                                <img
                                    src={imageHelper(mobileImg)}
                                    alt={slide.title}
                                    className="block md:hidden w-full h-full object-cover"
                                />
                                {/* Mobile Overlay Gradient */}
                                <div className="absolute inset-0 bg-black/40 md:hidden"></div>
                            </div>

                            {/* Text Content (Overlay on Mobile, Left Side on Desktop) */}
                            <div className="relative z-10 flex flex-col justify-center items-start px-8 md:px-20 space-y-2 md:space-y-6 h-full md:h-full md:bg-white md:order-1 text-white md:text-black">
                                {slide.sub_title && (
                                    <h3 className="font-bold uppercase tracking-widest text-xs md:text-base animate-slide-up text-accent md:text-accent">
                                        {slide.sub_title}
                                    </h3>
                                )}
                                {slide.title && (
                                    <h1
                                        className="text-4xl md:text-6xl font-serif font-medium leading-tight animate-slide-up"
                                        style={{ animationDelay: '0.1s' }}
                                    >
                                        {slide.title}
                                    </h1>
                                )}
                                {slide.description && (
                                    <p
                                        className="max-w-md text-sm md:text-lg animate-slide-up text-gray-200 md:text-gray-600"
                                        style={{ animationDelay: '0.2s' }}
                                    >
                                        {slide.description}
                                    </p>
                                )}
                                {slide.button_text && (
                                    isExternalLink ? (
                                        <a
                                            href={slide.button_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block bg-white text-black md:bg-black md:text-white px-6 py-3 md:px-8 md:py-3 uppercase tracking-widest text-xs md:text-sm font-bold hover:bg-gray-200 md:hover:bg-accent transition-colors animate-slide-up mt-4 rounded-sm"
                                            style={{ animationDelay: '0.3s' }}
                                        >
                                            {slide.button_text}
                                        </a>
                                    ) : (
                                        <Link
                                            to={linkTo}
                                            className="inline-block bg-white text-black md:bg-black md:text-white px-6 py-3 md:px-8 md:py-3 uppercase tracking-widest text-xs md:text-sm font-bold hover:bg-gray-200 md:hover:bg-accent transition-colors animate-slide-up mt-4 rounded-sm"
                                            style={{ animationDelay: '0.3s' }}
                                        >
                                            {slide.button_text}
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Navigation Arrows */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white shadow-md z-10 transition-all hidden md:block"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white shadow-md z-10 transition-all hidden md:block"
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            {/* Dots */}
            {slides.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 shadow-sm ${current === idx ? 'bg-black w-8' : 'bg-gray-400/70 hover:bg-gray-600'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HeroCarousel;
