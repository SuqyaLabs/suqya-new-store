# Suqya UI/UX Implementation Plan

> Complete implementation roadmap for all UI/UX improvement proposals with database schema requirements, task breakdowns, and dependencies.

---

## Current Database Schema Analysis

### Existing Tables

| Table | Status | Description |
|-------|--------|-------------|
| `products` | ✅ Exists | Product catalog with translations |
| `categories` | ✅ Exists | Product categories |
| `variants` | ✅ Exists | Product size/weight variants |
| `inventory_levels` | ✅ Exists | Stock tracking |
| `online_orders` | ✅ Exists | E-commerce orders |
| `online_order_items` | ✅ Exists | Order line items |
| `tenants` | ✅ Exists | Multi-tenant support |
| `locations` | ✅ Exists | Warehouse locations |

### Missing Tables (Required for New Features)

| Table | Required For | Priority |
|-------|--------------|----------|
| `customers` | Account, Loyalty, Wishlist | P0 |
| `customer_addresses` | Saved addresses | P1 |
| `reviews` | Product reviews | P1 |
| `wishlists` | Server-side wishlist | P2 |
| `wishlist_items` | Wishlist products | P2 |
| `loyalty_points` | Loyalty program | P2 |
| `loyalty_transactions` | Points history | P2 |
| `subscriptions` | Recurring orders | P2 |
| `gift_cards` | Gift card system | P3 |
| `abandoned_carts` | Cart recovery | P1 |
| `product_bundles` | Bundle products | P2 |
| `bundle_items` | Bundle contents | P2 |
| `coupons` | Discount codes | P1 |
| `newsletter_subscribers` | Email marketing | P1 |
| `product_views` | Analytics/Recently viewed | P2 |

---

## Database Schema Changes

### Phase 1: Foundation Tables

```sql
-- =============================================
-- PHASE 1: CUSTOMERS & AUTHENTICATION
-- =============================================

-- Customers table (extends Supabase auth.users)
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id),
  email TEXT NOT NULL,
  phone TEXT,
  first_name TEXT,
  last_name TEXT,
  language TEXT DEFAULT 'fr',
  accepts_marketing BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  total_orders INTEGER DEFAULT 0,
  total_spent NUMERIC(12,2) DEFAULT 0,
  UNIQUE(tenant_id, email)
);

-- Customer addresses
CREATE TABLE customer_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  label TEXT, -- 'home', 'work', 'other'
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  wilaya TEXT NOT NULL,
  commune TEXT,
  postal_code TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter subscribers
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  email TEXT NOT NULL,
  source TEXT DEFAULT 'website', -- 'website', 'checkout', 'popup'
  language TEXT DEFAULT 'fr',
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  UNIQUE(tenant_id, email)
);
```

### Phase 2: Reviews & Social Proof

```sql
-- =============================================
-- PHASE 2: REVIEWS & RATINGS
-- =============================================

-- Product reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  order_id UUID REFERENCES online_orders(id), -- Verified purchase
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  pros TEXT[], -- Array of pros
  cons TEXT[], -- Array of cons
  images TEXT[], -- Review photos
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  language TEXT DEFAULT 'fr',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Review helpfulness votes
CREATE TABLE review_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(review_id, customer_id)
);

-- Update products table to cache ratings
ALTER TABLE products ADD COLUMN IF NOT EXISTS 
  avg_rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0;
```

### Phase 3: Wishlist & Engagement

