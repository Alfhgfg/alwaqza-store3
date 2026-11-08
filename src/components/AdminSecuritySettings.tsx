import React, { useState, useEffect } from 'react';
import {
  Shield,
  KeyRound,
  Lock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  LogOut,
  Clock,
  Eye,
  EyeOff,
  Activity,
  UserCheck,
  Server,
  Layers,
  Search,
  Filter,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  changeSuperAdminPassword,
  getAuditLogs,
  getSecurityStatus,
  AuditLog,
  SecurityStatus,
} from '../services/adminAuth';

export const AdminSecuritySettings: React.FC = () => {
  const { logoutSuperAdminAction, adminInfo } = useStore();

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loadingChange, setLoadingChange] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Security Status State
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logFilter, setLogFilter] = useState<'all' | 'security' | 'critical' | 'info'>('all');
  const [logSearch, setLogSearch] = useState('');

  const loadData = async () => {
    setStatusLoading(true);
    setLogsLoading(true);
    try {
      const [status, logs] = await Promise.all([
        getSecurityStatus(),
        getAuditLogs(),
      ]);
      setSecurityStatus(status);
      setAuditLogs(logs);
    } catch (e) {
      console.warn('Failed loading security settings data:', e);
    } finally {
      setStatusLoading(false);
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Password Strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: '', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[a-zA-Z]/.test(pass)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, text: 'ضعيفة', color: 'bg-rose-500' };
    if (score <= 3) return { score, text: 'متوسطة', color: 'bg-amber-500' };
    return { score, text: 'قوية وممتازة', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(newPassword);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword) {
      setPasswordError('يرجى إدخال كلمة المرور الحالية.');
      return;
    }

    if (!newPassword) {
      setPasswordError('يرجى إدخال كلمة المرور الجديدة.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('يجب أن تحتوي كلمة المرور على 8 خانات على الأقل.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('كلمة المرور الجديدة وتأكيدها غير متطابقين.');
      return;
    }

    setLoadingChange(true);
    try {
      const res = await changeSuperAdminPassword(currentPassword, newPassword, confirmPassword);
      if (res.success) {
        setPasswordSuccess(res.message || 'تم تحديث كلمة المرور بنجاح وإنهاء كافة الجلسات السابقة.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        await loadData();
      } else {
        setPasswordError(res.error || 'فشل تحديث كلمة المرور.');
      }
    } catch (err: any) {
      setPasswordError(err?.message || 'حدث خطأ في معالجة الطلب.');
    } finally {
      setLoadingChange(false);
    }
  };

  const filteredLogs = auditLogs.filter((log) => {
    if (logFilter !== 'all' && log.severity !== logFilter) return false;
    if (logSearch) {
      const search = logSearch.toLowerCase();
      return (
        log.action.toLowerCase().includes(search) ||
        log.details.toLowerCase().includes(search) ||
        log.actor.toLowerCase().includes(search) ||
        log.ip.toLowerCase().includes(search)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#070F1E] via-[#0B1B36] to-[#070F1E] p-6 rounded-2xl border border-[#D4A853]/30 text-white relative overflow-hidden shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A853]/20 border border-[#D4A853]/40 text-[#F5D68B] text-xs font-bold mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>إعدادات أمان المدير الرئيسي لمتجر الوقزة</span>
            </div>
            <h2 className="text-xl font-black text-white">
              الحماية المركزية وإدارة بيانات الاعتماد
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              لوحة الإدارة مؤمنة بتقنيات التجزئة والتشفير المتقدم (bcrypt) مع إنهاء فوري لكافة الجلسات عند تغيير كلمة المرور، وحماية مضادة لمحاولات التخمين والاختراق.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all border border-slate-700/80 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${statusLoading || logsLoading ? 'animate-spin' : ''}`} />
              <span>تحديث البيانات</span>
            </button>

            <button
              onClick={logoutSuperAdminAction}
              className="flex items-center gap-2 bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>إنهاء الجلسة وتسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Password Change + Account Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Change Password Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
          <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">تغيير كلمة مرور المدير الرئيسي</h3>
              <p className="text-xs text-slate-500">
                يشترط إدخال كلمة المرور الحالية، وتؤدي العملية إلى إنهاء جميع الجلسات السابقة فوراً.
              </p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {passwordError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-xl flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-bold">{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-xl flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">{passwordSuccess}</span>
              </div>
            )}

            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>كلمة المرور الحالية (شرط إلزامي)</span>
                <span className="text-[10px] text-slate-400">مطلوبة لتأكيد الهوية</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور الحالية..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl py-2.5 pr-4 pl-10 text-xs font-medium focus:outline-hidden transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password & Strength */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>كلمة المرور الجديدة</span>
                {newPassword && (
                  <span className={`text-[10px] font-bold ${strength.score >= 4 ? 'text-emerald-600' : strength.score >= 3 ? 'text-amber-600' : 'text-rose-600'}`}>
                    مستوى القوة: {strength.text}
                  </span>
                )}
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور الجديدة (8 خانات على الأقل)..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl py-2.5 pr-4 pl-10 text-xs font-medium focus:outline-hidden transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength bar */}
              {newPassword && (
                <div className="mt-2 flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1.5 flex-1 rounded-full transition-all ${
                        level <= strength.score ? strength.color : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                تأكيد كلمة المرور الجديدة
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="أعد إدخال كلمة المرور الجديدة..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl py-2.5 pr-4 pl-10 text-xs font-medium focus:outline-hidden transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Security Warning about Sessions */}
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <p className="font-bold">إشعار أمني إلزامي:</p>
                <p>
                  فور إتمام تغيير كلمة المرور، سيتم فوراً إبطال وإنهاء كافة الجلسات النشطة على جميع المتصفحات والأجهزة، مع تجديد جلسة هذا الجهاز بكلمة المرور الجديدة لضمان عدم بقاء أي وصول غير مصرح به.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingChange}
              className="py-2.5 px-5 rounded-xl font-bold text-xs bg-[#070F1E] hover:bg-[#0B1B36] text-white flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {loadingChange ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>جارٍ التشفير والحفظ وإنهاء الجلسات...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#D4A853]" />
                  <span>تحديث كلمة المرور وإنهاء كافة الجلسات السابقة</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Account Status & Protection Standards */}
        <div className="space-y-6">
          {/* Super Admin Status Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
            <h4 className="font-bold text-slate-900 text-xs mb-3 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>بيانات حساب المدير الرئيسي</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 block">اسم الحساب:</span>
                <span className="font-bold text-slate-900 text-sm">
                  {adminInfo?.username || securityStatus?.accountName || 'المدير الرئيسي لمتجر الوقزة'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block">حالة كلمة المرور:</span>
                  <span className="font-bold text-slate-800">
                    {securityStatus?.isInitialPassword
                      ? 'كلمة المرور الأولية (مفعلة)'
                      : 'تم التحديث وتعيين كلمة مرور مخصصة'}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  securityStatus?.isInitialPassword ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {securityStatus?.isInitialPassword ? 'أولية' : 'محدثة'}
                </span>
              </div>

              {securityStatus?.lastPasswordChange && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">آخر تغيير لكلمة المرور:</span>
                  <span className="font-medium text-slate-700">
                    {new Date(securityStatus.lastPasswordChange).toLocaleString('ar-SA')}
                  </span>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="text-slate-600">الجلسات النشطة حالياً:</span>
                <span className="font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  {securityStatus?.activeSessionsCount || 1} جلسة موثقة
                </span>
              </div>
            </div>
          </div>

          {/* Hardened Protections Checklist */}
          <div className="bg-[#070F1E] rounded-2xl border border-slate-800 text-white p-5 shadow-xs">
            <h4 className="font-bold text-white text-xs mb-3 flex items-center gap-2">
              <Server className="w-4 h-4 text-[#D4A853]" />
              <span>منظومة الحماية المطبقة في الخادم</span>
            </h4>

            <ul className="space-y-2.5 text-[11px]">
              <li className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">تجزئة وتشفير bcrypt</p>
                  <p className="text-[10px] text-slate-400">تخزين التجزئة فقط بالخادم ومنع كشف كلمة المرور.</p>
                </div>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">حماية التخمين (Rate Limiting)</p>
                  <p className="text-[10px] text-slate-400">حظر آلي بعد 5 محاولات خاطئة لمدة 15 دقيقة.</p>
                </div>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">عزل العملاء والزوار</p>
                  <p className="text-[10px] text-slate-400">منع كامل لأي مستخدم غير المدير من بلوغ الإدارة.</p>
                </div>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">إنهاء فوري للجلسات القديمة</p>
                  <p className="text-[10px] text-slate-400">إبطال كل الجلسات السابقة فور تغيير كلمة المرور.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Audit Log Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">سجل النشاط الإداري والأمني (Audit Logs)</h3>
              <p className="text-xs text-slate-500">
                توثيق كامل لكافة عمليات الدخول، تغيير كلمات المرور، والعمليات الإدارية الحساسة.
              </p>
            </div>
          </div>

          {/* Filter & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                placeholder="بحث في السجلات..."
                className="bg-slate-50 border border-slate-200 rounded-xl py-1.5 pr-8 pl-3 text-xs w-44 focus:outline-hidden focus:border-amber-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl text-[11px] font-bold">
              <button
                onClick={() => setLogFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  logFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                الكل ({auditLogs.length})
              </button>
              <button
                onClick={() => setLogFilter('security')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  logFilter === 'security' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                الأمنية
              </button>
              <button
                onClick={() => setLogFilter('critical')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  logFilter === 'critical' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                الحرجة
              </button>
            </div>
          </div>
        </div>

        {/* Table of logs */}
        {logsLoading ? (
          <div className="py-12 text-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-400" />
            <p className="text-xs">جارٍ تحميل سجل العمليات من الخادم...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-10 text-center text-slate-400">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">لا توجد سجلات تطابق الفلتر الحالي.</p>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-bold">الوقت</th>
                  <th className="py-2.5 px-3 font-bold">العملية / الإجراء</th>
                  <th className="py-2.5 px-3 font-bold">المنفّذ</th>
                  <th className="py-2.5 px-3 font-bold">التفاصيل</th>
                  <th className="py-2.5 px-3 font-bold">العنوان (IP)</th>
                  <th className="py-2.5 px-3 font-bold">المستوى</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => {
                  let badgeClass = 'bg-slate-100 text-slate-700';
                  if (log.severity === 'critical') badgeClass = 'bg-rose-100 text-rose-800 font-bold';
                  else if (log.severity === 'security' || log.severity === 'warning') badgeClass = 'bg-amber-100 text-amber-800 font-bold';
                  else if (log.severity === 'info') badgeClass = 'bg-blue-100 text-blue-800';

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString('ar-SA')}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                        {log.action}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                        {log.actor}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate" title={log.details}>
                        {log.details}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap dir-ltr text-right">
                        {log.ip}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${badgeClass}`}>
                          {log.severity}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
