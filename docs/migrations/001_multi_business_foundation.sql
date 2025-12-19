-- ============================================
-- MULTI-BUSINESS PLATFORM: FOUNDATION MIGRATION
-- ============================================
-- Run this migration to enable multi-business support
-- Estimated execution time: < 1 minute
-- ============================================

BEGIN;

-- ============================================
-- 1. BUSINESS TYPE REGISTRY
-- ============================================

CREATE TABLE IF NOT EXISTS business_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_ar TEXT,
  name_en TEXT,
  description TEXT,
  icon TEXT,
  
  -- Default configuration for this business type
  default_config JSONB NOT NULL DEFAULT '{}',
  
  -- Schema extensions (custom fields schema)
  product_schema JSONB DEFAULT '{}',
  order_schema JSONB DEFAULT '{}',
  customer_schema JSONB DEFAULT '{}',
  
  -- Feature defaults
  default_features TEXT[] DEFAULT ARRAY['pos', 'ecommerce'],
  
  -- UI defaults
  default_theme JSONB DEFAULT '{}',
  
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE business_types ENABLE ROW LEVEL SECURITY;

-- Public read access (business types are global)
CREATE POLICY "business_types_public_read" ON business_types
  FOR SELECT USING (true);

-- Seed default business types
INSERT INTO business_types (id, name, name_ar, name_en, icon, default_config, product_schema, default_features, sort_order) VALUES

('nutrition', 'Nutrition & Repas', 'التغذية والوجبات', 'Nutrition & Meals', 'Utensils', 
  '{"products": {"require_nutrition_info": true}, "orders": {"allow_scheduling": true}}',
  '{
    "calories": {"type": "number", "label": "Calories", "label_ar": "سعرات حرارية", "unit": "kcal", "required": true},
    "protein": {"type": "number", "label": "Protéines", "label_ar": "بروتين", "unit": "g"},
    "carbs": {"type": "number", "label": "Glucides", "label_ar": "كربوهيدرات", "unit": "g"},
    "fat": {"type": "number", "label": "Lipides", "label_ar": "دهون", "unit": "g"},
    "fiber": {"type": "number", "label": "Fibres", "label_ar": "ألياف", "unit": "g"},
    "meal_type": {"type": "select", "label": "Type de repas", "options": ["breakfast", "lunch", "dinner", "snack"]},
    "dietary_tags": {"type": "multiselect", "label": "Régimes", "options": ["vegan", "vegetarian", "gluten_free", "dairy_free", "keto", "paleo"]}
  }',
  ARRAY['pos', 'ecommerce', 'subscriptions', 'meal_plans'], 1),

('retail', 'Commerce de détail', 'تجارة التجزئة', 'Retail', 'Store',
  '{"products": {"require_barcode": true, "track_inventory": true}}',
  '{
    "brand": {"type": "text", "label": "Marque", "label_ar": "العلامة التجارية"},
    "manufacturer": {"type": "text", "label": "Fabricant", "label_ar": "الشركة المصنعة"},
    "warranty_months": {"type": "number", "label": "Garantie (mois)", "label_ar": "الضمان (شهور)"},
    "origin_country": {"type": "text", "label": "Pays d''origine", "label_ar": "بلد المنشأ"}
  }',
  ARRAY['pos', 'ecommerce', 'inventory'], 2),

('clothing', 'Mode & Vêtements', 'أزياء وملابس', 'Fashion & Clothing', 'Shirt',
  '{"products": {"require_size_chart": true, "variant_attributes": ["size", "color"]}}',
  '{
    "material": {"type": "text", "label": "Matière", "label_ar": "المادة", "required": true},
    "care_instructions": {"type": "textarea", "label": "Entretien", "label_ar": "تعليمات العناية"},
    "gender": {"type": "select", "label": "Genre", "label_ar": "الجنس", "options": ["unisex", "men", "women", "kids"]},
    "season": {"type": "select", "label": "Saison", "label_ar": "الموسم", "options": ["spring", "summer", "fall", "winter", "all_season"]},
    "fit": {"type": "select", "label": "Coupe", "label_ar": "القصة", "options": ["slim", "regular", "relaxed", "oversized"]},
    "size_chart": {"type": "json", "label": "Guide des tailles", "label_ar": "جدول المقاسات"}
  }',
  ARRAY['pos', 'ecommerce', 'inventory', 'wishlists'], 3),

