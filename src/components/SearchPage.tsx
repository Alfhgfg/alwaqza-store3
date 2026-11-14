import React, { useState } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface SearchPageProps {
  onOpenProduct: (product: Product) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onOpenProduct }) => {
  const { products } = useStore();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 text-right">
      {/* Search Input Bar */}
      <div className="relative mb-6">
        <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="ابحث عن ساعات، هواتف، عطور، أو أي منتج..."
          className="w-full pr-12 pl-12 py-3.5 rounded-2xl bg-white border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-900 text-sm sm:text-base outline-none shadow-sm transition-all"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter and Count Bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <span className="text-xs sm:text-sm text-slate-500 font-medium">
          تم العثور على <strong className="text-slate-900 font-extrabold">{sorted.length}</strong> منتج
        </span>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-500" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="text-xs sm:text-sm bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 outline-none focus:border-amber-500"
          >
            <option value="default">الترتيب الافتراضي</option>
            <option value="price-asc">السعر: من الأقل للأعلى</option>
            <option value="price-desc">السعر: من الأعلى للأقل</option>
            <option value="rating">الأعلى تقييماً</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {sorted.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
          لم يتم العثور على أي نتائج مطابقة لكلمة البحث "{query}"
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {sorted.map(prod => (
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
