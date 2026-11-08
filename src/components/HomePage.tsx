import React from 'react';
import {
  Flame,
  Sparkles,
  TrendingUp,
  Zap,
  ArrowLeft,
  Link2,
  ChevronLeft,
  Cpu,
  Smartphone,
  Shirt,
  ShoppingBag,
  Home,
  Utensils,
  Watch,
  Gift,
  Package,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { HeroSlider } from './HeroSlider';
import { PickItDeliverItBanner } from './PickItDeliverItBanner';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface HomePageProps {
  onSelectProduct: (p: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectProduct }) => {
  const {
    products,
    categories,
    setCurrentView,
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
      case 'Watch':
        return <Watch className="w-5 h-5" />;
      case 'Gift':
        return <Gift className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  // Curated product slices
  const hotDeals = products.filter((p) => p.isDeal || (p.discountPercent && p.discountPercent > 0)).slice(0, 4);
  const bestSellers = [...products].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0)).slice(0, 4);
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const recommended = [...products].sort(() => 0.5 - Math.random()).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-10">
      {/* 1. Dynamic Hero Slider */}
      <HeroSlider />

      {/* 2. Interactive Category Pills Scroll */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4A853]" />
            <h2 className="font-black text-lg sm:text-xl text-slate-900">
              تصفح الأقسام الرئيسية
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('categories')}
            className="text-xs font-bold text-[#0B1B36] hover:text-[#D4A853] flex items-center gap-1 transition-colors"
          >
            <span>عرض الكل</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategorySlug(cat.id);
                setCurrentView('categories');
              }}
              className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white border border-slate-200/90 hover:border-[#D4A853] hover:shadow-md hover:-translate-y-0.5 text-slate-800 transition-all shrink-0 select-none group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-[#FDF8EC] text-[#0B1B36] border border-[#E5C989]/70 flex items-center justify-center group-hover:scale-110 group-hover:bg-gold-gradient group-hover:text-[#070F1E] transition-all shadow-xs">
                {getCategoryIcon(cat.icon)}
              </div>
              <span className="font-bold text-xs whitespace-nowrap">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Centerpiece Service: «اخترها… ونحن نوصلها!» */}
      <PickItDeliverItBanner />

      {/* 4. Hot Deals Section (العروض والخصومات الكبرى) */}
      {hotDeals.length > 0 && (
        <section className="bg-gradient-to-b from-[#FDF8EC] via-white to-transparent p-5 sm:p-7 rounded-3xl border border-[#E5C989] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gold-gradient text-[#070F1E] flex items-center justify-center font-bold shadow-sm">
                <Flame className="w-5 h-5 fill-[#070F1E]" />
              </div>
              <div>
                <h2 className="font-black text-lg sm:text-xl text-slate-900">
                  عروض وتخفيضات كبرى
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  تخفيضات استثنائية لفترة محدودة بخصومات حقيقية تصل إلى 45%
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('deals')}
              className="text-xs font-bold text-[#0B1B36] hover:text-[#D4A853] flex items-center gap-1 transition-colors"
            >
              <span>مشاهدة كل العروض</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {hotDeals.map((prod) => (
              <ProductCard key={prod.id} product={prod} onSelect={onSelectProduct} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Most Demanded Products (الأكثر طلباً) */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0B1B36] text-[#F5D68B] flex items-center justify-center font-bold shadow-sm border border-[#D4A853]/30">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-lg sm:text-xl text-slate-900">
                المنتجات الأكثر طلباً
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                الخيارات المفضلة والأعلى تقييماً من قِبل عملاء متجر الوقزة
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('categories')}
            className="text-xs font-bold text-[#0B1B36] hover:text-[#D4A853] flex items-center gap-1 transition-colors"
          >
            <span>المزيد</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((prod) => (
            <ProductCard key={prod.id} product={prod} onSelect={onSelectProduct} />
          ))}
        </div>
      </section>

      {/* 6. Promotional Mid-Page Banner in Deep Navy & Warm Gold */}
      <div className="bg-gradient-to-r from-[#070F1E] via-[#0B1B36] to-[#162E56] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border border-[#D4A853]/30 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#D4A853]/15 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-xl text-center md:text-right">
          <span className="text-xs font-bold text-[#070F1E] bg-gold-gradient px-3.5 py-1 rounded-full shadow-sm inline-block mb-2.5">
            خدمة استثنائية
          </span>
          <h3 className="text-xl sm:text-2xl font-black mb-2">
            لم تجد المنتج الذي تبحث عنه؟
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            لا تقلق! من خلال خدمة «أرسل رابط المنتج» نوفر لك أي سلعة من أي متجر محلي أو عالمي ونتكفل بشرائها وتوصيلها حتى باب منزلك مع فحص الجودة وضمان الاستلام.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('external-request')}
          className="relative z-10 flex items-center gap-2 bg-gold-gradient hover:bg-gold-gradient-hover text-[#070F1E] font-black text-sm px-7 py-3.5 rounded-2xl shadow-lg shadow-[#D4A853]/35 hover:scale-103 active:scale-98 transition-all shrink-0"
        >
          <Link2 className="w-5 h-5 stroke-[2.5]" />
          <span>أرسل رابط السلعة الآن</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      {/* 7. Featured Products (منتجات مميزة) */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FDF8EC] text-[#D4A853] border border-[#E5C989] flex items-center justify-center font-bold shadow-xs">
              <Zap className="w-5 h-5 fill-[#D4A853]" />
            </div>
            <div>
              <h2 className="font-black text-lg sm:text-xl text-slate-900">
                تشكيلة مختارة لك
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                منتجات أصلية ذات جودة عالية تناسب مختلف الأذواق
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('categories')}
            className="text-xs font-bold text-[#0B1B36] hover:text-[#D4A853] flex items-center gap-1 transition-colors"
          >
            <span>عرض الجميع</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} onSelect={onSelectProduct} />
          ))}
        </div>
      </section>

      {/* 8. Recommended Products */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0B1B36] text-[#F5D68B] border border-[#D4A853]/30 flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5 text-[#F5D68B]" />
            </div>
            <div>
              <h2 className="font-black text-lg sm:text-xl text-slate-900">
                مقترحات متجر الوقزة
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                منتجات جديدة وصلت حديثاً إلى المستودعات
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {recommended.map((prod) => (
            <ProductCard key={prod.id} product={prod} onSelect={onSelectProduct} />
          ))}
        </div>
      </section>
    </div>
  );
};
