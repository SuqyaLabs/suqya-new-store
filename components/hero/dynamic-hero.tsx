'use client'

import { useLocale } from 'next-intl'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useHeroConfig } from '@/hooks/use-hero-config'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { HeroGradient } from './hero-gradient'
import { HeroContent } from './hero-content'
import { HoneyDecorations } from './honey-decorations'
import { gradientKeyframes } from '@/lib/hero'
import type { HeroConfig, HeroHeight, HeroLayoutVariant } from '@/types/hero'
import type { BusinessTypeId } from '@/types/multi-business'

interface DynamicHeroProps {
  config?: Partial<HeroConfig>
  headline?: string
  subheadline?: string
  ctaHref?: string
  ctaLabel?: string
  imageSrc?: string
  className?: string
  height?: HeroHeight
  showDecorations?: boolean
}

// Decorative blob configurations per business type
const decorationConfigs: Record<BusinessTypeId, {
  blob1: string
  blob2: string
  blob3: string
  pattern?: 'dots' | 'grid' | 'honeycomb' | 'waves' | 'none'
}> = {
  nutrition: {
    blob1: 'bg-amber-600/20 top-20 -left-20 w-72 h-72',
    blob2: 'bg-yellow-500/15 bottom-20 right-10 w-96 h-96',
    blob3: 'bg-orange-400/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]',
    pattern: 'honeycomb'
  },
  retail: {
    blob1: 'bg-blue-500/15 top-10 right-20 w-80 h-80',
    blob2: 'bg-purple-400/15 bottom-10 -left-20 w-72 h-72',
    blob3: 'bg-indigo-300/10 top-1/3 right-1/4 w-96 h-96',
    pattern: 'grid'
  },
  clothing: {
    blob1: 'bg-neutral-300/10 top-20 left-10 w-64 h-64',
    blob2: 'bg-stone-200/15 bottom-32 right-20 w-80 h-80',
    blob3: 'bg-zinc-400/5 top-1/2 left-1/3 w-[400px] h-[400px]',
    pattern: 'none'
  },
  restaurant: {
    blob1: 'bg-orange-400/20 top-10 -right-10 w-80 h-80',
    blob2: 'bg-amber-300/15 bottom-20 left-20 w-72 h-72',
    blob3: 'bg-red-400/10 top-1/2 right-1/3 w-96 h-96',
    pattern: 'waves'
  },
  services: {
    blob1: 'bg-cyan-400/15 top-20 right-10 w-64 h-64',
    blob2: 'bg-sky-300/15 bottom-10 left-20 w-80 h-80',
    blob3: 'bg-blue-200/10 top-1/3 left-1/2 w-[450px] h-[450px]',
    pattern: 'dots'
  },
  custom: {
    blob1: 'bg-primary/15 top-20 -left-10 w-72 h-72',
    blob2: 'bg-secondary/15 bottom-20 right-10 w-80 h-80',
    blob3: 'bg-accent/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96',
    pattern: 'dots'
  },
  kitchenware: {
    blob1: 'bg-orange-500/20 top-10 -left-10 w-80 h-80',
    blob2: 'bg-amber-400/15 bottom-20 right-20 w-72 h-72',
    blob3: 'bg-yellow-300/10 top-1/2 left-1/3 w-96 h-96',
    pattern: 'waves'
  },
  electronics: {
    blob1: 'bg-cyan-500/15 top-20 right-10 w-72 h-72',
    blob2: 'bg-blue-400/15 bottom-10 -left-20 w-80 h-80',
    blob3: 'bg-slate-300/10 top-1/3 right-1/4 w-[450px] h-[450px]',
    pattern: 'grid'
  },
  honey: {
    blob1: 'bg-amber-600/20 top-20 -left-20 w-72 h-72',
    blob2: 'bg-yellow-500/15 bottom-20 right-10 w-96 h-96',
    blob3: 'bg-orange-400/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]',
    pattern: 'honeycomb'
  }
}

// Height classes mapping
const heightClasses: Record<HeroHeight, string> = {
  sm: 'min-h-[40vh]',
  md: 'min-h-[60vh]',
  lg: 'min-h-[80vh]',
  full: 'min-h-screen'
}

