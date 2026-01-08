'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ShoppingCart, Shield, Cpu, Wifi, Usb, Monitor, Check, X, Zap, Package, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart-store'
import type { ProductDetailsProps } from '@/components/registry'

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
  processor?: string
  memory?: string
  storage?: string
  display_size?: string
  battery_life?: string
  os_compatibility?: string[]
}

const translations = {
  fr: {
    addToCart: 'Ajouter au Panier',
    outOfStock: 'Rupture de Stock',
    specifications: 'Spécifications Techniques',
    brand: 'Marque',
    model: 'Modèle',
    warranty: 'Garantie',
    months: 'mois',
    connectivity: 'Connectivité',
    interface: 'Interface',
    resolution: 'Résolution',
    printSpeed: 'Vitesse d\'impression',
    compatibility: 'Compatibilité',
    powerSupply: 'Alimentation',
    dimensions: 'Dimensions',
    weight: 'Poids',
    processor: 'Processeur',
    memory: 'Mémoire',
    storage: 'Stockage',
    displaySize: 'Taille écran',
    batteryLife: 'Autonomie',
    osCompatibility: 'Systèmes compatibles',
    inStock: 'En Stock',
    features: 'Caractéristiques',
    delivery: 'Livraison 24-48h',
    support: 'Support technique inclus',
    installation: 'Installation disponible',
    yes: 'Oui',
    no: 'Non'
  },
  ar: {
    addToCart: 'أضف إلى السلة',
    outOfStock: 'نفذ من المخزون',
    specifications: 'المواصفات التقنية',
    brand: 'العلامة التجارية',
    model: 'الموديل',
    warranty: 'الضمان',
    months: 'شهر',
    connectivity: 'الاتصال',
    interface: 'الواجهة',
    resolution: 'الدقة',
    printSpeed: 'سرعة الطباعة',
    compatibility: 'التوافق',
    powerSupply: 'مصدر الطاقة',
    dimensions: 'الأبعاد',
    weight: 'الوزن',
    processor: 'المعالج',
    memory: 'الذاكرة',
    storage: 'التخزين',
    displaySize: 'حجم الشاشة',
    batteryLife: 'عمر البطارية',
    osCompatibility: 'الأنظمة المتوافقة',
    inStock: 'متوفر',
    features: 'الميزات',
    delivery: 'توصيل 24-48 ساعة',
    support: 'دعم تقني مشمول',
    installation: 'تركيب متاح',
    yes: 'نعم',
    no: 'لا'
  },
  en: {
    addToCart: 'Add to Cart',
    outOfStock: 'Out of Stock',
    specifications: 'Technical Specifications',
    brand: 'Brand',
    model: 'Model',
    warranty: 'Warranty',
    months: 'months',
    connectivity: 'Connectivity',
    interface: 'Interface',
    resolution: 'Resolution',
    printSpeed: 'Print Speed',
    compatibility: 'Compatibility',
    powerSupply: 'Power Supply',
    dimensions: 'Dimensions',
    weight: 'Weight',
    processor: 'Processor',
    memory: 'Memory',
    storage: 'Storage',
    displaySize: 'Display Size',
    batteryLife: 'Battery Life',
    osCompatibility: 'OS Compatibility',
    inStock: 'In Stock',
    features: 'Features',
    delivery: '24-48h Delivery',
    support: 'Technical support included',
    installation: 'Installation available',
    yes: 'Yes',
    no: 'No'
  }
}

