import React from 'react';
import { ShoppingBag, Heart, Search, Bell, Shield, Sparkles } from 'lucide-react';
import { BRAND } from '../constants/brand';
import { useStore } from '../context/StoreContext';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  openNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView, openNotifications }) => {
  const { cartCount, wishlist, unreadNotificationsCount } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-[#070F1E] text-white shadow-lg pt-safe border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-3 group text-right focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#070F1E] rounded-[10px] flex items-center justify-center">
              <span className="text-amber-400 font-extrabold text-xl tracking-wider">W</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-white group-hover:text-amber-400 transition-colors">
                {BRAND.name}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-amber-300/80 tracking-widest font-medium uppercase hidden sm:block">
              {BRAND.nameEn}
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setCurrentView('home')}
            className={`transition-colors py-1 ${currentView === 'home' ? 'text-amber-400 font-bold border-b-2 border-amber-400' : 'text-slate-300 hover:text-white'}`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => setCurrentView('categories')}
            className={`transition-colors py-1 ${currentView === 'categories' ? 'text-amber-400 font-bold border-b-2 border-amber-400' : 'text-slate-300 hover:text-white'}`}
          >
            الأقسام
          </button>
          <button
            onClick={() => setCurrentView('external-request')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              currentView === 'external-request'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>اخترها ونحن نوصلها</span>
          </button>
          <button
            onClick={() => setCurrentView('orders')}
            className={`transition-colors py-1 ${currentView === 'orders' ? 'text-amber-400 font-bold border-b-2 border-amber-400' : 'text-slate-300 hover:text-white'}`}
          >
            طلباتي
          </button>
          <button
            onClick={() => setCurrentView('contact')}
            className={`transition-colors py-1 ${currentView === 'contact' ? 'text-amber-400 font-bold border-b-2 border-amber-400' : 'text-slate-300 hover:text-white'}`}
          >
            اتصل بنا
          </button>
        </nav>

        {/* Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setCurrentView('search')}
            aria-label="البحث"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={openNotifications}
            aria-label="الإشعارات"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentView('wishlist')}
            aria-label="المفضلة"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors relative hidden sm:flex"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-500 text-[10px] font-bold text-slate-950 flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentView('cart')}
            aria-label="السلة"
            className="flex items-center gap-2 p-2 sm:px-3 sm:py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition-colors relative shadow-md shadow-amber-500/20"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline">السلة</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-slate-950 text-amber-400 text-xs flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentView('admin-login')}
            aria-label="لوحة الإدارة"
            className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-white/5 transition-colors"
            title="لوحة الإدارة"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
