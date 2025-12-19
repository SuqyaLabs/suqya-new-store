'use client'

import { useTenant, useFeature } from '@/hooks/use-tenant'
import { ThemeSelector } from '@/components/theme/theme-selector'
import { useTheme } from '@/components/theme/tenant-theme-provider'

export function TenantDebug() {
  const { tenant, businessType, context, isLoading, error, enabledFeatures } = useTenant()
  const { preset, colors } = useTheme()
  const hasWishlists = useFeature('wishlists')
  const hasSubscriptions = useFeature('subscriptions')
  const hasReviews = useFeature('reviews')

  if (isLoading) {
    return <div className="p-4 bg-muted rounded-lg">Loading tenant...</div>
  }

  if (error) {
    return <div className="p-4 bg-red-100 text-red-800 rounded-lg">Error: {error}</div>
  }

  return (
    <div className="p-4 bg-muted rounded-lg text-sm space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">🏢 Tenant Context Debug</h3>
        <ThemeSelector onSelect={(id) => console.log('Theme selected:', id)} />
      </div>
      
      <div>
        <strong>Tenant:</strong> {tenant?.name || context?.tenant?.name || 'N/A'} ({tenant?.slug || context?.tenant?.slug})
      </div>
      
      <div>
        <strong>Business Type:</strong> {businessType}
      </div>
      
      <div>
        <strong>Product Schema Fields:</strong>{' '}
        {context?.business_type?.product_schema 
          ? Object.keys(context.business_type.product_schema).join(', ')
          : 'None'}
      </div>
      
      <div>
        <strong>Enabled Features:</strong>{' '}
        {enabledFeatures.length > 0 ? enabledFeatures.join(', ') : 'None'}
      </div>
      
      <div className="flex gap-2 flex-wrap">
        <span className={`px-2 py-1 rounded text-xs ${hasWishlists ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
          Wishlists: {hasWishlists ? '✓' : '✗'}
        </span>
        <span className={`px-2 py-1 rounded text-xs ${hasSubscriptions ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
          Subscriptions: {hasSubscriptions ? '✓' : '✗'}
        </span>
        <span className={`px-2 py-1 rounded text-xs ${hasReviews ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
          Reviews: {hasReviews ? '✓' : '✗'}
        </span>
      </div>
      
      <div>
        <strong>Theme:</strong> {preset}
        <div className="flex gap-1 mt-1">
          {[colors.primary, colors.secondary, colors.accent].map((color, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded border border-white shadow-sm"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
      
      {/* Test buttons to verify theme switching */}
      <div className="pt-2 border-t">
        <strong>Test Buttons:</strong>
        <div className="flex gap-2 mt-1">
          <button className="px-3 py-1 bg-honey-600 text-warm-900 rounded text-xs">
            bg-honey-600
          </button>
          <button className="px-3 py-1 bg-forest-900 text-white rounded text-xs">
            bg-forest-900
          </button>
          <button 
            className="px-3 py-1 rounded text-xs text-white"
            style={{ backgroundColor: 'var(--honey-600)' }}
          >
            var(--honey-600)
          </button>
        </div>
      </div>
    </div>
  )
}