export default function ElectronicsProductDetails({
  product,
  locale = 'fr',
  className,
  onAddToCart
}: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCartStore()
  
  const t = translations[locale as keyof typeof translations] || translations.fr
  // Product fields are already localized from the parent component
  const name = product.name
  const description = product.long_description || product.short_description
  const customData = product.custom_data as ElectronicsCustomData | undefined

  const handleAddToCart = () => {
    if (product.is_available !== false) {
      addItem({
        id: product.id,
        name,
        price: product.price,
        image: product.images?.[0],
        short_description: product.short_description || undefined
      }, undefined, quantity)
      onAddToCart?.()
    }
  }

  const images = product.images?.length ? product.images : [null]

  const SpecRow = ({ label, value, icon: Icon }: { label: string; value?: string | number; icon?: typeof Cpu }) => {
    if (!value) return null
    return (
      <div className="flex items-center justify-between py-3 border-b border-slate-200 last:border-0">
        <div className="flex items-center gap-2 text-slate-500">
          {Icon && <Icon size={16} className="text-cyan-600" />}
          <span>{label}</span>
        </div>
        <span className="font-medium text-slate-800">{value}</span>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-slate-50 ${className || ''}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              {images[selectedImage] ? (
                <Image
                  src={images[selectedImage]!}
                  alt={name}
                  fill
                  className="object-contain p-8"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cpu className="w-32 h-32 text-slate-300" />
                </div>
              )}
              
              {/* Stock badge */}
              <div className="absolute top-4 left-4">
                <Badge className={product.is_available !== false
                  ? "bg-emerald-500 text-white border-0" 
                  : "bg-red-500 text-white border-0"
                }>
                  {product.is_available !== false ? t.inStock : t.outOfStock}
                </Badge>
              </div>

              {/* Brand badge */}
              {customData?.brand && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-slate-700 border border-slate-200 backdrop-blur-sm">
                    {customData.brand}
                  </Badge>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === idx 
                        ? 'border-cyan-500 shadow-lg shadow-cyan-500/20' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {img ? (
                      <Image src={img} alt="" fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                        <Cpu className="w-8 h-8 text-slate-300" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Model number */}
            {customData?.model && (
              <p className="text-sm text-cyan-600 font-mono uppercase tracking-wide">
                {customData.model}
              </p>
            )}

            <h1 className="text-3xl lg:text-4xl font-bold text-slate-800">
              {name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-cyan-600">
                {formatPrice(product.price)}
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-xl text-slate-400 line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
            </div>

            {/* Warranty badge */}
            {customData?.warranty_months && (
              <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-lg">
                <Shield size={18} />
                <span className="font-medium">{t.warranty}: {customData.warranty_months} {t.months}</span>
              </div>
            )}

            {/* Description */}
            {description && (
              <p className="text-slate-600 leading-relaxed">
                {description}
              </p>
            )}

            {/* Quick specs */}
            {(customData?.connectivity || customData?.interface_type) && (
              <div className="flex flex-wrap gap-2">
                {customData.interface_type && (
                  <Badge variant="outline" className="border-slate-300 text-slate-600">
                    <Usb size={14} className="mr-1" />
                    {customData.interface_type}
                  </Badge>
                )}
                {customData.connectivity?.map((conn) => (
                  <Badge key={conn} variant="outline" className="border-slate-300 text-slate-600">
                    <Wifi size={14} className="mr-1" />
                    {conn}
                  </Badge>
                ))}
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-slate-500 hover:text-slate-800 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-3 font-semibold text-slate-800 min-w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-slate-500 hover:text-slate-800 transition-colors"
                >
                  +
                </button>
              </div>
              
              <Button
                size="lg"
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold gap-2 h-14"
                onClick={handleAddToCart}
                disabled={product.is_available === false}
              >
                <ShoppingCart size={20} />
                {product.is_available !== false ? t.addToCart : t.outOfStock}
              </Button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-slate-200">
                <Truck className="w-6 h-6 text-cyan-600 mb-2" />
                <span className="text-xs text-slate-500">{t.delivery}</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-slate-200">
                <Zap className="w-6 h-6 text-cyan-600 mb-2" />
                <span className="text-xs text-slate-500">{t.support}</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-slate-200">
                <Package className="w-6 h-6 text-cyan-600 mb-2" />
                <span className="text-xs text-slate-500">{t.installation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Section */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <Cpu className="text-cyan-600" />
            {t.specifications}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-x-12">
            <div>
              <SpecRow label={t.brand} value={customData?.brand} />
              <SpecRow label={t.model} value={customData?.model} />
              <SpecRow label={t.warranty} value={customData?.warranty_months ? `${customData.warranty_months} ${t.months}` : undefined} icon={Shield} />
              <SpecRow label={t.interface} value={customData?.interface_type} icon={Usb} />
              <SpecRow label={t.resolution} value={customData?.resolution} icon={Monitor} />
              <SpecRow label={t.printSpeed} value={customData?.print_speed} />
            </div>
            <div>
              <SpecRow label={t.processor} value={customData?.processor} icon={Cpu} />
              <SpecRow label={t.memory} value={customData?.memory} />
              <SpecRow label={t.storage} value={customData?.storage} />
              <SpecRow label={t.displaySize} value={customData?.display_size} />
              <SpecRow label={t.powerSupply} value={customData?.power_supply} />
              <SpecRow label={t.dimensions} value={customData?.dimensions} />
              <SpecRow label={t.weight} value={customData?.weight_kg ? `${customData.weight_kg} kg` : undefined} />
            </div>
          </div>

          {/* Connectivity */}
          {customData?.connectivity && customData.connectivity.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Wifi className="text-cyan-600" size={18} />
                {t.connectivity}
              </h3>
              <div className="flex flex-wrap gap-2">
                {customData.connectivity.map((conn) => (
                  <Badge key={conn} className="bg-slate-100 text-slate-600 border-0">
                    {conn}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* OS Compatibility */}
          {customData?.os_compatibility && customData.os_compatibility.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">
                {t.osCompatibility}
              </h3>
              <div className="flex flex-wrap gap-2">
                {customData.os_compatibility.map((os) => (
                  <Badge key={os} className="bg-slate-100 text-slate-600 border-0">
                    {os}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