// Layout wrapper classes
const layoutWrapperClasses: Record<HeroLayoutVariant, string> = {
  'centered': 'flex items-center justify-center',
  'split-left': 'flex items-center',
  'split-right': 'flex items-center',
  'full-bleed': 'flex items-center justify-center',
  'minimal': 'flex items-end pb-12'
}

// Content container classes by layout
const contentContainerClasses: Record<HeroLayoutVariant, string> = {
  'centered': 'container mx-auto px-4 flex justify-center',
  'split-left': 'container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center',
  'split-right': 'container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center',
  'full-bleed': 'container mx-auto px-4 flex justify-center',
  'minimal': 'container mx-auto px-4'
}

// Decorative pattern component
function DecorativePattern({ pattern, className }: { pattern: string; className?: string }) {
  if (pattern === 'none') return null
  
  return (
    <div className={cn('absolute inset-0 opacity-[0.03] pointer-events-none', className)}>
      {pattern === 'dots' && (
        <svg className="w-full h-full">
          <pattern id="hero-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hero-dots)" />
        </svg>
      )}
      {pattern === 'grid' && (
        <svg className="w-full h-full">
          <pattern id="hero-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      )}
      {pattern === 'honeycomb' && (
        <svg className="w-full h-full">
          <pattern id="hero-honeycomb" width="28" height="49" patternUnits="userSpaceOnUse">
            <polygon points="14,1 27,12.5 27,36.5 14,48 1,36.5 1,12.5" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hero-honeycomb)" />
        </svg>
      )}
      {pattern === 'waves' && (
        <svg className="w-full h-full">
          <pattern id="hero-waves" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 10 Q25 0 50 10 T100 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hero-waves)" />
        </svg>
      )}
    </div>
  )
}

// Decorative blob - simplified for mobile
function DecorativeBlob({ 
  className, 
  delay = 0, 
  reduced = false 
}: { 
  className: string
  delay?: number
  reduced?: boolean 
}) {
  return (
    <div
      className={cn(
        'absolute rounded-full pointer-events-none',
        reduced ? 'blur-2xl' : 'blur-3xl', // Less blur on mobile
        className
      )}
      style={reduced ? undefined : {
        animation: `hero-blob 8s ease-in-out infinite, hero-scale-pulse 6s ease-in-out infinite`,
        animationDelay: `${delay}s`
      }}
    />
  )
}

