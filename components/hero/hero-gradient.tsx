'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import type { HeroGradientConfig, GeneratedGradient } from '@/types/hero'

interface HeroGradientProps {
  gradient: GeneratedGradient
  config: HeroGradientConfig
  className?: string
  children?: React.ReactNode
}

export function HeroGradient({ gradient, config, className, children }: HeroGradientProps) {
  const reduceMotion = useReducedMotion()
  
  const animationStyle = useMemo(() => {
    // Skip animations on mobile or when user prefers reduced motion
    if (reduceMotion) return {}
    if (config.style !== 'animated' || !config.animation) return {}
    
    const { type, duration } = config.animation
    
    switch (type) {
      case 'shift':
        return {
          backgroundSize: '200% 200%',
          animation: `hero-gradient-shift ${duration}s ease infinite`
        }
      case 'pulse':
        return {
          animation: `hero-gradient-pulse ${duration}s ease infinite`
        }
      case 'shimmer':
        return {
          backgroundSize: '200% 100%',
          animation: `hero-gradient-shimmer ${duration}s linear infinite`
        }
      default:
        return {}
    }
  }, [config.style, config.animation, reduceMotion])

  return (
    <div
      className={cn(
        'absolute inset-0 transition-all duration-500',
        className
      )}
      style={{
        background: gradient.cssValue,
        ...animationStyle
      }}
    >
      {config.overlay && (
        <div 
          className="absolute inset-0"
          style={{ background: config.overlay }}
        />
      )}
      {children}
    </div>
  )
}
