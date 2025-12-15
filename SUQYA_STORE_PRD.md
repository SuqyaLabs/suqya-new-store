# Suqya - Boutique en Ligne de Miel Bio
# Suqya - Organic Bee Honey Online Store PRD
# سُقيا - متجر العسل العضوي الإلكتروني

**Version:** 1.0  
**Date:** December 9, 2025  
**Status:** Product Requirements Document  
**Author:** Product Analysis Team  
**Languages:** 🇫🇷 FR (Primary) | 🇬🇧 EN | 🇩🇿 AR

---

## Executive Summary

### Vision Statement
**"Bringing the purest Algerian honey from mountain apiaries to your doorstep."**

Suqya is a premium **mobile-first e-commerce platform** for organic bee honey and hive products, targeting health-conscious consumers in Algeria and the MENA region. Built on the SaharaOS ecosystem, it provides seamless integration between the online storefront and physical retail operations.

### Business Context

| Attribute | Value |
|-----------|-------|
| **Brand Name** | Suqya (سُقيا) - Arabic for "to quench/nourish" |
| **Business Type** | Retail (E-commerce + POS) |
| **Primary Market** | Algeria (DZD currency) |
| **Target Launch** | Q1 2026 |
| **Platform** | Next.js 15 + Supabase + SaharaOS POS |

### Product Catalog Overview

| Category | Products | Price Range (DZD) |
|----------|----------|-------------------|
| **Miels Purs** | Jujubier, Eucalyptus, Montagne | 2,200 - 8,500 |
| **Miels Infusés** | Gingembre, Nigelle | 2,800 - 3,500 |
| **Produits de la Ruche** | Pollen, Propolis, Cire | 1,800 - 2,500 |
| **Coffrets Cadeaux** | Gift sets | 5,000 - 15,000 |

---

## Part 1: Chain-of-Thought Analysis

### 1.1 Market Analysis

```
WHO → Health-conscious consumers, natural remedy seekers, gift buyers
WHAT → Premium organic honey with traceability & authenticity
WHERE → Algeria (primary), MENA diaspora (secondary)
WHY → Growing demand for natural/organic products, distrust of mass-market honey
HOW → Mobile-first DTC e-commerce with POS integration
```

### 1.2 Competitive Landscape

| Competitor | Strengths | Weaknesses | Suqya Opportunity |
|------------|-----------|------------|-------------------|
| **Local apiaries** | Authenticity | No online presence | Digital-first approach |
| **Supermarket honey** | Distribution | Quality concerns | Premium positioning |
| **Instagram sellers** | Social proof | No real e-commerce | Professional platform |
| **Import brands** | Branding | Price, not local | "Made in Algeria" story |

### 1.3 User Personas

#### Persona 1: Fatima (فاطمة) - The Health Mother
```yaml
Age: 35-45
Location: Algiers, urban
Income: Middle-class
Goals:
  - Buy pure honey for family health
  - Natural remedies for children
  - Trust and authenticity
Pain Points:
  - Skeptical of "fake honey"
  - Prefers cash on delivery
  - Wants to see before buying
Device: Android smartphone (primary)
Language: Arabic (Darija), French
```

#### Persona 2: Karim (كريم) - The Diaspora Gift Giver
```yaml
Age: 28-40
Location: France (Algerian diaspora)
Income: Upper-middle
Goals:
  - Send authentic Algerian products to family
  - Corporate gifts with Algerian identity
Pain Points:
  - International shipping
  - Prefers card payments
  - Quality guarantee needed
Device: iPhone
Language: French, Arabic
```

#### Persona 3: Youcef (يوسف) - The Wellness Enthusiast
```yaml
Age: 25-35
Location: Algeria, cities
Income: Young professional
Goals:
  - Organic lifestyle
  - Specific honey types (Sidr for immunity)
  - Social media shareable
Pain Points:
  - Wants detailed product info
  - Subscription/recurring orders
  - Modern payment (Edahabia)
Device: Smartphone (Android/iOS)
Language: French, English
```

### 1.4 Business Requirements

| # | Requirement | Priority | Rationale |
|---|-------------|----------|-----------|
| BR-1 | Mobile-first responsive design | P0 | 85%+ traffic from mobile in Algeria |
| BR-2 | Trilingual support (FR/EN/AR) | P0 | Market reach |
| BR-3 | DZD pricing with CIB/Edahabia | P0 | Local payment adoption |
| BR-4 | Cash on Delivery (COD) | P0 | Trust barrier in Algeria |
| BR-5 | Real-time inventory sync with POS | P0 | Single source of truth |
| BR-6 | WhatsApp ordering fallback | P1 | Customer preference |
| BR-7 | Product traceability (batch/origin) | P1 | Premium differentiation |
| BR-8 | Gift wrapping & messages | P2 | Gift market segment |
| BR-9 | Subscription/recurring orders | P2 | Customer retention |
| BR-10 | International shipping | P3 | Diaspora market |

---

## Part 2: Information Architecture

### 2.1 Sitemap

