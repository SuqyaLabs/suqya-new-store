'use client'

import { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react'
import { useTenant } from '@/hooks/use-tenant'
import type { ThemeColors } from '@/types/multi-business'
import { getThemeForBusiness } from '@/lib/theme/business-theme-map'
import { getPageGradients, type PageGradientConfig } from '@/lib/theme/page-gradients'

// Default theme colors (Suqya honey gold)
const defaultColors: ThemeColors = {
  primary: '#FFB300',
  primary_foreground: '#1C1917',
  secondary: '#1B5E20',
  secondary_foreground: '#FFFFFF',
  background: '#FAFAF9',
  foreground: '#1C1917',
  card: '#FFFFFF',
  card_foreground: '#1C1917',
  muted: '#F5F5F4',
  muted_foreground: '#78716C',
  accent: '#FFECB3',
  accent_foreground: '#1C1917',
  border: '#E7E5E4',
  input: '#E7E5E4',
  ring: '#FFC107',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6'
}

// Theme presets - complete harmonious palettes for good UI/UX
const themePresets: Record<string, Partial<ThemeColors>> = {
  honey_gold: {
    // Royal Honey theme - Premium & Organic
    primary: '#D97706',         // Amber 600
    primary_foreground: '#FFFFFF',
    secondary: '#92400E',       // Amber 800
    secondary_foreground: '#FFFFFF',
    accent: '#FEF3C7',          // Amber 100
    accent_foreground: '#92400E',
    background: '#FFFBEB',      // Amber 50
    foreground: '#451A03',      // Amber 950
    card: '#FFFFFF',
    card_foreground: '#451A03',
    muted: '#FFF7ED',           // Orange 50
    muted_foreground: '#B45309', // Amber 700
    border: '#FDE68A',          // Amber 200
    input: '#FDE68A'
  },
  nutrition_green: {
    // Fresh green theme - health/nutrition businesses
    primary: '#22C55E',
    primary_foreground: '#FFFFFF',
    secondary: '#166534',
    secondary_foreground: '#FFFFFF',
    accent: '#DCFCE7',
    accent_foreground: '#166534',
    background: '#F8FDF9',
    foreground: '#14532D',
    card: '#FFFFFF',
    card_foreground: '#14532D',
    muted: '#F0FDF4',
    muted_foreground: '#4D7C5E',
    border: '#BBF7D0',
    input: '#BBF7D0'
  },
  fashion_noir: {
    // Elegant black/white theme - fashion/luxury
    primary: '#18181B',
    primary_foreground: '#FAFAFA',
    secondary: '#71717A',
    secondary_foreground: '#FAFAFA',
    accent: '#F4F4F5',
    accent_foreground: '#18181B',
    background: '#FFFFFF',
    foreground: '#18181B',
    card: '#FAFAFA',
    card_foreground: '#18181B',
    muted: '#F4F4F5',
    muted_foreground: '#71717A',
    border: '#E4E4E7',
    input: '#E4E4E7'
  },
  ocean_blue: {
    // Cool blue theme - tech/services
    primary: '#0EA5E9',
    primary_foreground: '#FFFFFF',
    secondary: '#0369A1',
    secondary_foreground: '#FFFFFF',
    accent: '#E0F2FE',
    accent_foreground: '#0C4A6E',
    background: '#F8FAFC',
    foreground: '#0F172A',
    card: '#FFFFFF',
    card_foreground: '#0F172A',
    muted: '#F1F5F9',
    muted_foreground: '#64748B',
    border: '#E2E8F0',
    input: '#E2E8F0'
  },
  warm_terracotta: {
    // Warm earthy theme - restaurants/cafes
    primary: '#EA580C',
    primary_foreground: '#FFFFFF',
    secondary: '#9A3412',
    secondary_foreground: '#FFFFFF',
    accent: '#FED7AA',
    accent_foreground: '#7C2D12',
    background: '#FFFBF7',
    foreground: '#431407',
    card: '#FFFFFF',
    card_foreground: '#431407',
    muted: '#FFF7ED',
    muted_foreground: '#9A7B6A',
    border: '#FED7AA',
    input: '#FFEDD5'
  }
}

// Convert hex to HSL for CSS variables
function hexToHSL(hex: string): string {
  // Remove # if present
  hex = hex.replace(/^#/, '')
  
  // Parse hex
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }
  
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

// Generate CSS variables from theme colors
function generateCSSVariables(colors: ThemeColors): string {
  const variables: string[] = []
  
  // The app uses hardcoded palette classes (bg-honey-600, bg-forest-900)
  // AND Tailwind 4 uses --color-* variables via @theme inline
  // So we need to override BOTH the palette variables AND the --color-* variables
  
  // Override honey palette with primary color (for bg-honey-600, text-honey-700, etc.)
  if (colors.primary) {
    variables.push(`--honey-500: ${colors.primary};`)
    variables.push(`--honey-600: ${colors.primary};`)
    variables.push(`--honey-700: ${colors.primary};`)
    // Tailwind 4 @theme inline uses --color-honey-*
    variables.push(`--color-honey-500: ${colors.primary};`)
    variables.push(`--color-honey-600: ${colors.primary};`)
    variables.push(`--color-honey-700: ${colors.primary};`)
  }
  
  // Override forest palette with secondary color
  if (colors.secondary) {
    variables.push(`--forest-700: ${colors.secondary};`)
    variables.push(`--forest-900: ${colors.secondary};`)
    variables.push(`--color-forest-700: ${colors.secondary};`)
    variables.push(`--color-forest-900: ${colors.secondary};`)
  }
  
  // Override accent (honey-50, honey-100)
  if (colors.accent) {
    variables.push(`--honey-50: ${colors.accent};`)
    variables.push(`--honey-100: ${colors.accent};`)
    variables.push(`--color-honey-50: ${colors.accent};`)
    variables.push(`--color-honey-100: ${colors.accent};`)
  }
  
  // Override background
  if (colors.background) {
    variables.push(`--warm-50: ${colors.background};`)
    variables.push(`--background: ${colors.background};`)
    variables.push(`--color-warm-50: ${colors.background};`)
    variables.push(`--color-background: ${colors.background};`)
  }
  
  // Also set semantic variables
  if (colors.primary) {
    variables.push(`--primary: ${colors.primary};`)
    variables.push(`--color-primary: ${colors.primary};`)
    variables.push(`--ring: ${colors.primary};`)
    variables.push(`--color-ring: ${colors.primary};`)
  }
  if (colors.secondary) {
    variables.push(`--secondary: ${colors.secondary};`)
    variables.push(`--color-secondary: ${colors.secondary};`)
  }
  if (colors.accent) {
    variables.push(`--accent: ${colors.accent};`)
    variables.push(`--color-accent: ${colors.accent};`)
  }
  
  return variables.join('\n  ')
}

// Theme context for runtime theme switching
interface ThemeContextValue {
  colors: ThemeColors
  preset: string
  presets: string[]
  setPreset: (presetId: string) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

interface TenantThemeProviderProps {
  children: ReactNode
}

export function TenantThemeProvider({ children }: TenantThemeProviderProps) {
  const { context } = useTenant()
  
  // Get initial preset from tenant config or default
  const initialPreset = (context?.tenant?.config as Record<string, unknown>)?.theme 
    ? ((context?.tenant?.config as Record<string, unknown>)?.theme as Record<string, unknown>)?.preset as string
    : 'honey_gold'
  
  // Local state for selected preset (allows runtime switching)
  const [selectedPreset, setSelectedPreset] = useState<string>(initialPreset || 'honey_gold')
  
  // Update selected preset when tenant context changes
  useEffect(() => {
    if (initialPreset && initialPreset !== selectedPreset) {
      setSelectedPreset(initialPreset)
    }
  }, [initialPreset])
  
  // Compute theme colors from selected preset + tenant overrides
  const themeColors = useMemo(() => {
    let colors = { ...defaultColors }
    
    const preset = themePresets[selectedPreset]
    if (preset) {
      colors = { ...colors, ...preset }
    }
    
    if (context?.theme?.colors) {
      colors = { ...colors, ...context.theme.colors }
    }
    
    return colors
  }, [selectedPreset, context])
  
  // Inject CSS variables directly into document.documentElement.style
  useEffect(() => {
    const root = document.documentElement
    const c = themeColors
    
    // Primary colors (buttons, links, highlights)
    root.style.setProperty('--honey-500', c.primary)
    root.style.setProperty('--honey-600', c.primary)
    root.style.setProperty('--honey-700', c.primary)
    root.style.setProperty('--primary', c.primary)
    root.style.setProperty('--ring', c.primary)
    
    // Primary foreground (text on primary buttons)
    root.style.setProperty('--warm-900', c.primary_foreground)
    root.style.setProperty('--primary-foreground', c.primary_foreground)
    
    // Secondary colors
    root.style.setProperty('--forest-700', c.secondary)
    root.style.setProperty('--forest-900', c.secondary)
    root.style.setProperty('--secondary', c.secondary)
    root.style.setProperty('--secondary-foreground', c.secondary_foreground)
    
    // Accent colors
    root.style.setProperty('--honey-50', c.accent)
    root.style.setProperty('--honey-100', c.accent)
    root.style.setProperty('--accent', c.accent)
    root.style.setProperty('--accent-foreground', c.accent_foreground)
    
    // Background & foreground
    root.style.setProperty('--warm-50', c.background)
    root.style.setProperty('--background', c.background)
    root.style.setProperty('--foreground', c.foreground)
    
    // Card colors
    root.style.setProperty('--card', c.card)
    root.style.setProperty('--card-foreground', c.card_foreground)
    
    // Muted colors (subtle backgrounds, disabled states)
    root.style.setProperty('--warm-100', c.muted)
    root.style.setProperty('--muted', c.muted)
    root.style.setProperty('--warm-500', c.muted_foreground)
    root.style.setProperty('--muted-foreground', c.muted_foreground)
    
    // Border & input colors
    root.style.setProperty('--warm-200', c.border)
    root.style.setProperty('--border', c.border)
    root.style.setProperty('--input', c.input)
  }, [themeColors])
  
  // Wrap setPreset in useCallback to maintain stable reference
  const handleSetPreset = useCallback((newPreset: string) => {
    setSelectedPreset(newPreset)
  }, [])
  
  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<ThemeContextValue>(() => ({
    colors: themeColors,
    preset: selectedPreset,
    presets: Object.keys(themePresets),
    setPreset: handleSetPreset
  }), [themeColors, selectedPreset, handleSetPreset])
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hook to get current theme colors and setter
export function useTheme() {
  const themeContext = useContext(ThemeContext)
  
  if (!themeContext) {
    return {
      colors: defaultColors,
      gradients: getPageGradients('custom'),
      preset: 'honey_gold',
      presets: Object.keys(themePresets),
      setPreset: () => {}
    }
  }
  
  return themeContext
}
