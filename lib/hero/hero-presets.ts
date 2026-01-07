// ============================================
// MASTERPIECE HERO PRESETS FOR EACH BUSINESS TYPE
// ============================================
// Following UI/UX best practices:
// - Visual hierarchy with clear focal points
// - Emotional color psychology per industry
// - Strategic CTA placement and contrast
// - Trust signals and social proof
// - Accessibility-compliant contrast ratios
// - Motion that guides, not distracts

import type { HeroConfig, HeroPreset } from '@/types/hero'
import type { BusinessTypeId } from '@/types/multi-business'

// ============================================
// 🍯 HONEY & NATURE BUSINESS (Nutrition)
// ============================================
// Design Philosophy: Organic, Golden, Luxurious
// Color Psychology: Gold/Amber for premium quality, warm whites for purity
// Layout: Centered with floating organic elements
// UX Focus: Sensory appeal, purity verification, heritage

export const nutritionHeroPreset: HeroPreset = {
  business_type: 'nutrition',
  name: 'Golden Nectar',
  config: {
    business_type: 'nutrition',
    layout: 'centered',
    height: 'lg',
    gradient: {
      style: 'radial',
      direction: 'radial-center',
      stops: [
        { color: 'var(--primary)', position: 0, opacity: 0.15 },   // Theme primary (subtle glow)
        { color: 'var(--secondary)', position: 45, opacity: 0.1 }, // Theme secondary
        { color: 'var(--background)', position: 100, opacity: 1 }  // Theme background
      ],
      overlay: 'linear-gradient(to bottom, transparent 0%, var(--background) 100%)'
    },
    content: {
      badge: {
        fr: '✨ Récolte 2025 - 100% Pur',
        ar: '✨ حصاد 2025 - طبيعي 100%',
        en: '✨ Harvest 2025 - 100% Pure'
      },
      headline: {
        fr: 'L\'Or de la Nature,\nDirectement de la Ruche',
        ar: 'ذهب الطبيعة،\nمباشرة من الخلية',
        en: 'Nature\'s Gold,\nStraight from the Hive'
      },
      subheadline: {
        fr: 'Découvrez nos miels rares et produits de la ruche. Une tradition ancestrale, un goût inoubliable pour votre santé et bien-être.',
        ar: 'اكتشف أنواع العسل النادرة ومنتجات الخلية. تقليد عريق، وطعم لا يُنسى لصحتك ورفاهيتك.',
        en: 'Discover our rare honeys and hive products. An ancestral tradition, an unforgettable taste for your health and wellness.'
      },
      cta_primary: {
        label: { fr: 'Découvrir nos Miels', ar: 'اكتشف العسل', en: 'Discover Honeys' },
        href: '/boutique',
        variant: 'primary',
        icon: 'Hexagon'
      },
      cta_secondary: {
        label: { fr: 'Notre Histoire', ar: 'قصتنا', en: 'Our Story' },
        href: '/story',
        variant: 'outline'
      },
      trust_indicators: [
        '🌿 100% Naturel',
        '🔬 Testé en Laboratoire',
        '🏆 Miel Primé',
        '⛰️ Origine Montagne'
      ]
    },
    typography: {
      headline_size: '2xl',
      headline_weight: 'bold',
      text_align: 'center',
      text_color: 'dark'
    },
    mobile_height: 'lg'
  }
}

// ============================================
// 🛒 RETAIL BUSINESS
// ============================================
// Design Philosophy: Bold, Trustworthy, Value-Driven
// Color Psychology: Blues for trust, warm accents for urgency
// Layout: Split layout to showcase products alongside messaging
// UX Focus: Clear value proposition, urgency triggers, trust signals