```
🏠 Home (/)
├── 🛒 Shop (/boutique)
│   ├── Miels Purs (/boutique/miels-purs)
│   │   ├── Miel de Jujubier (/boutique/miel-jujubier-sidr)
│   │   ├── Miel d'Eucalyptus (/boutique/miel-eucalyptus)
│   │   └── Miel de Montagne (/boutique/miel-montagne)
│   ├── Miels Infusés (/boutique/miels-infuses)
│   │   ├── Miel au Gingembre (/boutique/miel-gingembre)
│   │   └── Miel à la Nigelle (/boutique/miel-nigelle)
│   ├── Produits de la Ruche (/boutique/produits-ruche)
│   │   ├── Pollen (/boutique/pollen-abeille)
│   │   └── Propolis (/boutique/propolis-pure)
│   └── Coffrets Cadeaux (/boutique/coffrets)
├── 📖 Notre Histoire (/notre-histoire)
├── 🐝 Le Miel (/guide-miel)
│   ├── Bienfaits du miel (/guide-miel/bienfaits)
│   ├── Comment choisir son miel (/guide-miel/choisir)
│   └── Conservation (/guide-miel/conservation)
├── 📞 Contact (/contact)
├── 🛒 Panier (/panier)
├── 💳 Checkout (/checkout)
└── 👤 Mon Compte (/compte)
    ├── Commandes (/compte/commandes)
    ├── Adresses (/compte/adresses)
    └── Points fidélité (/compte/fidelite)
```

### 2.2 Data Model (Supabase Integration)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SUQYA DATA ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐        │
│  │   tenants    │────▶│  categories  │────▶│   products   │        │
│  │  (suqya)     │     │ (4 types)    │     │ (7 products) │        │
│  └──────────────┘     └──────────────┘     └──────┬───────┘        │
│         │                                          │                │
│         │                                          ▼                │
│         │                                   ┌──────────────┐        │
│         │                                   │   variants   │        │
│         │                                   │ (250g/500g/  │        │
│         │                                   │  1kg sizes)  │        │
│         │                                   └──────┬───────┘        │
│         │                                          │                │
│         │              ┌───────────────────────────┤                │
│         │              │                           │                │
│         ▼              ▼                           ▼                │
│  ┌──────────────┐  ┌──────────────┐     ┌──────────────┐           │
│  │  customers   │  │  locations   │     │  inventory   │           │
│  │ (groups:     │  │ (warehouse)  │     │   _levels    │           │
│  │  retail/     │  └──────────────┘     └──────────────┘           │
│  │  wholesale/  │                                                   │
│  │  vip)        │                                                   │
│  └──────┬───────┘                                                   │
│         │                                                           │
│         ▼                                                           │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐        │
│  │   orders     │────▶│ order_lines  │────▶│  payments    │        │
│  │ (online/pos) │     │              │     │              │        │
│  └──────────────┘     └──────────────┘     └──────────────┘        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Part 3: UI/UX Design System

### 3.1 Brand Identity

#### Color Palette

```css
/* Suqya Brand Colors */
:root {
  /* Primary - Honey Gold */
  --honey-50: #FFF8E1;
  --honey-100: #FFECB3;
  --honey-200: #FFE082;
  --honey-300: #FFD54F;
  --honey-400: #FFCA28;
  --honey-500: #FFC107;  /* Primary */
  --honey-600: #FFB300;
  --honey-700: #FFA000;
  --honey-800: #FF8F00;
  --honey-900: #FF6F00;
  
  /* Secondary - Forest Green */
  --forest-50: #E8F5E9;
  --forest-100: #C8E6C9;
  --forest-500: #4CAF50;
  --forest-700: #388E3C;
  --forest-900: #1B5E20;  /* Secondary */
  
  /* Neutral - Warm Gray */
  --warm-50: #FAFAF9;
  --warm-100: #F5F5F4;
  --warm-200: #E7E5E4;
  --warm-500: #78716C;
  --warm-800: #292524;
  --warm-900: #1C1917;
  
  /* Semantic */
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #3B82F6;
}

/* Dark Mode */
.dark {
  --bg-primary: #1C1917;
  --bg-secondary: #292524;
  --text-primary: #FAFAF9;
  --text-secondary: #A8A29E;
}
```

#### Typography

```css
/* Fonts */
--font-heading: 'Playfair Display', serif;  /* Elegant, premium feel */
--font-body: 'Inter', sans-serif;            /* Clean, readable */
--font-arabic: 'Noto Kufi Arabic', sans-serif;  /* RTL support */

/* Scale */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
```

### 3.2 Mobile-First Component Specifications

#### A. Product Card (Mobile)

