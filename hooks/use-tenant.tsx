'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { 
  Tenant, 
  TenantContext as TenantContextType, 
  BusinessTypeId, 
  FeatureKey,
  ThemeColors,
  CustomFieldSchema 
} from '@/types/multi-business'

// ============================================
// TENANT CONTEXT
// ============================================

interface TenantContextValue {
  // Core tenant data
  tenant: Tenant | null
  tenantId: string | null
  businessType: BusinessTypeId
  isLoading: boolean
  error: string | null
  
  // Full context (includes business type config, theme, features)
  context: TenantContextType | null
  
  // Feature checks
  isFeatureEnabled: (feature: FeatureKey) => boolean
  enabledFeatures: FeatureKey[]
  
  // Theme
  theme: ThemeColors | null
  
  // Custom fields schema for current business type
  productSchema: Record<string, CustomFieldSchema>
  
  // Actions
  refreshTenant: () => Promise<void>
  setTenantId: (id: string) => void
}

const TenantCtx = createContext<TenantContextValue | null>(null)

// ============================================
// TENANT PROVIDER
// ============================================

interface TenantProviderProps {
  children: ReactNode
  initialTenantId?: string
  initialContext?: TenantContextType
}

export function TenantProvider({ 
  children, 
  initialTenantId,
  initialContext 
}: TenantProviderProps) {
  const [tenantId, setTenantId] = useState<string | null>(initialTenantId || null)
  // Build initial tenant from context if available
  const initialTenant: Tenant | null = initialContext?.tenant ? {
    id: initialContext.tenant.id,
    name: initialContext.tenant.name,
    slug: initialContext.tenant.slug,
    business_type: initialContext.tenant.business_type,
    config: initialContext.tenant.config,
    owner_email: '',
    business_name: initialContext.tenant.name,
    status: 'active',
    created_at: '',
    updated_at: ''
  } : null
  const [tenant, setTenant] = useState<Tenant | null>(initialTenant)
  const [context, setContext] = useState<TenantContextType | null>(initialContext || null)
  const [isLoading, setIsLoading] = useState(!initialContext)
  const [error, setError] = useState<string | null>(null)

  // Fetch tenant data
  const fetchTenant = useCallback(async (id: string) => {
    if (!id) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const supabase = createClient()
      
      // Fetch tenant basic info
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', id)
        .single()
      
      if (tenantError) {
        throw new Error(tenantError.message)
      }
      
      setTenant(tenantData as Tenant)
      
      // Fetch full context using RPC function
      const { data: contextData, error: contextError } = await supabase
        .rpc('get_tenant_config', { p_tenant_id: id })
      
      if (contextError) {
        console.warn('Could not fetch full context:', contextError.message)
        // Build minimal context from tenant data
        setContext({
          tenant: {
            id: tenantData.id,
            name: tenantData.name,
            slug: tenantData.slug,
            business_type: tenantData.business_type || 'retail',
            config: tenantData.config || {}
          },
          business_type: {
            id: tenantData.business_type || 'retail',
            name: tenantData.business_type || 'Retail',
            product_schema: {},
            default_features: ['pos', 'ecommerce']
          },
          theme: null,
          features: []
        })
      } else {
        setContext(contextData as TenantContextType)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load tenant'
      setError(message)
      console.error('Tenant fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    if (tenantId && !initialContext) {
      fetchTenant(tenantId)
    }
  }, [tenantId, initialContext, fetchTenant])

  // Refresh function
  const refreshTenant = useCallback(async () => {
    if (tenantId) {
      await fetchTenant(tenantId)
    }
  }, [tenantId, fetchTenant])

  // Feature check helper
  const isFeatureEnabled = useCallback((feature: FeatureKey): boolean => {
    if (!context) return false
    
    // Check explicit features array first
    if (context.features?.includes(feature)) {
      return true
    }
    
    // Check tenant config features
    if (context.tenant?.config?.features?.[feature]) {
      return true
    }
    
    // Check business type default features
    if (context.business_type?.default_features?.includes(feature)) {
      return true
    }
    
    return false
  }, [context])

  // Derived values
  const businessType: BusinessTypeId = context?.tenant?.business_type || 'retail'
  const enabledFeatures: FeatureKey[] = context?.features || []
  const theme: ThemeColors | null = context?.theme?.colors || null
  const productSchema = context?.business_type?.product_schema || {}

  const value: TenantContextValue = {
    tenant,
    tenantId,
    businessType,
    isLoading,
    error,
    context,
    isFeatureEnabled,
    enabledFeatures,
    theme,
    productSchema,
    refreshTenant,
    setTenantId
  }

  return (
    <TenantCtx.Provider value={value}>
      {children}
    </TenantCtx.Provider>
  )
}

// ============================================
// HOOK
// ============================================

export function useTenant() {
  const context = useContext(TenantCtx)
  
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  
  return context
}

// ============================================
// UTILITY HOOKS
// ============================================

/**
 * Hook to check if a specific feature is enabled
 */
export function useFeature(feature: FeatureKey): boolean {
  const { isFeatureEnabled } = useTenant()
  return isFeatureEnabled(feature)
}

/**
 * Hook to get the current business type
 */
export function useBusinessType(): BusinessTypeId {
  const { businessType } = useTenant()
  return businessType
}

/**
 * Hook to get custom field schema for products
 */
export function useProductSchema(): Record<string, CustomFieldSchema> {
  const { productSchema } = useTenant()
  return productSchema
}

/**
 * Hook to get theme colors
 */
export function useThemeColors(): ThemeColors | null {
  const { theme } = useTenant()
  return theme
}

