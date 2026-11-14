import React, { useState } from 'react';
import { Shield, KeyRound, ArrowRight, AlertCircle, Lock } from 'lucide-react';
import { adminAuthService } from '../services/adminAuth';

interface AdminLoginPageProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess, onBack }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError(null);

    try {
      const res = await adminAuthService.login(password);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.message || 'كلمة المرور غير صحيحة');
      }
    } catch {
      setError('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-right">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 mb-8"
      >
        <ArrowRight className="w-4 h-4" />
        <span>العودة للمتجر</span>
      </button>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#070F1E] to-[#1E3056] text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#070F1E]/20">
          <Shield className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-black text-slate-900 mb-1">
          لوحة تحكم المدير
        </h1>
        <p className="text-xs text-slate-500 mb-6">
          تسجيل الدخول الآمن لإدارة الطلبات والمنتجات
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2 text-right">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-right">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              كلمة مرور المشرف (Admin Password)
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="أدخل كلمة مرور الإدارة..."
                className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs sm:text-sm outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#070F1E] hover:bg-amber-500 hover:text-slate-950 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>{loading ? 'جاري التحقق...' : 'تسجيل الدخول'}</span>
          </button>
        </form>

        <p className="text-[11px] text-slate-400 mt-6">
          محمي بنظام التشفير الآمن وقفل المحاولات الخاطئة
        </p>
      </div>
    </div>
  );
};
