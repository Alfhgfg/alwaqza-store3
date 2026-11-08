import React from 'react';
import { Link2, Calculator, Truck, CheckCircle2, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BRAND } from '../constants/brand';

export const PickItDeliverItBanner: React.FC = () => {
  const { setCurrentView } = useStore();

  return (
    <section className="my-8 bg-gradient-to-br from-[#070F1E] via-[#0B1B36] to-[#162E56] text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden border border-[#D4A853]/25">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#D4A853]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#162E56]/60 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-gradient text-[#070F1E] font-black text-xs mb-3 shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>الخدمة الحصرية لمتجر الوقزة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-2">
              خدمة «اخترها… ونحن نوصلها!»
            </h2>
            <p className="text-slate-200 text-sm sm:text-base max-w-2xl font-medium leading-relaxed">
              هل أعجبك منتج في أمازون، نون، علي إكسبريس، أو أي متجر إلكتروني آخر وتريد شراؤه بسهولة؟
              فقط الصق الرابط، ودع الباقي علينا!
            </p>
          </div>

          <button
            onClick={() => setCurrentView('external-request')}
            className="self-start lg:self-center flex items-center gap-2 bg-gold-gradient hover:bg-gold-gradient-hover text-[#070F1E] font-black text-sm sm:text-base px-7 py-3.5 rounded-2xl shadow-lg shadow-[#D4A853]/35 hover:scale-103 active:scale-98 transition-all shrink-0"
          >
            <Link2 className="w-5 h-5 stroke-[2.5]" />
            <span>أرسل رابطك الآن</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 pt-4 border-t border-slate-700/60">
          {/* Step 1 */}
          <div className="bg-white/7 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:border-[#D4A853]/50 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-[#D4A853]/20 text-[#F5D68B] flex items-center justify-center mb-4 border border-[#D4A853]/30">
              <Link2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-[#070F1E] text-[#F5D68B] border border-[#D4A853]/40">
                الخطوة 1
              </span>
              <h3 className="font-bold text-base text-white">انسخ والصق الرابط</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              ضع رابط المنتج الذي وجدته في أي موقع خارجي وحدد الكمية، المقاس أو اللون المطلوب مع أي ملاحظات.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white/7 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:border-[#D4A853]/50 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-[#D4A853]/20 text-[#F5D68B] flex items-center justify-center mb-4 border border-[#D4A853]/30">
              <Calculator className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-[#070F1E] text-[#F5D68B] border border-[#D4A853]/40">
                الخطوة 2
              </span>
              <h3 className="font-bold text-base text-white">تسعير سريع وشامل</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              فريقنا يفحص الرابط فوراً ويحدد لك السعر الصافي، تكلفة الشحن، والمدة الزمنية التقديرية بدقة.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white/7 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:border-[#D4A853]/50 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-[#D4A853]/20 text-[#F5D68B] flex items-center justify-center mb-4 border border-[#D4A853]/30">
              <Truck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-[#070F1E] text-[#F5D68B] border border-[#D4A853]/40">
                الخطوة 3
              </span>
              <h3 className="font-bold text-base text-white">الموافقة والتوصيل لبابك</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              تراجع العرض وتوافق عليه بكل شفافية، ونحن نتكفل بالشراء، الجمارك، فحص الجودة والتسليم الآمن.
            </p>
          </div>
        </div>

        {/* Guarantees bar */}
        <div className="mt-6 pt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>فحص جودة وأصالة المنتج قبل التسليم</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#F5D68B]" />
            <span>لا توجد رسوم خفية أو مفاجئة</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-cyan-300" />
            <span>تتبع مباشر لحالة طلبك خطوة بخطوة</span>
          </div>
        </div>
      </div>
    </section>
  );
};

