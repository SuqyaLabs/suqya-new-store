import type { ComponentType } from 'react'
import type { BusinessTypeId } from '@/types/multi-business'

// Component keys that can be overridden per business type
export type ComponentKey = 
  | 'HomePage'
  | 'ProductCard'
  | 'ProductDetails'
  | 'CartItem'
  | 'CheckoutForm'
  | 'CategoryCard'
  | 'ProductFilters'

// Props types for each component
// Home page props
export interface HomePageProps {
  locale: string
  tenant: {
    id: string
    name: string
    business_type: string
    config?: unknown
  }
}

export interface ProductCardProps {
  product: {
    id: string
    name: string // Already localized name
    short_description?: string | null // Already localized
    long_description?: string | null // Already localized
    price: number
    compare_at_price?: number | null
    images?: string[] | null
    category_id?: string | null
    category_name?: string | null // Already localized
    custom_data?: Record<string, unknown>
    is_available?: boolean
    is_online?: boolean
  }
  locale?: string
  className?: string
  onAddToCart?: () => void
}

export interface ProductDetailsProps extends ProductCardProps {
  variants?: Array<{
    id: string
    name: string
    price: number
    sku?: string
    stock_quantity?: number
  }>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ComponentLoader = () => Promise<{ default: ComponentType<any> }>

type BusinessComponentRegistry = Partial<Record<ComponentKey, ComponentLoader>>

const componentRegistry: Record<BusinessTypeId | 'default', BusinessComponentRegistry> = {
  nutrition: {
    ProductCard: () => import('./business/nutrition/product-card'),
  },
  clothing: {
    ProductCard: () => import('./business/clothing/product-card'),
  },
  restaurant: {
    ProductCard: () => import('./business/restaurant/product-card'),
  },
  retail: {
    ProductCard: () => import('./business/retail/product-card'),
  },
  kitchenware: {
    HomePage: () => import('./business/kitchenware/home-page'),
    ProductCard: () => import('./business/kitchenware/product-card'),
    ProductDetails: () => import('./business/kitchenware/product-details'),
  },
  electronics: {
    HomePage: () => import('./business/electronics/home-page'),
    ProductCard: () => import('./business/electronics/product-card'),
    ProductDetails: () => import('./business/electronics/product-details'),
  },
  honey: {
    HomePage: () => import('./business/honey/home-page'),
    ProductCard: () => import('./business/honey/product-card'),
    ProductDetails: () => import('./business/honey/product-details'),
  },
  services: {},
  custom: {},
  default: {
    HomePage: () => import('./core/home-page'),
    ProductCard: () => import('./core/product-card'),
  },
}

/**
 * Resolve a component for a specific business type
 * Falls back to default if business-specific version doesn't exist
 */
export async function resolveComponent<P = unknown>(
  componentKey: ComponentKey,
  businessType: BusinessTypeId
): Promise<ComponentType<P>> {
  // Try business-specific first
  const businessLoader = componentRegistry[businessType]?.[componentKey]
  if (businessLoader) {
    try {
      const module = await businessLoader()
      return module.default as ComponentType<P>
    } catch (err) {
      console.warn(`Failed to load ${businessType}/${componentKey}, falling back to default`)
    }
  }
  
  // Fall back to default
  const defaultLoader = componentRegistry.default[componentKey]
  if (defaultLoader) {
    const module = await defaultLoader()
    return module.default as ComponentType<P>
  }
  
  throw new Error(`Component ${componentKey} not found for ${businessType}`)
}

/**
 * Check if a business type has a custom component
 */
export function hasCustomComponent(
  componentKey: ComponentKey,
  businessType: BusinessTypeId
): boolean {
  return !!componentRegistry[businessType]?.[componentKey]
}

/**
 * Get all available component keys
 */
export function getComponentKeys(): ComponentKey[] {
  return ['HomePage', 'ProductCard', 'ProductDetails', 'CartItem', 'CheckoutForm', 'CategoryCard', 'ProductFilters']
}
