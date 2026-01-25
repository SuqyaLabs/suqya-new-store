import type { Metadata } from 'next'
import { getServerTenantContext } from './server'
import type { TenantConfig } from '@/types/multi-business'

const DEFAULT_TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || "c27fb19a-0121-4395-88ca-2cb8374dc52d"

export interface TenantMetadata {
  title: string
  description: string
  keywords: string[]
  favicon: string | null
  logo: string | null
  ogImage: string | null
}

/**
 * Get localized value from config based on locale
 */
function getLocalizedValue(
  base: string | undefined,
  ar: string | undefined,
  en: string | undefined,
  locale: string
): string | undefined {
  if (locale === 'ar' && ar) return ar
  if (locale === 'en' && en) return en
  return base
}

/**
 * Fetch tenant metadata for use in generateMetadata
 */
export async function getTenantMetadata(
  locale: string = 'fr',
  tenantId: string = DEFAULT_TENANT_ID
): Promise<TenantMetadata> {
  const context = await getServerTenantContext(tenantId)
  
  const tenant = context?.tenant
  const config = tenant?.config as TenantConfig | undefined
  const brand = config?.brand
  const seo = config?.seo
  
  // Build title
  const brandName = getLocalizedValue(
    brand?.name,
    brand?.name_ar,
    brand?.name_en,
    locale
  ) || tenant?.name || 'Suqya'
  
  const siteTitle = getLocalizedValue(
    seo?.site_title,
    seo?.site_title_ar,
    seo?.site_title_en,
    locale
  )
  
  const title = siteTitle || brandName
  
  // Build description
  const description = getLocalizedValue(
    seo?.description || brand?.tagline,
    seo?.description_ar || brand?.tagline_ar,
    seo?.description_en || brand?.tagline_en,
    locale
  ) || 'Miel Bio d\'Algérie'
  
  return {
    title,
    description,
    keywords: seo?.keywords || [],
    favicon: brand?.favicon || null,
    logo: brand?.logo || null,
    ogImage: brand?.og_image || null,
  }
}

/**
 * Generate Next.js Metadata object from tenant config
 */
export async function generateTenantMetadata(
  locale: string = 'fr',
  tenantId: string = DEFAULT_TENANT_ID
): Promise<Metadata> {
  const meta = await getTenantMetadata(locale, tenantId)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
      default: meta.title,
      template: `%s | ${meta.title}`,
    },
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'website',
      locale: locale === 'ar' ? 'ar_DZ' : locale === 'en' ? 'en_US' : 'fr_DZ',
    },
  }
  
  // Add favicon if configured
  if (meta.favicon) {
    const faviconUrl = meta.favicon.startsWith('http') 
      ? meta.favicon 
      : `${baseUrl}${meta.favicon.startsWith('/') ? '' : '/'}${meta.favicon}`
      
    metadata.icons = {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    }
  }
  
  // Add OG image if configured
  if (meta.ogImage) {
    const ogImageUrl = meta.ogImage.startsWith('http') 
      ? meta.ogImage 
      : `${baseUrl}${meta.ogImage.startsWith('/') ? '' : '/'}${meta.ogImage}`
      
    metadata.openGraph = {
      ...metadata.openGraph,
      images: [{ url: ogImageUrl }],
    }
  }
  
  return metadata
}
