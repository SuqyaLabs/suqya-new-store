'use client'

import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { ShoppingCart, Shield, Droplets, Flame, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart-store'
import type { ProductCardProps } from '@/components/registry'

interface KitchenwareCustomData {
  material?: string
  dimensions?: string
  weight_grams?: number
  warranty_months?: number
  care_instructions?: string
  is_dishwasher_safe?: boolean
  is_microwave_safe?: boolean
  is_oven_safe?: boolean
  capacity_ml?: number
  country_of_origin?: string
  authenticity_guaranteed?: boolean
}

const materialLabels: Record<string, { fr: string; ar: string; en: string }> = {
  ceramic: { fr: 'Céramique', ar: 'سيراميك', en: 'Ceramic' },
  pottery: { fr: 'Poterie', ar: 'فخار', en: 'Pottery' },
  clay: { fr: 'Argile', ar: 'طين', en: 'Clay' },
  aluminum: { fr: 'Aluminium', ar: 'ألومنيوم', en: 'Aluminum' },
  wood: { fr: 'Bois', ar: 'خشب', en: 'Wood' },
  stainless_steel: { fr: 'Inox', ar: 'ستانلس ستيل', en: 'Stainless Steel' },
  glass: { fr: 'Verre', ar: 'زجاج', en: 'Glass' },
  bamboo: { fr: 'Bambou', ar: 'خيزران', en: 'Bamboo' },
  silicone: { fr: 'Silicone', ar: 'سيليكون', en: 'Silicone' },
  cast_iron: { fr: 'Fonte', ar: 'حديد زهر', en: 'Cast Iron' },
  copper: { fr: 'Cuivre', ar: 'نحاس', en: 'Copper' },
}

const originFlags: Record<string, string> = {
  'Italy': '🇮🇹',
  'France': '🇫🇷',
  'Spain': '🇪🇸',
  'Turkey': '🇹🇷',
  'Algeria': '🇩🇿',
  'Brazil': '🇧🇷',
  'Vietnam': '🇻🇳',
  'Germany': '🇩🇪',
}

export default function KitchenwareProductCard({
  product,
  locale = 'fr',
  className,
  onAddToCart
}: ProductCardProps) {
  const { addItem } = useCartStore()
  const name = product.name
  const customData = product.custom_data as KitchenwareCustomData | undefined

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id,
      name,
      price: product.price,
      image: product.images?.[0],
      short_description: product.short_description || undefined
    })
    onAddToCart?.()
  }

  const productUrl = `/boutique/produit/${product.id}`

  const getMaterialLabel = (material: string) => {
    const labels = materialLabels[material]
    if (!labels) return material
    return locale === 'ar' ? labels.ar : locale === 'en' ? labels.en : labels.fr
  }

  const safetyBadges = []
  if (customData?.is_dishwasher_safe) {
    safetyBadges.push({ icon: Droplets, label: locale === 'ar' ? 'غسالة' : 'Dish-w.' })
  }
  if (customData?.is_microwave_safe) {
    safetyBadges.push({ icon: Flame, label: locale === 'ar' ? 'ميكرو' : 'Micro' })
  }
  if (customData?.is_oven_safe) {
    safetyBadges.push({ icon: Flame, label: locale === 'ar' ? 'فرن' : 'Oven' })
  }

  return (
    <article className={`group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-stone-100 hover:border-amber-500/30 ${className || ''}`}>
      <Link href={productUrl} className="block">
        <div className="relative aspect-[4/5] bg-stone-50 overflow-hidden">
          {product.images?.[0] ? (
            <>
              <Image
                src={product.images[0]}
                alt={name}
                fill
                className={`object-cover transition-all duration-700 ${product.images[1]
                    ? 'md:group-hover:opacity-0 md:group-hover:scale-110'
                    : 'group-hover:scale-110'
                  }`}
              />
              {product.images[1] && (
                <Image
                  src={product.images[1]}
                  alt={`${name} - 2`}
                  fill
                  className="object-cover opacity-0 scale-110 transition-all duration-700 md:group-hover:opacity-100 md:group-hover:scale-100"
                />
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <Package className="w-16 h-16 text-stone-200" />
            </div>
          )}

          {/* Top Overlays */}
          <div className="absolute top-4 inset-x-4 flex justify-between items-start">
            <div className="flex flex-col gap-2">
              {product.compare_at_price && product.compare_at_price > product.price && (
                <Badge className="bg-red-500 text-white border-none text-[10px] font-bold px-2 py-0.5 rounded-full">
                  -{Math.round((1 - product.price / product.compare_at_price) * 100)}%
                </Badge>
              )}
              {product.brand && (
                <Badge variant="outline" className="bg-black/80 backdrop-blur-md text-white border-none text-[10px] font-medium px-2 py-0.5 rounded-full">
                  {product.brand}
                </Badge>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              {customData?.country_of_origin && (
                <Badge variant="secondary" className="bg-white/90 backdrop-blur-md text-stone-800 border-none text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <span className="text-sm">{originFlags[customData.country_of_origin] || '🌍'}</span>
                  {customData.country_of_origin}
                </Badge>
              )}
            </div>
          </div>

          {!product.is_available && (
            <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center backdrop-blur-[2px]">
              <span className="text-white font-bold px-6 py-2 bg-stone-900 rounded-full text-xs uppercase tracking-widest">
                {locale === 'ar' ? 'نفذت الكمية' : 'Épuisé'}
              </span>
            </div>
          )}

          {/* Action Overlay */}
          <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <Button
              onClick={handleAddToCart}
              disabled={!product.is_available}
              className="w-full h-11 gap-2 bg-white hover:bg-amber-500 text-stone-900 font-bold shadow-xl border-none transition-colors"
              size="sm"
            >
              <ShoppingCart size={18} />
              {locale === 'ar' ? 'أضف للسلة' : 'Ajouter'}
            </Button>
          </div>
        </div>

        <div className="p-5 space-y-3">
          <div className="space-y-1">
            <h3 className="font-bold text-stone-900 group-hover:text-amber-600 transition-colors line-clamp-2 min-h-[2.5rem] text-sm leading-snug">
              {name}
            </h3>
            {customData?.material && (
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                {getMaterialLabel(customData.material)}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col">
              <span className="text-lg font-black text-stone-900">
                {formatPrice(product.price)}
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-xs text-stone-400 line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
            </div>

            {customData?.warranty_months && customData.warranty_months > 0 && (
              <div className="flex items-center gap-1 text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                <Shield size={10} />
                {customData.warranty_months}M
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}

