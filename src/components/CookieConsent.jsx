import React, { useState, useEffect } from 'react';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('leonardi_cookie_consent');
        if (!consent) {
            // Sho after a small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('leonardi_cookie_consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 z-[100] max-w-sm w-[calc(100%-2rem)] bg-white p-6 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 animate-slide-up">
            <h3 className="text-lg font-bold text-gray-900 mb-2">We use cookies!</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                This website uses necessary cookies to ensure its proper functioning and other cookies which are listed in the preference center and are only set after consent.
            </p>
            <div className="flex items-center gap-3">
                <button
                    onClick={handleAccept}
                    className="flex-1 bg-black text-white text-xs font-bold uppercase tracking-widest py-3 px-4 rounded hover:bg-gray-800 transition-colors"
                >
                    I agree
                </button>
                <button
                    onClick={() => setIsVisible(false)} // Just dismiss for now, or open modal
                    className="flex-1 bg-gray-100 text-gray-900 text-xs font-bold uppercase tracking-widest py-3 px-4 rounded hover:bg-gray-200 transition-colors"
                >
                    Customize
                </button>
            </div>
        </div>
    );
};

export default CookieConsent;
