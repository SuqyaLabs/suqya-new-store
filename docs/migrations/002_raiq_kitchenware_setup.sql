-- ============================================
-- RAIQ KITCHENWARE STORE SETUP MIGRATION
-- ============================================
-- Brand: رائق (Raiq) - Premium Kitchenware & Home Essentials
-- Business Type: retail (subtype: kitchenware)
-- Theme: raiq_serene (Sage Green, Warm Sand, Matte Gold)
-- ============================================

BEGIN;

-- ============================================
-- 1. ADD RAIQ THEME PRESET
-- ============================================

INSERT INTO theme_presets (id, name, name_ar, name_en, business_types, colors, typography, layout) VALUES
('raiq_serene', 'رائق الهادئ', 'رائق الهادئ', 'Raiq Serene',
  ARRAY['retail', 'kitchenware', 'home_essentials'],
  '{
    "primary": "#8A9A5B",
    "primary_foreground": "#FFFFFF",
    "secondary": "#E5D3B3",
    "secondary_foreground": "#2D2D2D",
    "accent": "#C5A059",
    "accent_foreground": "#FFFFFF",
    "background": "#F5F5F5",
    "foreground": "#2D2D2D",
    "card": "#FFFFFF",
    "card_foreground": "#2D2D2D",
    "muted": "#F0EDE8",
    "muted_foreground": "#6B6B6B",
    "border": "#E0DCD4",
    "input": "#E0DCD4",
    "ring": "#8A9A5B",
    "success": "#22C55E",
    "warning": "#F59E0B",
    "error": "#EF4444",
    "info": "#3B82F6"
  }',
  '{
    "font_sans": "Montserrat, system-ui, sans-serif",
    "font_heading": "Montserrat, system-ui, sans-serif",
    "font_arabic": "Almarai, system-ui, sans-serif"
  }',
  '{
    "border_radius": "0.5rem",
    "container_max_width": "1200px"
  }'
)
ON CONFLICT (id) DO UPDATE SET
  colors = EXCLUDED.colors,
  typography = EXCLUDED.typography,
  layout = EXCLUDED.layout;

-- ============================================
-- 2. ADD KITCHENWARE BUSINESS TYPE (optional subtype)
-- ============================================

-- Add kitchenware as a specialized retail subtype
INSERT INTO business_types (id, name, name_ar, name_en, icon, default_config, product_schema, default_features, sort_order) VALUES
('kitchenware', 'Ustensiles de cuisine', 'أدوات المطبخ', 'Kitchenware', 'ChefHat',
  '{
    "products": {
      "require_material": true,
      "track_inventory": true,
      "variant_attributes": ["color", "size", "material"]
    },
    "orders": {
      "allow_gift_wrapping": true,
      "types": ["delivery", "pickup"]
    }
  }',
  '{
    "material": {
      "type": "select",
      "label": "Matériau",
      "label_ar": "المادة",
      "label_en": "Material",
      "required": true,
      "options": [
        {"value": "ceramic", "label": "Céramique", "label_ar": "سيراميك", "label_en": "Ceramic"},
        {"value": "wood", "label": "Bois", "label_ar": "خشب", "label_en": "Wood"},
        {"value": "stainless_steel", "label": "Acier inoxydable", "label_ar": "ستانلس ستيل", "label_en": "Stainless Steel"},
        {"value": "glass", "label": "Verre", "label_ar": "زجاج", "label_en": "Glass"},
        {"value": "bamboo", "label": "Bambou", "label_ar": "خيزران", "label_en": "Bamboo"},
        {"value": "silicone", "label": "Silicone", "label_ar": "سيليكون", "label_en": "Silicone"},
        {"value": "cast_iron", "label": "Fonte", "label_ar": "حديد زهر", "label_en": "Cast Iron"},
        {"value": "copper", "label": "Cuivre", "label_ar": "نحاس", "label_en": "Copper"}
      ]
    },
    "dimensions": {
      "type": "text",
      "label": "Dimensions",
      "label_ar": "الأبعاد",
      "label_en": "Dimensions",
      "placeholder": "L x l x H (cm)",
      "help_text": "Format: Longueur x Largeur x Hauteur"
    },
    "weight_grams": {
      "type": "number",
      "label": "Poids",
      "label_ar": "الوزن",
      "label_en": "Weight",
      "unit": "g"
    },
    "care_instructions": {
      "type": "textarea",
      "label": "Instructions d''entretien",
      "label_ar": "تعليمات العناية",
      "label_en": "Care Instructions"
    },
    "warranty_months": {
      "type": "number",
      "label": "Garantie",
      "label_ar": "الضمان",
      "label_en": "Warranty",
      "unit": "mois"
    },
    "is_dishwasher_safe": {
      "type": "boolean",
      "label": "Compatible lave-vaisselle",
      "label_ar": "آمن لغسالة الصحون",
      "label_en": "Dishwasher Safe"
    },
    "is_microwave_safe": {
      "type": "boolean",
      "label": "Compatible micro-ondes",
      "label_ar": "آمن للميكروويف",
      "label_en": "Microwave Safe"
    },
    "is_oven_safe": {
      "type": "boolean",
      "label": "Compatible four",
      "label_ar": "آمن للفرن",
      "label_en": "Oven Safe"
    },
    "max_temperature": {
      "type": "number",
      "label": "Température max",
      "label_ar": "الحرارة القصوى",
      "label_en": "Max Temperature",
      "unit": "°C"
    },
    "capacity_ml": {
      "type": "number",
      "label": "Capacité",
      "label_ar": "السعة",
      "label_en": "Capacity",
      "unit": "ml"
    },
    "country_of_origin": {
      "type": "text",
      "label": "Pays d''origine",
      "label_ar": "بلد المنشأ",
      "label_en": "Country of Origin"
    }
  }',
  ARRAY['pos', 'ecommerce', 'inventory', 'wishlists', 'reviews', 'gift_wrapping'], 2)
