'use client'

import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import {
  ArrowRight,
  ChefHat,
  Shield,
  Truck,
  Award,
  Package,
  Coffee,
  Users,
  Home,
  LayoutGrid,
  Sparkles,
  Search,
  CheckCircle2,
  Globe
} from 'lucide-react'
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
import { cn } from '@/lib/utils'

const translations = {
  fr: {
    hero: {
      title: 'Ustensiles de Cuisine Premium',
      subtitle: 'La maison où la qualité rencontre le design. Pas les moins chers, mais les plus sincères.',
      cta: 'Découvrir la collection',
      seasonal: 'Préparez vos moments de fête (Ramadan, Aïd, Mariages)',
    },
    features: {
      quality: 'Qualité Premium',
      qualityDesc: 'Matériaux durables et design élégant',
      warranty: 'Garantie Étendue',
      warrantyDesc: 'Produits testés et certifiés',
      delivery: 'Livraison Rapide',
      deliveryDesc: 'Partout en Algérie',
      authentic: '100% Authentique',
      authenticDesc: 'Importations directes des marques',
    },
    sections: {
      categories: 'Nos Univers',
      categoriesDesc: 'Explorez nos collections par usage et besoin',
      featured: 'Produits Vedettes',
      brands: 'Nos Grandes Marques',
      viewAll: 'Voir tout',
      shopNow: 'Acheter maintenant',
    },
    universes: {
      homeChef: { title: 'Chef de Maison', desc: 'Cuisine Professionnelle' },
      family: { title: 'Réunion de Famille', desc: 'Cuisine Traditionnelle & Quotidienne' },
      prestige: { title: 'Réception & Prestige', desc: 'Service & Grandes Occasions' },
      coffee: { title: 'Coin Café', desc: 'Pour les passionnés de café' },
      organize: { title: 'Organisation & Solutions', desc: 'Cuisine & Salle de Bain' },
    }
  },
  ar: {
    hero: {
      title: 'أدوات مطبخ فاخرة',
      subtitle: 'حيث تلتقي الجودة بالتصميم. ليس الأرخص، بل الأصدق.',
      cta: 'اكتشف المجموعة',
      seasonal: 'استعد لمناسباتك المميزة (رمضان، عيد، أعراس)',
    },
    features: {
      quality: 'جودة عالية',
      qualityDesc: 'مواد متينة وتصميم أنيق',
      warranty: 'ضمان ممتد',
      warrantyDesc: 'منتجات مختبرة ومعتمدة',
      delivery: 'توصيل سريع',
      deliveryDesc: 'في جميع أنحاء الجزائر',
      authentic: 'أصلي 100%',
      authenticDesc: 'استيراد مباشر من العلامات التجارية',
    },
    sections: {
      categories: 'أقسامنا',
      categoriesDesc: 'اكتشف مجموعاتنا حسب الحاجة والاستخدام',
      featured: 'منتجات مميزة',
      brands: 'علاماتنا التجارية',
      viewAll: 'عرض الكل',
      shopNow: 'تسوق الآن',
    },
    universes: {
      homeChef: { title: 'شيف الدار', desc: 'الطهي الاحترافي' },
      family: { title: 'اللمة والعائلة', desc: 'الطهي التقليدي واليومي' },
      prestige: { title: 'الضيافة والبرستيج', desc: 'التقديم والمناسبات' },
      coffee: { title: 'ركن القهوة', desc: 'لعشاق القهوة' },
      organize: { title: 'تنظيم وحلول', desc: 'المطبخ والحمام' },
    }
  },
  en: {
    hero: {
      title: 'Premium Kitchenware',
      subtitle: 'Where quality meets design. Not the cheapest, but the most honest.',
      cta: 'Discover the collection',
      seasonal: 'Prepare for your special moments (Ramadan, Eid, Weddings)',
    },
    features: {
      quality: 'Premium Quality',
      qualityDesc: 'Durable materials and elegant design',
      warranty: 'Extended Warranty',
      warrantyDesc: 'Tested and certified products',
      delivery: 'Fast Delivery',
      deliveryDesc: 'Across Algeria',
      authentic: '100% Authentic',
      authenticDesc: 'Direct brand imports',
    },
    sections: {
      categories: 'Our Collections',
      categoriesDesc: 'Explore by usage and specific needs',
      featured: 'Featured Products',
      brands: 'Our Premium Brands',
      viewAll: 'View all',
      shopNow: 'Shop now',
    },
    universes: {
      homeChef: { title: 'Home Chef', desc: 'Professional Cooking' },
      family: { title: 'Family Gathering', desc: 'Traditional & Daily Cooking' },
      prestige: { title: 'Hosting & Prestige', desc: 'Service & Special Occasions' },
      coffee: { title: 'Coffee Corner', desc: 'For coffee enthusiasts' },
      organize: { title: 'Organize & Solve', desc: 'Kitchen & Bathroom' },
    }
  },
}