```
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │      [PRODUCT IMAGE]        │   │ 
│  │        (Square 1:1)         │   │  aspect-ratio: 1/1
│  │                             │   │
│  │   ┌─────┐                   │   │  Badge: "Bio" / "Nouveau"
│  │   │ BIO │                   │   │
│  │   └─────┘                   │   │
│  └─────────────────────────────┘   │
│                                     │
│  Miel de Jujubier (Sidr)           │  font: heading, text-base
│  ★★★★★ (24 avis)                   │  text-warm-500, text-sm
│                                     │
│  4,500 DA                          │  font-bold, text-honey-600
│  À partir de 2,500 DA (250g)       │  text-sm, text-warm-500
│                                     │
│  ┌─────────────────────────────┐   │
│  │     🛒 Ajouter au panier     │   │  Primary button
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘

Width: 100% (mobile) | 300px (desktop grid)
Padding: 12px
Border-radius: 12px
Shadow: sm on hover
```

#### B. Size Selector

```
┌─────────────────────────────────────────────────────────┐
│  Choisir la taille:                                     │
│                                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                 │
│  │  250g   │  │  500g   │  │   1kg   │                 │
│  │ 2,500DA │  │ 4,500DA │  │ 8,500DA │                 │
│  │         │  │ ██████  │  │         │                 │
│  └─────────┘  └─────────┘  └─────────┘                 │
│                  ▲                                      │
│                  │ Selected state:                      │
│                  │ border-honey-500, bg-honey-50        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### C. Mobile Navigation

```
┌─────────────────────────────────────────────────────────┐
│  ≡  [SUQYA LOGO]               🔍  👤  🛒(3)           │  Header: 56px
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    [PAGE CONTENT]                       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   🏠        🛒        🐝        👤        ≡            │  Bottom nav: 64px
│  Accueil  Boutique  Guide    Compte    Plus           │  (mobile only)
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### D. Cart Drawer (Mobile)

```
┌─────────────────────────────────────────────────────────┐
│                                                    ✕    │  Slide from right
├─────────────────────────────────────────────────────────┤
│  Votre Panier (3 articles)                              │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │ [IMG]  Miel de Jujubier 500g          4,500DA   │   │
│  │        Qté: [ - ] 1 [ + ]          🗑️ Supprimer │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ [IMG]  Miel au Gingembre 250g         2,800DA   │   │
│  │        Qté: [ - ] 2 [ + ]          🗑️ Supprimer │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Sous-total:                             10,100 DA      │
│  Livraison:                      Calculé au checkout    │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │         💳 Passer la commande                   │   │  Primary CTA
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │         🛒 Continuer mes achats                 │   │  Secondary
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 3.3 Key Page Wireframes

#### Homepage (Mobile)

```
┌─────────────────────────────────────────────────────────┐
│  [HEADER - Fixed]                                       │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │              HERO IMAGE                         │   │
│  │          (Honey dripping,                       │   │  Height: 60vh
│  │           bees, nature)                         │   │
│  │                                                 │   │
│  │     "Miel Bio d'Algérie"                       │   │  Overlay text
│  │     "Du rucher à votre table"                  │   │
│  │                                                 │   │
│  │     [ Découvrir nos miels ]                    │   │  CTA button
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ── Nos Best-Sellers ──                                │
│                                                         │
│  ┌────────┐ ┌────────┐ ┌────────┐                     │  Horizontal scroll
│  │Product │ │Product │ │Product │ →                   │
│  │Card 1  │ │Card 2  │ │Card 3  │                     │
│  └────────┘ └────────┘ └────────┘                     │
│                                                         │
│  ── Pourquoi Suqya? ──                                 │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  🐝 100% Bio   │  🏔️ Origine   │  🚚 Livraison │   │
│  │                │  Kabylie      │  Rapide       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ── Témoignages Clients ──                             │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  "Le meilleur miel que j'ai goûté..."          │   │
│  │   ★★★★★ - Fatima, Alger                        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ── Instagram @suqya.dz ──                             │
│                                                         │
│  [Instagram Feed Grid]                                  │
│                                                         │
│  [FOOTER]                                              │
├─────────────────────────────────────────────────────────┤
│  [BOTTOM NAV - Fixed]                                   │
└─────────────────────────────────────────────────────────┘
```

#### Product Detail Page (Mobile)

```
┌─────────────────────────────────────────────────────────┐
│  ← Retour                               ♡  🔗 Partager │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │            [PRODUCT IMAGE GALLERY]              │   │  Swipeable
│  │               (1:1 aspect)                      │   │
│  │                                                 │   │
│  │              • ○ ○ ○                           │   │  Dot indicators
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [BIO] [KABYLIE]                                        │  Badges
│                                                         │
│  Miel de Jujubier (Sidr)                               │  H1
│  عسل السدر                                              │  Arabic subtitle
│                                                         │
│  ★★★★★ 4.9 (127 avis)                                  │
│                                                         │
│  4,500 DA                                              │  Price prominent
│  (9.00 DA/g)                                           │  Unit price
│                                                         │
│  ── Choisir la taille ──                               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                  │
│  │  250g   │ │  500g   │ │   1kg   │                  │
│  │ 2,500DA │ │ 4,500DA │ │ 8,500DA │                  │
│  └─────────┘ └─────────┘ └─────────┘                  │
│                                                         │
│  ── Quantité ──                                        │
│  ┌────────────────────────────────┐                    │
│  │    [ - ]      1      [ + ]     │                    │
│  └────────────────────────────────┘                    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │         🛒 Ajouter au panier - 4,500 DA         │   │  Sticky CTA
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ── Description ──                                     │
│  Notre miel de Jujubier (Sidr) est récolté dans       │
│  les régions montagneuses d'Algérie. Reconnu pour     │
│  ses propriétés thérapeutiques exceptionnelles...     │
│  [Lire plus]                                           │
│                                                         │
│  ── Bienfaits ──                                       │
│  ✓ Renforce l'immunité                                │
│  ✓ Propriétés antibactériennes                        │
│  ✓ Aide à la cicatrisation                            │
│  ✓ Énergie naturelle                                  │
│                                                         │
│  ── Origine & Traçabilité ──                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  🗺️ Région: Kabylie, Tizi Ouzou                │   │
│  │  📅 Récolte: Été 2024                          │   │
│  │  🔢 Lot: SQ-JUJ-2024-007                       │   │
│  │  🌡️ Conservation: 18-25°C                      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ── Avis Clients (127) ──                             │
│  ┌─────────────────────────────────────────────────┐   │
│  │  ★★★★★  "Excellent miel, très pur"             │   │
│  │  Ahmed B. - Alger - 15 Nov 2024                │   │
│  └─────────────────────────────────────────────────┘   │
│  [Voir tous les avis]                                  │
│                                                         │
│  ── Produits Similaires ──                            │
│  [Horizontal scroll product cards]                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Checkout Flow (Mobile)

