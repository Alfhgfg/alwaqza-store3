import React from 'react';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface WishlistPageProps {
  onBack: () => void;
  onOpenProduct: (product: Product) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onBack, onOpenProduct }) => {
  const { wishlist, products } = useStore();
  const wishProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-right">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowRight className="w-4 h-4" />
        <span>العودة للرئيسية</span>
      </button>

      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6">
        قائمة أمنياتي ({wishProducts.length})
      </h1>

      {wishProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400">
          <Heart className="w-16 h-16 mx-auto mb-3 opacity-40 text-red-500" />
          <p className="text-sm">قائمة المفضلة فارغة حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {wishProducts.map(prod => (
            <ProductCard
              key={prod.id}
              product={prod}
              onOpenDetails={onOpenProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};
