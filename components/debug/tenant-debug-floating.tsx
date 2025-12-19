'use client'

import { useState } from 'react'
import { useTenant, useFeature } from '@/hooks/use-tenant'
import { ThemeSelector } from '@/components/theme/theme-selector'
import { useTheme } from '@/components/theme/tenant-theme-provider'
import { Settings, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function TenantDebugFloating() {
  const [isOpen, setIsOpen] = useState(false)
  const { tenant, businessType, context, isLoading, error, enabledFeatures } = useTenant()
  const { preset, colors } = useTheme()
  const hasWishlists = useFeature('wishlists')
  const hasSubscriptions = useFeature('subscriptions')
  const hasReviews = useFeature('reviews')

  if (isLoading) {
    return null
  }

  if (error) {
    return null
  }

  return (
    <>
      {/* Floating Button */}
      <Button
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 p-0 shadow-lg bg-primary hover:bg-primary/90"
        aria-label="Toggle Debug Panel"
      >
        <Settings className="w-5 h-5" />
      </Button>

      {/* Floating Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-96 max-w-[90vw] bg-card border border-border rounded-lg shadow-xl">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">🏢 Tenant Context Debug</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-3 text-sm">
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
                <span className={`px-2 py-1 rounded text-xs ${hasWishlists ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-gray-100 dark:bg-gray-800'}`}>
                  Wishlists: {hasWishlists ? '✓' : '✗'}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${hasSubscriptions ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-gray-100 dark:bg-gray-800'}`}>
                  Subscriptions: {hasSubscriptions ? '✓' : '✗'}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${hasReviews ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-gray-100 dark:bg-gray-800'}`}>
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

              <div>
                <ThemeSelector onSelect={(id) => console.log('Theme selected:', id)} />
              </div>
              
              {/* Test buttons to verify theme switching */}
              <div className="pt-2 border-t border-border">
                <strong>Test Buttons:</strong>
                <div className="flex gap-2 mt-1">
                  <button className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs">
                    bg-primary
                  </button>
                  <button className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                    bg-secondary
                  </button>
                  <button className="px-3 py-1 bg-accent text-accent-foreground rounded text-xs">
                    bg-accent
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
