import React from 'react';
import { Sparkles, Phone, MessageSquare, MapPin, Heart } from 'lucide-react';
import { BRAND } from '../constants/brand';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#070F1E] text-white pt-12 pb-24 md:pb-12 border-t border-amber-500/20 text-right">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        {/* Brand Col */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-base">
              W
            </div>
            <span className="font-extrabold text-lg text-white">{BRAND.name}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            {BRAND.slogan} - وجهتكم الفاخرة للتسوق وخدمة "اخترها ونحن نوصلها" لجميع محافظات اليمن.
          </p>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>تطبيق أندرويد حقيقي متكامل</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-sm text-amber-400 mb-3">روابط هامة</h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-amber-400 transition-colors">
                الرئيسية
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('categories')} className="hover:text-amber-400 transition-colors">
                أقسام المتجر
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('external-request')} className="hover:text-amber-400 transition-colors">
                خدمة اخترها ونحن نوصلها
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('orders')} className="hover:text-amber-400 transition-colors">
                متابعة الطلبات
              </button>
            </li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="font-bold text-sm text-amber-400 mb-3">السياسات والضمان</h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li>
              <button onClick={() => onNavigate('about')} className="hover:text-amber-400 transition-colors">
                عن المتجر
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shipping')} className="hover:text-amber-400 transition-colors">
                الشحن والتوصيل
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('returns')} className="hover:text-amber-400 transition-colors">
                الاستبدال والاسترجاع
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('terms')} className="hover:text-amber-400 transition-colors">
                الشروط والأحكام
              </button>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-bold text-sm text-amber-400 mb-3">تواصل معنا</h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span dir="ltr">{BRAND.phone}</span>
            </li>
            <li className="flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <a href={BRAND.social.whatsapp} target="_blank" rel="noreferrer" className="hover:underline" dir="ltr">
                +{BRAND.whatsapp}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{BRAND.location}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          © {new Date().getFullYear()} {BRAND.name}. جميع الحقوق محفوظة.
        </div>
        <div className="flex items-center gap-1">
          <span>صُمم بفخامة بواسطة</span>
          <strong className="text-amber-400 font-bold">{BRAND.nameEn}</strong>
        </div>
      </div>
    </footer>
  );
};
