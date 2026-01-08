// Localization utilities for products and categories
// Resolves translations from the database based on locale

import type { LanguageCode } from './types'

export const DEFAULT_LOCALE: LanguageCode = 'fr'

// Translation types from database joins
export interface ProductTranslationRow {
  language_code: LanguageCode
  name: string
  short_description: string | null
  long_description: string | null
  seo_title: string | null
  seo_description: string | null
}

export interface CategoryTranslationRow {
  language_code: LanguageCode
  name: string
  description: string | null
}

export interface VariantTranslationRow {
  language_code: LanguageCode
  name: string
}

// Product with translations joined (Supabase returns category as array)
export interface ProductWithTranslations {
  id: string
  name: string // base name (fallback)
  price: number
  images?: string[] | null
  is_available?: boolean
  is_online?: boolean
  category_id?: string | null
  short_description?: string | null
  long_description?: string | null
  custom_data?: Record<string, unknown>
  compare_at_price?: number | null
  translations?: ProductTranslationRow[]
  // Supabase returns single relations as arrays, we handle both cases
  category?: CategoryWithTranslations | CategoryWithTranslations[] | null
}

// Category with translations joined
export interface CategoryWithTranslations {
  id: string
  name: string // base name (fallback)
  description?: string | null
  translations?: CategoryTranslationRow[]
  product_count?: number
}

// Variant with translations joined
export interface VariantWithTranslations {
  id: string
  name: string
  price_mod: number
  sku?: string | null
  translations?: VariantTranslationRow[]
}

// Localized product (after translation resolution)
export interface LocalizedProduct {
  id: string
  name: string
  price: number
  images?: string[] | null
  is_available?: boolean
  is_online?: boolean
  category_id?: string | null
  short_description?: string | null
  long_description?: string | null
  custom_data?: Record<string, unknown>
  compare_at_price?: number | null
  category_name?: string | null
}

// Localized category
export interface LocalizedCategory {
  id: string
  name: string
  description?: string | null
  product_count?: number
}

/**
 * Get a translated field from a translations array
 * Falls back to default locale (fr), then to base field value
 */
function getTranslatedField<T extends { language_code: LanguageCode }>(
  translations: T[] | undefined | null,
  field: keyof Omit<T, 'language_code'>,
  locale: string,
  fallbackValue: string | null = null
): string | null {
  if (!translations || translations.length === 0) {
    return fallbackValue
  }

  // Try exact locale match
  const exactMatch = translations.find(t => t.language_code === locale)
  if (exactMatch && exactMatch[field] !== null && exactMatch[field] !== undefined) {
    return exactMatch[field] as string
  }

  // Fall back to default locale (fr)
  if (locale !== DEFAULT_LOCALE) {
    const defaultMatch = translations.find(t => t.language_code === DEFAULT_LOCALE)
    if (defaultMatch && defaultMatch[field] !== null && defaultMatch[field] !== undefined) {
      return defaultMatch[field] as string
    }
  }

  // Fall back to any available translation
  const anyMatch = translations.find(t => t[field] !== null && t[field] !== undefined)
  if (anyMatch) {
    return anyMatch[field] as string
  }

  return fallbackValue
}

/**
 * Resolve product translations for a given locale
 */
export function localizeProduct(
  product: ProductWithTranslations,
  locale: string
): LocalizedProduct {
  const name = getTranslatedField(product.translations, 'name', locale, product.name) || product.name
  const shortDescription = getTranslatedField(
    product.translations,
    'short_description',
    locale,
    product.short_description || null
  )
  const longDescription = getTranslatedField(
    product.translations,
    'long_description',
    locale,
    product.long_description || null
  )

  // Resolve category name if category is included
  // Supabase returns single relations as arrays, so we handle both cases
  let categoryName: string | null = null
  if (product.category) {
    const cat = Array.isArray(product.category) ? product.category[0] : product.category
    if (cat) {
      categoryName = getTranslatedField(
        cat.translations,
        'name',
        locale,
        cat.name
      )
    }
  }

  return {
    id: product.id,
    name,
    price: product.price,
    images: product.images,
    is_available: product.is_available,
    is_online: product.is_online,
    category_id: product.category_id,
    short_description: shortDescription,
    long_description: longDescription,
    custom_data: product.custom_data,
    compare_at_price: product.compare_at_price,
    category_name: categoryName,
  }
}

/**
 * Resolve category translations for a given locale
 */
export function localizeCategory(
  category: CategoryWithTranslations,
  locale: string
): LocalizedCategory {
  const name = getTranslatedField(category.translations, 'name', locale, category.name) || category.name
  const description = getTranslatedField(
    category.translations,
    'description',
    locale,
    category.description || null
  )

  return {
    id: category.id,
    name,
    description,
    product_count: category.product_count,
  }
}

/**
 * Resolve variant translations for a given locale
 */
export function localizeVariant(
  variant: VariantWithTranslations,
  locale: string
): { id: string; name: string; price_mod: number; sku?: string | null } {
  const name = getTranslatedField(variant.translations, 'name', locale, variant.name) || variant.name

  return {
    id: variant.id,
    name,
    price_mod: variant.price_mod,
    sku: variant.sku,
  }
}

/**
 * Batch localize products
 */
export function localizeProducts(
  products: ProductWithTranslations[],
  locale: string
): LocalizedProduct[] {
  return products.map(p => localizeProduct(p, locale))
}

/**
 * Batch localize categories
 */
export function localizeCategories(
  categories: CategoryWithTranslations[],
  locale: string
): LocalizedCategory[] {
  return categories.map(c => localizeCategory(c, locale))
}

// Supabase select strings for fetching with translations
export const PRODUCT_WITH_TRANSLATIONS_SELECT = `
  id,
  name,
  price,
  images,
  is_available,
  is_online,
  category_id,
  short_description,
  long_description,
  custom_data,
  translations:product_translations(language_code, name, short_description, long_description, seo_title, seo_description),
  category:categories(
    id,
    name,
    translations:category_translations(language_code, name, description)
  )
`

export const CATEGORY_WITH_TRANSLATIONS_SELECT = `
  id,
  name,
  translations:category_translations(language_code, name, description)
`

export const VARIANT_WITH_TRANSLATIONS_SELECT = `
  id,
  name,
  price_mod,
  sku,
  translations:variant_translations(language_code, name)
`