export const retailHeroPreset: HeroPreset = {
  business_type: 'retail',
  name: 'Retail Excellence',
  config: {
    business_type: 'retail',
    layout: 'split-right',
    height: 'lg',
    gradient: {
      style: 'diagonal',
      direction: 'to-br',
      stops: [
        { color: 'var(--primary)', position: 0, opacity: 1 },
        { color: 'var(--secondary)', position: 70, opacity: 0.95 },
        { color: 'var(--accent)', position: 100, opacity: 0.8 }
      ]
    },
    content: {
      badge: {
        fr: '🔥 Soldes -50% | Offre Limitée',
        ar: '🔥 تخفيضات -50% | عرض محدود',
        en: '🔥 Sale -50% | Limited Time'
      },
      headline: {
        fr: 'Qualité Premium,\nPrix Imbattables',
        ar: 'جودة ممتازة،\nأسعار لا تُقاوم',
        en: 'Premium Quality,\nUnbeatable Prices'
      },
      subheadline: {
        fr: 'Découvrez notre sélection de produits authentiques avec garantie satisfaction. Livraison express partout en Algérie.',
        ar: 'اكتشف مجموعتنا من المنتجات الأصلية مع ضمان الرضا. توصيل سريع في جميع أنحاء الجزائر.',
        en: 'Discover our selection of authentic products with satisfaction guarantee. Express delivery across Algeria.'
      },
      cta_primary: {
        label: { fr: 'Voir les Offres', ar: 'شاهد العروض', en: 'See Deals' },
        href: '/boutique',
        variant: 'primary',
        icon: 'ShoppingBag'
      },
      cta_secondary: {
        label: { fr: 'Meilleures Ventes', ar: 'الأكثر مبيعاً', en: 'Best Sellers' },
        href: '/bestsellers',
        variant: 'outline'
      },
      trust_indicators: [
        '✓ Produits Originaux',
        '🚚 Livraison 24-48h',
        '💳 Paiement à la livraison',
        '↩️ Retour gratuit 14j'
      ]
    },
    media: {
      type: 'image',
      position: 'right',
      alt: { fr: 'Produits en vedette', ar: 'منتجات مميزة', en: 'Featured products' }
    },
    typography: {
      headline_size: 'xl',
      headline_weight: 'bold',
      text_align: 'left',
      text_color: 'light'
    },
    mobile_layout: 'centered',
    mobile_height: 'md'
  }
}

// ============================================
// 👗 CLOTHING / FASHION BUSINESS
// ============================================
// Design Philosophy: Elegant, Aspirational, Editorial
// Color Psychology: Neutrals for sophistication, bold accents for statement
// Layout: Full-bleed immersive with typography focus
// UX Focus: Emotional connection, visual storytelling, exclusivity

export const clothingHeroPreset: HeroPreset = {
  business_type: 'clothing',
  name: 'Fashion Editorial',
  config: {
    business_type: 'clothing',
    layout: 'full-bleed',
    height: 'full',
    gradient: {
      style: 'mesh',
      direction: 'radial-center',
      stops: [
        { color: 'var(--primary)', position: 0, opacity: 0.15 },
        { color: 'var(--accent)', position: 40, opacity: 0.25 },
        { color: 'var(--background)', position: 100, opacity: 0.9 }
      ],
      overlay: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 30%, transparent 70%, var(--background) 100%)'
    },
    content: {
      badge: {
        fr: 'NOUVELLE COLLECTION SS25',
        ar: 'مجموعة جديدة SS25',
        en: 'NEW COLLECTION SS25'
      },
      headline: {
        fr: 'Redéfinissez\nVotre Élégance',
        ar: 'أعد تعريف\nأناقتك',
        en: 'Redefine\nYour Elegance'
      },
      subheadline: {
        fr: 'Des pièces intemporelles, confectionnées avec passion. Chaque détail raconte une histoire de sophistication.',
        ar: 'قطع خالدة، صُنعت بشغف. كل تفصيل يروي قصة من الرقي.',
        en: 'Timeless pieces, crafted with passion. Every detail tells a story of sophistication.'
      },
      cta_primary: {
        label: { fr: 'Explorer la Collection', ar: 'استكشف المجموعة', en: 'Explore Collection' },
        href: '/boutique',
        variant: 'primary',
        icon: 'Sparkles'
      },
      cta_secondary: {
        label: { fr: 'Lookbook', ar: 'دليل الأزياء', en: 'Lookbook' },
        href: '/lookbook',
        variant: 'ghost'
      },
      trust_indicators: [
        '✨ Pièces Exclusives',
        '🧵 Qualité Artisanale',
        '📦 Emballage Premium'
      ]
    },
    media: {
      type: 'image',
      position: 'background',
      blend_mode: 'soft-light',
      alt: { fr: 'Mannequin mode', ar: 'عارضة أزياء', en: 'Fashion model' }
    },
    typography: {
      headline_size: '2xl',
      headline_weight: 'medium',
      text_align: 'center',
      text_color: 'dark'
    },
    mobile_height: 'lg'
  }
}

