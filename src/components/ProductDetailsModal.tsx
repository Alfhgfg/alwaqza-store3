import React, { useState } from 'react';
import { X, Heart, Star, ShoppingBag, Truck, ShieldCheck, Check } from 'lucide-react';
import { Product } from '../types';
import { BRAND } from '../constants/brand';
import { useStore } from '../context/StoreContext';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [selectedImg, setSelectedImg] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const activeImage = selectedImg || product.image;
  const isWish = isInWishlist(product.id);
  const allImages = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-right">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gallery */}
          <div className="flex flex-col gap-3">
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {allImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 ${
                      activeImage === img ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  {product.badge || 'متوفر بالمخزون'}
                </span>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-slate-800">{product.rating}</span>
                  <span className="text-xs text-slate-400">({product.ratingCount} تقييم)</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-3 leading-snug">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-black text-[#070F1E]">
                  {product.price.toLocaleString()} {BRAND.currency}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {product.originalPrice.toLocaleString()} {BRAND.currency}
                  </span>
                )}
                {product.discountPercentage && (
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                    خصم {product.discountPercentage}%
                  </span>
                )}
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Assurances */}
              <div className="space-y-2 border-y border-slate-100 py-3 mb-6 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-600" />
                  <span>توصيل سريع لجميع المحافظات خلال 24 - 48 ساعة</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>ضمان أصلي 100% وإمكانية الفحص والمعاينة قبل الدفع</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-200"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-extrabold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-200"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${
                    isWish
                      ? 'border-red-300 bg-red-50 text-red-500'
                      : 'border-slate-300 hover:bg-slate-50 text-slate-600'
                  }`}
                  aria-label="المفضلة"
                >
                  <Heart className={`w-5 h-5 ${isWish ? 'fill-red-500' : ''}`} />
                </button>
              </div>

              <button
                onClick={handleAdd}
                className={`w-full py-3.5 rounded-xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#070F1E] hover:bg-amber-500 hover:text-slate-950 text-white'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>تمت الإضافة للسلة بنجاح</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>إضافة إلى السلة ({ (product.price * quantity).toLocaleString() } {BRAND.currency})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
