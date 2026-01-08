'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { 
  Monitor, 
  Cpu, 
  CreditCard, 
  Printer, 
  Barcode, 
  Shield, 
  Truck, 
  Headphones,
  ArrowRight,
  Zap,
  CheckCircle,
  Star,
  Package
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import type { HomePageProps } from '@/components/registry'
import {
  type ProductWithTranslations,
  type CategoryWithTranslations,
  type LocalizedProduct,
  type LocalizedCategory,
  localizeProducts,
  localizeCategories,
  PRODUCT_WITH_TRANSLATIONS_SELECT,
  CATEGORY_WITH_TRANSLATIONS_SELECT,
} from '@/lib/i18n/localize'

const translations = {
  fr: {
    hero: {
      badge: 'Solutions POS Professionnelles',
      title: 'Équipez Votre Commerce',
      subtitle: 'Découvrez notre gamme complète de matériel de point de vente : caisses enregistreuses, imprimantes thermiques, lecteurs de codes-barres et accessoires professionnels.',
      cta: 'Voir les Produits',
      ctaSecondary: 'Demander un Devis'
    },
    features: {
      warranty: 'Garantie 2 Ans',
      warrantyDesc: 'Sur tous nos produits',
      support: 'Support 24/7',
      supportDesc: 'Assistance technique',
      delivery: 'Livraison Rapide',
      deliveryDesc: 'Partout en Algérie',
      installation: 'Installation',
      installationDesc: 'Service sur site'
    },
    categories: {
      title: 'Nos Catégories',
      subtitle: 'Tout le matériel POS dont vous avez besoin',
      viewAll: 'Voir Tout'
    },
    products: {
      title: 'Produits Populaires',
      subtitle: 'Les équipements les plus demandés',
      viewAll: 'Voir Tous les Produits',
      addToCart: 'Ajouter',
      inStock: 'En Stock',
      outOfStock: 'Rupture'
    },
    brands: {
      title: 'Marques Partenaires',
      subtitle: 'Nous travaillons avec les meilleures marques'
    },
    cta: {
      title: 'Besoin d\'un Devis Personnalisé?',
      subtitle: 'Notre équipe est là pour vous accompagner dans le choix de votre équipement POS.',
      button: 'Contactez-Nous'
    }
  },
  ar: {
    hero: {
      badge: 'حلول نقاط البيع الاحترافية',
      title: 'جهّز متجرك',
      subtitle: 'اكتشف مجموعتنا الكاملة من معدات نقاط البيع: صناديق النقد، طابعات حرارية، قارئات الباركود والملحقات المهنية.',
      cta: 'عرض المنتجات',
      ctaSecondary: 'طلب عرض سعر'
    },
    features: {
      warranty: 'ضمان سنتين',
      warrantyDesc: 'على جميع منتجاتنا',
      support: 'دعم 24/7',
      supportDesc: 'مساعدة تقنية',
      delivery: 'توصيل سريع',
      deliveryDesc: 'في جميع أنحاء الجزائر',
      installation: 'تركيب',
      installationDesc: 'خدمة في الموقع'
    },
    categories: {
      title: 'فئاتنا',
      subtitle: 'جميع معدات نقاط البيع التي تحتاجها',
      viewAll: 'عرض الكل'
    },
    products: {
      title: 'المنتجات الشائعة',
      subtitle: 'المعدات الأكثر طلباً',
      viewAll: 'عرض جميع المنتجات',
      addToCart: 'إضافة',
      inStock: 'متوفر',
      outOfStock: 'نفذ'
    },
    brands: {
      title: 'العلامات التجارية الشريكة',
      subtitle: 'نعمل مع أفضل العلامات التجارية'
    },
    cta: {
      title: 'تحتاج عرض سعر مخصص؟',
      subtitle: 'فريقنا هنا لمساعدتك في اختيار معدات نقاط البيع الخاصة بك.',
      button: 'اتصل بنا'
    }
  },
  en: {
    hero: {
      badge: 'Professional POS Solutions',
      title: 'Equip Your Business',
      subtitle: 'Discover our complete range of point-of-sale equipment: cash registers, thermal printers, barcode scanners and professional accessories.',
      cta: 'View Products',
      ctaSecondary: 'Request Quote'
    },
    features: {
      warranty: '2-Year Warranty',
      warrantyDesc: 'On all products',
      support: '24/7 Support',
      supportDesc: 'Technical assistance',
      delivery: 'Fast Delivery',
      deliveryDesc: 'Across Algeria',
      installation: 'Installation',
      installationDesc: 'On-site service'
    },
    categories: {
      title: 'Our Categories',
      subtitle: 'All the POS equipment you need',
      viewAll: 'View All'
    },
    products: {
      title: 'Popular Products',
      subtitle: 'Most requested equipment',
      viewAll: 'View All Products',
      addToCart: 'Add',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock'
    },
    brands: {
      title: 'Partner Brands',
      subtitle: 'We work with the best brands'
    },
    cta: {
      title: 'Need a Custom Quote?',
      subtitle: 'Our team is here to help you choose your POS equipment.',
      button: 'Contact Us'
    }
  }
}

