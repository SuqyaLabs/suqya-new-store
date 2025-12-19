# Multi-Business Platform Architecture

> Comprehensive architectural plan for transforming the Suqya platform into a reusable, multi-tenant platform supporting diverse business verticals.

---

## Executive Summary

This document outlines the architecture for evolving from a single-business honey e-commerce platform to a **multi-business SaaS platform** that can serve:

- **Food & Nutrition**: Restaurants, cafes, meal prep, supplements
- **Retail**: General merchandise, groceries, specialty stores
- **Fashion & Clothing**: Apparel, accessories, footwear
- **Services**: Appointments, bookings, consultations
- **Custom Verticals**: Any business type with custom configurations

### Current State Analysis

| Component | Status | Notes |
|-----------|--------|-------|
| Multi-tenancy | ✅ Implemented | `tenant_id` on all tables, RLS enabled |
| Multi-language | ✅ Implemented | fr, ar, en with translation tables |
| Business type field | ✅ Implemented | `tenants.business_type` with registry |
| Config storage | ✅ Implemented | `tenants.config` JSONB field |
| Category types | ✅ Exists | 'retail', 'hospitality', 'service' |
| Product flexibility | ✅ Implemented | `custom_data` JSONB + dynamic schema |
| Business Types Registry | ✅ Implemented | 6 types: nutrition, retail, clothing, restaurant, services, custom |
| Feature Flags | ✅ Implemented | Global + per-tenant flags |
| Custom Fields System | ✅ Implemented | Definitions + values tables |
| Theme System | ✅ Implemented | Themes + presets tables |
| TenantProvider | ✅ Implemented | React context with hooks |

---

## Implementation Progress

### ✅ Phase 0: Foundation (COMPLETED - Dec 18, 2024)

**Database Tables Created:**
- `business_types` - Registry of 6 business verticals with product schemas
- `feature_flags` - Global and per-tenant feature toggles
- `custom_field_definitions` - Dynamic field schema storage
- `custom_field_values` - Field values per entity
- `themes` - Per-tenant theme customization
- `theme_presets` - 5 pre-built theme presets

**Database Functions:**
- `get_tenant_config(tenant_id)` - Returns full tenant context
- `is_feature_enabled(tenant_id, flag_key)` - Check feature status
- `get_custom_fields(tenant_id, entity_type, entity_id)` - Get custom fields
- `set_tenant_context(tenant_id)` - Set RLS context

**Frontend Implementation:**
- `types/multi-business.ts` - TypeScript definitions
- `hooks/use-tenant.tsx` - TenantProvider, useTenant, useFeature hooks
- `lib/tenant/server.ts` - Server-side tenant context
- `components/debug/tenant-debug.tsx` - Debug component
- `app/[locale]/layout.tsx` - TenantProvider integration

**Files:**
- `docs/migrations/001_multi_business_foundation.sql`

### ✅ Phase 1: Theme System (COMPLETED - Dec 18, 2024)

**Components Created:**
- `components/theme/tenant-theme-provider.tsx` - Dynamic CSS variable injection
- `components/theme/theme-selector.tsx` - Theme preset selector UI

**Features:**
- Hex to HSL color conversion for CSS variables
- 5 theme presets: honey_gold, nutrition_green, fashion_noir, ocean_blue, warm_terracotta
- Theme inheritance: defaults → preset → database theme → config overrides
- RTL-aware dropdown positioning
- `useTheme()` hook for accessing current theme colors

**Integration:**
- TenantThemeProvider wrapped in layout
- Theme selector added to debug panel for testing

### ✅ Phase 2: Component Override System (COMPLETED - Dec 18, 2024)

**Components Created:**
- `components/registry.ts` - Component registry with lazy loading
- `components/core/product-card.tsx` - Default product card
- `components/business/nutrition/product-card.tsx` - Shows calories, macros, dietary tags
- `components/business/clothing/product-card.tsx` - Shows sizes, colors, materials
- `components/business/restaurant/product-card.tsx` - Shows prep time, spicy level, allergens
- `components/business/retail/product-card.tsx` - Shows brand, warranty, stock
- `hooks/use-dynamic-component.tsx` - Dynamic component loading hook

**Features:**
- Lazy-loaded components per business type
- Automatic fallback to default components
- `useDynamicComponent()` hook for runtime component resolution
- `useProductCard()` convenience hook
- `preloadComponent()` for prefetching

### ✅ Phase 3: Custom Fields UI (COMPLETED - Dec 18, 2024)

**Components Created:**
- `components/custom-fields/dynamic-field.tsx` - Renders any field type dynamically
- `components/custom-fields/custom-fields-form.tsx` - Form builder with validation
- `components/custom-fields/custom-fields-display.tsx` - Display values in grid/list/inline
- `components/custom-fields/index.ts` - Barrel export

**Field Types Supported:**
- `text`, `textarea`, `number` (with unit), `boolean`
- `select`, `multiselect` (with localized options)
- `date`, `json`

**Features:**
- `useCustomFields()` hook with validation
- `CustomFieldsBadges` for compact product card display
- RTL support, localized labels
- Required field validation, min/max constraints

### ✅ Phase 4: Business Rules Engine (COMPLETED - Dec 18, 2024)

**Files Created:**
- `lib/rules/rule-engine.ts` - Core evaluation engine with condition/action builders
- `lib/rules/rule-templates.ts` - Pre-built templates for common rules
- `lib/rules/index.ts` - Barrel export
- `hooks/use-business-rules.ts` - React hooks for rule evaluation

