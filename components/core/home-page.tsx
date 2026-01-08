'use client'

import { Link } from '@/i18n/routing'
import { useEffect, useState } from 'react'
import { ArrowRight, ShoppingBag, Truck, Shield, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import type { HomePageProps } from '@/components/registry'
import { ProductCard } from '@/components/product/product-card'
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
      title: 'Bienvenue dans notre boutique',
      subtitle: 'Découvrez notre sélection de produits de qualité',
      cta: 'Découvrir',
    },
    features: {
      quality: 'Qualité Garantie',
      qualityDesc: 'Produits sélectionnés avec soin',
      delivery: 'Livraison Rapide',
      deliveryDesc: 'Partout en Algérie',
      secure: 'Paiement Sécurisé',
      secureDesc: 'Transactions protégées',
      support: 'Support Client',
      supportDesc: 'À votre écoute',
    },
    categories: 'Nos Catégories',
    featured: 'Produits Populaires',
    viewAll: 'Voir tout',
    shopNow: 'Acheter maintenant',
  },
  ar: {
    hero: {
      title: 'مرحباً بكم في متجرنا',
      subtitle: 'اكتشف مجموعتنا من المنتجات عالية الجودة',
      cta: 'اكتشف',
    },
    features: {
      quality: 'جودة مضمونة',
      qualityDesc: 'منتجات مختارة بعناية',
      delivery: 'توصيل سريع',
      deliveryDesc: 'في جميع أنحاء الجزائر',
      secure: 'دفع آمن',
      secureDesc: 'معاملات محمية',
      support: 'دعم العملاء',
      supportDesc: 'نستمع إليكم',
    },
    categories: 'فئاتنا',
    featured: 'منتجات مميزة',
    viewAll: 'عرض الكل',
    shopNow: 'تسوق الآن',
  },
  en: {
    hero: {
      title: 'Welcome to our store',
      subtitle: 'Discover our selection of quality products',
      cta: 'Discover',
    },
    features: {
      quality: 'Quality Guaranteed',
      qualityDesc: 'Carefully selected products',
      delivery: 'Fast Delivery',
      deliveryDesc: 'Across Algeria',
      secure: 'Secure Payment',
      secureDesc: 'Protected transactions',
      support: 'Customer Support',
      supportDesc: 'We listen to you',
    },
    categories: 'Our Categories',
    featured: 'Popular Products',
    viewAll: 'View all',
    shopNow: 'Shop now',
  },
}

export default function DefaultHomePage({ locale, tenant }: HomePageProps) {
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
      const { data: products } = await supabase
        .from('products')
        .select(PRODUCT_WITH_TRANSLATIONS_SELECT)
        .eq('tenant_id', tenant.id)
        .eq('is_available', true)
        .eq('is_online', true)
        .order('created_at', { ascending: false })
        .limit(8)

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
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-primary/5 via-background to-secondary/10 py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6">
            {heroTitle}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {heroSubtitle}
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link href="/boutique">
              {t.hero.cta}
              <ArrowRight size={18} className={isRTL ? 'rotate-180' : ''} />
            </Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{t.features.quality}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t.features.qualityDesc}</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{t.features.delivery}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t.features.deliveryDesc}</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{t.features.secure}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t.features.secureDesc}</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{t.features.support}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t.features.supportDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">{t.categories}</h2>
              <Link href="/boutique" className="text-primary hover:underline flex items-center gap-1">
                {t.viewAll}
                <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/boutique?category=${category.id}`}
                  className="group bg-card rounded-xl p-6 border border-border hover:border-primary/50 hover:shadow-lg transition-all text-center"
                >
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.product_count} {locale === 'ar' ? 'منتج' : 'produits'}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">{t.featured}</h2>
            <Link href="/boutique" className="text-primary hover:underline flex items-center gap-1">
              {t.viewAll}
              <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.images?.[0]}
                  short_description={product.short_description || undefined}
                  isAvailable={product.is_available ?? true}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Button asChild size="lg" variant="outline" className="gap-2">
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
