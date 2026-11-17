/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryStrip } from './components/CategoryStrip';
import { FeaturedFragrances } from './components/FeaturedFragrances';
import { PromoBanners } from './components/PromoBanners';
import { TrustStrip } from './components/TrustStrip';
import { AboutCraftsmanship } from './components/AboutCraftsmanship';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchModal } from './components/SearchModal';
import { AccountModal } from './components/AccountModal';
import { InfoModal, InfoModalType } from './components/InfoModal';
import { Toast } from './components/Toast';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { subscribeToAdminAuth } from './services/adminAuthService';
import {
  HERO_PRODUCT,
  FEATURED_PRODUCTS,
  DISCOVERY_SET_PRODUCT,
  GIFT_SET_PRODUCT
} from './data/products';
import { Product, CartItem, Order, AdminAuthState } from './types';

function checkIsAdminRoute(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return (
    path === '/admin' ||
    path.startsWith('/admin/') ||
    hash === '#/admin' ||
    hash === '#admin' ||
    hash.startsWith('#/admin/')
  );
}

export default function App() {
  // Pre-loaded cart items to match the screenshot's cart badge indicator '2'
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: FEATURED_PRODUCTS[0], // LEGACY (PKR 1,399)
      quantity: 1,
      selectedVolume: '30ml'
    },
    {
      product: FEATURED_PRODUCTS[1], // PHANTOM (PKR 1,399)
      quantity: 1,
      selectedVolume: '30ml'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [accountTab, setAccountTab] = useState<'signin' | 'track'>('signin');
  const [activeInfoModal, setActiveInfoModal] = useState<InfoModalType>(null);
  const [activeQuickViewProduct, setActiveQuickViewProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => checkIsAdminRoute());
  const [adminAuth, setAdminAuth] = useState<AdminAuthState>({
    isLoading: true,
    isAdmin: false,
    uid: null,
    email: null,
    error: null
  });

  useEffect(() => {
    const syncRoute = () => setIsAdminRoute(checkIsAdminRoute());
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);
    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  useEffect(() => {
    if (!isAdminRoute) return;
    const unsubscribe = subscribeToAdminAuth(setAdminAuth);
    return () => unsubscribe();
  }, [isAdminRoute]);

  const handleOpenAdmin = () => {
    if (window.location.hash !== '#/admin') {
      window.location.hash = '#/admin';
    }
    setIsAdminRoute(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToStore = () => {
    if (window.location.pathname.toLowerCase().startsWith('/admin')) {
      window.history.pushState({}, '', '/');
    } else if (window.location.hash) {
      window.location.hash = '';
    }
    setIsAdminRoute(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Total items in cart
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Filter products based on active category:
  // - 'all': all 3 featured perfumes (LEGACY, PHANTOM, SERENE)
  // - 'women': SERENE only
  // - 'men': LEGACY only
  // - 'unisex': PHANTOM only
  // - 'gift-sets' / 'discovery-sets': [] (directs user to promotions section)
  const filteredProducts =
    selectedCategory === 'all'
      ? FEATURED_PRODUCTS
      : selectedCategory === 'women'
      ? FEATURED_PRODUCTS.filter((p) => p.category === 'women')
      : selectedCategory === 'men'
      ? FEATURED_PRODUCTS.filter((p) => p.category === 'men')
      : selectedCategory === 'unisex'
      ? FEATURED_PRODUCTS.filter((p) => p.category === 'unisex')
      : [];

  // Handle Add To Cart
  const handleAddToCart = (product: Product, quantity = 1, volume = '30ml') => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity
        };
        return next;
      }
      return [...prev, { product, quantity, selectedVolume: volume }];
    });

    setToastMessage(`Added "${product.name}" (${quantity}) to your shopping bag.`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleOpenCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setCartItems([]);
    setToastMessage(`Order ${order.orderId} submitted! Status: Payment Pending.`);
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory((prev) => (prev === categoryId ? 'all' : categoryId));

    if (categoryId === 'gift-sets' || categoryId === 'discovery-sets') {
      const promoSection = document.getElementById('promotions');
      if (promoSection) {
        promoSection.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    const section = document.getElementById('featured-fragrances');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenTrackOrder = () => {
    setAccountTab('track');
    setIsAccountOpen(true);
  };

  const allProductsForSearch = [
    HERO_PRODUCT,
    ...FEATURED_PRODUCTS,
    DISCOVERY_SET_PRODUCT,
    GIFT_SET_PRODUCT
  ];

  if (isAdminRoute) {
    if (adminAuth.isLoading) {
      return (
        <div className="min-h-screen bg-[#0E0E0E] text-white flex flex-col items-center justify-center p-6">
          <Loader2 className="w-7 h-7 animate-spin text-stone-300 mb-3" />
          <p className="text-xs tracking-[0.22em] uppercase text-stone-400">
            Verifying Admin Access...
          </p>
        </div>
      );
    }

    if (!adminAuth.isAdmin || !adminAuth.email) {
      return (
        <AdminLogin
          externalError={adminAuth.error}
          onBackToStore={handleBackToStore}
        />
      );
    }

    return (
      <AdminDashboard
        adminUid={adminAuth.uid}
        adminEmail={adminAuth.email}
        onBackToStore={handleBackToStore}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 font-sans selection:bg-amber-900 selection:text-white">
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Main Navigation Bar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onSelectCategory={handleSelectCategory}
        onOpenAccount={() => {
          setAccountTab('signin');
          setIsAccountOpen(true);
        }}
      />

      <main className="flex-1">
        {/* 3. Hero Section (CRAFTED FOR MOMENTS) */}
        <HeroSection
          heroProduct={HERO_PRODUCT}
          onExploreCollections={() => {
            const section = document.getElementById('featured-fragrances');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
          }}
          onQuickView={setActiveQuickViewProduct}
        />

        {/* 4. Category Strip Bar (5 Categories) */}
        <CategoryStrip
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* 5. Featured Fragrances Section */}
        <FeaturedFragrances
          products={filteredProducts}
          onAddToCart={handleAddToCart}
          onQuickView={setActiveQuickViewProduct}
          onViewAll={() => setSelectedCategory('all')}
        />

        {/* 6. Promotional Banners (Discovery Sets & The Art of Gifting) */}
        <PromoBanners
          onQuickView={setActiveQuickViewProduct}
          onAddToCart={handleAddToCart}
        />

        {/* 7. Client Guarantees & Trust Strip */}
        <TrustStrip />

        {/* 8. Haute Parfumerie Craftsmanship */}
        <AboutCraftsmanship />
      </main>

      {/* 9. Obsidian Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenTrackOrder={handleOpenTrackOrder}
        onOpenInfoModal={(type) => setActiveInfoModal(type)}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Slide-out Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleOpenCheckout}
      />

      {/* Dedicated Karachi Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Quick View Fragrance & Notes Modal */}
      <QuickViewModal
        product={activeQuickViewProduct}
        isOpen={!!activeQuickViewProduct}
        onClose={() => setActiveQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Real-time Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={allProductsForSearch}
        onSelectProduct={setActiveQuickViewProduct}
      />

      {/* Client Privileges & Order Tracking Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        initialTab={accountTab}
      />

      {/* Information Modals: Contact, Karachi Delivery, Easypaisa, Privacy */}
      <InfoModal
        type={activeInfoModal}
        isOpen={!!activeInfoModal}
        onClose={() => setActiveInfoModal(null)}
      />

      {/* Feedback Toast */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
        onOpenCart={() => {
          setToastMessage(null);
          setIsCartOpen(true);
        }}
      />
    </div>
  );
}
