
'use client'

import { cn } from '@/lib/utils'

interface SectionGradientProps {
  variant?: 'primary' | 'secondary' | 'overlay' | 'hero'
  className?: string
  intensity?: 'light' | 'medium' | 'strong'
}

export function SectionGradient({ 
  variant = 'primary', 
  className,
  intensity = 'medium'
}: SectionGradientProps) {
  
  // Map variant to CSS variable
  const gradientVar = {
    primary: 'var(--gradient-section-primary)',
    secondary: 'var(--gradient-section-secondary)',
    overlay: 'var(--gradient-overlay)',
    hero: 'var(--gradient-hero)'
  }[variant]

  // Map intensity to opacity
  const opacityClass = {
    light: 'opacity-30',
    medium: 'opacity-60',
    strong: 'opacity-100'
  }[intensity]

  return (
    <div 
      className={cn(
        "absolute inset-0 pointer-events-none transition-all duration-700",
        opacityClass,
        className
      )}
      style={{
        background: gradientVar
      }}
      aria-hidden="true"
    />
  )
}

// Card Highlight Gradient - used for hover effects or active states
export function CardHighlightGradient({ className }: { className?: string }) {
  return (
    <div 
      className={cn(
        "absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        className
      )}
      style={{
        background: 'var(--gradient-card-highlight)'
      }}
      aria-hidden="true"
    />
  )
}
