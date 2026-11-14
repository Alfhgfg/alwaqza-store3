import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, MapPin, Phone, User, CreditCard } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BRAND } from '../constants/brand';
import confetti from 'canvas-confetti';

interface CheckoutPageProps {
  onSuccess: (orderId: string) => void;
  onBack: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onSuccess, onBack }) => {
  const { cart, cartTotal, createOrder } = useStore();
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('صنعاء');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'bank_transfer' | 'electronic_wallet'>('cash_on_delivery');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const shippingFee = city === 'صنعاء' ? 1500 : 3000;
  const grandTotal = cartTotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !address) return;

    setLoading(true);
    try {
      const order = await createOrder({
        customerName,
        phone,
        city,
        address,
        paymentMethod,
        notes,
        totalAmount: grandTotal,
        shippingFee,
        items: cart.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image
        }))
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      onSuccess(order.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-right">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowRight className="w-4 h-4" />
        <span>العودة إلى السلة</span>
      </button>

      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6">
        إتمام الطلب وتأكيد التوصيل
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping & Payment Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="w-5 h-5 text-amber-500" />
              <span>بيانات المستلم والتوصيل</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="الاسم الثلاثي"
                    className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 text-xs sm:text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رقم الهاتف أو الواتساب <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="770000000"
                    className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 text-xs sm:text-sm outline-none text-left"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  المحافظة / المدينة <span className="text-red-500">*</span>
                </label>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 text-xs sm:text-sm outline-none bg-white"
                >
                  <option value="صنعاء">صنعاء</option>
                  <option value="عدن">عدن</option>
                  <option value="تعز">تعز</option>
                  <option value="الحديدة">الحديدة</option>
                  <option value="إب">إب</option>
                  <option value="حضرموت (المكلا)">حضرموت (المكلا)</option>
                  <option value="حضرموت (سيئون)">حضرموت (سيئون)</option>
                  <option value="ذمار">ذمار</option>
                  <option value="مأرب">مأرب</option>
                  <option value="عمران">عمران</option>
                  <option value="لحج">لحج</option>
                  <option value="أبين">أبين</option>
                  <option value="محافظة أخرى">محافظة أخرى</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  العنوان التفصيلي <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="المديرية، الحي، أقرب معلم بارز"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 text-xs sm:text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ملاحظات إضافية للطلب أو موعد التوصيل
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="أي تعليمات إضافية بخصوص الشحن أو التغليف..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 text-xs sm:text-sm outline-none resize-none"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <CreditCard className="w-5 h-5 text-amber-500" />
              <span>طريقة الدفع</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                onClick={() => setPaymentMethod('cash_on_delivery')}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'border-amber-500 bg-amber-50/40 text-slate-900 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cash_on_delivery'}
                  onChange={() => {}}
                  className="hidden"
                />
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'cash_on_delivery' ? 'border-amber-500 bg-amber-500' : 'border-slate-300'
                }`}>
                  {paymentMethod === 'cash_on_delivery' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="text-xs sm:text-sm font-bold">الدفع عند الاستلام</span>
              </label>

              <label
                onClick={() => setPaymentMethod('electronic_wallet')}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'electronic_wallet'
                    ? 'border-amber-500 bg-amber-50/40 text-slate-900 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'electronic_wallet'}
                  onChange={() => {}}
                  className="hidden"
                />
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'electronic_wallet' ? 'border-amber-500 bg-amber-500' : 'border-slate-300'
                }`}>
                  {paymentMethod === 'electronic_wallet' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="text-xs sm:text-sm font-bold">محفظة كاش / جوالي / جيب</span>
              </label>

              <label
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-amber-500 bg-amber-50/40 text-slate-900 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={() => {}}
                  className="hidden"
                />
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'bank_transfer' ? 'border-amber-500 bg-amber-500' : 'border-slate-300'
                }`}>
                  {paymentMethod === 'bank_transfer' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="text-xs sm:text-sm font-bold">حوالة بنكية / النجم / الكريمي</span>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary & Submit */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm h-fit space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">
            ملخص الفاتورة
          </h3>

          <div className="max-h-48 overflow-y-auto space-y-2 text-xs divide-y divide-slate-50">
            {cart.map(item => (
              <div key={item.product.id} className="pt-2 flex justify-between gap-2">
                <span className="text-slate-700 truncate">{item.product.name} × {item.quantity}</span>
                <span className="font-bold text-slate-900 shrink-0">{(item.product.price * item.quantity).toLocaleString()} {BRAND.currency}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-2 text-xs sm:text-sm text-slate-600">
            <div className="flex justify-between">
              <span>المجموع الفرعي:</span>
              <span className="font-bold text-slate-900">{cartTotal.toLocaleString()} {BRAND.currency}</span>
            </div>
            <div className="flex justify-between">
              <span>رسوم الشحن ({city}):</span>
              <span className="font-bold text-slate-900">{shippingFee.toLocaleString()} {BRAND.currency}</span>
            </div>
            <div className="border-t border-slate-100 pt-2 flex justify-between text-base font-black text-[#070F1E]">
              <span>الإجمالي النهائي:</span>
              <span className="text-amber-600 text-lg">{grandTotal.toLocaleString()} {BRAND.currency}</span>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-100 flex items-center gap-2 text-emerald-800 text-xs">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>طلبك مضمون بالكامل مع إمكانية الفحص والمعاينة</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{loading ? 'جاري تأكيد الطلب...' : 'تأكيد الطلب الآن'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
