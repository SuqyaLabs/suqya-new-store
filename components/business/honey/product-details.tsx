'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ShoppingCart, Leaf, Droplets, Mountain, Award, Package, Check, X, Info, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart-store'
import type { ProductDetailsProps } from '@/components/registry'

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
  storage_instructions?: string
  best_before?: string
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

const translations = {
  fr: {
    addToCart: 'Ajouter au panier',
    outOfStock: 'Rupture de stock',
    specifications: 'Caractéristiques',
    honeyType: 'Type de miel',
    origin: 'Origine',
    weight: 'Poids net',
    harvestDate: 'Date de récolte',
    flavorProfile: 'Profil aromatique',
    color: 'Couleur',
    texture: 'Texture',
    pollenSource: 'Source de pollen',
    altitude: 'Altitude',
    region: 'Région',
    storageInstructions: 'Conservation',
    bestBefore: 'À consommer de préférence avant',
    certifications: 'Certifications',
    organic: 'Agriculture Biologique',
    raw: 'Miel Cru Non Pasteurisé',
    yes: 'Oui',
    no: 'Non',
  },
  ar: {
    addToCart: 'أضف للسلة',
    outOfStock: 'غير متوفر',
    specifications: 'المواصفات',
    honeyType: 'نوع العسل',
    origin: 'المنشأ',
    weight: 'الوزن الصافي',
    harvestDate: 'تاريخ الحصاد',
    flavorProfile: 'النكهة',
    color: 'اللون',
    texture: 'القوام',
    pollenSource: 'مصدر حبوب اللقاح',
    altitude: 'الارتفاع',
    region: 'المنطقة',
    storageInstructions: 'التخزين',
    bestBefore: 'يفضل استهلاكه قبل',
    certifications: 'الشهادات',
    organic: 'زراعة عضوية',
    raw: 'عسل خام غير مبستر',
    yes: 'نعم',
    no: 'لا',
  },
  en: {
    addToCart: 'Add to Cart',
    outOfStock: 'Out of Stock',
    specifications: 'Specifications',
    honeyType: 'Honey Type',
    origin: 'Origin',
    weight: 'Net Weight',
    harvestDate: 'Harvest Date',
    flavorProfile: 'Flavor Profile',
    color: 'Color',
    texture: 'Texture',
    pollenSource: 'Pollen Source',
    altitude: 'Altitude',
    region: 'Region',
    storageInstructions: 'Storage',
    bestBefore: 'Best Before',
    certifications: 'Certifications',
    organic: 'Organic Farming',
    raw: 'Raw Unpasteurized Honey',
    yes: 'Yes',
    no: 'No',
  },
}

