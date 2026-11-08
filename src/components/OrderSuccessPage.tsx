import React from 'react';
import { CheckCircle2, ShoppingBag, Phone, Truck, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BRAND } from '../constants/brand';

interface OrderSuccessPageProps {
  orderNumber: string;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ orderNumber }) => {
  const { setCurrentView, settings, orders } = useStore();
  const currentOrder = orders.find((o) => o.orderNumber === orderNumber);

  const whatsappMessage = encodeURIComponent(
    `مرحباً متجر الوقزة، قمت بتأكيد الطلب رقم (${orderNumber}) وأود متابعة تفاصيل الشحن والتوصيل.`
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-in zoom-in-95 duration-300">
      {/* Official Brand Logo */}
      <div className="w-48 h-auto mx-auto mb-6">
        <img
          src={BRAND.logoUrl}
          alt={BRAND.name}
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Icon */}
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/20">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FDF8EC] text-[#070F1E] border border-[#E5C989] font-bold text-xs mb-3 shadow-xs">
        <span className="text-[#D4A853]">★</span>
        <span>{BRAND.subTitle}</span>
      </div>

      <h1 className="text-3xl font-black text-slate-900 mb-2">
        تم تأكيد طلبك بنجاح!
      </h1>
      <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
        شكراً لتسوقك معنا. تم إرسال تفاصيل الطلب إلى إدارة المتجر للبدء في تجهيزه وتوصيله إليك بأسرع وقت.
      </p>

      {/* Order Badge Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5C989]/60 shadow-md mb-8 text-right space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="text-xs text-slate-500 font-medium">رقم الطلب الفريد:</span>
          <span className="font-mono font-black text-[#0B1B36] text-base bg-[#FDF8EC] px-3.5 py-1 rounded-xl border border-[#E5C989]">
            {orderNumber}
          </span>
        </div>

        {currentOrder && (
          <>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>اسم العميل:</span>
              <span className="font-bold text-slate-900">{currentOrder.customerName}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>مدينة التوصيل:</span>
              <span className="font-bold text-slate-900">
                {currentOrder.governorate} - {currentOrder.area}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>طريقة الدفع:</span>
              <span className="font-bold text-slate-900">{currentOrder.paymentMethod}</span>
            </div>
          </>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 flex items-center gap-1">
            <Clock className="w-4 h-4 text-[#D4A853]" />
            حالة الطلب الحالية:
          </span>
          <span className="font-bold text-[#070F1E] bg-[#FDF8EC] border border-[#E5C989] px-2.5 py-0.5 rounded-md">
            قيد المراجعة والتأكيد
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => setCurrentView('orders')}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0B1B36] hover:bg-[#162E56] text-[#F5D68B] font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-[#0B1B36]/25 border border-[#D4A853]/30 transition-all cursor-pointer"
        >
          <Truck className="w-4 h-4" />
          <span>تتبع حالة الطلب</span>
        </button>

        <a
          href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
        >
          <Phone className="w-4 h-4" />
          <span>متابعة الطلب عبر واتساب</span>
        </a>

        <button
          onClick={() => setCurrentView('home')}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm px-6 py-3.5 rounded-2xl transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>العودة للرئيسية</span>
        </button>
      </div>
    </div>
  );
};