```sql
-- =============================================
-- PHASE 3: WISHLISTS (Server-side)
-- =============================================

-- Wishlists (supports multiple lists per customer)
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  name TEXT DEFAULT 'My Wishlist',
  is_default BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT false, -- Shareable link
  share_token TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wishlist items
CREATE TABLE wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wishlist_id UUID REFERENCES wishlists(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES variants(id) ON DELETE SET NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  price_at_add NUMERIC(12,2), -- Track price drops
  UNIQUE(wishlist_id, product_id, variant_id)
);

-- Abandoned carts (for recovery emails)
CREATE TABLE abandoned_carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  email TEXT,
  cart_data JSONB NOT NULL, -- Serialized cart
  cart_total NUMERIC(12,2),
  recovery_token TEXT UNIQUE,
  reminder_sent_at TIMESTAMPTZ,
  reminder_count INTEGER DEFAULT 0,
  recovered_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Phase 4: Loyalty & Subscriptions

```sql
-- =============================================
-- PHASE 4: LOYALTY PROGRAM
-- =============================================

-- Loyalty tiers
CREATE TABLE loyalty_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  name TEXT NOT NULL, -- 'Bronze', 'Silver', 'Gold', 'Platinum'
  name_ar TEXT,
  name_en TEXT,
  min_points INTEGER NOT NULL,
  multiplier NUMERIC(3,2) DEFAULT 1.0, -- Points multiplier
  benefits JSONB, -- Array of benefit descriptions
  color TEXT, -- Hex color for UI
  icon TEXT, -- Icon name
  sort_order INTEGER DEFAULT 0
);

-- Customer loyalty
CREATE TABLE customer_loyalty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES loyalty_tiers(id),
  total_points INTEGER DEFAULT 0,
  available_points INTEGER DEFAULT 0,
  lifetime_points INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id)
);

-- Points transactions
CREATE TABLE loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  order_id UUID REFERENCES online_orders(id),
  type TEXT NOT NULL, -- 'earn', 'redeem', 'expire', 'bonus', 'refund'
  points INTEGER NOT NULL, -- Positive for earn, negative for redeem
  description TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PHASE 4: SUBSCRIPTIONS
-- =============================================

-- Subscription plans
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  name TEXT NOT NULL,
  name_ar TEXT,
  name_en TEXT,
  frequency_days INTEGER NOT NULL, -- 14, 28, 56
  discount_percent NUMERIC(5,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id),
  status TEXT DEFAULT 'active', -- 'active', 'paused', 'cancelled'
  next_order_date DATE,
  last_order_date DATE,
  shipping_address_id UUID REFERENCES customer_addresses(id),
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paused_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

-- Subscription items
CREATE TABLE subscription_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  variant_id UUID REFERENCES variants(id),
  quantity INTEGER DEFAULT 1
);
```

### Phase 5: Promotions & Bundles

```sql
-- =============================================
-- PHASE 5: COUPONS & PROMOTIONS
-- =============================================

-- Coupons
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  code TEXT NOT NULL,
  type TEXT NOT NULL, -- 'percentage', 'fixed', 'free_shipping'
  value NUMERIC(12,2) NOT NULL,
  min_order_amount NUMERIC(12,2) DEFAULT 0,
  max_discount NUMERIC(12,2), -- Cap for percentage discounts
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  per_customer_limit INTEGER DEFAULT 1,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  applies_to TEXT DEFAULT 'all', -- 'all', 'products', 'categories'
  applies_to_ids UUID[], -- Specific product/category IDs
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, code)
);

-- Coupon usage tracking
CREATE TABLE coupon_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id),
  order_id UUID REFERENCES online_orders(id),
  discount_amount NUMERIC(12,2),
  used_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PHASE 5: PRODUCT BUNDLES
-- =============================================

-- Bundles
CREATE TABLE product_bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  name TEXT NOT NULL,
  name_ar TEXT,
  name_en TEXT,
  slug TEXT UNIQUE,
  description TEXT,
  image TEXT,
  bundle_price NUMERIC(12,2) NOT NULL, -- Discounted bundle price
  original_price NUMERIC(12,2), -- Sum of individual prices
  is_active BOOLEAN DEFAULT true,
  is_customizable BOOLEAN DEFAULT false, -- Build your own
  min_items INTEGER,
  max_items INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bundle items
