'use client'

import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ArrowRight, Leaf, Shield, Truck, Award, Droplets, Sun, Mountain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import type { HomePageProps } from '@/components/registry'
import HoneyProductCard from './product-card'
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
      title: 'Miel Bio d\'Algérie',
      subtitle: 'Découvrez notre sélection de miels purs et naturels, récoltés avec passion dans les montagnes algériennes',
      cta: 'Découvrir nos miels',
      badge: 'Miel 100% Naturel',
    },
    features: {
      pure: 'Miel Pur',
      pureDesc: 'Sans additifs ni conservateurs',
      organic: 'Certifié Bio',
      organicDesc: 'Agriculture biologique',
      delivery: 'Livraison Rapide',
      deliveryDesc: 'Partout en Algérie',
      quality: 'Qualité Premium',
      qualityDesc: 'Contrôle qualité rigoureux',
    },
    categories: 'Nos Catégories',
    categoriesSubtitle: 'Explorez notre gamme de miels et produits de la ruche',
    featured: 'Nos Miels Vedettes',
    featuredSubtitle: 'Les favoris de nos clients',
    viewAll: 'Voir tout',
    shopNow: 'Découvrir la boutique',
    trustBadges: {
      natural: '100% Naturel',
      local: 'Produit Local',
    },
  },
  ar: {
    hero: {
      title: 'عسل جزائري طبيعي',
      subtitle: 'اكتشف مجموعتنا من العسل النقي والطبيعي، المحصود بشغف من جبال الجزائر',
      cta: 'اكتشف عسلنا',
      badge: 'عسل طبيعي 100%',
    },
    features: {
      pure: 'عسل نقي',
      pureDesc: 'بدون إضافات أو مواد حافظة',
      organic: 'عضوي معتمد',
      organicDesc: 'زراعة عضوية',
      delivery: 'توصيل سريع',
      deliveryDesc: 'في جميع أنحاء الجزائر',
      quality: 'جودة عالية',
      qualityDesc: 'مراقبة جودة صارمة',
    },
    categories: 'فئاتنا',
    categoriesSubtitle: 'استكشف مجموعتنا من العسل ومنتجات النحل',
    featured: 'أنواع العسل المميزة',
    featuredSubtitle: 'المفضلة لدى عملائنا',
    viewAll: 'عرض الكل',
    shopNow: 'تسوق الآن',
    trustBadges: {
      natural: 'طبيعي 100%',
      local: 'منتج محلي',
    },
  },
  en: {
    hero: {
      title: 'Organic Algerian Honey',
      subtitle: 'Discover our selection of pure and natural honeys, harvested with passion from the Algerian mountains',
      cta: 'Discover our honeys',
      badge: '100% Natural Honey',
    },
    features: {
      pure: 'Pure Honey',
      pureDesc: 'No additives or preservatives',
      organic: 'Certified Organic',
      organicDesc: 'Organic farming',
      delivery: 'Fast Delivery',
      deliveryDesc: 'Across Algeria',
      quality: 'Premium Quality',
      qualityDesc: 'Rigorous quality control',
    },
    categories: 'Our Categories',
    categoriesSubtitle: 'Explore our range of honeys and bee products',
    featured: 'Featured Honeys',
    featuredSubtitle: 'Customer favorites',
    viewAll: 'View all',
    shopNow: 'Shop now',
    trustBadges: {
      natural: '100% Natural',
      local: 'Local Product',
    },
  },
}

const categoryIcons: Record<string, typeof Droplets> = {
  default: Droplets,
}

