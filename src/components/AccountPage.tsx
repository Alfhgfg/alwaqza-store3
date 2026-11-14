import React from 'react';
import { User, Package, Sparkles, Heart, Shield, Phone, Mail, MapPin, ChevronLeft } from 'lucide-react';
import { BRAND } from '../constants/brand';
import { useStore } from '../context/StoreContext';

interface AccountPageProps {
  onNavigate: (view: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate }) => {
  const { orders, externalRequests, wishlist } = useStore();

  const menu = [
    { label: 'طلباتي في المتجر', icon: Package, badge: orders.length.toString(), action: () => onNavigate('orders') },
    { label: 'طلبات الشراء الخارجي ("اخترها")', icon: Sparkles, badge: externalRequests.length.toString(), action: () => onNavigate('my-requests') },
    { label: 'قائمة المفضلة', icon: Heart, badge: wishlist.length.toString(), action: () => onNavigate('wishlist') },
    { label: 'لوحة تحكم المدير', icon: Shield, action: () => onNavigate('admin-login'), isAccent: true },
    { label: 'خدمة العملاء والاتصال', icon: Phone, action: () => onNavigate('contact') },
    { label: 'الشروط وسياسة الاسترجاع', icon: Mail, action: () => onNavigate('terms') },
  ];

  return (
    <div className="max-w-xl mx-auto px-4 py-8 text-right">
      {/* User Header Profile */}
      <div className="bg-[#070F1E] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/20 mb-6 text-center relative overflow-hidden">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5 mx-auto mb-4 shadow-lg shadow-amber-500/30">
          <div className="w-full h-full bg-[#070F1E] rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-amber-400" />
          </div>
        </div>
        <h2 className="text-xl font-extrabold mb-1">عميل متجر الوقزة المتميز</h2>
        <p className="text-xs text-amber-300/80 mb-3 font-medium">أهلاً بك في عالم التسوق الفاخر</p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>الجمهورية اليمنية</span>
        </div>
      </div>

      {/* Menu Options */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-sm">
        {menu.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={item.action}
              className={`w-full flex items-center justify-between p-4 sm:p-5 hover:bg-slate-50 transition-colors text-right ${
                item.isAccent ? 'bg-amber-50/40 text-amber-900 font-bold' : 'text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  item.isAccent ? 'bg-amber-500/20 text-amber-600' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold">{item.label}</span>
              </div>

              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-black">
                    {item.badge}
                  </span>
                )}
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
