import React, { useState } from 'react';
import {
  Package,
  Layers,
  ShoppingBag,
  Link2,
  Image as ImageIcon,
  Settings,
  TrendingUp,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Search,
  DollarSign,
  Database,
  ArrowRight,
  Shield,
  X,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Table,
  Tag,
  MessageSquare,
  Star,
  Users,
  Eye,
  Check,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { GoogleSheetsExportResult } from '../services/googleSheets';
import { BRAND } from '../constants/brand';
import {
  Product,
  Category,
  Order,
  ProductRequest,
  Banner,
  OrderStatus,
  ProductRequestStatus,
} from '../types';
import { AdminSecuritySettings } from './AdminSecuritySettings';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    orders,
    productRequests,
    banners,
    settings,
    addProduct,
    updateProduct,
    deleteProduct,
    deleteCategory,
    updateBanner,
    deleteBanner,
    updateOrderStatus,
    updateProductRequestQuote,
    updateProductRequestStatus,
    updateSettings,
    seedInitialDataToFirestore,
    formatPrice,
    setCurrentView,
    isGoogleSheetsConnected,
    connectGoogleSheets,
    exportOrdersToSheets,
    exportRequestsToSheets,
    exportProductsToSheets,
    recentSheetsExports,
    reviews,
    deleteReview,
    coupons,
    addCoupon,
    deleteCoupon,
    toggleCouponStatus,
    inquiries,
    updateInquiryStatus,
    addCategory,
    addBanner,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'categories' | 'orders' | 'requests' | 'banners' | 'marketing' | 'reviews' | 'inquiries' | 'settings' | 'sheets' | 'security'
  >('overview');

  // New Category Form state
  const [newCatForm, setNewCatForm] = useState({ name: '', icon: 'Package' });

  // New Banner Form state
  const [newBannerForm, setNewBannerForm] = useState({
    title: '',
    subtitle: '',
    badge: 'عرض جديد',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=85',
    linkType: 'category' as const,
    linkValue: 'electronics',
    active: true,
    order: 1,
  });

  // New Coupon Form state
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [newCouponForm, setNewCouponForm] = useState({
    code: '',
    discountPercent: 10,
    minOrderAmount: 50,
    description: '',
    active: true,
  });

  // Google Sheets state
  const [isExportingSheets, setIsExportingSheets] = useState(false);
  const [sheetsExportError, setSheetsExportError] = useState<string | null>(null);
  const [lastSheetsExport, setLastSheetsExport] = useState<GoogleSheetsExportResult | null>(null);
  const [confirmExportModal, setConfirmExportModal] = useState<{
    type: 'orders' | 'requests' | 'products';
    title: string;
    description: string;
    count: number;
  } | null>(null);

  const handleExecuteExport = async () => {
    if (!confirmExportModal) return;
    const { type } = confirmExportModal;
    setConfirmExportModal(null);
    setIsExportingSheets(true);
    setSheetsExportError(null);

    try {
      let result: GoogleSheetsExportResult;
      if (type === 'orders') {
        result = await exportOrdersToSheets();
      } else if (type === 'requests') {
        result = await exportRequestsToSheets();
      } else {
        result = await exportProductsToSheets();
      }
      setLastSheetsExport(result);
    } catch (err: any) {
      console.error('Export to Google Sheets failed:', err);
      setSheetsExportError(err?.message || 'حدث خطأ أثناء تصدير البيانات إلى Google Sheets');
    } finally {
      setIsExportingSheets(false);
    }
  };


  // Search & Filter state
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState<string>('all');

  // Product Add / Edit modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodForm, setProdForm] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    discountPercent: 0,
    category: categories[0]?.id || 'electronics',
    image: '',
    inStock: true,
    stockCount: 10,
    featured: false,
    isDeal: false,
    colors: ['كحلي', 'أسود', 'ذهبي'],
  });

  // Quote modal state for External Requests
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedReqForQuote, setSelectedReqForQuote] = useState<ProductRequest | null>(null);
  const [quoteForm, setQuoteForm] = useState({
    quotedPrice: 0,
    deliveryFee: 15,
    estimatedDays: '7-12 يوم عمل',
    adminNotes: '',
  });

  // Invoice view modal
  const [viewInvoiceOrder, setViewInvoiceOrder] = useState<Order | null>(null);

  // New Category Modal
  const [showCatModal, setShowCatModal] = useState(false);

  // New Banner Modal
  const [showBannerModal, setShowBannerModal] = useState(false);

  // Analytics Calculations
  const totalSales = orders.reduce((sum, o) => (o.status !== 'ملغي' ? sum + o.total : sum), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'جديد' || o.status === 'قيد التأكيد').length;
  const pendingRequestsCount = productRequests.filter((r) => r.status === 'جديد' || r.status === 'قيد المراجعة').length;

  // Handle Product Save
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name || !prodForm.price || !prodForm.image) {
      alert('يرجى ملء الاسم والسعر ورابط الصورة.');
      return;
    }

    if (editingProduct) {
      await updateProduct(editingProduct.id, prodForm);
    } else {
      await addProduct(prodForm as any);
    }
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleEditProductClick = (p: Product) => {
    setEditingProduct(p);
    setProdForm(p);
    setShowProductModal(true);
  };

  const handleDeleteProductClick = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج نهائياً من المتجر؟')) {
      await deleteProduct(id);
    }
  };

  // Handle Quote Submit
  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReqForQuote) return;
    await updateProductRequestQuote(selectedReqForQuote.id, quoteForm);
    setShowQuoteModal(false);
    setSelectedReqForQuote(null);
  };

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerPhone.includes(orderSearch);
    const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchSearch && matchStatus;
  });

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(productSearch.toLowerCase());
    const matchCat = productCatFilter === 'all' || p.category === productCatFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header with Brand Logo */}
      <div className="bg-[#070F1E] text-white rounded-3xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border border-[#D4A853]/25 relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#D4A853]/15 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4 text-center md:text-right">
          {/* Official Logo Box */}
          <div className="bg-white p-2 rounded-2xl shrink-0 shadow-md max-w-[140px] flex items-center justify-center">
            <img src={BRAND.logoUrl} alt={BRAND.name} className="h-10 w-auto object-contain" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">
                لوحة تحكم إدارة «متجر الوقزة»
              </h1>
              <span className="text-[11px] bg-gold-gradient text-[#070F1E] px-2 py-0.5 rounded-md font-black shadow-xs">
                ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              إدارة المنتجات، متابعة الطلبات، تسعير روابط العملاء الخارجية، وإعدادات المتجر
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={seedInitialDataToFirestore}
            className="flex items-center gap-2 bg-[#0B1B36] hover:bg-[#162E56] text-[#F5D68B] text-xs font-bold px-4 py-2.5 rounded-xl shadow-md border border-[#D4A853]/35 transition-all cursor-pointer"
            title="حفظ وتهيئة المنتجات والأقسام والبنرات في قاعدة بيانات Firestore"
          >
            <Database className="w-4 h-4 text-[#F5D68B]" />
            <span>تحديث قاعدة البيانات السحابية</span>
          </button>

          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all border border-white/15 cursor-pointer"
          >
            <span>معاينة واجهة المتجر</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#0B1B36] text-[#F5D68B] shadow-md border border-[#D4A853]/50'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>الإحصائيات والتقارير</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 relative cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-[#0B1B36] text-[#F5D68B] shadow-md border border-[#D4A853]/50'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>إدارة الطلبات</span>
          {pendingOrdersCount > 0 && (
            <span className="bg-gold-gradient text-[#070F1E] text-[10px] px-1.5 py-0.2 rounded-full font-black shadow-xs">
              {pendingOrdersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 relative cursor-pointer ${
            activeTab === 'requests'
              ? 'bg-[#0B1B36] text-[#F5D68B] shadow-md border border-[#D4A853]/50'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Link2 className="w-4 h-4" />
          <span>طلبات الروابط الخارجية</span>
          {pendingRequestsCount > 0 && (
            <span className="bg-gold-gradient text-[#070F1E] text-[10px] px-1.5 py-0.2 rounded-full font-black shadow-xs">
              {pendingRequestsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'products'
              ? 'bg-[#0F1E36] text-[#DFBA6F] shadow-md border border-[#C59B4B]/30'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>إدارة المنتجات ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'categories'
              ? 'bg-[#0F1E36] text-[#DFBA6F] shadow-md border border-[#C59B4B]/30'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>الأقسام ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('banners')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'banners'
              ? 'bg-[#0F1E36] text-[#DFBA6F] shadow-md border border-[#C59B4B]/30'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>الإعلانات والبنرات</span>
        </button>



        <button
          onClick={() => setActiveTab('marketing')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'marketing'
              ? 'bg-[#0F1E36] text-[#DFBA6F] shadow-md border border-[#C59B4B]/30'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>التسويق والكوبونات ({coupons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'reviews'
              ? 'bg-[#0F1E36] text-[#DFBA6F] shadow-md border border-[#C59B4B]/30'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Star className="w-4 h-4 text-[#C59B4B]" />
          <span>التقييمات والمراجعات ({reviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 relative ${
            activeTab === 'inquiries'
              ? 'bg-[#0F1E36] text-[#DFBA6F] shadow-md border border-[#C59B4B]/30'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>رسائل واستفسارات العملاء</span>
          {inquiries.filter((i) => i.status === 'new').length > 0 && (
            <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {inquiries.filter((i) => i.status === 'new').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'settings'
              ? 'bg-[#0F1E36] text-[#DFBA6F] shadow-md border border-[#C59B4B]/30'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>إعدادات المتجر</span>
        </button>

        <button
          onClick={() => setActiveTab('sheets')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'sheets'
              ? 'bg-[#0F1E36] text-[#DFBA6F] shadow-md border border-[#C59B4B]/30'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>جداول جوجل (Sheets)</span>
          {isGoogleSheetsConnected && (
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'security'
              ? 'bg-[#070F1E] text-[#F5D68B] shadow-md border border-[#D4A853]/60 ring-2 ring-[#D4A853]/30'
              : 'bg-white text-amber-900 hover:bg-amber-50/50 border border-amber-200'
          }`}
        >
          <Shield className="w-4 h-4 text-[#D4A853]" />
          <span>إعدادات أمان المدير</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW STATS */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block mb-1">إجمالي المبيعات المؤكدة</span>
                <span className="text-2xl font-black text-[#0F1E36]">{formatPrice(totalSales)}</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block mb-1">إجمالي عدد الطلبات</span>
                <span className="text-2xl font-black text-slate-900">{orders.length} طلب</span>
                <span className="text-[10px] text-[#C59B4B] block font-bold">
                  {pendingOrdersCount} قيد المعالجة
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#FBF6EB] text-[#C59B4B] flex items-center justify-center font-bold">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block mb-1">طلبات الروابط الخارجية</span>
                <span className="text-2xl font-black text-slate-900">{productRequests.length}</span>
                <span className="text-[10px] text-[#0F1E36] block font-bold">
                  {pendingRequestsCount} بانتظار التسعير
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0F1E36] flex items-center justify-center font-bold">
                <Link2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block mb-1">كتالوج المنتجات</span>
                <span className="text-2xl font-black text-slate-900">{products.length} منتج</span>
                <span className="text-[10px] text-emerald-700 block font-medium">
                  عبر {categories.length} أقسام
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Recent Orders Preview */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900">أحدث الطلبات الواردة</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs text-[#0F1E36] font-bold hover:underline"
              >
                عرض كافة الطلبات
              </button>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">لا توجد طلبات واردة بعد.</p>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {orders.slice(0, 5).map((o) => (
                  <div key={o.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-slate-900">{o.orderNumber}</span>
                      <span className="text-slate-500 mr-2">({o.customerName} - {o.governorate})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-[#0F1E36]">{formatPrice(o.total)}</span>
                      <span className="px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-1 max-w-md relative">
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="بحث برقم الطلب، اسم العميل، الهاتف..."
                className="w-full bg-slate-50 border border-slate-300 text-xs py-2.5 pr-10 pl-3 rounded-xl focus:border-[#0F1E36] focus:outline-hidden"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">تصفية بالحالة:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 py-2 px-3 rounded-xl font-medium text-slate-700 focus:border-[#0F1E36]"
              >
                <option value="all">جميع الحالات</option>
                <option value="جديد">جديد</option>
                <option value="قيد التأكيد">قيد التأكيد</option>
                <option value="مؤكد">مؤكد</option>
                <option value="قيد التجهيز">قيد التجهيز</option>
                <option value="جاهز للشحن">جاهز للشحن</option>
                <option value="خرج للتوصيل">خرج للتوصيل</option>
                <option value="تم التسليم">تم التسليم</option>
                <option value="ملغي">ملغي</option>
              </select>
            </div>

            <button
              onClick={() =>
                setConfirmExportModal({
                  type: 'orders',
                  title: 'سجل طلبات متجر الوقزة',
                  description: 'إنشاء جدول Google Sheets جديد وتصدير جميع الطلبات الحالية إليه مع بيانات العملاء والأصناف.',
                  count: orders.length,
                })
              }
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all shadow-xs"
              title="تصدير جميع الطلبات إلى Google Sheets"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>تصدير الطلبات إلى Google Sheets ({orders.length})</span>
            </button>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
              <p className="text-xs text-slate-500">لا توجد طلبات مطابقة لمعايير البحث.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(order.createdAt).toLocaleString('ar-SA')}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="bg-[#FBF6EB] border border-[#E8D2A2] text-[#081220] font-black text-xs py-1.5 px-3 rounded-xl focus:outline-hidden"
                      >
                        <option value="جديد">جديد</option>
                        <option value="قيد التأكيد">قيد التأكيد</option>
                        <option value="مؤكد">مؤكد</option>
                        <option value="قيد التجهيز">قيد التجهيز</option>
                        <option value="جاهز للشحن">جاهز للشحن</option>
                        <option value="خرج للتوصيل">خرج للتوصيل</option>
                        <option value="تم التسليم">تم التسليم</option>
                        <option value="ملغي">ملغي</option>
                      </select>

                      <button
                        onClick={() => setViewInvoiceOrder(order)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 rounded-lg"
                        title="عرض الفاتورة"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Customer and Items Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-2xl space-y-1">
                      <p className="font-bold text-slate-900">
                        العميل: {order.customerName} ({order.customerPhone})
                      </p>
                      <p className="text-slate-600">
                        العنوان: {order.governorate} - {order.city} - {order.area} - {order.address}
                      </p>
                      <p className="text-slate-500">طريقة الدفع: {order.paymentMethod}</p>
                      {order.notes && <p className="text-[#C59B4B] font-medium">ملاحظات: {order.notes}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <span className="font-bold text-slate-700 block">المنتجات المطلوبة:</span>
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-slate-600">
                          <span className="truncate max-w-xs">
                            {item.quantity} × {item.product.name}
                          </span>
                          <span className="font-bold text-slate-900 shrink-0">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-[#0F1E36]">
                        <span>الإجمالي الكلي:</span>
                        <span>{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: EXTERNAL REQUESTS MANAGEMENT */}
      {activeTab === 'requests' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-[#FBF6EB] p-4 rounded-2xl border border-[#E8D2A2] text-xs text-[#081220] flex flex-wrap items-center justify-between gap-3">
            <span className="flex-1">
              هنا تظهر جميع روابط المنتجات الخارجية التي أرسلها العملاء عبر خدمة «اخترها… ونحن نوصلها!».
              يمكنك فحص الرابط، تحديد السعر وتكلفة الشحن وإرسال التسعيرة للعميل للموافقة عليها.
            </span>
            <button
              onClick={() =>
                setConfirmExportModal({
                  type: 'requests',
                  title: 'طلبات التوفير «اخترها ونحن نوصلها»',
                  description: 'إنشاء جدول Google Sheets جديد وتصدير طلبات توفير المنتجات من الروابط الخارجية إليه.',
                  count: productRequests.length,
                })
              }
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs shrink-0"
              title="تصدير طلبات التوفير إلى Google Sheets"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>تصدير إلى Google Sheets ({productRequests.length})</span>
            </button>
          </div>

          {productRequests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
              <p className="text-xs text-slate-500">لا توجد طلبات روابط خارجية حالياً.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {productRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-slate-900 bg-[#FBF6EB] text-[#081220] border border-[#E8D2A2] px-2.5 py-1 rounded-lg">
                        {req.requestNumber}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(req.createdAt).toLocaleString('ar-SA')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={req.status}
                        onChange={(e) =>
                          updateProductRequestStatus(req.id, e.target.value as ProductRequestStatus)
                        }
                        className="bg-slate-100 border border-slate-300 text-xs font-bold py-1.5 px-3 rounded-xl focus:outline-hidden"
                      >
                        <option value="جديد">جديد</option>
                        <option value="قيد المراجعة">قيد المراجعة</option>
                        <option value="تم تحديد السعر">تم تحديد السعر</option>
                        <option value="بانتظار موافقة العميل">بانتظار موافقة العميل</option>
                        <option value="تمت الموافقة">تمت الموافقة</option>
                        <option value="جارٍ توفير المنتج">جارٍ توفير المنتج</option>
                        <option value="مكتمل">مكتمل</option>
                        <option value="غير متاح">غير متاح</option>
                        <option value="ملغي">ملغي</option>
                      </select>

                      <button
                        onClick={() => {
                          setSelectedReqForQuote(req);
                          setQuoteForm({
                            quotedPrice: req.quotedPrice || 0,
                            deliveryFee: req.deliveryFee || 15,
                            estimatedDays: req.estimatedDays || '7-12 يوم عمل',
                            adminNotes: req.adminNotes || '',
                          });
                          setShowQuoteModal(true);
                        }}
                        className="bg-linear-to-r from-[#DFBA6F] to-[#C59B4B] text-[#081220] font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-all"
                      >
                        {req.quotedPrice ? 'تعديل عرض السعر' : 'تسعير الطلب'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <span className="text-slate-400 block text-[11px]">الرابط المطلوب:</span>
                        <a
                          href={req.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[#0F1E36] truncate block hover:underline"
                        >
                          {req.productUrl}
                        </a>
                      </div>
                      <a
                        href={req.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700 shrink-0"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div>
                        <span className="text-slate-400">العميل:</span>
                        <p className="font-bold text-slate-800">
                          {req.customerName} ({req.customerPhone})
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400">الكمية والمواصفات:</span>
                        <p className="font-bold text-slate-800">
                          {req.quantity} قطعة {req.specs && `(${req.specs})`}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400">السعر المعروض حالياً:</span>
                        <p className="font-black text-[#0F1E36]">
                          {req.quotedPrice ? formatPrice(req.quotedPrice + (req.deliveryFee || 0)) : 'لم يتم التسعير بعد'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-1 max-w-md relative">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="بحث في المنتجات..."
                className="w-full bg-white border border-slate-300 text-xs py-2.5 pr-10 pl-3 rounded-xl focus:outline-hidden"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>

            <button
              onClick={() => {
                setEditingProduct(null);
                setProdForm({
                  name: '',
                  description: '',
                  price: 50,
                  originalPrice: 70,
                  discountPercent: 28,
                  category: categories[0]?.id || 'electronics',
                  image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
                  inStock: true,
                  stockCount: 15,
                  featured: false,
                  isDeal: false,
                });
                setShowProductModal(true);
              }}
              className="bg-[#0F1E36] hover:bg-[#1A3258] text-[#DFBA6F] font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة منتج جديد</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                  <tr>
                    <th className="p-4">المنتج</th>
                    <th className="p-4">القسم</th>
                    <th className="p-4">السعر</th>
                    <th className="p-4">المخزون</th>
                    <th className="p-4">الحالة</th>
                    <th className="p-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block line-clamp-1">{p.name}</span>
                            <span className="text-[10px] text-slate-400">{p.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-slate-600">{p.category}</td>
                      <td className="p-4 font-black text-[#0F1E36]">{formatPrice(p.price)}</td>
                      <td className="p-4 font-bold text-slate-700">{p.stockCount} قطعة</td>
                      <td className="p-4">
                        <button
                          onClick={() => updateProduct(p.id, { inStock: !p.inStock })}
                          className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {p.inStock ? 'متوفر' : 'غير متوفر'}
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditProductClick(p)}
                            className="p-1.5 text-slate-600 hover:text-[#0F1E36] hover:bg-slate-100 rounded-lg transition-colors"
                            title="تعديل"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProductClick(p.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base text-slate-900">الأقسام الحالية ({categories.length})</h3>
            <button
              onClick={() => setShowCatModal(true)}
              className="bg-[#0F1E36] hover:bg-[#1A3258] text-[#DFBA6F] font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة قسم جديد</span>
            </button>
          </div>

          {/* Add Category Modal / Inline Box */}
          {showCatModal && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-800">بيانات القسم الجديد</span>
                <button onClick={() => setShowCatModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">اسم القسم باللغة العربية</label>
                  <input
                    type="text"
                    required
                    value={newCatForm.name}
                    onChange={(e) => setNewCatForm({ ...newCatForm, name: e.target.value })}
                    placeholder="مثال: القرطاسية والمكتبية"
                    className="w-full bg-white border border-slate-300 p-2.5 rounded-xl focus:border-[#0F1E36]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">أيقونة القسم</label>
                  <select
                    value={newCatForm.icon}
                    onChange={(e) => setNewCatForm({ ...newCatForm, icon: e.target.value })}
                    className="w-full bg-white border border-slate-300 p-2.5 rounded-xl focus:border-[#0F1E36]"
                  >
                    <option value="Package">صندوق (عام)</option>
                    <option value="Cpu">إلكترونيات</option>
                    <option value="Smartphone">هواتف</option>
                    <option value="Shirt">ملابس</option>
                    <option value="ShoppingBag">أحذية وحقائب</option>
                    <option value="Home">أدوات منزلية</option>
                    <option value="Utensils">مطبخ</option>
                    <option value="Watch">ساعات</option>
                    <option value="Gift">هدايا</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!newCatForm.name.trim()) return;
                    await addCategory({
                      name: newCatForm.name.trim(),
                      icon: newCatForm.icon,
                      order: categories.length + 1,
                      active: true,
                    });
                    setNewCatForm({ name: '', icon: 'Package' });
                    setShowCatModal(false);
                  }}
                  className="bg-[#0F1E36] text-[#DFBA6F] font-bold px-5 py-2 rounded-xl shadow-xs hover:bg-[#1A3258]"
                >
                  حفظ القسم
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between shadow-xs"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{c.name}</h4>
                  <span className="text-[11px] text-slate-400">المعرف: {c.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (window.confirm('حذف هذا القسم؟')) deleteCategory(c.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-700 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: BANNERS MANAGEMENT */}
      {activeTab === 'banners' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base text-slate-900">البنرات التسويقية والإعلانات ({banners.length})</h3>
            <button
              onClick={() => setShowBannerModal(true)}
              className="bg-[#0F1E36] hover:bg-[#1A3258] text-[#DFBA6F] font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة إعلان / بنر</span>
            </button>
          </div>

          {/* Add Banner Box */}
          {showBannerModal && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-800">إضافة إعلان ترويجي جديد</span>
                <button onClick={() => setShowBannerModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">عنوان الإعلان الرئيسي</label>
                  <input
                    type="text"
                    required
                    value={newBannerForm.title}
                    onChange={(e) => setNewBannerForm({ ...newBannerForm, title: e.target.value })}
                    placeholder="مثال: خصومات حصرية على الأجهزة"
                    className="w-full bg-white border border-slate-300 p-2.5 rounded-xl focus:border-[#0F1E36]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الشارة أو العبارة الفرعية البارزة</label>
                  <input
                    type="text"
                    value={newBannerForm.badge}
                    onChange={(e) => setNewBannerForm({ ...newBannerForm, badge: e.target.value })}
                    placeholder="مثال: لفترة محدودة"
                    className="w-full bg-white border border-slate-300 p-2.5 rounded-xl focus:border-[#0F1E36]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">الوصف التسويقي للبنر</label>
                  <input
                    type="text"
                    value={newBannerForm.subtitle}
                    onChange={(e) => setNewBannerForm({ ...newBannerForm, subtitle: e.target.value })}
                    placeholder="مثال: خصم 30% مع شحن مجاني لكافة محافظات الجمهورية"
                    className="w-full bg-white border border-slate-300 p-2.5 rounded-xl focus:border-[#0F1E36]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">رابط صورة البنر (URL)</label>
                  <input
                    type="url"
                    value={newBannerForm.imageUrl}
                    onChange={(e) => setNewBannerForm({ ...newBannerForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white border border-slate-300 p-2.5 rounded-xl focus:border-[#0F1E36] text-left ltr"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBannerModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!newBannerForm.title.trim() || !newBannerForm.imageUrl.trim()) return;
                    await addBanner({
                      ...newBannerForm,
                      order: banners.length + 1,
                    });
                    setNewBannerForm({
                      title: '',
                      subtitle: '',
                      badge: 'عرض جديد',
                      imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=85',
                      linkType: 'category',
                      linkValue: 'electronics',
                      active: true,
                      order: 1,
                    });
                    setShowBannerModal(false);
                  }}
                  className="bg-[#0F1E36] text-[#DFBA6F] font-bold px-5 py-2 rounded-xl shadow-xs hover:bg-[#1A3258]"
                >
                  حفظ الإعلان
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs"
              >
                <div className="h-32 bg-[#081220] relative">
                  <img src={b.imageUrl} alt="" className="w-full h-full object-cover opacity-70" />
                  <div className="absolute inset-0 p-4 flex flex-col justify-end text-white bg-linear-to-t from-black/80">
                    <span className="text-xs text-[#DFBA6F] font-bold">{b.badge}</span>
                    <h4 className="font-black text-sm">{b.title}</h4>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500">الرابط: {b.linkType} ({b.linkValue})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateBanner(b.id, { active: !b.active })}
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        b.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {b.active ? 'نشط' : 'معطل'}
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('حذف هذا الإعلان؟')) deleteBanner(b.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-2xl animate-in fade-in duration-200">
          <h3 className="font-bold text-base text-slate-900 mb-6 pb-3 border-b border-slate-100">
            بيانات المتجر وسياسات التوصيل
          </h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('تم حفظ إعدادات المتجر بنجاح!');
            }}
            className="space-y-4 text-xs"
          >
            <div>
              <label className="block font-bold text-slate-700 mb-1">اسم المتجر</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => updateSettings({ storeName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">الشعار التسويقي (Slogan)</label>
                <input
                  type="text"
                  value={settings.storeSlogan}
                  onChange={(e) => updateSettings({ storeSlogan: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">العبارة التسويقية</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => updateSettings({ tagline: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">رقم الواتساب</label>
                <input
                  type="text"
                  value={settings.whatsapp}
                  onChange={(e) => updateSettings({ whatsapp: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">رسوم التوصيل القياسية (ر.س)</label>
                <input
                  type="number"
                  value={settings.standardDeliveryFee}
                  onChange={(e) => updateSettings({ standardDeliveryFee: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">حد التوصيل المجاني (ر.س)</label>
              <input
                type="number"
                value={settings.freeDeliveryThreshold}
                onChange={(e) => updateSettings({ freeDeliveryThreshold: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="bg-[#0F1E36] text-[#DFBA6F] font-bold px-6 py-2.5 rounded-xl"
              >
                تحديث الإعدادات
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB: MARKETING & COUPONS */}
      {activeTab === 'marketing' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base text-slate-900">إدارة كوبونات الخصم والحملات التسويقية</h3>
              <p className="text-xs text-slate-500">أنشئ كوبونات خصم للعملاء لتشجيع عمليات الشراء وزيادة المبيعات</p>
            </div>
            <button
              onClick={() => setShowCouponModal(true)}
              className="bg-[#0F1E36] hover:bg-[#1A3258] text-[#DFBA6F] font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>إنشاء كوبون جديد</span>
            </button>
          </div>

          {/* Add Coupon Box */}
          {showCouponModal && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-800">بيانات الكوبون الجديد</span>
                <button onClick={() => setShowCouponModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">رمز الكوبون (Code)</label>
                  <input
                    type="text"
                    required
                    value={newCouponForm.code}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, code: e.target.value.toUpperCase() })}
                    placeholder="مثال: SALE25"
                    className="w-full bg-white border border-slate-300 p-2.5 rounded-xl uppercase font-bold text-slate-900 focus:border-[#0F1E36]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نسبة الخصم (%)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={100}
                    value={newCouponForm.discountPercent}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, discountPercent: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 p-2.5 rounded-xl focus:border-[#0F1E36]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الحد الأدنى للطلب (ر.س)</label>
                  <input
                    type="number"
                    value={newCouponForm.minOrderAmount}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, minOrderAmount: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 p-2.5 rounded-xl focus:border-[#0F1E36]"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block font-bold text-slate-700 mb-1">وصف الكوبون للمستخدم</label>
                  <input
                    type="text"
                    value={newCouponForm.description}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, description: e.target.value })}
                    placeholder="مثال: خصم 25% على كافة الطلبات بمناسبة نهاية الأسبوع"
                    className="w-full bg-white border border-slate-300 p-2.5 rounded-xl focus:border-[#0F1E36]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!newCouponForm.code.trim()) return;
                    await addCoupon({
                      ...newCouponForm,
                      code: newCouponForm.code.trim().toUpperCase(),
                    });
                    setNewCouponForm({
                      code: '',
                      discountPercent: 10,
                      minOrderAmount: 50,
                      description: '',
                      active: true,
                    });
                    setShowCouponModal(false);
                  }}
                  className="bg-[#0F1E36] text-[#DFBA6F] font-bold px-5 py-2 rounded-xl shadow-xs hover:bg-[#1A3258]"
                >
                  حفظ وتفعيل الكوبون
                </button>
              </div>
            </div>
          )}

          {/* Coupons List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm bg-[#FBF6EB] text-[#081220] border border-[#E8D2A2] px-3 py-1 rounded-xl">
                      {coupon.code}
                    </span>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">
                      خصم {coupon.discountPercent}%
                    </span>
                  </div>
                  <button
                    onClick={() => toggleCouponStatus(coupon.id)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      coupon.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {coupon.active ? 'نشط' : 'معطل'}
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{coupon.description}</p>
                {coupon.minOrderAmount && (
                  <p className="text-[11px] text-slate-400">
                    الحد الأدنى للطلب: {coupon.minOrderAmount} ر.س
                  </p>
                )}

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-400 text-[10px]">جاهز للاستخدام في السلة</span>
                  <button
                    onClick={() => {
                      if (window.confirm('حذف هذا الكوبون نهائياً؟')) deleteCoupon(coupon.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: REVIEWS MANAGEMENT */}
      {activeTab === 'reviews' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="font-bold text-base text-slate-900">إدارة تقييمات ومراجعات العملاء ({reviews.length})</h3>
            <p className="text-xs text-slate-500">متابعة آراء المشترين والتأكد من جودة المنتجات والخدمة</p>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-xs text-slate-400">
              لا توجد مراجعات أو تقييمات منشورة حتى الآن.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => {
                const prod = products.find((p) => p.id === rev.productId);
                return (
                  <div key={rev.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <span className="font-bold text-slate-900 block">{rev.userName}</span>
                        <span className="text-[11px] text-slate-500">
                          {prod ? prod.name : rev.productId}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 text-[#C59B4B]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-[#C59B4B]' : 'text-slate-200'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-2xl">{rev.comment}</p>
                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                      <span>{new Date(rev.createdAt).toLocaleDateString('ar-SA')}</span>
                      <button
                        onClick={() => {
                          if (window.confirm('حذف هذا التقييم؟')) deleteReview(rev.id);
                        }}
                        className="text-rose-600 hover:text-rose-800 font-bold"
                      >
                        حذف التقييم
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB: INQUIRIES & CUSTOMER MESSAGES */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="font-bold text-base text-slate-900">رسائل واستفسارات العملاء الواردة ({inquiries.length})</h3>
            <p className="text-xs text-slate-500">جميع الاستفسارات والشكاوى المرسلة عبر صفحة "اتصل بنا" أو نموذج التواصل</p>
          </div>

          {inquiries.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-xs text-slate-400">
              لا توجد رسائل واردة جديدة حالياً.
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inq) => (
                <div key={inq.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">{inq.name}</span>
                      <span className="text-slate-500 font-mono text-[11px]">{inq.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={inq.status}
                        onChange={(e) => updateInquiryStatus(inq.id, e.target.value as any)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
                          inq.status === 'new'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : inq.status === 'answered'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-300'
                        }`}
                      >
                        <option value="new">رسالة جديدة</option>
                        <option value="answered">تم الرد والمعالجة</option>
                        <option value="closed">مغلقة</option>
                      </select>
                      <a
                        href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>رد عبر واتساب</span>
                      </a>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed">
                    {inq.message}
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    تاريخ الإرسال: {new Date(inq.createdAt).toLocaleString('ar-SA')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {activeTab === 'sheets' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Main Hero Header */}
          <div className="bg-gradient-to-r from-[#0F1E36] to-[#162A4C] text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute left-6 top-6 opacity-10 pointer-events-none">
              <FileSpreadsheet className="w-48 h-48 text-emerald-400" />
            </div>

            <div className="relative z-10 max-w-3xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-emerald-500/20 text-emerald-400 p-2.5 rounded-2xl border border-emerald-500/30 flex items-center justify-center">
                  <FileSpreadsheet className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black">
                    تكامل Google Sheets | متجر الوقزة
                  </h2>
                  <p className="text-xs text-slate-300">
                    مزامنة وتصدير بيانات الطلبات وطلبات التوفير وكتالوج المنتجات مباشرة إلى جداول بيانات Google Drive.
                  </p>
                </div>
              </div>

              {/* Status and Connect / Re-auth button */}
              <div className="mt-5 pt-5 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  {isGoogleSheetsConnected ? (
                    <div className="flex items-center gap-2 bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 px-3.5 py-1.5 rounded-xl text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>الحساب متصل وجاهز لتصدير البيانات</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-amber-950/60 text-amber-300 border border-amber-800/80 px-3.5 py-1.5 rounded-xl text-xs font-bold">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      <span>سيتطلب منك تسجيل الدخول ومنح صلاحية Google Sheets عند التصدير</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={async () => {
                    try {
                      setIsExportingSheets(true);
                      await connectGoogleSheets();
                    } catch (e: any) {
                      setSheetsExportError(e?.message || 'فشل الاتصال بـ Google Sheets');
                    } finally {
                      setIsExportingSheets(false);
                    }
                  }}
                  disabled={isExportingSheets}
                  className="bg-[#C59B4B] hover:bg-[#B38A3A] text-[#081220] font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>{isGoogleSheetsConnected ? 'تجديد الاتصال بحساب Google' : 'تسجيل الدخول وربط Google Sheets'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active status alerts */}
          {isExportingSheets && (
            <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-2xl p-4 flex items-center gap-3 text-xs font-bold shadow-xs">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
              <span>جارٍ إنشاء جدول البيانات وتنسيقه في Google Drive... يرجى الانتظار ثوانٍ معدودة.</span>
            </div>
          )}

          {sheetsExportError && (
            <div className="bg-red-50 border border-red-200 text-red-900 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs font-bold shadow-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>{sheetsExportError}</span>
              </div>
              <button
                onClick={() => setSheetsExportError(null)}
                className="text-red-700 hover:text-red-900 text-xs underline"
              >
                إغلاق
              </button>
            </div>
          )}

          {lastSheetsExport && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    تم إنشاء وتصدير جدول البيانات بنجاح!
                  </h4>
                  <p className="text-slate-600 mt-0.5">
                    «{lastSheetsExport.title}» — يحتوي على {lastSheetsExport.rowsCount} سجل بصيغة RTL العربية.
                  </p>
                </div>
              </div>

              <a
                href={lastSheetsExport.spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0"
              >
                <span>فتح في Google Sheets</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Export Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Orders Export */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0F1E36] flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm">تصدير سجل الطلبات</h3>
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      {orders.length} طلب
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                    تصدير جميع طلبات الشراء الواردة مع تفاصيل العميل، الهاتف، العنوان، المنتجات، المبالغ، وطريقة الدفع وحالة كل طلب.
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl text-[11px] text-slate-600 space-y-1 border border-slate-100">
                  <div className="font-bold text-slate-700">الأعمدة المضمنة:</div>
                  <div className="text-slate-500">
                    رقم الطلب، العميل، الهاتف، العنوان، الإجمالي، طريقة الدفع، الأصناف، الحالة، التاريخ
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  setConfirmExportModal({
                    type: 'orders',
                    title: 'سجل طلبات متجر الوقزة',
                    description: 'إنشاء جدول Google Sheets جديد وتصدير جميع الطلبات إليه مع التنسيق العربي الرسمي.',
                    count: orders.length,
                  })
                }
                disabled={isExportingSheets}
                className="w-full bg-[#0F1E36] hover:bg-[#1A3258] text-[#DFBA6F] font-bold text-xs py-3 px-4 rounded-xl shadow-md border border-[#C59B4B]/30 transition-all flex items-center justify-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>تصدير الطلبات الآن</span>
              </button>
            </div>

            {/* 2. External Requests Export */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FBF6EB] text-[#C59B4B] flex items-center justify-center">
                  <Link2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm">تصدير طلبات الروابط الخارجية</h3>
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      {productRequests.length} طلب توفير
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                    تصدير روابط المنتجات المطلوبة من أمازون وعلي إكسبريس والمواقع العالمية، وحالة التسعير وتفاصيل العملاء.
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl text-[11px] text-slate-600 space-y-1 border border-slate-100">
                  <div className="font-bold text-slate-700">الأعمدة المضمنة:</div>
                  <div className="text-slate-500">
                    رقم الطلب، العميل، الهاتف، رابط السلعة، الوصف، الكمية، التسعيرة، التوصيل، الحالة، التاريخ
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  setConfirmExportModal({
                    type: 'requests',
                    title: 'طلبات التوفير «اخترها ونحن نوصلها»',
                    description: 'إنشاء جدول Google Sheets جديد وتصدير طلبات الروابط الخارجية وحالاتها.',
                    count: productRequests.length,
                  })
                }
                disabled={isExportingSheets}
                className="w-full bg-[#0F1E36] hover:bg-[#1A3258] text-[#DFBA6F] font-bold text-xs py-3 px-4 rounded-xl shadow-md border border-[#C59B4B]/30 transition-all flex items-center justify-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>تصدير طلبات التوفير الآن</span>
              </button>
            </div>

            {/* 3. Products Catalog Export */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm">تصدير كتالوج المنتجات والمخزون</h3>
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      {products.length} منتج
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                    تصدير قائمة المنتجات المسجلة في المتجر مع كميات المخزون، الأسعار، العروض والخصومات، والأقسام.
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl text-[11px] text-slate-600 space-y-1 border border-slate-100">
                  <div className="font-bold text-slate-700">الأعمدة المضمنة:</div>
                  <div className="text-slate-500">
                    المعرف، الاسم، القسم، السعر الحالي، السعر السابق، نسبة الخصم، المخزون، حالة التوفر
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  setConfirmExportModal({
                    type: 'products',
                    title: 'كتالوج منتجات ومخزون متجر الوقزة',
                    description: 'إنشاء جدول Google Sheets جديد يحتوي على قائمة المنتجات والمخزون والأسعار.',
                    count: products.length,
                  })
                }
                disabled={isExportingSheets}
                className="w-full bg-[#0F1E36] hover:bg-[#1A3258] text-[#DFBA6F] font-bold text-xs py-3 px-4 rounded-xl shadow-md border border-[#C59B4B]/30 transition-all flex items-center justify-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>تصدير كتالوج المنتجات الآن</span>
              </button>
            </div>
          </div>

          {/* Recent Exports History */}
          {recentSheetsExports.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <Table className="w-4 h-4 text-emerald-600" />
                  <span>الجداول المصدرة خلال هذه الجلسة ({recentSheetsExports.length})</span>
                </h3>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {recentSheetsExports.map((sheet, index) => (
                  <div key={index} className="py-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{sheet.title}</span>
                        <span className="text-slate-400 text-[10px]">عدد السجلات: {sheet.rowsCount}</span>
                      </div>
                    </div>

                    <a
                      href={sheet.spreadsheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5 transition-all text-xs"
                    >
                      <span>فتح في Google Sheets</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: SUPER ADMIN SECURITY SETTINGS */}
      {activeTab === 'security' && (
        <div className="animate-in fade-in duration-200">
          <AdminSecuritySettings />
        </div>
      )}

      {/* MODAL: CONFIRM GOOGLE SHEETS EXPORT */}
      {confirmExportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <span>تأكيد تصدير البيانات إلى Google Sheets</span>
              </div>
              <button onClick={() => setConfirmExportModal(null)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-[#FBF6EB] p-4 rounded-2xl border border-[#E8D2A2] text-[#081220]">
                <p className="font-bold text-sm mb-1">{confirmExportModal.title}</p>
                <p className="text-slate-600">{confirmExportModal.description}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600 font-medium">عدد السجلات المطلوب تصديرها:</span>
                <span className="font-black text-[#0F1E36] text-sm">{confirmExportModal.count} سجل</span>
              </div>

              <p className="text-slate-500 text-[11px] leading-relaxed">
                سيتم إنشاء جدول بيانات جديد في حسابك على Google Drive وتنسيقه باللغة العربية RTL مع تجميد صف العناوين وتلوينه بهوية متجر الوقزة.
                هل تؤكد رغبتك في المتابعة؟
              </p>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmExportModal(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleExecuteExport}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-md transition-all flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>تأكيد وبدء التصدير</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PRODUCT */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-slate-900">
                {editingProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
              </h3>
              <button onClick={() => setShowProductModal(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم المنتج</label>
                <input
                  type="text"
                  required
                  value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">السعر (ر.س)</label>
                  <input
                    type="number"
                    required
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">السعر السابق (لإظهار الخصم)</label>
                  <input
                    type="number"
                    value={prodForm.originalPrice || 0}
                    onChange={(e) =>
                      setProdForm({ ...prodForm, originalPrice: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">القسم</label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">كمية المخزون</label>
                  <input
                    type="number"
                    value={prodForm.stockCount || 10}
                    onChange={(e) =>
                      setProdForm({ ...prodForm, stockCount: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">رابط صورة المنتج (URL)</label>
                <input
                  type="url"
                  required
                  value={prodForm.image}
                  onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl text-left ltr"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">وصف المنتج</label>
                <textarea
                  rows={3}
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.inStock}
                    onChange={(e) => setProdForm({ ...prodForm, inStock: e.target.checked })}
                    className="accent-[#0F1E36]"
                  />
                  <span>متوفر للشراء</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.isDeal}
                    onChange={(e) => setProdForm({ ...prodForm, isDeal: e.target.checked })}
                    className="accent-[#C59B4B]"
                  />
                  <span>عرض خاص</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.featured}
                    onChange={(e) => setProdForm({ ...prodForm, featured: e.target.checked })}
                    className="accent-[#0F1E36]"
                  />
                  <span>منتج مميز بالرئيسية</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#0F1E36] text-[#DFBA6F] font-bold"
                >
                  حفظ المنتج
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: QUOTE EXTERNAL REQUEST */}
      {showQuoteModal && selectedReqForQuote && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-slate-900">
                تسعير طلب توفير ({selectedReqForQuote.requestNumber})
              </h3>
              <button onClick={() => setShowQuoteModal(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleQuoteSubmit} className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="font-bold text-slate-800 truncate">
                  الرابط: {selectedReqForQuote.productUrl}
                </p>
                <p className="text-slate-500 mt-1">الكمية: {selectedReqForQuote.quantity}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">سعر المنتج للعميل (ر.س)</label>
                  <input
                    type="number"
                    required
                    value={quoteForm.quotedPrice}
                    onChange={(e) =>
                      setQuoteForm({ ...quoteForm, quotedPrice: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">تكلفة الشحن والتوصيل (ر.س)</label>
                  <input
                    type="number"
                    required
                    value={quoteForm.deliveryFee}
                    onChange={(e) =>
                      setQuoteForm({ ...quoteForm, deliveryFee: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">المدة التقديرية للوصول</label>
                <input
                  type="text"
                  required
                  value={quoteForm.estimatedDays}
                  onChange={(e) =>
                    setQuoteForm({ ...quoteForm, estimatedDays: e.target.value })
                  }
                  placeholder="مثال: 7-10 أيام عمل"
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ملاحظات العرض للعميل</label>
                <textarea
                  rows={2}
                  value={quoteForm.adminNotes}
                  onChange={(e) =>
                    setQuoteForm({ ...quoteForm, adminNotes: e.target.value })
                  }
                  placeholder="مثال: يشمل الضمان وفحص الجودة قبل التسليم."
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowQuoteModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-linear-to-r from-[#DFBA6F] to-[#C59B4B] text-[#081220] font-black shadow-xs"
                >
                  إرسال التسعيرة للعميل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW INVOICE */}
      {viewInvoiceOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-slate-900">
                فاتورة الطلب ({viewInvoiceOrder.orderNumber})
              </h3>
              <button onClick={() => setViewInvoiceOrder(null)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="text-center pb-3 border-b border-slate-100">
                <div className="w-36 h-auto mx-auto mb-2">
                  <img src={BRAND.logoUrl} alt={BRAND.name} className="w-full h-auto object-contain" />
                </div>
                <p className="text-slate-500">«{BRAND.slogan}»</p>
                <p className="text-slate-400 mt-1">
                  تاريخ الفاتورة: {new Date(viewInvoiceOrder.createdAt).toLocaleDateString('ar-SA')}
                </p>
              </div>

              <div className="space-y-1">
                <p><span className="text-slate-400">العميل: </span><span className="font-bold">{viewInvoiceOrder.customerName}</span></p>
                <p><span className="text-slate-400">الهاتف: </span><span className="font-bold">{viewInvoiceOrder.customerPhone}</span></p>
                <p><span className="text-slate-400">العنوان: </span><span>{viewInvoiceOrder.governorate} - {viewInvoiceOrder.address}</span></p>
                <p><span className="text-slate-400">طريقة الدفع: </span><span className="font-bold">{viewInvoiceOrder.paymentMethod}</span></p>
              </div>

              <div className="divide-y divide-slate-100 pt-2 border-t border-slate-100">
                {viewInvoiceOrder.items.map((it, i) => (
                  <div key={i} className="py-2 flex justify-between">
                    <span>{it.quantity} × {it.product.name}</span>
                    <span className="font-bold">{formatPrice(it.product.price * it.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-[#0F1E36]">
                <span>الإجمالي النهائي المستحق:</span>
                <span>{formatPrice(viewInvoiceOrder.total)}</span>
              </div>

              <div className="pt-3 text-center">
                <button
                  onClick={() => window.print()}
                  className="bg-[#0F1E36] text-[#DFBA6F] font-bold px-6 py-2.5 rounded-xl"
                >
                  طباعة الفاتورة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