export default function HoneyProductDetails({
  product,
  locale = 'fr',
  className,
  onAddToCart
}: ProductDetailsProps) {
  const { addItem } = useCartStore()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  
  const name = product.name
  const description = product.long_description || product.short_description
  const customData = product.custom_data as HoneyCustomData | undefined
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

  const getHoneyTypeLabel = (type: string) => {
    const labels = honeyTypeLabels[type]
    if (!labels) return type
    return locale === 'ar' ? labels.ar : locale === 'en' ? labels.en : labels.fr
  }

  const images = product.images?.length ? product.images : [null]

  const CertificationBadge = ({ active, label, icon: Icon }: { active?: boolean; label: string; icon: typeof Leaf }) => (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
      active 
        ? 'bg-green-50 border-green-200 text-green-700' 
        : 'bg-gray-50 border-gray-200 text-gray-400'
    }`}>
      <Icon size={16} />
      <span className="text-sm font-medium">{label}</span>
      {active ? <Check size={14} className="ml-auto" /> : <X size={14} className="ml-auto" />}
    </div>
  )

  return (
    <div className={`container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 ${className || ''}`}>
      {/* Image Gallery */}
      <div className="space-y-3">
        <div className="relative aspect-square bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl overflow-hidden border border-amber-200">
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
              <Droplets className="w-24 h-24 text-amber-300" />
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

          {/* Organic badge */}
          {customData?.is_organic && (
            <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4">
              <Badge className="bg-green-500 text-white text-sm font-semibold px-3 py-1.5 shadow-lg flex items-center gap-1">
                <Leaf size={14} />
                Bio
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
                  selectedImage === idx ? 'border-amber-500' : 'border-amber-200 hover:border-amber-300'
                }`}
              >
                {img ? (
                  <Image src={img} alt={`${name} ${idx + 1}`} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-amber-50 flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-amber-400" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-4">
        {/* Honey Type Badge */}
        {customData?.honey_type && (
          <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 border-0 font-medium">
            {getHoneyTypeLabel(customData.honey_type)}
          </Badge>
        )}

        <h1 className="text-xl lg:text-2xl font-semibold text-amber-900 leading-tight">{name}</h1>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-amber-600">
            {formatPrice(product.price)}
          </span>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="text-base text-amber-400 line-through">
              {formatPrice(product.compare_at_price)}
            </span>
          )}
        </div>

        {/* Weight & Region */}
        <div className="flex flex-wrap gap-2">
          {customData?.weight_grams && (
            <div className="inline-flex items-center gap-1.5 text-sm text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
              <Package size={14} />
              <span className="font-medium">{customData.weight_grams}g</span>
            </div>
          )}
          {customData?.region && (
            <div className="inline-flex items-center gap-1.5 text-sm text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
              <Mountain size={14} />
              <span className="font-medium">{customData.region}</span>
            </div>
          )}
          {customData?.harvest_date && (
            <div className="inline-flex items-center gap-1.5 text-sm text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
              <Calendar size={14} />
              <span className="font-medium">{customData.harvest_date}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-amber-800/80 leading-relaxed">{description}</p>
        )}

        {/* Certifications */}
        {(customData?.is_organic !== undefined || customData?.is_raw !== undefined) && (
          <div className="grid grid-cols-2 gap-2">
            <CertificationBadge active={customData?.is_organic} label={t.organic} icon={Leaf} />
            <CertificationBadge active={customData?.is_raw} label={t.raw} icon={Droplets} />
          </div>
        )}

        {/* Quantity & Add to Cart */}
        <div className="flex items-center gap-3 pt-2">
          <div className="flex items-center border border-amber-200 rounded-lg bg-white">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center text-amber-700 hover:bg-amber-50 transition-colors rounded-l-lg"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="w-10 h-10 flex items-center justify-center font-medium text-amber-900">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 flex items-center justify-center text-amber-700 hover:bg-amber-50 transition-colors rounded-r-lg"
            >
              +
            </button>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={!product.is_available}
            className="flex-1 gap-2 bg-amber-600 hover:bg-amber-700 text-white h-10 text-sm font-medium"
          >
            <ShoppingCart size={16} />
            {product.is_available ? t.addToCart : t.outOfStock}
          </Button>
        </div>

        <div className="border-t border-amber-100 my-4" />

        {/* Specifications */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-amber-900 flex items-center gap-1.5">
            <Info size={14} className="text-amber-600" />
            {t.specifications}
          </h3>
          
          <div className="space-y-0">
            {customData?.honey_type && (
              <div className="flex justify-between py-2 border-b border-amber-100">
                <span className="text-sm text-amber-600">{t.honeyType}</span>
                <span className="text-sm font-medium text-amber-800">{getHoneyTypeLabel(customData.honey_type)}</span>
              </div>
            )}
            {customData?.origin && (
              <div className="flex justify-between py-2 border-b border-amber-100">
                <span className="text-sm text-amber-600">{t.origin}</span>
                <span className="text-sm font-medium text-amber-800">{customData.origin}</span>
              </div>
            )}
            {customData?.weight_grams && (
              <div className="flex justify-between py-2 border-b border-amber-100">
                <span className="text-sm text-amber-600">{t.weight}</span>
                <span className="text-sm font-medium text-amber-800">{customData.weight_grams}g</span>
              </div>
            )}
            {customData?.flavor_profile && (
              <div className="flex justify-between py-2 border-b border-amber-100">
                <span className="text-sm text-amber-600">{t.flavorProfile}</span>
                <span className="text-sm font-medium text-amber-800">{customData.flavor_profile}</span>
              </div>
            )}
            {customData?.color && (
              <div className="flex justify-between py-2 border-b border-amber-100">
                <span className="text-sm text-amber-600">{t.color}</span>
                <span className="text-sm font-medium text-amber-800">{customData.color}</span>
              </div>
            )}
            {customData?.texture && (
              <div className="flex justify-between py-2 border-b border-amber-100">
                <span className="text-sm text-amber-600">{t.texture}</span>
                <span className="text-sm font-medium text-amber-800">{customData.texture}</span>
              </div>
            )}
            {customData?.pollen_source && (
              <div className="flex justify-between py-2 border-b border-amber-100">
                <span className="text-sm text-amber-600">{t.pollenSource}</span>
                <span className="text-sm font-medium text-amber-800">{customData.pollen_source}</span>
              </div>
            )}
            {customData?.altitude_meters && (
              <div className="flex justify-between py-2 border-b border-amber-100">
                <span className="text-sm text-amber-600">{t.altitude}</span>
                <span className="text-sm font-medium text-amber-800">{customData.altitude_meters}m</span>
              </div>
            )}
            {customData?.region && (
              <div className="flex justify-between py-2 border-b border-amber-100">
                <span className="text-sm text-amber-600">{t.region}</span>
                <span className="text-sm font-medium text-amber-800">{customData.region}</span>
              </div>
            )}
            {customData?.best_before && (
              <div className="flex justify-between py-2">
                <span className="text-sm text-amber-600">{t.bestBefore}</span>
                <span className="text-sm font-medium text-amber-800">{customData.best_before}</span>
              </div>
            )}
          </div>
        </div>

        {/* Storage Instructions */}
        {customData?.storage_instructions && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-amber-900">{t.storageInstructions}</h3>
            <p className="text-sm text-amber-700 bg-amber-50 rounded-lg p-3 border border-amber-100">
              {customData.storage_instructions}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
