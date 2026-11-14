import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface CategoriesPageProps {
  initialCategory?: string;
  onOpenProduct: (product: Product) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ initialCategory, onOpenProduct }) => {
  const { categories, products } = useStore();
  const [selectedCat, setSelectedCat] = useState<string>(initialCategory || 'all');

  const filteredProducts = selectedCat === 'all'
    ? products
    : products.filter(p => p.category === selectedCat);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 text-right">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6">
        أقسام المتجر
      </h1>

      {/* Categories Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
        <button
          onClick={() => setSelectedCat('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
            selectedCat === 'all'
              ? 'bg-[#070F1E] text-amber-400 shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          جميع المنتجات ({products.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.slug)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
              selectedCat === cat.slug
                ? 'bg-[#070F1E] text-amber-400 shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
          لا توجد منتجات متوفرة حالياً في هذا القسم
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map(prod => (
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
