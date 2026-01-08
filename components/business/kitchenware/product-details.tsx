'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ShoppingCart, Shield, Droplets, Flame, Package, Check, X, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart-store'
import type { ProductDetailsProps } from '@/components/registry'

interface KitchenwareCustomData {
  material?: string
  dimensions?: string
  weight_grams?: number
  warranty_months?: number
  care_instructions?: string
  is_dishwasher_safe?: boolean
  is_microwave_safe?: boolean
  is_oven_safe?: boolean
  max_temperature?: number
  capacity_ml?: number
  country_of_origin?: string
}

const materialLabels: Record<string, { fr: string; ar: string; en: string }> = {
  ceramic: { fr: 'Céramique', ar: 'سيراميك', en: 'Ceramic' },
  wood: { fr: 'Bois', ar: 'خشب', en: 'Wood' },
  stainless_steel: { fr: 'Acier inoxydable', ar: 'ستانلس ستيل', en: 'Stainless Steel' },
  glass: { fr: 'Verre', ar: 'زجاج', en: 'Glass' },
  bamboo: { fr: 'Bambou', ar: 'خيزران', en: 'Bamboo' },
  silicone: { fr: 'Silicone', ar: 'سيليكون', en: 'Silicone' },
  cast_iron: { fr: 'Fonte', ar: 'حديد زهر', en: 'Cast Iron' },
  copper: { fr: 'Cuivre', ar: 'نحاس', en: 'Copper' },
}

const translations = {
  fr: {
    addToCart: 'Ajouter au panier',
    outOfStock: 'Rupture de stock',
    specifications: 'Caractéristiques',
    material: 'Matériau',
    dimensions: 'Dimensions',
    weight: 'Poids',
    capacity: 'Capacité',
    warranty: 'Garantie',
    months: 'mois',
    origin: 'Origine',
    careInstructions: 'Entretien',
    safetyFeatures: 'Compatibilité',
    dishwasherSafe: 'Lave-vaisselle',
    microwaveSafe: 'Micro-ondes',
    ovenSafe: 'Four',
    maxTemp: 'Température max',
    yes: 'Oui',
    no: 'Non',
  },
  ar: {
    addToCart: 'أضف للسلة',
    outOfStock: 'غير متوفر',
    specifications: 'المواصفات',
    material: 'المادة',
    dimensions: 'الأبعاد',
    weight: 'الوزن',
    capacity: 'السعة',
    warranty: 'الضمان',
    months: 'شهر',
    origin: 'بلد المنشأ',
    careInstructions: 'تعليمات العناية',
    safetyFeatures: 'التوافق',
    dishwasherSafe: 'غسالة الصحون',
    microwaveSafe: 'الميكروويف',
    ovenSafe: 'الفرن',
    maxTemp: 'الحرارة القصوى',
    yes: 'نعم',
    no: 'لا',
  },
  en: {
    addToCart: 'Add to Cart',
    outOfStock: 'Out of Stock',
    specifications: 'Specifications',
    material: 'Material',
    dimensions: 'Dimensions',
    weight: 'Weight',
    capacity: 'Capacity',
    warranty: 'Warranty',
    months: 'months',
    origin: 'Origin',
    careInstructions: 'Care Instructions',
    safetyFeatures: 'Compatibility',
    dishwasherSafe: 'Dishwasher',
    microwaveSafe: 'Microwave',
    ovenSafe: 'Oven',
    maxTemp: 'Max Temperature',
    yes: 'Yes',
    no: 'No',
  },
}