**Supported Operators:**
- Comparison: `==`, `!=`, `>`, `<`, `>=`, `<=`
- Collection: `in`, `not_in`, `contains`, `not_contains`
- String: `starts_with`, `ends_with`
- Null: `is_empty`, `is_not_empty`
- Logical: `and`, `or`, `not`

**Action Types:**
- `set_field` - Set a value on the entity
- `add_fee` - Add percentage or fixed fee
- `error` - Return validation error
- `aggregate` - Sum/count/avg operations
- `notify` - Trigger notification
- `trigger_workflow` - Start a workflow

**Pre-built Templates:**
- **Validation**: minOrderAmount, requireStock, requireNutritionInfo, requireSizeSelection
- **Calculation**: serviceCharge, freeDeliveryThreshold, calculateTotalCalories, bulkDiscount
- **Workflow**: sendToKitchen, lowStockAlert, autoConfirmPickup
- **Constraint**: maxQuantityPerProduct, businessHours, deliveryZone

**Hooks:**
- `useBusinessRules()` - Generic rule evaluation
- `useOrderValidation()` - Order validation rules
- `useCartValidation()` - Cart item validation
- `useOrderCalculation()` - Fee/discount calculation
- `useRuleTemplates()` - Access pre-built templates

### ✅ Phase 5: Multi-Tenant API (COMPLETED - Dec 18, 2024)

**Files Created:**
- `lib/tenant/middleware.ts` - Tenant resolution from subdomain/path/header/query
- `lib/tenant/api-wrapper.ts` - `withTenant()` HOF for API routes
- `lib/tenant/index.ts` - Barrel export
- `app/api/categories/route.tenant.ts.example` - Example migration

**Tenant Resolution Sources (priority order):**
1. `x-tenant-id` header
2. Subdomain (tenant.suqya.com)
3. Path prefix (/t/tenant-slug/...)
4. Query parameter (?tenant=...)
5. Default from `NEXT_PUBLIC_TENANT_ID`

**API Utilities:**
- `withTenant(handler, options)` - Wrap API handlers with tenant context
- `createTenantClient(tenantId)` - Supabase client with RLS context
- `createTenantResponse(data, tenant)` - Standard response with metadata
- `validateTenantScope(request, resourceTenantId)` - Scope validation

**Caching:**
- In-memory tenant cache with 5-minute TTL
- `clearTenantCache()` for invalidation

---

## 🎉 Implementation Complete!

All 5 phases of the multi-business architecture have been implemented:

| Phase | Description | Status |
|-------|-------------|--------|
| 0 | Foundation (DB, TenantProvider) | ✅ |
| 1 | Theme System | ✅ |
| 2 | Component Override System | ✅ |
| 3 | Custom Fields UI | ✅ |
| 4 | Business Rules Engine | ✅ |
| 5 | Multi-Tenant API | ✅ |

---

## Part 1: Database Architecture

### 1.1 Multi-Tenancy Strategy

**Approach**: **Shared Tables with Row-Level Security (RLS)**

This is the most scalable approach for a SaaS platform:
- Single schema, all tenants share tables
- Data isolation via `tenant_id` + RLS policies
- Easy maintenance and updates
- Cost-effective (single database)

```sql
-- Every table follows this pattern
CREATE TABLE entity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  -- ... other columns
);

-- RLS policy pattern
CREATE POLICY "tenant_isolation" ON entity
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

### 1.2 Business Type Configuration System

#### Enhanced Tenants Table

```sql
-- Migration: 001_enhance_tenants_business_config
ALTER TABLE tenants 
ADD COLUMN IF NOT EXISTS business_type TEXT DEFAULT 'retail' 
  CHECK (business_type IN (
    'restaurant', 'cafe', 'food_truck',           -- Food & Beverage
    'retail', 'grocery', 'convenience',           -- Retail
    'clothing', 'fashion', 'accessories',         -- Fashion
    'nutrition', 'supplements', 'meal_prep',      -- Health & Nutrition
    'salon', 'spa', 'fitness',                    -- Services
    'custom'                                       -- Custom/Other
  ));

