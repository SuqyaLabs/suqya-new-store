'use client'

import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { ShoppingCart, Leaf, Droplets, Mountain, Award, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart-store'
import type { ProductCardProps } from '@/components/registry'

interface HoneyCustomData {
  honey_type?: string
  origin?: string
  weight_grams?: number
  harvest_date?: string
  is_organic?: boolean
  is_raw?: boolean
  flavor_profile?: string
  color?: string
  texture?: string
  pollen_source?: string
  altitude_meters?: number
  region?: string
}

const honeyTypeLabels: Record<string, { fr: string; ar: string; en: string }> = {
  jujubier: { fr: 'Jujubier', ar: 'سدر', en: 'Jujube' },
  eucalyptus: { fr: 'Eucalyptus', ar: 'كاليبتوس', en: 'Eucalyptus' },
  montagne: { fr: 'Montagne', ar: 'جبلي', en: 'Mountain' },
  fleurs: { fr: 'Mille Fleurs', ar: 'ألف زهرة', en: 'Wildflower' },
  thym: { fr: 'Thym', ar: 'زعتر', en: 'Thyme' },
  oranger: { fr: 'Oranger', ar: 'زهر البرتقال', en: 'Orange Blossom' },
  lavande: { fr: 'Lavande', ar: 'خزامى', en: 'Lavender' },
  acacia: { fr: 'Acacia', ar: 'أكاسيا', en: 'Acacia' },
  romarin: { fr: 'Romarin', ar: 'إكليل الجبل', en: 'Rosemary' },
  caroubier: { fr: 'Caroubier', ar: 'خروب', en: 'Carob' },
}

export default function HoneyProductCard({
  product,
  locale = 'fr',
  className,
  onAddToCart
}: ProductCardProps) {
  const { addItem } = useCartStore()
  const name = product.name
  const customData = product.custom_data as HoneyCustomData | undefined

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

  const getHoneyTypeLabel = (type: string) => {
    const labels = honeyTypeLabels[type]
    if (!labels) return type
    return locale === 'ar' ? labels.ar : locale === 'en' ? labels.en : labels.fr
  }

  const badges = []
  if (customData?.is_organic) {
    badges.push({ icon: Leaf, label: locale === 'ar' ? 'عضوي' : 'Bio', color: 'bg-green-100 text-green-700' })
  }
  if (customData?.is_raw) {
    badges.push({ icon: Droplets, label: locale === 'ar' ? 'خام' : 'Cru', color: 'bg-amber-100 text-amber-700' })
  }

  return (
    <article className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-amber-100 hover:border-amber-300 ${className || ''}`}>
      <Link href={productUrl} className="block">
        <div className="relative aspect-square bg-gradient-to-br from-amber-50 to-yellow-50 overflow-hidden">
          {product.images?.[0] ? (
            <>
              <Image
                src={product.images[0]}
                alt={name}
                fill
                className={`object-cover transition-all duration-500 ${
                  product.images[1] 
                    ? 'md:group-hover:opacity-0 md:group-hover:scale-105' 
                    : 'group-hover:scale-105'
                }`}
              />
              {product.images[1] && (
                <Image
                  src={product.images[1]}
                  alt={`${name} - 2`}
                  fill
                  className="object-cover opacity-0 scale-105 transition-all duration-500 md:group-hover:opacity-100 md:group-hover:scale-100"
                />
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <Droplets className="w-16 h-16 text-amber-300" />
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

          {/* Honey type badge */}
          {customData?.honey_type && (
            <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3">
              <Badge variant="secondary" className="text-xs bg-amber-100/95 backdrop-blur-sm text-amber-800 border border-amber-200">
                {getHoneyTypeLabel(customData.honey_type)}
              </Badge>
            </div>
          )}

          {!product.is_available && (
            <div className="absolute inset-0 bg-amber-900/60 flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-medium px-4 py-2 bg-amber-900/80 rounded-lg text-sm">
                {locale === 'ar' ? 'غير متوفر' : 'Rupture de stock'}
              </span>
            </div>
          )}
          
          {/* Quick add overlay */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-amber-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              onClick={handleAddToCart}
              disabled={!product.is_available}
              className="w-full gap-2 bg-white hover:bg-amber-50 text-amber-800 font-medium shadow-lg"
              size="sm"
            >
              <ShoppingCart size={16} />
              {locale === 'ar' ? 'أضف للسلة' : 'Ajouter'}
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <h3 className="font-medium text-amber-900 group-hover:text-amber-700 transition-colors line-clamp-2 min-h-10 text-sm leading-tight">
            {name}
          </h3>

          {/* Badges Row */}
          {(badges.length > 0 || customData?.weight_grams || customData?.region) && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {badges.map((badge, idx) => (
                <span 
                  key={idx} 
                  className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${badge.color}`}
                >
                  <badge.icon size={10} />
                  {badge.label}
                </span>
              ))}
              {customData?.weight_grams && (
                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {customData.weight_grams}g
                </span>
              )}
            </div>
          )}

          {/* Origin/Region */}
          {customData?.region && (
            <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
              <Mountain size={12} />
              {customData.region}
            </div>
          )}

          <div className="flex items-baseline gap-2 pt-1">
            <p className="text-lg font-bold text-amber-600">
              {formatPrice(product.price)}
            </p>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <p className="text-sm text-amber-400 line-through">
                {formatPrice(product.compare_at_price)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