const BRANDS = [
  { name: 'Arcos', origin: 'Spain' },
  { name: 'Bialetti', origin: 'Italy' },
  { name: 'Pyrex', origin: 'France' },
  { name: 'Brabantia', origin: 'Netherlands' },
  { name: 'Flonal', origin: 'Italy' },
  { name: 'Guardini', origin: 'Italy' },
  { name: 'Borgonovo', origin: 'Italy' },
  { name: 'Arcoroc', origin: 'France' },
  { name: 'De Silva', origin: 'Italy' },
  { name: 'Marinex', origin: 'Brazil' },
  { name: 'Smart Cook', origin: 'Turkey' },
]

export default function KitchenwareHomePage({ locale, tenant }: HomePageProps) {
  const [featuredProducts, setFeaturedProducts] = useState<LocalizedProduct[]>([])
  const [categories, setCategories] = useState<LocalizedCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const t = translations[locale as keyof typeof translations] || translations.fr
  const isRTL = locale === 'ar'

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Fetch featured products
      const { data: products } = await supabase
        .from('products')
        .select(PRODUCT_WITH_TRANSLATIONS_SELECT)
        .eq('tenant_id', tenant.id)
        .eq('is_available', true)
        .eq('is_online', true)
        .order('created_at', { ascending: false })
        .limit(8)

      if (products) {
        setFeaturedProducts(localizeProducts(products as ProductWithTranslations[], locale))
      }

      // Fetch categories
      const { data: cats } = await supabase
        .from('categories')
        .select(CATEGORY_WITH_TRANSLATIONS_SELECT)
        .eq('tenant_id', tenant.id)

      if (cats) {
        setCategories(localizeCategories(cats as CategoryWithTranslations[], locale))
      }

      setIsLoading(false)
    }

    fetchData()
  }, [tenant.id, locale])

  const universeIcons = {
    'Home Chef': ChefHat,
    'Family Gathering': Users,
    'Hosting & Prestige': Sparkles,
    'Coffee Corner': Coffee,
    'Organize & Solve': LayoutGrid,
  }

  const mainUniverses = categories.filter(c => !c.parent_id)

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-stone-900">
        <div className="absolute inset-0 z-0">
          <Image
            src="/Gemini_Generated_Image_raiq.png"
            alt="Raiq Hero"
            fill
            className="object-cover opacity-50 transition-scale duration-10000 hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-md text-amber-500 px-4 py-2 rounded-full text-sm font-medium border border-amber-500/30">
              <Sparkles size={16} />
              {t.hero.seasonal}
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.1]">
              {t.hero.title}
            </h1>

            <p className="text-xl text-stone-300 max-w-xl leading-relaxed">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild size="lg" className="h-14 px-8 text-lg bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold border-none">
                <Link href="/boutique">
                  {t.hero.cta}
                  <ArrowRight size={20} className={cn("ml-2 rtl:mr-2 rtl:ml-0 rtl:rotate-180")} />
                </Link>
              </Button>
              <div className="flex -space-x-4 rtl:space-x-reverse items-center ps-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-stone-800 bg-stone-700 flex items-center justify-center overflow-hidden">
                    <Image src={`https://i.pravatar.cc/150?u=${i}`} alt="user" width={48} height={48} />
                  </div>
                ))}
                <div className="ps-6">
                  <p className="text-white font-bold">+2.5k</p>
                  <p className="text-stone-400 text-xs">Clients Satisfaits</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Trust Indicators */}
        <div className="absolute bottom-10 right-0 left-0 hidden lg:block">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-4 gap-8">
              {['quality', 'warranty', 'delivery', 'authentic'].map((feature) => (
                <div key={feature} className="flex items-center gap-4 text-white/90 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                    {feature === 'quality' && <Award size={20} />}
                    {feature === 'warranty' && <Shield size={20} />}
                    {feature === 'delivery' && <Truck size={20} />}
                    {feature === 'authentic' && <CheckCircle2 size={20} />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{t.features[feature as keyof typeof t.features]}</h4>
                    <p className="text-xs text-stone-400">{t.features[`${feature}Desc` as keyof typeof t.features]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Universes / Categories Navigation */}
      <section className="py-24 bg-stone-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mb-16 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-900">{t.sections.categories}</h2>
            <p className="text-stone-500 text-lg">{t.sections.categoriesDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {mainUniverses.map((category) => {
              const Icon = universeIcons[category.name as keyof typeof universeIcons] || LayoutGrid
              return (
                <Link
                  key={category.id}
                  href={`/boutique?category=${category.id}`}
                  className="group relative h-72 rounded-3xl overflow-hidden bg-white border border-stone-200 shadow-sm hover:shadow-2xl hover:border-amber-500/50 transition-all duration-500"
                >
                  <div className="p-8 h-full flex flex-col justify-between relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-amber-500 group-hover:text-stone-900 transition-all duration-500 transform group-hover:rotate-12">
                      <Icon size={28} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-stone-900 group-hover:text-amber-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
                        {category.description || "Découvrez notre sélection exclusive."}
                      </p>
                    </div>
                  </div>
                  {/* Decorative background circle */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-stone-50 rounded-full group-hover:bg-amber-50 group-hover:scale-150 transition-all duration-700" />
                  <ArrowRight className="absolute bottom-8 right-8 rtl:left-8 rtl:right-auto text-stone-300 group-hover:text-amber-500 group-hover:translate-x-2 rtl:group-hover:-translate-x-2 transition-all duration-500" size={24} />
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-16">
            <div className="max-w-xl space-y-4 text-center mx-auto">
              <div className="inline-block px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-bold uppercase tracking-wider mb-2">
                Nouveautés
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-stone-900">{t.sections.featured}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <KitchenwareProductCard
                key={product.id}
                product={product}
                locale={locale}
                className="animate-in fade-in zoom-in duration-500"
              />
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button asChild size="lg" variant="outline" className="border-stone-200 h-14 px-10 rounded-full hover:bg-stone-50">
              <Link href="/boutique">
                {t.sections.shopNow}
                <ArrowRight className="ml-2 rtl:mr-2 rtl:rotate-180" size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-24 bg-stone-900 text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold">{t.sections.brands}</h2>
            <div className="flex items-center justify-center gap-2 text-stone-400 text-sm">
              <Globe size={14} />
              <span>Importations sélectionnées d'Europe et du Monde</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-12 grayscale opacity-50 hover:opacity-100 transition-opacity">
            {BRANDS.map((brand) => (
              <div key={brand.name} className="flex flex-col items-center gap-2 group cursor-pointer">
                <span className="text-2xl lg:text-3xl font-black tracking-tighter text-white group-hover:text-amber-500 transition-colors uppercase">
                  {brand.name}
                </span>
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-[0.2em] group-hover:text-stone-300 transition-colors">
                  {brand.origin}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Authenticity Banner */}
      <section className="py-20 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-[3rem] p-12 lg:p-20 shadow-xl shadow-amber-900/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
              <div className="w-32 h-32 lg:w-48 lg:h-48 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <Award size={64} className="text-amber-500" />
              </div>
              <div className="space-y-6 flex-1 text-center lg:text-start">
                <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 leading-tight">
                  <span className="text-amber-500">Garantie d'Authenticité.</span> Chaque produit "Raiq" raconte une histoire de vérité.
                </h2>
                <div className="grid sm:grid-cols-2 gap-4 text-stone-600">
                  {[
                    "Directement de l'usine à votre cuisine",
                    "Certificats d'origine disponibles",
                    "Garantie constructeur complète",
                    "Pas de contrefaçons, jamais"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 justify-center lg:justify-start">
                      <CheckCircle2 size={18} className="text-green-500" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