// ============================================
// 🍽️ RESTAURANT / CAFÉ BUSINESS
// ============================================
// Design Philosophy: Warm, Appetizing, Inviting
// Color Psychology: Warm oranges/reds for appetite, earth tones for comfort
// Layout: Split layout with food imagery prominence
// UX Focus: Appetite appeal, easy ordering, trust through reviews

export const restaurantHeroPreset: HeroPreset = {
  business_type: 'restaurant',
  name: 'Restaurant Gourmet',
  config: {
    business_type: 'restaurant',
    layout: 'split-left',
    height: 'lg',
    gradient: {
      style: 'duotone',
      direction: 'to-br',
      stops: [
        { color: 'var(--secondary)', position: 0, opacity: 0.95 },
        { color: 'var(--primary)', position: 60, opacity: 1 },
        { color: 'var(--accent)', position: 100, opacity: 0.9 }
      ]
    },
    content: {
      badge: {
        fr: '🔥 OUVERT MAINTENANT | Livraison Express',
        ar: '🔥 مفتوح الآن | توصيل سريع',
        en: '🔥 OPEN NOW | Express Delivery'
      },
      headline: {
        fr: 'L\'Art du Goût,\nLivré Chez Vous',
        ar: 'فن المذاق،\nيُوصَل إليك',
        en: 'The Art of Taste,\nDelivered to You'
      },
      subheadline: {
        fr: 'Des plats préparés avec passion par nos chefs, des ingrédients frais du jour. Commandez maintenant et régalez-vous en 30 minutes.',
        ar: 'أطباق محضرة بشغف من طهاتنا، مكونات طازجة يومياً. اطلب الآن واستمتع خلال 30 دقيقة.',
        en: 'Dishes crafted with passion by our chefs, daily fresh ingredients. Order now and enjoy in 30 minutes.'
      },
      cta_primary: {
        label: { fr: 'Commander Maintenant', ar: 'اطلب الآن', en: 'Order Now' },
        href: '/boutique',
        variant: 'primary',
        icon: 'UtensilsCrossed'
      },
      cta_secondary: {
        label: { fr: 'Voir le Menu', ar: 'شاهد القائمة', en: 'View Menu' },
        href: '/menu',
        variant: 'outline'
      },
      trust_indicators: [
        '⏱️ Livraison 30min',
        '⭐ 4.9/5 (2,400+ avis)',
        '🆓 Livraison gratuite +2000 DA',
        '🔒 Paiement sécurisé'
      ]
    },
    media: {
      type: 'image',
      position: 'left',
      alt: { fr: 'Plat signature', ar: 'الطبق المميز', en: 'Signature dish' }
    },
    typography: {
      headline_size: 'xl',
      headline_weight: 'bold',
      text_align: 'left',
      text_color: 'light'
    },
    mobile_layout: 'centered',
    mobile_height: 'md'
  }
}

// ============================================
// 💼 SERVICES BUSINESS (Salon, Spa, Consulting)
// ============================================
// Design Philosophy: Professional, Trustworthy, Calming
// Color Psychology: Blues for trust, soft tones for relaxation
// Layout: Centered for clarity and focus
// UX Focus: Easy booking, credentials display, instant trust

export const servicesHeroPreset: HeroPreset = {
  business_type: 'services',
  name: 'Services Professional',
  config: {
    business_type: 'services',
    layout: 'centered',
    height: 'lg',
    gradient: {
      style: 'radial',
      direction: 'radial-center',
      stops: [
        { color: 'var(--primary)', position: 0, opacity: 0.7 },
        { color: 'var(--secondary)', position: 50, opacity: 0.5 },
        { color: 'var(--background)', position: 100, opacity: 1 }
      ]
    },
    content: {
      badge: {
        fr: '⭐ Noté 5/5 par +500 clients',
        ar: '⭐ تقييم 5/5 من +500 عميل',
        en: '⭐ Rated 5/5 by 500+ clients'
      },
      headline: {
        fr: 'Excellence à Votre Service',
        ar: 'التميز في خدمتك',
        en: 'Excellence at Your Service'
      },
      subheadline: {
        fr: 'Prenez soin de vous avec nos experts certifiés. Réservez votre rendez-vous en quelques clics et profitez d\'une expérience sur mesure.',
        ar: 'اعتنِ بنفسك مع خبرائنا المعتمدين. احجز موعدك بنقرات قليلة واستمتع بتجربة مخصصة.',
        en: 'Take care of yourself with our certified experts. Book your appointment in a few clicks and enjoy a tailored experience.'
      },
      cta_primary: {
        label: { fr: 'Réserver un Rendez-vous', ar: 'احجز موعداً', en: 'Book Appointment' },
        href: '/booking',
        variant: 'primary',
        icon: 'CalendarCheck'
      },
      cta_secondary: {
        label: { fr: 'Nos Services', ar: 'خدماتنا', en: 'Our Services' },
        href: '/services',
        variant: 'outline'
      },
      trust_indicators: [
        '✓ Experts Certifiés',
        '🕐 Disponible 7j/7',
        '💯 Satisfaction Garantie',
        '📍 Localisation Premium'
      ]
    },
    typography: {
      headline_size: 'xl',
      headline_weight: 'semibold',
      text_align: 'center',
      text_color: 'dark'
    },
    mobile_height: 'md'
  }
}

