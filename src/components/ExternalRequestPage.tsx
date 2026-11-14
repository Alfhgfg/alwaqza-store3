import React, { useState } from 'react';
import { Sparkles, Globe, Link as LinkIcon, Send, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import confetti from 'canvas-confetti';

interface ExternalRequestPageProps {
  onSuccessNavigate?: () => void;
}

export const ExternalRequestPage: React.FC<ExternalRequestPageProps> = ({ onSuccessNavigate }) => {
  const { createExternalRequest } = useStore();
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [productName, setProductName] = useState('');
  const [productNotes, setProductNotes] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productUrl || !customerName || !phone) return;

    setLoading(true);
    try {
      const req = await createExternalRequest({
        customerName,
        phone,
        productUrl,
        productName: productName || 'منتج من رابط خارجي',
        productNotes,
        estimatedPrice: estimatedPrice ? parseFloat(estimatedPrice) : undefined
      });

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      setSubmitted(req.id);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-right">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            تم استلام طلبك بنجاح!
          </h2>
          <p className="text-slate-600 text-sm mb-4 leading-relaxed max-w-md mx-auto">
            رقم الطلب الخاص بك هو: <span className="font-extrabold text-[#070F1E] bg-slate-100 px-3 py-1 rounded-lg">#{submitted}</span>
          </p>
          <p className="text-slate-500 text-xs mb-6 max-w-md mx-auto leading-relaxed">
            سيقوم فريق المشتريات الدولية في متجر الوقزة بفحص الرابط وحساب تكلفة الشراء والشحن الجوي والتوصيل إلى محافظتك، ثم التواصل معك عبر الواتساب لتأكيد السعر وبدء الشراء.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setSubmitted(null)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm"
            >
              تقديم طلب آخر
            </button>
            {onSuccessNavigate && (
              <button
                onClick={onSuccessNavigate}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#070F1E] hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-sm"
              >
                متابعة طلباتي الخارجية
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-right">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#070F1E] via-[#101D38] to-[#0A162C] p-6 sm:p-10 text-white shadow-xl mb-8 border border-amber-500/30">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold mb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>خدمة التوصيل والشراء من المواقع العالمية</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black mb-3">
            خدمة <span className="text-amber-400">"اخترها ونحن نوصلها"</span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
            شاهدت سلعة على (Amazon, AliExpress, Shein, Noon, eBay) أو أي موقع عالمي؟ فقط ضع الرابط وسنتكفل نحن بالدفع، الشحن، الجمارك، والتسليم حتى باب بيتك في اليمن!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Request Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                رابط المنتج المطلوب (URL) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  required
                  value={productUrl}
                  onChange={e => setProductUrl(e.target.value)}
                  placeholder="https://www.amazon.com/dp/... أو أي موقع"
                  className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs sm:text-sm outline-none text-left font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                اسم المنتج أو وصفه المختصر
              </label>
              <input
                type="text"
                value={productName}
                onChange={e => setProductName(e.target.value)}
                placeholder="مثال: لابتوب Dell XPS 15 أو فستان أزرق مقاس M"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs sm:text-sm outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  اسمك الكريم <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="الاسم الثلاثي"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs sm:text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رقم الواتساب أو الهاتف <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="770000000"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs sm:text-sm outline-none text-left"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                السعر التقريبي على الموقع (اختياري بالدولار أو الريال)
              </label>
              <input
                type="number"
                value={estimatedPrice}
                onChange={e => setEstimatedPrice(e.target.value)}
                placeholder="مثال: 50"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs sm:text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ملاحظات، المقاس، اللون، أو تفاصيل خاصة
              </label>
              <textarea
                rows={3}
                value={productNotes}
                onChange={e => setProductNotes(e.target.value)}
                placeholder="حدد اللون، المقاس، أو أي مواصفات تود التأكد منها..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs sm:text-sm outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              <span>{loading ? 'جاري إرسال الطلب...' : 'إرسال طلب الشراء والتسعير'}</span>
            </button>
          </form>
        </div>

        {/* Side Info */}
        <div className="space-y-4">
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
            <h3 className="font-extrabold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span>كيف تعمل الخدمة؟</span>
            </h3>
            <ol className="space-y-3 text-xs text-slate-600 list-decimal list-inside leading-relaxed">
              <li>ترسل رابط المنتج والمواصفات من خلال هذا النموذج.</li>
              <li>يقوم فريقنا بفحص المنتج والتأكد من توفره وجودته.</li>
              <li>نرسل لك عرض سعر شامل (سعر المنتج + الشحن لليمن + التوصيل).</li>
              <li>بعد موافقتك، يتم الشراء فوراً ومتابعة الشحنة حتى استلامك لها.</li>
            </ol>
          </div>

          <div className="bg-[#070F1E] text-white rounded-3xl p-6 border border-amber-500/30">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
              <h4 className="font-extrabold text-sm">ضمان متجر الوقزة</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              نضمن لك وصول السلعة سليمة ومطابقة للمواصفات، مع تغليف احترافي وتتبع مستمر لحالة الشحنة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