-- Business configuration JSONB structure
-- This is the CORE of the customization system
COMMENT ON COLUMN tenants.config IS '
{
  // Business identity
  "business": {
    "type": "nutrition",
    "subtype": "meal_prep",
    "industry": "health_wellness"
  },
  
  // Feature toggles
  "features": {
    "pos": true,
    "ecommerce": true,
    "inventory": true,
    "appointments": false,
    "subscriptions": true,
    "loyalty": true,
    "reviews": true,
    "bundles": true
  },
  
  // Product configuration
  "products": {
    "types_enabled": ["simple", "variable", "composite", "subscription"],
    "custom_fields": ["calories", "protein", "meal_type"],
    "variant_attributes": ["size", "flavor"],
    "require_weight": false,
    "require_nutrition_info": true
  },
  
  // Order configuration
  "orders": {
    "types": ["delivery", "pickup", "dine_in"],
    "payment_methods": ["cod", "cib", "edahabia"],
    "shipping_methods": ["yalidine", "ems", "pickup"],
    "allow_scheduling": true,
    "allow_tips": false
  },
  
  // UI/UX configuration
  "theme": {
    "preset": "nutrition_green",
    "colors": {
      "primary": "#22C55E",
      "secondary": "#166534",
      "accent": "#86EFAC"
    },
    "logo_url": "...",
    "favicon_url": "..."
  },
  
  // Localization
  "localization": {
    "default_language": "fr",
    "supported_languages": ["fr", "ar", "en"],
    "currency": "DZD",
    "timezone": "Africa/Algiers"
  }
}';
```

#### Business Type Registry

```sql
-- Migration: 002_business_type_registry
CREATE TABLE business_types (
  id TEXT PRIMARY KEY, -- e.g., 'nutrition', 'retail', 'clothing'
  name TEXT NOT NULL,
  name_ar TEXT,
  name_en TEXT,
  description TEXT,
  icon TEXT, -- Lucide icon name
  
  -- Default configuration for this business type
  default_config JSONB NOT NULL DEFAULT '{}',
  
  -- Schema extensions (custom fields)
  product_schema JSONB DEFAULT '{}',
  order_schema JSONB DEFAULT '{}',
  customer_schema JSONB DEFAULT '{}',
  
  -- Feature defaults
  default_features TEXT[] DEFAULT ARRAY['pos', 'ecommerce'],
  
  -- UI defaults
  default_theme JSONB DEFAULT '{}',
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed business types
INSERT INTO business_types (id, name, default_config, product_schema, default_features) VALUES
('nutrition', 'Nutrition & Meal Prep', '{
  "products": {
    "require_nutrition_info": true,
    "custom_fields": ["calories", "protein", "carbs", "fat", "fiber"]
  }
}', '{
  "calories": {"type": "number", "label": "Calories", "unit": "kcal"},
  "protein": {"type": "number", "label": "Protein", "unit": "g"},
  "carbs": {"type": "number", "label": "Carbohydrates", "unit": "g"},
  "fat": {"type": "number", "label": "Fat", "unit": "g"},
  "fiber": {"type": "number", "label": "Fiber", "unit": "g"},
  "meal_type": {"type": "select", "options": ["breakfast", "lunch", "dinner", "snack"]}
}', ARRAY['pos', 'ecommerce', 'subscriptions', 'meal_plans']),

('retail', 'General Retail', '{
  "products": {
    "require_barcode": true,
    "track_inventory": true
  }
}', '{
  "brand": {"type": "text", "label": "Brand"},
  "manufacturer": {"type": "text", "label": "Manufacturer"},
  "warranty_months": {"type": "number", "label": "Warranty (months)"}
}', ARRAY['pos', 'ecommerce', 'inventory']),

('clothing', 'Fashion & Clothing', '{
  "products": {
    "require_size_chart": true,
    "variant_attributes": ["size", "color"]
  }
}', '{
  "material": {"type": "text", "label": "Material"},
  "care_instructions": {"type": "textarea", "label": "Care Instructions"},
  "gender": {"type": "select", "options": ["unisex", "male", "female", "kids"]},
  "season": {"type": "select", "options": ["spring", "summer", "fall", "winter", "all_season"]},
  "size_chart": {"type": "json", "label": "Size Chart"}
}', ARRAY['pos', 'ecommerce', 'inventory']),

('restaurant', 'Restaurant & Cafe', '{
  "products": {
    "printer_routing": true,
    "modifiers_enabled": true
  },
  "orders": {
    "types": ["dine_in", "takeaway", "delivery"],
    "table_management": true
  }
}', '{
  "printer_dest": {"type": "select", "options": ["kitchen", "bar", "oven"]},
  "prep_time_minutes": {"type": "number", "label": "Prep Time (min)"},
  "allergens": {"type": "multiselect", "options": ["gluten", "dairy", "nuts", "shellfish", "eggs", "soy"]},
  "spicy_level": {"type": "select", "options": ["none", "mild", "medium", "hot"]}
}', ARRAY['pos', 'tables', 'kitchen_display']);
```

### 1.3 Dynamic Custom Fields System

```sql
-- Migration: 003_custom_fields_system
CREATE TABLE custom_field_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  
  -- Which entity this field belongs to
  entity_type TEXT NOT NULL CHECK (entity_type IN (
    'product', 'category', 'customer', 'order', 'variant'
  )),
  
  -- Field metadata
  field_key TEXT NOT NULL, -- e.g., 'calories', 'material'
  field_type TEXT NOT NULL CHECK (field_type IN (
    'text', 'textarea', 'number', 'boolean', 'date', 
    'select', 'multiselect', 'json', 'image', 'file'
  )),
  
  -- Display
  label TEXT NOT NULL,
  label_ar TEXT,
  label_en TEXT,
  placeholder TEXT,
  help_text TEXT,
  
  -- Validation
  is_required BOOLEAN DEFAULT false,
  validation_rules JSONB, -- min, max, pattern, etc.
  default_value TEXT,
  options JSONB, -- For select/multiselect: [{value, label, label_ar, label_en}]
  
  -- UI
  display_order INTEGER DEFAULT 0,
  display_in_list BOOLEAN DEFAULT false,
  display_in_filters BOOLEAN DEFAULT false,
  group_name TEXT, -- For grouping fields in forms
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, entity_type, field_key)
);

-- Store custom field values
CREATE TABLE custom_field_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  field_definition_id UUID REFERENCES custom_field_definitions(id) ON DELETE CASCADE,
  
  -- Polymorphic reference to entity
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  
  -- Value storage (use appropriate column based on field_type)
  value_text TEXT,
  value_number NUMERIC,
  value_boolean BOOLEAN,
  value_date DATE,
  value_json JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(field_definition_id, entity_id)
);

