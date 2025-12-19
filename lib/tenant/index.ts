// Server-side tenant utilities
export { getServerTenantContext, getTenantBySlug, getTenantById } from './server'

// Middleware utilities
export { 
  resolveTenant, 
  clearTenantCache, 
  getTenantHeaders 
} from './middleware'

// API wrapper utilities
export {
  withTenant,
  createTenantClient,
  getTenantIdFromRequest,
  createTenantResponse,
  createErrorResponse,
  validateTenantScope,
  type TenantRequest,
  type TenantApiHandler
} from './api-wrapper'
