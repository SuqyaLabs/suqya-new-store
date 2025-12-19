'use client'

import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { ShoppingCart, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart-store'
import type { ProductCardProps } from '@/components/registry'

export default function NutritionProductCard({
  product,
  locale = 'fr',
  className,
  onAddToCart
}: ProductCardProps) {
  const { addItem } = useCartStore()
  const name = locale === 'ar' && product.name_ar ? product.name_ar : product.name
  const customData = product.custom_data as {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
    meal_type?: string
    dietary_tags?: string[]
  } | undefined

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

  const mealTypeLabels: Record<string, { fr: string; ar: string }> = {
    breakfast: { fr: 'Petit-déjeuner', ar: 'فطور' },
    lunch: { fr: 'Déjeuner', ar: 'غداء' },
    dinner: { fr: 'Dîner', ar: 'عشاء' },
    snack: { fr: 'Collation', ar: 'وجبة خفيفة' }
  }

  return (
    <article className={`group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ${className || ''}`}>
      <Link href={productUrl} className="block">
        <div className="relative aspect-square bg-muted overflow-hidden">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-green-100 to-green-200">
              <span className="text-6xl">🥗</span>
            </div>
          )}

          {/* Meal type badge */}
          {customData?.meal_type && (
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="text-xs">
                {locale === 'ar' 
                  ? mealTypeLabels[customData.meal_type]?.ar 
                  : mealTypeLabels[customData.meal_type]?.fr}
              </Badge>
            </div>
          )}

          {/* Dietary tags */}
          {customData?.dietary_tags && customData.dietary_tags.length > 0 && (
            <div className="absolute top-3 right-3 flex flex-col gap-1">
              {customData.dietary_tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs bg-white/90">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {!product.is_available && (
            <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
              <span className="text-background font-semibold px-4 py-2 bg-foreground/80 rounded-lg">
                {locale === 'ar' ? 'غير متوفر' : 'Rupture de stock'}
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-10">
            {name}
          </h3>

          {/* Nutrition info */}
          {customData?.calories && (
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Flame size={12} className="text-orange-500" />
                {customData.calories} kcal
              </span>
              {customData.protein && (
                <span>P: {customData.protein}g</span>
              )}
              {customData.carbs && (
                <span>C: {customData.carbs}g</span>
              )}
              {customData.fat && (
                <span>F: {customData.fat}g</span>
              )}
            </div>
          )}

          <div className="mt-3">
            <p className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <Button
          onClick={handleAddToCart}
          disabled={!product.is_available}
          className="w-full gap-2"
          size="sm"
        >
          <ShoppingCart size={16} />
          {locale === 'ar' ? 'أضف للسلة' : 'Ajouter au panier'}
        </Button>
      </div>
    </article>
  )
}
