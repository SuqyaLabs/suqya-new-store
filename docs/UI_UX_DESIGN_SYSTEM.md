# Suqya E-Commerce UI/UX Design System

> A comprehensive guide to the UI/UX patterns, design tokens, and component library used in the Suqya honey e-commerce platform.

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Layout System](#layout-system)
5. [Navigation Patterns](#navigation-patterns)
6. [Component Library](#component-library)
7. [Animation & Motion](#animation--motion)
8. [Responsive Design](#responsive-design)
9. [Internationalization (i18n) & RTL](#internationalization-i18n--rtl)
10. [Accessibility](#accessibility)
11. [Page Templates](#page-templates)

---

## Design Philosophy

### Brand Identity
Suqya is an Algerian organic honey e-commerce platform that embodies:
- **Authenticity**: Natural, organic products from Algeria
- **Warmth**: Honey-inspired golden tones creating a welcoming atmosphere
- **Trust**: Professional, clean design that builds confidence
- **Cultural Heritage**: Bilingual support (French/Arabic) with RTL consideration

### Design Principles
1. **Simplicity First**: Clean interfaces with clear visual hierarchy
2. **Mobile-First**: Designed for mobile with progressive enhancement
3. **Performance**: Optimized loading with skeleton states
4. **Accessibility**: WCAG-compliant color contrasts and interactions
5. **Consistency**: Unified design language across all pages

---

## Color System

### Primary Palette - Honey Gold
The primary color represents the core product (honey) and evokes warmth and quality.

```css
--honey-50:  #FFF8E1   /* Lightest - backgrounds */
--honey-100: #FFECB3   /* Light accents */
--honey-200: #FFE082   /* Hover states */
--honey-300: #FFD54F   /* Highlights */
--honey-400: #FFCA28   /* Medium emphasis */
--honey-500: #FFC107   /* Default/Ring focus */
--honey-600: #FFB300   /* Primary buttons, CTAs */
--honey-700: #FFA000   /* Price text, links */
--honey-800: #FF8F00   /* Strong emphasis */
--honey-900: #FF6F00   /* Darkest accent */
```

**Usage:**
- `honey-600`: Primary buttons, brand accent
- `honey-700`: Price text, active links
- `honey-100`: Accent backgrounds, badges
- `honey-50`: Subtle highlights, hover backgrounds

### Secondary Palette - Forest Green
Represents nature, organic quality, and Algerian landscapes.

```css
--forest-50:  #E8F5E9   /* Light backgrounds */
--forest-100: #C8E6C9   /* Subtle accents */
--forest-500: #4CAF50   /* Success indicators */
--forest-700: #388E3C   /* Secondary button hover */
--forest-900: #1B5E20   /* Secondary buttons, footer */
```

**Usage:**
- `forest-900`: Secondary buttons, footer background
- `forest-100`: Bio/organic badges
- `forest-50`: Success toast backgrounds

### Neutral Palette - Warm Gray
A warm gray palette that complements the honey tones without feeling cold.

```css
--warm-50:  #FAFAF9   /* Page background (light mode) */
--warm-100: #F5F5F4   /* Card backgrounds, muted */
--warm-200: #E7E5E4   /* Borders, dividers */
--warm-300: #D6D3D1   /* Scrollbar thumb */
--warm-400: #A8A29E   /* Muted foreground (dark mode) */
--warm-500: #78716C   /* Secondary text */
--warm-600: #57534E   /* Body text */
--warm-700: #44403C   /* Strong text, headings */
--warm-800: #292524   /* Card background (dark mode) */
--warm-900: #1C1917   /* Darkest - dark mode background */
```

### Semantic Colors

```css
--success: #10B981   /* Green - success states */
--warning: #F59E0B   /* Amber - warning states */
--error:   #EF4444   /* Red - error states */
--info:    #3B82F6   /* Blue - informational */
```

### Theme Mapping

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--background` | warm-50 | warm-900 |
| `--foreground` | warm-900 | warm-50 |
| `--card` | white | warm-800 |
| `--muted` | warm-100 | warm-800 |
| `--border` | warm-200 | warm-700 |
| `--primary` | honey-600 | honey-600 |
| `--secondary` | forest-900 | forest-900 |

---

## Typography

### Font Families

```css
--font-sans: 'Inter', system-ui, sans-serif;     /* Body text */
--font-heading: 'Playfair Display', serif;       /* Headlines (optional) */
--font-arabic: 'Almarai', system-ui, sans-serif; /* Arabic content */
```

### Font Loading (Next.js)
```tsx
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });
const almarai = Almarai({ 
  variable: "--font-arabic", 
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"] 
});
```

### Type Scale

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| Hero Title | 4xl-6xl | bold | tight | Main page headlines |
| Section Title | 3xl-4xl | bold | normal | Section headers |
| Card Title | lg | semibold | normal | Product names, card headers |
| Body | base | normal | relaxed | Paragraphs, descriptions |
| Small | sm | medium | normal | Labels, captions |
| Tiny | xs | medium | normal | Badges, timestamps |

### Tailwind Typography Classes

```tsx
// Hero heading
<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-warm-900 leading-tight">

// Section heading
<h2 className="text-3xl md:text-4xl font-bold text-warm-900 mb-4">

// Card title
<h3 className="font-semibold text-warm-900 text-lg">

// Body text
<p className="text-warm-600 text-lg leading-relaxed">

// Muted text
<p className="text-warm-500 text-sm">

// Category label
<p className="text-xs text-warm-500 uppercase tracking-wide">
```

---

## Layout System

### Container
Standard container with responsive padding:

```tsx
<div className="container mx-auto px-4">
```

### Page Layout Structure

```tsx
// Root Layout (app/layout.tsx)
<html>
  <body className="antialiased">
    {children}
  </body>
</html>

// Locale Layout (app/[locale]/layout.tsx)
<div dir={isRtl ? "rtl" : "ltr"}>
  <Header />
  <main className="min-h-screen pb-20 lg:pb-0">
    {children}
  </main>
  <Footer />
  <BottomNavBar />  {/* Mobile only */}
  <CartDrawer />    {/* Slide-in drawer */}
</div>
```

### Grid Systems

**Product Grid:**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
```

**Category Grid:**
```tsx
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
```

**Features Grid:**
```tsx
<div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
```

**Footer Grid:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
```

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `gap-1` | 4px | Icon spacing |
| `gap-2` | 8px | Button content spacing |
| `gap-4` | 16px | Card internal spacing |
| `gap-6` | 24px | Grid gaps, section elements |
| `gap-8` | 32px | Large grid gaps |
| `py-16` | 64px | Section vertical padding (mobile) |
| `py-24` | 96px | Section vertical padding (desktop) |

### Section Template

```tsx
<section className="py-16 md:py-24 bg-white">
  <div className="container mx-auto px-4">
    {/* Section Header */}
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-warm-900 mb-4">
        {t("title")}
      </h2>
      <p className="text-warm-500 max-w-2xl mx-auto">
        {t("subtitle")}
      </p>
    </div>
    
    {/* Section Content */}
    <div className="grid ...">
      {/* Items */}
    </div>
  </div>
</section>
```

---

## Navigation Patterns

### Header (Desktop)
- **Position**: Sticky top, z-50
- **Background**: White with 95% opacity + backdrop blur
- **Height**: 64px (h-16)
- **Structure**: Logo | Nav Links | Actions (Language, Search, Cart)

```tsx
<header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-warm-200">
  <div className="container mx-auto px-4">
    <div className="flex h-16 items-center justify-between">
```

### Header Navigation Links
```tsx
<Link
  href="/boutique"
  className="px-4 py-2 text-sm font-medium text-warm-600 hover:text-warm-900 hover:bg-warm-100 rounded-lg transition-colors"
>
```

### Mobile Navigation
- **Trigger**: Hamburger menu icon (Menu/X from Lucide)
- **Animation**: Height + opacity with Framer Motion
- **Links**: Full-width, larger touch targets (py-3)

### Bottom Navigation Bar (Mobile Only)
- **Position**: Fixed bottom, hidden on lg+ breakpoints
- **Height**: 64px (h-16)
- **Items**: Home, Shop, Cart, Account, About
- **Active State**: honey-600 color

```tsx
<nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-warm-200">
  <div className="flex items-center justify-around h-16">
```

### Footer Structure
- **Background**: warm-900 (dark)
- **Text Colors**: white (headings), warm-400 (links), warm-500 (copyright)
- **Hover State**: honey-500
- **Sections**: Brand, Shop Links, Info Links, Contact
- **Bottom Bar**: Copyright + Legal links

---

## Component Library

### Button Component

**Variants:**
| Variant | Style |
|---------|-------|
| `default` | honey-600 bg, dark text, shadow |
| `secondary` | forest-900 bg, white text |
| `outline` | Transparent bg, honey-600 border |
| `ghost` | Transparent, hover bg-warm-100 |
| `link` | Text only with underline on hover |
| `destructive` | Red background |

**Sizes:**
| Size | Height | Padding |
|------|--------|---------|
| `sm` | 36px | px-4 |
| `default` | 44px | px-6 |
| `lg` | 48px | px-8 |
| `xl` | 56px | px-10 |
| `icon` | 40px × 40px | - |

**Base Classes:**
```tsx
"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]"
```

### Badge Component

**Variants:**
| Variant | Colors |
|---------|--------|
| `default` | honey-100 bg, honey-800 text |
| `secondary` | forest-100 bg, forest-900 text |
| `outline` | border, current color text |
| `success` | green-100 bg, green-800 text |
| `warning` | amber-100 bg, amber-800 text |
| `destructive` | red-100 bg, red-800 text |

**Base Classes:**
```tsx
"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
```

### Product Card

**Structure:**
```
┌─────────────────────────┐
│ [Image - aspect-square] │
│   ┌─────┐     ┌───┐     │
│   │Badge│     │ ♡ │     │
│   └─────┘     └───┘     │
├─────────────────────────┤
│ Category (xs, uppercase)│
│ Product Name (semibold) │
│ ★ Rating (if reviews)   │
│ Price (lg, bold, honey) │
│ [Add to Cart Button]    │
└─────────────────────────┘
```

**Styling:**
```tsx
<article className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
```

**Image Hover Effect:**
```tsx
className="object-cover group-hover:scale-105 transition-transform duration-500"
```

### Category Card

**Structure:**
```
┌─────────────────────────┐
│ [Emoji Icon - 5xl]      │
│ Category Name           │
│ Description             │
│ View More →             │
└─────────────────────────┘
```

**Gradient Backgrounds:**
- Pure Honeys: `from-honey-100 to-honey-200`
- Infused Honeys: `from-amber-100 to-amber-200`
- Bee Products: `from-forest-100 to-forest-200`
- Gift Sets: `from-rose-100 to-rose-200`

### Input Component

```tsx
"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
```

### Toast Component

**Types & Colors:**
| Type | Background | Border | Icon |
|------|------------|--------|------|
| success | forest-50 | forest-500 | CheckCircle |
| error | red-50 | red-500 | AlertCircle |
| info | blue-50 | blue-500 | Info |
| warning | honey-50 | honey-500 | AlertTriangle |

**Position:** Fixed bottom-right, z-100

### Cart Drawer

- **Position**: Fixed right, full height
- **Width**: max-w-md (448px)
- **Animation**: Slide in from right with spring physics
- **Backdrop**: Black/50 with backdrop blur

### Skeleton Components

```tsx
// Base skeleton
<div className="animate-pulse rounded-md bg-warm-200" />

// Product card skeleton
<div className="bg-white rounded-2xl overflow-hidden shadow-sm">
  <Skeleton className="aspect-square w-full" />
  <div className="p-4 space-y-3">
    <Skeleton className="h-3 w-16" />
    <Skeleton className="h-5 w-full" />
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-6 w-20" />
    <Skeleton className="h-10 w-full mt-3" />
  </div>
</div>
```

---

## Animation & Motion

### Framer Motion Patterns

**Fade In + Slide Up (Page Enter):**
```tsx
initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
```

**Stagger Container:**
```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};
```

**Scroll-Triggered Animation:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ delay: index * 0.1 }}
>
```

**Drawer Slide Animation:**
```tsx
initial={{ x: "100%" }}
animate={{ x: 0 }}
exit={{ x: "100%" }}
transition={{ type: "spring", damping: 25, stiffness: 300 }}
```

**Dropdown Animation:**
```tsx
initial={{ opacity: 0, y: -10 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -10 }}
transition={{ duration: 0.15 }}
```

### CSS Animations

```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-in-right {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
```

**Utility Classes:**
- `.animate-fade-in`: 0.3s ease-out
- `.animate-slide-up`: 0.4s ease-out
- `.animate-pulse`: Skeleton loading state

---

## Responsive Design

### Breakpoints (Tailwind Default)

| Prefix | Min Width | Usage |
|--------|-----------|-------|
| (none) | 0px | Mobile-first base |
| `sm:` | 640px | Large phones, small tablets |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Small laptops |
| `xl:` | 1280px | Desktops |
| `2xl:` | 1536px | Large desktops |

### Key Responsive Patterns

**Header:**
- Mobile: Logo + hamburger menu + compact language switcher
- Desktop (lg+): Full nav + all action buttons

**Navigation:**
- Mobile: Bottom nav bar (fixed)
- Desktop (lg+): Hidden bottom nav, header nav visible

**Product Grid:**
```tsx
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
```

**Section Padding:**
```tsx
py-16 md:py-24
```

**Typography Scaling:**
```tsx
text-3xl md:text-4xl lg:text-5xl
```

**Content Width:**
```tsx
max-w-xl mx-auto    // Narrow content
max-w-2xl mx-auto   // Medium content
max-w-3xl mx-auto   // Wide content
```

---

## Internationalization (i18n) & RTL

### Supported Locales

| Code | Name | Direction | Flag |
|------|------|-----------|------|
| `fr` | Français | LTR | 🇫🇷 |
| `ar` | العربية | RTL | 🇩🇿 |
| `en` | English | LTR | 🇬🇧 |

### RTL Implementation

**Layout Direction:**
```tsx
<div dir={isRtl ? "rtl" : "ltr"} className={isRtl ? "font-arabic" : ""}>
```

**RTL-Specific CSS:**
```css
[dir="rtl"] {
  --font-sans: var(--font-arabic);
}

[dir="rtl"] .rtl-flip {
  transform: scaleX(-1);
}

/* Animation direction for RTL */
[dir="rtl"] .animate-slide-in-right {
  animation: slide-in-left 0.3s ease-out;
}
```

**Component RTL Patterns:**
```tsx
// Icon rotation for directional icons
<ArrowRight className="rtl:rotate-180" />
<ChevronRight className="rtl:rotate-180" />

// Margin/padding adjustments
<Icon className="mr-2 rtl:ml-2 rtl:mr-0" />

// Logical properties (preferred)
<div className="ps-4 pe-2">  {/* padding-start, padding-end */}
<Icon className="ms-1" />     {/* margin-start */}

// Transform for interactive elements
<div className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
```

### Translation Key Patterns

```tsx
// Use next-intl
import { useTranslations } from "next-intl";

const t = useTranslations("home.hero");
const tCommon = useTranslations("common");

// Nested keys
t("trustBadges.bio")
t("features.delivery.title")
```

---

## Accessibility

### Focus States
All interactive elements include visible focus indicators:
```tsx
"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

### ARIA Labels
```tsx
<button aria-label="Menu">
<button aria-label="Change language" aria-expanded={isOpen}>
<a aria-label="Instagram">
```

### Color Contrast
- Primary text (warm-900) on light backgrounds: ✓ AAA
- Secondary text (warm-500) on light backgrounds: ✓ AA
- Button text (warm-900) on honey-600: ✓ AA

### Keyboard Navigation
- Tab navigation through all interactive elements
- Escape key to close modals/dropdowns
- Enter/Space to activate buttons
- Cmd/Ctrl+K for search modal

### Reduced Motion
Consider adding:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Page Templates

### Home Page Sections
1. **Hero Section** - Full viewport, gradient background, CTAs
2. **Categories Section** - 4-column grid of category cards
3. **Bestsellers Section** - Product grid with header + view all link
4. **Features Section** - 6 feature cards in 3-column grid
5. **Testimonials Section** - 2-column review cards
6. **Newsletter Section** - Dark background, email signup form

### Shop/Boutique Page
- Header with filters (category, sort, price range)
- Product grid (responsive 1-4 columns)
- Empty state when no products match filters

### Product Detail Page
- 2-column layout (Image | Info)
- Variant selector (size/weight options)
- Quantity controls
- Add to cart button
- Product description tabs

### Cart Page
- Item list with quantity controls
- Order summary sidebar
- Checkout CTA

### Checkout Flow
- Multi-step form
- Shipping information
- Payment method selection
- Order confirmation

---

## Utility Functions

### cn() - Class Merge
```tsx
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage
<div className={cn(
  "base-styles",
  isActive && "active-styles",
  className
)} />
```

### formatPrice()
```tsx
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-DZ", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + " DA";
}
```

---

## File Structure Reference

```
components/
├── cart/
│   └── cart-drawer.tsx         # Slide-in cart panel
├── home/
│   ├── hero-section.tsx        # Landing hero
│   ├── categories-section.tsx  # Category grid
│   ├── bestsellers-section.tsx # Featured products
│   ├── features-section.tsx    # Trust features
│   ├── testimonials-section.tsx# Customer reviews
│   └── newsletter-section.tsx  # Email signup
├── layout/
│   ├── header.tsx              # Top navigation
│   ├── footer.tsx              # Site footer
│   ├── bottom-nav-bar.tsx      # Mobile nav
│   └── mobile-nav.tsx          # Mobile menu
├── product/
│   └── product-card.tsx        # Product display card
├── shop/
│   ├── shop-filters.tsx        # Filter controls
│   └── category-filter.tsx     # Category dropdown
├── ui/
│   ├── accordion.tsx           # Expandable panels
│   ├── badge.tsx               # Status/label badges
│   ├── button.tsx              # Button variants
│   ├── input.tsx               # Form input
│   ├── label.tsx               # Form labels
│   ├── language-switcher.tsx   # i18n selector
│   ├── skeleton.tsx            # Loading states
│   ├── textarea.tsx            # Multi-line input
│   └── toast.tsx               # Notifications
└── wishlist/
    └── wishlist-button.tsx     # Favorite toggle
```

---

## Quick Reference Card

### Common Class Patterns

```tsx
// Card
"bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"

// Section
"py-16 md:py-24 bg-white"

// Container
"container mx-auto px-4"

// Section header
"text-center mb-12"

// Heading
"text-3xl md:text-4xl font-bold text-warm-900 mb-4"

// Subtitle
"text-warm-500 max-w-2xl mx-auto"

// Product grid
"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"

// Price
"text-lg font-bold text-honey-700"

// Link hover
"hover:text-honey-500 transition-colors"

// Button (CTA)
"bg-honey-600 text-warm-900 hover:bg-honey-500 rounded-xl"

// Input
"rounded-lg border border-warm-200 focus:ring-2 focus:ring-honey-500"
```

---

*Last updated: December 2024*
*Version: 1.0.0*
