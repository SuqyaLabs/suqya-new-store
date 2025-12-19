/**
 * Tenant-Aware API Wrapper
 * 
 * Provides utilities for creating tenant-scoped API routes
 * and handling tenant context in API handlers.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Tenant, TenantContext } from '@/types/multi-business'

// Extended request with tenant context
export interface TenantRequest extends NextRequest {
  tenant: Tenant
  tenantContext: TenantContext | null
}

// API handler type with tenant context
export type TenantApiHandler = (
  request: TenantRequest,
  context: { params: Record<string, string> }
) => Promise<NextResponse> | NextResponse

// Options for withTenant wrapper
interface WithTenantOptions {
  requireTenant?: boolean // Default: true
  loadContext?: boolean   // Load full tenant context, default: false
}

/**
 * Wrap an API handler with tenant context
 * 
 * Usage:
 * ```ts
 * export const GET = withTenant(async (request) => {
 *   const { tenant } = request
 *   // tenant is guaranteed to exist
 *   return NextResponse.json({ tenantId: tenant.id })
 * })
 * ```
 */
export function withTenant(
  handler: TenantApiHandler,
  options: WithTenantOptions = {}
) {
  const { requireTenant = true, loadContext = false } = options

  return async (
    request: NextRequest,
    context: { params: Record<string, string> }
  ): Promise<NextResponse> => {
    try {
      // Get tenant ID from various sources
      const tenantId = 
        request.headers.get('x-tenant-id') ||
        request.nextUrl.searchParams.get('tenant_id') ||
        process.env.NEXT_PUBLIC_TENANT_ID

      if (!tenantId) {
        if (requireTenant) {
          return NextResponse.json(
            { error: 'Tenant ID required', code: 'TENANT_REQUIRED' },
            { status: 400 }
          )
        }
        // Continue without tenant
        return handler(request as TenantRequest, context)
      }

      // Fetch tenant
      const supabase = await createClient()
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', tenantId)
        .eq('status', 'active')
        .single()

      if (tenantError || !tenant) {
        if (requireTenant) {
          return NextResponse.json(
            { error: 'Tenant not found', code: 'TENANT_NOT_FOUND' },
            { status: 404 }
          )
        }
        return handler(request as TenantRequest, context)
      }

      // Optionally load full context
      let tenantContext: TenantContext | null = null
      if (loadContext) {
        const { data: contextData } = await supabase
          .rpc('get_tenant_config', { p_tenant_id: tenantId })
        tenantContext = contextData as TenantContext
      }

      // Extend request with tenant info
      const tenantRequest = request as TenantRequest
      tenantRequest.tenant = tenant as Tenant
      tenantRequest.tenantContext = tenantContext

      // Set tenant context for RLS
      await supabase.rpc('set_tenant_context', { tenant_id: tenantId })

      return handler(tenantRequest, context)
    } catch (error) {
      console.error('[withTenant] Error:', error)
      return NextResponse.json(
        { error: 'Internal server error', code: 'INTERNAL_ERROR' },
        { status: 500 }
      )
    }
  }
}

/**
 * Create a tenant-scoped Supabase client
 * Sets the tenant context for RLS policies
 */
export async function createTenantClient(tenantId: string) {
  const supabase = await createClient()
  
  // Set tenant context for RLS
  await supabase.rpc('set_tenant_context', { tenant_id: tenantId })
  
  return supabase
}

/**
 * Helper to extract tenant ID from request
 */
export function getTenantIdFromRequest(request: NextRequest): string | null {
  return (
    request.headers.get('x-tenant-id') ||
    request.nextUrl.searchParams.get('tenant_id') ||
    process.env.NEXT_PUBLIC_TENANT_ID ||
    null
  )
}

/**
 * Create standard API response with tenant info
 */
export function createTenantResponse<T>(
  data: T,
  tenant: Tenant,
  status = 200
): NextResponse {
  return NextResponse.json(
    {
      data,
      meta: {
        tenant_id: tenant.id,
        tenant_name: tenant.name,
        business_type: tenant.business_type
      }
    },
    { 
      status,
      headers: {
        'x-tenant-id': tenant.id,
        'x-tenant-type': tenant.business_type || 'retail'
      }
    }
  )
}

/**
 * Create error response
 */
export function createErrorResponse(
  message: string,
  code: string,
  status = 400
): NextResponse {
  return NextResponse.json(
    { error: message, code },
    { status }
  )
}

/**
 * Validate that request has required tenant scope
 */
export function validateTenantScope(
  request: TenantRequest,
  resourceTenantId: string
): boolean {
  return request.tenant?.id === resourceTenantId
}
