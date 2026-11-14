import React from 'react';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../types';
import { BRAND } from '../constants/brand';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const isWish = isInWishlist(product.id);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-amber-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative text-right">
      {/* Badges */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 items-end">
        {product.badge && (
          <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-[11px] font-extrabold shadow-md">
            {product.badge}
          </span>
        )}
        {product.discountPercentage && (
          <span className="px-2 py-0.5 rounded-lg bg-red-600 text-white text-[11px] font-bold shadow-sm">
            -{product.discountPercentage}%
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={e => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={`absolute top-3 left-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
          isWish
            ? 'bg-red-50 text-red-500'
            : 'bg-white/80 backdrop-blur-sm text-slate-600 hover:text-red-500 hover:bg-white'
        } shadow-md`}
        aria-label="إضافة للمفضلة"
      >
        <Heart className={`w-4 h-4 ${isWish ? 'fill-red-500' : ''}`} />
      </button>

      {/* Product Image */}
      <div
        onClick={() => onOpenDetails(product)}
        className="relative w-full aspect-square bg-slate-100 overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="px-3 py-1.5 rounded-xl bg-white/90 text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-lg">
            <Eye className="w-3.5 h-3.5" />
            <span>نظرة سريعة</span>
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center gap-1 mb-1.5 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-slate-800">{product.rating}</span>
            <span className="text-[11px] text-slate-400">({product.ratingCount})</span>
          </div>

          <h3
            onClick={() => onOpenDetails(product)}
            className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {product.name}
          </h3>
        </div>

        <div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base sm:text-lg font-extrabold text-[#070F1E]">
              {product.price.toLocaleString()} {BRAND.currency}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                {product.originalPrice.toLocaleString()} {BRAND.currency}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>أضف للسلة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
