import React, { useState } from 'react';
import {
  Link2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Plus,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductRequestStatus } from '../types';

export const MyRequestsPage: React.FC = () => {
  const {
    productRequests,
    acceptProductRequestQuote,
    formatPrice,
    setCurrentView,
  } = useStore();

  const [processingId, setProcessingId] = useState<string | null>(null);

  const getStatusBadge = (status: ProductRequestStatus) => {
    switch (status) {
      case 'جديد':
        return { label: 'جديد', color: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'قيد المراجعة':
        return { label: 'قيد المراجعة من الإدارة', color: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'تم تحديد السعر':
      case 'بانتظار موافقة العميل':
        return { label: 'بانتظار موافقتك على السعر', color: 'bg-[#FBF6EB] text-[#081220] border-[#E8D2A2] font-black' };
      case 'تمت الموافقة':
        return { label: 'تمت موافقتك - جارٍ التنفيذ', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'جارٍ توفير المنتج':
        return { label: 'جارٍ توفير وشحن المنتج', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      case 'مكتمل':
        return { label: 'مكتمل وتم التسليم', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'غير متاح':
        return { label: 'المنتج غير متاح من المصدر', color: 'bg-slate-100 text-slate-700 border-slate-300' };
      case 'ملغي':
        return { label: 'طلب ملغي', color: 'bg-rose-50 text-rose-800 border-rose-200' };
      default:
        return { label: status, color: 'bg-slate-50 text-slate-800 border-slate-200' };
    }
  };

  const handleDecision = async (requestId: string, accepted: boolean) => {
    const actionText = accepted ? 'الموافقة على العرض واعتماد شرائه' : 'رفض العرض وإلغاء الطلب';
    if (!window.confirm(`هل أنت متأكد من ${actionText}؟`)) return;

    setProcessingId(requestId);
    try {
      await acceptProductRequestQuote(requestId, accepted);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء تحديث حالة الطلب.');
    } finally {
      setProcessingId(null);
    }
  };

  if (productRequests.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-[#FBF6EB] text-[#C59B4B] border border-[#E8D2A2] rounded-full flex items-center justify-center mx-auto mb-4">
          <Link2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">
          لا توجد طلبات توفير منتجات حتى الآن
        </h2>
        <p className="text-xs text-slate-500 mb-6 max-w-md mx-auto">
          خدمة «اخترها… ونحن نوصلها» تمكنك من إرسال رابط أي منتج تريده من أي موقع خارجي لنقوم بشرائه وتوصيله لك.
        </p>
        <button
          onClick={() => setCurrentView('external-request')}
          className="bg-linear-to-r from-[#DFBA6F] to-[#C59B4B] text-[#081220] font-black text-xs px-6 py-3 rounded-2xl shadow-md transition-all inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>أرسل رابط منتج الآن</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            طلبات توفير المنتجات (اخترها ونحن نوصلها)
          </h1>
          <p className="text-xs text-slate-500">
            متابعة عروض الأسعار والروابط الخارجية المرسلة لإدارة المتجر
          </p>
        </div>

        <button
          onClick={() => setCurrentView('external-request')}
          className="bg-linear-to-r from-[#DFBA6F] to-[#C59B4B] text-[#081220] font-black text-xs px-5 py-2.5 rounded-2xl shadow-xs transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>طلب منتج جديد من رابط</span>
        </button>
      </div>

      <div className="space-y-6">
        {productRequests.map((req) => {
          const badge = getStatusBadge(req.status);
          const needsCustomerApproval =
            req.status === 'بانتظار موافقة العميل' || req.status === 'تم تحديد السعر';
          const reqDate = new Date(req.createdAt).toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          return (
            <div
              key={req.id}
              className={`bg-white rounded-3xl border shadow-xs overflow-hidden transition-all ${
                needsCustomerApproval
                  ? 'border-[#C59B4B] ring-2 ring-[#C59B4B]/30'
                  : 'border-slate-200'
              }`}
            >
              {/* Header */}
              <div className="p-5 sm:p-6 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FBF6EB] text-[#C59B4B] border border-[#E8D2A2] flex items-center justify-center">
                    <Link2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-slate-900">
                        {req.requestNumber}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.color}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">تاريخ الطلب: {reqDate}</span>
                  </div>
                </div>

                {req.quotedPrice ? (
                  <div className="text-left bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 block">السعر المقدر:</span>
                    <span className="font-black text-sm text-emerald-950">
                      {formatPrice(req.quotedPrice + (req.deliveryFee || 0))}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-[#081220] bg-[#FBF6EB] border border-[#E8D2A2] px-2.5 py-1 rounded-lg">
                    قيد حساب التكلفة...
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                {/* External link display */}
                <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0 flex-1">
                    <span className="text-slate-400 block mb-0.5">رابط المنتج الأصلي:</span>
                    <a
                      href={req.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[#0F1E36] hover:underline truncate block"
                    >
                      {req.productUrl}
                    </a>
                  </div>
                  <a
                    href={req.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 shrink-0"
                    title="فتح الرابط في نافذة جديدة"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Specs and Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {req.productName && (
                    <div>
                      <span className="text-slate-400">اسم المنتج المرجعي:</span>
                      <p className="font-bold text-slate-800">{req.productName}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400">الكمية المطلوبة:</span>
                    <p className="font-bold text-slate-800">{req.quantity} قطعة</p>
                  </div>
                  {req.specs && (
                    <div>
                      <span className="text-slate-400">المواصفات (اللون / المقاس):</span>
                      <p className="font-bold text-slate-800">{req.specs}</p>
                    </div>
                  )}
                  {req.notes && (
                    <div>
                      <span className="text-slate-400">ملاحظات العميل:</span>
                      <p className="text-slate-700">{req.notes}</p>
                    </div>
                  )}
                </div>

                {/* Admin Quotation Box if available */}
                {req.quotedPrice && (
                  <div className="bg-[#FBF6EB] border border-[#E8D2A2] rounded-2xl p-5 space-y-3">
                    <h4 className="font-bold text-[#081220] text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#C59B4B]" />
                      <span>عرض السعر المقدم من إدارة متجر الوقزة:</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500">سعر المنتج:</span>
                        <p className="font-black text-slate-900 text-sm">
                          {formatPrice(req.quotedPrice)}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500">رسوم الشحن والتوصيل:</span>
                        <p className="font-black text-slate-900 text-sm">
                          {formatPrice(req.deliveryFee || 0)}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500">المدة التقديرية للوصول:</span>
                        <p className="font-bold text-slate-900 text-sm">
                          {req.estimatedDays || '7-12 يوم عمل'}
                        </p>
                      </div>
                    </div>

                    {req.adminNotes && (
                      <div className="pt-2 border-t border-[#E8D2A2] text-xs text-[#081220]">
                        <span className="font-bold">ملاحظات الإدارة: </span>
                        <span>{req.adminNotes}</span>
                      </div>
                    )}

                    {/* Customer Decision Buttons */}
                    {needsCustomerApproval && (
                      <div className="pt-3 border-t border-[#E8D2A2] flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => handleDecision(req.id, true)}
                          disabled={processingId === req.id}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>قبول العرض وتأكيد الطلب</span>
                        </button>
                        <button
                          onClick={() => handleDecision(req.id, false)}
                          disabled={processingId === req.id}
                          className="bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>رفض العرض</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
