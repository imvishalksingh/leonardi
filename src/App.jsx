import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import CMSPage from './pages/CMSPage';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import CartDrawer from './components/CartDrawer';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/collection/:category" element={<Home />} />
                <Route path="/account" element={<Profile />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/pages/:slug" element={<CMSPage />} />
              </Routes>
              <CartDrawer />
            </Layout>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