ON CONFLICT (id) DO UPDATE SET
  product_schema = EXCLUDED.product_schema,
  default_config = EXCLUDED.default_config;

-- ============================================
-- 3. ENABLE FEATURE FLAGS FOR KITCHENWARE
-- ============================================

-- Enable gift_wrapping feature globally (if not exists)
INSERT INTO feature_flags (tenant_id, flag_key, is_enabled, description) VALUES
(NULL, 'gift_wrapping', true, 'Enable gift wrapping option for orders'),
(NULL, 'product_comparison', false, 'Enable product comparison feature')
ON CONFLICT DO NOTHING;

-- ============================================
-- 4. SAMPLE: CREATE RAIQ TENANT (uncomment and modify)
-- ============================================

-- Uncomment and replace 'your-tenant-uuid' with actual tenant ID to configure
/*
-- Update existing tenant to use Raiq configuration
UPDATE tenants 
SET 
  business_type = 'kitchenware',
  config = jsonb_build_object(
    'business', jsonb_build_object(
      'type', 'retail',
      'subtype', 'kitchenware',
      'industry', 'home_essentials'
    ),
    'features', jsonb_build_object(
      'reviews', true,
      'wishlists', true,
      'gift_wrapping', true,
      'product_comparison', true,
      'loyalty', true
    ),
    'products', jsonb_build_object(
      'types_enabled', ARRAY['simple', 'variable'],
      'variant_attributes', ARRAY['color', 'size', 'material'],
      'require_weight', true,
      'custom_fields', ARRAY['material', 'dimensions', 'warranty_months', 'care_instructions', 'is_dishwasher_safe', 'is_microwave_safe']
    ),
    'orders', jsonb_build_object(
      'types', ARRAY['delivery', 'pickup'],
      'payment_methods', ARRAY['cod', 'cib', 'edahabia'],
      'allow_gift_wrapping', true,
      'min_order_amount', 1000
    ),
    'theme', jsonb_build_object(
      'preset', 'raiq_serene'
    ),
    'localization', jsonb_build_object(
      'default_language', 'ar',
      'supported_languages', ARRAY['ar', 'fr', 'en'],
      'currency', 'DZD',
      'timezone', 'Africa/Algiers'
    )
  )
WHERE id = 'your-tenant-uuid';

-- Create active theme for tenant
INSERT INTO themes (tenant_id, name, is_active, colors, typography, layout)
SELECT 
  'your-tenant-uuid',
  'Raiq Serene Theme',
  true,
  tp.colors,
  tp.typography,
  tp.layout
FROM theme_presets tp
WHERE tp.id = 'raiq_serene'
ON CONFLICT DO NOTHING;

-- Enable specific features for tenant
INSERT INTO feature_flags (tenant_id, flag_key, is_enabled, description) VALUES
('your-tenant-uuid', 'reviews', true, 'Product reviews enabled'),
('your-tenant-uuid', 'wishlists', true, 'Wishlists enabled'),
('your-tenant-uuid', 'gift_wrapping', true, 'Gift wrapping enabled'),
('your-tenant-uuid', 'product_comparison', true, 'Product comparison enabled'),
('your-tenant-uuid', 'loyalty', true, 'Loyalty program enabled')
ON CONFLICT (tenant_id, flag_key) DO UPDATE SET is_enabled = EXCLUDED.is_enabled;
*/

