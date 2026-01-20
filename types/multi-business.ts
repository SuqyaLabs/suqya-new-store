// ============================================
// MULTI-BUSINESS PLATFORM TYPE DEFINITIONS
// ============================================

// Business Types
export type BusinessTypeId = 
  | 'nutrition'
  | 'retail'
  | 'clothing'
  | 'restaurant'
  | 'services'
  | 'kitchenware'
  | 'electronics'
  | 'honey'
  | 'custom';

// Business configuration stored in default_config
export interface BusinessConfig {
  products?: {
    require_nutrition_info?: boolean;
    require_barcode?: boolean;
    track_inventory?: boolean;
    require_size_chart?: boolean;
    variant_attributes?: string[];
    printer_routing?: boolean;
    modifiers_enabled?: boolean;
  };
  orders?: {
    types?: string[];
    allow_scheduling?: boolean;
    allow_appointments?: boolean;
  };
}

export interface BusinessType {
  id: BusinessTypeId;
  name: string;
  name_ar?: string;
  name_en?: string;
  description?: string;
  icon?: string;
  default_config: BusinessConfig;
  product_schema: Record<string, CustomFieldSchema>;
  order_schema: Record<string, CustomFieldSchema>;
  customer_schema: Record<string, CustomFieldSchema>;
  default_features: string[];
  default_theme: Partial<ThemeColors>;
  is_active: boolean;
  sort_order: number;
}

