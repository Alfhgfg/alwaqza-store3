import React from 'react';
import { Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface WishlistPageProps {
  onSelectProduct: (p: Product) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onSelectProduct }) => {
  const { wishlist, products, setCurrentView } = useStore();
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  if (wishlistedProducts.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-[#FBF6EB] text-[#C59B4B] border border-[#E8D2A2] rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">قائمة المفضلة فارغة</h2>
        <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto">
          لم تقم بإضافة أي منتجات إلى قائمة أمنياتك بعد. اضغط على رمز القلب في أي منتج لحفظه والرجوع إليه لاحقاً.
        </p>
        <button
          onClick={() => setCurrentView('home')}
          className="bg-[#0F1E36] hover:bg-[#1A3258] text-[#DFBA6F] font-bold text-xs px-6 py-3 rounded-2xl shadow-md transition-all"
        >
          استكشف المنتجات
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">قائمة المفضلة</h1>
          <p className="text-xs text-slate-500">
            لديك {wishlistedProducts.length} منتج محفوظ في قائمة أمنياتك
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlistedProducts.map((p) => (
          <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
        ))}
      </div>
    </div>
  );
};