// ============================================
// 🎨 CUSTOM / DEFAULT BUSINESS
// ============================================
// Design Philosophy: Versatile, Modern, Adaptable
// Color Psychology: Neutral with brand accent flexibility
// Layout: Centered for universal appeal
// UX Focus: Clear message, easy navigation, brand adaptability

export const customHeroPreset: HeroPreset = {
  business_type: 'custom',
  name: 'Custom Modern',
  config: {
    business_type: 'custom',
    layout: 'centered',
    height: 'lg',
    gradient: {
      style: 'linear',
      direction: 'to-br',
      stops: [
        { color: 'var(--primary)', position: 0, opacity: 0.95 },
        { color: 'var(--secondary)', position: 60, opacity: 0.9 },
        { color: 'var(--accent)', position: 100, opacity: 0.8 }
      ]
    },
    content: {
      badge: {
        fr: '✨ Bienvenue Chez Nous',
        ar: '✨ مرحباً بك عندنا',
        en: '✨ Welcome to Our Store'
      },
      headline: {
        fr: 'Découvrez\nL\'Excellence',
        ar: 'اكتشف\nالتميز',
        en: 'Discover\nExcellence'
      },
      subheadline: {
        fr: 'Une sélection unique de produits de qualité, soigneusement choisis pour vous. Votre satisfaction est notre priorité.',
        ar: 'مجموعة فريدة من المنتجات عالية الجودة، مختارة بعناية لك. رضاك هو أولويتنا.',
        en: 'A unique selection of quality products, carefully chosen for you. Your satisfaction is our priority.'
      },
      cta_primary: {
        label: { fr: 'Explorer la Boutique', ar: 'استكشف المتجر', en: 'Explore Store' },
        href: '/boutique',
        variant: 'primary',
        icon: 'ArrowRight'
      },
      cta_secondary: {
        label: { fr: 'En Savoir Plus', ar: 'اعرف المزيد', en: 'Learn More' },
        href: '/about',
        variant: 'outline'
      },
      trust_indicators: [
        '✓ Qualité Garantie',
        '🚚 Livraison Rapide',
        '💬 Support 24/7'
      ]
    },
    typography: {
      headline_size: 'xl',
      headline_weight: 'bold',
      text_align: 'center',
      text_color: 'light'
    },
    mobile_height: 'md'
  }
}

// ============================================
// 🍳 KITCHENWARE BUSINESS
// ============================================
// Design Philosophy: Warm, Professional, Culinary Excellence
// Color Psychology: Orange/Amber for warmth and appetite, clean whites for hygiene
// Layout: Split layout to showcase equipment
// UX Focus: Quality, durability, professional grade

