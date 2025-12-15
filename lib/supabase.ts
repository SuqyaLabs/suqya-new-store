import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types based on database schema
export interface Category {
  id: string;
  name: string;
  type: string;
  parent_id: string | null;
}

export interface Product {
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
  category?: Category;
}

export interface Variant {
  id: string;
  product_id: string;
  name: string;
  price_mod: number;
  sku: string | null;
  barcode: string | null;
}

export interface CartItem {
  product: Product;
  variant?: Variant;
  quantity: number;
}