export default function HoneyHomePage({ locale, tenant }: HomePageProps) {
  const [featuredProducts, setFeaturedProducts] = useState<LocalizedProduct[]>([])
  const [categories, setCategories] = useState<LocalizedCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const t = translations[locale as keyof typeof translations] || translations.fr
  const isRTL = locale === 'ar'

  const config = tenant.config as Record<string, unknown> | undefined
  const brandConfig = config?.brand as { name?: string; tagline?: string; tagline_ar?: string } | undefined
  const heroTitle = brandConfig?.name || t.hero.title
  const heroSubtitle = locale === 'ar' 
    ? (brandConfig?.tagline_ar || t.hero.subtitle)
    : (brandConfig?.tagline || t.hero.subtitle)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      const { data: products } = await supabase
        .from('products')
        .select(PRODUCT_WITH_TRANSLATIONS_SELECT)
        .eq('tenant_id', tenant.id)
        .eq('is_available', true)
        .eq('is_online', true)
        .order('created_at', { ascending: false })
        .limit(4)

      if (products) {
        const localizedProducts = localizeProducts(products as ProductWithTranslations[], locale)
        setFeaturedProducts(localizedProducts)
      }

      const { data: cats } = await supabase
        .from('categories')
        .select(CATEGORY_WITH_TRANSLATIONS_SELECT)
        .eq('tenant_id', tenant.id)

      if (cats) {
        const { data: productCounts } = await supabase
          .from('products')
          .select('category_id')
          .eq('tenant_id', tenant.id)
          .eq('is_available', true)
          .eq('is_online', true)

        const countMap = new Map<string, number>()
        productCounts?.forEach(p => {
          if (p.category_id) {
            countMap.set(p.category_id, (countMap.get(p.category_id) || 0) + 1)
          }
        })

        const localizedCats = localizeCategories(cats as CategoryWithTranslations[], locale)
        setCategories(
          localizedCats
            .map(c => ({ ...c, product_count: countMap.get(c.id) || 0 }))
            .filter(c => c.product_count > 0)
        )
      }

      setIsLoading(false)
    }

    fetchData()
  }, [tenant.id, locale])

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section - Honey themed with amber/gold gradients */}
      <section className="relative bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 py-20 lg:py-28 overflow-hidden">
        {/* Honeycomb pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='%23d97706' fill-opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-300/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium border border-amber-200">
                <Droplets size={18} />
                {t.hero.badge}
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-amber-900 leading-tight">
                {heroTitle}
              </h1>
              <p className="text-lg text-amber-800/80 max-w-lg leading-relaxed">
                {heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button asChild size="lg" className="gap-2 bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/30 h-12 px-8">
                  <Link href="/boutique">
                    {t.hero.cta}
                    <ArrowRight size={18} className={isRTL ? 'rotate-180' : ''} />
                  </Link>
                </Button>
              </div>
              
              {/* Trust indicators */}
              <div className="flex items-center gap-6 pt-4 text-sm text-amber-700">
                <div className="flex items-center gap-2">
                  <Leaf size={16} className="text-amber-600" />
                  <span>{t.trustBadges.natural}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mountain size={16} className="text-amber-600" />
                  <span>{t.trustBadges.local}</span>
                </div>
              </div>
            </div>
            <div className="relative w-full max-w-md mx-auto lg:max-w-lg">
              <div className="absolute inset-4 bg-gradient-to-br from-amber-300/30 to-yellow-200/40 rounded-3xl transform rotate-2" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-amber-200/50 max-h-[500px]">
                <Image
                  src="/honey-hero image.png"
                  alt="Suqya Miel Bio"
                  width={500}
                  height={600}
                  className="object-cover object-top w-full h-full max-h-[500px]"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
              </div>
              
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 rtl:-left-auto rtl:-right-4 bg-white rounded-xl px-4 py-3 shadow-xl border border-amber-100">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span className="font-semibold text-amber-800">Miel Premium</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white border-y border-amber-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-200 to-yellow-100 flex items-center justify-center mb-4">
                <Droplets className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="font-semibold text-amber-900">{t.features.pure}</h3>
              <p className="text-sm text-amber-700/70 mt-1">{t.features.pureDesc}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-200 to-yellow-100 flex items-center justify-center mb-4">
                <Leaf className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="font-semibold text-amber-900">{t.features.organic}</h3>
              <p className="text-sm text-amber-700/70 mt-1">{t.features.organicDesc}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-200 to-yellow-100 flex items-center justify-center mb-4">
                <Truck className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="font-semibold text-amber-900">{t.features.delivery}</h3>
              <p className="text-sm text-amber-700/70 mt-1">{t.features.deliveryDesc}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-200 to-yellow-100 flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="font-semibold text-amber-900">{t.features.quality}</h3>
              <p className="text-sm text-amber-700/70 mt-1">{t.features.qualityDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-white to-amber-50/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-amber-900">{t.categories}</h2>
                <p className="text-amber-700/70 mt-1">{t.categoriesSubtitle}</p>
              </div>
              <Link href="/boutique" className="text-amber-600 hover:text-amber-700 flex items-center gap-1 font-medium">
                {t.viewAll}
                <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {categories.map((category) => {
                const IconComponent = categoryIcons.default
                return (
                  <Link
                    key={category.id}
                    href={`/boutique?category=${category.id}`}
                    className="group relative bg-gradient-to-br from-white to-amber-50 rounded-2xl p-6 border border-amber-200 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 shadow-sm flex items-center justify-center group-hover:from-amber-200 group-hover:to-yellow-200 transition-colors border border-amber-200">
                        <IconComponent className="w-7 h-7 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-amber-900 group-hover:text-amber-700 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-amber-600/70">
                          {category.product_count} {locale === 'ar' ? 'منتج' : 'produits'}
                        </p>
                      </div>
                    </div>
                    <ArrowRight size={18} className={`absolute top-1/2 -translate-y-1/2 right-6 rtl:right-auto rtl:left-6 text-amber-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all ${isRTL ? 'rotate-180' : ''}`} />
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-b from-amber-50/30 to-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-amber-900">{t.featured}</h2>
              <p className="text-amber-700/70 mt-1">{t.featuredSubtitle}</p>
            </div>
            <Link href="/boutique" className="text-amber-600 hover:text-amber-700 flex items-center gap-1 font-medium">
              {t.viewAll}
              <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl h-96 animate-pulse border border-amber-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <HoneyProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="gap-2 h-12 px-8 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400">
              <Link href="/boutique">
                {t.shopNow}
                <ArrowRight size={18} className={isRTL ? 'rotate-180' : ''} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