```
STEP 1: Information                    STEP 2: Livraison
┌─────────────────────────────┐       ┌─────────────────────────────┐
│  ━━━━━━○─────────○─────────○│       │  ━━━━━━━━━━━━○─────────○    │
│  Info    Livraison  Paiement│       │  Info    Livraison  Paiement│
├─────────────────────────────┤       ├─────────────────────────────┤
│                             │       │                             │
│  Contact                    │       │  Adresse de livraison       │
│  ┌─────────────────────┐    │       │  ┌─────────────────────┐    │
│  │ Email              │    │       │  │ Adresse complète    │    │
│  └─────────────────────┘    │       │  └─────────────────────┘    │
│  ┌─────────────────────┐    │       │  ┌──────────┐┌──────────┐   │
│  │ Téléphone          │    │       │  │ Wilaya   ││ Commune  │   │
│  └─────────────────────┘    │       │  └──────────┘└──────────┘   │
│                             │       │                             │
│  ☑️ M'envoyer les offres    │       │  Mode de livraison          │
│                             │       │  ┌─────────────────────┐    │
│  ┌─────────────────────┐    │       │  │ ○ Yalidine Express  │    │
│  │    Continuer        │    │       │  │   3-5 jours - 500DA │    │
│  └─────────────────────┘    │       │  └─────────────────────┘    │
│                             │       │  ┌─────────────────────┐    │
│  Résumé commande       ▼    │       │  │ ○ Point Relais      │    │
│  3 articles - 10,100 DA     │       │  │   5-7 jours - 300DA │    │
│                             │       │  └─────────────────────┘    │
└─────────────────────────────┘       └─────────────────────────────┘


STEP 3: Paiement
┌─────────────────────────────┐
│  ━━━━━━━━━━━━━━━━━━━━━━━━○  │
│  Info    Livraison  Paiement│
├─────────────────────────────┤
│                             │
│  Mode de paiement           │
│  ┌─────────────────────┐    │
│  │ ● Paiement à la     │    │  DEFAULT for Algeria
│  │   livraison (COD)   │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │ ○ Carte CIB/        │    │
│  │   Edahabia          │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │ ○ Virement          │    │
│  │   bancaire          │    │
│  └─────────────────────┘    │
│                             │
│  ────────────────────────   │
│  Sous-total:     10,100 DA  │
│  Livraison:         500 DA  │
│  ────────────────────────   │
│  TOTAL:          10,600 DA  │
│                             │
│  ┌─────────────────────┐    │
│  │  ✓ Confirmer        │    │
│  │    commande         │    │
│  └─────────────────────┘    │
│                             │
│  🔒 Paiement sécurisé       │
│  Vos données sont protégées │
└─────────────────────────────┘
```

---

## Part 4: Technical Architecture

### 4.1 Technology Stack

```yaml
Frontend:
  Framework: Next.js 15 (App Router)
  Language: TypeScript (strict mode)
  Styling: TailwindCSS 4.0
  Components: shadcn/ui + Radix primitives
  Icons: Lucide React
  Animations: Framer Motion
  i18n: next-intl (FR/EN/AR with RTL)
  State: Zustand (cart) + TanStack Query (data)
  Forms: React Hook Form + Zod

Backend:
  Database: Supabase (PostgreSQL)
  Auth: Supabase Auth (magic link + OAuth)
  Storage: Supabase Storage (product images)
  Edge Functions: Deno (order processing)
  Real-time: Supabase Realtime (stock updates)

Integration:
  POS Sync: SaharaOS (bidirectional via Supabase)
  Payments: 
    - Satim/CIB Gateway (Algeria cards)
    - Baridimob/Edahabia
    - COD (Cash on Delivery)
  Shipping:
    - Yalidine API
    - EMS Algérie
  SMS: Twilio (order notifications)
  Email: Resend (transactional)
  Analytics: Plausible (privacy-first)

DevOps:
  Hosting: Vercel (Edge)
  CDN: Vercel Edge Network
  Monitoring: Sentry
  CI/CD: GitHub Actions
```