export default function KitchenwareProductDetails({
  product,
  locale = 'fr',
  className,
  onAddToCart
}: ProductDetailsProps) {
  const { addItem } = useCartStore()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  
  // Product fields are already localized from the parent component
  const name = product.name
  const description = product.long_description || product.short_description
  const customData = product.custom_data as KitchenwareCustomData | undefined
  const t = translations[locale as keyof typeof translations] || translations.fr

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name,
        price: product.price,
        image: product.images?.[0],
        short_description: product.short_description || undefined
      })
    }
    onAddToCart?.()
  }

  const getMaterialLabel = (material: string) => {
    const labels = materialLabels[material]
    if (!labels) return material
    return locale === 'ar' ? labels.ar : locale === 'en' ? labels.en : labels.fr
  }

  const images = product.images?.length ? product.images : [null]

  const SafetyIcon = ({ safe, label }: { safe?: boolean; label: string }) => (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-stone-500">{label}</span>
      <span className={`flex items-center gap-1 text-sm font-medium ${safe ? 'text-emerald-600' : 'text-stone-400'}`}>
        {safe ? <Check size={14} /> : <X size={14} />}
        {safe ? t.yes : t.no}
      </span>
    </div>
  )

  return (
    <div className={`container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12  ${className || ''}`}>
      {/* Image Gallery */}
      <div className="space-y-3">
        <div className="relative aspect-square bg-stone-50 rounded-xl overflow-hidden border border-stone-200">
          {images[selectedImage] ? (
            <Image
              src={images[selectedImage]!}
              alt={name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Package className="w-24 h-24 text-stone-300" />
            </div>
          )}
          
          {/* Sale badge */}
          {product.compare_at_price && product.compare_at_price > product.price && (
            <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
              <Badge className="bg-red-500 text-white text-sm font-semibold px-3 py-1.5 shadow-lg">
                -{Math.round((1 - product.price / product.compare_at_price) * 100)}%
              </Badge>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                  selectedImage === idx ? 'border-primary' : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                {img ? (
                  <Image src={img} alt={`${name} ${idx + 1}`} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                    <Package className="w-5 h-5 text-stone-400" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-4">
        {/* Material Badge */}
        {customData?.material && (
          <Badge variant="secondary" className="text-xs bg-stone-100 text-stone-600 border-0 font-medium">
            {getMaterialLabel(customData.material)}
          </Badge>
        )}

        <h1 className="text-xl lg:text-2xl font-semibold text-stone-900 leading-tight">{name}</h1>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="text-base text-stone-400 line-through">
              {formatPrice(product.compare_at_price)}
            </span>
          )}
        </div>

        {/* Warranty */}
        {customData?.warranty_months && customData.warranty_months > 0 && (
          <div className="inline-flex items-center gap-1.5 text-sm text-primary bg-primary/10 px-3 py-1.5 rounded-lg">
            <Shield size={14} />
            <span className="font-medium">
              {t.warranty}: {customData.warranty_months} {t.months}
            </span>
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm text-stone-600 leading-relaxed">{description}</p>
        )}

        {/* Quick Safety Features */}
        {(customData?.is_dishwasher_safe || customData?.is_microwave_safe || customData?.is_oven_safe) && (
          <div className="flex flex-wrap gap-1.5">
            {customData?.is_dishwasher_safe && (
              <span className="inline-flex items-center gap-1 text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-md">
                <Droplets size={12} className="text-primary" />
                {t.dishwasherSafe}
              </span>
            )}
            {customData?.is_microwave_safe && (
              <span className="inline-flex items-center gap-1 text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-md">
                <Flame size={12} className="text-primary" />
                {t.microwaveSafe}
              </span>
            )}
            {customData?.is_oven_safe && (
              <span className="inline-flex items-center gap-1 text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-md">
                <Flame size={12} className="text-primary" />
                {t.ovenSafe}
              </span>
            )}
          </div>
        )}

        {/* Quantity & Add to Cart */}
        <div className="flex items-center gap-3 pt-2">
          <div className="flex items-center border border-stone-200 rounded-lg bg-white">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-50 transition-colors rounded-l-lg"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="w-10 h-10 flex items-center justify-center font-medium text-stone-800">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-50 transition-colors rounded-r-lg"
            >
              +
            </button>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={!product.is_available}
            className="flex-1 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground h-10 text-sm font-medium"
          >
            <ShoppingCart size={16} />
            {product.is_available ? t.addToCart : t.outOfStock}
          </Button>
        </div>

        <div className="border-t border-stone-100 my-4" />

        {/* Specifications */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-stone-800 flex items-center gap-1.5">
            <Info size={14} className="text-primary" />
            {t.specifications}
          </h3>
          
          <div className="space-y-0">
            {customData?.material && (
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-sm text-stone-500">{t.material}</span>
                <span className="text-sm font-medium text-stone-700">{getMaterialLabel(customData.material)}</span>
              </div>
            )}
            {customData?.dimensions && (
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-sm text-stone-500">{t.dimensions}</span>
                <span className="text-sm font-medium text-stone-700">{customData.dimensions}</span>
              </div>
            )}
            {customData?.weight_grams && (
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-sm text-stone-500">{t.weight}</span>
                <span className="text-sm font-medium text-stone-700">{customData.weight_grams}g</span>
              </div>
            )}
            {customData?.capacity_ml && (
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-sm text-stone-500">{t.capacity}</span>
                <span className="text-sm font-medium text-stone-700">{customData.capacity_ml}ml</span>
              </div>
            )}
            {customData?.max_temperature && (
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-sm text-stone-500">{t.maxTemp}</span>
                <span className="text-sm font-medium text-stone-700">{customData.max_temperature}°C</span>
              </div>
            )}
            {customData?.country_of_origin && (
              <div className="flex justify-between py-2">
                <span className="text-sm text-stone-500">{t.origin}</span>
                <span className="text-sm font-medium text-stone-700">{customData.country_of_origin}</span>
              </div>
            )}
          </div>
        </div>

        {/* Safety Features */}
        {(customData?.is_dishwasher_safe !== undefined || 
          customData?.is_microwave_safe !== undefined || 
          customData?.is_oven_safe !== undefined) && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-stone-800">{t.safetyFeatures}</h3>
            <div className="space-y-0">
              {customData?.is_dishwasher_safe !== undefined && (
                <SafetyIcon safe={customData.is_dishwasher_safe} label={t.dishwasherSafe} />
              )}
              {customData?.is_microwave_safe !== undefined && (
                <SafetyIcon safe={customData.is_microwave_safe} label={t.microwaveSafe} />
              )}
              {customData?.is_oven_safe !== undefined && (
                <SafetyIcon safe={customData.is_oven_safe} label={t.ovenSafe} />
              )}
            </div>
          </div>
        )}

        {/* Care Instructions */}
        {customData?.care_instructions && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-stone-800">{t.careInstructions}</h3>
            <p className="text-sm text-stone-600 bg-stone-50 rounded-lg p-3">
              {customData.care_instructions}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
