import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType, testConnection } from '../firebase';
import {
  Product,
  Category,
  CartItem,
  Order,
  ProductRequest,
  Banner,
  StoreSettings,
  UserProfile,
  AppNotification,
  OrderStatus,
  ProductRequestStatus,
  ProductReview,
  Coupon,
  CustomerInquiry,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_BANNERS,
  INITIAL_SETTINGS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
} from '../data/initialData';
import {
  GoogleSheetsExportResult,
  exportOrdersToGoogleSheets as exportOrdersService,
  exportRequestsToGoogleSheets as exportRequestsService,
  exportProductsToGoogleSheets as exportProductsService,
} from '../services/googleSheets';
import {
  loginSuperAdmin,
  verifyAdminSession,
  logoutSuperAdmin,
  recordAdminAuditLog,
  SuperAdminInfo,
  LoginResult,
} from '../services/adminAuth';

export const GOOGLE_WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
];

// In-memory cache for OAuth access token (never stored in localStorage)
let cachedGoogleAccessToken: string | null = null;


interface StoreContextType {
  // Catalog
  categories: Category[];
  products: Product[];
  banners: Banner[];
  settings: StoreSettings;
  loading: boolean;
  isOnline: boolean;

  // Cart & Wishlist
  cart: CartItem[];
  wishlist: string[];
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string, color?: string, size?: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  cartSubtotal: number;
  cartDeliveryFee: number;
  cartDiscount: number;
  cartTotal: number;
  couponCode: string;
  applyCoupon: (code: string) => boolean;

  // Currency
  selectedCurrency: 'SAR' | 'YER' | 'USD';
  setSelectedCurrency: (currency: 'SAR' | 'YER' | 'USD') => void;
  formatPrice: (amount: number) => string;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;