### 4.2 Database Schema Extensions

```sql
-- Online-specific tables for Suqya storefront

-- Customer addresses for shipping
CREATE TABLE customer_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  customer_id UUID REFERENCES customers(id),
  label TEXT DEFAULT 'home', -- home, work, other
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  wilaya TEXT NOT NULL,
  commune TEXT NOT NULL,
  postal_code TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Online orders with shipping info
CREATE TABLE online_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  order_id UUID REFERENCES orders(id), -- Links to main orders table
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address_id UUID REFERENCES customer_addresses(id),
  shipping_method TEXT NOT NULL, -- yalidine, ems, pickup
  shipping_cost INTEGER DEFAULT 0,
  tracking_number TEXT,
  shipping_status TEXT DEFAULT 'pending', -- pending, shipped, in_transit, delivered
  payment_method TEXT NOT NULL, -- cod, cib, edahabia, transfer
  payment_status TEXT DEFAULT 'pending', -- pending, paid, failed, refunded
  notes TEXT,
  gift_message TEXT,
  is_gift BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Product reviews
CREATE TABLE product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  product_id UUID REFERENCES products(id),
  customer_id UUID REFERENCES customers(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Wishlist
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  customer_id UUID REFERENCES customers(id),
  product_id UUID REFERENCES products(id),
  variant_id UUID REFERENCES variants(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(customer_id, product_id, variant_id)
);

-- Newsletter subscribers
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  email TEXT NOT NULL,
  language TEXT DEFAULT 'fr',
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ,
  UNIQUE(tenant_id, email)
);
```

### 4.3 API Routes Structure

```
/api/
├── products/
│   ├── GET    /                     # List products (with filters)
│   ├── GET    /[slug]               # Get product by slug
│   └── GET    /[slug]/reviews       # Get product reviews
├── categories/
│   └── GET    /                     # List categories
├── cart/
│   ├── GET    /                     # Get cart (session-based)
│   ├── POST   /items                # Add item to cart
│   ├── PATCH  /items/[id]           # Update quantity
│   └── DELETE /items/[id]           # Remove item
├── checkout/
│   ├── POST   /validate             # Validate cart & stock
│   ├── POST   /shipping             # Calculate shipping
│   └── POST   /create-order         # Create order
├── orders/
│   ├── GET    /                     # List user orders
│   ├── GET    /[id]                 # Get order details
│   └── GET    /[id]/track           # Get tracking info
├── auth/
│   ├── POST   /magic-link           # Send magic link
│   ├── POST   /verify               # Verify OTP
│   └── GET    /me                   # Get current user
├── customer/
│   ├── GET    /addresses            # List addresses
│   ├── POST   /addresses            # Add address
│   ├── PUT    /addresses/[id]       # Update address
│   └── DELETE /addresses/[id]       # Delete address
├── reviews/
│   └── POST   /                     # Submit review
├── newsletter/
│   └── POST   /subscribe            # Subscribe to newsletter
└── webhooks/
    ├── POST   /yalidine             # Shipping updates
    └── POST   /satim                # Payment confirmations
```

---

## Part 5: Internationalization (i18n)

### 5.1 Language Configuration

```typescript
// lib/i18n/config.ts
export const locales = ['fr', 'en', 'ar'] as const;
export const defaultLocale = 'fr';

export const localeConfig = {
  fr: {
    name: 'Français',
    dir: 'ltr',
    currency: 'DZD',
    currencySymbol: 'DA',
    dateFormat: 'dd/MM/yyyy',
  },
  en: {
    name: 'English',
    dir: 'ltr',
    currency: 'DZD',
    currencySymbol: 'DZD',
    dateFormat: 'MM/dd/yyyy',
  },
  ar: {
    name: 'العربية',
    dir: 'rtl',
    currency: 'DZD',
    currencySymbol: 'د.ج',
    dateFormat: 'yyyy/MM/dd',
  },
};
```

### 5.2 Translation Keys (Sample)

