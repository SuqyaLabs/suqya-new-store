// ============================================
// DYNAMIC HERO SECTION TYPE DEFINITIONS
// ============================================

import type { BusinessTypeId } from './multi-business'

// Layout variants
export type HeroLayoutVariant = 
  | 'centered' 
  | 'split-left' 
  | 'split-right' 
  | 'full-bleed' 
  | 'minimal'

// Gradient styles
export type GradientStyle = 
  | 'linear' 
  | 'radial' 
  | 'mesh' 
  | 'animated' 
  | 'diagonal' 
  | 'duotone'

// Gradient directions
export type GradientDirection = 
  | 'to-right' 
  | 'to-left' 
  | 'to-bottom' 
  | 'to-top'
  | 'to-br' 
  | 'to-bl' 
  | 'to-tr' 
  | 'to-tl'
  | 'radial-center' 
  | 'radial-top'

// Hero heights
export type HeroHeight = 'sm' | 'md' | 'lg' | 'full'

// Typography sizes
export type HeadlineSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

// Text colors
export type HeroTextColor = 'auto' | 'light' | 'dark'

// Gradient stop definition
export interface GradientStop {
  color: string
  position: number  // 0-100 percentage
  opacity?: number  // 0-1 opacity modifier
}

// Gradient animation config
export interface GradientAnimation {
  type: 'shift' | 'pulse' | 'shimmer' | 'none'
  duration: number  // seconds
  direction?: 'horizontal' | 'vertical' | 'diagonal'
}

// Full gradient configuration
export interface HeroGradientConfig {
  style: GradientStyle
  direction: GradientDirection
  stops: GradientStop[]
  animation?: GradientAnimation
  overlay?: string  // Optional overlay CSS
}

// Localized text for i18n
export interface LocalizedText {
  fr: string
  ar: string
  en: string
}

// CTA button configuration
export interface HeroCTA {
  label: LocalizedText
  href: string
  variant: 'primary' | 'secondary' | 'outline' | 'ghost'
  icon?: string  // Lucide icon name
}

// Hero content configuration
export interface HeroContentConfig {
  headline: LocalizedText
  subheadline?: LocalizedText
  cta_primary?: HeroCTA
  cta_secondary?: HeroCTA
  badge?: LocalizedText
  trust_indicators?: string[]
}

// Media configuration
export interface HeroMediaConfig {
  type: 'image' | 'video' | 'none' | 'pattern'
  src?: string
  alt?: LocalizedText
  position?: 'background' | 'right' | 'left' | 'overlay'
  blend_mode?: string
}

// Typography configuration
export interface HeroTypographyConfig {
  headline_size: HeadlineSize
  headline_weight: 'medium' | 'semibold' | 'bold' | 'extrabold'
  text_align: 'left' | 'center' | 'right'
  text_color: HeroTextColor
}

// Main Hero Configuration
export interface HeroConfig {
  id: string
  tenant_id?: string
  business_type: BusinessTypeId
  
  // Layout
  layout: HeroLayoutVariant
  height: HeroHeight
  
  // Visual
  gradient: HeroGradientConfig
  media?: HeroMediaConfig
  typography: HeroTypographyConfig
  
  // Content
  content: HeroContentConfig
  
  // Responsive overrides
  mobile_layout?: HeroLayoutVariant
  mobile_height?: HeroHeight
  
  // State
  is_active: boolean
  priority: number
}

// Generated gradient output
export interface GeneratedGradient {
  cssValue: string
  stops: GradientStop[]
  textColor: 'light' | 'dark'
  overlayNeeded: boolean
}

// Gradient generator input
export interface GradientGeneratorInput {
  primary: string
  secondary: string
  accent: string
  background: string
  style: GradientStyle
  direction: GradientDirection
  businessType: BusinessTypeId
}

// Hero preset for business types
export interface HeroPreset {
  business_type: BusinessTypeId
  name: string
  config: Omit<HeroConfig, 'id' | 'tenant_id' | 'is_active' | 'priority'>
}
