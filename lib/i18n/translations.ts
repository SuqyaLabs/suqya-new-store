import { supabase } from "@/lib/supabase";
import {
  LanguageCode,
  DEFAULT_LANGUAGE,
  TranslatedProduct,
  TranslatedCategory,
  TranslatedVariant,
} from "./types";

interface ProductRow {
  id: string;
  name: string;
  slug: string | null;
  price: number | string;
  short_description: string | null;
  long_description: string | null;
  images: string[] | null;
  is_online: boolean;
  is_available: boolean;
  visibility: string;
  category_id: string | null;
  product_translations?: {
    name: string;
    short_description: string | null;
    long_description: string | null;
    seo_title: string | null;
    seo_description: string | null;
  }[];
  categories?: {
    id: string;
    name: string;
    type: string;
    category_translations?: {
      name: string;
      description: string | null;
    }[];
  } | null;
}

interface CategoryRow {
  id: string;
  name: string;
  type: string;
  parent_id: string | null;
  category_translations?: {
    name: string;
    description: string | null;
  }[];
}

interface VariantRow {
  id: string;
  product_id: string;
  name: string;
  price_mod: number | string;
  sku: string | null;
  barcode: string | null;
  track_stock: boolean;
  variant_translations?: {
    name: string;
  }[];
}

// Get image URLs from product
function getProductImages(row: ProductRow): string[] | null {
  const images = (row.images || []).filter(
    (u): u is string => typeof u === "string" && u.length > 0
  );
  return images.length > 0 ? images : null;
}

// Normalize product row with translations
function normalizeTranslatedProduct(row: ProductRow): TranslatedProduct {
  const translation = row.product_translations?.[0];
  const categoryTranslation = row.categories?.category_translations?.[0];

  return {
    id: row.id,
    slug: row.slug,
    price: Number(row.price),
    images: getProductImages(row),
    is_online: row.is_online,
    is_available: row.is_available,
    visibility: row.visibility,
    category_id: row.category_id,
    // Use translation if available, fallback to original
    name: translation?.name || row.name,
    short_description: translation?.short_description || row.short_description,
    long_description: translation?.long_description || row.long_description,
    seo_title: translation?.seo_title || null,
    seo_description: translation?.seo_description || null,
    // Category with translation
    category_name:
      categoryTranslation?.name || row.categories?.name || null,
  };
}

// Normalize category row with translations
function normalizeTranslatedCategory(row: CategoryRow): TranslatedCategory {
  const translation = row.category_translations?.[0];

  return {
    id: row.id,
    type: row.type,
    parent_id: row.parent_id,
    name: translation?.name || row.name,
    description: translation?.description || null,
  };
}

// Normalize variant row with translations
function normalizeTranslatedVariant(row: VariantRow): TranslatedVariant {
  const translation = row.variant_translations?.[0];

  return {
    id: row.id,
    product_id: row.product_id,
    price_mod: Number(row.price_mod),
    sku: row.sku,
    barcode: row.barcode,
    track_stock: row.track_stock,
    name: translation?.name || row.name,
  };
}

/**
 * Get all products with translations for a specific language
 * Falls back to French if translation not found, then to original product name
 */
