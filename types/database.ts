export interface ProductData {
  id: string;
  tenant_id: string;
  pb_id: string;
  name: string;
  type: "simple" | "variable" | "composite";
  barcode?: string;
  sku?: string;
  price: number;
  cost_price?: number;
  track_stock?: boolean;
  is_available: boolean;
  printer_dest?: string;
  image?: string;
  created_at: string;
  updated_at: string;
  pb_updated_at?: string;
  sync_version?: number;
  category_id?: string;
  brand?: string;
  weight?: number;
  weight_unit?: string;
  is_weight_based?: boolean;
  tax_class?: string;
  season?: string;
  gender?: string;
  material?: string;
  visibility?: string;
  slug?: string;
  is_online?: boolean;
  short_description?: string;
  long_description?: string;
  images?: string[];
  seo_title?: string;
  seo_description?: string;
  low_stock_threshold?: number;
  is_popular?: boolean;
  category_name?: string;
  category?: {
    id: string;
    name: string;
  };
}

export interface CategoryData {
  id: string;
  tenant_id: string;
  pb_id: string;
  name: string;
  type: "retail" | "hospitality" | "service";
  created_at: string;
  updated_at: string;
  pb_updated_at?: string;
  sync_version?: number;
  parent_id?: string;
}

export interface VariantData {
  id: string;
  pb_id: string;
  tenant_id: string;
  product_id: string;
  product_pb_id?: string;
  name: string;
  price_mod?: number;
  barcode?: string;
  sku?: string;
  track_stock?: boolean;
  created_at: string;
  updated_at: string;
  pb_updated_at?: string;
  sync_version?: number;
}
