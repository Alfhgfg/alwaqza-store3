import React from 'react';
import { Sparkles, Globe, Plane, ShieldCheck, ArrowLeft } from 'lucide-react';

interface PickItDeliverItBannerProps {
  onOpen: () => void;
}

export const PickItDeliverItBanner: React.FC<PickItDeliverItBannerProps> = ({ onOpen }) => {
  return (
    <div className="my-8 max-w-7xl mx-auto px-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#070F1E] via-[#111E38] to-[#0A162C] border-2 border-amber-500/30 p-6 sm:p-10 shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-right">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-bold mb-4">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>خدمة الوقزة الحصرية لليمن</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4 leading-snug">
              خدمة <span className="text-amber-400">"اخترها ونحن نوصلها"</span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
              هل أعجبك منتج على مواقع التسوق العالمية (أمازون، علي إكسبرس، نون، شي إن، أو أي موقع آخر) وتريد شحنه واستلامه في اليمن؟ لا تقلق بشأن الدفع الخارجي أو الشحن الدولي، انسخ الرابط وأرسله إلينا وسنتكفل بشرائه وفحصه وتوصيله لباب بيتك!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
                <Globe className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-xs sm:text-sm text-slate-200 font-medium">أي موقع إلكتروني عالمي</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
                <Plane className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-xs sm:text-sm text-slate-200 font-medium">شحن جوي وبحري سريع</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-xs sm:text-sm text-slate-200 font-medium">ضمان وصول المنتج وفحصه</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 w-full lg:w-auto">
            <button
              onClick={onOpen}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-base sm:text-lg shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <span>طلب شراء منتج خارجي الآن</span>
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
