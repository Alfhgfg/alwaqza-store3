import React, { useState } from 'react';
import { Phone, Mail, Send, CheckCircle, MessageSquare } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BRAND } from '../constants/brand';

export const ContactPage: React.FC = () => {
  const { settings, submitInquiry } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitInquiry({
      name: name.trim(),
      phone: phone.trim(),
      message: message.trim(),
    });
    setSent(true);
    setName('');
    setPhone('');
    setMessage('');
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Brand Logo Banner */}
      <div className="w-44 h-auto mx-auto mb-6">
        <img src={BRAND.logoUrl} alt={BRAND.name} className="w-full h-auto object-contain" />
      </div>

      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">تواصل مع متجر الوقزة</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          فريق خدمة العملاء متاح وجاهز للإجابة على جميع استفساراتكم ومساعدتكم في أي طلب
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* WhatsApp Card */}
        <a
          href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 mb-1">المحادثة عبر واتساب</h3>
          <p className="text-xs text-slate-500 mb-3">رد فوري وسريع على مدار الساعة</p>
          <span className="text-xs font-mono font-bold text-emerald-800">{settings.whatsapp}</span>
        </a>

        {/* Phone Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#FBF6EB] text-[#C59B4B] border border-[#E8D2A2] flex items-center justify-center mx-auto mb-3">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 mb-1">الاتصال الهاتفي</h3>
          <p className="text-xs text-slate-500 mb-3">أوقات العمل من 9 صباحاً إلى 10 مساءً</p>
          <span className="text-xs font-mono font-bold text-[#0F1E36]">{settings.phone}</span>
        </div>

        {/* Email Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#0F1E36] flex items-center justify-center mx-auto mb-3">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 mb-1">البريد الإلكتروني</h3>
          <p className="text-xs text-slate-500 mb-3">للاستفسارات الرسمية والشراكات</p>
          <span className="text-xs font-mono font-bold text-[#0F1E36]">{settings.email}</span>
        </div>
      </div>

      {/* Inquiry Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-2xl mx-auto">
        <h2 className="text-base font-black text-slate-900 mb-4 pb-2 border-b border-slate-100">
          أرسل لنا رسالة مباشرة
        </h2>

        {sent && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>تم استلام رسالتك بنجاح! سيتواصل معك فريق خدمة العملاء قريباً.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">الاسم الكريم</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="اسمك"
                className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl focus:border-[#0F1E36] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">رقم الهاتف / الواتساب</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="رقم الهاتف"
                className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl focus:border-[#0F1E36] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">نص الرسالة أو الاستفسار</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب استفسارك هنا..."
              className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl focus:border-[#0F1E36] focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0F1E36] hover:bg-[#1A3258] text-[#DFBA6F] font-bold text-sm py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>إرسال الرسالة</span>
          </button>
        </form>
      </div>
    </div>
  );
};
