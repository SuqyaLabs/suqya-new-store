
import type { BusinessTypeId } from '@/types/multi-business'

export interface PageGradientConfig {
  hero: string
  sectionPrimary: string
  sectionSecondary: string
  cardAccent: string
  cardHighlight: string
  overlay: string
  footer: string
}

export const pageGradientPresets: Record<BusinessTypeId, PageGradientConfig> = {
  nutrition: {
    hero: 'radial-gradient(ellipse at top, rgba(34, 197, 94, 0.15) 0%, var(--background) 70%)',
    sectionPrimary: 'linear-gradient(135deg, rgba(220, 252, 231, 0.6) 0%, var(--background) 100%)',
    sectionSecondary: 'linear-gradient(to bottom, var(--background), rgba(240, 253, 244, 0.5))',
    cardAccent: 'linear-gradient(135deg, rgba(187, 247, 208, 0.4), rgba(220, 252, 231, 0.3))',
    cardHighlight: 'radial-gradient(circle at top right, rgba(134, 239, 172, 0.3), transparent 70%)',
    overlay: 'linear-gradient(to bottom, transparent, rgba(34, 197, 94, 0.03))',
    footer: 'linear-gradient(to bottom, #14532d, #052e16)'
  },
  retail: {
    hero: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
    sectionPrimary: 'linear-gradient(to bottom right, #f0f9ff, var(--background))', // sky-50
    sectionSecondary: 'linear-gradient(to bottom, var(--background), #f0f9ff)',
    cardAccent: 'linear-gradient(135deg, #e0f2fe, #f0f9ff)', // sky-100
    cardHighlight: 'radial-gradient(circle at top right, #bae6fd, transparent 70%)', // sky-200
    overlay: 'linear-gradient(to bottom, transparent, rgba(14, 165, 233, 0.03))', // sky-500
    footer: 'linear-gradient(to bottom, var(--warm-900), #0c4a6e)' // sky-900
  },
  clothing: {
    hero: 'radial-gradient(circle at center, #fafafa 0%, #e4e4e7 100%)',
    sectionPrimary: 'linear-gradient(to bottom right, #fafafa, #ffffff)',
    sectionSecondary: 'linear-gradient(to bottom, #ffffff, #fafafa)',
    cardAccent: 'linear-gradient(135deg, #f4f4f5, #ffffff)',
    cardHighlight: 'radial-gradient(circle at top right, #e4e4e7, transparent 70%)',
    overlay: 'linear-gradient(to bottom, transparent, rgba(24, 24, 27, 0.02))',
    footer: 'linear-gradient(to bottom, #18181b, #09090b)'
  },
  restaurant: {
    hero: 'linear-gradient(to bottom, var(--warm-50), var(--background))',
    sectionPrimary: 'linear-gradient(to bottom right, #fff7ed, var(--background))', // orange-50
    sectionSecondary: 'linear-gradient(to bottom, var(--background), #fff7ed)',
    cardAccent: 'linear-gradient(135deg, #ffedd5, #fff7ed)', // orange-100
    cardHighlight: 'radial-gradient(circle at top right, #fed7aa, transparent 70%)', // orange-200
    overlay: 'linear-gradient(to bottom, transparent, rgba(234, 88, 12, 0.03))', // orange-600
    footer: 'linear-gradient(to bottom, var(--warm-900), #431407)' // orange-950
  },
  services: {
    hero: 'radial-gradient(circle at top, #f0f9ff 0%, var(--background) 100%)',
    sectionPrimary: 'linear-gradient(to bottom right, #f8fafc, var(--background))', // slate-50
    sectionSecondary: 'linear-gradient(to bottom, var(--background), #f8fafc)',
    cardAccent: 'linear-gradient(135deg, #f1f5f9, #f8fafc)', // slate-100
    cardHighlight: 'radial-gradient(circle at top right, #e2e8f0, transparent 70%)', // slate-200
    overlay: 'linear-gradient(to bottom, transparent, rgba(15, 23, 42, 0.02))', // slate-900
    footer: 'linear-gradient(to bottom, var(--warm-900), #0f172a)' // slate-900
  },
  custom: {
    hero: 'linear-gradient(to bottom right, var(--primary), var(--secondary))',
    sectionPrimary: 'linear-gradient(to bottom right, var(--muted), var(--background))',
    sectionSecondary: 'linear-gradient(to bottom, var(--background), var(--muted))',
    cardAccent: 'linear-gradient(135deg, var(--muted), var(--background))',
    cardHighlight: 'radial-gradient(circle at top right, var(--accent), transparent 70%)',
    overlay: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.02))',
    footer: 'linear-gradient(to bottom, var(--warm-900), black)'
  },
  kitchenware: {
    hero: 'linear-gradient(to bottom right, #fff7ed, #ffedd5)',
    sectionPrimary: 'linear-gradient(to bottom right, #fff7ed, var(--background))',
    sectionSecondary: 'linear-gradient(to bottom, var(--background), #fff7ed)',
    cardAccent: 'linear-gradient(135deg, #ffedd5, #fff7ed)',
    cardHighlight: 'radial-gradient(circle at top right, #fed7aa, transparent 70%)',
    overlay: 'linear-gradient(to bottom, transparent, rgba(234, 88, 12, 0.03))',
    footer: 'linear-gradient(to bottom, #7c2d12, #431407)'
  },
  electronics: {
    hero: 'linear-gradient(to right, #f8fafc, #ecfeff)',
    sectionPrimary: 'linear-gradient(to bottom right, #f8fafc, var(--background))',
    sectionSecondary: 'linear-gradient(to bottom, var(--background), #ecfeff)',
    cardAccent: 'linear-gradient(135deg, #f1f5f9, #ecfeff)',
    cardHighlight: 'radial-gradient(circle at top right, #cffafe, transparent 70%)',
    overlay: 'linear-gradient(to bottom, transparent, rgba(6, 182, 212, 0.03))',
    footer: 'linear-gradient(to bottom, #0e7490, #164e63)'
  }
}

export function getPageGradients(businessType: BusinessTypeId): PageGradientConfig {
  return pageGradientPresets[businessType] || pageGradientPresets.custom
}
