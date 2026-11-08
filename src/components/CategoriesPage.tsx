import React from 'react';
import {
  Cpu,
  Smartphone,
  Shirt,
  ShoppingBag,
  Home,
  Utensils,
  Sparkles,
  Watch,
  Gift,
  Package,
  Layers,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface CategoriesPageProps {
  onSelectProduct: (p: Product) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onSelectProduct }) => {
  const {
    categories,
    products,
    selectedCategorySlug,
    setSelectedCategorySlug,
  } = useStore();

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-5 h-5" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5" />;
      case 'Shirt':
        return <Shirt className="w-5 h-5" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5" />;
      case 'Home':
        return <Home className="w-5 h-5" />;
      case 'Utensils':
        return <Utensils className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'Watch':
        return <Watch className="w-5 h-5" />;
      case 'Gift':
        return <Gift className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const filteredProducts = selectedCategorySlug
    ? products.filter((p) => p.category === selectedCategorySlug)
    : products;

  const currentCategory = categories.find((c) => c.id === selectedCategorySlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          أقسام المنتجات في متجر الوقزة
        </h1>
        <p className="text-xs text-slate-500">
          تصفح تشكيلتنا الواسعة المصنفة بعناية لتجد ما تحتاجه بأفضل الأسعار
        </p>
      </div>

      {/* Categories Horizontal Carousel / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-10">
        <button
          onClick={() => setSelectedCategorySlug(null)}
          className={`p-4 rounded-3xl border text-center transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer ${
            selectedCategorySlug === null
              ? 'border-[#D4A853]/60 bg-[#0B1B36] text-[#F5D68B] shadow-lg shadow-[#0B1B36]/30'
              : 'border-slate-200/90 bg-white text-slate-800 hover:border-[#D4A853] hover:shadow-md hover:bg-slate-50'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
              selectedCategorySlug === null
                ? 'bg-white/10 text-[#F5D68B]'
                : 'bg-[#FDF8EC] text-[#0B1B36] border border-[#E5C989]/50'
            }`}
          >
            <Layers className="w-6 h-6" />
          </div>
          <span className="font-bold text-xs sm:text-sm">جميع الأقسام</span>
          <span
            className={`text-[10px] ${
              selectedCategorySlug === null ? 'text-slate-300' : 'text-slate-400'
            }`}
          >
            {products.length} منتج
          </span>
        </button>

        {categories.map((cat) => {
          const count = products.filter((p) => p.category === cat.id).length;
          const isSelected = selectedCategorySlug === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategorySlug(cat.id)}
              className={`p-4 rounded-3xl border text-center transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer ${
                isSelected
                  ? 'border-[#D4A853]/60 bg-[#0B1B36] text-[#F5D68B] shadow-lg shadow-[#0B1B36]/30'
                  : 'border-slate-200/90 bg-white text-slate-800 hover:border-[#D4A853] hover:shadow-md hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                  isSelected ? 'bg-white/10 text-[#F5D68B]' : 'bg-[#FDF8EC] text-[#0B1B36] border border-[#E5C989]/50'
                }`}
              >
                {getCategoryIcon(cat.icon)}
              </div>
              <span className="font-bold text-xs sm:text-sm line-clamp-1">{cat.name}</span>
              <span
                className={`text-[10px] ${
                  isSelected ? 'text-slate-300' : 'text-slate-400'
                }`}
              >
                {count} منتج
              </span>
            </button>
          );
        })}
      </div>

      {/* Products under selected category */}
      <div>
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {currentCategory ? currentCategory.name : 'جميع المنتجات المتوفرة'}
            </h2>
            <span className="text-xs text-slate-400">
              عرض {filteredProducts.length} منتج
            </span>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">لا توجد منتجات في هذا القسم حالياً.</p>
            <p className="text-xs text-slate-400 mt-1">
              يمكنك طلب أي منتج من هذا القسم عبر خدمة «أرسل رابط المنتج» وسنوفره لك فوراً!
            </p>
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
