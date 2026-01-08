'use client'

import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { ShoppingCart, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart-store'
import type { ProductCardProps } from '@/components/registry'

export default function RetailProductCard({
  product,
  locale = 'fr',
  className,
  onAddToCart
}: ProductCardProps) {
  const { addItem } = useCartStore()
  // Product name is already localized from the parent component
  const name = product.name
  const customData = product.custom_data as {
    brand?: string
    manufacturer?: string
    warranty_months?: number
    origin_country?: string
    sku?: string
    stock_quantity?: number
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
              <span className="text-6xl">📦</span>
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

          {/* Stock indicator */}
          {customData?.stock_quantity !== undefined && customData.stock_quantity <= 5 && customData.stock_quantity > 0 && (
            <div className="absolute top-3 right-3">
              <Badge variant="warning" className="text-xs">
                {locale === 'ar' ? `${customData.stock_quantity} متبقي` : `${customData.stock_quantity} restant`}
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
          {/* Brand */}
          {customData?.brand && (
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              {customData.brand}
            </p>
          )}

          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-10">
            {name}
          </h3>

          {/* Warranty */}
          {customData?.warranty_months && (
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <Package size={12} />
              {locale === 'ar' 
                ? `ضمان ${customData.warranty_months} شهر`
                : `Garantie ${customData.warranty_months} mois`}
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
