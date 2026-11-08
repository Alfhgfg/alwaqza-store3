import React from 'react';
import {
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  RotateCcw,
  Link2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BRAND } from '../constants/brand';

export const Footer: React.FC = () => {
  const { settings, setCurrentView } = useStore();

  return (
    <footer className="bg-[#070F1E] text-slate-300 pt-12 pb-24 md:pb-12 border-t border-[#D4A853]/20 text-xs">
      {/* Top Value Propositions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 border-b border-slate-800/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#0B1B36]/80 border border-slate-700/60 hover:border-[#D4A853]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#070F1E] text-[#F5D68B] flex items-center justify-center shrink-0 border border-[#D4A853]/35 shadow-xs">
              <Link2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">اخترها ونحن نوصلها</h4>
              <p className="text-slate-400 text-[11px]">وفر أي منتج من المواقع العالمية</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#0B1B36]/80 border border-slate-700/60 hover:border-cyan-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#070F1E] text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-500/35 shadow-xs">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">توصيل سريع وآمن</h4>
              <p className="text-slate-400 text-[11px]">مباشرة إلى باب منزلك أو عملك</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#0B1B36]/80 border border-slate-700/60 hover:border-emerald-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#070F1E] text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/35 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">فحص وأصالة 100%</h4>
              <p className="text-slate-400 text-[11px]">نتأكد من جودة ومواصفات طلبك</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#0B1B36]/80 border border-slate-700/60 hover:border-[#D4A853]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#070F1E] text-[#F5D68B] flex items-center justify-center shrink-0 border border-[#D4A853]/35 shadow-xs">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">الدفع عند الاستلام</h4>
              <p className="text-slate-400 text-[11px]">ادفع براحة عند فحص واستلام شحنتك</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info with Official Logo */}
          <div className="space-y-4">
            {/* Logo container with bright background card for maximum logo contrast & crispness */}
            <div className="bg-white p-2.5 rounded-2xl inline-block shadow-md max-w-[200px]">
              <img
                src={BRAND.logoUrl}
                alt={BRAND.name}
                className="h-10 w-auto object-contain"
              />
            </div>

            <p className="text-slate-300 text-xs leading-relaxed font-medium">
              «{settings.storeSlogan}»
              <br />
              {settings.tagline}
            </p>

            <div className="pt-2 text-slate-400 space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>واتساب: {settings.whatsapp}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#DFBA6F]" />
                <span>البريد: {settings.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">روابط سريعة</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => setCurrentView('home')} className="hover:text-white transition-colors">
                  الصفحة الرئيسية
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('categories')} className="hover:text-white transition-colors">
                  أقسام المنتجات
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('external-request')} className="hover:text-white text-[#DFBA6F] font-bold transition-colors">
                  خدمة «أرسل رابط المنتج»
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('deals')} className="hover:text-white transition-colors">
                  العروض والخصومات الكبرى
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('orders')} className="hover:text-white transition-colors">
                  تتبع الشحنات والطلبات
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">خدمة العملاء</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => setCurrentView('contact')} className="hover:text-white transition-colors">
                  تواصل مع خدمة العملاء
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('requests')} className="hover:text-white transition-colors">
                  متابعة طلبات التوفير
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('wishlist')} className="hover:text-white transition-colors">
                  قائمة المنتجات المفضلة
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('returns')} className="hover:text-white transition-colors">
                  سياسة الاسترجاع والاستبدال
                </button>
              </li>
            </ul>
          </div>

          {/* Policies & Legal */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">الضمان والسياسات</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => setCurrentView('privacy')} className="hover:text-white transition-colors">
                  سياسة الخصوصية
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('terms')} className="hover:text-white transition-colors">
                  الشروط والأحكام
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('contact')} className="hover:text-white transition-colors">
                  مناطق وتكاليف التوصيل
                </button>
              </li>
            </ul>

            <div className="pt-2">
              <span className="text-[11px] text-slate-500 block mb-1">طرق الدفع المدعومة:</span>
              <div className="flex flex-wrap gap-2 text-[10px] text-slate-300 font-medium">
                <span className="bg-[#0F1E36] px-2 py-1 rounded-md border border-slate-700">الدفع عند الاستلام</span>
                <span className="bg-[#0F1E36] px-2 py-1 rounded-md border border-slate-700">الكريمي</span>
                <span className="bg-[#0F1E36] px-2 py-1 rounded-md border border-slate-700">ون كاش</span>
                <span className="bg-[#0F1E36] px-2 py-1 rounded-md border border-slate-700">مدى</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-[#0F1E36] flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
        <p>© 2026 {BRAND.fullName}. جميع الحقوق محفوظة.</p>
        <p className="text-[#DFBA6F] font-semibold">«{BRAND.tagline}»</p>
      </div>
    </footer>
  );
};
