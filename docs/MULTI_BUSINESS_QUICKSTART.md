# Multi-Business Platform Quick Start Guide

> Step-by-step guide to implementing multi-business support.

---

## Phase 1: Database Setup

### Apply Foundation Migration

```bash
# Using Supabase Dashboard SQL Editor
# Copy contents of docs/migrations/001_multi_business_foundation.sql
# Execute in SQL Editor
```

### Verify Migration

```sql
SELECT id, name, default_features FROM business_types ORDER BY sort_order;
SELECT flag_key, is_enabled FROM feature_flags WHERE tenant_id IS NULL;
SELECT get_tenant_config('your-tenant-uuid');
```

---

## Phase 2: Frontend Integration

### Update Root Layout

```tsx
// app/[locale]/layout.tsx
import { TenantProvider } from '@/hooks/use-tenant'

export default async function LocaleLayout({ children }) {
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID
  
  return (
    <TenantProvider initialTenantId={tenantId}>
      {children}
    </TenantProvider>
  )
}
```

### Use in Components

```tsx
import { useTenant, useFeature } from '@/hooks/use-tenant'

export function ProductCard({ product }) {
  const { businessType, productSchema } = useTenant()
  const hasReviews = useFeature('reviews')
  
  return (
    <div>
      <h3>{product.name}</h3>
      {businessType === 'nutrition' && <span>{product.custom_data?.calories} kcal</span>}
      {hasReviews && <ReviewStars />}
    </div>
  )
}
```

---

## Phase 3: Enable Features for Tenant

```sql
-- Enable subscriptions for a tenant
INSERT INTO feature_flags (tenant_id, flag_key, is_enabled)
VALUES ('tenant-uuid', 'subscriptions', true);

-- Enable reviews globally
UPDATE feature_flags SET is_enabled = true 
WHERE tenant_id IS NULL AND flag_key = 'reviews';
```

---

## Phase 4: Set Business Type

```sql
-- Update tenant business type
UPDATE tenants 
SET business_type = 'nutrition'
WHERE id = 'tenant-uuid';

-- Update tenant config
UPDATE tenants 
SET config = jsonb_set(
  COALESCE(config, '{}'), 
  '{features}', 
  '{"subscriptions": true, "meal_plans": true}'
)
WHERE id = 'tenant-uuid';
```

---

## Files Created

| File | Purpose |
|------|---------|
| `docs/MULTI_BUSINESS_ARCHITECTURE.md` | Full architecture documentation |
| `docs/migrations/001_multi_business_foundation.sql` | Database migration |
| `types/multi-business.ts` | TypeScript type definitions |
| `hooks/use-tenant.tsx` | Tenant context & hooks |

---

## Next Steps

1. ✅ Review architecture document
2. 🔲 Apply database migration
3. 🔲 Integrate TenantProvider
4. 🔲 Create business-specific components
5. 🔲 Build theme editor (admin)
6. 🔲 Create custom field management UI

---

*See `MULTI_BUSINESS_ARCHITECTURE.md` for complete details.*