('restaurant', 'Restaurant & Café', 'مطعم ومقهى', 'Restaurant & Cafe', 'Coffee',
  '{"products": {"printer_routing": true, "modifiers_enabled": true}, "orders": {"types": ["dine_in", "takeaway", "delivery"]}}',
  '{
    "prep_time_minutes": {"type": "number", "label": "Temps de préparation", "label_ar": "وقت التحضير", "unit": "min"},
    "printer_dest": {"type": "select", "label": "Imprimante", "label_ar": "الطابعة", "options": ["kitchen", "bar", "oven"]},
    "allergens": {"type": "multiselect", "label": "Allergènes", "label_ar": "مسببات الحساسية", "options": ["gluten", "dairy", "nuts", "shellfish", "eggs", "soy"]},
    "spicy_level": {"type": "select", "label": "Niveau épicé", "label_ar": "مستوى الحرارة", "options": ["none", "mild", "medium", "hot"]}
  }',
  ARRAY['pos', 'tables', 'kitchen_display'], 4),

('services', 'Services', 'خدمات', 'Services', 'Calendar',
  '{"orders": {"allow_appointments": true}}',
  '{
    "duration_minutes": {"type": "number", "label": "Durée", "label_ar": "المدة", "unit": "min", "required": true},
    "service_type": {"type": "select", "label": "Type", "options": ["appointment", "consultation", "session"]},
    "requires_deposit": {"type": "boolean", "label": "Acompte requis", "label_ar": "يتطلب عربون"}
  }',
  ARRAY['ecommerce', 'appointments', 'calendar'], 5),

('custom', 'Personnalisé', 'مخصص', 'Custom', 'Settings',
  '{}',
  '{}',
  ARRAY['pos', 'ecommerce'], 99)

ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. ENHANCE TENANTS TABLE
-- ============================================

-- Add business_type column if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tenants' AND column_name = 'business_type'
  ) THEN
    ALTER TABLE tenants ADD COLUMN business_type TEXT DEFAULT 'retail' 
      REFERENCES business_types(id);
  END IF;
END $$;

-- Update existing tenants to have proper business_type reference
UPDATE tenants 
SET business_type = 'restaurant' 
WHERE business_type IS NULL OR business_type = '';

-- ============================================
-- 3. FEATURE FLAGS SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  flag_key TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT false,
  rollout_percentage INTEGER DEFAULT 100 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  conditions JSONB DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, flag_key)
);

-- Enable RLS
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

-- Tenant isolation policy
CREATE POLICY "feature_flags_tenant_isolation" ON feature_flags
  FOR ALL
  USING (
    tenant_id IS NULL OR 
    tenant_id = (current_setting('app.tenant_id', true))::uuid
  );

-- Function to check if feature is enabled
CREATE OR REPLACE FUNCTION is_feature_enabled(
  p_tenant_id UUID,
  p_flag_key TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_tenant_flag RECORD;
  v_global_flag RECORD;
  v_tenant_config JSONB;
BEGIN
  -- Check tenant-specific flag first
  SELECT * INTO v_tenant_flag 
  FROM feature_flags 
  WHERE tenant_id = p_tenant_id AND flag_key = p_flag_key;
  
  IF FOUND THEN
    RETURN v_tenant_flag.is_enabled;
  END IF;
  
  -- Check tenant config features array
  SELECT config->'features' INTO v_tenant_config
  FROM tenants WHERE id = p_tenant_id;
  
  IF v_tenant_config IS NOT NULL AND v_tenant_config ? p_flag_key THEN
    RETURN (v_tenant_config->>p_flag_key)::boolean;
  END IF;
  
  -- Fall back to global flag
  SELECT * INTO v_global_flag 
  FROM feature_flags 
  WHERE tenant_id IS NULL AND flag_key = p_flag_key;
  
  IF FOUND THEN
    RETURN v_global_flag.is_enabled;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Seed default global feature flags
INSERT INTO feature_flags (tenant_id, flag_key, is_enabled, description) VALUES
(NULL, 'subscriptions', false, 'Enable subscription/recurring orders'),
(NULL, 'loyalty', false, 'Enable loyalty points program'),
(NULL, 'reviews', false, 'Enable product reviews'),
(NULL, 'wishlists', true, 'Enable wishlists'),
(NULL, 'bundles', false, 'Enable product bundles'),
(NULL, 'coupons', false, 'Enable coupon codes'),
(NULL, 'appointments', false, 'Enable appointment booking'),
(NULL, 'meal_plans', false, 'Enable meal plan builder'),
(NULL, 'size_charts', false, 'Enable size charts for products'),
(NULL, 'modifiers', false, 'Enable product modifiers')
ON CONFLICT DO NOTHING;

-- ============================================
-- 4. CUSTOM FIELDS SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS custom_field_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  
  entity_type TEXT NOT NULL CHECK (entity_type IN (
    'product', 'category', 'customer', 'order', 'variant'
  )),
  
  field_key TEXT NOT NULL,
  field_type TEXT NOT NULL CHECK (field_type IN (
    'text', 'textarea', 'number', 'boolean', 'date', 
    'select', 'multiselect', 'json', 'image', 'file'
  )),
  
  -- Display labels (multilingual)
  label TEXT NOT NULL,
  label_ar TEXT,
  label_en TEXT,
  placeholder TEXT,
  help_text TEXT,
  
  -- Validation
  is_required BOOLEAN DEFAULT false,
  validation_rules JSONB DEFAULT '{}',
  default_value TEXT,
  options JSONB,
  unit TEXT,
  
  -- UI settings
  display_order INTEGER DEFAULT 0,
  display_in_list BOOLEAN DEFAULT false,
  display_in_filters BOOLEAN DEFAULT false,
  group_name TEXT,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, entity_type, field_key)
);

