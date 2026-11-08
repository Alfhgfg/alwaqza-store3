import React, { useState } from 'react';
import {
  CreditCard,
  Banknote,
  CheckCircle,
  AlertCircle,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface CheckoutPageProps {
  onOrderSuccess: (orderNumber: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onOrderSuccess }) => {
  const {
    cart,
    cartSubtotal,
    cartDeliveryFee,
    cartDiscount,
    cartTotal,
    formatPrice,
    settings,
    createOrder,
    currentUser,
    userProfile,
    setCurrentView,
  } = useStore();

  const [customerName, setCustomerName] = useState(userProfile?.name || '');
  const [customerPhone, setCustomerPhone] = useState(userProfile?.phone || '');
  const [governorate, setGovernorate] = useState(settings.deliveryCities[0] || 'صنعاء');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('الدفع عند الاستلام (COD)');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <p className="text-slate-600 mb-4">لا توجد منتجات في السلة لإتمام الطلب.</p>
        <button
          onClick={() => setCurrentView('home')}
          className="bg-[#0F1E36] text-[#DFBA6F] font-bold text-sm px-6 py-3 rounded-2xl"
        >
          العودة للمتجر
        </button>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim() || !customerPhone.trim() || !address.trim()) {
      setErrorMessage('يرجى تعبئة كافة حقول الاسم ورقم الهاتف والعنوان التفصيلي.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderNumber = await createOrder({
        userId: currentUser?.uid || 'guest',
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        governorate,
        city: city.trim() || governorate,
        area: area.trim() || 'وسط المدينة',
        address: address.trim(),
        notes: notes.trim() || undefined,
        items: cart,
        subtotal: cartSubtotal,
        deliveryFee: cartDeliveryFee,
        discount: cartDiscount,
        total: cartTotal,
        paymentMethod,
        status: 'جديد',
      });

      onOrderSuccess(orderNumber);
    } catch (err) {
      console.error('Order creation error:', err);
      setErrorMessage('حدث خطأ أثناء حفظ الطلب. يرجى إعادة المحاولة.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <button onClick={() => setCurrentView('cart')} className="hover:text-[#0F1E36]">
          السلة
        </button>
        <span>/</span>
        <span className="font-bold text-slate-800">إتمام الشراء وتأكيد الطلب</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">إتمام الطلب</h1>
        <p className="text-xs text-slate-500">
          أدخل بيانات التوصيل واختر طريقة الدفع المناسبة لتأكيد طلبك
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Delivery Info & Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Customer & Address */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <MapPin className="w-5 h-5 text-[#C59B4B]" />
              <span>عنوان التوصيل وبيانات المستلم</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  اسم المستلم الكامل <span className="text-[#C59B4B]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="الاسم الثلاثي"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#0F1E36] focus:bg-white text-slate-900 text-sm p-3.5 pr-10 rounded-2xl focus:outline-hidden"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-4 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رقم الهاتف للتوصيل (واتساب) <span className="text-[#C59B4B]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="رقم الهاتف للتواصل أثناء التوصيل"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#0F1E36] focus:bg-white text-slate-900 text-sm p-3.5 rounded-2xl focus:outline-hidden"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-4 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* City / Province */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  المحافظة / المدينة الرئيسية <span className="text-[#C59B4B]">*</span>
                </label>
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#0F1E36] focus:bg-white text-slate-900 text-sm p-3.5 rounded-2xl focus:outline-hidden"
                >
                  {settings.deliveryCities.map((cityOption) => (
                    <option key={cityOption} value={cityOption}>
                      {cityOption}
                    </option>
                  ))}
                  <option value="محافظة أخرى">محافظة أخرى...</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  المديرية أو المدينة الفرعية
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="مثال: التحرير، كريتر، الخ"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#0F1E36] focus:bg-white text-slate-900 text-sm p-3.5 rounded-2xl focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  الحي أو المنطقة
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="مثال: حي الروضة، المنصورة"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#0F1E36] focus:bg-white text-slate-900 text-sm p-3.5 rounded-2xl focus:outline-hidden"
                />
              </div>
            </div>

            {/* Detailed Street Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                العنوان التفصيلي (الشارع، رقم المبنى، معلم مميز قريب) <span className="text-[#C59B4B]">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="مثال: شارع بغداد، مقابل بنك الكريمي، عمارة الأمل، شقة 4"
                className="w-full bg-slate-50 border border-slate-300 focus:border-[#0F1E36] focus:bg-white text-slate-900 text-sm p-3.5 rounded-2xl focus:outline-hidden"
              />
            </div>

            {/* Delivery Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ملاحظات أو توجيهات لمندوب التوصيل (اختياري)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="مثال: يرجى الاتصال قبل الوصول بنصف ساعة"
                className="w-full bg-slate-50 border border-slate-300 focus:border-[#0F1E36] focus:bg-white text-slate-900 text-sm p-3.5 rounded-2xl focus:outline-hidden"
              />
            </div>
          </div>

          {/* Section 2: Payment Method Selection */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <CreditCard className="w-5 h-5 text-[#C59B4B]" />
              <span>طريقة الدفع المعتمدة</span>
            </h2>

            <div className="space-y-3">
              {/* COD */}
              <label
                className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'الدفع عند الاستلام (COD)'
                    ? 'border-[#D4A853] bg-[#FDF8EC] ring-1 ring-[#D4A853] shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'الدفع عند الاستلام (COD)'}
                  onChange={() => setPaymentMethod('الدفع عند الاستلام (COD)')}
                  className="mt-1 accent-[#0B1B36]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-sm text-slate-900">
                      الدفع عند الاستلام (نقداً أو شبكة)
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                      موصى به
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    ادفع بأمان عند استلام وفحص طلبك من مندوب التوصيل لباب منزلك.
                  </p>
                </div>
              </label>

              {/* Local Wallet / Bank Transfer */}
              <label
                className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'تحويل بنكي / محفظة إلكترونية (الكريمي / ون كاش)'
                    ? 'border-[#D4A853] bg-[#FDF8EC] ring-1 ring-[#D4A853] shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'تحويل بنكي / محفظة إلكترونية (الكريمي / ون كاش)'}
                  onChange={() =>
                    setPaymentMethod('تحويل بنكي / محفظة إلكترونية (الكريمي / ون كاش)')
                  }
                  className="mt-1 accent-[#0B1B36]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#D4A853]" />
                    <span className="font-bold text-sm text-slate-900">
                      تحويل إلكتروني عبر المحافظ (الكريمي / ون كاش / حوالة محلية)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    يتم تزويدك برقم الحساب فور تأكيد الطلب للتحويل المباشر.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Order Review & Confirmation */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 sticky top-28">
            <h3 className="font-black text-slate-900 text-base pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>تفاصيل الطلب ({cart.length})</span>
              <button
                type="button"
                onClick={() => setCurrentView('cart')}
                className="text-xs text-[#D4A853] font-bold hover:underline"
              >
                تعديل السلة
              </button>
            </h3>

            {/* Items mini list */}
            <div className="max-h-56 overflow-y-auto space-y-3 pl-1 pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.product.image}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate">{item.product.name}</p>
                    <p className="text-slate-400">
                      {item.quantity} × {formatPrice(item.product.price)}
                    </p>
                  </div>
                  <span className="font-bold text-slate-800 shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span className="font-bold text-slate-800">{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>رسوم التوصيل:</span>
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
                  <span>الخصم المطبق:</span>
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

            {/* Confirm button in radiant gold */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-gold-gradient hover:bg-gold-gradient-hover disabled:bg-slate-300 text-[#070F1E] font-black text-base py-4 rounded-2xl shadow-lg shadow-[#D4A853]/30 active:scale-98 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-[#070F1E] border-t-transparent rounded-full animate-spin"></span>
                  جارٍ تأكيد الطلب...
                </span>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>تأكيد الطلب الآن</span>
                </>
              )}
            </button>

            <div className="pt-2 text-center text-[11px] text-slate-400">
              بالنقر على تأكيد الطلب، فإنك توافق على شروط وأحكام متجر الوقزة وسياسة الاسترجاع.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