```json
// messages/fr.json
{
  "common": {
    "home": "Accueil",
    "shop": "Boutique",
    "cart": "Panier",
    "account": "Mon compte",
    "search": "Rechercher",
    "add_to_cart": "Ajouter au panier",
    "buy_now": "Acheter maintenant",
    "continue_shopping": "Continuer mes achats",
    "checkout": "Passer la commande"
  },
  "product": {
    "price": "Prix",
    "size": "Taille",
    "quantity": "Quantité",
    "in_stock": "En stock",
    "out_of_stock": "Rupture de stock",
    "low_stock": "Plus que {count} en stock",
    "reviews": "{count} avis",
    "description": "Description",
    "benefits": "Bienfaits",
    "origin": "Origine",
    "similar_products": "Produits similaires"
  },
  "checkout": {
    "your_cart": "Votre panier",
    "subtotal": "Sous-total",
    "shipping": "Livraison",
    "total": "Total",
    "payment_method": "Mode de paiement",
    "cod": "Paiement à la livraison",
    "card": "Carte bancaire (CIB/Edahabia)",
    "place_order": "Confirmer la commande"
  },
  "shipping": {
    "address": "Adresse de livraison",
    "wilaya": "Wilaya",
    "commune": "Commune",
    "yalidine": "Yalidine Express (3-5 jours)",
    "pickup": "Retrait en point relais"
  }
}
```

```json
// messages/ar.json
{
  "common": {
    "home": "الرئيسية",
    "shop": "المتجر",
    "cart": "السلة",
    "account": "حسابي",
    "search": "بحث",
    "add_to_cart": "أضف إلى السلة",
    "buy_now": "اشتري الآن",
    "continue_shopping": "متابعة التسوق",
    "checkout": "إتمام الطلب"
  },
  "product": {
    "price": "السعر",
    "size": "الحجم",
    "quantity": "الكمية",
    "in_stock": "متوفر",
    "out_of_stock": "غير متوفر",
    "low_stock": "باقي {count} فقط",
    "reviews": "{count} تقييم",
    "description": "الوصف",
    "benefits": "الفوائد",
    "origin": "المصدر",
    "similar_products": "منتجات مشابهة"
  },
  "checkout": {
    "your_cart": "سلة التسوق",
    "subtotal": "المجموع الفرعي",
    "shipping": "التوصيل",
    "total": "الإجمالي",
    "payment_method": "طريقة الدفع",
    "cod": "الدفع عند الاستلام",
    "card": "بطاقة بنكية (CIB/ذهبية)",
    "place_order": "تأكيد الطلب"
  },
  "shipping": {
    "address": "عنوان التوصيل",
    "wilaya": "الولاية",
    "commune": "البلدية",
    "yalidine": "يالدين إكسبرس (3-5 أيام)",
    "pickup": "استلام من نقطة التوزيع"
  }
}
```

---

## Part 6: Feature Specifications

### 6.1 Core Features (MVP - P0)

#### F-001: Product Catalog
```yaml
ID: F-001
Name: Product Catalog
Priority: P0
Description: Browse and filter honey products

User Stories:
  - As a customer, I want to browse products by category
  - As a customer, I want to filter by price range
  - As a customer, I want to see product ratings

Acceptance Criteria:
  - [ ] Category navigation (4 main categories)
  - [ ] Grid/List view toggle
  - [ ] Price filter (slider)
  - [ ] Sort by: price, popularity, newest
  - [ ] Infinite scroll pagination
  - [ ] Product cards with image, name, price, rating
  - [ ] Quick add to cart from catalog

API Endpoints:
  - GET /api/products?category=&min_price=&max_price=&sort=

Performance:
  - LCP < 2.5s
  - Products load in < 500ms
```

#### F-002: Product Detail Page
```yaml
ID: F-002
Name: Product Detail Page
Priority: P0
Description: Complete product information and purchase

User Stories:
  - As a customer, I want to see detailed product info
  - As a customer, I want to select size variants
  - As a customer, I want to read reviews

Acceptance Criteria:
  - [ ] Image gallery (swipeable on mobile)
  - [ ] Size selector (250g/500g/1kg)
  - [ ] Quantity selector
  - [ ] Add to cart with variant
  - [ ] Product description (FR + AR)
  - [ ] Benefits list
  - [ ] Origin & traceability info
  - [ ] Customer reviews with ratings
  - [ ] Related products carousel

SEO:
  - Dynamic meta tags
  - JSON-LD structured data (Product schema)
  - Open Graph for social sharing
```

#### F-003: Shopping Cart
```yaml
ID: F-003
Name: Shopping Cart
Priority: P0
Description: Manage cart items before checkout

User Stories:
  - As a customer, I want to view my cart
  - As a customer, I want to update quantities
  - As a customer, I want to see real-time totals

Acceptance Criteria:
  - [ ] Cart drawer (slide from right)
  - [ ] Cart page (full view)
  - [ ] Update quantity (+/- buttons)
  - [ ] Remove item (with undo)
  - [ ] Real-time price calculation
  - [ ] Stock validation
  - [ ] Empty cart state
  - [ ] Persist cart (localStorage + server sync)
  - [ ] Cart badge in header

State Management:
  - Zustand store for cart
  - Sync with server for logged-in users
```