-- Enable RLS
ALTER TABLE custom_field_definitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "custom_field_definitions_tenant_isolation" ON custom_field_definitions
  FOR ALL
  USING (tenant_id = (current_setting('app.tenant_id', true))::uuid);

-- Custom field values storage
CREATE TABLE IF NOT EXISTS custom_field_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  field_definition_id UUID REFERENCES custom_field_definitions(id) ON DELETE CASCADE,
  
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  
  -- Value columns (use appropriate based on field_type)
  value_text TEXT,
  value_number NUMERIC,
  value_boolean BOOLEAN,
  value_date DATE,
  value_json JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(field_definition_id, entity_id)
);

-- Enable RLS
ALTER TABLE custom_field_values ENABLE ROW LEVEL SECURITY;

CREATE POLICY "custom_field_values_tenant_isolation" ON custom_field_values
  FOR ALL
  USING (tenant_id = (current_setting('app.tenant_id', true))::uuid);

-- Index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_custom_field_values_entity 
  ON custom_field_values(tenant_id, entity_type, entity_id);

-- Function to get custom fields for an entity
CREATE OR REPLACE FUNCTION get_custom_fields(
  p_tenant_id UUID,
  p_entity_type TEXT,
  p_entity_id UUID
) RETURNS JSONB AS $$
  SELECT COALESCE(
    jsonb_object_agg(
      cfd.field_key,
      jsonb_build_object(
        'value', CASE cfd.field_type
          WHEN 'number' THEN to_jsonb(cfv.value_number)
          WHEN 'boolean' THEN to_jsonb(cfv.value_boolean)
          WHEN 'date' THEN to_jsonb(cfv.value_date)
          WHEN 'json' THEN COALESCE(cfv.value_json, 'null'::jsonb)
          WHEN 'multiselect' THEN COALESCE(cfv.value_json, '[]'::jsonb)
          ELSE to_jsonb(cfv.value_text)
        END,
        'label', cfd.label,
        'type', cfd.field_type,
        'unit', cfd.unit
      )
    ),
    '{}'::jsonb
  )
  FROM custom_field_definitions cfd
  LEFT JOIN custom_field_values cfv 
    ON cfv.field_definition_id = cfd.id 
    AND cfv.entity_id = p_entity_id
  WHERE cfd.tenant_id = p_tenant_id
    AND cfd.entity_type = p_entity_type
    AND cfd.is_active = true;
$$ LANGUAGE sql STABLE;

-- ============================================
-- 5. ENHANCE PRODUCTS TABLE
-- ============================================

-- Add custom_data JSONB column for business-specific data
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'custom_data'
  ) THEN
    ALTER TABLE products ADD COLUMN custom_data JSONB DEFAULT '{}';
  END IF;
END $$;

-- ============================================
-- 6. THEME SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  
  colors JSONB NOT NULL DEFAULT '{
    "primary": "#FFB300",
    "primary_foreground": "#1C1917",
    "secondary": "#1B5E20",
    "secondary_foreground": "#FFFFFF",
    "background": "#FAFAF9",
    "foreground": "#1C1917",
    "card": "#FFFFFF",
    "card_foreground": "#1C1917",
    "muted": "#F5F5F4",
    "muted_foreground": "#78716C",
    "accent": "#FFECB3",
    "accent_foreground": "#1C1917",
    "border": "#E7E5E4",
    "input": "#E7E5E4",
    "ring": "#FFC107",
    "success": "#10B981",
    "warning": "#F59E0B",
    "error": "#EF4444",
    "info": "#3B82F6"
  }',
  
  typography JSONB DEFAULT '{
    "font_sans": "Inter, system-ui, sans-serif",
    "font_heading": "Inter, system-ui, sans-serif",
    "font_arabic": "Almarai, system-ui, sans-serif"
  }',
  
  layout JSONB DEFAULT '{
    "border_radius": "0.75rem",
    "container_max_width": "1280px"
  }',
  
  components JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "themes_tenant_isolation" ON themes
  FOR ALL
  USING (tenant_id = (current_setting('app.tenant_id', true))::uuid);

