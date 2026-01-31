import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { imageHelper } from '../utils/imageHelper';
import { Link } from 'react-router-dom';

const slides = [
    {
        id: 1,
        title: "Elegance Redefined",
        subtitle: "The Royal Collection",
        description: "Discover our latest assortment of handcrafted neckties and pocket squares, designed for the modern gentleman.",
        image: "hero-slide-1.png",
        cta: "Shop The Collection",
        link: "/collection/necktie"
    },
    {
        id: 2,
        title: "Timeless Accessories",
        subtitle: "Cufflinks & More",
        description: "Add a touch of sophistication to your attire with our premium range of gold and silver plated cufflinks.",
        image: "hero-slide-2.png",
        cta: "View Accessories",
        link: "/collection/cufflink"
    },
    {
        id: 3,
        title: "Statement Pieces",
        subtitle: "Exquisite Brooches",
        description: "Make a bold impression with our intricate brooches, perfect for weddings and gala events.",
        image: "hero-slide-3.png",
        cta: "Shop Brooches",
        link: "/collection/brooch"
    },
    {
        id: 4,
        title: "The Perfect Fit",
        subtitle: "Leather Belts",
        description: "Function meets style. Explore our collection of genuine leather belts in classic and contemporary finishes.",
        image: "hero-slide-4.png",
        cta: "Shop Belts",
        link: "/collection/belt"
    },
    {
        id: 5,
        title: "Classic Essentials",
        subtitle: "Suspenders & Bowties",
        description: "Complete your formal look with our range of adjustable suspenders and pre-tied bowties.",
        image: "hero-slide-5.png",
        cta: "Shop Essentials",
        link: "/collection/suspender"
    }
];

const HeroCarousel = () => {
    const [current, setCurrent] = useState(0);

    const nextSlide = () => {
        setCurrent(current === slides.length - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? slides.length - 1 : current - 1);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, [current]);

    return (
        <div className="relative w-full aspect-[720/860] md:aspect-auto md:h-[70vh] bg-gray-50 overflow-hidden">
            <div
                className="flex transition-transform duration-700 ease-in-out h-full"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {slides.map((slide) => (
                    <div key={slide.id} className="min-w-full h-full relative md:grid md:grid-cols-2">
                        {/* Image Content (Background on Mobile, Right Side on Desktop) */}
                        <div className="absolute inset-0 md:relative md:order-2 h-full w-full">
                            <img
                                src={imageHelper(slide.image)}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                            />
                            {/* Mobile Overlay Gradient */}
                            <div className="absolute inset-0 bg-black/40 md:hidden"></div>
                        </div>

                        {/* Text Content (Overlay on Mobile, Left Side on Desktop) */}
                        <div className="relative z-10 flex flex-col justify-center items-start px-8 md:px-20 space-y-2 md:space-y-6 h-full md:h-full md:bg-white md:order-1 text-white md:text-black">
                            <h3 className="font-bold uppercase tracking-widest text-xs md:text-base animate-slide-up text-accent md:text-accent">
                                {slide.subtitle}
                            </h3>
                            <h1 className="text-4xl md:text-6xl font-serif font-medium leading-tight animate-slide-up" style={{ animationDelay: '0.1s' }}>
                                {slide.title}
                            </h1>
                            <p className="max-w-md text-sm md:text-lg animate-slide-up text-gray-200 md:text-gray-600" style={{ animationDelay: '0.2s' }}>
                                {slide.description}
                            </p>
                            <Link
                                to={slide.link}
                                className="inline-block bg-white text-black md:bg-black md:text-white px-6 py-3 md:px-8 md:py-3 uppercase tracking-widest text-xs md:text-sm font-bold hover:bg-gray-200 md:hover:bg-accent transition-colors animate-slide-up mt-4 rounded-sm"
                                style={{ animationDelay: '0.3s' }}
                            >
                                {slide.cta}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
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

            {/* Dots */}
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
        </div>
    );
};

export default HeroCarousel;
