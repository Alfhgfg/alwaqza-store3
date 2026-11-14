import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { BRAND } from '../constants/brand';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;
    setSent(true);
    setTimeout(() => {
      setName('');
      setPhone('');
      setMessage('');
      setSent(false);
    }, 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-right">
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
        اتصل بنا وخدمة العملاء
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 mb-8">
        نحن هنا دائماً لخدمتكم والإجابة على جميع استفساراتكم بخصوص المنتجات والطلبات الخارجية
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="space-y-4">
          <div className="bg-[#070F1E] text-white rounded-3xl p-6 border border-amber-500/20 space-y-4">
            <h3 className="font-extrabold text-base text-amber-400">بيانات التواصل المباشر</h3>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">الهاتف المباشر</span>
                <span className="text-sm font-bold font-mono" dir="ltr">{BRAND.phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">واتساب المبيعات والدعم</span>
                <a
                  href={BRAND.social.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-bold text-emerald-400 hover:underline font-mono"
                  dir="ltr"
                >
                  +{BRAND.whatsapp}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">البريد الإلكتروني</span>
                <span className="text-sm font-bold font-mono">{BRAND.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">المقر الرئيسي</span>
                <span className="text-sm font-bold">{BRAND.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <h3 className="font-extrabold text-base text-slate-900 mb-4">أرسل لنا رسالة</h3>

          {sent && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>تم إرسال رسالتك بنجاح، سنرد عليك في أقرب وقت!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الاسم الكريم</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="اسمك"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف أو الواتساب</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="770000000"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm outline-none focus:border-amber-500 text-left"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الرسالة أو الاستفسار</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="اكتب استفسارك هنا بالتفصيل..."
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#070F1E] hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>إرسال الرسالة</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
