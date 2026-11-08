import React from 'react';
import { ShieldCheck, RotateCcw, FileText } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BRAND } from '../constants/brand';

interface PolicyPageProps {
  type: 'terms' | 'privacy' | 'returns';
}

export const StaticPages: React.FC<PolicyPageProps> = ({ type }) => {
  const { setCurrentView, settings } = useStore();

  const getPageContent = () => {
    switch (type) {
      case 'terms':
        return {
          title: 'الشروط والأحكام',
          icon: <FileText className="w-8 h-8 text-[#0F1E36]" />,
          sections: [
            {
              heading: '1. مقدمة والتعريفات',
              text: 'أهلاً بكم في «متجر الوقزة | AL-WAQZA STORE». تنظم هذه الشروط والأحكام استخدامك للمتجر، وخدمة توفير المنتجات من الروابط الخارجية «اخترها… ونحن نوصلها!». باستخدامك لخدماتنا فإنك توافق على الالتزام الكامل بهذه الشروط.',
            },
            {
              heading: '2. حسابات العملاء ودقة البيانات',
              text: 'يتحمل العميل مسؤولية تزويدنا برقم هاتف وعنوان دقيق لتنفيذ التوصيل بنجاح دون تأخير.',
            },
            {
              heading: '3. خدمة توفير المنتجات من المواقع الخارجية',
              text: 'إرسال رابط المنتج الخارجي لا يعتبر عملية شراء قطعية. يتم أولاً فحص الرابط وتقديم عرض سعر شامل (سعر السلعة + الشحن)، ولا يتم التنفيذ إلا بعد موافقة العميل الصريحة.',
            },
            {
              heading: '4. الأسعار وسياسة الدفع',
              text: 'تعتمد الأسعار المعروضة بالعملة المحددة. نوفر خيارات الدفع عند الاستلام أو التحويلات المحلية المعتمدة.',
            },
          ],
        };
      case 'privacy':
        return {
          title: 'سياسة الخصوصية وأمان البيانات',
          icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
          sections: [
            {
              heading: '1. حماية بيانات العملاء',
              text: 'نلتزم في متجر الوقزة بأعلى معايير حماية البيانات الشخصية. لا نقوم ببيع أو مشاركة بياناتك (الاسم، رقم الهاتف، العنوان) مع أي أطراف ثالثة خارج نطاق تنفيذ وتوصيل طلبك.',
            },
            {
              heading: '2. أمان الحسابات وكلمات المرور',
              text: 'نستخدم نظام مصادقة آمن ومدعوم من Google Firebase، ولا نقوم بتخزين كلمات المرور كنصوص عادية، مع تطبيق قواعد أمان سحابية تمنع أي وصول غير مصرح به.',
            },
            {
              heading: '3. أمان طلبات الشراء والروابط',
              text: 'كافة الروابط التي ترسلها تخضع لسرية تامة ويطلع عليها فريق المشتريات المعني فقط لتسعيرها وتوفيرها لك بأمان.',
            },
          ],
        };
      case 'returns':
        return {
          title: 'سياسة الاسترجاع والاستبدال',
          icon: <RotateCcw className="w-8 h-8 text-[#C59B4B]" />,
          sections: [
            {
              heading: '1. حق الفحص عند الاستلام',
              text: 'يحق للعميل فحص المنتج ظاهرياً والتأكد من مطابقته للمواصفات بحضور مندوب التوصيل قبل الاستلام النهائي.',
            },
            {
              heading: '2. فترة الاسترجاع والاستبدال',
              text: settings.returnPolicy || 'يحق للعميل طلب استرجاع أو استبدال المنتج خلال 3 أيام من تاريخ الاستلام في حال وجود عيب مصنعي أو اختلاف جوهري عن المواصفات المعلنة.',
            },
            {
              heading: '3. الشروط الواجب توفرها',
              text: 'يجب أن يكون المنتج في حالته الأصلية وبغلافه الأصلي مع كافة الملحقات والكتيبات المرفقة.',
            },
          ],
        };
    }
  };

  const content = getPageContent();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-200 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#FBF6EB] border border-[#E8D2A2] flex items-center justify-center shrink-0">
            {content.icon}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">{content.title}</h1>
            <p className="text-xs text-slate-500">{BRAND.fullName}</p>
          </div>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {content.sections.map((sec, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {sec.heading}
              </h3>
              <p className="text-slate-600 leading-relaxed">{sec.text}</p>
            </div>
          ))}
        </div>

        <div className="pt-8 mt-8 border-t border-slate-200 flex justify-between items-center">
          <button
            onClick={() => setCurrentView('home')}
            className="text-xs font-bold text-[#0F1E36] hover:text-[#C59B4B] hover:underline flex items-center gap-1.5 transition-colors"
          >
            <span>العودة للرئيسية</span>
          </button>
          <span className="text-xs text-slate-400">آخر تحديث: 2026</span>
        </div>
      </div>
    </div>
  );
};
