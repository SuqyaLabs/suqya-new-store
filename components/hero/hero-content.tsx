'use client'

import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import * as LucideIcons from 'lucide-react'
import type { HeroContentConfig, HeroTypographyConfig, LocalizedText, HeroCTA } from '@/types/hero'

type Locale = 'fr' | 'ar' | 'en'

interface HeroContentProps {
  content: HeroContentConfig
  typography: HeroTypographyConfig
  textColor: 'light' | 'dark'
  locale: Locale
  className?: string
}

// Get localized text
function getLocalizedText(text: LocalizedText | undefined, locale: Locale): string {
  if (!text) return ''
  return text[locale] || text.fr || ''
}

// Dynamic icon component
function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>
  const IconComponent = icons[name]
  if (!IconComponent) return null
  return <IconComponent className={className} />
}

// Headline size classes
const headlineSizeClasses = {
  sm: 'text-2xl sm:text-3xl',
  md: 'text-3xl sm:text-4xl',
  lg: 'text-4xl sm:text-5xl',
  xl: 'text-4xl sm:text-5xl lg:text-6xl',
  '2xl': 'text-5xl sm:text-6xl lg:text-7xl'
}

// Headline weight classes
const headlineWeightClasses = {
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold'
}

// Text align classes
const textAlignClasses = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end'
}

// CTA Button component
function CTAButton({ cta, locale, textColor }: { cta: HeroCTA; locale: Locale; textColor: 'light' | 'dark' }) {
  const label = getLocalizedText(cta.label, locale)
  
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    outline: textColor === 'light' 
      ? 'border-2 border-white text-white hover:bg-white/10' 
      : 'border-2 border-foreground text-foreground hover:bg-foreground/10',
    ghost: textColor === 'light'
      ? 'text-white hover:bg-white/10'
      : 'text-foreground hover:bg-foreground/10'
  }

  return (
    <Button
      asChild
      size="lg"
      className={cn(
        'gap-2 px-6 py-3 text-base font-semibold transition-all',
        variantClasses[cta.variant]
      )}
    >
      <Link href={cta.href}>
        {cta.icon && <DynamicIcon name={cta.icon} className="w-5 h-5" />}
        {label}
      </Link>
    </Button>
  )
}

export function HeroContent({ content, typography, textColor, locale, className }: HeroContentProps) {
  const headline = getLocalizedText(content.headline, locale)
  const subheadline = getLocalizedText(content.subheadline, locale)
  const badge = getLocalizedText(content.badge, locale)

  // Use high-contrast text colors for better visibility
  // Dark mode: use foreground color which should contrast with background
  // Light mode: use white with drop shadow for visibility on any gradient
  const textColorClass = textColor === 'light' 
    ? 'text-white drop-shadow-md' 
    : 'text-foreground'
  const subTextColorClass = textColor === 'light' 
    ? 'text-white/90 drop-shadow-sm' 
    : 'text-foreground/80'

  return (
    <div
      className={cn(
        'flex flex-col gap-6 max-w-3xl',
        textAlignClasses[typography.text_align],
        className
      )}
      style={{ animation: 'hero-fade-in-up 0.8s ease-out forwards' }}
    >
      {badge && (
        <Badge 
          variant="secondary" 
          className={cn(
            'w-fit px-4 py-1.5 text-sm font-medium backdrop-blur-sm',
            textColor === 'light' 
              ? 'bg-white/20 text-white border-white/30' 
              : 'bg-foreground/10 border-foreground/20'
          )}
          style={{ animation: 'hero-fade-in-up 0.6s ease-out forwards', animationDelay: '0.1s', opacity: 0 }}
        >
          {badge}
        </Badge>
      )}

      <h1
        className={cn(
          'tracking-tight leading-tight whitespace-pre-line',
          headlineSizeClasses[typography.headline_size],
          headlineWeightClasses[typography.headline_weight],
          textColorClass
        )}
        style={{ animation: 'hero-fade-in-up 0.8s ease-out forwards', animationDelay: '0.2s', opacity: 0 }}
      >
        {headline}
      </h1>

      {subheadline && (
        <p
          className={cn(
            'text-lg sm:text-xl max-w-2xl leading-relaxed',
            subTextColorClass
          )}
          style={{ animation: 'hero-fade-in-up 0.8s ease-out forwards', animationDelay: '0.4s', opacity: 0 }}
        >
          {subheadline}
        </p>
      )}

      {(content.cta_primary || content.cta_secondary) && (
        <div 
          className={cn(
            'flex flex-wrap gap-4 mt-2',
            typography.text_align === 'center' && 'justify-center',
            typography.text_align === 'right' && 'justify-end'
          )}
          style={{ animation: 'hero-fade-in-up 0.8s ease-out forwards', animationDelay: '0.6s', opacity: 0 }}
        >
          {content.cta_primary && (
            <CTAButton cta={content.cta_primary} locale={locale} textColor={textColor} />
          )}
          {content.cta_secondary && (
            <CTAButton cta={content.cta_secondary} locale={locale} textColor={textColor} />
          )}
        </div>
      )}

      {content.trust_indicators && content.trust_indicators.length > 0 && (
        <div 
          className={cn(
            'flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm',
            subTextColorClass,
            typography.text_align === 'center' && 'justify-center',
            typography.text_align === 'right' && 'justify-end'
          )}
          style={{ animation: 'hero-fade-in-up 0.8s ease-out forwards', animationDelay: '0.8s', opacity: 0 }}
        >
          {content.trust_indicators.map((indicator, index) => (
            <span 
              key={index} 
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded-full',
                textColor === 'light' ? 'bg-white/10' : 'bg-foreground/5'
              )}
            >
              {indicator}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