-- Index for efficient lookups
CREATE INDEX idx_custom_field_values_entity 
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
      CASE cfd.field_type
        WHEN 'number' THEN to_jsonb(cfv.value_number)
        WHEN 'boolean' THEN to_jsonb(cfv.value_boolean)
        WHEN 'date' THEN to_jsonb(cfv.value_date)
        WHEN 'json' THEN cfv.value_json
        ELSE to_jsonb(cfv.value_text)
      END
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
```

### 1.4 Enhanced Product Schema for Multi-Business

```sql
-- Migration: 004_enhance_products_multi_business

-- Add JSONB column for business-specific data
ALTER TABLE products ADD COLUMN IF NOT EXISTS 
  custom_data JSONB DEFAULT '{}';

-- Add computed column for merged data (base + custom)
CREATE OR REPLACE FUNCTION get_product_with_custom_fields(
  p_product_id UUID
) RETURNS JSONB AS $$
DECLARE
  v_product RECORD;
  v_custom_fields JSONB;
BEGIN
  SELECT * INTO v_product FROM products WHERE id = p_product_id;
  
  v_custom_fields := get_custom_fields(
    v_product.tenant_id, 
    'product', 
    p_product_id
  );
  
  RETURN jsonb_build_object(
    'id', v_product.id,
    'name', v_product.name,
    'price', v_product.price,
    -- ... base fields
    'custom_data', v_product.custom_data,
    'custom_fields', v_custom_fields
  );
END;
$$ LANGUAGE plpgsql STABLE;
```

---

## Part 2: Theme & UI Customization System

### 2.1 Theme Configuration Schema

```sql
-- Migration: 005_theme_system
CREATE TABLE themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT false,
  
  -- Color palette
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
  
  -- Typography
  typography JSONB DEFAULT '{
    "font_sans": "Inter, system-ui, sans-serif",
    "font_heading": "Inter, system-ui, sans-serif",
    "font_arabic": "Almarai, system-ui, sans-serif",
    "font_size_base": "16px",
    "line_height_base": "1.5"
  }',
  
  -- Spacing & Layout
  layout JSONB DEFAULT '{
    "border_radius": "0.75rem",
    "container_max_width": "1280px",
    "spacing_unit": "0.25rem"
  }',
  
  -- Component overrides
  components JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Theme presets for quick setup
CREATE TABLE theme_presets (
  id TEXT PRIMARY KEY, -- e.g., 'honey_gold', 'forest_green', 'ocean_blue'
  name TEXT NOT NULL,
  business_types TEXT[], -- Recommended for these business types
  colors JSONB NOT NULL,
  typography JSONB,
  layout JSONB,
  preview_image TEXT
);

-- Seed theme presets
INSERT INTO theme_presets (id, name, business_types, colors) VALUES
('honey_gold', 'Honey Gold', ARRAY['retail', 'food'], '{
  "primary": "#FFB300",
  "secondary": "#1B5E20",
  "accent": "#FFECB3"
}'),
('nutrition_green', 'Nutrition Green', ARRAY['nutrition', 'meal_prep', 'fitness'], '{
  "primary": "#22C55E",
  "secondary": "#166534",
  "accent": "#86EFAC"
}'),
('fashion_noir', 'Fashion Noir', ARRAY['clothing', 'fashion', 'accessories'], '{
  "primary": "#18181B",
  "secondary": "#F4F4F5",
  "accent": "#E4E4E7"
}'),
('ocean_blue', 'Ocean Blue', ARRAY['services', 'spa', 'salon'], '{
  "primary": "#0EA5E9",
  "secondary": "#0369A1",
  "accent": "#BAE6FD"
}');
```

### 2.2 Frontend Theme Provider Architecture

```
src/
├── lib/
│   └── theme/
│       ├── index.ts              # Theme exports
│       ├── theme-context.tsx     # React context
│       ├── theme-provider.tsx    # Provider component
│       ├── use-theme.ts          # Hook for consuming theme
│       ├── theme-generator.ts    # CSS variable generator
│       └── presets/
│           ├── honey-gold.ts
│           ├── nutrition-green.ts
│           ├── fashion-noir.ts
│           └── ocean-blue.ts
```

```typescript
// lib/theme/theme-context.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { TenantTheme } from '@/types/theme'