// POS Hardware color palette - Deep blue, electric cyan, dark slate
const categoryIcons: Record<string, typeof Monitor> = {
  'caisses': CreditCard,
  'imprimantes': Printer,
  'lecteurs': Barcode,
  'ecrans': Monitor,
  'accessoires': Package,
  'default': Cpu
}

export default function ElectronicsHomePage({ locale, tenant }: HomePageProps) {
  const [featuredProducts, setFeaturedProducts] = useState<LocalizedProduct[]>([])
  const [categories, setCategories] = useState<LocalizedCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const t = translations[locale as keyof typeof translations] || translations.fr
  const isRTL = locale === 'ar'

  // Get brand info from tenant config
  const config = tenant.config as Record<string, unknown> | undefined
  const brandConfig = config?.brand as { name?: string; tagline?: string; tagline_ar?: string } | undefined
  const heroTitle = brandConfig?.name || tenant.name || t.hero.title
  const heroSubtitle = locale === 'ar' 
    ? (brandConfig?.tagline_ar || t.hero.subtitle)
    : (brandConfig?.tagline || t.hero.subtitle)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Fetch featured products with translations
      const { data: productsData } = await supabase
        .from('products')
        .select(PRODUCT_WITH_TRANSLATIONS_SELECT)
        .eq('tenant_id', tenant.id)
        .eq('is_online', true)
        .eq('is_available', true)
        .order('created_at', { ascending: false })
        .limit(8) 

      if (productsData) {
        const localizedProducts = localizeProducts(productsData as ProductWithTranslations[], locale)
        setFeaturedProducts(localizedProducts)
      }

      // Fetch categories with translations
      const { data: categoriesData, error: catError } = await supabase
        .from('categories')
        .select(CATEGORY_WITH_TRANSLATIONS_SELECT)
        .eq('tenant_id', tenant.id)
        .order('name')
        .limit(6)

      if (catError) {
        console.error('Error fetching categories:', catError)
      } else if (categoriesData) {
        const localizedCats = localizeCategories(categoriesData as CategoryWithTranslations[], locale)
        setCategories(localizedCats)
      }

      setIsLoading(false)
    }

    fetchData()
  }, [tenant.id, locale])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar-DZ' : 'fr-DZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price) + ' DA'
  }

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section - Light professional tech aesthetic */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50 text-slate-900">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.08) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(6, 182, 212, 0.08) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        {/* Soft gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        
        <div className="container relative z-10 mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-cyan-500/10 text-cyan-600 border-cyan-500/30 hover:bg-cyan-500/20 px-4 py-2">
                <Zap size={16} className="mr-2" />
                {t.hero.badge}
              </Badge>
              
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-slate-800 via-cyan-700 to-cyan-600 bg-clip-text text-transparent">
                  {heroTitle}
                </span>
              </h1>
              
              <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
                {heroSubtitle}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold gap-2 shadow-lg shadow-cyan-600/25">
                  <Link href="/boutique">
                    {t.hero.cta}
                    <ArrowRight size={18} className={isRTL ? 'rotate-180' : ''} />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 gap-2">
                  <Link href="/contact">
                    {t.hero.ctaSecondary}
                  </Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <CheckCircle size={18} className="text-cyan-600" />
                  <span className="text-sm">Garantie 2 ans</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <CheckCircle size={18} className="text-cyan-600" />
                  <span className="text-sm">Support technique</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <CheckCircle size={18} className="text-cyan-600" />
                  <span className="text-sm">Livraison nationale</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/50">
                <Image
                  src="/generated_image_5e6fccaa-2d42-4402-ae2f-e5b8797dd915.png"
                  alt="POS Hardware - Terminal, Scanner, Printer"
                  width={800}
                  height={800}
                  className="object-cover w-full h-auto"
                  priority
                />
                
                {/* Floating stats */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 border border-slate-200 shadow-xl">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-slate-800">4.9</span>
                    <span className="text-slate-500 text-sm">(500+ avis)</span>
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-4 bg-cyan-600 rounded-xl px-4 py-3 shadow-xl shadow-cyan-600/30">
                  <div className="flex items-center gap-2 text-white">
                    <Truck className="w-5 h-5" />
                    <span className="font-semibold text-sm">Livraison 24-48h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-slate-200 rtl:divide-x-reverse">
            <div className="flex items-center gap-4 py-6 px-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                <Shield className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">{t.features.warranty}</p>
                <p className="text-sm text-slate-500">{t.features.warrantyDesc}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 py-6 px-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                <Headphones className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">{t.features.support}</p>
                <p className="text-sm text-slate-500">{t.features.supportDesc}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 py-6 px-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                <Truck className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">{t.features.delivery}</p>
                <p className="text-sm text-slate-500">{t.features.deliveryDesc}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 py-6 px-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                <Cpu className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">{t.features.installation}</p>
                <p className="text-sm text-slate-500">{t.features.installationDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">{t.categories.title}</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">{t.categories.subtitle}</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-xl h-40 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => {
                // Match icon by category name (lowercase)
                const categoryKey = category.name.toLowerCase()
                const IconComponent = categoryIcons[categoryKey] || categoryIcons.default
                return (
                  <Link
                    key={category.id}
                    href={`/boutique?category=${category.id}`}
                    className="group relative bg-slate-50 hover:bg-white rounded-xl p-6 text-center transition-all duration-300 border border-slate-200 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10"
                  >
                    <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center group-hover:from-cyan-200 group-hover:to-blue-200 transition-all">
                      <IconComponent className="w-7 h-7 text-cyan-600" />
                    </div>
                    <h3 className="font-semibold text-slate-800 group-hover:text-cyan-600 transition-colors">
                      {category.name}
                    </h3>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">{t.products.title}</h2>
              <p className="text-slate-500">{t.products.subtitle}</p>
            </div>
            <Button asChild variant="outline" className="hidden md:flex border-slate-300 text-slate-700 hover:bg-slate-100 gap-2">
              <Link href="/boutique">
                {t.products.viewAll}
                <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <Link
                  key={product.id}
                  href={`/boutique/produit/${product.id}`}
                  className="group bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
                >
                  {/* Product Image */}
                  <div className="aspect-square relative bg-slate-100 overflow-hidden">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Cpu className="w-16 h-16 text-slate-300" />
                      </div>
                    )}
                    
                    {/* Stock badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className={product.is_available 
                        ? "bg-emerald-500/90 text-white border-0" 
                        : "bg-red-500/90 text-white border-0"
                      }>
                        {product.is_available ? t.products.inStock : t.products.outOfStock}
                      </Badge>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-slate-800 group-hover:text-cyan-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    
                    {product.short_description && (
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {product.short_description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xl font-bold text-cyan-600">
                        {formatPrice(product.price)}
                      </span>
                      <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold">
                        {t.products.addToCart}
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Mobile view all button */}
          <div className="mt-8 text-center md:hidden">
            <Button asChild className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold gap-2">
              <Link href="/boutique">
                {t.products.viewAll}
                <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-cyan-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">{t.cta.title}</h2>
          <p className="text-cyan-100 max-w-2xl mx-auto mb-8">{t.cta.subtitle}</p>
          <Button asChild size="lg" className="bg-white text-cyan-700 hover:bg-cyan-50 font-semibold gap-2 shadow-lg">
            <Link href="/contact">
              <Headphones size={20} />
              {t.cta.button}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