export function DynamicHero({
  config: configOverrides,
  headline,
  subheadline,
  ctaHref,
  ctaLabel,
  imageSrc,
  className,
  height: heightOverride,
  showDecorations = true
}: DynamicHeroProps) {
  const locale = useLocale() as 'fr' | 'ar' | 'en'
  const isRTL = locale === 'ar'
  const reduceAnimations = useReducedMotion()
  
  // Get hero config with overrides
  const { config, gradient, isLoading, businessType } = useHeroConfig({
    overrides: configOverrides
  })
  
  // Get decoration config for this business type
  const decorations = decorationConfigs[businessType] || decorationConfigs.custom

  // Apply prop overrides to content
  const content = { ...config.content }
  if (headline) {
    content.headline = { fr: headline, ar: headline, en: headline }
  }
  if (subheadline) {
    content.subheadline = { fr: subheadline, ar: subheadline, en: subheadline }
  }
  if (ctaLabel && content.cta_primary) {
    content.cta_primary = {
      ...content.cta_primary,
      label: { fr: ctaLabel, ar: ctaLabel, en: ctaLabel }
    }
  }
  if (ctaHref && content.cta_primary) {
    content.cta_primary = {
      ...content.cta_primary,
      href: ctaHref
    }
  }

  const effectiveHeight = heightOverride || config.height
  const effectiveLayout = config.layout
  
  // Determine text color based on gradient analysis or config override
  const textColor = config.typography.text_color === 'auto' 
    ? gradient.textColor 
    : config.typography.text_color === 'light' ? 'light' : 'dark'

  // Loading skeleton
  if (isLoading) {
    return (
      <section className={cn(
        'relative w-full',
        heightClasses[effectiveHeight],
        'bg-muted animate-pulse',
        className
      )}>
        <div className="container mx-auto px-4 h-full flex items-center justify-center">
          <div className="space-y-4 text-center">
            <div className="h-12 w-96 bg-muted-foreground/20 rounded mx-auto" />
            <div className="h-6 w-64 bg-muted-foreground/20 rounded mx-auto" />
            <div className="h-10 w-32 bg-muted-foreground/20 rounded mx-auto mt-6" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Inject gradient animation keyframes */}
      <style dangerouslySetInnerHTML={{ __html: gradientKeyframes }} />
      
      <section
        className={cn(
          'relative w-full overflow-hidden',
          heightClasses[effectiveHeight],
          layoutWrapperClasses[effectiveLayout],
          className
        )}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Gradient Background */}
        <HeroGradient gradient={gradient} config={config.gradient} />

        {/* Decorative Elements */}
        {showDecorations && (
          <>
            {/* Animated Blobs - reduced on mobile */}
            <DecorativeBlob className={decorations.blob1} delay={0} reduced={reduceAnimations} />
            {!reduceAnimations && (
              <>
                <DecorativeBlob className={decorations.blob2} delay={2} reduced={false} />
                <DecorativeBlob className={decorations.blob3} delay={4} reduced={false} />
              </>
            )}
            
            {/* Special Honey Decorations for Nutrition - skip on mobile */}
            {businessType === 'nutrition' && !reduceAnimations && <HoneyDecorations />}
            
            {/* Pattern Overlay (skip for nutrition as HoneyDecorations handles it) */}
            {businessType !== 'nutrition' && decorations.pattern && decorations.pattern !== 'none' && !reduceAnimations && (
              <DecorativePattern pattern={decorations.pattern} />
            )}
          </>
        )}

        {/* Background Image (for full-bleed or background media) */}
        {config.media?.type === 'image' && config.media.position === 'background' && (imageSrc || config.media.src) && (
          <div className="absolute inset-0">
            <Image
              src={imageSrc || config.media.src || ''}
              alt=""
              fill
              className={cn(
                'object-cover',
                config.media.blend_mode && `mix-blend-${config.media.blend_mode}`
              )}
              priority
            />
          </div>
        )}

        {/* Content Container */}
        <div className={cn(
          'relative z-10 w-full',
          contentContainerClasses[effectiveLayout]
        )}>
          {/* Split Left: Media first on desktop */}
          {effectiveLayout === 'split-left' && config.media?.type === 'image' && (
            <>
              <div className="hidden lg:block">
                {(imageSrc || config.media.src) && (
                  <div className="relative aspect-square max-w-md mx-auto">
                    <Image
                      src={imageSrc || config.media.src || ''}
                      alt=""
                      fill
                      className="object-cover rounded-2xl shadow-2xl"
                      priority
                    />
                  </div>
                )}
              </div>
              <HeroContent
                content={content}
                typography={config.typography}
                textColor={textColor}
                locale={locale}
              />
            </>
          )}

          {/* Split Right: Content first, media second */}
          {effectiveLayout === 'split-right' && config.media?.type === 'image' && (
            <>
              <HeroContent
                content={content}
                typography={config.typography}
                textColor={textColor}
                locale={locale}
              />
              <div className="hidden lg:block">
                {(imageSrc || config.media.src) && (
                  <div className="relative aspect-square max-w-md mx-auto">
                    <Image
                      src={imageSrc || config.media.src || ''}
                      alt=""
                      fill
                      className="object-cover rounded-2xl shadow-2xl"
                      priority
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {/* Centered, Full-bleed, Minimal: Just content */}
          {(effectiveLayout === 'centered' || effectiveLayout === 'full-bleed' || effectiveLayout === 'minimal' || !config.media) && (
            <HeroContent
              content={content}
              typography={config.typography}
              textColor={textColor}
              locale={locale}
            />
          )}

          {/* Split layouts without media - just show content centered */}
          {(effectiveLayout === 'split-left' || effectiveLayout === 'split-right') && !config.media && (
            <HeroContent
              content={content}
              typography={config.typography}
              textColor={textColor}
              locale={locale}
              className="col-span-full"
            />
          )}
        </div>

        {/* Bottom fade overlay for full-bleed */}
        {effectiveLayout === 'full-bleed' && (
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
        )}
      </section>
    </>
  )
}
