import React from 'react';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BRAND } from '../constants/brand';

interface CartPageProps {
  onProceedToCheckout: () => void;
  onExplore: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onProceedToCheckout, onExplore }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useStore();

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-right">
        <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm text-center">
          <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
            سلة المشتريات فارغة
          </h2>
          <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
            لم تقم بإضافة أي منتج إلى سلتك بعد. استكشف مجموعتنا الفاخرة الآن!
          </p>
          <button
            onClick={onExplore}
            className="px-8 py-3.5 rounded-xl bg-[#070F1E] hover:bg-amber-500 hover:text-slate-950 text-white font-extrabold text-sm transition-all shadow-md"
          >
            تصفح المنتجات الآن
          </button>
        </div>
      </div>
    );
  }

  const shippingEstimate = 2000;
  const grandTotal = cartTotal + shippingEstimate;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-right">
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6">
        سلة المشتريات ({cart.length})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div
              key={item.product.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-4"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-900 truncate mb-1">
                  {item.product.name}
                </h3>
                <span className="text-sm font-extrabold text-amber-600 block mb-2">
                  {item.product.price.toLocaleString()} {BRAND.currency}
                </span>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 hover:bg-slate-200 text-slate-600"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 hover:bg-slate-200 text-slate-600"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-left font-black text-slate-900 text-sm sm:text-base shrink-0">
                {(item.product.price * item.quantity).toLocaleString()} {BRAND.currency}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm h-fit space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">
            ملخص الطلب
          </h3>

          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>قيمة المنتجات:</span>
              <span className="font-bold text-slate-900">{cartTotal.toLocaleString()} {BRAND.currency}</span>
            </div>
            <div className="flex justify-between">
              <span>رسوم التوصيل المقدرة:</span>
              <span className="font-bold text-slate-900">{shippingEstimate.toLocaleString()} {BRAND.currency}</span>
            </div>
            <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-black text-[#070F1E]">
              <span>الإجمالي الكلي:</span>
              <span className="text-amber-600 text-lg">{grandTotal.toLocaleString()} {BRAND.currency}</span>
            </div>
          </div>

          <button
            onClick={onProceedToCheckout}
            className="w-full py-3.5 rounded-xl bg-[#070F1E] hover:bg-amber-500 hover:text-slate-950 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
          >
            <span>متابعة إتمام الطلب</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