#### F-004: Checkout Flow
```yaml
ID: F-004
Name: Checkout Flow
Priority: P0
Description: Complete order with shipping and payment

User Stories:
  - As a customer, I want to enter shipping address
  - As a customer, I want to choose delivery method
  - As a customer, I want to pay COD or card

Acceptance Criteria:
  - [ ] Step 1: Contact info (email, phone)
  - [ ] Step 2: Shipping address (wilaya/commune)
  - [ ] Step 3: Delivery method selection
  - [ ] Step 4: Payment method selection
  - [ ] Order summary sidebar
  - [ ] Stock re-validation before submit
  - [ ] Order confirmation page
  - [ ] Email confirmation
  - [ ] SMS notification (optional)

Payment Methods:
  - Cash on Delivery (COD) - Default
  - CIB/Edahabia (Satim gateway)
  - Bank transfer (manual)

Shipping Integration:
  - Yalidine API for rates & tracking
  - 58 wilayas supported
```

#### F-005: User Authentication
```yaml
ID: F-005
Name: User Authentication
Priority: P0
Description: Secure customer accounts

User Stories:
  - As a customer, I want to create an account
  - As a customer, I want to login via OTP/magic link
  - As a customer, I want to view order history

Acceptance Criteria:
  - [ ] Magic link login (email)
  - [ ] Phone OTP login (SMS)
  - [ ] Guest checkout option
  - [ ] Account dashboard
  - [ ] Order history
  - [ ] Saved addresses
  - [ ] Profile settings
  - [ ] Logout

Security:
  - Supabase Auth
  - JWT tokens (httpOnly cookies)
  - CSRF protection
```

### 6.2 Enhanced Features (P1)

#### F-006: Search
```yaml
ID: F-006
Priority: P1
Features:
  - Full-text search
  - Search suggestions (autocomplete)
  - Recent searches
  - Search results page with filters
```

#### F-007: Wishlist
```yaml
ID: F-007
Priority: P1
Features:
  - Save products to wishlist
  - Wishlist page
  - Add to cart from wishlist
  - Share wishlist
```

#### F-008: Customer Reviews
```yaml
ID: F-008
Priority: P1
Features:
  - Submit review (verified purchases only)
  - Star rating + comment
  - Photo uploads
  - Review moderation (admin)
  - Review notifications
```

#### F-009: Order Tracking
```yaml
ID: F-009
Priority: P1
Features:
  - Track order status
  - Shipping updates (Yalidine webhook)
  - SMS notifications
  - Delivery confirmation
```

### 6.3 Growth Features (P2)

| ID | Feature | Description |
|----|---------|-------------|
| F-010 | Loyalty Points | Earn points on purchases, redeem for discounts |
| F-011 | Subscriptions | Recurring honey deliveries (monthly box) |
| F-012 | Gift Cards | Digital gift cards with custom messages |
| F-013 | Blog/Content | Honey guides, recipes, health tips |
| F-014 | WhatsApp Integration | Order via WhatsApp chatbot |
| F-015 | Mobile App | React Native PWA wrapper |

---

## Part 7: Performance & SEO Requirements

### 7.1 Core Web Vitals Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Hero image load |
| **FID** (First Input Delay) | < 100ms | Button interaction |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Image placeholders |
| **TTFB** (Time to First Byte) | < 200ms | Edge caching |
| **FCP** (First Contentful Paint) | < 1.5s | Above-fold render |

### 7.2 Performance Optimization

```yaml
Images:
  - Next.js Image component (automatic optimization)
  - WebP format with AVIF fallback
  - Blur placeholder (LQIP)
  - Lazy loading below fold
  - Responsive srcset

Caching:
  - Static pages: ISR (revalidate: 3600)
  - Product pages: ISR (revalidate: 60)
  - API responses: stale-while-revalidate
  - Edge caching via Vercel

Code Splitting:
  - Route-based splitting (automatic)
  - Dynamic imports for modals
  - Lazy load below-fold components

Fonts:
  - next/font for Inter & Playfair
  - font-display: swap
  - Subset for Arabic (Noto Kufi)
```

### 7.3 SEO Strategy

```yaml
Technical SEO:
  - Semantic HTML5
  - XML sitemap (auto-generated)
  - robots.txt
  - Canonical URLs
  - Hreflang for multilingual
  - Mobile-friendly (responsive)

On-Page SEO:
  - Dynamic meta titles: "{Product} - Suqya Miel Bio"
  - Meta descriptions: 150-160 chars
  - H1-H6 hierarchy
  - Alt text for images
  - Internal linking

Structured Data:
  - Organization schema
  - Product schema (with reviews, price, availability)
  - BreadcrumbList
  - FAQPage
  - LocalBusiness

Social:
  - Open Graph tags
  - Twitter Card tags
  - WhatsApp preview optimization
```

---

## Part 8: Analytics & Success Metrics

### 8.1 Key Performance Indicators (KPIs)

| KPI | Target (Month 1) | Target (Month 6) |
|-----|------------------|------------------|
| **Monthly Visitors** | 5,000 | 50,000 |
| **Conversion Rate** | 1.5% | 3% |
| **Average Order Value** | 5,000 DA | 7,000 DA |
| **Cart Abandonment** | < 75% | < 60% |
| **Return Customer Rate** | 15% | 30% |
| **Mobile Traffic** | 85% | 80% |
| **Page Load Time** | < 3s | < 2s |