interface ThemeContextValue {
  theme: TenantTheme
  setTheme: (theme: TenantTheme) => void
  applyTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function TenantThemeProvider({ 
  children, 
  initialTheme 
}: { 
  children: React.ReactNode
  initialTheme: TenantTheme 
}) {
  const [theme, setTheme] = useState(initialTheme)

  useEffect(() => {
    // Apply CSS variables to :root
    const root = document.documentElement
    
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key.replace(/_/g, '-')}`, value)
    })
    
    if (theme.typography) {
      root.style.setProperty('--font-sans', theme.typography.font_sans)
      root.style.setProperty('--font-arabic', theme.typography.font_arabic)
    }
    
    if (theme.layout) {
      root.style.setProperty('--radius', theme.layout.border_radius)
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, applyTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTenantTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTenantTheme must be used within TenantThemeProvider')
  return context
}
```

---

## Part 3: Business Logic Customization

### 3.1 Feature Flag System

```sql
-- Migration: 006_feature_flags
CREATE TABLE feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- NULL tenant_id = global flag
  tenant_id UUID REFERENCES tenants(id),
  
  flag_key TEXT NOT NULL, -- e.g., 'subscriptions', 'loyalty', 'reviews'
  
  is_enabled BOOLEAN DEFAULT false,
  
  -- Optional: percentage rollout (0-100)
  rollout_percentage INTEGER DEFAULT 100,
  
  -- Optional: conditions for enabling
  conditions JSONB, -- e.g., {"min_plan": "pro", "business_types": ["nutrition"]}
  
  -- Metadata
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, flag_key)
);

-- Function to check if feature is enabled for tenant
CREATE OR REPLACE FUNCTION is_feature_enabled(
  p_tenant_id UUID,
  p_flag_key TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_tenant_flag RECORD;
  v_global_flag RECORD;
BEGIN
  -- Check tenant-specific flag first
  SELECT * INTO v_tenant_flag 
  FROM feature_flags 
  WHERE tenant_id = p_tenant_id AND flag_key = p_flag_key;
  
  IF FOUND THEN
    RETURN v_tenant_flag.is_enabled;
  END IF;
  
  -- Fall back to global flag
  SELECT * INTO v_global_flag 
  FROM feature_flags 
  WHERE tenant_id IS NULL AND flag_key = p_flag_key;
  
  IF FOUND THEN
    RETURN v_global_flag.is_enabled;
  END IF;
  
  -- Default to false if no flag exists
  RETURN false;
END;
$$ LANGUAGE plpgsql STABLE;
```

### 3.2 Business Rule Engine

```sql
-- Migration: 007_business_rules
CREATE TABLE business_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  
  name TEXT NOT NULL,
  description TEXT,
  
  -- Rule type
  rule_type TEXT NOT NULL CHECK (rule_type IN (
    'validation',      -- Validate data before save
    'calculation',     -- Calculate values (pricing, discounts)
    'workflow',        -- Trigger actions
    'constraint'       -- Enforce business constraints
  )),
  
  -- When to apply this rule
  trigger_event TEXT NOT NULL, -- e.g., 'order.create', 'product.update', 'cart.add'
  
  -- Conditions (JSON Logic format)
  conditions JSONB NOT NULL DEFAULT '{"and": []}',
  
  -- Actions to perform
  actions JSONB NOT NULL, -- [{type: 'set_field', field: 'discount', value: 10}]
  
  -- Priority (lower = higher priority)
  priority INTEGER DEFAULT 100,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Example rules for different business types
INSERT INTO business_rules (tenant_id, name, rule_type, trigger_event, conditions, actions) VALUES

-- Nutrition: Auto-calculate calories total for orders
(NULL, 'Calculate Order Calories', 'calculation', 'order.calculate', 
  '{"var": "items"}',
  '[{"type": "aggregate", "field": "total_calories", "operation": "sum", "source": "items.*.calories"}]'
),

-- Clothing: Require size selection for apparel
(NULL, 'Require Size Selection', 'validation', 'cart.add',
  '{"and": [
    {"==": [{"var": "product.category.type"}, "clothing"]},
    {"!": {"var": "selected_variant.size"}}
  ]}',
  '[{"type": "error", "message": "Please select a size"}]'
),

-- Restaurant: Apply service charge for dine-in
(NULL, 'Dine-in Service Charge', 'calculation', 'order.calculate',
  '{"==": [{"var": "order_type"}, "dine_in"]}',
  '[{"type": "add_fee", "name": "service_charge", "percentage": 10}]'
);
```

### 3.3 Workflow Engine

```sql
-- Migration: 008_workflows
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  
  name TEXT NOT NULL,
  description TEXT,
  
  -- Trigger
  trigger_type TEXT NOT NULL CHECK (trigger_type IN (
    'event',      -- Triggered by system event
    'schedule',   -- Triggered by cron schedule
    'manual',     -- Triggered manually
    'webhook'     -- Triggered by external webhook
  )),
  trigger_config JSONB NOT NULL, -- Event name, schedule, etc.
  
  -- Steps
  steps JSONB NOT NULL DEFAULT '[]',
  /* Example steps:
  [
    {"id": "1", "type": "condition", "config": {...}, "next_true": "2", "next_false": "3"},
    {"id": "2", "type": "send_email", "config": {...}, "next": "end"},
    {"id": "3", "type": "create_task", "config": {...}, "next": "end"}
  ]
  */
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow execution log
CREATE TABLE workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES workflows(id),
  tenant_id UUID REFERENCES tenants(id),
  
  trigger_data JSONB, -- Data that triggered the workflow
  status TEXT DEFAULT 'pending', -- pending, running, completed, failed
  current_step TEXT,
  step_results JSONB DEFAULT '[]',
  error TEXT,
  
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
```

---

## Part 4: Component Override System

### 4.1 Component Registry Architecture

```
src/
├── components/
│   ├── core/                    # Base components (always available)
│   │   ├── product-card.tsx
│   │   ├── cart-drawer.tsx
│   │   └── checkout-form.tsx
│   │
│   ├── business/                # Business-specific components
│   │   ├── nutrition/
│   │   │   ├── product-card.tsx      # Shows calories, macros
│   │   │   ├── meal-plan-builder.tsx
│   │   │   └── nutrition-facts.tsx
│   │   │
│   │   ├── clothing/
│   │   │   ├── product-card.tsx      # Shows size chart, colors
│   │   │   ├── size-selector.tsx
│   │   │   └── style-guide.tsx
│   │   │
│   │   ├── restaurant/
│   │   │   ├── product-card.tsx      # Shows prep time, modifiers
│   │   │   ├── modifier-selector.tsx
│   │   │   └── table-selector.tsx
│   │   │
│   │   └── retail/
│   │       ├── product-card.tsx      # Shows brand, stock
│   │       └── barcode-scanner.tsx
│   │
│   └── registry.ts              # Component resolution logic
```

### 4.2 Component Resolution System

```typescript
// components/registry.ts
import { ComponentType } from 'react'

type ComponentKey = 
  | 'ProductCard'
  | 'CartDrawer'
  | 'CheckoutForm'
  | 'ProductDetails'
  | 'CategoryGrid'

type BusinessType = 
  | 'nutrition' 
  | 'clothing' 
  | 'restaurant' 
  | 'retail' 
  | 'default'

// Lazy-loaded component registry
const componentRegistry: Record<BusinessType, Partial<Record<ComponentKey, () => Promise<{ default: ComponentType<any> }>>>> = {
  nutrition: {
    ProductCard: () => import('./business/nutrition/product-card'),
    ProductDetails: () => import('./business/nutrition/product-details'),
  },
  clothing: {
    ProductCard: () => import('./business/clothing/product-card'),
    ProductDetails: () => import('./business/clothing/product-details'),
  },
  restaurant: {
    ProductCard: () => import('./business/restaurant/product-card'),
  },
  retail: {
    ProductCard: () => import('./business/retail/product-card'),
  },
  default: {
    ProductCard: () => import('./core/product-card'),
    CartDrawer: () => import('./core/cart-drawer'),
    CheckoutForm: () => import('./core/checkout-form'),
  },
}

export async function resolveComponent(
  componentKey: ComponentKey,
  businessType: BusinessType
): Promise<ComponentType<any>> {
  // Try business-specific first
  const businessComponent = componentRegistry[businessType]?.[componentKey]
  if (businessComponent) {
    const module = await businessComponent()
    return module.default
  }
  
  // Fall back to default
  const defaultComponent = componentRegistry.default[componentKey]
  if (defaultComponent) {
    const module = await defaultComponent()
    return module.default
  }
  
  throw new Error(`Component ${componentKey} not found`)
}

// React hook for dynamic component loading
export function useDynamicComponent(
  componentKey: ComponentKey,
  businessType: BusinessType
) {
  const [Component, setComponent] = useState<ComponentType<any> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    resolveComponent(componentKey, businessType)
      .then(setComponent)
      .finally(() => setIsLoading(false))
  }, [componentKey, businessType])
  
  return { Component, isLoading }
}
```

### 4.3 Dynamic Component Wrapper

```typescript
// components/dynamic.tsx
'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useTenant } from '@/hooks/use-tenant'
import { Skeleton } from '@/components/ui/skeleton'

interface DynamicComponentProps {
  component: string
  props?: Record<string, any>
  fallback?: React.ReactNode
}

export function DynamicComponent({ 
  component, 
  props = {},
  fallback 
}: DynamicComponentProps) {
  const { tenant } = useTenant()
  const businessType = tenant?.business_type || 'default'
  
  const Component = dynamic(
    () => resolveComponent(component as ComponentKey, businessType),
    {
      loading: () => fallback || <Skeleton className="h-64 w-full" />,
      ssr: false
    }
  )
  
  return (
    <Suspense fallback={fallback || <Skeleton className="h-64 w-full" />}>
      <Component {...props} />
    </Suspense>
  )
}

// Usage:
// <DynamicComponent component="ProductCard" props={{ product }} />
```

---

## Part 5: API Architecture

### 5.1 Multi-Tenant API Design

```typescript
// middleware.ts - Tenant resolution
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Resolve tenant from subdomain, path, or header
  const tenant = await resolveTenant(request)
  
  if (!tenant) {
    return NextResponse.redirect(new URL('/404', request.url))
  }
  
  // Inject tenant context into request headers
  const response = NextResponse.next()
  response.headers.set('x-tenant-id', tenant.id)
  response.headers.set('x-tenant-type', tenant.business_type)
  response.headers.set('x-tenant-config', JSON.stringify(tenant.config))
  
  return response
}

async function resolveTenant(request: NextRequest) {
  // Strategy 1: Subdomain (tenant.suqya.dz)
  const hostname = request.headers.get('host') || ''
  const subdomain = hostname.split('.')[0]
  
  if (subdomain && subdomain !== 'www' && subdomain !== 'app') {
    return await getTenantBySlug(subdomain)
  }
  
  // Strategy 2: Path prefix (/tenant-slug/...)
  const pathname = request.nextUrl.pathname
  const pathTenant = pathname.split('/')[1]
  
  if (pathTenant) {
    const tenant = await getTenantBySlug(pathTenant)
    if (tenant) return tenant
  }
  
  // Strategy 3: API header
  const tenantId = request.headers.get('x-tenant-id')
  if (tenantId) {
    return await getTenantById(tenantId)
  }
  
  return null
}
```

### 5.2 API Route Structure

```
app/
├── api/
│   ├── v1/
│   │   ├── products/
│   │   │   ├── route.ts           # GET /api/v1/products
│   │   │   ├── [id]/
│   │   │   │   └── route.ts       # GET/PUT/DELETE /api/v1/products/:id
│   │   │   └── search/
│   │   │       └── route.ts       # GET /api/v1/products/search
│   │   │
│   │   ├── orders/
│   │   │   ├── route.ts
│   │   │   ├── [id]/
│   │   │   └── calculate/
│   │   │       └── route.ts       # POST - Apply business rules
│   │   │
│   │   ├── tenant/
│   │   │   ├── config/
│   │   │   │   └── route.ts       # GET/PUT tenant config
│   │   │   ├── theme/
│   │   │   │   └── route.ts       # GET/PUT tenant theme
│   │   │   └── features/
│   │   │       └── route.ts       # GET enabled features
│   │   │
│   │   └── custom-fields/
│   │       ├── definitions/
│   │       │   └── route.ts       # CRUD field definitions
│   │       └── values/
│   │           └── route.ts       # CRUD field values
```

### 5.3 Tenant-Aware API Handler

```typescript
// lib/api/with-tenant.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface TenantContext {
  tenantId: string
  businessType: string
  config: TenantConfig
  features: string[]
}

type TenantHandler = (
  request: NextRequest,
  context: TenantContext
) => Promise<NextResponse>

export function withTenant(handler: TenantHandler) {
  return async (request: NextRequest) => {
    const tenantId = request.headers.get('x-tenant-id')
    
    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      )
    }
    
    const supabase = await createClient()
    
    // Set tenant context for RLS
    await supabase.rpc('set_tenant_context', { tenant_id: tenantId })
    
    // Get tenant config
    const { data: tenant } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .single()
    
    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      )
    }
    
    const context: TenantContext = {
      tenantId: tenant.id,
      businessType: tenant.business_type,
      config: tenant.config,
      features: tenant.config?.features || []
    }
    
    return handler(request, context)
  }
}

// Usage:
// export const GET = withTenant(async (request, { tenantId, businessType }) => {
//   // Handler logic with tenant context
// })
```

---

## Part 6: Implementation Roadmap

### Phase 0: Foundation (Week 1-2)

| Task | Effort | Priority |
|------|--------|----------|
| Design & approve architecture | 8h | P0 |
| Create database migrations (006-008) | 8h | P0 |
| Implement business_types registry | 4h | P0 |
| Create tenant config schema | 4h | P0 |
| Set up feature flag system | 4h | P0 |

**Deliverables**:
- ✅ Enhanced tenants table
- ✅ Business types registry
- ✅ Feature flags table
- ✅ Custom fields system

### Phase 1: Theme System (Week 3-4)

| Task | Effort | Priority |
|------|--------|----------|
| Create themes table & presets | 4h | P0 |
| Build TenantThemeProvider | 6h | P0 |
| Create 4+ theme presets | 8h | P1 |
| Build theme editor UI (admin) | 12h | P1 |
| Migrate existing CSS to theme variables | 6h | P1 |

**Deliverables**:
- ✅ Dynamic theme system
- ✅ Theme presets for each business type
- ✅ Admin theme editor

### Phase 2: Component Override System (Week 5-6)

| Task | Effort | Priority |
|------|--------|----------|
| Create component registry | 8h | P0 |
| Build DynamicComponent wrapper | 4h | P0 |
| Create nutrition-specific components | 12h | P1 |
| Create clothing-specific components | 12h | P1 |
| Create restaurant-specific components | 8h | P2 |

**Deliverables**:
- ✅ Component resolution system
- ✅ Business-specific component sets
- ✅ Lazy loading for performance

### Phase 3: Custom Fields System (Week 7-8)

| Task | Effort | Priority |
|------|--------|----------|
| Build custom field definition API | 8h | P0 |
| Build custom field values API | 6h | P0 |
| Create DynamicFieldRenderer component | 8h | P0 |
| Create admin UI for field definitions | 12h | P1 |
| Integrate with product forms | 8h | P1 |

**Deliverables**:
- ✅ Custom field CRUD
- ✅ Dynamic form rendering
- ✅ Admin field management

### Phase 4: Business Rules Engine (Week 9-10)

| Task | Effort | Priority |
|------|--------|----------|
| Implement rule evaluation engine | 16h | P1 |
| Create rule builder UI | 12h | P1 |
| Implement common rule types | 8h | P1 |
| Add rule testing/preview | 6h | P2 |

**Deliverables**:
- ✅ Rule evaluation system
- ✅ Visual rule builder
- ✅ Pre-built rule templates

### Phase 5: Multi-Tenant API (Week 11-12)

| Task | Effort | Priority |
|------|--------|----------|
| Implement tenant resolution middleware | 8h | P0 |
| Create withTenant API wrapper | 4h | P0 |
| Update all existing APIs | 12h | P0 |
| Add tenant config API endpoints | 6h | P1 |
| Performance testing & optimization | 8h | P1 |

**Deliverables**:
- ✅ Tenant-aware API layer
- ✅ Updated existing endpoints
- ✅ Performance benchmarks

---

## Part 7: Business Type Templates

### 7.1 Nutrition/Meal Prep Configuration

```json
{
  "business": {
    "type": "nutrition",
    "subtype": "meal_prep"
  },
  "features": {
    "subscriptions": true,
    "meal_plans": true,
    "nutrition_tracking": true,
    "dietary_filters": true
  },
  "products": {
    "custom_fields": [
      {"key": "calories", "type": "number", "required": true},
      {"key": "protein", "type": "number", "required": true},
      {"key": "carbs", "type": "number", "required": true},
      {"key": "fat", "type": "number", "required": true},
      {"key": "dietary_tags", "type": "multiselect", "options": [
        "vegan", "vegetarian", "gluten_free", "dairy_free", "keto", "paleo"
      ]},
      {"key": "meal_type", "type": "select", "options": [
        "breakfast", "lunch", "dinner", "snack"
      ]},
      {"key": "prep_time", "type": "number", "unit": "minutes"},
      {"key": "serving_size", "type": "text"}
    ],
    "variant_attributes": ["portion_size", "protein_option"]
  },
  "orders": {
    "allow_scheduling": true,
    "scheduling_days_ahead": 7,
    "min_order_amount": 2500
  },
  "theme": {
    "preset": "nutrition_green"
  }
}
```

### 7.2 Clothing/Fashion Configuration

```json
{
  "business": {
    "type": "clothing",
    "subtype": "fashion"
  },
  "features": {
    "size_charts": true,
    "style_recommendations": true,
    "virtual_try_on": false,
    "wishlists": true,
    "reviews": true
  },
  "products": {
    "custom_fields": [
      {"key": "material", "type": "text", "required": true},
      {"key": "care_instructions", "type": "textarea"},
      {"key": "gender", "type": "select", "options": [
        "unisex", "men", "women", "kids"
      ]},
      {"key": "season", "type": "select", "options": [
        "spring", "summer", "fall", "winter", "all_season"
      ]},
      {"key": "fit", "type": "select", "options": [
        "slim", "regular", "relaxed", "oversized"
      ]},
      {"key": "size_chart", "type": "json"}
    ],
    "variant_attributes": ["size", "color"],
    "require_size_selection": true
  },
  "orders": {
    "allow_returns": true,
    "return_window_days": 14
  },
  "theme": {
    "preset": "fashion_noir"
  }
}
```

### 7.3 Restaurant/Cafe Configuration

```json
{
  "business": {
    "type": "restaurant",
    "subtype": "cafe"
  },
  "features": {
    "pos": true,
    "table_management": true,
    "kitchen_display": true,
    "reservations": false
  },
  "products": {
    "custom_fields": [
      {"key": "prep_time", "type": "number", "unit": "minutes"},
      {"key": "printer_dest", "type": "select", "options": [
        "kitchen", "bar", "oven"
      ]},
      {"key": "allergens", "type": "multiselect", "options": [
        "gluten", "dairy", "nuts", "shellfish", "eggs", "soy"
      ]},
      {"key": "spicy_level", "type": "select", "options": [
        "none", "mild", "medium", "hot"
      ]},
      {"key": "modifiers", "type": "json"}
    ],
    "modifiers_enabled": true
  },
  "orders": {
    "types": ["dine_in", "takeaway", "delivery"],
    "allow_tips": true,
    "service_charge_percent": 10
  },
  "theme": {
    "preset": "honey_gold"
  }
}
```

---

## Part 8: Risk Assessment & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Performance degradation with dynamic loading | High | Medium | Aggressive caching, code splitting, preloading |
| Migration breaks existing functionality | High | Medium | Feature flags for gradual rollout, comprehensive testing |
| Complexity overwhelms development team | Medium | High | Phased approach, documentation, training |
| Custom fields create data inconsistency | Medium | Medium | Strict validation, schema versioning |
| Theme customization causes accessibility issues | Medium | Low | Enforce WCAG contrast ratios, accessibility testing |
| Business rules create unexpected behavior | High | Medium | Rule testing sandbox, audit logging |

---

## Part 9: Success Metrics

### Platform Metrics
- **Time to onboard new business type**: < 2 hours
- **Configuration without code changes**: 90%+ of customizations
- **Performance**: < 100ms added latency from multi-tenancy

### Business Metrics
- **New verticals supported**: 3+ within 6 months
- **Tenant satisfaction**: 4.5+ star rating
- **Customization adoption**: 70%+ tenants use custom fields

---

## Appendix A: Supabase RLS Policies

```sql
-- Tenant isolation policy pattern
CREATE POLICY "tenant_isolation_select" ON products
  FOR SELECT
  USING (tenant_id = (current_setting('app.tenant_id', true))::uuid);

CREATE POLICY "tenant_isolation_insert" ON products
  FOR INSERT
  WITH CHECK (tenant_id = (current_setting('app.tenant_id', true))::uuid);

CREATE POLICY "tenant_isolation_update" ON products
  FOR UPDATE
  USING (tenant_id = (current_setting('app.tenant_id', true))::uuid);

CREATE POLICY "tenant_isolation_delete" ON products
  FOR DELETE
  USING (tenant_id = (current_setting('app.tenant_id', true))::uuid);

-- Set tenant context function
CREATE OR REPLACE FUNCTION set_tenant_context(tenant_id UUID)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.tenant_id', tenant_id::text, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Appendix B: Migration Scripts Summary

| Migration | Description |
|-----------|-------------|
| 001_enhance_tenants_business_config | Add business_type, enhance config |
| 002_business_type_registry | Create business_types table |
| 003_custom_fields_system | Custom field definitions & values |
| 004_enhance_products_multi_business | Add custom_data JSONB to products |
| 005_theme_system | Themes & theme presets tables |
| 006_feature_flags | Feature flag system |
| 007_business_rules | Business rules engine |
| 008_workflows | Workflow automation |

---

*Document Version: 1.0*
*Created: December 2024*
*Total Estimated Effort: ~300 hours / 12 weeks*
