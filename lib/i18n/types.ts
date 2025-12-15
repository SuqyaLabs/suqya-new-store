// Database translation types for Suqya Store

export type LanguageCode = "fr" | "ar" | "en";

export const DEFAULT_LANGUAGE: LanguageCode = "fr";

export const SUPPORTED_LANGUAGES: LanguageCode[] = ["fr", "ar", "en"];

export interface Language {
  code: LanguageCode;
  native_name: string;
  is_default: boolean;
  is_rtl: boolean;
  is_active: boolean;
}

export interface ProductTranslation {
  product_id: string;
  language_code: LanguageCode;
  name: string;
  short_description: string | null;
  long_description: string | null;
  seo_title: string | null;
  seo_description: string | null;
}

export interface CategoryTranslation {
  category_id: string;
  language_code: LanguageCode;
  name: string;
  description: string | null;
}

export interface VariantTranslation {
  variant_id: string;
  language_code: LanguageCode;
  name: string;
}

// Translated product type (product with its translation applied)
export interface TranslatedProduct {
  id: string;
  slug: string | null;
  price: number;
  images: string[] | null;
  is_online: boolean;
  is_available: boolean;
  visibility: string;
  category_id: string | null;
  // Translated fields
  name: string;
  short_description: string | null;
  long_description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  // Category info
  category_name: string | null;
}

// Translated category type
export interface TranslatedCategory {
  id: string;
  type: string;
  parent_id: string | null;
  // Translated fields
  name: string;
  description: string | null;
}

// Translated variant type
export interface TranslatedVariant {
  id: string;
  product_id: string;
  price_mod: number;
  sku: string | null;
  barcode: string | null;
  track_stock: boolean;
  // Translated fields
  name: string;
}