-- ============================================
-- 5. CUSTOM FIELD DEFINITIONS FOR KITCHENWARE
-- ============================================

-- These will be created per-tenant when the tenant is set up
-- Example for a specific tenant (uncomment and modify tenant_id):
/*
INSERT INTO custom_field_definitions 
(tenant_id, entity_type, field_key, field_type, label, label_ar, label_en, is_required, unit, options, display_order, display_in_list, display_in_filters, group_name)
VALUES
-- Material (required, filterable)
('your-tenant-uuid', 'product', 'material', 'select', 'Matériau', 'المادة', 'Material', true, NULL,
  '[
    {"value": "ceramic", "label": "Céramique", "label_ar": "سيراميك"},
    {"value": "wood", "label": "Bois", "label_ar": "خشب"},
    {"value": "stainless_steel", "label": "Acier inoxydable", "label_ar": "ستانلس ستيل"},
    {"value": "glass", "label": "Verre", "label_ar": "زجاج"},
    {"value": "bamboo", "label": "Bambou", "label_ar": "خيزران"},
    {"value": "silicone", "label": "Silicone", "label_ar": "سيليكون"},
    {"value": "cast_iron", "label": "Fonte", "label_ar": "حديد زهر"},
    {"value": "copper", "label": "Cuivre", "label_ar": "نحاس"}
  ]'::jsonb,
  1, true, true, 'specifications'),

-- Dimensions
('your-tenant-uuid', 'product', 'dimensions', 'text', 'Dimensions', 'الأبعاد', 'Dimensions', false, NULL, NULL,
  2, true, false, 'specifications'),

-- Weight
('your-tenant-uuid', 'product', 'weight_grams', 'number', 'Poids', 'الوزن', 'Weight', false, 'g', NULL,
  3, false, false, 'specifications'),

-- Warranty
('your-tenant-uuid', 'product', 'warranty_months', 'number', 'Garantie', 'الضمان', 'Warranty', false, 'mois', NULL,
  4, true, true, 'specifications'),

-- Care Instructions
('your-tenant-uuid', 'product', 'care_instructions', 'textarea', 'Instructions d''entretien', 'تعليمات العناية', 'Care Instructions', false, NULL, NULL,
  5, false, false, 'care'),

-- Dishwasher Safe
('your-tenant-uuid', 'product', 'is_dishwasher_safe', 'boolean', 'Compatible lave-vaisselle', 'آمن لغسالة الصحون', 'Dishwasher Safe', false, NULL, NULL,
  6, true, true, 'safety'),

-- Microwave Safe
('your-tenant-uuid', 'product', 'is_microwave_safe', 'boolean', 'Compatible micro-ondes', 'آمن للميكروويف', 'Microwave Safe', false, NULL, NULL,
  7, true, true, 'safety'),

-- Oven Safe
('your-tenant-uuid', 'product', 'is_oven_safe', 'boolean', 'Compatible four', 'آمن للفرن', 'Oven Safe', false, NULL, NULL,
  8, true, true, 'safety'),

-- Capacity
('your-tenant-uuid', 'product', 'capacity_ml', 'number', 'Capacité', 'السعة', 'Capacity', false, 'ml', NULL,
  9, true, false, 'specifications'),

-- Country of Origin
('your-tenant-uuid', 'product', 'country_of_origin', 'text', 'Pays d''origine', 'بلد المنشأ', 'Country of Origin', false, NULL, NULL,
  10, false, false, 'origin')

ON CONFLICT (tenant_id, entity_type, field_key) DO UPDATE SET
  label = EXCLUDED.label,
  label_ar = EXCLUDED.label_ar,
  options = EXCLUDED.options;
*/

COMMIT;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check theme preset was created
-- SELECT * FROM theme_presets WHERE id = 'raiq_serene';

-- Check business type was created
-- SELECT id, name, name_ar, default_features FROM business_types WHERE id = 'kitchenware';

-- Check feature flags
-- SELECT * FROM feature_flags WHERE flag_key IN ('gift_wrapping', 'product_comparison');
