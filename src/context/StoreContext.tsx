import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, ExternalPurchaseRequest, NotificationItem } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../data/initialData';
import { googleSheetsService } from '../services/googleSheets';

interface StoreContextType {
  products: Product[];
  categories: typeof INITIAL_CATEGORIES;
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  externalRequests: ExternalPurchaseRequest[];
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => Promise<Order>;
  createExternalRequest: (data: Omit<ExternalPurchaseRequest, 'id' | 'createdAt' | 'status'>) => Promise<ExternalPurchaseRequest>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateExternalRequestStatus: (requestId: string, status: ExternalPurchaseRequest['status'], quotedPrice?: number, notes?: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('alwaqza_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('alwaqza_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('alwaqza_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('alwaqza_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [externalRequests, setExternalRequests] = useState<ExternalPurchaseRequest[]>(() => {
    const saved = localStorage.getItem('alwaqza_ext_requests');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'مرحباً بك في متجر الوقزة الفاخر',
      message: 'استمتع بأفضل العروض وتوصيل فوري لجميع محافظات اليمن، بالإضافة لخدمة اخترها ونحن نوصلها.',
      time: 'الآن',
      read: false,
      type: 'promo'
    }
  ]);

  useEffect(() => {
    localStorage.setItem('alwaqza_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('alwaqza_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('alwaqza_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('alwaqza_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('alwaqza_ext_requests', JSON.stringify(externalRequests));
  }, [externalRequests]);

  const addToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedColor: color, selectedSize: size }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> => {
    const newOrder: Order = {
      ...orderData,
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: 'تم تأكيد طلبك بنجاح!',
      message: `تم استلام طلبك رقم #${newOrder.id} بقيمة ${newOrder.totalAmount.toLocaleString()} ر.ي وسيتم التواصل معك لتأكيد التوصيل.`,
      time: 'الآن',
      read: false,
      type: 'order'
    };
    setNotifications(prev => [notif, ...prev]);

    await googleSheetsService.syncOrder(newOrder);
    return newOrder;
  };

  const createExternalRequest = async (
    data: Omit<ExternalPurchaseRequest, 'id' | 'createdAt' | 'status'>
  ): Promise<ExternalPurchaseRequest> => {
    const newReq: ExternalPurchaseRequest = {
      ...data,
      id: 'EXT-' + Math.floor(10000 + Math.random() * 90000),
      status: 'received',
      createdAt: new Date().toISOString()
    };
    setExternalRequests(prev => [newReq, ...prev]);

    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: 'تم استلام طلب الشراء الخارجي',
      message: `تم تسجيل طلبك رقم #${newReq.id} ("${newReq.productName}"). جاري مراجعة الرابط وتحديد التكلفة الإجمالية الواصلة لليمن.`,
      time: 'الآن',
      read: false,
      type: 'order'
    };
    setNotifications(prev => [notif, ...prev]);

    await googleSheetsService.syncExternalRequest(newReq);
    return newReq;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  const updateExternalRequestStatus = (
    requestId: string,
    status: ExternalPurchaseRequest['status'],
    quotedPrice?: number,
    notes?: string
  ) => {
    setExternalRequests(prev =>
      prev.map(req =>
        req.id === requestId
          ? {
              ...req,
              status,
              quotedPrice: quotedPrice !== undefined ? quotedPrice : req.quotedPrice,
              adminNotes: notes !== undefined ? notes : req.adminNotes
            }
          : req
      )
    );
  };

  const addProduct = (p: Omit<Product, 'id'>) => {
    const newProd: Product = { ...p, id: 'prod-' + Date.now() };
    setProducts(prev => [newProd, ...prev]);
  };

  const updateProduct = (p: Product) => {
    setProducts(prev => prev.map(item => (item.id === p.id ? p : item)));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(item => item.id !== productId));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <StoreContext.Provider
      value={{
        products,
        categories: INITIAL_CATEGORIES,
        cart,
        wishlist,
        orders,
        externalRequests,
        notifications,
        unreadNotificationsCount,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        createOrder,
        createExternalRequest,
        updateOrderStatus,
        updateExternalRequestStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        markNotificationAsRead,
        markAllNotificationsAsRead
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
