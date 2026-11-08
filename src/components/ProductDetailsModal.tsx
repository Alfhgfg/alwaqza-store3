import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  Check,
  Zap,
  Share2,
} from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
  onSelectProduct: (p: Product) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onSelectProduct,
}) => {
  const {
    addToCart,
    toggleWishlist,
    isWishlisted,
    formatPrice,
    setCurrentView,
    products,
    settings,
    currentUser,
    userProfile,
    getProductReviews,
    addReview,
  } = useStore();

  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors?.[0] || ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes?.[0] || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [addedToast, setAddedToast] = useState<boolean>(false);

  // Reviews state
  const productReviews = getProductReviews(product.id);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState(userProfile?.name || '');
  const [reviewComment, setReviewComment] = useState('');

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    await addReview({
      productId: product.id,
      userId: currentUser?.uid || 'guest',
      userName: reviewName.trim() || 'عميل متجر الوقزة',
      rating: reviewRating,
      comment: reviewComment.trim(),
      verifiedPurchase: true,
    });
    setReviewComment('');
    setShowReviewForm(false);
  };

  const imagesList = product.images && product.images.length > 0 ? product.images : [product.image];
  const wishlisted = isWishlisted(product.id);

  // Similar products from same category
  const similarProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    onClose();
    setCurrentView('checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `شاهد «${product.name}» على متجر الوقزة!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ رابط المنتج إلى الحافظة!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-auto border border-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all shadow-xs"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left/Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square w-full rounded-2xl bg-slate-100 overflow-hidden relative border border-slate-200">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                {product.discountPercent && product.discountPercent > 0 && (
                  <span className="absolute top-3 right-3 bg-[#0F1E36] text-[#DFBA6F] text-xs font-black px-3 py-1.5 rounded-xl shadow-md border border-[#C59B4B]/30">
                    وفر {product.discountPercent}%
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {imagesList.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {imagesList.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImage === img
                          ? 'border-[#C59B4B] shadow-md ring-2 ring-[#C59B4B]/30'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right/Info Section */}
            <div className="flex flex-col justify-between space-y-6">
              <div>
                {/* Brand & Share */}
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-xs font-bold text-[#0F1E36] bg-[#FBF6EB] border border-[#E8D2A2] px-2.5 py-1 rounded-lg">
                    منتج أصلي مضمون 100%
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShare}
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                      title="مشاركة المنتج"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-2 rounded-xl transition-colors ${
                        wishlisted
                          ? 'text-[#D4A853] bg-[#FDF8EC] border border-[#E5C989]'
                          : 'text-slate-500 hover:text-[#D4A853] hover:bg-slate-100'
                      }`}
                      title="إضافة للمفضلة"
                    >
                      <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#D4A853]' : ''}`} />
                    </button>
                  </div>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug mb-3">
                  {product.name}
                </h1>

                {/* Rating & Stock */}
                <div className="flex items-center gap-4 text-xs mb-4">
                  <div className="flex items-center gap-1 text-[#D4A853]">
                    <Star className="w-4 h-4 fill-[#D4A853] text-[#D4A853]" />
                    <span className="font-bold text-slate-800">{product.rating || '4.8'}</span>
                    <span className="text-slate-400">({product.reviewCount || 50} تقييم)</span>
                  </div>

                  <span className="text-slate-300">|</span>

                  <div>
                    {product.inStock ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        متوفر في المستودع ({product.stockCount} قطعة)
                      </span>
                    ) : (
                      <span className="text-rose-600 font-bold">غير متوفر حالياً</span>
                    )}
                  </div>
                </div>

                {/* Pricing Box */}
                <div className="bg-gradient-to-r from-[#FDF8EC] via-white to-slate-50 rounded-2xl p-4 border border-[#E5C989]/80 mb-6 flex items-baseline justify-between shadow-xs">
                  <div>
                    <span className="text-xs text-slate-400 block mb-0.5 font-medium">السعر الحالي:</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-[#0B1B36]">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-slate-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-left text-xs text-slate-500">
                    <span className="text-[#D4A853] font-bold">شامل الضريبة وفحص الجودة</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    تفاصيل ومواصفات المنتج:
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>

                {/* Colors options */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-4">
                    <span className="text-xs font-bold text-slate-700 block mb-2">
                      اللون المختار: <span className="text-[#0B1B36] font-bold">{selectedColor}</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((c) => (
                        <button
                          key={c}
                          onClick={() => setSelectedColor(c)}
                          className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all ${
                            selectedColor === c
                              ? 'border-[#0B1B36] bg-[#0B1B36] text-[#F5D68B] font-bold shadow-xs'
                              : 'border-slate-200 text-slate-700 hover:border-slate-400'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes options */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-6">
                    <span className="text-xs font-bold text-slate-700 block mb-2">
                      المقاس: <span className="text-[#0B1B36] font-bold">{selectedSize}</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all ${
                            selectedSize === s
                              ? 'border-[#0B1B36] bg-[#0B1B36] text-[#F5D68B] font-bold shadow-xs'
                              : 'border-slate-200 text-slate-700 hover:border-slate-400'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity and Actions */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-slate-700">الكمية:</span>
                    <div className="flex items-center border border-slate-200 rounded-2xl p-1 bg-slate-50">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 shadow-xs"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center font-bold text-sm text-slate-800">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={!product.inStock}
                      className="flex items-center justify-center gap-2 bg-[#0B1B36] hover:bg-[#162E56] disabled:bg-slate-300 text-[#F5D68B] font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-[#0B1B36]/25 active:scale-98 transition-all border border-[#D4A853]/30"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      <span>{addedToast ? 'تمت الإضافة بنجاح ✓' : 'أضف إلى السلة'}</span>
                    </button>

                    <button
                      onClick={handleBuyNow}
                      disabled={!product.inStock}
                      className="flex items-center justify-center gap-2 bg-gold-gradient hover:bg-gold-gradient-hover disabled:bg-slate-300 text-[#070F1E] font-black py-3.5 px-6 rounded-2xl shadow-lg shadow-[#D4A853]/30 active:scale-98 transition-all"
                    >
                      <Zap className="w-5 h-5 fill-[#070F1E]" />
                      <span>اطلب الآن (شراء فوري)</span>
                    </button>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 pt-6 mt-6 border-t border-slate-100 text-center">
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <Truck className="w-5 h-5 text-[#0B1B36] mx-auto mb-1" />
                    <p className="text-[11px] font-bold text-slate-800">توصيل سريع</p>
                    <p className="text-[10px] text-slate-400">لباب منزلك</p>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                    <p className="text-[11px] font-bold text-slate-800">فحص الجودة</p>
                    <p className="text-[10px] text-slate-400">أصلي 100%</p>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <RotateCcw className="w-5 h-5 text-[#D4A853] mx-auto mb-1" />
                    <p className="text-[11px] font-bold text-slate-800">استرجاع سهل</p>
                    <p className="text-[10px] text-slate-400">خلال 3 أيام</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews & Ratings Section */}
          <div className="mt-10 pt-8 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Star className="w-5 h-5 fill-[#C59B4B] text-[#C59B4B]" />
                  <span>آراء وتقييمات العملاء</span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                    ({productReviews.length})
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  تقييم عام: {product.rating || '5.0'} من 5 نجوم بناءً على تجارب المشترين
                </p>
              </div>

              {!showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="bg-[#0F1E36] hover:bg-[#1A3258] text-[#DFBA6F] text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Star className="w-4 h-4 fill-[#DFBA6F]" />
                  <span>أضف تقييمك للمنتج</span>
                </button>
              )}
            </div>

            {/* Add Review Form */}
            {showReviewForm && (
              <form onSubmit={handleAddReview} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6 text-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-900">تقييم جديد للمنتج</span>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    إلغاء
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">تقييمك بالنجوم:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 text-[#C59B4B] hover:scale-110 transition-transform"
                      >
                        <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-[#C59B4B]' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">اسمك الكريم</label>
                    <input
                      type="text"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="اسمك أو لقبك"
                      className="w-full bg-white border border-slate-300 p-2.5 rounded-xl focus:border-[#0F1E36]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">تجربتك ورأيك الصريح في المنتج</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="اكتب ملاحظاتك عن جودة السلعة وسرعة التوصيل..."
                    className="w-full bg-white border border-slate-300 p-2.5 rounded-xl focus:border-[#0F1E36]"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#0F1E36] text-[#DFBA6F] font-bold px-5 py-2.5 rounded-xl shadow-xs hover:bg-[#1A3258] transition-all"
                >
                  نشر التقييم
                </button>
              </form>
            )}

            {/* Reviews List */}
            {productReviews.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center bg-slate-50 rounded-2xl border border-slate-100">
                كن أول من يقيم هذا المنتج ويشارك تجربته مع عملاء متجر الوقزة!
              </p>
            ) : (
              <div className="space-y-3">
                {productReviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.2 rounded-md">
                            مشتري مؤكد ✓
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5 text-[#C59B4B]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-[#C59B4B]' : 'text-slate-200'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-slate-400 block">
                      {new Date(rev.createdAt).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="font-bold text-lg text-slate-900 mb-4">منتجات مشابهة قد تعجبك:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {similarProducts.map((sp) => (
                  <ProductCard
                    key={sp.id}
                    product={sp}
                    onSelect={(p) => {
                      onSelectProduct(p);
                      setSelectedImage(p.image);
                      setQuantity(1);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
