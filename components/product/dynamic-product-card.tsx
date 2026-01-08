'use client'

import { useState, useEffect, ComponentType } from 'react'
import { resolveComponent, type ProductCardProps } from '@/components/registry'
import { useTenant } from '@/hooks/use-tenant'
import type { BusinessTypeId } from '@/types/multi-business'
import { ProductCard as DefaultProductCard } from './product-card'

interface DynamicProductCardProps {
  id: string
  name: string
  name_ar?: string
  slug?: string
  price: number
  image?: string
  images?: string[]
  short_description?: string
  description?: string
  category?: string
  category_id?: string
  rating?: number
  reviewCount?: number
  badges?: string[]
  isAvailable?: boolean
  custom_data?: Record<string, unknown>
}

export function DynamicProductCard(props: DynamicProductCardProps) {
  const { tenant } = useTenant()
  const [BusinessProductCard, setBusinessProductCard] = useState<ComponentType<ProductCardProps> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const businessType: BusinessTypeId = tenant?.business_type || 'retail'

  useEffect(() => {
    let mounted = true

    async function loadComponent() {
      try {
        const Component = await resolveComponent<ProductCardProps>('ProductCard', businessType)
        if (mounted) {
          setBusinessProductCard(() => Component)
        }
      } catch (error) {
        console.warn('Failed to load business ProductCard, using default:', error)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadComponent()

    return () => {
      mounted = false
    }
  }, [businessType])

  // While loading or if no custom component, use default
  if (isLoading || !BusinessProductCard) {
    return (
      <DefaultProductCard
        id={props.id}
        name={props.name}
        slug={props.slug}
        price={props.price}
        image={props.image || props.images?.[0]}
        short_description={props.short_description}
        category={props.category}
        rating={props.rating}
        reviewCount={props.reviewCount}
        badges={props.badges}
        isAvailable={props.isAvailable}
      />
    )
  }

  // Use business-specific ProductCard
  // Product name should already be localized when passed to this component
  return (
    <BusinessProductCard
      product={{
        id: props.id,
        name: props.name,
        short_description: props.short_description || props.description,
        price: props.price,
        images: props.images || (props.image ? [props.image] : []),
        category_id: props.category_id,
        custom_data: props.custom_data,
        is_available: props.isAvailable,
      }}
      locale={undefined}
    />
  )
}
