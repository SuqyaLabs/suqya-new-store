'use client'

import { useState, useEffect, ComponentType } from 'react'
import { useTenant } from '@/hooks/use-tenant'
import { resolveComponent, type ComponentKey, type ProductCardProps } from '@/components/registry'
import type { BusinessTypeId } from '@/types/multi-business'

interface UseDynamicComponentResult<P> {
  Component: ComponentType<P> | null
  isLoading: boolean
  error: string | null
}

/**
 * Hook to dynamically load a component based on the current business type
 */
export function useDynamicComponent<P = unknown>(
  componentKey: ComponentKey
): UseDynamicComponentResult<P> {
  const { businessType } = useTenant()
  const [Component, setComponent] = useState<ComponentType<P> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setIsLoading(true)
    setError(null)

    resolveComponent<P>(componentKey, businessType)
      .then((resolved) => {
        if (mounted) {
          setComponent(() => resolved)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message || 'Failed to load component')
          setIsLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [componentKey, businessType])

  return { Component, isLoading, error }
}

/**
 * Hook specifically for ProductCard component
 */
export function useProductCard() {
  return useDynamicComponent<ProductCardProps>('ProductCard')
}

/**
 * Preload a component for a specific business type
 * Useful for prefetching components before they're needed
 */
export async function preloadComponent(
  componentKey: ComponentKey,
  businessType: BusinessTypeId
): Promise<void> {
  try {
    await resolveComponent(componentKey, businessType)
  } catch (err) {
    console.warn(`Failed to preload ${componentKey} for ${businessType}:`, err)
  }
}
