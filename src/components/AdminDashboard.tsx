import React, { useState } from 'react';
import { Package, Sparkles, Plus, LogOut, ShieldAlert, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { adminAuthService } from '../services/adminAuth';
import { BRAND } from '../constants/brand';
import { Product } from '../types';

interface AdminDashboardProps {
  onLogout: () => void;
  onOpenSecurity: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onOpenSecurity }) => {
  const {
    products,
    orders,
    externalRequests,
    updateOrderStatus,
    updateExternalRequestStatus,
    addProduct,
    deleteProduct
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'requests' | 'products'>('orders');
  const [showAddProduct, setShowAddProduct] = useState(false);

  // New Product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('phones');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdImage) return;

    addProduct({
      name: newProdName,
      category: newProdCategory,
      price: parseFloat(newProdPrice),
      image: newProdImage,
      description: newProdDesc,
      rating: 5.0,
      ratingCount: 1,
      stock: 10,
      isFeatured: true
    });

    setNewProdName('');
    setNewProdPrice('');
    setNewProdImage('');
    setNewProdDesc('');
    setShowAddProduct(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-right">
      {/* Admin Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#070F1E] text-white p-6 rounded-3xl shadow-xl border border-amber-500/20 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>لوحة تحكم إدارة متجر الوقزة</span>
          </h1>
          <p className="text-xs text-amber-300/80 mt-1">
            إدارة متكاملة للطلبات، المشتريات الدولية، والمنتجات
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSecurity}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>إعدادات الأمان وسجل الدخول</span>
          </button>
          <button
            onClick={() => {
              adminAuthService.logout();
              onLogout();
            }}
            className="px-4 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all ${
            activeTab === 'orders'
              ? 'bg-[#070F1E] text-amber-400 shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>طلبات المتجر ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all ${
            activeTab === 'requests'
              ? 'bg-[#070F1E] text-amber-400 shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>طلبات الشراء الخارجي ({externalRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all ${
            activeTab === 'products'
              ? 'bg-[#070F1E] text-amber-400 shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>إدارة المنتجات ({products.length})</span>
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
              لا توجد طلبات واردة حالياً
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-slate-900">#{order.id}</span>
                    <span className="font-bold text-slate-800">{order.customerName} ({order.phone})</span>
                    <span className="text-xs text-slate-400">{order.city} - {order.address}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={order.status}
                      onChange={e => updateOrderStatus(order.id, e.target.value as any)}
                      className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 outline-none"
                    >
                      <option value="pending">قيد المراجعة</option>
                      <option value="confirmed">تم التأكيد</option>
                      <option value="processing">جاري التجهيز</option>
                      <option value="shipped">جاري التوصيل</option>
                      <option value="delivered">تم التسليم</option>
                      <option value="cancelled">ملغي</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {order.items.map((it, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{it.name}</span>
                      <span className="text-slate-500">× {it.quantity}</span>
                      <span className="text-amber-600 font-extrabold">({(it.price * it.quantity).toLocaleString()} {BRAND.currency})</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>طريقة الدفع: {order.paymentMethod === 'cash_on_delivery' ? 'عند الاستلام' : 'تحويل'}</span>
                  <span className="text-base text-amber-600 font-black">
                    الإجمالي: {order.totalAmount.toLocaleString()} {BRAND.currency}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: External Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {externalRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
              لا توجد طلبات شراء خارجي حالياً
            </div>
          ) : (
            externalRequests.map(req => (
              <div key={req.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-slate-900">#{req.id}</span>
                    <span className="font-bold text-slate-800">{req.customerName} ({req.phone})</span>
                  </div>

                  <select
                    value={req.status}
                    onChange={e => updateExternalRequestStatus(req.id, e.target.value as any)}
                    className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 outline-none"
                  >
                    <option value="received">تم الاستلام</option>
                    <option value="reviewing">جاري الفحص والتسعير</option>
                    <option value="price_offered">تم تقديم عرض السعر</option>
                    <option value="confirmed">تم التأكيد</option>
                    <option value="purchased">تم الشراء دولياً</option>
                    <option value="shipped">في التوصيل المحلي</option>
                    <option value="delivered">تم التسليم</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm mb-1">{req.productName}</h4>
                  <a
                    href={req.productUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 hover:underline block truncate font-mono"
                    dir="ltr"
                  >
                    {req.productUrl}
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs">
                  {req.estimatedPrice && (
                    <span className="text-slate-500">
                      السعر المقدر من العميل: {req.estimatedPrice}
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">تحديد السعر النهائي (ر.ي):</span>
                    <input
                      type="number"
                      defaultValue={req.quotedPrice || ''}
                      onBlur={e => updateExternalRequestStatus(req.id, req.status, e.target.value ? parseFloat(e.target.value) : undefined)}
                      placeholder="السعر بالريال"
                      className="px-2 py-1 rounded-lg border border-slate-200 w-28 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Products */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">قائمة منتجات المتجر</h3>
            <button
              onClick={() => setShowAddProduct(!showAddProduct)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة منتج جديد</span>
            </button>
          </div>

          {showAddProduct && (
            <form onSubmit={handleAddSubmit} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 mb-6">
              <h4 className="font-extrabold text-slate-900 text-sm">بيانات المنتج الجديد</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="اسم المنتج"
                  value={newProdName}
                  onChange={e => setNewProdName(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                />
                <select
                  value={newProdCategory}
                  onChange={e => setNewProdCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none bg-white"
                >
                  <option value="phones">الهواتف</option>
                  <option value="watches">الساعات</option>
                  <option value="perfumes">العطور</option>
                  <option value="electronics">الإلكترونيات</option>
                  <option value="fashion">الأزياء</option>
                </select>
                <input
                  type="number"
                  required
                  placeholder="السعر بالريال اليمني"
                  value={newProdPrice}
                  onChange={e => setNewProdPrice(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                />
                <input
                  type="url"
                  required
                  placeholder="رابط صورة المنتج (URL)"
                  value={newProdImage}
                  onChange={e => setNewProdImage(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                  dir="ltr"
                />
              </div>
              <textarea
                placeholder="وصف المنتج..."
                rows={2}
                value={newProdDesc}
                onChange={e => setNewProdDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none resize-none"
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#070F1E] hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs"
              >
                حفظ المنتج
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between gap-3">
                <img src={p.image} alt="" className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 truncate">{p.name}</h4>
                  <span className="text-xs font-black text-amber-600 block">{p.price.toLocaleString()} {BRAND.currency}</span>
                </div>
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
