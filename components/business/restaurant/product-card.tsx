'use client'

import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { ShoppingCart, Clock, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart-store'
import type { ProductCardProps } from '@/components/registry'

export default function RestaurantProductCard({
  product,
  locale = 'fr',
  className,
  onAddToCart
}: ProductCardProps) {
  const { addItem } = useCartStore()
  const name = locale === 'ar' && product.name_ar ? product.name_ar : product.name
  const customData = product.custom_data as {
    prep_time_minutes?: number
    spicy_level?: string
    allergens?: string[]
    printer_dest?: string
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

  const spicyIcons: Record<string, string> = {
    none: '',
    mild: '🌶️',
    medium: '🌶️🌶️',
    hot: '🌶️🌶️🌶️'
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
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/10 to-primary/20">
              <span className="text-6xl">🍽️</span>
            </div>
          )}

          {/* Spicy indicator */}
          {customData?.spicy_level && customData.spicy_level !== 'none' && (
            <div className="absolute top-3 left-3">
              <Badge variant="destructive" className="text-xs">
                {spicyIcons[customData.spicy_level]}
              </Badge>
            </div>
          )}

          {/* Prep time */}
          {customData?.prep_time_minutes && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="text-xs flex items-center gap-1">
                <Clock size={10} />
                {customData.prep_time_minutes} min
              </Badge>
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

          {/* Allergens warning */}
          {customData?.allergens && customData.allergens.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {customData.allergens.slice(0, 3).map((allergen) => (
                <span key={allergen} className="text-xs px-1.5 py-0.5 bg-accent text-accent-foreground rounded">
                  {allergen}
                </span>
              ))}
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
