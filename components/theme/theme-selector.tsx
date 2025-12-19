'use client'

import { useRef, useEffect, useState } from 'react'
import { Check, Palette, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from './tenant-theme-provider'
import { cn } from '@/lib/utils'

// Theme preset metadata
const presetMeta: Record<string, { name: string; name_ar: string; colors: string[] }> = {
  honey_gold: {
    name: 'Or Miel Royal',
    name_ar: 'عسل ملكي',
    colors: ['#D97706', '#92400E', '#FFFBEB']
  },
  nutrition_green: {
    name: 'Vert Nutrition',
    name_ar: 'أخضر التغذية',
    colors: ['#22C55E', '#166534', '#86EFAC']
  },
  fashion_noir: {
    name: 'Noir Mode',
    name_ar: 'أسود الموضة',
    colors: ['#18181B', '#F4F4F5', '#E4E4E7']
  },
  ocean_blue: {
    name: 'Bleu Océan',
    name_ar: 'أزرق المحيط',
    colors: ['#0EA5E9', '#0369A1', '#BAE6FD']
  },
  warm_terracotta: {
    name: 'Terracotta',
    name_ar: 'تيراكوتا',
    colors: ['#EA580C', '#9A3412', '#FED7AA']
  }
}

interface ThemeSelectorProps {
  onSelect?: (presetId: string) => void
  locale?: 'fr' | 'ar' | 'en'
  className?: string
}

export function ThemeSelector({ onSelect, locale = 'fr', className }: ThemeSelectorProps) {
  const { preset: currentPreset, presets, setPreset } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleSelect = (presetId: string) => {
    setPreset(presetId)
    setIsOpen(false)
    onSelect?.(presetId)
  }

  const getPresetName = (presetId: string) => {
    const meta = presetMeta[presetId]
    if (!meta) return presetId
    return locale === 'ar' ? meta.name_ar : meta.name
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Palette className="h-4 w-4" />
        <span className="hidden sm:inline">{getPresetName(currentPreset)}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-56 rounded-md border bg-card shadow-lg z-50">
          <div className="p-2 text-sm font-medium text-muted-foreground border-b">
            {locale === 'ar' ? 'اختر السمة' : 'Choisir un thème'}
          </div>
          <div className="p-1">
            {presets.map((presetId) => {
              const meta = presetMeta[presetId]
              const isSelected = presetId === currentPreset
              
              return (
                <button
                  key={presetId}
                  onClick={() => handleSelect(presetId)}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2 text-sm rounded-md",
                    "hover:bg-muted transition-colors cursor-pointer",
                    isSelected && "bg-muted"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-1">
                      {meta?.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full border border-white shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span>{getPresetName(presetId)}</span>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// Color swatch preview component
interface ColorSwatchProps {
  colors: string[]
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ColorSwatch({ colors, size = 'md', className }: ColorSwatchProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  }

  return (
    <div className={cn("flex -space-x-1", className)}>
      {colors.map((color, i) => (
        <div
          key={i}
          className={cn(
            "rounded-full border border-white shadow-sm",
            sizeClasses[size]
          )}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  )
}
