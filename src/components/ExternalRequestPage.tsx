import React, { useState } from 'react';
import {
  Link2,
  Send,
  Sparkles,
  Clock,
  ShieldCheck,
  CheckCircle,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BRAND } from '../constants/brand';

export const ExternalRequestPage: React.FC = () => {
  const {
    createProductRequest,
    currentUser,
    userProfile,
    setCurrentView,
    productRequests,
  } = useStore();

  const [productUrl, setProductUrl] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [specs, setSpecs] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [customerName, setCustomerName] = useState(userProfile?.name || '');
  const [customerPhone, setCustomerPhone] = useState(userProfile?.phone || '');
  const [loading, setLoading] = useState(false);
  const [submittedReqNum, setSubmittedReqNum] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!productUrl.trim()) {
      setErrorMsg('يرجى إدخال رابط المنتج المطلوب.');
      return;
    }

    if (!customerPhone.trim() || !customerName.trim()) {
      setErrorMsg('يرجى إدخال الاسم ورقم الهاتف/الواتساب للتواصل وإرسال التسعيرة.');
      return;
    }

    setLoading(true);
    try {
      const reqNumber = await createProductRequest({
        userId: currentUser?.uid || 'guest',
        customerName,
        customerPhone,
        productUrl,
        productName: productName.trim() || undefined,
        quantity: Number(quantity) || 1,
        specs: specs.trim() || undefined,
        notes: notes.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
      });

      setSubmittedReqNum(reqNumber);
      // Reset form
      setProductUrl('');
      setProductName('');
      setQuantity(1);
      setSpecs('');
      setNotes('');
      setImageUrl('');
    } catch (err) {
      console.error(err);
      setErrorMsg('حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#070F1E] via-[#0B1B36] to-[#162E56] text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden mb-8 border border-[#D4A853]/30">
        <div className="absolute -top-16 -left-16 w-60 h-60 bg-[#D4A853]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-gradient text-[#070F1E] font-black text-xs mb-3.5 shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>خدمة حصرية من متجر الوقزة</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black mb-3">
            «أرسل رابطك… ونحن نوفر لك المنتج»
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-medium">
            هل وجدت سلعة في أمازون، نون، علي إكسبريس، أو أي متجر إلكتروني محلي أو عالمي؟
            انسخ الرابط هنا وسنقوم بمراجعته وتحديد التكلفة الإجمالية وفترة التوصيل لتوافق عليها قبل أي عملية شراء.
          </p>
        </div>
      </div>

      {/* Success Notification Box */}
      {submittedReqNum && (
        <div className="bg-emerald-50 border-2 border-emerald-400 rounded-3xl p-6 sm:p-8 mb-8 text-center animate-in zoom-in-95 duration-300 shadow-md">
          <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
            <CheckCircle className="w-9 h-9" />
          </div>
          <h3 className="text-2xl font-black text-emerald-950 mb-2">
            تم استلام طلب توفير المنتج بنجاح!
          </h3>
          <p className="text-sm text-emerald-800 mb-4">
            رقم الطلب الخاص بك هو:{' '}
            <span className="font-mono font-black text-emerald-900 bg-emerald-200/60 px-3 py-1 rounded-lg text-base">
              {submittedReqNum}
            </span>
          </p>
          <p className="text-xs text-emerald-700 max-w-lg mx-auto mb-6">
            يقوم فريق العمل حالياً بمراجعة الرابط والتأكد من إمكانية شحنه وتحديد السعر النهائي.
            ستصلك رسالة وإشعار فور اكتمال التسعيرة للموافقة عليها.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setCurrentView('requests')}
              className="bg-[#0B1B36] hover:bg-[#162E56] text-[#F5D68B] font-bold text-sm px-6 py-2.5 rounded-2xl shadow-md transition-all border border-[#D4A853]/30"
            >
              متابعة طلبات التوفير
            </button>
            <button
              onClick={() => setSubmittedReqNum(null)}
              className="bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-bold text-sm px-6 py-2.5 rounded-2xl transition-all"
            >
              إرسال رابط آخر
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <Link2 className="w-5 h-5 text-[#C59B4B]" />
            <span>بيانات المنتج والموقع الخارجي</span>
          </h2>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Link URL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                رابط صفحة المنتج (URL) <span className="text-[#C59B4B]">*</span>
              </label>
              <input
                type="url"
                required
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                placeholder="https://www.amazon.com/dp/... أو أي موقع آخر"
                className="w-full text-left ltr bg-slate-50 border border-slate-300 focus:border-[#0F1E36] focus:bg-white text-slate-900 text-sm p-3.5 rounded-2xl focus:ring-2 focus:ring-[#0F1E36]/15 focus:outline-hidden transition-all"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                يدعم كافة المتاجر: أمازون، نون، علي إكسبريس، شي إن، إيباي، وغيرها.
              </span>
            </div>

            {/* Product Name (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                اسم أو وصف المنتج (اختياري)
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="مثال: سماعة سوني لاسلكية WH-1000XM5"
                className="w-full bg-slate-50 border border-slate-300 focus:border-[#0F1E36] focus:bg-white text-slate-900 text-sm p-3.5 rounded-2xl focus:ring-2 focus:ring-[#0F1E36]/15 focus:outline-hidden transition-all"
              />
            </div>

            {/* Quantity and Specs (Color / Size) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  الكمية المطلوبة
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#0F1E36] focus:bg-white text-slate-900 text-sm p-3.5 rounded-2xl focus:outline-hidden transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  المواصفات (اللون / المقاس / السعة)
                </label>
                <input
                  type="text"
                  value={specs}
                  onChange={(e) => setSpecs(e.target.value)}
                  placeholder="مثال: كحلي، مقاس 42، سعة 256 جيجا"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#0F1E36] focus:bg-white text-slate-900 text-sm p-3.5 rounded-2xl focus:outline-hidden transition-all"
                />
              </div>
            </div>

            {/* Optional Image URL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                رابط صورة توضيحية للمنتج (اختياري)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://... رابط صورة إن توفرت"
                className="w-full text-left ltr bg-slate-50 border border-slate-300 focus:border-[#0F1E36] focus:bg-white text-slate-900 text-sm p-3.5 rounded-2xl focus:outline-hidden transition-all"
              />
            </div>

            {/* Additional notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ملاحظات إضافية لفريق المشتريات
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي تفاصيل خاصة ترغب في مراعاتها أثناء الشراء..."
                className="w-full bg-slate-50 border border-slate-300 focus:border-[#0F1E36] focus:bg-white text-slate-900 text-sm p-3.5 rounded-2xl focus:outline-hidden transition-all"
              />
            </div>

            {/* Contact Details */}
            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                بيانات التواصل لإرسال عرض السعر:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    الاسم الكامل <span className="text-[#C59B4B]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="اسمك الكريم"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#0F1E36] focus:bg-white text-slate-900 text-sm p-3.5 rounded-2xl focus:outline-hidden transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    رقم الهاتف / الواتساب <span className="text-[#C59B4B]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="رقم الواتساب للتواصل وإرسال التسعيرة"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-[#0F1E36] focus:bg-white text-slate-900 text-sm p-3.5 rounded-2xl focus:outline-hidden transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gold-gradient hover:bg-gold-gradient-hover text-[#070F1E] font-black text-base py-4 rounded-2xl shadow-lg shadow-[#D4A853]/30 active:scale-98 transition-all cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-[#070F1E] border-t-transparent rounded-full animate-spin"></span>
                    جارٍ إرسال الطلب...
                  </span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>إرسال طلب توفير المنتج</span>
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-slate-400 mt-2">
                * إرسال الرابط لا يُلزمك بالشراء؛ الشراء يتم فقط بعد موافقتك على التسعيرة.
              </p>
            </div>
          </form>
        </div>

        {/* Right 1 Col: Explanations */}
        <div className="space-y-6">
          <div className="bg-[#FDF8EC] rounded-3xl p-6 border border-[#E5C989] shadow-xs">
            <h3 className="font-bold text-[#070F1E] text-base mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#D4A853]" />
              <span>مراحل طلب التوفير:</span>
            </h3>
            <ol className="space-y-2.5 text-xs text-[#081220] font-medium">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#E8D2A2] font-black text-[#081220] flex items-center justify-center text-[11px]">1</span>
                <span>إرسال الرابط والمواصفات</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#E8D2A2] font-black text-[#081220] flex items-center justify-center text-[11px]">2</span>
                <span>مراجعة الرابط وتحديد السعر والشحن</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#E8D2A2] font-black text-[#081220] flex items-center justify-center text-[11px]">3</span>
                <span>إشعارك بالعرض وقبولك أو رفضك</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#E8D2A2] font-black text-[#081220] flex items-center justify-center text-[11px]">4</span>
                <span>الشراء، فحص الجودة، والتوصيل لبابك</span>
              </li>
            </ol>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">لماذا تطلب عبر متجر الوقزة؟</h4>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>نوفر عنك عناء البطاقات البنكية الدولية ومشاكل الشحن المعقدة.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>فحص دقيق للمنتج ومطابقته للمواصفات قبل تسليمه لك.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <FileText className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>شفافية تامة: لا تدفع أي مبالغ إلا بعد معرفة وقبول التكلفة الكاملة.</span>
              </div>
            </div>
          </div>

          {productRequests.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-center">
              <p className="text-xs text-slate-700 font-medium mb-2">
                لديك <span className="font-bold text-[#0F1E36]">{productRequests.length}</span> طلب توفير سابق
              </p>
              <button
                onClick={() => setCurrentView('requests')}
                className="text-xs font-bold text-[#0F1E36] hover:text-[#C59B4B] underline"
              >
                عرض ومتابعة طلباتك السابقة
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
