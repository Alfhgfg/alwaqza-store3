import React from 'react';
import { Home, Grid, Link2, ShoppingBag, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const BottomNav: React.FC = () => {
  const { currentView, setCurrentView, cart } = useStore();
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 py-1.5 px-3 md:hidden shadow-xl shadow-slate-900/15">
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {/* Home */}
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
            currentView === 'home' ? 'text-[#0B1B36] font-black' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className={`w-5 h-5 ${currentView === 'home' ? 'stroke-[2.5] text-[#0B1B36]' : ''}`} />
          <span className="text-[10px]">الرئيسية</span>
        </button>

        {/* Categories */}
        <button
          onClick={() => setCurrentView('categories')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
            currentView === 'categories' ? 'text-[#0B1B36] font-black' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Grid className={`w-5 h-5 ${currentView === 'categories' ? 'stroke-[2.5] text-[#0B1B36]' : ''}`} />
          <span className="text-[10px]">الأقسام</span>
        </button>

        {/* Prominent Center Action: "اخترها ونحن نوصلها" with Navy & Gold */}
        <button
          onClick={() => setCurrentView('external-request')}
          className="flex flex-col items-center -top-4 relative group cursor-pointer"
        >
          <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#070F1E] via-[#0B1B36] to-[#D4A853] text-white flex items-center justify-center shadow-xl shadow-[#0B1B36]/40 border-3 border-white ring-2 ring-[#D4A853]/40 group-active:scale-95 group-hover:scale-105 transition-all">
            <Link2 className="w-6 h-6 stroke-[2.5] text-[#F5D68B]" />
          </div>
          <span className="text-[10px] font-black text-[#0B1B36] mt-0.5">
            اخترها!
          </span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setCurrentView('cart')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl relative transition-all ${
            currentView === 'cart' ? 'text-[#0B1B36] font-black' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 ${currentView === 'cart' ? 'stroke-[2.5] text-[#0B1B36]' : ''}`} />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#0B1B36] text-[#F5D68B] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-[#D4A853]/50">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">السلة</span>
        </button>

        {/* Account */}
        <button
          onClick={() => setCurrentView('account')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
            currentView === 'account' ? 'text-[#0B1B36] font-black' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <User className={`w-5 h-5 ${currentView === 'account' ? 'stroke-[2.5] text-[#0B1B36]' : ''}`} />
          <span className="text-[10px]">حسابي</span>
        </button>
      </div>
    </div>
  );
};
