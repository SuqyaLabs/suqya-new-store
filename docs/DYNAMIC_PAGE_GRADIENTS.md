
# Dynamic Page Gradient System

## Overview

The Dynamic Page Gradient System unifies visual styling across the application based on the active `business_type`. It extends the existing theme system by adding page-level gradients, section overlays, and card accents that automatically adapt to the tenant's business vertical.

## Architecture

### 1. Configuration
- **`lib/theme/page-gradients.ts`**: Defines gradient presets for each business type (nutrition, retail, clothing, etc.).
- **`lib/theme/business-theme-map.ts`**: Maps business types to theme color palettes (e.g., `nutrition` → `nutrition_green`).
- **`types/multi-business.ts`**: Extended to include gradient tokens.

### 2. Provider Injection
The `TenantThemeProvider` (`components/theme/tenant-theme-provider.tsx`) injects CSS variables for gradients into the `:root` element:
- `--gradient-hero`
- `--gradient-section-primary`
- `--gradient-section-secondary`
- `--gradient-card-accent`
- `--gradient-card-highlight`
- `--gradient-overlay`
- `--gradient-footer`

### 3. Components

#### `<PageGradientBackground>`
Wraps the entire page content (in `app/[locale]/layout.tsx`) to provide a subtle, persistent background gradient that matches the business identity.
```tsx
<PageGradientBackground>
  {children}
</PageGradientBackground>
```

#### `<SectionGradient>`
Adds dynamic gradients to specific sections.
```tsx
<section className="relative">
  <SectionGradient variant="primary" intensity="medium" />
  <div className="relative z-10">...</div>
</section>
```

### 4. Integration
The system is integrated into:
- **Root Layout**: Provides the base background.
- **Boutique Page**: Uses section gradients for the header and product grid.
- **Checkout Page**: Uses gradients for the header and empty states, with card styling for forms.
- **Hero System**: Uses the hero gradient token.

## Adding a New Business Type

1. Add the business type to `BusinessTypeId` in `types/multi-business.ts`.
2. Define a color palette in `themePresets` (`tenant-theme-provider.tsx`).
3. Add a gradient config to `pageGradientPresets` (`lib/theme/page-gradients.ts`).
4. Map the business type to the theme in `businessThemeMap` (`lib/theme/business-theme-map.ts`).

## Tokens Reference

| Token Variable | Description | Usage |
|----------------|-------------|-------|
| `--gradient-hero` | High-impact gradient | Hero sections |
| `--gradient-section-primary` | Subtle section bg | Headers, featured areas |
| `--gradient-section-secondary` | Very subtle bg | Content backgrounds |
| `--gradient-card-accent` | Card decoration | Hover states, active cards |
| `--gradient-overlay` | Texture overlay | Full-page depth |
