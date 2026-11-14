import { Product, Category, BannerSlide } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'الهواتف والذكاء الاصطناعي',
    slug: 'phones',
    icon: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
    itemCount: 24
  },
  {
    id: 'cat-2',
    name: 'الساعات الفاخرة',
    slug: 'watches',
    icon: 'Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    itemCount: 18
  },
  {
    id: 'cat-3',
    name: 'العطور والأطياب الملكية',
    slug: 'perfumes',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&auto=format&fit=crop&q=80',
    itemCount: 15
  },
  {
    id: 'cat-4',
    name: 'الإلكترونيات والملحقات',
    slug: 'electronics',
    icon: 'Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    itemCount: 32
  },
  {
    id: 'cat-5',
    name: 'الأزياء والأناقة الرجالية',
    slug: 'fashion',
    icon: 'Shirt',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
    itemCount: 20
  }
];

export const INITIAL_BANNERS: BannerSlide[] = [
  {
    id: 'b-1',
    title: 'عروض حصرية وفخامة لا تضاهى',
    subtitle: 'أحدث الساعات والهواتف الذكية مع ضمان الوكيل المعتمد وخدمة التوصيل السريع',
    badge: 'تخفيضات تصل إلى 40%',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
    ctaText: 'تسوق الآن',
    categoryLink: 'watches'
  },
  {
    id: 'b-2',
    title: 'خدمة "اخترها ونحن نوصلها"',
    subtitle: 'شاهدت أي منتج على أمازون، نون أو علي إكسبرس وتريده في اليمن؟ فقط أرسل الرابط والباقي علينا!',
    badge: 'خدمة خاصة بالوقزة',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80',
    ctaText: 'اطلب منتجك الخارجي الآن',
    categoryLink: 'external-request'
  },
  {
    id: 'b-3',
    title: 'عطور الوقزة الملكية 2026',
    subtitle: 'مجموعة مختارة بعناية لأصحاب الذوق الرفيع وثبات يدوم لأيام',
    badge: 'إصدار محدود',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1200&auto=format&fit=crop&q=80',
    ctaText: 'استكشف المجموعة',
    categoryLink: 'perfumes'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'ساعة رولكس دايتونا أويستر ستيل ذهب أسود',
    category: 'watches',
    price: 345000,
    originalPrice: 420000,
    discountPercentage: 18,
    rating: 4.9,
    ratingCount: 88,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=700&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'تحفة ميكانيكية فاخرة تجمع بين دقة الكرونوغراف والأناقة الرفيعة، مقاومة للماء مع زجاج سافير ضد الخدش.',
    stock: 7,
    isFeatured: true,
    isBestseller: true,
    badge: 'الأكثر طلباً'
  },
  {
    id: 'prod-2',
    name: 'آيفون 16 برو ماكس - سعة 512 جيجابايت تيتانيوم صحراوي',
    category: 'phones',
    price: 685000,
    originalPrice: 740000,
    discountPercentage: 7,
    rating: 5.0,
    ratingCount: 142,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=700&auto=format&fit=crop&q=80',
    description: 'شاشة Super Retina XDR مع زر التحكم بالكاميرا وشريحة A18 Pro الجبارة وبطارية تدوم طوال اليوم.',
    stock: 5,
    isFeatured: true,
    isNew: true,
    badge: 'جديد ومميز'
  },
  {
    id: 'prod-3',
    name: 'عطر الوقزة الخاص "سلطان العود" نيش بارفيوم 100 مل',
    category: 'perfumes',
    price: 68000,
    originalPrice: 95000,
    discountPercentage: 28,
    rating: 4.9,
    ratingCount: 164,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=700&auto=format&fit=crop&q=80',
    description: 'خلطة ملكية خاصة بمتجر الوقزة، مزيج من العود الكمبودي والورد الطائفي والعنبر الفاخر مع فوحان جبار.',
    stock: 22,
    isFeatured: true,
    isBestseller: true,
    badge: 'توقيع المتجر'
  },
  {
    id: 'prod-4',
    name: 'سماعات سوني WH-1000XM5 العازلة للضوضاء',
    category: 'electronics',
    price: 135000,
    originalPrice: 160000,
    discountPercentage: 15,
    rating: 4.8,
    ratingCount: 79,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=700&auto=format&fit=crop&q=80',
    description: 'أفضل عزل صوتي في العالم بفضل معالج V1 المزدوج و8 ميكروفونات لصوت نقي جداً وعمر بطارية يصل 30 ساعة.',
    stock: 14,
    isFeatured: true
  },
  {
    id: 'prod-5',
    name: 'ساعة سامسونج جالاكسي الترا تيتانيوم رمادي 47 مم',
    category: 'watches',
    price: 245000,
    originalPrice: 280000,
    discountPercentage: 12,
    rating: 4.7,
    ratingCount: 53,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=700&auto=format&fit=crop&q=80',
    description: 'مصممة لتحمل أصعب الظروف الخارجية مع بطارية عملاقة ومستشعرات دقيقة لتتبع الصحة والأنشطة الرياضية.',
    stock: 9,
    isNew: true
  },
  {
    id: 'prod-6',
    name: 'محفظة الوقزة الجلدية الفاخرة مع حماية RFID',
    category: 'fashion',
    price: 24000,
    originalPrice: 35000,
    discountPercentage: 31,
    rating: 4.8,
    ratingCount: 110,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=700&auto=format&fit=crop&q=80',
    description: 'جلد طبيعي 100% مستورد مع تفصيل يدوي فاخر ومقاومة للسرقة الإلكترونية بالبطاقات البنكية.',
    stock: 30,
    badge: 'عرض خاص'
  }
];
