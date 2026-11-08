import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  KeyRound,
  ShieldAlert,
  Clock,
  Fingerprint,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BRAND } from '../constants/brand';

interface AdminLoginPageProps {
  onSuccess?: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess }) => {
  const { loginAsSuperAdmin, setCurrentView, isSuperAdmin } = useStore();

  const [username, setUsername] = useState('المدير الرئيسي لمتجر الوقزة');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState<number | null>(null);

  // If already logged in, show quick redirect
  useEffect(() => {
    if (isSuperAdmin) {
      setCurrentView('admin');
    }
  }, [isSuperAdmin, setCurrentView]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds === null || lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          setErrorMessage(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds && lockoutSeconds > 0) {
      return;
    }

    if (!password.trim()) {
      setErrorMessage('يرجى إدخال كلمة المرور.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await loginAsSuperAdmin(password, username);
      if (res.success) {
        setSuccessMessage('تم التحقق من هوية المدير الرئيسي بنجاح! جاري تحويلك إلى لوحة التحكم...');
        setTimeout(() => {
          if (onSuccess) onSuccess();
          setCurrentView('admin');
        }, 800);
      } else {
        if (res.locked && res.remainingSeconds) {
          setLockoutSeconds(res.remainingSeconds);
          setErrorMessage(res.error || 'تم حظر محاولات الدخول مؤقتاً لحماية الحساب من التخمين.');
        } else {
          setErrorMessage(res.error || 'فشل تسجيل الدخول. يرجى التأكد من كلمة المرور.');
          if (res.remainingAttempts !== undefined) {
            setRemainingAttempts(res.remainingAttempts);
          }
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'حدث خطأ في الاتصال بخادم الحماية.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-[#070F1E] via-[#0B1B36] to-[#070F1E] relative overflow-hidden">
      {/* Decorative Gold Radial Glows */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#D4A853]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#B38938]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Return Button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-[#F5D68B] transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-lg border border-slate-700/60"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة إلى واجهة المتجر</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <Shield className="w-3.5 h-3.5" />
            <span>نطاق إداري محمي</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-[#0c162b]/95 backdrop-blur-xl border border-[#D4A853]/30 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Strip */}
          <div className="bg-gradient-to-r from-[#D4A853]/20 via-[#F5D68B]/10 to-[#D4A853]/20 p-6 text-center border-b border-[#D4A853]/20">
            {/* Store Logo */}
            <div className="flex justify-center mb-3">
              <div className="h-16 w-auto max-w-[200px] flex items-center justify-center p-1 bg-white/95 rounded-xl shadow-md border border-[#D4A853]/40">
                <img
                  src={BRAND.logoUrl}
                  alt={BRAND.name}
                  className="h-full w-auto object-contain"
                />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#070F1E] border border-[#D4A853]/50 text-[#F5D68B] text-xs font-bold mb-2 shadow-xs">
              <Fingerprint className="w-3.5 h-3.5 text-[#D4A853]" />
              <span>تسجيل دخول المدير الرئيسي (Super Admin)</span>
            </div>

            <h1 className="text-xl font-black text-white">
              بوابة الإدارة المركزية لمتجر الوقزة
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              مخصصة حصرياً للمدير الرئيسي للتحكم في المنتجات، الطلبات، والأسعار.
            </p>
          </div>

          {/* Form Area */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Error banner */}
            {errorMessage && (
              <div className="bg-rose-950/60 border border-rose-500/50 rounded-xl p-3.5 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">{errorMessage}</p>
                  {remainingAttempts !== null && remainingAttempts > 0 && !lockoutSeconds && (
                    <p className="text-rose-300 text-[11px] mt-1">
                      تبقى لك {remainingAttempts} محاولات قبل أن يتم حظر الدخول مؤقتاً.
                    </p>
                  )}
                  {lockoutSeconds !== null && lockoutSeconds > 0 && (
                    <div className="flex items-center gap-1.5 mt-2 text-amber-300 font-mono text-xs">
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      <span>الوقت المتبقي لفك الحظر: {Math.floor(lockoutSeconds / 60)}:{(lockoutSeconds % 60).toString().padStart(2, '0')}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Success banner */}
            {successMessage && (
              <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-xl p-3.5 text-emerald-200 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold">{successMessage}</span>
              </div>
            )}

            {/* Account Name (Super Admin Identity) */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center justify-between">
                <span>اسم الحساب الإداري</span>
                <span className="text-[10px] text-[#F5D68B] font-mono">حساب وحيد معتمد</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  readOnly
                  className="w-full bg-[#070F1E] border border-slate-700 rounded-xl py-2.5 pr-10 pl-4 text-xs font-bold text-[#F5D68B] focus:outline-hidden cursor-not-allowed select-none"
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                <Lock className="w-3.5 h-3.5 text-emerald-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Password input */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center justify-between">
                <span>كلمة مرور المدير</span>
                <span className="text-[10px] text-slate-400">تشفير bcrypt خادم</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور..."
                  disabled={loading || (lockoutSeconds !== null && lockoutSeconds > 0)}
                  autoFocus
                  className="w-full bg-[#070F1E] border border-slate-700 focus:border-[#D4A853] rounded-xl py-2.5 pr-10 pl-11 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-[#D4A853] transition-all disabled:opacity-50"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-2.5 text-slate-400 hover:text-white transition-colors p-0.5"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>



            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || (lockoutSeconds !== null && lockoutSeconds > 0)}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gold-gradient text-[#070F1E] hover:brightness-105 active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#070F1E] border-t-transparent rounded-full animate-spin" />
                  <span>جارٍ التحقق الأمني من الخادم...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>دخول لوحة تحكم المدير الرئيسي</span>
                </>
              )}
            </button>
          </form>

          {/* Security Features Info Footer */}
          <div className="bg-[#070F1E]/80 border-t border-slate-800/80 p-4 text-[11px] text-slate-400 space-y-2">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>المعايير الأمنية المطبقة لحماية لوحة الإدارة:</span>
            </div>
            <ul className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>تشفير bcrypt تجزئة آمن</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>حماية من التخمين المتكرر</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>حساب وحيد للمدير الرئيسي</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>تسجيل كامل لعمليات الإدارة</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
