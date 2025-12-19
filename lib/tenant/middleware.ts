/**
 * Tenant Resolution Middleware Utilities
 * 
 * Provides functions for resolving tenant from various sources:
 * - Subdomain (tenant.suqya.com)
 * - Path prefix (/tenant-slug/...)
 * - Custom header (X-Tenant-ID)
 * - Query parameter (?tenant=...)
 */

import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Tenant } from '@/types/multi-business'

// Cache for tenant lookups (in-memory, per-instance)
const tenantCache = new Map<string, { tenant: Tenant; expires: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

interface TenantResolutionResult {
  tenant: Tenant | null
  source: 'subdomain' | 'path' | 'header' | 'query' | 'default' | 'none'
  error?: string
}

/**
 * Resolve tenant from request using multiple strategies
 */
export async function resolveTenant(
  request: NextRequest
): Promise<TenantResolutionResult> {
  // 1. Try custom header first (for API calls)
  const headerTenantId = request.headers.get('x-tenant-id')
  if (headerTenantId) {
    const tenant = await getTenantById(headerTenantId)
    if (tenant) {
      return { tenant, source: 'header' }
    }
  }

  // 2. Try subdomain
  const host = request.headers.get('host') || ''
  const subdomain = extractSubdomain(host)
  if (subdomain && subdomain !== 'www' && subdomain !== 'app') {
    const tenant = await getTenantBySlug(subdomain)
    if (tenant) {
      return { tenant, source: 'subdomain' }
    }
  }

  // 3. Try path prefix (e.g., /tenant-slug/products)
  const pathname = request.nextUrl.pathname
  const pathTenant = extractTenantFromPath(pathname)
  if (pathTenant) {
    const tenant = await getTenantBySlug(pathTenant)
    if (tenant) {
      return { tenant, source: 'path' }
    }
  }

  // 4. Try query parameter
  const queryTenantId = request.nextUrl.searchParams.get('tenant')
  if (queryTenantId) {
    const tenant = await getTenantById(queryTenantId)
    if (tenant) {
      return { tenant, source: 'query' }
    }
  }

  // 5. Fall back to default tenant from environment
  const defaultTenantId = process.env.NEXT_PUBLIC_TENANT_ID
  if (defaultTenantId) {
    const tenant = await getTenantById(defaultTenantId)
    if (tenant) {
      return { tenant, source: 'default' }
    }
  }

  return { tenant: null, source: 'none', error: 'No tenant found' }
}

/**
 * Extract subdomain from host
 * e.g., "tenant.suqya.com" -> "tenant"
 */
function extractSubdomain(host: string): string | null {
  // Remove port if present
  const hostname = host.split(':')[0]
  
  // Skip localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return null
  }

  const parts = hostname.split('.')
  
  // Need at least 3 parts for subdomain (sub.domain.tld)
  if (parts.length >= 3) {
    return parts[0]
  }

  return null
}

/**
 * Extract tenant slug from path
 * Looks for pattern: /t/[tenant-slug]/... or /_tenant/[tenant-slug]/...
 */
function extractTenantFromPath(pathname: string): string | null {
  // Pattern 1: /t/tenant-slug/...
  const tMatch = pathname.match(/^\/t\/([^/]+)/)
  if (tMatch) {
    return tMatch[1]
  }

  // Pattern 2: /_tenant/tenant-slug/...
  const tenantMatch = pathname.match(/^\/_tenant\/([^/]+)/)
  if (tenantMatch) {
    return tenantMatch[1]
  }

  return null
}

/**
 * Get tenant by ID with caching
 */
async function getTenantById(id: string): Promise<Tenant | null> {
  const cacheKey = `id:${id}`
  const cached = tenantCache.get(cacheKey)
  
  if (cached && cached.expires > Date.now()) {
    return cached.tenant
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', id)
      .eq('status', 'active')
      .single()

    if (error || !data) {
      return null
    }

    const tenant = data as Tenant
    tenantCache.set(cacheKey, { tenant, expires: Date.now() + CACHE_TTL })
    
    // Also cache by slug
    if (tenant.slug) {
      tenantCache.set(`slug:${tenant.slug}`, { tenant, expires: Date.now() + CACHE_TTL })
    }

    return tenant
  } catch {
    return null
  }
}

/**
 * Get tenant by slug with caching
 */
async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const cacheKey = `slug:${slug}`
  const cached = tenantCache.get(cacheKey)
  
  if (cached && cached.expires > Date.now()) {
    return cached.tenant
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .single()

    if (error || !data) {
      return null
    }

    const tenant = data as Tenant
    tenantCache.set(cacheKey, { tenant, expires: Date.now() + CACHE_TTL })
    
    // Also cache by ID
    tenantCache.set(`id:${tenant.id}`, { tenant, expires: Date.now() + CACHE_TTL })

    return tenant
  } catch {
    return null
  }
}

/**
 * Clear tenant cache (useful for testing or after tenant updates)
 */
export function clearTenantCache(tenantId?: string, slug?: string): void {
  if (tenantId) {
    tenantCache.delete(`id:${tenantId}`)
  }
  if (slug) {
    tenantCache.delete(`slug:${slug}`)
  }
  if (!tenantId && !slug) {
    tenantCache.clear()
  }
}

/**
 * Get tenant context headers for forwarding to API routes
 */
export function getTenantHeaders(tenant: Tenant): Record<string, string> {
  return {
    'x-tenant-id': tenant.id,
    'x-tenant-slug': tenant.slug,
    'x-tenant-type': tenant.business_type || 'retail',
    'x-tenant-name': tenant.name
  }
}
