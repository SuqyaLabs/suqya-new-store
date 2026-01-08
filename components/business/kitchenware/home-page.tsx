'use client'

import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ArrowRight, ChefHat, Shield, Truck, Award, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import type { HomePageProps } from '@/components/registry'
import KitchenwareProductCard from './product-card'
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
      title: 'Ustensiles de Cuisine Premium',
      subtitle: 'Découvrez notre collection d\'ustensiles de qualité pour sublimer votre cuisine',
      cta: 'Découvrir la collection',
    },
    features: {
      quality: 'Qualité Premium',
      qualityDesc: 'Matériaux durables et design élégant',
      warranty: 'Garantie Étendue',
      warrantyDesc: 'Jusqu\'à 10 ans de garantie',
      delivery: 'Livraison Rapide',
      deliveryDesc: 'Partout en Algérie',
      certified: 'Certifié',
      certifiedDesc: 'Normes alimentaires respectées',
    },
    categories: 'Nos Catégories',
    featured: 'Produits Vedettes',
    viewAll: 'Voir tout',
    shopNow: 'Acheter maintenant',
  },
  ar: {
    hero: {
      title: 'أدوات مطبخ فاخرة',
      subtitle: 'اكتشف مجموعتنا من أدوات المطبخ عالية الجودة',
      cta: 'اكتشف المجموعة',
    },
    features: {
      quality: 'جودة عالية',
      qualityDesc: 'مواد متينة وتصميم أنيق',
      warranty: 'ضمان ممتد',
      warrantyDesc: 'حتى 10 سنوات ضمان',
      delivery: 'توصيل سريع',
      deliveryDesc: 'في جميع أنحاء الجزائر',
      certified: 'معتمد',
      certifiedDesc: 'معايير غذائية محترمة',
    },
    categories: 'فئاتنا',
    featured: 'منتجات مميزة',
    viewAll: 'عرض الكل',
    shopNow: 'تسوق الآن',
  },
  en: {
    hero: {
      title: 'Premium Kitchenware',
      subtitle: 'Discover our collection of quality utensils to elevate your cooking',
      cta: 'Discover the collection',
    },
    features: {
      quality: 'Premium Quality',
      qualityDesc: 'Durable materials and elegant design',
      warranty: 'Extended Warranty',
      warrantyDesc: 'Up to 10 years warranty',
      delivery: 'Fast Delivery',
      deliveryDesc: 'Across Algeria',
      certified: 'Certified',
      certifiedDesc: 'Food safety standards met',
    },
    categories: 'Our Categories',
    featured: 'Featured Products',
    viewAll: 'View all',
    shopNow: 'Shop now',
  },
}

export default function KitchenwareHomePage({ locale, tenant }: HomePageProps) {
  const [featuredProducts, setFeaturedProducts] = useState<LocalizedProduct[]>([])
  const [categories, setCategories] = useState<LocalizedCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const t = translations[locale as keyof typeof translations] || translations.fr
  const isRTL = locale === 'ar'

  // Get brand info from tenant config
  const config = tenant.config as Record<string, unknown> | undefined
  const brandConfig = config?.brand as { name?: string; tagline?: string; tagline_ar?: string } | undefined
  const heroTitle = t.hero.title
  const heroSubtitle = locale === 'ar' 
    ? (brandConfig?.tagline_ar || t.hero.subtitle)
    : (brandConfig?.tagline || t.hero.subtitle)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Fetch featured products with translations
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

      // Fetch categories with translations
      const { data: cats } = await supabase
        .from('categories')
        .select(CATEGORY_WITH_TRANSLATIONS_SELECT)
        .eq('tenant_id', tenant.id)

      if (cats) {
        // Get product counts
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

        // Localize categories and add product counts
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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 via-white to-stone-50 py-20 lg:py-28 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20">
                <ChefHat size={18} />
                {tenant.name}
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-stone-800 leading-tight">
                {heroTitle}
              </h1>
              <p className="text-lg text-stone-600 max-w-lg leading-relaxed">
                {heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button asChild size="lg" className="gap-2 shadow-lg shadow-primary/20 h-12 px-8">
                  <Link href="/boutique">
                    {t.hero.cta}
                    <ArrowRight size={18} className={isRTL ? 'rotate-180' : ''} />
                  </Link>
                </Button>
              </div>
              
              {/* Trust indicators */}
              <div className="flex items-center gap-6 pt-4 text-sm text-stone-500">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-primary" />
                  <span>Garantie 10 ans</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-primary" />
                  <span>Livraison gratuite</span>
                </div>
              </div>
            </div>
            <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
              <div className="absolute inset-4 bg-gradient-to-br from-primary/15 to-amber-200/30 rounded-3xl transform rotate-2" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-200/50">
                <Image
                  src="/Gemini_Generated_Image_raiq.png"
                  alt="Raiq Premium Kitchenware"
                  width={1200}
                  height={675}
                  className="object-cover w-full h-auto"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  priority
                />
              </div>
              
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl px-4 py-3 shadow-xl border border-stone-100">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span className="font-semibold text-stone-800">Qualité Premium</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-stone-50 border-y border-stone-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-amber-100 flex items-center justify-center mb-4">
                <Award className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-stone-800">{t.features.quality}</h3>
              <p className="text-sm text-stone-500 mt-1">{t.features.qualityDesc}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-amber-100 flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-stone-800">{t.features.warranty}</h3>
              <p className="text-sm text-stone-500 mt-1">{t.features.warrantyDesc}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-amber-100 flex items-center justify-center mb-4">
                <Truck className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-stone-800">{t.features.delivery}</h3>
              <p className="text-sm text-stone-500 mt-1">{t.features.deliveryDesc}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-amber-100 flex items-center justify-center mb-4">
                <Package className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-stone-800">{t.features.certified}</h3>
              <p className="text-sm text-stone-500 mt-1">{t.features.certifiedDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-stone-800">{t.categories}</h2>
                <p className="text-stone-500 mt-1">Explorez notre collection par catégorie</p>
              </div>
              <Link href="/boutique" className="text-primary hover:text-primary/80 flex items-center gap-1 font-medium">
                {t.viewAll}
                <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/boutique?category=${category.id}`}
                  className="group relative bg-gradient-to-br from-stone-50 to-amber-50/50 rounded-2xl p-6 border border-stone-200 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:bg-primary/10 transition-colors border border-stone-100">
                      <ChefHat className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-800 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-stone-500">
                        {category.product_count} {locale === 'ar' ? 'منتج' : 'produits'}
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={18} className={`absolute top-1/2 -translate-y-1/2 right-6 rtl:right-auto rtl:left-6 text-stone-300 group-hover:text-primary group-hover:translate-x-1 transition-all ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-b from-stone-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-stone-800">{t.featured}</h2>
              <p className="text-stone-500 mt-1">Nos produits les plus appréciés</p>
            </div>
            <Link href="/boutique" className="text-primary hover:text-primary/80 flex items-center gap-1 font-medium">
              {t.viewAll}
              <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-96 animate-pulse border border-stone-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <KitchenwareProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="gap-2 h-12 px-8 border-stone-300 hover:bg-stone-50">
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