-- Theme presets (global, no tenant_id)
CREATE TABLE IF NOT EXISTS theme_presets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_ar TEXT,
  name_en TEXT,
  business_types TEXT[],
  colors JSONB NOT NULL,
  typography JSONB,
  layout JSONB,
  preview_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (public read)
ALTER TABLE theme_presets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "theme_presets_public_read" ON theme_presets
  FOR SELECT USING (true);

-- Seed theme presets
INSERT INTO theme_presets (id, name, name_ar, name_en, business_types, colors) VALUES
('honey_gold', 'Or Miel', 'ذهب العسل', 'Honey Gold', 
  ARRAY['retail', 'restaurant'],
  '{"primary": "#FFB300", "secondary": "#1B5E20", "accent": "#FFECB3", "background": "#FAFAF9"}'),

('nutrition_green', 'Vert Nutrition', 'أخضر التغذية', 'Nutrition Green',
  ARRAY['nutrition', 'meal_prep', 'fitness'],
  '{"primary": "#22C55E", "secondary": "#166534", "accent": "#86EFAC", "background": "#F0FDF4"}'),

('fashion_noir', 'Noir Mode', 'أسود الموضة', 'Fashion Noir',
  ARRAY['clothing', 'fashion', 'accessories'],
  '{"primary": "#18181B", "secondary": "#F4F4F5", "accent": "#E4E4E7", "background": "#FFFFFF"}'),

('ocean_blue', 'Bleu Océan', 'أزرق المحيط', 'Ocean Blue',
  ARRAY['services', 'spa', 'salon'],
  '{"primary": "#0EA5E9", "secondary": "#0369A1", "accent": "#BAE6FD", "background": "#F0F9FF"}'),

('warm_terracotta', 'Terracotta', 'تيراكوتا', 'Warm Terracotta',
  ARRAY['restaurant', 'cafe'],
  '{"primary": "#EA580C", "secondary": "#9A3412", "accent": "#FED7AA", "background": "#FFFBEB"}')

ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 7. HELPER FUNCTIONS
-- ============================================

-- Set tenant context for RLS
CREATE OR REPLACE FUNCTION set_tenant_context(p_tenant_id UUID)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.tenant_id', p_tenant_id::text, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get tenant with full config
CREATE OR REPLACE FUNCTION get_tenant_config(p_tenant_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_tenant RECORD;
  v_business_type RECORD;
  v_theme RECORD;
  v_features JSONB;
BEGIN
  -- Get tenant
  SELECT * INTO v_tenant FROM tenants WHERE id = p_tenant_id;
  
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  
  -- Get business type defaults
  SELECT * INTO v_business_type 
  FROM business_types 
  WHERE id = v_tenant.business_type;
  
  -- Get active theme
  SELECT * INTO v_theme 
  FROM themes 
  WHERE tenant_id = p_tenant_id AND is_active = true
  LIMIT 1;
  
  -- Get enabled features
  SELECT jsonb_agg(flag_key) INTO v_features
  FROM feature_flags
  WHERE (tenant_id = p_tenant_id OR tenant_id IS NULL) 
    AND is_enabled = true;
  
  RETURN jsonb_build_object(
    'tenant', jsonb_build_object(
      'id', v_tenant.id,
      'name', v_tenant.name,
      'slug', v_tenant.slug,
      'business_type', v_tenant.business_type,
      'config', v_tenant.config
    ),
    'business_type', jsonb_build_object(
      'id', v_business_type.id,
      'name', v_business_type.name,
      'product_schema', v_business_type.product_schema,
      'default_features', v_business_type.default_features
    ),
    'theme', CASE WHEN v_theme IS NOT NULL THEN
      jsonb_build_object(
        'colors', v_theme.colors,
        'typography', v_theme.typography,
        'layout', v_theme.layout
      )
    ELSE NULL END,
    'features', COALESCE(v_features, '[]'::jsonb)
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================
-- 8. INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_tenants_business_type ON tenants(business_type);
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
CREATE INDEX IF NOT EXISTS idx_feature_flags_tenant_key ON feature_flags(tenant_id, flag_key);
CREATE INDEX IF NOT EXISTS idx_themes_tenant_active ON themes(tenant_id, is_active);
CREATE INDEX IF NOT EXISTS idx_custom_field_definitions_tenant_entity 
  ON custom_field_definitions(tenant_id, entity_type);

COMMIT;

-- ============================================
-- VERIFICATION QUERIES (run after migration)
-- ============================================

-- Check business types
-- SELECT * FROM business_types ORDER BY sort_order;

-- Check feature flags
-- SELECT * FROM feature_flags WHERE tenant_id IS NULL;

-- Check theme presets
-- SELECT id, name, business_types FROM theme_presets;

-- Test get_tenant_config function
-- SELECT get_tenant_config('your-tenant-uuid-here');
