
'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface PageGradientBackgroundProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'subtle' | 'none'
}

export function PageGradientBackground({ 
  children, 
  className,
  variant = 'default' 
}: PageGradientBackgroundProps) {
  if (variant === 'none') {
    return <div className={className}>{children}</div>
  }

  return (
    <div 
      className={cn(
        "min-h-screen w-full transition-colors duration-500",
        // Apply gradient background using CSS variable
        // We use a pseudo-element or direct background depending on needs
        // Here we'll use a subtle fixed background
        "bg-[image:var(--gradient-section-secondary)] bg-fixed bg-cover",
        className
      )}
    >
      {children}
    </div>
  )
}
