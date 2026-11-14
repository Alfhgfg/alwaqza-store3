export type Currency = 'SAR' | 'YER' | 'USD';

export interface Product {
  id: string;
  name: string;
  title?: string;
  titleEn?: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  currency?: Currency;
  category: string;
  rating: number;
  ratingCount?: number;
  reviewsCount?: number;
  image: string;
  images?: string[];
  description: string;
  inStock?: boolean;
  stock?: number;
  featured?: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
  badge?: string;
  specs?: Record<string, string>;
  colors?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber?: string;
  date?: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  total?: number;
  totalAmount: number;
  shippingFee: number;
  currency?: Currency;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  paymentMethod: string;
  notes?: string;
}

export type RequestStatus =
  | 'received'
  | 'under_review'
  | 'reviewing'
  | 'priced'
  | 'price_offered'
  | 'confirmed'
  | 'approved'
  | 'rejected'
  | 'ordered'
  | 'purchased'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface ExternalPurchaseRequest {
  id: string;
  requestNumber?: string;
  url?: string;
  productUrl: string;
  title?: string;
  productName: string;
  productNotes?: string;
  notes?: string;
  expectedPrice?: number;
  estimatedPrice?: number;
  currency?: Currency;
  quotedPrice?: number;
  status: RequestStatus;
  customerName: string;
  phone: string;
  city?: string;
  address?: string;
  adminNotes?: string;
  createdAt: string;
}

export type ExternalRequest = ExternalPurchaseRequest;
export type ProductRequest = ExternalPurchaseRequest;

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date?: string;
  time?: string;
  read: boolean;
  type: 'order' | 'request' | 'promo' | 'system';
  link?: string;
}

export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  ctaText: string;
  categoryLink: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  itemCount: number;
  slug: string;
}

export type AppView =
  | 'home'
  | 'categories'
  | 'deals'
  | 'search'
  | 'external-request'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'orders'
  | 'my-requests'
  | 'requests'
  | 'wishlist'
  | 'account'
  | 'admin'
  | 'admin-login'
  | 'admin-dashboard'
  | 'admin-security'
  | 'contact'
  | 'terms'
  | 'privacy'
  | 'shipping'
  | 'returns'
  | 'about';
