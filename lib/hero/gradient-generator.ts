// ============================================
// HERO GRADIENT GENERATOR
// ============================================
// Generates CSS gradients from theme colors based on business type

import type { 
  GradientGeneratorInput, 
  GeneratedGradient, 
  GradientStop,
  GradientStyle,
  GradientDirection
} from '@/types/hero'
import type { BusinessTypeId } from '@/types/multi-business'

// Convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return { r: 0, g: 0, b: 0 }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  }
}

// Convert RGB to hex
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

// Calculate relative luminance for contrast detection
function getLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex)
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

// Determine if text should be light or dark based on background
function getTextColorForBackground(bgColor: string): 'light' | 'dark' {
  const luminance = getLuminance(bgColor)
  return luminance > 0.5 ? 'dark' : 'light'
}

// Adjust color saturation
function adjustSaturation(hex: string, factor: number): string {
  const { r, g, b } = hexToRgb(hex)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2 / 255
  
  if (max === min) return hex // Achromatic
  
  const d = (max - min) / 255
  const s = l > 0.5 ? d / (2 - max / 255 - min / 255) : d / (max / 255 + min / 255)
  
  // Adjust saturation
  const newS = Math.max(0, Math.min(1, s * factor))
  
  // Convert back (simplified)
  const gray = (r + g + b) / 3
  const newR = gray + (r - gray) * (newS / s)
  const newG = gray + (g - gray) * (newS / s)
  const newB = gray + (b - gray) * (newS / s)
  
  return rgbToHex(newR, newG, newB)
}

// Adjust color brightness
function adjustBrightness(hex: string, factor: number): string {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHex(r * factor, g * factor, b * factor)
}

// Blend two colors
function blendColors(color1: string, color2: string, ratio: number): string {
  const c1 = hexToRgb(color1)
  const c2 = hexToRgb(color2)
  return rgbToHex(
    c1.r * (1 - ratio) + c2.r * ratio,
    c1.g * (1 - ratio) + c2.g * ratio,
    c1.b * (1 - ratio) + c2.b * ratio
  )
}

// Add warmth to color (shift toward orange)
function addWarmth(hex: string, intensity: number): string {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHex(
    r + (255 - r) * intensity * 0.2,
    g + (180 - g) * intensity * 0.1,
    b * (1 - intensity * 0.1)
  )
}

