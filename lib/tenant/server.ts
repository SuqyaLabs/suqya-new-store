import { createClient } from '@/lib/supabase/server'
import type { TenantContext, Tenant } from '@/types/multi-business'

/**
 * Get tenant context on the server side
 * Use this in Server Components or API routes
 */
export async function getServerTenantContext(
  tenantId: string
): Promise<TenantContext | null> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .rpc('get_tenant_config', { p_tenant_id: tenantId })
    
    if (error) {
      console.error('[getServerTenantContext] RPC error:', error)
      return null
    }
    
    if (!data) {
      console.error('[getServerTenantContext] No data returned for tenant:', tenantId)
      return null
    }
    
    return data as TenantContext
  } catch (err) {
    console.error('[getServerTenantContext] Exception:', err)
    return null
  }
}

/**
 * Get tenant by slug (for subdomain/path-based routing)
 */
export async function getTenantBySlug(
  slug: string
): Promise<Tenant | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()
  
  if (error) {
    console.error('Failed to get tenant by slug:', error)
    return null
  }
  
  return data as Tenant
}

/**
 * Get tenant by ID
 * Uses the RPC-based context fetcher to bypass RLS issues
 */
export async function getTenantById(
  id: string
): Promise<any | null> {
  const context = await getServerTenantContext(id)
  return context?.tenant || null
}