export async function getTranslatedProducts(
  locale: LanguageCode = DEFAULT_LANGUAGE
): Promise<TranslatedProduct[]> {
  // Try fetching with requested locale first
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      slug,
      price,
      short_description,
      long_description,
      images,
      is_online,
      is_available,
      visibility,
      category_id,
      product_translations!left (
        name,
        short_description,
        long_description,
        seo_title,
        seo_description
      ),
      categories!products_category_id_fkey (
        id,
        name,
        type,
        category_translations!left (
          name,
          description
        )
      )
    `
    )
    .eq("product_translations.language_code", locale)
    .eq("categories.category_translations.language_code", locale)
    .or("short_description.not.is.null,long_description.not.is.null")
    .eq("is_available", true)
    .eq("is_online", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching translated products:", error);
    return [];
  }

  const products = ((data || []) as unknown as ProductRow[]).map(
    normalizeTranslatedProduct
  );

  // If locale is not French, fetch French fallbacks for products missing translations
  if (locale !== DEFAULT_LANGUAGE) {
    const productsNeedingFallback = products.filter(
      (p) => !p.name || p.name === ""
    );

    if (productsNeedingFallback.length > 0) {
      const fallbackIds = productsNeedingFallback.map((p) => p.id);
      const { data: fallbackData } = await supabase
        .from("product_translations")
        .select("product_id, name, short_description, long_description")
        .eq("language_code", DEFAULT_LANGUAGE)
        .in("product_id", fallbackIds);

      if (fallbackData) {
        const fallbackMap = new Map(
          fallbackData.map((f) => [f.product_id, f])
        );
        products.forEach((p) => {
          if (!p.name) {
            const fallback = fallbackMap.get(p.id);
            if (fallback) {
              p.name = fallback.name;
              p.short_description =
                p.short_description || fallback.short_description;
              p.long_description =
                p.long_description || fallback.long_description;
            }
          }
        });
      }
    }
  }

  return products;
}

/**
 * Get products by category with translations
 */
export async function getTranslatedProductsByCategory(
  categoryName: string,
  locale: LanguageCode = DEFAULT_LANGUAGE
): Promise<TranslatedProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      slug,
      price,
      short_description,
      long_description,
      images,
      is_online,
      is_available,
      visibility,
      category_id,
x
        name,
        short_description,
        long_description,
        seo_title,
        seo_description
      ),
      categories!products_category_id_fkey (
        id,
        name,
        type,
        category_translations!left (
          name,
          description
        )
      )
    `
    )
    .eq("product_translations.language_code", locale)
    .eq("categories.category_translations.language_code", locale)
    .eq("is_available", true)
    .eq("is_online", true)
    .order("price", { ascending: true });

  if (error) {
    console.error("Error fetching translated products by category:", error);
    return [];
  }

  return ((data || []) as unknown as ProductRow[])
    .filter((row) => {
      const categoryOriginalName = row.categories?.name;
      const categoryTranslatedName =
        row.categories?.category_translations?.[0]?.name;
      const nameToCheck = categoryTranslatedName || categoryOriginalName;
      return (
        typeof nameToCheck === "string" &&
        nameToCheck.toLowerCase().includes(categoryName.toLowerCase())
      );
    })
    .map(normalizeTranslatedProduct);
}

/**
 * Get single product by ID with translations
 */
export async function getTranslatedProductById(
  id: string,
  locale: LanguageCode = DEFAULT_LANGUAGE
): Promise<TranslatedProduct | null> {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      slug,
      price,
      short_description,
      long_description,
      images,
      is_online,
      is_available,
      visibility,
      category_id,
      product_translations!left (
        name,
        short_description,
        long_description,
        seo_title,
        seo_description
      ),
      categories!products_category_id_fkey (
        id,
        name,
        type,
        category_translations!left (
          name,
          description
        )
      )
    `
    )
    .eq("product_translations.language_code", locale)
    .eq("categories.category_translations.language_code", locale)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching translated product:", error);

    // Try without translation filter for fallback
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("products")
      .select(
        `
        id,
        name,
        slug,
        price,
        short_description,
        long_description,
        images,
        is_online,
        is_available,
        visibility,
        category_id,
        categories!products_category_id_fkey (
          id,
          name,
          type
        )
      `
      )
      .eq("id", id)
      .single();

    if (fallbackError) {
      return null;
    }

    return normalizeTranslatedProduct(fallbackData as unknown as ProductRow);
  }

  return normalizeTranslatedProduct(data as unknown as ProductRow);
}

/**
 * Get single product by slug with translations
 */
export async function getTranslatedProductBySlug(
  slug: string,
  locale: LanguageCode = DEFAULT_LANGUAGE
): Promise<TranslatedProduct | null> {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      slug,
      price,
      short_description,
      long_description,
      images,
      is_online,
      is_available,
      visibility,
      category_id,
      product_translations!left (
        name,
        short_description,
        long_description,
        seo_title,
        seo_description
      ),
      categories!products_category_id_fkey (
        id,
        name,
        type,
        category_translations!left (
          name,
          description
        )
      )
    `
    )
    .eq("product_translations.language_code", locale)
    .eq("categories.category_translations.language_code", locale)
    .eq("slug", slug)
    .single();

  if (error) {
    // Try without translation filter for fallback
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("products")
      .select(
        `
        id,
        name,
        slug,
        price,
        short_description,
        long_description,
        images,
        is_online,
        is_available,
        visibility,
        category_id,
        categories!products_category_id_fkey (
          id,
          name,
          type
        )
      `
      )
      .eq("slug", slug)
      .single();

    if (fallbackError) {
      return null;
    }

    return normalizeTranslatedProduct(fallbackData as unknown as ProductRow);
  }

  return normalizeTranslatedProduct(data as unknown as ProductRow);
}