CREATE TABLE bundle_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id UUID REFERENCES product_bundles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  variant_id UUID REFERENCES variants(id),
  quantity INTEGER DEFAULT 1,
  is_required BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);
```

### Phase 6: Analytics & Personalization

```sql
-- =============================================
-- PHASE 6: ANALYTICS
-- =============================================

-- Product views (for recently viewed & analytics)
CREATE TABLE product_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  session_id TEXT, -- Anonymous tracking
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Search queries (for autocomplete & analytics)
CREATE TABLE search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  query TEXT NOT NULL,
  results_count INTEGER,
  clicked_product_id UUID REFERENCES products(id),
  customer_id UUID REFERENCES customers(id),
  session_id TEXT,
  language TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update products for stock urgency
ALTER TABLE products ADD COLUMN IF NOT EXISTS
  view_count INTEGER DEFAULT 0,
  purchase_count INTEGER DEFAULT 0;
```

---

## Implementation Phases

---

## 📅 PHASE 1: Quick Wins (Week 1-2)

**Goal**: High-impact, low-effort improvements with no database changes

### 1.1 Trust Signals Component
**File**: `components/product/trust-signals.tsx`

| Task | Effort | Dependencies |
|------|--------|--------------|
| Create TrustSignals component | 2h | None |
| Add translations (fr, ar, en) | 1h | None |
| Integrate on product page | 30min | TrustSignals |
| Add to cart drawer | 30min | TrustSignals |

**Schema**: None required

---

### 1.2 Stock Urgency Indicators
**Files**: `components/product/stock-badge.tsx`, update `product-card.tsx`

| Task | Effort | Dependencies |
|------|--------|--------------|
| Create StockBadge component | 2h | None |
| Add low stock threshold logic | 1h | Inventory data |
| Add "X left in stock" display | 1h | StockBadge |
| Add animation for urgency | 1h | StockBadge |

**Schema**: Use existing `inventory_levels.qty_available`

---

### 1.3 Add to Cart Animation
**Files**: `components/cart/add-to-cart-animation.tsx`, update `product-card.tsx`

| Task | Effort | Dependencies |
|------|--------|--------------|
| Create flying product animation | 3h | Framer Motion |
| Cart icon bounce effect | 1h | None |
| Success feedback (toast/confetti) | 2h | Toast system |
| Integrate in ProductCard | 1h | Animation components |

**Schema**: None required

---

### 1.4 Sticky Add-to-Cart Bar
**File**: `components/product/sticky-add-to-cart.tsx`

| Task | Effort | Dependencies |
|------|--------|--------------|
| Create StickyAddToCart component | 3h | None |
| Scroll detection logic | 1h | None |
| Mobile responsive design | 2h | None |
| Integrate on product detail page | 1h | Component ready |

**Schema**: None required

---

### 1.5 Cart Cross-Sells
**Files**: `components/cart/cart-cross-sells.tsx`, `lib/recommendations.ts`

| Task | Effort | Dependencies |
|------|--------|--------------|
| Create recommendation logic | 3h | Product data |
| Create CrossSellCard component | 2h | None |
| Integrate in cart drawer | 1h | CrossSellCard |
| Add one-click add functionality | 1h | Cart store |

**Schema**: None (uses existing category relationships)

---

## 📅 PHASE 2: Core Features (Week 3-4)

**Goal**: Essential features requiring minor database changes

### 2.1 Newsletter System
**Files**: `components/newsletter/`, `app/api/newsletter/`

| Task | Effort | Dependencies |
|------|--------|--------------|
| Create DB migration | 1h | Schema above |
| Create subscribe API endpoint | 2h | DB ready |
| Update NewsletterSection | 2h | API ready |
| Create exit-intent popup | 3h | None |
| Add to checkout flow | 1h | API ready |

**Schema**: `newsletter_subscribers` table

---

### 2.2 Customer Accounts
**Files**: `app/[locale]/compte/`, `lib/auth/`

| Task | Effort | Dependencies |
|------|--------|--------------|
| Create customers migration | 1h | Schema above |
| Set up Supabase Auth | 3h | None |
| Create login/register pages | 4h | Auth setup |
| Create account dashboard | 4h | Auth setup |
| Order history page | 3h | Auth + Orders |
| Saved addresses management | 4h | Addresses table |

**Schema**: `customers`, `customer_addresses` tables

---

### 2.3 Search Improvements
**Files**: `components/search/`, `app/api/products/search/`

| Task | Effort | Dependencies |
|------|--------|--------------|
| Enhance search API (fuzzy match) | 3h | None |
| Add Arabic transliteration | 2h | None |
| Search suggestions dropdown | 4h | API ready |
| Recent searches (localStorage) | 2h | None |
| Search analytics tracking | 2h | Optional |

**Schema**: Optional `search_queries` table

---

### 2.4 Abandoned Cart Recovery
**Files**: `lib/cart-recovery/`, `app/api/cart/`

| Task | Effort | Dependencies |
|------|--------|--------------|
| Create abandoned_carts migration | 1h | Schema above |
| Cart persistence API | 3h | DB ready |
| Recovery email template | 3h | Resend setup |
| Cron job for reminders | 2h | API ready |
| Recovery link handler | 2h | API ready |

**Schema**: `abandoned_carts` table

---

### 2.5 Coupon System
**Files**: `components/checkout/coupon-input.tsx`, `app/api/coupons/`

| Task | Effort | Dependencies |
|------|--------|--------------|
| Create coupons migration | 1h | Schema above |
| Coupon validation API | 3h | DB ready |
| CouponInput component | 2h | API ready |
| Integrate in checkout | 2h | Component ready |
| Admin: coupon management | 4h | DB ready |

**Schema**: `coupons`, `coupon_usage` tables

---

## 📅 PHASE 3: Engagement Features (Week 5-6)

**Goal**: Features to increase user engagement and retention

### 3.1 Product Reviews
**Files**: `components/reviews/`, `app/api/reviews/`

| Task | Effort | Dependencies |
|------|--------|--------------|
| Create reviews migration | 1h | Schema above |
| Reviews API (CRUD) | 4h | DB ready |
| ReviewCard component | 2h | None |
| ReviewsList component | 2h | ReviewCard |
| ReviewForm component | 3h | API ready |
| Star rating component | 1h | None |
| Photo upload support | 3h | Supabase Storage |
| Verified purchase badge | 1h | Order data |
| Helpful vote system | 2h | API ready |
| Product rating aggregation | 2h | Trigger/function |

**Schema**: `reviews`, `review_votes` tables + product columns

---

### 3.2 Server-Side Wishlist
**Files**: `components/wishlist/`, `app/api/wishlist/`

| Task | Effort | Dependencies |
|------|--------|--------------|
| Create wishlists migration | 1h | Schema above |
| Wishlist API | 3h | DB ready |
| Migrate from localStorage | 2h | Customer auth |
| Multiple wishlists support | 2h | API ready |
| Shareable wishlist links | 2h | API ready |
| Price drop notifications | 3h | Wishlist + Email |
| Wishlist page UI | 3h | API ready |

**Schema**: `wishlists`, `wishlist_items` tables

---

### 3.3 WhatsApp Integration
**Files**: `components/chat/whatsapp-button.tsx`

| Task | Effort | Dependencies |
|------|--------|--------------|
| Create WhatsApp button component | 2h | None |
| Order inquiry deep link | 1h | Order data |
| Product inquiry deep link | 1h | Product data |
| Business hours display | 1h | Config |
| Mobile floating button | 1h | None |

**Schema**: None required

---

### 3.4 "Help Me Choose" Quiz
**Files**: `components/quiz/`, `app/[locale]/quiz/`

| Task | Effort | Dependencies |
|------|--------|--------------|
| Design quiz flow | 2h | None |
| Create Quiz components | 4h | None |
| Quiz step components | 3h | None |
| Results algorithm | 3h | Product data |
| Results page | 3h | Algorithm ready |
| Add translations | 2h | None |

**Schema**: None (optional analytics table)

---

## 📅 PHASE 4: Premium Features (Week 7-8)

**Goal**: High-value features for differentiation

### 4.1 Loyalty Program
**Files**: `components/loyalty/`, `app/api/loyalty/`

| Task | Effort | Dependencies |
|------|--------|--------------|
| Create loyalty migrations | 1h | Schema above |
| Loyalty API | 4h | DB ready |
| Points calculation logic | 2h | API ready |
| Tier system logic | 2h | API ready |
| Loyalty dashboard UI | 4h | API ready |
| Points earning on order | 2h | Order hooks |
| Points redemption at checkout | 3h | Checkout flow |
| Birthday bonus automation | 2h | Customer data |

**Schema**: `loyalty_tiers`, `customer_loyalty`, `loyalty_transactions`

---

### 4.2 Subscription Orders
**Files**: `components/subscription/`, `app/api/subscriptions/`

| Task | Effort | Dependencies |
|------|--------|--------------|
| Create subscription migrations | 1h | Schema above |
| Subscription API | 4h | DB ready |
| Subscription plans config | 2h | API ready |
| Subscribe button on product | 2h | API ready |
| Subscription management UI | 4h | API ready |
| Pause/resume functionality | 2h | API ready |
| Recurring order generation | 4h | Cron job |
| Subscription emails | 2h | Resend |

**Schema**: `subscription_plans`, `subscriptions`, `subscription_items`

---

### 4.3 Product Bundles
**Files**: `components/bundles/`, `app/api/bundles/`

| Task | Effort | Dependencies |
|------|--------|--------------|
| Create bundle migrations | 1h | Schema above |
| Bundle API | 3h | DB ready |
| BundleCard component | 2h | None |
| Bundle detail page | 3h | API ready |
| "Build Your Own" UI | 4h | API ready |
| Bundle cart integration | 2h | Cart store |
| Savings calculator display | 1h | Bundle data |

**Schema**: `product_bundles`, `bundle_items`

---

### 4.4 Interactive Origin Map
**Files**: `components/map/algeria-map.tsx`

| Task | Effort | Dependencies |
|------|--------|--------------|
| Create SVG Algeria map | 4h | Design |
| Region hover interactions | 2h | Map ready |
| Region click filtering | 2h | Shop filters |
| Product origin markers | 2h | Product data |
| Mobile touch support | 1h | None |
| Add to homepage | 1h | Component ready |
| Add to product pages | 1h | Component ready |

**Schema**: Add `origin_region` to products (optional)

---

## 📅 PHASE 5: Polish & Optimization (Ongoing)

### 5.1 Micro-Interactions
| Task | Effort |
|------|--------|
| Button hover effects | 2h |
| Card hover animations | 2h |
| Scroll-triggered animations | 3h |
| Page transition animations | 3h |
| Loading state refinements | 2h |
| Skeleton shimmer effects | 1h |

### 5.2 Performance
| Task | Effort |
|------|--------|
| Image optimization (AVIF/WebP) | 3h |
| Lazy loading refinement | 2h |
| Bundle size analysis | 2h |
| Core Web Vitals audit | 4h |
| Edge caching setup | 4h |

### 5.3 Mobile Polish
| Task | Effort |
|------|--------|
| Bottom sheet modals | 4h |
| Swipe gestures | 3h |
| Pull-to-refresh | 2h |
| PWA setup | 4h |
| App install prompt | 2h |

---

## Dependencies Graph

```
                    ┌─────────────────┐
                    │   PHASE 1       │
                    │  (No DB changes)│
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
    │  Trust      │  │  Stock      │  │  Animations │
    │  Signals    │  │  Urgency    │  │             │
    └─────────────┘  └─────────────┘  └─────────────┘
              │              │              │
              └──────────────┼──────────────┘
                             ▼
                    ┌─────────────────┐
                    │   PHASE 2       │
                    │ (customers DB)  │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
    ┌─────────┐        ┌─────────┐        ┌─────────┐
    │Customer │        │Newsletter│       │Abandoned│
    │Accounts │        │System   │        │Cart     │
    └────┬────┘        └─────────┘        └─────────┘
         │
         ▼
    ┌─────────────────┐
    │   PHASE 3       │
    │ (reviews, wish) │
    └────────┬────────┘
         │
         ├──────────────────┐
         ▼                  ▼
    ┌─────────┐        ┌─────────┐
    │Reviews  │        │Server   │
    │System   │        │Wishlist │
    └─────────┘        └─────────┘
         │
         ▼
    ┌─────────────────┐
    │   PHASE 4       │
    │(loyalty, subs)  │
    └────────┬────────┘
         │
    ┌────┴────┬─────────┐
    ▼         ▼         ▼