// Tenant Configuration
export interface TenantConfig {
  brand?: {
    name?: string;
    name_en?: string;
    tagline?: string;
    tagline_ar?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  business?: {
    type: BusinessTypeId;
    subtype?: string;
    industry?: string;
  };
  features?: Record<string, boolean>;
  products?: {
    types_enabled?: ('simple' | 'variable' | 'composite' | 'subscription')[];
    custom_fields?: string[];
    variant_attributes?: string[];
    require_weight?: boolean;
    require_nutrition_info?: boolean;
    require_size_chart?: boolean;
    modifiers_enabled?: boolean;
    printer_routing?: boolean;
  };
  orders?: {
    types?: ('delivery' | 'pickup' | 'dine_in' | 'takeaway')[];
    payment_methods?: ('cod' | 'cib' | 'edahabia' | 'transfer')[];
    shipping_methods?: ('yalidine' | 'ems' | 'pickup')[];
    allow_scheduling?: boolean;
    allow_tips?: boolean;
    allow_returns?: boolean;
    return_window_days?: number;
    service_charge_percent?: number;
    min_order_amount?: number;
  };
  theme?: {
    preset?: string;
    colors?: Partial<ThemeColors>;
  };
  localization?: {
    default_language?: 'fr' | 'ar' | 'en';
    supported_languages?: ('fr' | 'ar' | 'en')[];
    currency?: string;
    timezone?: string;
  };
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  owner_email: string;
  owner_phone?: string;
  business_name: string;
  business_address?: string;
  tax_id?: string;
  status: 'active' | 'inactive' | 'suspended' | 'trial';
  config: TenantConfig;
  business_type: BusinessTypeId;
  created_at: string;
  updated_at: string;
  trial_ends_at?: string;
  activated_at?: string;
  suspended_at?: string;
  cancelled_at?: string;
}

// Feature Flags
export interface FeatureFlag {
  id: string;
  tenant_id?: string;
  flag_key: string;
  is_enabled: boolean;
  rollout_percentage: number;
  conditions?: Record<string, unknown>;
  description?: string;
  created_at: string;
  updated_at: string;
}

export type FeatureKey =
  | 'subscriptions'
  | 'loyalty'
  | 'reviews'
  | 'wishlists'
  | 'bundles'
  | 'coupons'
  | 'appointments'
  | 'meal_plans'
  | 'size_charts'
  | 'modifiers'
  | 'pos'
  | 'ecommerce'
  | 'inventory'
  | 'tables'
  | 'kitchen_display';

// Custom Fields
export type CustomFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'boolean'
  | 'date'
  | 'select'
  | 'multiselect'
  | 'json'
  | 'image'
  | 'file';

export type CustomFieldEntityType =
  | 'product'
  | 'category'
  | 'customer'
  | 'order'
  | 'variant';

export interface CustomFieldSchema {
  type: CustomFieldType;
  label: string;
  label_ar?: string;
  label_en?: string;
  placeholder?: string;
  help_text?: string;
  required?: boolean;
  unit?: string;
  options?: string[] | { value: string; label: string; label_ar?: string; label_en?: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
  default_value?: unknown;
}

export interface CustomFieldDefinition {
  id: string;
  tenant_id: string;
  entity_type: CustomFieldEntityType;
  field_key: string;
  field_type: CustomFieldType;
  label: string;
  label_ar?: string;
  label_en?: string;
  placeholder?: string;
  help_text?: string;
  is_required: boolean;
  validation_rules?: Record<string, unknown>;
  default_value?: string;
  options?: { value: string; label: string }[];
  unit?: string;
  display_order: number;
  display_in_list: boolean;
  display_in_filters: boolean;
  group_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomFieldValue {
  id: string;
  tenant_id: string;
  field_definition_id: string;
  entity_type: CustomFieldEntityType;
  entity_id: string;
  value_text?: string;
  value_number?: number;
  value_boolean?: boolean;
  value_date?: string;
  value_json?: unknown;
  created_at: string;
  updated_at: string;
}

// Parsed custom field with metadata
export interface ParsedCustomField {
  value: unknown;
  label: string;
  type: CustomFieldType;
  unit?: string;
}

// Theme System
export interface ThemeColors {
  primary: string;
  primary_foreground: string;
  secondary: string;
  secondary_foreground: string;
  background: string;
  foreground: string;
  card: string;
  card_foreground: string;
  muted: string;
  muted_foreground: string;
  accent: string;
  accent_foreground: string;
  border: string;
  input: string;
  ring: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ThemeTypography {
  font_sans: string;
  font_heading: string;
  font_arabic: string;
  font_size_base?: string;
  line_height_base?: string;
}

export interface ThemeLayout {
  border_radius: string;
  container_max_width: string;
  spacing_unit?: string;
}

export interface Theme {
  id: string;
  tenant_id: string;
  name: string;
  is_active: boolean;
  colors: ThemeColors;
  typography: ThemeTypography;
  layout: ThemeLayout;
  components?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  name_ar?: string;
  name_en?: string;
  business_types: BusinessTypeId[];
  colors: Partial<ThemeColors>;
  typography?: Partial<ThemeTypography>;
  layout?: Partial<ThemeLayout>;
  preview_image?: string;
}

// Full Tenant Context (returned by get_tenant_config)
export interface TenantContext {
  tenant: {
    id: string;
    name: string;
    slug: string;
    business_type: BusinessTypeId;
    config: TenantConfig;
  };
  business_type: {
    id: BusinessTypeId;
    name: string;
    product_schema: Record<string, CustomFieldSchema>;
    default_features: string[];
  };
  theme: {
    colors: ThemeColors;
    typography: ThemeTypography;
    layout: ThemeLayout;
  } | null;
  features: FeatureKey[];
}

// Business Rules
export type BusinessRuleType = 
  | 'validation'
  | 'calculation'
  | 'workflow'
  | 'constraint';

export interface BusinessRule {
  id: string;
  tenant_id?: string;
  name: string;
  description?: string;
  rule_type: BusinessRuleType;
  trigger_event: string;
  conditions: Record<string, unknown>; // JSON Logic format
  actions: BusinessRuleAction[];
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BusinessRuleAction {
  type: 'set_field' | 'add_fee' | 'error' | 'aggregate' | 'notify' | 'trigger_workflow';
  field?: string;
  value?: unknown;
  message?: string;
  operation?: string;
  source?: string;
  percentage?: number;
}

// Workflow System
export type WorkflowTriggerType = 
  | 'event'
  | 'schedule'
  | 'manual'
  | 'webhook';

export interface Workflow {
  id: string;
  tenant_id?: string;
  name: string;
  description?: string;
  trigger_type: WorkflowTriggerType;
  trigger_config: Record<string, unknown>;
  steps: WorkflowStep[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkflowStep {
  id: string;
  type: 'condition' | 'action' | 'wait' | 'loop';
  config: Record<string, unknown>;
  next?: string;
  next_true?: string;
  next_false?: string;
}

// Component Registry Types
export type ComponentKey =
  | 'ProductCard'
  | 'ProductDetails'
  | 'CartDrawer'
  | 'CheckoutForm'
  | 'CategoryGrid'
  | 'ProductFilters'
  | 'OrderSummary'
  | 'CustomerDashboard';

export type ComponentRegistry = Record<
  BusinessTypeId | 'default',
  Partial<Record<ComponentKey, () => Promise<{ default: React.ComponentType<unknown> }>>>
>;

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

// Nutrition-specific types
export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sodium?: number;
  sugar?: number;
}

export interface MealPlanItem {
  product_id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  day_of_week: number; // 0-6
  quantity: number;
}

// Clothing-specific types
export interface SizeChartEntry {
  size: string;
  chest?: string;
  waist?: string;
  hips?: string;
  length?: string;
  shoulder?: string;
}

export interface ProductVariantOption {
  attribute: 'size' | 'color' | string;
  value: string;
  label: string;
  label_ar?: string;
  color_hex?: string; // For color swatches
  in_stock?: boolean;
}

// Restaurant-specific types
export interface ProductModifier {
  id: string;
  name: string;
  name_ar?: string;
  options: ModifierOption[];
  required: boolean;
  multi_select: boolean;
  min_selections?: number;
  max_selections?: number;
}

export interface ModifierOption {
  id: string;
  name: string;
  name_ar?: string;
  price_mod: number;
  is_default?: boolean;
}

export interface TableInfo {
  id: string;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  current_order_id?: string;
}
