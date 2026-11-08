export type OrderStatus =
  | 'جديد'
  | 'قيد التأكيد'
  | 'مؤكد'
  | 'قيد التجهيز'
  | 'جاهز للشحن'
  | 'خرج للتوصيل'
  | 'تم التسليم'
  | 'ملغي';

export type ProductRequestStatus =
  | 'جديد'
  | 'قيد المراجعة'
  | 'تم تحديد السعر'
  | 'بانتظار موافقة العميل'
  | 'تمت الموافقة'
  | 'جارٍ توفير المنتج'
  | 'مكتمل'
  | 'غير متاح'
  | 'ملغي';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  category: string;
  image: string;
  images?: string[];
  inStock: boolean;
  stockCount: number;
  featured?: boolean;
  isDeal?: boolean;
  colors?: string[];
  sizes?: string[];
  rating?: number;
  reviewCount?: number;
  salesCount?: number;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  nameEn?: string;
  icon: string;
  image?: string;
  order: number;
  active: boolean;
  itemCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  governorate: string;
  city: string;
  area: string;
  address: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequest {
  id: string;
  requestNumber: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  productUrl: string;
  productName?: string;
  quantity: number;
  specs?: string;
  notes?: string;
  imageUrl?: string;
  status: ProductRequestStatus;
  quotedPrice?: number;
  deliveryFee?: number;
  estimatedDays?: string;
  adminNotes?: string;
  customerAccepted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  imageUrl: string;
  linkType: 'category' | 'product' | 'request' | 'custom';
  linkValue: string;
  active: boolean;
  order: number;
  bgGradient?: string;
}

export interface StoreSettings {
  id: string;
  storeName: string;
  storeSlogan: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  currency: string;
  standardDeliveryFee: number;
  freeDeliveryThreshold: number;
  deliveryCities: string[];
  activePaymentMethods: string[];
  aboutUs: string;
  returnPolicy: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  address?: string;
  createdAt?: string;
}

export interface AppNotification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'order' | 'request' | 'promo' | 'system';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  verifiedPurchase?: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  minOrderAmount?: number;
  description: string;
  active: boolean;
  expiryDate?: string;
}

export interface CustomerInquiry {
  id: string;
  name: string;
  phone: string;
  message: string;
  status: 'new' | 'answered' | 'closed';
  createdAt: string;
}