┌───────┐ ┌───────┐ ┌───────┐
│Loyalty│ │Subscr.│ │Bundles│
│Program│ │Orders │ │       │
└───────┘ └───────┘ └───────┘
```

---

## Migration Execution Order

```bash
# Phase 1: No migrations needed

# Phase 2
supabase migration new 001_customers
supabase migration new 002_customer_addresses
supabase migration new 003_newsletter_subscribers
supabase migration new 004_abandoned_carts
supabase migration new 005_coupons

# Phase 3
supabase migration new 006_reviews
supabase migration new 007_review_votes
supabase migration new 008_wishlists
supabase migration new 009_wishlist_items
supabase migration new 010_products_rating_columns

# Phase 4
supabase migration new 011_loyalty_tiers
supabase migration new 012_customer_loyalty
supabase migration new 013_loyalty_transactions
supabase migration new 014_subscription_plans
supabase migration new 015_subscriptions
supabase migration new 016_subscription_items
supabase migration new 017_product_bundles
supabase migration new 018_bundle_items

# Phase 5
supabase migration new 019_product_views
supabase migration new 020_search_queries
```

---

## Effort Summary

| Phase | Duration | Effort (hours) | DB Changes |
|-------|----------|----------------|------------|
| Phase 1 | Week 1-2 | ~40h | None |
| Phase 2 | Week 3-4 | ~60h | 5 tables |
| Phase 3 | Week 5-6 | ~55h | 4 tables |
| Phase 4 | Week 7-8 | ~65h | 7 tables |
| Phase 5 | Ongoing | ~40h | 2 tables |
| **Total** | **8 weeks** | **~260h** | **18 tables** |

---

## Success Metrics

### Phase 1 KPIs
- Add to cart rate: +10%
- Time on product page: +15%

### Phase 2 KPIs
- Cart abandonment recovery: 5-10%
- Newsletter signup rate: 3-5%
- Customer account creation: 20%

### Phase 3 KPIs
- Review submission rate: 5%
- Wishlist usage: 15% of users
- WhatsApp inquiries: measurable

### Phase 4 KPIs
- Subscription adoption: 3-5%
- Loyalty program enrollment: 30%
- Bundle purchase rate: 10%

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Database migration failures | Test on branch first, have rollback plan |
| Auth integration issues | Use Supabase Auth best practices |
| Performance degradation | Monitor Core Web Vitals, optimize queries |
| Feature creep | Stick to MVP for each phase |
| Translation gaps | Create translation checklist |

---

## Next Steps

1. ✅ Review and approve this plan
2. 🔲 Create database migrations for Phase 2
3. 🔲 Set up development branch in Supabase
4. 🔲 Begin Phase 1 component development
5. 🔲 Set up analytics tracking

---

*Document created: December 2024*
*Version: 1.0*
*Total estimated effort: 260 hours / 8 weeks*
