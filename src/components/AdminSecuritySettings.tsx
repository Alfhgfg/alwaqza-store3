import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Key, History, AlertTriangle, Check } from 'lucide-react';
import { adminAuthService, AuditLog, SecurityStats } from '../services/adminAuth';

interface AdminSecuritySettingsProps {
  onBack: () => void;
}

export const AdminSecuritySettings: React.FC<AdminSecuritySettingsProps> = ({ onBack }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    adminAuthService.getAuditLogs().then(setLogs);
    adminAuthService.getSecurityStats().then(setStats);
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMsg({ type: 'error', text: 'كلمة المرور الجديدة غير متطابقة' });
      return;
    }

    setLoading(true);
    setMsg(null);
    try {
      const res = await adminAuthService.changePassword(currentPassword, newPassword);
      if (res.success) {
        setMsg({ type: 'success', text: 'تم تحديث كلمة المرور بنجاح!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMsg({ type: 'error', text: res.message || 'فشل تحديث كلمة المرور' });
      }
    } catch {
      setMsg({ type: 'error', text: 'حدث خطأ أثناء الاتصال بالخادم' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-right">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowRight className="w-4 h-4" />
        <span>العودة للوحة التحكم</span>
      </button>

      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6 flex items-center gap-2">
        <ShieldCheck className="w-7 h-7 text-emerald-600" />
        <span>إعدادات الأمان وسجل العمليات</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Change Password Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-500" />
            <span>تغيير كلمة مرور المشرف</span>
          </h2>

          {msg && (
            <div className={`p-3 rounded-xl mb-4 text-xs font-bold ${
              msg.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
            }`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور الحالية</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور الجديدة</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">تأكيد كلمة المرور الجديدة</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#070F1E] hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs transition-colors"
            >
              {loading ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
            </button>
          </form>
        </div>

        {/* Security Overview */}
        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>حالة الأمان والحماية</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between">
              <span className="text-slate-600">نظام التشفير:</span>
              <span className="font-extrabold text-slate-900">bcrypt (Salt Rounds 10)</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between">
              <span className="text-slate-600">حماية الدخول (Rate Limit):</span>
              <span className="font-extrabold text-emerald-600">مفعلة (5 محاولات / 15 دقيقة)</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between">
              <span className="text-slate-600">محاولات الدخول الفاشلة:</span>
              <span className="font-extrabold text-slate-900">{stats?.failedAttempts ?? 0}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between">
              <span className="text-slate-600">جلسة المشرف:</span>
              <span className="font-extrabold text-emerald-600">نشطة ومحمية عبر Token</span>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <History className="w-4 h-4 text-amber-500" />
          <span>سجل نشاط الإدارة والأمان (Audit Log)</span>
        </h2>

        {logs.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">لا توجد سجلات مسجلة حتى الآن</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2">الوقت</th>
                  <th className="py-2">الحدث</th>
                  <th className="py-2">الحالة</th>
                  <th className="py-2">عنوان IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map(log => (
                  <tr key={log.id}>
                    <td className="py-2.5 text-slate-600">{new Date(log.timestamp).toLocaleString('ar-YE')}</td>
                    <td className="py-2.5 font-bold text-slate-900">{log.event}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.success ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                      }`}>
                        {log.success ? 'نجاح' : 'فشل'}
                      </span>
                    </td>
                    <td className="py-2.5 font-mono text-slate-500">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
