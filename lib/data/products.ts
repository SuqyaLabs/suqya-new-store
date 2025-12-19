import { supabase } from "@/lib/supabase";

const SUPABASE_PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID;

interface ProductMediaData {
  storage_bucket: string;
  storage_path: string;
  position: number;
  is_primary: boolean;
  created_at: string;
}

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
  categories?: { name: string } | null;
  product_media?: ProductMediaData[] | null;
}

function encodeStoragePath(path: string) {
  return path
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

function buildPublicStorageUrl(bucket: string, path: string) {
  if (!SUPABASE_PUBLIC_URL) return null;
  return `${SUPABASE_PUBLIC_URL}/storage/v1/object/public/${bucket}/${encodeStoragePath(path)}`;
}

function normalizeProductRow(row: ProductRow): ProductData {
  const media = (row.product_media || [])
    .slice()
    .sort((a, b) => {
      if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
      if (a.position !== b.position) return a.position - b.position;
      return a.created_at.localeCompare(b.created_at);
    });

  const mediaUrls = media
    .map((m) => buildPublicStorageUrl(m.storage_bucket, m.storage_path))
    .filter((u): u is string => typeof u === "string" && u.length > 0);

  const fallbackUrls = (row.images || []).filter((u): u is string => typeof u === "string");
  const merged = [...mediaUrls, ...fallbackUrls];
  const images = merged.length > 0 ? Array.from(new Set(merged)) : null;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: Number(row.price),
    short_description: row.short_description,
    long_description: row.long_description,
    images,
    is_online: row.is_online,
    is_available: row.is_available,
    visibility: row.visibility,
    category_id: row.category_id,
    category_name: row.categories?.name || null,
  };
}

export interface ProductData {
  id: string;
  name: string;
  slug: string | null;
  price: number;
  short_description: string | null;
  long_description: string | null;
  images: string[] | null;
  is_online: boolean;
  is_available: boolean;
  visibility: string;
  category_id: string | null;
  category_name: string | null;
}

export interface CategoryData {
  id: string;
  name: string;
  type: string;
}

// Get all honey products (retail type with category)
export async function getHoneyProducts(): Promise<ProductData[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`
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
      product_media (
        storage_bucket,
        storage_path,
        position,
        is_primary,
        created_at
      ),
      categories!products_category_id_fkey (
        id,
        name,
        type
      )
    `)
    .eq("tenant_id", TENANT_ID)
    .eq("is_available", true)
    .eq("is_online", true)
    .order("is_primary", { referencedTable: "product_media", ascending: false })
    .order("position", { referencedTable: "product_media", ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return ((data || []) as unknown as ProductRow[]).map(normalizeProductRow);
}

// Get products by category
export async function getProductsByCategory(categoryName: string): Promise<ProductData[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`
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
      product_media (
        storage_bucket,
        storage_path,
        position,
        is_primary,
        created_at
      ),
      categories!products_category_id_fkey (
        id,
        name,
        type
      )
    `)
    .eq("tenant_id", TENANT_ID)
    .eq("is_available", true)
    .eq("is_online", true)
    .order("is_primary", { referencedTable: "product_media", ascending: false })
    .order("position", { referencedTable: "product_media", ascending: true })
    .order("price", { ascending: true });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return ((data || []) as unknown as ProductRow[])
    .filter((row) => {
      const name = row.categories?.name;
      return typeof name === "string" && name.toLowerCase().includes(categoryName.toLowerCase());
    })
    .map(normalizeProductRow);
}

// Get single product by ID
export async function getProductById(id: string): Promise<ProductData | null> {
  const { data, error } = await supabase
    .from("products")
    .select(`
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
      product_media (
        storage_bucket,
        storage_path,
        position,
        is_primary,
        created_at
      ),
      categories!products_category_id_fkey (
        id,
        name,
        type
      )
    `)
    .order("is_primary", { referencedTable: "product_media", ascending: false })
    .order("position", { referencedTable: "product_media", ascending: true })
    .eq("tenant_id", TENANT_ID)
    .eq("id", id)
    .eq("is_online", true)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }

  return normalizeProductRow(data as unknown as ProductRow);
}

// Get retail categories
export async function getCategories(): Promise<CategoryData[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, type")
    .eq("tenant_id", TENANT_ID)
    .eq("type", "retail")
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return (data || []) as CategoryData[];
}
