import React, { useState } from 'react';
import {
  User,
  ShoppingBag,
  Link2,
  Heart,
  Bell,
  Shield,
  LogOut,
  LogIn,
  CheckCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BRAND } from '../constants/brand';

interface AccountPageProps {
  onOpenNotifications: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onOpenNotifications }) => {
  const {
    currentUser,
    userProfile,
    isAdmin,
    signInWithGoogle,
    logout,
    toggleAdminDemoMode,
    setCurrentView,
    orders,
    productRequests,
    wishlist,
    unreadNotificationsCount,
  } = useStore();

  const [editName, setEditName] = useState(userProfile?.name || '');
  const [editPhone, setEditPhone] = useState(userProfile?.phone || '');
  const [editAddress, setEditAddress] = useState(userProfile?.address || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Account Hero Card with Brand Logo */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-full bg-[#FBF6EB] text-[#C59B4B] border-2 border-[#E8D2A2] flex items-center justify-center text-xl font-bold overflow-hidden shrink-0 shadow-inner">
          {currentUser?.photoURL ? (
            <img src={currentUser.photoURL} alt="" className="w-full h-full object-cover" />
          ) : (
            <User className="w-10 h-10 text-[#C59B4B]" />
          )}
        </div>

        <div className="flex-1 text-center sm:text-right">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {currentUser ? userProfile?.name : 'مرحباً بك في متجر الوقزة'}
            </h1>
            {isAdmin && (
              <span className="text-xs font-black bg-linear-to-r from-[#DFBA6F] to-[#C59B4B] text-[#081220] px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>مدير النظام</span>
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 mb-4">
            {currentUser ? currentUser.email : 'سجل الدخول لحفظ طلباتك ومتابعة شحناتك بسهولة'}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            {currentUser ? (
              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-xl transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>تسجيل الخروج</span>
              </button>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-2 bg-[#0F1E36] hover:bg-[#1A3258] text-[#DFBA6F] font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-[#0F1E36]/20 active:scale-98 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول السريع بحساب Google</span>
              </button>
            )}

            {isAdmin ? (
              <button
                onClick={() => setCurrentView('admin')}
                className="flex items-center gap-1.5 text-xs font-black text-[#070F1E] bg-gold-gradient px-4 py-2 rounded-xl shadow-xs hover:brightness-105 transition-all cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>لوحة تحكم المدير الرئيسي</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('admin-login')}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-[#D4A853]" />
                <span>بوابة المدير الرئيسي</span>
              </button>
            )}
          </div>
        </div>

        {/* Small Brand Logo Box in Account */}
        <div className="hidden sm:block p-3 rounded-2xl bg-white border border-slate-100 shadow-xs shrink-0 max-w-[140px]">
          <img src={BRAND.logoUrl} alt={BRAND.name} className="w-full h-auto object-contain" />
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => setCurrentView('orders')}
          className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-[#0F1E36] text-center transition-all shadow-xs group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FBF6EB] text-[#0F1E36] flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <span className="font-bold text-xs text-slate-800 block">طلباتي</span>
          <span className="text-[11px] text-slate-400">{orders.length} طلب</span>
        </button>

        <button
          onClick={() => setCurrentView('requests')}
          className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-[#C59B4B] text-center transition-all shadow-xs group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FBF6EB] text-[#C59B4B] flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
            <Link2 className="w-6 h-6" />
          </div>
          <span className="font-bold text-xs text-slate-800 block">طلبات التوفير</span>
          <span className="text-[11px] text-slate-400">{productRequests.length} طلب رابط</span>
        </button>

        <button
          onClick={() => setCurrentView('wishlist')}
          className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-[#C59B4B] text-center transition-all shadow-xs group"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
            <Heart className="w-6 h-6" />
          </div>
          <span className="font-bold text-xs text-slate-800 block">المفضلة</span>
          <span className="text-[11px] text-slate-400">{wishlist.length} منتج</span>
        </button>

        <button
          onClick={onOpenNotifications}
          className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-[#0F1E36] text-center transition-all shadow-xs group relative"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
            <Bell className="w-6 h-6" />
          </div>
          <span className="font-bold text-xs text-slate-800 block">الإشعارات</span>
          <span className="text-[11px] text-slate-400">
            {unreadNotificationsCount > 0 ? `${unreadNotificationsCount} غير مقروء` : 'محدث'}
          </span>
        </button>
      </div>

      {/* Admin Panel Direct Access Card if Admin */}
      {isAdmin && (
        <div className="bg-linear-to-r from-[#081220] via-[#0F1E36] to-[#152B4D] text-white rounded-3xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-slate-700">
          <div className="flex items-center gap-4 text-center sm:text-right">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-r from-[#DFBA6F] to-[#C59B4B] text-[#081220] flex items-center justify-center shrink-0 font-bold">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">لوحة تحكم إدارة المتجر الشاملة</h3>
              <p className="text-xs text-slate-300">
                إدارة المنتجات، الأقسام، الطلبات، روابط العملاء، الإعلانات، والتقارير
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentView('admin')}
            className="bg-linear-to-r from-[#DFBA6F] to-[#C59B4B] text-[#081220] font-black text-xs px-6 py-3 rounded-2xl shadow-md transition-all shrink-0"
          >
            فتح لوحة الإدارة
          </button>
        </div>
      )}

      {/* Profile Information Settings */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <h2 className="text-base font-black text-slate-900 mb-6 pb-3 border-b border-slate-100 flex items-center gap-2">
          <User className="w-5 h-5 text-[#C59B4B]" />
          <span>البيانات الشخصية وعنوان التوصيل المفضل</span>
        </h2>

        {savedSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>تم حفظ البيانات بنجاح!</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">الاسم</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="اسم العميل"
                className="w-full bg-slate-50 border border-slate-300 text-xs p-3 rounded-xl focus:border-[#0F1E36] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">رقم الهاتف</label>
              <input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="+967 770 000 000"
                className="w-full bg-slate-50 border border-slate-300 text-xs p-3 rounded-xl focus:border-[#0F1E36] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">العنوان الافتراضي للتوصيل</label>
            <textarea
              rows={2}
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
              placeholder="المحافظة، المدينة، الحي، رقم الشارع"
              className="w-full bg-slate-50 border border-slate-300 text-xs p-3 rounded-xl focus:border-[#0F1E36] focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-[#0F1E36] hover:bg-[#1A3258] text-[#DFBA6F] font-bold text-xs px-6 py-2.5 rounded-xl transition-all"
            >
              حفظ التعديلات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
