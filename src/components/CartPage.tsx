import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Truck,
  Tag,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDeliveryFee,
    cartDiscount,
    cartTotal,
    couponCode,
    applyCoupon,
    formatPrice,
    settings,
    setCurrentView,
  } = useStore();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const success = applyCoupon(inputCoupon);
    if (success) {
      setCouponMsg({ text: 'تم تطبيق كود الخصم بنجاح!', isError: false });
    } else {
      setCouponMsg({ text: 'كود الخصم غير صالح أو منتهي الصلاحية.', isError: true });
    }
  };

  const amountNeededForFreeShipping = Math.max(
    0,
    settings.freeDeliveryThreshold - cartSubtotal
  );
  const freeShippingProgress = Math.min(
    100,
    (cartSubtotal / settings.freeDeliveryThreshold) * 100
  );

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 bg-[#FBF6EB] text-[#C59B4B] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#E8D2A2]">
          <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">سلة المشتريات فارغة</h2>
        <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">
          لم تقم بإضافة أي منتجات إلى سلتك حتى الآن. استكشف أفضل المنتجات والعروض المميزة في متجر الوقزة!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setCurrentView('home')}
            className="bg-[#0F1E36] hover:bg-[#1A3258] text-[#DFBA6F] font-bold text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-[#0F1E36]/20 active:scale-98 transition-all"
          >
            تصفح المنتجات
          </button>
          <button
            onClick={() => setCurrentView('external-request')}
            className="bg-linear-to-r from-[#DFBA6F] to-[#C59B4B] text-[#081220] font-black text-sm px-6 py-3.5 rounded-2xl transition-all"
          >
            طلب توفير منتج من رابط خارجي
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">سلة المشتريات</h1>
          <p className="text-xs text-slate-500">
            لديك {cart.reduce((s, i) => s + i.quantity, 0)} منتجات في السلة
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-700 hover:text-rose-900 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>تفريغ السلة</span>
        </button>
      </div>

      {/* Free Shipping Progress bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 mb-8 shadow-xs">
        <div className="flex items-center justify-between mb-2 text-xs">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#C59B4B]" />
            <span className="font-bold text-slate-800">
              {amountNeededForFreeShipping > 0
                ? `أضف بـ ${formatPrice(amountNeededForFreeShipping)} أخرى للحصول على شحن مجاني!`
                : 'تهانينا! حصلت على شحن مجاني لطلبك 🎉'}
            </span>
          </div>
          <span className="font-black text-[#0F1E36]">
            {Math.round(freeShippingProgress)}%
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#070F1E] via-[#0B1B36] to-[#D4A853] rounded-full transition-all duration-500"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Products list */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, index) => (
            <div
              key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${index}`}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-4 hover:border-slate-300 transition-colors"
            >
              {/* Image */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-right w-full">
                <h3 className="font-bold text-sm text-slate-900 line-clamp-2 mb-1.5">
                  {item.product.name}
                </h3>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-500 mb-3">
                  {item.selectedColor && (
                    <span className="bg-slate-100 px-2.5 py-0.5 rounded-md font-medium">
                      اللون: {item.selectedColor}
                    </span>
                  )}
                  {item.selectedSize && (
                    <span className="bg-slate-100 px-2.5 py-0.5 rounded-md font-medium">
                      المقاس: {item.selectedSize}
                    </span>
                  )}
                  <span className="text-[#0F1E36] font-bold">
                    سعر القطعة: {formatPrice(item.product.price)}
                  </span>
                </div>

                {/* Counter & Subtotal */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                    <button
                      onClick={() =>
                        updateCartQuantity(
                          item.product.id,
                          item.quantity - 1,
                          item.selectedColor,
                          item.selectedSize
                        )
                      }
                      className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 shadow-xs"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateCartQuantity(
                          item.product.id,
                          item.quantity + 1,
                          item.selectedColor,
                          item.selectedSize
                        )
                      }
                      className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-black text-base text-[#0F1E36]">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                    <button
                      onClick={() =>
                        removeFromCart(item.product.id, item.selectedColor, item.selectedSize)
                      }
                      className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      title="حذف المنتج"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Continue shopping button */}
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0F1E36] pt-2"
          >
            <ArrowLeft className="w-4 h-4 rotate-180" />
            <span>متابعة التسوق وإضافة منتجات أخرى</span>
          </button>
        </div>

        {/* Summary Side */}
        <div className="space-y-6">
          {/* Coupon Box */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
            <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-[#C59B4B]" />
              <span>هل لديك كود خصم أو كوبون؟</span>
            </h4>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={inputCoupon}
                onChange={(e) => setInputCoupon(e.target.value)}
                placeholder="أدخل الكود (مثال: WAQZA10)"
                className="flex-1 bg-slate-50 border border-slate-300 text-xs py-2.5 px-3 rounded-xl focus:border-[#0F1E36] focus:outline-hidden uppercase"
              />
              <button
                type="submit"
                className="bg-[#0F1E36] hover:bg-[#1A3258] text-[#DFBA6F] text-xs font-bold px-4 rounded-xl transition-all"
              >
                تطبيق
              </button>
            </form>

            {couponMsg && (
              <div
                className={`mt-2 text-xs flex items-center gap-1.5 ${
                  couponMsg.isError ? 'text-rose-600' : 'text-emerald-700 font-bold'
                }`}
              >
                {couponMsg.isError ? (
                  <AlertCircle className="w-3.5 h-3.5" />
                ) : (
                  <CheckCircle className="w-3.5 h-3.5" />
                )}
                <span>{couponMsg.text}</span>
              </div>
            )}
            {couponCode && (
              <div className="mt-2 text-[11px] text-[#081220] bg-[#FBF6EB] border border-[#E8D2A2] p-2 rounded-lg font-medium">
                تم تفعيل الكوبون: <span className="font-black text-[#C59B4B]">{couponCode}</span>
              </div>
            )}
          </div>

          {/* Invoice Summary */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-black text-slate-900 text-base pb-3 border-b border-slate-100">
              ملخص الطلب
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>المجموع الفرعي للمنتجات:</span>
                <span className="font-bold text-slate-800">{formatPrice(cartSubtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>رسوم الشحن والتوصيل:</span>
                <span className="font-bold text-slate-800">
                  {cartDeliveryFee === 0 ? (
                    <span className="text-emerald-700 font-black">مجاني</span>
                  ) : (
                    formatPrice(cartDeliveryFee)
                  )}
                </span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>قيمة الخصم المطبق:</span>
                  <span>- {formatPrice(cartDiscount)}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
              <span className="font-black text-slate-900 text-sm">المجموع الإجمالي:</span>
              <span className="font-black text-xl text-[#0B1B36]">
                {formatPrice(cartTotal)}
              </span>
            </div>

            <button
              onClick={() => setCurrentView('checkout')}
              className="w-full flex items-center justify-center gap-2 bg-gold-gradient hover:bg-gold-gradient-hover text-[#070F1E] font-black text-sm py-4 rounded-2xl shadow-lg shadow-[#D4A853]/30 active:scale-98 transition-all cursor-pointer"
            >
              <span>متابعة إتمام الطلب</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500 text-center">
              <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>دفع آمن وضمان فحص الجودة</span>
              </div>
              <p>الدفع عند الاستلام متاح لجميع المناطق المدعومة</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
