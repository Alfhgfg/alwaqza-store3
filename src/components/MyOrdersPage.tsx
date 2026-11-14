import React from 'react';
import { Package, Clock, CheckCircle, Truck, XCircle, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BRAND } from '../constants/brand';

interface MyOrdersPageProps {
  onBack: () => void;
}

export const MyOrdersPage: React.FC<MyOrdersPageProps> = ({ onBack }) => {
  const { orders } = useStore();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> قيد المراجعة</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> تم التأكيد</span>;
      case 'shipped':
        return <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold flex items-center gap-1"><Truck className="w-3 h-3" /> جاري التوصيل</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> تم التسليم</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3" /> ملغي</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-right">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowRight className="w-4 h-4" />
        <span>العودة للرئيسية</span>
      </button>

      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6">
        سجل طلباتي ({orders.length})
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400">
          <Package className="w-16 h-16 mx-auto mb-3 opacity-40" />
          <p className="text-sm">لم تقم بإجراء أي طلبات حتى الآن</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-slate-900">#{order.id}</span>
                  <span className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString('ar-YE')}</span>
                </div>
                {getStatusBadge(order.status)}
              </div>

              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm">
                    <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0" />
                    <span className="flex-1 text-slate-800">{item.name} × {item.quantity}</span>
                    <span className="font-bold text-slate-900">{(item.price * item.quantity).toLocaleString()} {BRAND.currency}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-3 flex flex-wrap justify-between items-center text-xs sm:text-sm">
                <span className="text-slate-500">التوصيل إلى: {order.city} - {order.address}</span>
                <span className="font-black text-[#070F1E] text-sm sm:text-base">
                  الإجمالي: {order.totalAmount.toLocaleString()} {BRAND.currency}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
