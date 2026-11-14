import React from 'react';
import { ArrowLeft, Sparkles, TrendingUp, ShieldCheck, Truck, Headphones, RotateCcw } from 'lucide-react';
import { HeroSlider } from './HeroSlider';
import { PickItDeliverItBanner } from './PickItDeliverItBanner';
import { ProductCard } from './ProductCard';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

interface HomePageProps {
  onNavigate: (view: string, category?: string) => void;
  onOpenProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenProduct }) => {
  const { products, categories } = useStore();

  const featured = products.filter(p => p.isFeatured);
  const bestsellers = products.filter(p => p.isBestseller);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Carousel */}
      <div className="px-4">
        <HeroSlider onNavigate={onNavigate} />
      </div>

      {/* Features strip */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-right">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">توصيل سريع</h4>
              <p className="text-[11px] text-slate-500">لجميع المحافظات اليمنية</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">أصالة وضمان</h4>
              <p className="text-[11px] text-slate-500">منتجات أصلية ومفحوصة</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">الدفع عند الاستلام</h4>
              <p className="text-[11px] text-slate-500">افحص ثم ادفع بأمان</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">خدمة عملاء راقية</h4>
              <p className="text-[11px] text-slate-500">متواجدون دائماً لخدمتكم</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pick it and Deliver it Banner */}
      <PickItDeliverItBanner onOpen={() => onNavigate('external-request')} />

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>تسوق حسب الأقسام</span>
          </h2>
          <button
            onClick={() => onNavigate('categories')}
            className="text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            <span>عرض الكل</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => onNavigate('categories', cat.slug)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-amber-500/60 shadow-sm hover:shadow-lg transition-all duration-300 text-center p-3 sm:p-4 flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-100 ring-2 ring-amber-500/20 group-hover:ring-amber-500 group-hover:scale-105 transition-all">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  {cat.itemCount} منتج
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <span>منتجات مميزة ومختارة</span>
          </h2>
          <button
            onClick={() => onNavigate('search')}
            className="text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            <span>المزيد</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {featured.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetails={onOpenProduct}
            />
          ))}
        </div>
      </section>

      {/* Bestsellers Section */}
      {bestsellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <span className="text-amber-500 font-black">★</span>
              <span>الأكثر طلباً ومبيعاً</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {bestsellers.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetails={onOpenProduct}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
