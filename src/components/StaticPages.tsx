import React from 'react';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, FileText } from 'lucide-react';
import { BRAND } from '../constants/brand';

interface StaticPageProps {
  type: 'terms' | 'privacy' | 'shipping' | 'returns' | 'about';
  onBack: () => void;
}

export const StaticPage: React.FC<StaticPageProps> = ({ type, onBack }) => {
  const getPageContent = () => {
    switch (type) {
      case 'about':
        return {
          title: 'عن متجر الوقزة',
          icon: ShieldCheck,
          content: `متجر الوقزة هو وجهتكم الرائدة للتسوق الإلكتروني الراقي في الجمهورية اليمنية. تأسس المتجر لتقديم تجربة تسوق استثنائية تمزج بين الفخامة، الجودة المضمونة، والأسعار المنافسة. نتميز بتوفير خدمة "اخترها ونحن نوصلها" التي تتيح لعملائنا في اليمن شراء أي سلعة من كبرى المتاجر العالمية بكل سهولة وأمان.`
        };
      case 'shipping':
        return {
          title: 'سياسة الشحن والتوصيل',
          icon: Truck,
          content: `نوفر خدمة التوصيل السريع لجميع المحافظات اليمنية (صنعاء، عدن، تعز، الحديدة، إب، حضرموت، وغيرها). يتم توصيل الطلبات داخل صنعاء خلال 24 ساعة، وباقي المحافظات خلال 48 إلى 72 ساعة. نوفر ميزة المعاينة والفحص عند الاستلام قبل دفع أي مبلغ لضمان راحة وطمأنينة العميل.`
        };
      case 'returns':
        return {
          title: 'سياسة الاستبدال والاسترجاع',
          icon: RefreshCw,
          content: `يحق للعميل استبدال أو استرجاع أي منتج خلال 3 أيام من تاريخ الاستلام في حال وجود أي عيب مصنعي أو اختلاف عن المواصفات المعلنة، بشرط بقاء المنتج في حالته وتغليفه الأصلي.`
        };
      case 'privacy':
        return {
          title: 'سياسة الخصوصية والأمان',
          icon: ShieldCheck,
          content: `يلتزم متجر الوقزة بحماية خصوصية جميع المستخدمين ومعلوماتهم الشخصية. نستخدم أحدث بروتوكولات التشفير ولا نشارك بياناتك مع أي طرف ثالث تحت أي ظرف.`
        };
      default:
        return {
          title: 'الشروط والأحكام',
          icon: FileText,
          content: `باستخدامك لتطبيق ومتجر الوقزة، فإنك توافق على الالتزام بجميع الشروط والسياسات المحددة في التطبيق. نحرص دائماً على تقديم خدمة تتوافق مع أعلى معايير الجودة والأمان.`
        };
    }
  };

  const { title, icon: Icon, content } = getPageContent();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-right">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowRight className="w-4 h-4" />
        <span>العودة</span>
      </button>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <Icon className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">{title}</h1>
        </div>

        <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-8">
          {content}
        </p>

        <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-500 border border-slate-200">
          متجر الوقزة | {BRAND.slogan} | جميع الحقوق محفوظة {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};
