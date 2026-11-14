import React, { useState, useEffect, useCallback } from 'react';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { CategoriesPage } from './components/CategoriesPage';
import { SearchPage } from './components/SearchPage';
import { ExternalRequestPage } from './components/ExternalRequestPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderSuccessPage } from './components/OrderSuccessPage';
import { MyOrdersPage } from './components/MyOrdersPage';
import { MyRequestsPage } from './components/MyRequestsPage';
import { WishlistPage } from './components/WishlistPage';
import { AccountPage } from './components/AccountPage';
import { AdminLoginPage } from './components/AdminLoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminSecuritySettings } from './components/AdminSecuritySettings';
import { ContactPage } from './components/ContactPage';
import { StaticPage } from './components/StaticPages';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { NotificationsModal } from './components/NotificationsModal';
import { Product } from './types';
import { initMobileApp } from './services/mobileApp';

export const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string>('');

  // Handle hardware Android back button
  const handleHardwareBack = useCallback((): boolean => {
    if (activeProduct) {
      setActiveProduct(null);
      return true;
    }
    if (isNotifOpen) {
      setIsNotifOpen(false);
      return true;
    }
    if (currentView !== 'home') {
      setCurrentView('home');
      return true;
    }
    return false; // let app exit
  }, [activeProduct, isNotifOpen, currentView]);

  useEffect(() => {
    initMobileApp(handleHardwareBack);
  }, [handleHardwareBack]);

  const handleNavigate = (view: string, category?: string) => {
    setCurrentView(view);
    if (category) {
      setSelectedCategory(category);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-amber-500 selection:text-white">
      {/* Top Header / App Bar */}
      <Navbar
        currentView={currentView}
        setCurrentView={handleNavigate}
        openNotifications={() => setIsNotifOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-8">
        {currentView === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenProduct={setActiveProduct}
          />
        )}

        {currentView === 'categories' && (
          <CategoriesPage
            initialCategory={selectedCategory}
            onOpenProduct={setActiveProduct}
          />
        )}

        {currentView === 'search' && (
          <SearchPage onOpenProduct={setActiveProduct} />
        )}

        {currentView === 'external-request' && (
          <ExternalRequestPage
            onSuccessNavigate={() => handleNavigate('my-requests')}
          />
        )}

        {currentView === 'cart' && (
          <CartPage
            onProceedToCheckout={() => handleNavigate('checkout')}
            onExplore={() => handleNavigate('categories')}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            onSuccess={(id) => {
              setLastOrderId(id);
              handleNavigate('order-success');
            }}
            onBack={() => handleNavigate('cart')}
          />
        )}

        {currentView === 'order-success' && (
          <OrderSuccessPage
            orderId={lastOrderId}
            onNavigateHome={() => handleNavigate('home')}
            onViewOrders={() => handleNavigate('orders')}
          />
        )}

        {currentView === 'orders' && (
          <MyOrdersPage onBack={() => handleNavigate('home')} />
        )}

        {currentView === 'my-requests' && (
          <MyRequestsPage
            onBack={() => handleNavigate('account')}
            onNewRequest={() => handleNavigate('external-request')}
          />
        )}

        {currentView === 'wishlist' && (
          <WishlistPage
            onBack={() => handleNavigate('home')}
            onOpenProduct={setActiveProduct}
          />
        )}

        {currentView === 'account' && (
          <AccountPage onNavigate={handleNavigate} />
        )}

        {currentView === 'admin-login' && (
          <AdminLoginPage
            onSuccess={() => handleNavigate('admin-dashboard')}
            onBack={() => handleNavigate('home')}
          />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminDashboard
            onLogout={() => handleNavigate('home')}
            onOpenSecurity={() => handleNavigate('admin-security')}
          />
        )}

        {currentView === 'admin-security' && (
          <AdminSecuritySettings
            onBack={() => handleNavigate('admin-dashboard')}
          />
        )}

        {currentView === 'contact' && (
          <ContactPage />
        )}

        {(currentView === 'terms' || currentView === 'privacy' || currentView === 'shipping' || currentView === 'returns' || currentView === 'about') && (
          <StaticPage
            type={currentView as any}
            onBack={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Android Mobile Navigation Bar */}
      <BottomNav
        currentView={currentView}
        setCurrentView={handleNavigate}
      />

      {/* Global Product Details Modal */}
      <ProductDetailsModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
