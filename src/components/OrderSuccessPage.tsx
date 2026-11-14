import React from 'react';
import { CheckCircle2, ShoppingBag, ArrowLeft, PackageCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BRAND } from '../constants/brand';

interface OrderSuccessPageProps {
  orderId: string;
  onNavigateHome: () => void;
  onViewOrders: () => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({
  orderId,
  onNavigateHome,
  onViewOrders,
}) => {
  const { orders } = useStore();
  const order = orders.find(o => o.id === orderId);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-right">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
          شكراً لتسوقك من متجر الوقزة!
        </h1>
        <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto leading-relaxed">
          تم استلام طلبك بنجاح وجاري تجهيزه للشحن. سنتواصل معك هاتفياً أو عبر الواتساب لتأكيد موعد التوصيل.
        </p>

        {order && (
          <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-xs sm:text-sm text-right space-y-2 border border-slate-200">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">رقم الطلب:</span>
              <span className="font-extrabold text-slate-900 font-mono">#{order.id}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">العميل:</span>
              <span className="font-bold text-slate-900">{order.customerName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">العنوان:</span>
              <span className="font-bold text-slate-900">{order.city} - {order.address}</span>
            </div>
            <div className="flex justify-between pt-1 font-bold text-base text-[#070F1E]">
              <span>الإجمالي:</span>
              <span className="text-amber-600 font-black">{order.totalAmount.toLocaleString()} {BRAND.currency}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onViewOrders}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#070F1E] hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2"
          >
            <PackageCheck className="w-4 h-4" />
            <span>متابعة طلباتي</span>
          </button>
          <button
            onClick={onNavigateHome}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>متابعة التسوق</span>
          </button>
        </div>
      </div>
    </div>
  );
};