/**
 * Get all categories with translations
 */
export async function getTranslatedCategories(
  locale: LanguageCode = DEFAULT_LANGUAGE
): Promise<TranslatedCategory[]> {
  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      id,
      name,
      type,
      parent_id,
      category_translations!left (
        name,
        description
      )
    `
    )
    .eq("category_translations.language_code", locale)
    .eq("type", "retail")
    .order("name");

  if (error) {
    console.error("Error fetching translated categories:", error);
    return [];
  }

  return ((data || []) as unknown as CategoryRow[]).map(
    normalizeTranslatedCategory
  );
}

/**
 * Get variants for a product with translations
 */
export async function getTranslatedVariants(
  productId: string,
  locale: LanguageCode = DEFAULT_LANGUAGE
): Promise<TranslatedVariant[]> {
  const { data, error } = await supabase
    .from("variants")
    .select(
      `
      id,
      product_id,
      name,
      price_mod,
      sku,
      barcode,
      track_stock,
      variant_translations!left (
        name
      )
    `
    )
    .eq("variant_translations.language_code", locale)
    .eq("product_id", productId)
    .order("price_mod", { ascending: true });

  if (error) {
    console.error("Error fetching translated variants:", error);
    return [];
  }

  return ((data || []) as unknown as VariantRow[]).map(
    normalizeTranslatedVariant
  );
}

/**
 * Search products across all translations
 */
export async function searchTranslatedProducts(
  query: string,
  locale: LanguageCode = DEFAULT_LANGUAGE
): Promise<TranslatedProduct[]> {
  // Search in product_translations for the current locale
  const { data: translationMatches, error: translationError } = await supabase
    .from("product_translations")
    .select("product_id")
    .eq("language_code", locale)
    .or(
      `name.ilike.%${query}%,short_description.ilike.%${query}%,long_description.ilike.%${query}%`
    );

  if (translationError) {
    console.error("Error searching translations:", translationError);
    return [];
  }

  const productIds = translationMatches?.map((t) => t.product_id) || [];

  // Also search in original product names as fallback
  const { data: originalMatches, error: originalError } = await supabase
    .from("products")
    .select("id")
    .or(`name.ilike.%${query}%,short_description.ilike.%${query}%`)
    .eq("is_available", true)
    .eq("is_online", true);

  if (originalError) {
    console.error("Error searching products:", originalError);
  }

  const originalIds = originalMatches?.map((p) => p.id) || [];
  const allIds = Array.from(new Set([...productIds, ...originalIds]));

  if (allIds.length === 0) {
    return [];
  }

  // Fetch full product data for matches
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      slug,
      price,
      short_description,
      long_description,
      images,
      is_online,
      is_available,
      visibility,
      category_id,
      product_translations!left (
        name,
        short_description,
        long_description,
        seo_title,
        seo_description
      ),
      categories!products_category_id_fkey (
        id,
        name,
        type,
        category_translations!left (
          name,
          description
        )
      )
    `
    )
    .eq("product_translations.language_code", locale)
    .eq("categories.category_translations.language_code", locale)
    .in("id", allIds)
    .eq("is_available", true)
    .eq("is_online", true);

  if (error) {
    console.error("Error fetching search results:", error);
    return [];
  }

  return ((data || []) as unknown as ProductRow[]).map(
    normalizeTranslatedProduct
  );
}
