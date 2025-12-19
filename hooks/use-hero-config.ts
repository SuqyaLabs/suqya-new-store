'use client'

import { useMemo } from 'react'
import { useTenant } from '@/hooks/use-tenant'
import { useTheme } from '@/components/theme/tenant-theme-provider'
import { generateGradient, getDefaultHeroConfig } from '@/lib/hero'
import type { HeroConfig, GeneratedGradient } from '@/types/hero'
import type { BusinessTypeId } from '@/types/multi-business'

interface UseHeroConfigOptions {
  overrides?: Partial<HeroConfig>
}

interface UseHeroConfigResult {
  config: HeroConfig
  gradient: GeneratedGradient
  isLoading: boolean
  businessType: BusinessTypeId
}

export function useHeroConfig(options: UseHeroConfigOptions = {}): UseHeroConfigResult {
  const { businessType, isLoading } = useTenant()
  const { colors } = useTheme()
  const { overrides } = options

  // Get default config for business type
  const baseConfig = useMemo(() => {
    return getDefaultHeroConfig(businessType)
  }, [businessType])

  // Merge with overrides
  const config = useMemo((): HeroConfig => {
    if (!overrides) return baseConfig
    
    return {
      ...baseConfig,
      ...overrides,
      content: {
        ...baseConfig.content,
        ...overrides.content
      },
      gradient: {
        ...baseConfig.gradient,
        ...overrides.gradient
      },
      typography: {
        ...baseConfig.typography,
        ...overrides.typography
      }
    }
  }, [baseConfig, overrides])

  // Generate gradient from theme colors
  const gradient = useMemo((): GeneratedGradient => {
    return generateGradient({
      primary: colors.primary,
      secondary: colors.secondary,
      accent: colors.accent,
      background: colors.background,
      style: config.gradient.style,
      direction: config.gradient.direction,
      businessType
    })
  }, [colors, config.gradient.style, config.gradient.direction, businessType])

  return {
    config,
    gradient,
    isLoading,
    businessType
  }
}
