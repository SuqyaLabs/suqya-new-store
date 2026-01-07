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
}

const materialLabels: Record<string, { fr: string; ar: string; en: string }> = {
  ceramic: { fr: 'Céramique', ar: 'سيراميك', en: 'Ceramic' },
  wood: { fr: 'Bois', ar: 'خشب', en: 'Wood' },
  stainless_steel: { fr: 'Inox', ar: 'ستانلس', en: 'Steel' },
  glass: { fr: 'Verre', ar: 'زجاج', en: 'Glass' },
  bamboo: { fr: 'Bambou', ar: 'خيزران', en: 'Bamboo' },
  silicone: { fr: 'Silicone', ar: 'سيليكون', en: 'Silicone' },
  cast_iron: { fr: 'Fonte', ar: 'حديد زهر', en: 'Cast Iron' },
  copper: { fr: 'Cuivre', ar: 'نحاس', en: 'Copper' },
}

export default function KitchenwareProductCard({
  product,
  locale = 'fr',
  className,
  onAddToCart
}: ProductCardProps) {
  const { addItem } = useCartStore()
  const name = locale === 'ar' && product.name_ar ? product.name_ar : product.name
  const customData = product.custom_data as KitchenwareCustomData | undefined

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id,
      name,
      price: product.price,
      image: product.images?.[0],
      short_description: product.description
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
    safetyBadges.push({ icon: Droplets, label: locale === 'ar' ? 'غسالة' : 'Lave-v.' })
  }
  if (customData?.is_microwave_safe) {
    safetyBadges.push({ icon: Flame, label: locale === 'ar' ? 'ميكرو' : 'Micro' })
  }
  if (customData?.is_oven_safe) {
    safetyBadges.push({ icon: Flame, label: locale === 'ar' ? 'فرن' : 'Four' })
  }

  return (
    <article className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 hover:border-primary/30 ${className || ''}`}>
      <Link href={productUrl} className="block">
        <div className="relative aspect-square bg-gradient-to-br from-stone-50 to-amber-50/30 overflow-hidden">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Package className="w-16 h-16 text-stone-300" />
            </div>
          )}

          {/* Sale badge */}
          {product.compare_at_price && product.compare_at_price > product.price && (
            <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
              <Badge className="bg-red-500 text-white text-xs font-semibold px-2.5 py-1">
                -{Math.round((1 - product.price / product.compare_at_price) * 100)}%
              </Badge>
            </div>
          )}

          {/* Material badge */}
          {customData?.material && (
            <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3">
              <Badge variant="secondary" className="text-xs bg-white/95 backdrop-blur-sm text-stone-700 border border-stone-200">
                {getMaterialLabel(customData.material)}
              </Badge>
            </div>
          )}

          {!product.is_available && (
            <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-medium px-4 py-2 bg-stone-900/80 rounded-lg text-sm">
                {locale === 'ar' ? 'غير متوفر' : 'Rupture de stock'}
              </span>
            </div>
          )}
          
          {/* Quick add overlay */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              onClick={handleAddToCart}
              disabled={!product.is_available}
              className="w-full gap-2 bg-white hover:bg-stone-50 text-stone-800 font-medium shadow-lg"
              size="sm"
            >
              <ShoppingCart size={16} />
              {locale === 'ar' ? 'أضف للسلة' : 'Ajouter'}
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <h3 className="font-medium text-stone-800 group-hover:text-primary transition-colors line-clamp-2 min-h-10 text-sm leading-tight">
            {name}
          </h3>

          {/* Safety & Features Row */}
          {(safetyBadges.length > 0 || customData?.capacity_ml) && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {safetyBadges.map((badge, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center gap-1 text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full"
                >
                  <badge.icon size={10} />
                  {badge.label}
                </span>
              ))}
              {customData?.capacity_ml && (
                <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                  {customData.capacity_ml}ml
                </span>
              )}
            </div>
          )}

          {/* Warranty */}
          {customData?.warranty_months && customData.warranty_months > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
              <Shield size={12} />
              {locale === 'ar' 
                ? `ضمان ${customData.warranty_months} شهر`
                : `Garantie ${customData.warranty_months} mois`}
            </div>
          )}

          <div className="flex items-baseline gap-2 pt-1">
            <p className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </p>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <p className="text-sm text-stone-400 line-through">
                {formatPrice(product.compare_at_price)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
