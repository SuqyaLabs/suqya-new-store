'use client'

import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { ShoppingCart, Cpu, Check, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart-store'
import type { ProductCardProps } from '@/components/registry'

interface ElectronicsCustomData {
  brand?: string
  model?: string
  warranty_months?: number
  connectivity?: string[]
  interface_type?: string
  resolution?: string
  print_speed?: string
  compatibility?: string[]
  power_supply?: string
  dimensions?: string
  weight_kg?: number
}

const translations = {
  fr: {
    addToCart: 'Ajouter',
    inStock: 'En Stock',
    outOfStock: 'Rupture',
    warranty: 'Garantie',
    months: 'mois',
    new: 'Nouveau'
  },
  ar: {
    addToCart: 'إضافة',
    inStock: 'متوفر',
    outOfStock: 'نفذ',
    warranty: 'ضمان',
    months: 'شهر',
    new: 'جديد'
  },
  en: {
    addToCart: 'Add',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    warranty: 'Warranty',
    months: 'months',
    new: 'New'
  }
}

export default function ElectronicsProductCard({
  product,
  locale = 'fr',
  className,
  onAddToCart
}: ProductCardProps) {
  const { addItem } = useCartStore()
  const t = translations[locale as keyof typeof translations] || translations.fr
  
  // Product name is already localized from the parent component
  const name = product.name
  const customData = product.custom_data as ElectronicsCustomData | undefined

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (product.is_available !== false) {
      addItem({
        id: product.id,
        name,
        price: product.price,
        image: product.images?.[0],
        short_description: product.short_description || undefined
      })
      onAddToCart?.()
    }
  }

  return (
    <Link
      href={`/boutique/produit/${product.id}`}
      className={`group block bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 ${className || ''}`}
    >
      {/* Product Image */}
      <div className="aspect-square relative bg-slate-100 overflow-hidden">
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
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <Cpu className="w-16 h-16 text-slate-300" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {/* Stock badge */}
          <Badge className={product.is_available !== false
            ? "bg-emerald-500/90 text-white border-0" 
            : "bg-red-500/90 text-white border-0"
          }>
            <Check size={12} className="mr-1" />
            {product.is_available !== false ? t.inStock : t.outOfStock}
          </Badge>
          
          {/* Warranty badge */}
          {customData?.warranty_months && (
            <Badge className="bg-cyan-600 text-white border-0">
              <Zap size={12} className="mr-1" />
              {customData.warranty_months} {t.months}
            </Badge>
          )}
        </div>

        {/* Brand badge */}
        {customData?.brand && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90 text-slate-700 border border-slate-200 backdrop-blur-sm">
              {customData.brand}
            </Badge>
          </div>
        )}

        {/* Quick add button on hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-white/95 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            size="sm" 
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold gap-2"
            onClick={handleAddToCart}
            disabled={product.is_available === false}
          >
            <ShoppingCart size={16} />
            {t.addToCart}
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Model number */}
        {customData?.model && (
          <p className="text-xs text-cyan-600 font-mono uppercase tracking-wide">
            {customData.model}
          </p>
        )}
        
        <h3 className="font-semibold text-slate-800 group-hover:text-cyan-600 transition-colors line-clamp-2 min-h-10">
          {name}
        </h3>
        
        {/* Specs preview */}
        {(customData?.interface_type || customData?.connectivity) && (
          <div className="flex flex-wrap gap-1">
            {customData.interface_type && (
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                {customData.interface_type}
              </span>
            )}
            {customData.connectivity?.slice(0, 2).map((conn) => (
              <span key={conn} className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                {conn}
              </span>
            ))}
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <div>
            <span className="text-xl font-bold text-cyan-600">
              {formatPrice(product.price)}
            </span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="ml-2 text-sm text-slate-400 line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
