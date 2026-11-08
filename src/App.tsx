import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
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
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginPage } from './components/AdminLoginPage';
import { ContactPage } from './components/ContactPage';
import { StaticPages } from './components/StaticPages';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { NotificationsModal } from './components/NotificationsModal';
import { Product } from './types';
import { WifiOff, AlertTriangle } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    isOnline,
    isAdmin,
    products,
  } = useStore();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [latestOrderNumber, setLatestOrderNumber] = useState<string>('');

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleOrderSuccess = (orderNumber: string) => {
    setLatestOrderNumber(orderNumber);
    setCurrentView('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col font-sans selection:bg-[#D4A853] selection:text-[#070F1E]">
      {/* Offline Alert Strip */}
      {!isOnline && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white text-xs font-bold py-2 px-4 text-center flex items-center justify-center gap-2 shadow-sm border-b border-amber-400">
          <WifiOff className="w-4 h-4 text-amber-100" />
          <span>أنت تتصفح في وضع عدم الاتصال بالإنترنت. يمكنك تصفح المنتجات المحفوظة مؤقتاً.</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar onOpenNotifications={() => setNotificationsOpen(true)} />

      {/* Main View Area */}
      <main className="flex-1 pb-16 md:pb-8">
        {currentView === 'home' && <HomePage onSelectProduct={handleSelectProduct} />}
        {currentView === 'categories' && <CategoriesPage onSelectProduct={handleSelectProduct} />}
        {currentView === 'deals' && <SearchPage onSelectProduct={handleSelectProduct} />}
        {currentView === 'search' && <SearchPage onSelectProduct={handleSelectProduct} />}
        {currentView === 'external-request' && <ExternalRequestPage />}
        {currentView === 'cart' && <CartPage />}
        {currentView === 'checkout' && <CheckoutPage onOrderSuccess={handleOrderSuccess} />}
        {currentView === 'order-success' && <OrderSuccessPage orderNumber={latestOrderNumber} />}
        {currentView === 'orders' && <MyOrdersPage />}
        {currentView === 'requests' && <MyRequestsPage />}
        {currentView === 'wishlist' && <WishlistPage onSelectProduct={handleSelectProduct} />}
        {currentView === 'account' && <AccountPage onOpenNotifications={() => setNotificationsOpen(true)} />}
        {currentView === 'admin' && (isAdmin ? <AdminDashboard /> : <AdminLoginPage onSuccess={() => setCurrentView('admin')} />)}
        {currentView === 'admin-login' && <AdminLoginPage onSuccess={() => setCurrentView('admin')} />}
        {currentView === 'contact' && <ContactPage />}
        {currentView === 'terms' && <StaticPages type="terms" />}
        {currentView === 'privacy' && <StaticPages type="privacy" />}
        {currentView === 'returns' && <StaticPages type="returns" />}
      </main>

      {/* Modals */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSelectProduct={handleSelectProduct}
        />
      )}

      <NotificationsModal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      {/* Mobile Floating Bottom Bar */}
      <BottomNav />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
