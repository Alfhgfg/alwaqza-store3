import React, { useState } from 'react';
import {
  Package,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OrderStatus } from '../types';

export const MyOrdersPage: React.FC = () => {
  const { orders, cancelOrder, formatPrice, setCurrentView } = useStore();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'جديد':
        return { label: 'جديد', color: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'قيد التأكيد':
        return { label: 'قيد التأكيد', color: 'bg-[#FBF6EB] text-[#081220] border-[#E8D2A2]' };
      case 'مؤكد':
        return { label: 'مؤكد', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      case 'قيد التجهيز':
        return { label: 'قيد التجهيز', color: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'جاهز للشحن':
        return { label: 'جاهز للشحن', color: 'bg-cyan-50 text-cyan-800 border-cyan-200' };
      case 'خرج للتوصيل':
        return { label: 'خرج للتوصيل', color: 'bg-orange-50 text-orange-800 border-orange-200' };
      case 'تم التسليم':
        return { label: 'تم التسليم بنجاح', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'ملغي':
        return { label: 'ملغي', color: 'bg-rose-50 text-rose-800 border-rose-200' };
      default:
        return { label: status, color: 'bg-slate-50 text-slate-800 border-slate-200' };
    }
  };

  const statusSteps: OrderStatus[] = [
    'جديد',
    'مؤكد',
    'قيد التجهيز',
    'خرج للتوصيل',
    'تم التسليم',
  ];

  const handleCancel = async (orderId: string) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟')) return;
    setCancellingId(orderId);
    try {
      await cancelOrder(orderId);
    } catch (err: any) {
      alert(err.message || 'تعذر إلغاء الطلب.');
    } finally {
      setCancellingId(null);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">لا توجد طلبات سابقة</h2>
        <p className="text-xs text-slate-500 mb-6">
          لم تقم بإجراء أي طلبات حتى الآن. تفضل بتصفح منتجاتنا المميزة واطلب بكل سهولة!
        </p>
        <button
          onClick={() => setCurrentView('home')}
          className="bg-[#0F1E36] hover:bg-[#1A3258] text-[#DFBA6F] font-bold text-xs px-6 py-3 rounded-2xl shadow-md"
        >
          ابدأ التسوق الآن
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">سجل طلباتي</h1>
        <p className="text-xs text-slate-500">
          تتبع شحناتك الحالية وسجل مشترياتك السابقة من متجر الوقزة
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const badge = getStatusBadge(order.status);
          const isExpanded = expandedOrderId === order.id;
          const canCancel = order.status === 'جديد' || order.status === 'قيد التأكيد';
          const orderDate = new Date(order.createdAt).toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          return (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:border-slate-300"
            >
              {/* Card Header */}
              <div className="p-5 sm:p-6 bg-slate-50/70 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FBF6EB] text-[#0F1E36] border border-[#E8D2A2] flex items-center justify-center">
                    <Package className="w-5 h-5 text-[#C59B4B]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-slate-900">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.color}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      تاريخ الطلب: {orderDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-left">
                    <span className="text-[11px] text-slate-400 block leading-tight">الإجمالي</span>
                    <span className="font-black text-sm text-[#0F1E36]">
                      {formatPrice(order.total)}
                    </span>
                  </div>

                  <button
                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                    aria-label="Expand order details"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Status Timeline Mini */}
              {order.status !== 'ملغي' && (
                <div className="px-6 py-4 bg-white border-b border-slate-100">
                  <div className="flex items-center justify-between relative max-w-lg mx-auto">
                    {/* Connecting line */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />

                    {statusSteps.map((step, idx) => {
                      const currentIdx = statusSteps.indexOf(
                        order.status === 'قيد التأكيد'
                          ? 'جديد'
                          : order.status === 'جاهز للشحن'
                          ? 'قيد التجهيز'
                          : order.status
                      );
                      const isCompleted = currentIdx >= idx;
                      const isCurrent = currentIdx === idx;

                      return (
                        <div key={step} className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isCompleted
                                ? 'bg-[#0F1E36] text-[#DFBA6F] shadow-xs'
                                : 'bg-slate-200 text-slate-400'
                            } ${isCurrent ? 'ring-4 ring-[#C59B4B]/30 scale-110' : ''}`}
                          >
                            {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : idx + 1}
                          </div>
                          <span
                            className={`text-[10px] mt-1 font-bold ${
                              isCurrent ? 'text-[#0F1E36]' : 'text-slate-400'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 text-xs py-2 border-b border-slate-100 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-800">{item.product.name}</p>
                          <p className="text-slate-400">
                            الكمية: {item.quantity}{' '}
                            {item.selectedColor && `| اللون: ${item.selectedColor}`}
                          </p>
                        </div>
                      </div>

                      <span className="font-bold text-slate-900 shrink-0">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="pt-4 border-t border-slate-200 space-y-4 text-xs animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl">
                      <div>
                        <span className="text-slate-400 block mb-1">عنوان التوصيل:</span>
                        <p className="font-bold text-slate-800">
                          {order.governorate} - {order.city} - {order.area}
                        </p>
                        <p className="text-slate-600 mt-0.5">{order.address}</p>
                        <p className="text-slate-600 mt-1">هاتف المستلم: {order.customerPhone}</p>
                      </div>

                      <div>
                        <span className="text-slate-400 block mb-1">تفاصيل الدفع:</span>
                        <p className="font-bold text-slate-800">{order.paymentMethod}</p>
                        {order.deliveryFee > 0 ? (
                          <p className="text-slate-500 mt-0.5">
                            رسوم التوصيل: {formatPrice(order.deliveryFee)}
                          </p>
                        ) : (
                          <p className="text-emerald-700 font-bold mt-0.5">التوصيل مجاني</p>
                        )}
                        {order.notes && (
                          <p className="text-slate-500 mt-1">ملاحظاتك: {order.notes}</p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {canCancel && (
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => handleCancel(order.id)}
                          disabled={cancellingId === order.id}
                          className="text-xs text-rose-700 hover:text-rose-900 font-bold border border-rose-300 hover:bg-rose-50 px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>
                            {cancellingId === order.id ? 'جارٍ الإلغاء...' : 'إلغاء الطلب'}
                          </span>
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
