import React from 'react';
import { Home, Grid, Sparkles, ShoppingBag, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface BottomNavProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, setCurrentView }) => {
  const { cartCount } = useStore();

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'categories', label: 'الأقسام', icon: Grid },
    { id: 'external-request', label: 'اخترها', icon: Sparkles, isHighlight: true },
    { id: 'cart', label: 'السلة', icon: ShoppingBag, count: cartCount },
    { id: 'account', label: 'حسابي', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070F1E]/95 backdrop-blur-md border-t border-amber-500/20 pb-safe shadow-2xl">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          if (item.isHighlight) {
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className="relative -top-4 flex flex-col items-center group focus:outline-none"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 scale-105 shadow-amber-500/40 ring-4 ring-[#070F1E]'
                    : 'bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 shadow-amber-500/30'
                }`}>
                  <Icon className="w-6 h-6 animate-pulse" />
                </div>
                <span className={`text-[11px] font-bold mt-1 ${isActive ? 'text-amber-400' : 'text-slate-300'}`}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors relative ${
                isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
