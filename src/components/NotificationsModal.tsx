import React from 'react';
import { X, Bell, CheckCheck, ShoppingBag, Tag, Info } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col text-right max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-[#070F1E] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">الإشعارات والتنبيهات</h3>
          </div>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-xs text-amber-300 hover:text-amber-100 flex items-center gap-1"
                title="تحديد الكل كمقروء"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>قراءة الكل</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              لا توجد إشعارات حالياً
            </div>
          ) : (
            notifications.map(notif => {
              const getIcon = () => {
                if (notif.type === 'order') return <ShoppingBag className="w-4 h-4 text-emerald-600" />;
                if (notif.type === 'promo') return <Tag className="w-4 h-4 text-amber-600" />;
                return <Info className="w-4 h-4 text-blue-600" />;
              };

              return (
                <div
                  key={notif.id}
                  onClick={() => markNotificationAsRead(notif.id)}
                  className={`pt-3 first:pt-0 flex items-start gap-3 cursor-pointer p-2 rounded-xl transition-colors ${
                    !notif.read ? 'bg-amber-50/50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-sm ${!notif.read ? 'font-extrabold text-slate-900' : 'font-medium text-slate-700'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-2" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