### 8.2 Analytics Implementation

```yaml
Plausible Analytics:
  - Page views
  - Unique visitors
  - Bounce rate
  - Session duration
  - Top pages
  - Traffic sources
  - Device breakdown
  - Country/region

Custom Events:
  - product_view
  - add_to_cart
  - begin_checkout
  - purchase
  - search
  - filter_apply
  - review_submit
  - newsletter_signup

E-commerce Tracking:
  - Revenue
  - Transactions
  - Products sold
  - Category performance
  - Conversion funnel
```

---

## Part 9: Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
```
[ ] Project setup (Next.js 15, TypeScript, Tailwind)
[ ] Design system implementation (colors, typography, components)
[ ] i18n setup (FR/EN/AR with RTL)
[ ] Supabase connection & schema extensions
[ ] Basic layout (header, footer, navigation)
[ ] Product listing page (static data)
[ ] Product detail page (static data)
```

### Phase 2: Core E-commerce (Week 3-4)
```
[ ] Cart functionality (Zustand)
[ ] Checkout flow (3-step)
[ ] Guest checkout
[ ] Order creation API
[ ] Email confirmations (Resend)
[ ] Basic admin order view
```

### Phase 3: Payments & Shipping (Week 5-6)
```
[ ] COD payment flow
[ ] Satim integration (CIB/Edahabia)
[ ] Yalidine shipping integration
[ ] Shipping rate calculator
[ ] Order tracking page
[ ] SMS notifications (Twilio)
```

### Phase 4: User Experience (Week 7-8)
```
[ ] User authentication (Supabase Auth)
[ ] Account dashboard
[ ] Order history
[ ] Saved addresses
[ ] Search functionality
[ ] Wishlist
[ ] Product reviews
```

### Phase 5: Polish & Launch (Week 9-10)
```
[ ] Performance optimization
[ ] SEO implementation
[ ] Analytics setup
[ ] Security audit
[ ] Mobile testing (real devices)
[ ] Load testing
[ ] Soft launch (beta)
[ ] Public launch
```

---

## Part 10: Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Payment gateway issues | Medium | High | Fallback to COD only |
| Shipping API downtime | Low | High | Manual order processing |
| Stock sync delays | Medium | Medium | Real-time Supabase subscriptions |
| High cart abandonment | High | Medium | Exit intent popup, SMS reminders |
| Mobile performance | Medium | High | Aggressive optimization, PWA |
| Arabic RTL bugs | Medium | Medium | Thorough RTL testing |
| SEO indexing delays | Low | Low | Submit sitemap, build backlinks |

---

## Appendix A: Wireframe Assets

```
/design/
├── wireframes/
│   ├── mobile/
│   │   ├── home.fig
│   │   ├── catalog.fig
│   │   ├── product-detail.fig
│   │   ├── cart.fig
│   │   ├── checkout.fig
│   │   └── account.fig
│   └── desktop/
│       └── [same files]
├── components/
│   ├── product-card.fig
│   ├── size-selector.fig
│   ├── cart-drawer.fig
│   └── checkout-steps.fig
└── brand/
    ├── logo.svg
    ├── colors.json
    └── typography.json
```

---

## Appendix B: API Response Examples

### Product Response
```json
{
  "id": "d1000000-0000-0000-0000-000000000001",
  "slug": "miel-jujubier-sidr",
  "name": {
    "fr": "Miel de Jujubier (Sidr)",
    "en": "Jujube Honey (Sidr)",
    "ar": "عسل السدر"
  },
  "short_description": {
    "fr": "Miel pur de jujubier des montagnes algériennes",
    "en": "Pure jujube honey from Algerian mountains",
    "ar": "عسل سدر نقي من جبال الجزائر"
  },
  "price": 4500,
  "currency": "DZD",
  "images": [
    "https://cdn.suqya.dz/products/jujubier-1.webp",
    "https://cdn.suqya.dz/products/jujubier-2.webp"
  ],
  "category": {
    "id": "c1000000-0000-0000-0000-000000000001",
    "slug": "miels-purs",
    "name": { "fr": "Miels Purs", "en": "Pure Honeys", "ar": "عسل صافي" }
  },
  "variants": [
    { "id": "...", "name": "250g", "price": 2500, "sku": "SUQ-JUJ-250", "stock": 50 },
    { "id": "...", "name": "500g", "price": 4500, "sku": "SUQ-JUJ-500", "stock": 35 },
    { "id": "...", "name": "1kg", "price": 8500, "sku": "SUQ-JUJ-1KG", "stock": 20 }
  ],
  "rating": { "average": 4.9, "count": 127 },
  "badges": ["bio", "kabylie"],
  "is_available": true
}
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-09 | Product Team | Initial PRD |

---

**Next Steps:**
1. Design review with stakeholders
2. Technical architecture approval
3. Sprint planning for Phase 1
4. Begin development

---

*"سُقيا - نغذي صحتك بهدايا الطبيعة"*  
*"Suqya - Nourishing your health with nature's gifts"*
