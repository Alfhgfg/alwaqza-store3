import React from 'react';
import { Heart, ShoppingBag, Star, Zap } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart, toggleWishlist, isWishlisted, formatPrice } = useStore();
  const wishlisted = isWishlisted(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#D4A853]/70 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
    >
      {/* Top Image area */}
      <div className="relative aspect-square w-full bg-slate-100/80 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
        />

        {/* Badges on top right */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white text-[11px] font-black px-2.5 py-1 rounded-xl shadow-sm border border-white/20">
              خصم {product.discountPercent}%
            </span>
          )}
          {product.isDeal && (
            <span className="bg-gold-gradient text-[#070F1E] text-[10px] font-black px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
              <Zap className="w-3 h-3 fill-[#070F1E]" />
              عرض خاص
            </span>
          )}
        </div>

        {/* Wishlist Heart on top left */}
        <button
          onClick={handleHeartClick}
          className={`absolute top-2.5 left-2.5 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-xs ${
            wishlisted
              ? 'bg-[#FDF8EC] text-[#D4A853] scale-110 border border-[#E5C989] shadow-sm'
              : 'bg-white/90 hover:bg-white text-slate-500 hover:text-[#D4A853]'
          }`}
          aria-label="Add to wishlist"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#D4A853]' : ''}`} />
        </button>

        {/* Stock status indicator */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center z-10">
            <span className="bg-[#0B1B36] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md border border-slate-700">
              نفدت الكمية
            </span>
          </div>
        )}
      </div>

      {/* Details Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center text-[#D4A853]">
              <Star className="w-3.5 h-3.5 fill-[#D4A853] text-[#D4A853]" />
            </div>
            <span className="text-xs font-bold text-slate-800">
              {product.rating || '4.8'}
            </span>
            <span className="text-[11px] text-slate-400">
              ({product.reviewCount || '50+'})
            </span>
            {product.salesCount && (
              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md mr-auto font-bold border border-emerald-200/50">
                {product.salesCount} طلب
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-[#0B1B36] transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Pricing & Add to Cart button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-black text-base sm:text-lg text-[#0B1B36]">
                {formatPrice(product.price)}
              </span>
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
              product.inStock
                ? 'bg-[#0B1B36] hover:bg-[#162E56] text-[#F5D68B] shadow-md shadow-[#0B1B36]/25 hover:shadow-lg hover:shadow-[#0B1B36]/35 active:scale-95 border border-[#D4A853]/20'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            title="أضف للسلة"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>
      </div>
    </div>
  );
};
