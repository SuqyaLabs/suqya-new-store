'use client'

import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart-store'
import type { ProductCardProps } from '@/components/registry'

export default function ClothingProductCard({
  product,
  locale = 'fr',
  className,
  onAddToCart
}: ProductCardProps) {
  const { addItem } = useCartStore()
  // Product name is already localized from the parent component
  const name = product.name
  const customData = product.custom_data as {
    material?: string
    gender?: string
    season?: string
    fit?: string
    available_sizes?: string[]
    available_colors?: string[]
  } | undefined

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

  return (
    <article className={`group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ${className || ''}`}>
      <Link href={productUrl} className="block">
        <div className="relative aspect-[3/4] bg-muted overflow-hidden">
          {product.images?.[0] ? (
            <>
              {/* Primary image */}
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
              {/* Secondary image on hover (desktop only) */}
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
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-muted to-muted/80">
              <span className="text-6xl">👕</span>
            </div>
          )}

          {/* Sale badge */}
          {product.compare_at_price && product.compare_at_price > product.price && (
            <div className="absolute top-3 left-3">
              <Badge variant="destructive" className="text-xs">
                -{Math.round((1 - product.price / product.compare_at_price) * 100)}%
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
          {/* Material */}
          {customData?.material && (
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              {customData.material}
            </p>
          )}

          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-10">
            {name}
          </h3>

          {/* Available sizes */}
          {customData?.available_sizes && customData.available_sizes.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {customData.available_sizes.map((size) => (
                <span key={size} className="text-xs px-1.5 py-0.5 border border-border rounded text-foreground">
                  {size}
                </span>
              ))}
            </div>
          )}

          {/* Color swatches */}
          {customData?.available_colors && customData.available_colors.length > 0 && (
            <div className="flex gap-1 mt-2">
              {customData.available_colors.slice(0, 4).map((color) => (
                <div
                  key={color}
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              {customData.available_colors.length > 4 && (
                <span className="text-xs text-muted-foreground">
                  +{customData.available_colors.length - 4}
                </span>
              )}
            </div>
          )}

          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </p>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <p className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compare_at_price)}
              </p>
            )}
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