// Apply color with opacity
function colorWithOpacity(hex: string, opacity: number): string {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

// Business-specific color modifiers
function applyBusinessModifiers(
  colors: { primary: string; secondary: string; accent: string; background: string },
  businessType: BusinessTypeId
): { primary: string; secondary: string; accent: string; background: string } {
  switch (businessType) {
    case 'nutrition':
      // Increase vibrance for energetic feel
      return {
        primary: adjustSaturation(colors.primary, 1.15),
        secondary: adjustSaturation(colors.secondary, 1.1),
        accent: adjustBrightness(colors.accent, 1.05),
        background: colors.background
      }
    
    case 'clothing':
      // Mute and soften for elegance
      return {
        primary: adjustSaturation(colors.primary, 0.7),
        secondary: adjustSaturation(colors.secondary, 0.6),
        accent: adjustBrightness(colors.accent, 1.1),
        background: colors.background
      }
    
    case 'restaurant':
      // Add warmth for inviting feel
      return {
        primary: addWarmth(colors.primary, 0.15),
        secondary: addWarmth(colors.secondary, 0.2),
        accent: addWarmth(colors.accent, 0.1),
        background: colors.background
      }
    
    case 'retail':
      // Boost contrast for commercial impact
      return {
        primary: adjustBrightness(colors.primary, 1.05),
        secondary: adjustBrightness(colors.secondary, 0.9),
        accent: colors.accent,
        background: colors.background
      }
    
    case 'services':
      // Professional, slightly desaturated
      return {
        primary: adjustSaturation(colors.primary, 0.85),
        secondary: adjustSaturation(colors.secondary, 0.8),
        accent: colors.accent,
        background: colors.background
      }
    
    default:
      return colors
  }
}

// Convert direction to CSS gradient direction
function getGradientDirection(direction: GradientDirection): string {
  const directionMap: Record<GradientDirection, string> = {
    'to-right': 'to right',
    'to-left': 'to left',
    'to-bottom': 'to bottom',
    'to-top': 'to top',
    'to-br': '135deg',
    'to-bl': '225deg',
    'to-tr': '45deg',
    'to-tl': '315deg',
    'radial-center': 'circle at center',
    'radial-top': 'ellipse at top'
  }
  return directionMap[direction] || 'to right'
}

// Generate linear gradient
function generateLinearGradient(
  stops: GradientStop[],
  direction: GradientDirection
): string {
  const cssDirection = getGradientDirection(direction)
  const cssStops = stops.map(stop => {
    const color = stop.opacity !== undefined && stop.opacity < 1
      ? colorWithOpacity(stop.color, stop.opacity)
      : stop.color
    return `${color} ${stop.position}%`
  }).join(', ')
  
  return `linear-gradient(${cssDirection}, ${cssStops})`
}

// Generate radial gradient
function generateRadialGradient(
  stops: GradientStop[],
  direction: GradientDirection
): string {
  const cssDirection = getGradientDirection(direction)
  const cssStops = stops.map(stop => {
    const color = stop.opacity !== undefined && stop.opacity < 1
      ? colorWithOpacity(stop.color, stop.opacity)
      : stop.color
    return `${color} ${stop.position}%`
  }).join(', ')
  
  return `radial-gradient(${cssDirection}, ${cssStops})`
}

// Generate mesh gradient (multiple layered radials)
function generateMeshGradient(colors: {
  primary: string
  secondary: string
  accent: string
  background: string
}): string {
  return [
    `radial-gradient(ellipse at 20% 30%, ${colorWithOpacity(colors.primary, 0.4)} 0%, transparent 50%)`,
    `radial-gradient(ellipse at 80% 70%, ${colorWithOpacity(colors.secondary, 0.3)} 0%, transparent 50%)`,
    `radial-gradient(ellipse at 50% 50%, ${colorWithOpacity(colors.accent, 0.2)} 0%, transparent 70%)`,
    colors.background
  ].join(', ')
}

// Generate duotone gradient
function generateDuotoneGradient(
  primary: string,
  secondary: string,
  direction: GradientDirection
): string {
  const cssDirection = getGradientDirection(direction)
  const midColor = blendColors(primary, secondary, 0.5)
  
  return `linear-gradient(${cssDirection}, ${primary} 0%, ${midColor} 50%, ${secondary} 100%)`
}

// Generate animated gradient CSS (returns CSS + keyframe name)
function generateAnimatedGradient(
  primary: string,
  secondary: string,
  direction: GradientDirection
): { css: string; animation: string } {
  const cssDirection = getGradientDirection(direction)
  
  return {
    css: `linear-gradient(${cssDirection}, ${primary} 0%, ${secondary} 50%, ${primary} 100%)`,
    animation: 'hero-gradient-shift'
  }
}

// Main gradient generator function
export function generateGradient(input: GradientGeneratorInput): GeneratedGradient {
  // Apply business-specific color modifications
  const modifiedColors = applyBusinessModifiers(
    {
      primary: input.primary,
      secondary: input.secondary,
      accent: input.accent,
      background: input.background
    },
    input.businessType
  )
  
  let cssValue: string
  let stops: GradientStop[]
  
  switch (input.style) {
    case 'linear':
      stops = [
        { color: modifiedColors.primary, position: 0 },
        { color: modifiedColors.secondary, position: 100 }
      ]
      cssValue = generateLinearGradient(stops, input.direction)
      break
    
    case 'radial':
      stops = [
        { color: modifiedColors.primary, position: 0 },
        { color: modifiedColors.secondary, position: 50 },
        { color: modifiedColors.background, position: 100, opacity: 0 }
      ]
      cssValue = generateRadialGradient(stops, input.direction)
      break
    
    case 'mesh':
      stops = [
        { color: modifiedColors.primary, position: 0, opacity: 0.4 },
        { color: modifiedColors.secondary, position: 50, opacity: 0.3 },
        { color: modifiedColors.accent, position: 100, opacity: 0.2 }
      ]
      cssValue = generateMeshGradient(modifiedColors)
      break
    
    case 'duotone':
      stops = [
        { color: modifiedColors.primary, position: 0 },
        { color: blendColors(modifiedColors.primary, modifiedColors.secondary, 0.5), position: 50 },
        { color: modifiedColors.secondary, position: 100 }
      ]
      cssValue = generateDuotoneGradient(
        modifiedColors.primary,
        modifiedColors.secondary,
        input.direction
      )
      break
    
    case 'animated':
      stops = [
        { color: modifiedColors.primary, position: 0 },
        { color: modifiedColors.secondary, position: 50 },
        { color: modifiedColors.primary, position: 100 }
      ]
      const animated = generateAnimatedGradient(
        modifiedColors.primary,
        modifiedColors.secondary,
        input.direction
      )
      cssValue = animated.css
      break
    
    case 'diagonal':
    default:
      stops = [
        { color: modifiedColors.primary, position: 0 },
        { color: modifiedColors.accent, position: 50, opacity: 0.8 },
        { color: modifiedColors.secondary, position: 100 }
      ]
      cssValue = generateLinearGradient(stops, 'to-br')
      break
  }
  
  // Determine dominant color for text color calculation
  const dominantColor = input.style === 'mesh' 
    ? modifiedColors.background
    : blendColors(modifiedColors.primary, modifiedColors.secondary, 0.5)
  
  const textColor = getTextColorForBackground(dominantColor)
  const overlayNeeded = input.style === 'mesh' || getLuminance(dominantColor) > 0.3 && getLuminance(dominantColor) < 0.7
  
  return {
    cssValue,
    stops,
    textColor,
    overlayNeeded
  }
}

// Get recommended gradient config for business type
export function getRecommendedGradientConfig(businessType: BusinessTypeId): {
  style: GradientStyle
  direction: GradientDirection
} {
  const configs: Record<BusinessTypeId, { style: GradientStyle; direction: GradientDirection }> = {
    nutrition: { style: 'animated', direction: 'to-br' },
    retail: { style: 'linear', direction: 'to-right' },
    clothing: { style: 'mesh', direction: 'radial-center' },
    restaurant: { style: 'duotone', direction: 'to-bottom' },
    services: { style: 'radial', direction: 'radial-center' },
    custom: { style: 'linear', direction: 'to-br' },
    kitchenware: { style: 'duotone', direction: 'to-br' },
    electronics: { style: 'linear', direction: 'to-right' },
    honey: { style: 'animated', direction: 'to-br' }
  }
  
  return configs[businessType] || configs.custom
}

// CSS keyframes for animated gradients (to be injected)
// Includes prefers-reduced-motion support for accessibility and mobile performance
export const gradientKeyframes = `
/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

@keyframes hero-gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes hero-gradient-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.85;
    transform: scale(1.02);
  }
}

@keyframes hero-gradient-shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes hero-float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes hero-glow {
  0%, 100% {
    filter: blur(40px) brightness(1);
  }
  50% {
    filter: blur(60px) brightness(1.2);
  }
}

@keyframes hero-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes hero-scale-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.3;
  }
}

@keyframes hero-fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes hero-blob {
  0%, 100% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  }
  50% {
    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
  }
}

@keyframes hero-bee-drift {
  0% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(20px, -15px) rotate(5deg); }
  50% { transform: translate(40px, 0) rotate(0deg); }
  75% { transform: translate(20px, 15px) rotate(-5deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

@keyframes hero-float-random {
  0% { transform: translate(0, 0); }
  20% { transform: translate(10px, -10px); }
  40% { transform: translate(-5px, 15px); }
  60% { transform: translate(-15px, -5px); }
  80% { transform: translate(5px, 10px); }
  100% { transform: translate(0, 0); }
}
`
