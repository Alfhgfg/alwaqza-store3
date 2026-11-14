import React from 'react';
import { Sparkles, ExternalLink, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BRAND } from '../constants/brand';

interface MyRequestsPageProps {
  onBack: () => void;
  onNewRequest: () => void;
}

export const MyRequestsPage: React.FC<MyRequestsPageProps> = ({ onBack, onNewRequest }) => {
  const { externalRequests } = useStore();

  const getStatusText = (status: string) => {
    switch (status) {
      case 'received': return 'تم الاستلام - بانتظار الفحص';
      case 'reviewing': return 'جاري فحص الرابط والتسعير';
      case 'price_offered': return 'تم إرسال عرض السعر للعميل';
      case 'confirmed': return 'تم التأكيد وجاري الشراء الدولي';
      case 'purchased': return 'تم الشراء وفي طريقها لليمن';
      case 'shipped': return 'وصلت اليمن وفي مرحلة التوصيل';
      case 'delivered': return 'تم الاستلام بنجاح';
      default: return 'ملغي';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-right">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowRight className="w-4 h-4" />
        <span>العودة</span>
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          طلبات الشراء الخارجي ("اخترها")
        </h1>
        <button
          onClick={onNewRequest}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4" />
          <span>طلب جديد</span>
        </button>
      </div>

      {externalRequests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400">
          <Sparkles className="w-16 h-16 mx-auto mb-3 opacity-40 text-amber-500" />
          <p className="text-sm">لم تقم بتقديم أي طلبات شراء خارجية حتى الآن</p>
        </div>
      ) : (
        <div className="space-y-4">
          {externalRequests.map(req => (
            <div
              key={req.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <span className="font-mono font-black text-slate-900">#{req.id}</span>
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                  {getStatusText(req.status)}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-1">
                  {req.productName}
                </h3>
                <a
                  href={req.productUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-mono truncate max-w-lg"
                  dir="ltr"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{req.productUrl}</span>
                </a>
              </div>

              {req.quotedPrice && (
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex justify-between items-center">
                  <span>السعر الإجمالي الواصل لليمن:</span>
                  <span className="font-black text-base">{req.quotedPrice.toLocaleString()} {BRAND.currency}</span>
                </div>
              )}

              {req.adminNotes && (
                <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <strong>ملاحظة الإدارة:</strong> {req.adminNotes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
