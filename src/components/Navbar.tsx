import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  Bell,
  User,
  Shield,
  Menu,
  X,
  Phone,
  Sparkles,
  Link as LinkIcon,
  CheckCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BRAND } from '../constants/brand';

interface NavbarProps {
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNotifications }) => {
  const {
    settings,
    cart,
    wishlist,
    unreadNotificationsCount,
    currentView,
    setCurrentView,
    searchQuery,
    setSearchQuery,
    isAdmin,
    currentUser,
    userProfile,
    toggleAdminDemoMode,
    selectedCurrency,
    setSelectedCurrency,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView('search');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      {/* Top micro-bar with brand deep obsidian navy and refined gold */}
      <div className="bg-[#070F1E] text-slate-200 text-xs py-1.5 px-4 sm:px-6 border-b border-[#D4A853]/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#F5D68B] drop-shadow-xs">«{settings.storeSlogan}»</span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-300 font-medium">{settings.tagline}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Currency selector */}
            <div className="flex items-center gap-1 text-[11px] bg-[#0B1B36] px-2 py-0.5 rounded-md border border-slate-700/80">
              <span className="text-slate-400">العملة:</span>
              <button
                onClick={() => setSelectedCurrency('SAR')}
                className={`px-1.5 py-0.5 rounded font-medium transition-colors ${
                  selectedCurrency === 'SAR' ? 'bg-gold-gradient text-[#070F1E] font-black shadow-xs' : 'hover:text-white'
                }`}
              >
                ر.س
              </button>
              <button
                onClick={() => setSelectedCurrency('YER')}
                className={`px-1.5 py-0.5 rounded font-medium transition-colors ${
                  selectedCurrency === 'YER' ? 'bg-gold-gradient text-[#070F1E] font-black shadow-xs' : 'hover:text-white'
                }`}
              >
                ر.ي
              </button>
              <button
                onClick={() => setSelectedCurrency('USD')}
                className={`px-1.5 py-0.5 rounded font-medium transition-colors ${
                  selectedCurrency === 'USD' ? 'bg-gold-gradient text-[#070F1E] font-black shadow-xs' : 'hover:text-white'
                }`}
              >
                $
              </button>
            </div>

            {/* Quick WhatsApp Link */}
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">خدمة العملاء</span>
            </a>

            {/* Super Admin Access Link */}
            <button
              onClick={() => {
                if (isAdmin) {
                  setCurrentView('admin');
                } else {
                  setCurrentView('admin-login');
                }
              }}
              title={isAdmin ? 'فتح لوحة تحكم المدير الرئيسي' : 'تسجيل دخول المدير الرئيسي (Super Admin)'}
              className={`flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                isAdmin
                  ? 'bg-gold-gradient text-[#070F1E] shadow-xs ring-1 ring-[#D4A853]'
                  : 'bg-[#0B1B36] text-slate-300 hover:text-[#F5D68B] border border-slate-700/80'
              }`}
            >
              <Shield className="w-3 h-3 text-[#D4A853]" />
              <span>{isAdmin ? 'لوحة تحكم المدير' : 'دخول المدير الرئيسي'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand with Official Uploaded Image */}
          <div
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            {/* Logo Image */}
            <div className="h-12 w-auto max-w-[170px] sm:max-w-[200px] flex items-center justify-center overflow-hidden py-0.5 group-hover:scale-103 transition-transform">
              <img
                src={BRAND.logoUrl}
                alt="شعار متجر الوقزة"
                className="h-full w-auto object-contain"
              />
            </div>

            {/* Additional Brand text for larger screens */}
            <div className="hidden lg:block border-r border-slate-200 pr-3 mr-1">
              <p className="text-[11px] font-bold text-[#D4A853] leading-tight">
                {BRAND.subTitle}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">
                {BRAND.subTitleEn}
              </p>
            </div>
          </div>

          {/* Search bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-lg mx-4 relative items-center"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن منتج، ماركة، إلكترونيات، ساعات، أزياء..."
              className="w-full bg-slate-50 hover:bg-slate-100/90 focus:bg-white text-slate-900 text-sm py-2.5 pr-11 pl-24 rounded-2xl border border-slate-200 focus:border-[#D4A853] focus:ring-2 focus:ring-[#D4A853]/25 focus:outline-hidden transition-all shadow-inner"
            />
            <Search className="w-5 h-5 text-slate-400 absolute right-3.5 pointer-events-none" />
            <button
              type="submit"
              className="absolute left-1.5 bg-[#0B1B36] hover:bg-[#162E56] text-[#F5D68B] text-xs font-bold px-4 py-1.5 rounded-xl transition-all shadow-xs hover:shadow-md"
            >
              بحث
            </button>
          </form>

          {/* Sourcing Service Direct Button in Luxurious Gold */}
          <button
            onClick={() => setCurrentView('external-request')}
            className="hidden lg:flex items-center gap-2 bg-gold-gradient hover:bg-gold-gradient-hover text-[#070F1E] font-black text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-md shadow-[#D4A853]/25 hover:shadow-lg hover:shadow-[#D4A853]/35 hover:scale-102 active:scale-98 transition-all"
          >
            <LinkIcon className="w-4 h-4 stroke-[2.5]" />
            <span>أرسل رابط المنتج</span>
            <span className="text-[10px] bg-[#070F1E] text-[#F5D68B] px-1.5 py-0.5 rounded-md font-bold">
              خدمة حصرية
            </span>
          </button>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search toggle for mobile */}
            <button
              onClick={() => setCurrentView('search')}
              className="md:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 left-1.5 w-5 h-5 bg-[#D4A853] text-[#070F1E] text-[11px] font-black rounded-full flex items-center justify-center shadow-xs animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setCurrentView('wishlist')}
              className="relative p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors hidden sm:block"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 left-1.5 w-5 h-5 bg-[#0B1B36] text-[#F5D68B] text-[11px] font-black rounded-full flex items-center justify-center border border-[#D4A853]/40">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => setCurrentView('cart')}
              className="relative p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1"
              aria-label="Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-[#0B1B36]" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#0B1B36] text-[#F5D68B] text-[11px] font-black rounded-full flex items-center justify-center shadow-xs border border-[#D4A853]/40">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-slate-800 hidden xl:inline">
                السلة
              </span>
            </button>

            {/* Account / Login */}
            <button
              onClick={() => setCurrentView('account')}
              className="flex items-center gap-1.5 p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#FDF8EC] text-[#070F1E] flex items-center justify-center text-xs font-bold overflow-hidden border border-[#E5C989]">
                {currentUser?.photoURL ? (
                  <img src={currentUser.photoURL} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-[#0B1B36]" />
                )}
              </div>
              <div className="hidden lg:block text-right">
                <p className="text-[11px] text-slate-400 leading-none">حسابي</p>
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {currentUser ? userProfile?.name?.split(' ')[0] : 'تسجيل الدخول'}
                </p>
              </div>
            </button>

            {/* Admin Dashboard button if Admin */}
            {isAdmin && (
              <button
                onClick={() => setCurrentView('admin')}
                className={`p-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all ${
                  currentView === 'admin'
                    ? 'bg-[#0B1B36] text-[#F5D68B] shadow-md border border-[#D4A853]/50'
                    : 'bg-[#FDF8EC] text-[#D4A853] border border-[#E5C989] hover:bg-[#F9ECC7]'
                }`}
                title="لوحة تحكم المدير"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">لوحة الإدارة</span>
              </button>
            )}

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-slate-200 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في المتجر..."
                className="w-full bg-slate-100 text-slate-900 text-sm py-2 pr-10 pl-4 rounded-xl border border-slate-200 focus:border-[#D4A853]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </form>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  setCurrentView('external-request');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FDF8EC] border border-[#E5C989] text-[#070F1E] font-bold text-xs"
              >
                <LinkIcon className="w-4 h-4 text-[#D4A853]" />
                <span>أرسل رابط منتج خارجي</span>
              </button>
              <button
                onClick={() => {
                  setCurrentView('categories');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs"
              >
                <Sparkles className="w-4 h-4 text-[#0B1B36]" />
                <span>جميع الأقسام</span>
              </button>
              <button
                onClick={() => {
                  setCurrentView('orders');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs"
              >
                <ShoppingBag className="w-4 h-4 text-[#0B1B36]" />
                <span>طلباتي وتتبع الشحن</span>
              </button>
              <button
                onClick={() => {
                  setCurrentView('requests');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs"
              >
                <CheckCircle className="w-4 h-4 text-[#D4A853]" />
                <span>طلبات التوفير المرسلة</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Secondary Category Navigation Bar (Desktop) */}
      <div className="hidden md:block bg-gradient-to-r from-slate-50 via-white to-slate-50 border-t border-slate-200/80 px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-semibold text-slate-700 overflow-x-auto no-scrollbar gap-6">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentView('home')}
              className={`hover:text-[#0B1B36] transition-colors py-1 ${
                currentView === 'home' ? 'text-[#0B1B36] border-b-2 border-[#D4A853] font-black' : ''
              }`}
            >
              الرئيسية
            </button>
            <button
              onClick={() => setCurrentView('categories')}
              className={`hover:text-[#0B1B36] transition-colors py-1 ${
                currentView === 'categories' ? 'text-[#0B1B36] border-b-2 border-[#D4A853] font-black' : ''
              }`}
            >
              الأقسام
            </button>
            <button
              onClick={() => setCurrentView('deals')}
              className={`hover:text-[#0B1B36] transition-colors py-1 flex items-center gap-1.5 text-[#D4A853] font-bold ${
                currentView === 'deals' ? 'border-b-2 border-[#D4A853] font-black' : ''
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#D4A853] animate-ping"></span>
              العروض والتخفيضات
            </button>
            <button
              onClick={() => setCurrentView('external-request')}
              className={`hover:text-[#0B1B36] transition-colors py-1 text-[#0B1B36] font-bold ${
                currentView === 'external-request' ? 'border-b-2 border-[#D4A853] font-black' : ''
              }`}
            >
              خدمة «اخترها ونحن نوصلها»
            </button>
            <button
              onClick={() => setCurrentView('orders')}
              className="hover:text-[#0B1B36] transition-colors py-1"
            >
              تتبع الطلبات
            </button>
            <button
              onClick={() => setCurrentView('contact')}
              className="hover:text-[#0B1B36] transition-colors py-1"
            >
              تواصل معنا
            </button>
          </div>

          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <span className="text-[#D4A853] font-bold">شحن مجاني</span>
            <span>للطلبات فوق {settings.freeDeliveryThreshold} {settings.currency}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

