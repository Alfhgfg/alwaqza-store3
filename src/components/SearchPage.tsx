import React, { useState, useMemo } from 'react';
import { Search, Package, Link2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface SearchPageProps {
  onSelectProduct: (p: Product) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onSelectProduct }) => {
  const {
    products,
    categories,
    searchQuery,
    setSearchQuery,
    setCurrentView,
  } = useStore();

  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'sales'>('featured');
  const [onlyDeals, setOnlyDeals] = useState<boolean>(false);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);

  const filteredProducts = useMemo(() => {
    let result = products;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCat !== 'all') {
      result = result.filter((p) => p.category === selectedCat);
    }

    // Deals filter
    if (onlyDeals) {
      result = result.filter((p) => p.isDeal || (p.discountPercent && p.discountPercent > 0));
    }

    // In Stock filter
    if (onlyInStock) {
      result = result.filter((p) => p.inStock);
    }

    // Sorting
    const sorted = [...result];
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'sales') {
      sorted.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
    }

    return sorted;
  }, [products, searchQuery, selectedCat, onlyDeals, onlyInStock, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Search Bar Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs mb-8">
        <div className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم، الماركة، أو المواصفات..."
            className="w-full bg-slate-50 border border-slate-300 focus:border-[#0F1E36] focus:bg-white text-slate-900 text-sm py-3.5 pr-11 pl-4 rounded-2xl focus:outline-hidden"
          />
          <Search className="w-5 h-5 text-slate-400 absolute right-4 top-4" />
        </div>

        {/* Filters and Sort Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="bg-slate-100 border border-slate-300 py-2 px-3 rounded-xl font-medium text-slate-700 focus:border-[#0F1E36] focus:outline-hidden"
            >
              <option value="all">جميع الأقسام</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-100 border border-slate-300 py-2 px-3 rounded-xl font-medium text-slate-700 focus:border-[#0F1E36] focus:outline-hidden"
            >
              <option value="featured">المقترح / المميز</option>
              <option value="sales">الأكثر طلباً ومبيعاً</option>
              <option value="price-asc">السعر: من الأقل للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأقل</option>
            </select>
          </div>

          <div className="flex items-center gap-4 text-slate-700 font-medium">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyDeals}
                onChange={(e) => setOnlyDeals(e.target.checked)}
                className="accent-[#D4A853] rounded"
              />
              <span>عروض وتخفيضات فقط</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="accent-[#0B1B36] rounded"
              />
              <span>المتوفر في المستودع</span>
            </label>
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-700">
            نتائج البحث: <span className="text-[#0B1B36] font-black">({filteredProducts.length})</span> منتج
          </h2>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center max-w-lg mx-auto shadow-xs">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-base text-slate-800 mb-1">
              لم نعثر على نتائج مطابقة لبحثك
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              هل تبحث عن منتج معين ولم تجده؟ يمكنك استخدام خدمة «أرسل رابطك ونحن نوفر لك المنتج» وسنوفره لك من أي موقع خارجي!
            </p>
            <button
              onClick={() => setCurrentView('external-request')}
              className="bg-gold-gradient hover:bg-gold-gradient-hover text-[#070F1E] font-black text-xs px-6 py-3 rounded-2xl shadow-md shadow-[#D4A853]/25 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Link2 className="w-4 h-4" />
              <span>طلب توفير هذا المنتج من رابط خارجي</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
