import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';
import WishlistDrawer from './WishlistDrawer'; // Moved from Header
import AuthModal from './AuthModal'; // Moved from Header

const Layout = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen">
            <Header
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                isWishlistOpen={isWishlistOpen}
                setIsWishlistOpen={setIsWishlistOpen}
                isAuthOpen={isAuthOpen}
                setIsAuthOpen={setIsAuthOpen}
            />

            <main className="flex-grow pb-16 md:pb-0">
                {children}
            </main>

            <Footer />

            {/* Global UI Components */}
            <BottomNav
                onOpenMenu={() => setIsMobileMenuOpen(true)}
                onOpenWishlist={() => setIsWishlistOpen(true)}
                onOpenAuth={() => setIsAuthOpen(true)}
            />

            <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </div>
    );
};

export default Layout;