export const kitchenwareHeroPreset: HeroPreset = {
  business_type: 'kitchenware',
  name: 'Culinary Excellence',
  config: {
    business_type: 'kitchenware',
    layout: 'split-right',
    height: 'lg',
    gradient: {
      style: 'duotone',
      direction: 'to-br',
      stops: [
        { color: '#FFF7ED', position: 0, opacity: 1 },
        { color: '#FFEDD5', position: 50, opacity: 0.9 },
        { color: '#FED7AA', position: 100, opacity: 0.8 }
      ]
    },
    content: {
      badge: {
        fr: '🍳 Équipement Professionnel',
        ar: '🍳 معدات احترافية',
        en: '🍳 Professional Equipment'
      },
      headline: {
        fr: 'Équipez Votre\nCuisine Pro',
        ar: 'جهّز\nمطبخك المحترف',
        en: 'Equip Your\nPro Kitchen'
      },
      subheadline: {
        fr: 'Découvrez notre gamme complète d\'équipements de cuisine professionnels. Qualité, durabilité et performance pour les chefs exigeants.',
        ar: 'اكتشف مجموعتنا الكاملة من معدات المطبخ الاحترافية. الجودة والمتانة والأداء للطهاة المتميزين.',
        en: 'Discover our complete range of professional kitchen equipment. Quality, durability and performance for demanding chefs.'
      },
      cta_primary: {
        label: { fr: 'Voir les Produits', ar: 'عرض المنتجات', en: 'View Products' },
        href: '/boutique',
        variant: 'primary',
        icon: 'ChefHat'
      },
      cta_secondary: {
        label: { fr: 'Demander un Devis', ar: 'طلب عرض سعر', en: 'Request Quote' },
        href: '/contact',
        variant: 'outline'
      },
      trust_indicators: [
        '🛡️ Garantie 2 Ans',
        '🚚 Livraison Rapide',
        '👨‍🍳 Qualité Pro',
        '🔧 SAV Expert'
      ]
    },
    typography: {
      headline_size: 'xl',
      headline_weight: 'bold',
      text_align: 'left',
      text_color: 'dark'
    },
    mobile_height: 'md'
  }
}

// ============================================
// 💻 ELECTRONICS / POS BUSINESS
// ============================================
// Design Philosophy: Modern, Technical, Trustworthy
// Color Psychology: Cyan/Blue for technology and trust, clean grays for professionalism
// Layout: Split layout to showcase hardware
// UX Focus: Reliability, support, technical expertise

export const electronicsHeroPreset: HeroPreset = {
  business_type: 'electronics',
  name: 'Tech Solutions',
  config: {
    business_type: 'electronics',
    layout: 'split-right',
    height: 'lg',
    gradient: {
      style: 'linear',
      direction: 'to-right',
      stops: [
        { color: '#F8FAFC', position: 0, opacity: 1 },
        { color: '#F1F5F9', position: 50, opacity: 0.95 },
        { color: '#ECFEFF', position: 100, opacity: 0.9 }
      ]
    },
    content: {
      badge: {
        fr: '⚡ Solutions POS Professionnelles',
        ar: '⚡ حلول نقاط البيع الاحترافية',
        en: '⚡ Professional POS Solutions'
      },
      headline: {
        fr: 'Équipez Votre\nCommerce',
        ar: 'جهّز\nمتجرك',
        en: 'Equip Your\nBusiness'
      },
      subheadline: {
        fr: 'Découvrez notre gamme complète de matériel de point de vente : caisses, imprimantes, lecteurs et accessoires professionnels.',
        ar: 'اكتشف مجموعتنا الكاملة من معدات نقاط البيع: صناديق النقد، الطابعات، القارئات والملحقات المهنية.',
        en: 'Discover our complete range of POS equipment: registers, printers, scanners and professional accessories.'
      },
      cta_primary: {
        label: { fr: 'Voir les Produits', ar: 'عرض المنتجات', en: 'View Products' },
        href: '/boutique',
        variant: 'primary',
        icon: 'Monitor'
      },
      cta_secondary: {
        label: { fr: 'Demander un Devis', ar: 'طلب عرض سعر', en: 'Request Quote' },
        href: '/contact',
        variant: 'outline'
      },
      trust_indicators: [
        '🛡️ Garantie 2 Ans',
        '📞 Support 24/7',
        '🚚 Livraison Nationale',
        '🔧 Installation'
      ]
    },
    typography: {
      headline_size: 'xl',
      headline_weight: 'bold',
      text_align: 'left',
      text_color: 'dark'
    },
    mobile_height: 'md'
  }
}

// Preset registry
export const heroPresets: Record<BusinessTypeId, HeroPreset> = {
  nutrition: nutritionHeroPreset,
  retail: retailHeroPreset,
  clothing: clothingHeroPreset,
  restaurant: restaurantHeroPreset,
  services: servicesHeroPreset,
  custom: customHeroPreset,
  kitchenware: kitchenwareHeroPreset,
  electronics: electronicsHeroPreset
}

// Get preset by business type
export function getHeroPreset(businessType: BusinessTypeId): HeroPreset {
  return heroPresets[businessType] || heroPresets.custom
}

// Get default hero config for business type
export function getDefaultHeroConfig(businessType: BusinessTypeId): HeroConfig {
  const preset = getHeroPreset(businessType)
  return {
    id: `default-${businessType}`,
    is_active: true,
    priority: 100,
    ...preset.config
  }
}