  // External Product Requests ("اخترها ونحن نوصلها")
  productRequests: ProductRequest[];
  createProductRequest: (reqData: Omit<ProductRequest, 'id' | 'requestNumber' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateProductRequestQuote: (
    requestId: string,
    quote: { quotedPrice: number; deliveryFee: number; estimatedDays: string; adminNotes?: string }
  ) => Promise<void>;
  acceptProductRequestQuote: (requestId: string, accepted: boolean) => Promise<void>;
  updateProductRequestStatus: (requestId: string, status: ProductRequestStatus, adminNotes?: string) => Promise<void>;

  // Admin Catalog Management
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addBanner: (banner: Omit<Banner, 'id'>) => Promise<void>;
  updateBanner: (id: string, updates: Partial<Banner>) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  updateSettings: (updates: Partial<StoreSettings>) => Promise<void>;
  seedInitialDataToFirestore: () => Promise<void>;

  // User & Auth
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  adminInfo: SuperAdminInfo | null;
  loginAsSuperAdmin: (password: string, username?: string) => Promise<LoginResult>;
  logoutSuperAdminAction: () => Promise<void>;
  verifySuperAdminSession: () => Promise<boolean>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  toggleAdminDemoMode: () => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  unreadNotificationsCount: number;

  // Google Sheets & Workspace Integration
  googleAccessToken: string | null;
  isGoogleSheetsConnected: boolean;
  connectGoogleSheets: () => Promise<string | null>;
  exportOrdersToSheets: () => Promise<GoogleSheetsExportResult>;
  exportRequestsToSheets: () => Promise<GoogleSheetsExportResult>;
  exportProductsToSheets: () => Promise<GoogleSheetsExportResult>;
  recentSheetsExports: GoogleSheetsExportResult[];

  // Reviews
  reviews: ProductReview[];
  getProductReviews: (productId: string) => ProductReview[];
  addReview: (review: Omit<ProductReview, 'id' | 'createdAt'>) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id'>) => Promise<void>;
  deleteCoupon: (couponId: string) => Promise<void>;
  toggleCouponStatus: (couponId: string) => Promise<void>;

  // Inquiries
  inquiries: CustomerInquiry[];
  submitInquiry: (inquiry: Omit<CustomerInquiry, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  updateInquiryStatus: (inquiryId: string, status: 'new' | 'answered' | 'closed') => Promise<void>;

  // Active View / Page navigation helper
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedCategorySlug: string | null;
  setSelectedCategorySlug: (slug: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [productRequests, setProductRequests] = useState<ProductRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Auth & Admin
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [adminDemoOverride, setAdminDemoOverride] = useState<boolean>(false);

  // Google Workspace & Sheets state (in-memory token only, per security requirements)
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [recentSheetsExports, setRecentSheetsExports] = useState<GoogleSheetsExportResult[]>([]);


  // Reviews, Coupons & Inquiries
  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    try {
      const saved = localStorage.getItem('alwaqza_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('alwaqza_coupons');
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('alwaqza_inquiries');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // App Navigation & Selections
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('alwaqza_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('alwaqza_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [couponCode, setCouponCode] = useState<string>('');
  const [couponDiscountPercent, setCouponDiscountPercent] = useState<number>(0);
  const [selectedCurrency, setSelectedCurrency] = useState<'SAR' | 'YER' | 'USD'>('SAR');

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-welcome',
      title: 'مرحباً بك في متجر الوقزة!',
      message: 'نسعد بزيارتك! استخدم الكوبون WAQZA10 للحصول على خصم 10% على طلبك الأول.',
      type: 'promo',
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'notif-service',
      title: 'خدمة «اخترها… ونحن نوصلها»',
      message: 'هل تبحث عن منتج من موقع خارجي كأمازون أو علي إكسبريس؟ أرسل رابطه وسنوفره لك بأسرع وقت.',
      type: 'system',
      read: false,
      link: 'external-request',
      createdAt: new Date().toISOString(),
    }
  ]);

  // Persist cart & wishlist
  useEffect(() => {
    try {
      localStorage.setItem('alwaqza_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('alwaqza_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('alwaqza_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem('alwaqza_coupons', JSON.stringify(coupons));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [coupons]);

  useEffect(() => {
    try {
      localStorage.setItem('alwaqza_inquiries', JSON.stringify(inquiries));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [inquiries]);

  // Online / offline listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    testConnection().then((connected) => setIsOnline(connected));
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Super Admin Server-Verified Security State
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [adminInfo, setAdminInfo] = useState<SuperAdminInfo | null>(null);

  // Verify Super Admin server session on startup
  useEffect(() => {
    verifyAdminSession().then((res) => {
      if (res.valid) {
        setIsSuperAdmin(true);
        setAdminInfo(res.admin || { username: 'المدير الرئيسي لمتجر الوقزة', role: 'super_admin' });
      } else {
        setIsSuperAdmin(false);
        setAdminInfo(null);
      }
    });
  }, []);

  // Customer / User Auth listener (Strictly Customers - no self-assigned admin privileges)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setUserProfile({
          id: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'عميل متجر الوقزة',
          email: user.email || '',
          role: 'customer',
          phone: user.phoneNumber || '',
        });
      } else {
        cachedGoogleAccessToken = null;
        setGoogleAccessToken(null);
        setUserProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Strict Admin Gate: Only true if Super Admin cryptographic session is active and verified by server
  const isAdmin = isSuperAdmin;

  // Real-time Firestore Listeners
  useEffect(() => {
    let unsubs: (() => void)[] = [];

    try {
      // 1. Categories
      const catSub = onSnapshot(
        collection(db, 'categories'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Category[] = [];
            snapshot.forEach((d) => list.push({ ...d.data(), id: d.id } as Category));
            list.sort((a, b) => (a.order || 0) - (b.order || 0));
            setCategories(list);
          }
        },
        (error) => {
          console.warn('Firestore categories listener:', error.message);
        }
      );
      unsubs.push(catSub);

      // 2. Products
      const prodSub = onSnapshot(
        collection(db, 'products'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Product[] = [];
            snapshot.forEach((d) => list.push({ ...d.data(), id: d.id } as Product));
            setProducts(list);
          }
        },
        (error) => {
          console.warn('Firestore products listener:', error.message);
        }
      );
      unsubs.push(prodSub);

      // 3. Banners
      const bannerSub = onSnapshot(
        collection(db, 'banners'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Banner[] = [];
            snapshot.forEach((d) => list.push({ ...d.data(), id: d.id } as Banner));
            list.sort((a, b) => (a.order || 0) - (b.order || 0));
            setBanners(list);
          }
        },
        (error) => {
          console.warn('Firestore banners listener:', error.message);
        }
      );
      unsubs.push(bannerSub);

      // 4. Store Settings
      const settingsSub = onSnapshot(
        doc(db, 'store_settings', 'default'),
        (docSnap) => {
          if (docSnap.exists()) {
            setSettings({ ...INITIAL_SETTINGS, ...(docSnap.data() as StoreSettings), id: 'default' });
          }
        },
        (error) => {
          console.warn('Firestore settings listener:', error.message);
        }
      );
      unsubs.push(settingsSub);

      // 5. Orders listener (if logged in or admin)
      if (currentUser || isAdmin) {
        const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const orderSub = onSnapshot(
          ordersQuery,
          (snapshot) => {
            const list: Order[] = [];
            snapshot.forEach((d) => {
              const data = d.data() as Order;
              // If not admin, filter to current user orders
              if (isAdmin || data.userId === currentUser?.uid || data.userId === 'guest') {
                list.push({ ...data, id: d.id });
              }
            });
            setOrders(list);
          },
          (error) => {
            console.warn('Firestore orders listener:', error.message);
          }
        );
        unsubs.push(orderSub);

        // 6. Product requests listener
        const reqQuery = query(collection(db, 'product_requests'), orderBy('createdAt', 'desc'));
        const reqSub = onSnapshot(
          reqQuery,
          (snapshot) => {
            const list: ProductRequest[] = [];
            snapshot.forEach((d) => {
              const data = d.data() as ProductRequest;
              if (isAdmin || data.userId === currentUser?.uid || data.userId === 'guest') {
                list.push({ ...data, id: d.id });
              }
            });
            setProductRequests(list);
          },
          (error) => {
            console.warn('Firestore product_requests listener:', error.message);
          }
        );
        unsubs.push(reqSub);
      }
    } catch (err) {
      console.warn('Failed setting up Firestore listeners:', err);
    } finally {
      setLoading(false);
    }

    return () => {
      unsubs.forEach((u) => u());
    };
  }, [currentUser, isAdmin]);

  // Currency Formatter
  const formatPrice = (amount: number): string => {
    let rate = 1;
    let symbol = 'ر.س';

    if (selectedCurrency === 'YER') {
      rate = 70; // approximate exchange rate for YER
      symbol = 'ر.ي';
    } else if (selectedCurrency === 'USD') {
      rate = 0.27;
      symbol = '$';
    }

    const converted = Math.round(amount * rate);
    return `${converted.toLocaleString('ar-SA')} ${symbol}`;
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === color &&
          item.selectedSize === size
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }

      return [
        ...prev,
        {
          product,
          quantity,
          selectedColor: color || product.colors?.[0],
          selectedSize: size || product.sizes?.[0],
        },
      ];
    });

    // Notify
    setNotifications((prev) => [
      {
        id: `cart-${Date.now()}`,
        title: 'تمت الإضافة إلى السلة!',
        message: `تم إضافة «${product.name.slice(0, 35)}...» إلى سلة المشتريات.`,
        type: 'order',
        read: false,
        link: 'cart',
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const updateCartQuantity = (productId: string, quantity: number, color?: string, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedColor === color &&
          item.selectedSize === size
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, color?: string, size?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedSize === size
          )
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Cart Calculations
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartDeliveryFee =
    cartSubtotal >= settings.freeDeliveryThreshold || cartSubtotal === 0
      ? 0
      : settings.standardDeliveryFee;

  const cartDiscount = Math.round((cartSubtotal * couponDiscountPercent) / 100);
  const cartTotal = Math.max(0, cartSubtotal + cartDeliveryFee - cartDiscount);

  const applyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    const matchedCoupon = coupons.find((c) => c.code.toUpperCase() === clean && c.active);
    if (matchedCoupon) {
      if (matchedCoupon.minOrderAmount && cartSubtotal < matchedCoupon.minOrderAmount) {
        alert(`هذا الكوبون يتطلب طلباً بقيمة ${matchedCoupon.minOrderAmount} ر.س على الأقل.`);
        return false;
      }
      setCouponCode(matchedCoupon.code);
      setCouponDiscountPercent(matchedCoupon.discountPercent);
      return true;
    }
    // Backward compatibility for standard codes
    if (clean === 'WAQZA10') {
      setCouponCode('WAQZA10');
      setCouponDiscountPercent(10);
      return true;
    }
    if (clean === 'WELCOME' || clean === 'ALWAQZA') {
      setCouponCode(clean);
      setCouponDiscountPercent(15);
      return true;
    }
    return false;
  };

  // Orders
  const createOrder = async (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>
  ): Promise<string> => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `WQZ-${randomNum}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id: `order_${Date.now()}_${randomNum}`,
      orderNumber,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await setDoc(doc(db, 'orders', newOrder.id), newOrder);
    } catch (err) {
      console.warn('Writing order to Firestore, falling back locally if offline:', err);
      // Even if network blips, preserve in state so customer receives seamless experience
      setOrders((prev) => [newOrder, ...prev]);
    }

    clearCart();

    // Trigger confirmation notification
    setNotifications((prev) => [
      {
        id: `order-placed-${Date.now()}`,
        title: `تم استلام طلبك بنجاح (${orderNumber})`,
        message: `طلبك بقيمة ${formatPrice(newOrder.total)} قيد المراجعة والتجهيز. شكراً لتسوقك من متجر الوقزة!`,
        type: 'order',
        read: false,
        link: 'orders',
        createdAt: now,
      },
      ...prev,
    ]);

    return orderNumber;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, adminNotes?: string) => {
    const now = new Date().toISOString();
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status,
        updatedAt: now,
        ...(adminNotes ? { notes: adminNotes } : {}),
      });
    } catch (err) {
      console.warn('Updating order in Firestore failed, updating locally:', err);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status, updatedAt: now } : o))
      );
    }
  };

  const cancelOrder = async (orderId: string) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;
    if (target.status !== 'جديد' && target.status !== 'قيد التأكيد') {
      throw new Error('لا يمكن إلغاء الطلب بعد دخوله مرحلة التجهيز أو الشحن.');
    }
    const now = new Date().toISOString();
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'ملغي',
        updatedAt: now,
      });
    } catch (err) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'ملغي', updatedAt: now } : o))
      );
    }
  };

  // External Product Requests ("اخترها ونحن نوصلها")
  const createProductRequest = async (
    reqData: Omit<ProductRequest, 'id' | 'requestNumber' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<string> => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const requestNumber = `REQ-${randomNum}`;
    const now = new Date().toISOString();

    const newReq: ProductRequest = {
      ...reqData,
      id: `req_${Date.now()}_${randomNum}`,
      requestNumber,
      status: 'جديد',
      createdAt: now,
      updatedAt: now,
    };

    try {
      await setDoc(doc(db, 'product_requests', newReq.id), newReq);
    } catch (err) {
      console.warn('Writing product request to Firestore failed, saving locally:', err);
      setProductRequests((prev) => [newReq, ...prev]);
    }

    setNotifications((prev) => [
      {
        id: `req-created-${Date.now()}`,
        title: `تم استلام طلب التوفير (${requestNumber})`,
        message: 'فريق متجر الوقزة يقوم بفحص الرابط وحساب التكلفة والمدة التقديرية. سنوافيك بالتسعيرة قريباً!',
        type: 'request',
        read: false,
        link: 'requests',
        createdAt: now,
      },
      ...prev,
    ]);

    return requestNumber;
  };

  const updateProductRequestQuote = async (
    requestId: string,
    quote: { quotedPrice: number; deliveryFee: number; estimatedDays: string; adminNotes?: string }
  ) => {
    const now = new Date().toISOString();
    const updates = {
      quotedPrice: quote.quotedPrice,
      deliveryFee: quote.deliveryFee,
      estimatedDays: quote.estimatedDays,
      adminNotes: quote.adminNotes || '',
      status: 'بانتظار موافقة العميل' as ProductRequestStatus,
      updatedAt: now,
    };

    try {
      await updateDoc(doc(db, 'product_requests', requestId), updates);
    } catch (err) {
      setProductRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, ...updates } : r))
      );
    }
  };

  const acceptProductRequestQuote = async (requestId: string, accepted: boolean) => {
    const now = new Date().toISOString();
    const newStatus: ProductRequestStatus = accepted ? 'تمت الموافقة' : 'ملغي';
    const updates = {
      customerAccepted: accepted,
      status: newStatus,
      updatedAt: now,
    };

    try {
      await updateDoc(doc(db, 'product_requests', requestId), updates);
    } catch (err) {
      setProductRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, ...updates } : r))
      );
    }
  };

  const updateProductRequestStatus = async (
    requestId: string,
    status: ProductRequestStatus,
    adminNotes?: string
  ) => {
    const now = new Date().toISOString();
    const updates: Partial<ProductRequest> = {
      status,
      updatedAt: now,
      ...(adminNotes ? { adminNotes } : {}),
    };

    try {
      await updateDoc(doc(db, 'product_requests', requestId), updates);
    } catch (err) {
      setProductRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, ...updates } : r))
      );
    }
  };

  // Admin Catalog CRUD
  const addProduct = async (product: Omit<Product, 'id'>) => {
    const id = `prod_${Date.now()}`;
    const newProd: Product = { ...product, id, createdAt: new Date().toISOString() };
    try {
      await setDoc(doc(db, 'products', id), newProd);
    } catch (err) {
      setProducts((prev) => [newProd, ...prev]);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      await updateDoc(doc(db, 'products', id), updates);
    } catch (err) {
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    const id = `cat_${Date.now()}`;
    const newCat: Category = { ...category, id };
    try {
      await setDoc(doc(db, 'categories', id), newCat);
    } catch (err) {
      setCategories((prev) => [...prev, newCat]);
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      await updateDoc(doc(db, 'categories', id), updates);
    } catch (err) {
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (err) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const addBanner = async (banner: Omit<Banner, 'id'>) => {
    const id = `banner_${Date.now()}`;
    const newBanner: Banner = { ...banner, id };
    try {
      await setDoc(doc(db, 'banners', id), newBanner);
    } catch (err) {
      setBanners((prev) => [...prev, newBanner]);
    }
  };

  const updateBanner = async (id: string, updates: Partial<Banner>) => {
    try {
      await updateDoc(doc(db, 'banners', id), updates);
    } catch (err) {
      setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
    }
  };

  const deleteBanner = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'banners', id));
    } catch (err) {
      setBanners((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const updateSettings = async (updates: Partial<StoreSettings>) => {
    const newSettings = { ...settings, ...updates, id: 'default' };
    setSettings(newSettings);
    try {
      await setDoc(doc(db, 'store_settings', 'default'), newSettings);
    } catch (err) {
      console.warn('Saving store settings to Firestore failed:', err);
    }
  };

  // Seed Data function: populates Firestore with authentic catalog
  const seedInitialDataToFirestore = async () => {
    try {
      // 1. Categories
      for (const cat of INITIAL_CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), cat);
      }
      // 2. Products
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), prod);
      }
      // 3. Banners
      for (const banner of INITIAL_BANNERS) {
        await setDoc(doc(db, 'banners', banner.id), banner);
      }
      // 4. Settings
      await setDoc(doc(db, 'store_settings', 'default'), INITIAL_SETTINGS);

      alert('تمت تهيئة وتحديث قاعدة بيانات متجر الوقزة بنجاح!');
    } catch (err) {
      console.error('Failed to seed Firestore:', err);
      alert('تم تحديث البيانات في الذاكرة المحلية (يرجى التأكد من تسجيل الدخول كمدير لحفظها سحابياً).');
    }
  };

  // Auth & Google Workspace actions
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    GOOGLE_WORKSPACE_SCOPES.forEach((scope) => provider.addScope(scope));
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        cachedGoogleAccessToken = credential.accessToken;
        setGoogleAccessToken(credential.accessToken);
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      // Customer profile fallback if popup is closed
      setUserProfile({
        id: 'customer-demo-uid',
        name: 'عميل متجر الوقزة',
        email: 'customer@alwaqza.com',
        role: 'customer',
        phone: '+967 770 000 000',
      });
    }
  };

  const loginAsSuperAdmin = async (password: string, username = 'المدير الرئيسي لمتجر الوقزة'): Promise<LoginResult> => {
    const res = await loginSuperAdmin(password, username);
    if (res.success) {
      setIsSuperAdmin(true);
      setAdminInfo(res.admin || { username, role: 'super_admin' });
    }
    return res;
  };

  const logoutSuperAdminAction = async () => {
    await logoutSuperAdmin();
    setIsSuperAdmin(false);
    setAdminInfo(null);
    if (currentView === 'admin') {
      setCurrentView('home');
    }
  };

  const verifySuperAdminSession = async (): Promise<boolean> => {
    const res = await verifyAdminSession();
    setIsSuperAdmin(res.valid);
    if (!res.valid) {
      setAdminInfo(null);
      if (currentView === 'admin') {
        setCurrentView('admin-login');
      }
    }
    return res.valid;
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Sign out error', err);
    }
    cachedGoogleAccessToken = null;
    setGoogleAccessToken(null);
    setCurrentUser(null);
    setUserProfile(null);
    await logoutSuperAdminAction();
  };

  const toggleAdminDemoMode = () => {
    if (isSuperAdmin) {
      setCurrentView(currentView === 'admin' ? 'home' : 'admin');
    } else {
      setCurrentView('admin-login');
    }
  };

  // Google Sheets Integration Methods
  const connectGoogleSheets = async (): Promise<string | null> => {
    try {
      const provider = new GoogleAuthProvider();
      GOOGLE_WORKSPACE_SCOPES.forEach((scope) => provider.addScope(scope));
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        cachedGoogleAccessToken = credential.accessToken;
        setGoogleAccessToken(credential.accessToken);
        return credential.accessToken;
      }
      return null;
    } catch (error) {
      console.error('Google Sheets Authorization Error:', error);
      throw error;
    }
  };

  const getValidSheetsToken = async (): Promise<string> => {
    if (cachedGoogleAccessToken) {
      return cachedGoogleAccessToken;
    }
    const token = await connectGoogleSheets();
    if (!token) {
      throw new Error('يرجى تسجيل الدخول بحساب Google ومنح صلاحيات Google Sheets.');
    }
    return token;
  };

  const exportOrdersToSheets = async (): Promise<GoogleSheetsExportResult> => {
    const token = await getValidSheetsToken();
    const result = await exportOrdersService(token, orders);
    setRecentSheetsExports((prev) => [result, ...prev]);
    return result;
  };

  const exportRequestsToSheets = async (): Promise<GoogleSheetsExportResult> => {
    const token = await getValidSheetsToken();
    const result = await exportRequestsService(token, productRequests);
    setRecentSheetsExports((prev) => [result, ...prev]);
    return result;
  };

  const exportProductsToSheets = async (): Promise<GoogleSheetsExportResult> => {
    const token = await getValidSheetsToken();
    const catMap: Record<string, string> = {};
    categories.forEach((c) => {
      catMap[c.id] = c.name;
    });
    const result = await exportProductsService(token, products, catMap);
    setRecentSheetsExports((prev) => [result, ...prev]);
    return result;
  };


  // Reviews management
  const getProductReviews = (productId: string) => {
    return reviews.filter((r) => r.productId === productId);
  };

  const addReview = async (reviewData: Omit<ProductReview, 'id' | 'createdAt'>) => {
    const id = `rev_${Date.now()}`;
    const newRev: ProductReview = {
      ...reviewData,
      id,
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'product_reviews', id), newRev);
    } catch (err) {
      console.warn('Saving review to Firestore failed, stored locally:', err);
    }
    setReviews((prev) => [newRev, ...prev]);

    // Recalculate product rating
    const prodReviews = [...reviews.filter((r) => r.productId === reviewData.productId), newRev];
    const avgRating = Number(
      (prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length).toFixed(1)
    );
    updateProduct(reviewData.productId, {
      rating: avgRating,
      reviewCount: prodReviews.length,
    });
  };

  const deleteReview = async (reviewId: string) => {
    try {
      await deleteDoc(doc(db, 'product_reviews', reviewId));
    } catch (err) {
      console.warn('Deleting review from Firestore failed:', err);
    }
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  // Coupons management
  const addCoupon = async (couponData: Omit<Coupon, 'id'>) => {
    const id = `coupon_${Date.now()}`;
    const newCoupon: Coupon = { ...couponData, id };
    try {
      await setDoc(doc(db, 'coupons', id), newCoupon);
    } catch (err) {
      console.warn('Saving coupon to Firestore failed:', err);
    }
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  const deleteCoupon = async (couponId: string) => {
    try {
      await deleteDoc(doc(db, 'coupons', couponId));
    } catch (err) {
      console.warn('Deleting coupon from Firestore failed:', err);
    }
    setCoupons((prev) => prev.filter((c) => c.id !== couponId));
  };

  const toggleCouponStatus = async (couponId: string) => {
    const target = coupons.find((c) => c.id === couponId);
    if (!target) return;
    const newActive = !target.active;
    try {
      await updateDoc(doc(db, 'coupons', couponId), { active: newActive });
    } catch (err) {
      console.warn('Updating coupon status failed:', err);
    }
    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, active: newActive } : c))
    );
  };

  // Customer Inquiries
  const submitInquiry = async (inquiryData: Omit<CustomerInquiry, 'id' | 'status' | 'createdAt'>) => {
    const id = `inq_${Date.now()}`;
    const newInquiry: CustomerInquiry = {
      ...inquiryData,
      id,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'customer_inquiries', id), newInquiry);
    } catch (err) {
      console.warn('Saving inquiry to Firestore failed:', err);
    }
    setInquiries((prev) => [newInquiry, ...prev]);

    // Send admin notification
    setNotifications((prev) => [
      {
        id: `notif-inq-${Date.now()}`,
        title: `استفسار جديد من ${inquiryData.name}`,
        message: inquiryData.message.slice(0, 50) + '...',
        type: 'system',
        read: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const updateInquiryStatus = async (inquiryId: string, status: 'new' | 'answered' | 'closed') => {
    try {
      await updateDoc(doc(db, 'customer_inquiries', inquiryId), { status });
    } catch (err) {
      console.warn('Updating inquiry status failed:', err);
    }
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === inquiryId ? { ...inq, status } : inq))
    );
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <StoreContext.Provider
      value={{
        categories,
        products,
        banners,
        settings,
        loading,
        isOnline,
        cart,
        wishlist,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isWishlisted,
        cartSubtotal,
        cartDeliveryFee,
        cartDiscount,
        cartTotal,
        couponCode,
        applyCoupon,
        selectedCurrency,
        setSelectedCurrency,
        formatPrice,
        orders,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        productRequests,
        createProductRequest,
        updateProductRequestQuote,
        acceptProductRequestQuote,
        updateProductRequestStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addBanner,
        updateBanner,
        deleteBanner,
        updateSettings,
        seedInitialDataToFirestore,
        currentUser,
        userProfile,
        isAdmin,
        isSuperAdmin,
        adminInfo,
        loginAsSuperAdmin,
        logoutSuperAdminAction,
        verifySuperAdminSession,
        signInWithGoogle,
        logout,
        toggleAdminDemoMode,
        googleAccessToken,
        isGoogleSheetsConnected: !!googleAccessToken,
        connectGoogleSheets,
        exportOrdersToSheets,
        exportRequestsToSheets,
        exportProductsToSheets,
        recentSheetsExports,
        reviews,
        getProductReviews,
        addReview,
        deleteReview,
        coupons,
        addCoupon,
        deleteCoupon,
        toggleCouponStatus,
        inquiries,
        submitInquiry,
        updateInquiryStatus,
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
        unreadNotificationsCount,
        currentView,
        setCurrentView,
        selectedProductId,
        setSelectedProductId,
        selectedCategorySlug,
        setSelectedCategorySlug,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
