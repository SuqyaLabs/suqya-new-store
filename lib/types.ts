// Database types for Suqya Store

export interface Product {
  id: string;
  name: string;
  slug: string | null;
  price: number;
  short_description: string | null;
  long_description: string | null;
  images: string[] | null;
  image: string | null;
  is_online: boolean;
  is_available: boolean;
  visibility: string;
  category_id: string | null;
  category_name?: string | null;
}

export interface Variant {
  id: string;
  product_id: string;
  name: string;
  price_mod: number;
  sku: string | null;
  barcode: string | null;
  track_stock: boolean;
}

export interface Category {
  id: string;
  name: string;
  type: string;
  parent_id: string | null;
}

export interface CartItem {
  productId: string;
  productName: string;
  variantId: string | null;
  variantName: string | null;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderRequest {
  tenantId: string;
  customer: {
    email: string;
    phone: string;
    name: string;
  };
  shipping: {
    address: string;
    wilaya: string;
    commune: string;
    method: "yalidine" | "pickup" | "ems";
  };
  payment: {
    method: "cod" | "cib" | "edahabia" | "transfer";
  };
  items: CartItem[];
  shippingCost: number;
  notes?: string;
  giftMessage?: string;
  isGift?: boolean;
}

export interface OnlineOrder {
  id: string;
  order_number: string;
  customer_email: string;
  customer_phone: string;
  customer_name: string;
  shipping_address: string;
  shipping_wilaya: string;
  shipping_commune: string;
  shipping_method: string;
  shipping_cost: number;
  shipping_status: string;
  payment_method: string;
  payment_status: string;
  subtotal: number;
  total: number;
  notes: string | null;
  is_gift: boolean;
  created_at: string;
}

export interface OnlineOrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  variant_name: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

// Inventory
export interface InventoryLevel {
  id: string;
  product_id: string | null;
  variant_id: string | null;
  qty_on_hand: number;
  qty_reserved: number;
  qty_available: number;
}
