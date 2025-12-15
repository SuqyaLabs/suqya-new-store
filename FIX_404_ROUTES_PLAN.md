# Fix Plan: 404 Routes in Production

## Issue Summary
Footer links return 404 errors when accessed with locale prefix (e.g., `/ar/livraison`).  
The `Link` component from `@/i18n/routing` correctly prefixes routes with locale, but the corresponding pages don't exist under `app/[locale]/`.

---

## Affected Routes (10 total)

### Category Pages (3)
| Route | Status |
|-------|--------|
| `/ar/boutique/miels-purs` | ❌ Missing |
| `/ar/boutique/miels-infuses` | ❌ Missing |
| `/ar/boutique/produits-ruche` | ❌ Missing |

### Legal Pages (4)
| Route | Status |
|-------|--------|
| `/ar/livraison` | ❌ Missing |
| `/ar/cgv` | ❌ Missing |
| `/ar/retours` | ❌ Missing |
| `/ar/confidentialite` | ❌ Missing |

### Info Pages (3)
| Route | Status |
|-------|--------|
| `/ar/notre-histoire` | ❌ Missing (exists at `/app/notre-histoire/` - wrong location) |
| `/ar/faq` | ❌ Missing |
| `/ar/contact` | ❌ Missing |

---

## Implementation Steps

### Step 1: Category Dynamic Route (High Priority)
- [ ] Create `app/[locale]/boutique/[category]/page.tsx`
- [ ] Implement dynamic category filtering
- [ ] Add `generateStaticParams()` for SSG

### Step 2: Move Existing Pages (High Priority)
- [ ] Move `app/notre-histoire/` → `app/[locale]/notre-histoire/`
- [ ] Update imports to use `useTranslations`

### Step 3: Create Info Pages (High Priority)
- [ ] Create `app/[locale]/contact/page.tsx`
- [ ] Create `app/[locale]/faq/page.tsx`

### Step 4: Create Legal Pages (Medium Priority)
- [ ] Create `app/[locale]/livraison/page.tsx`
- [ ] Create `app/[locale]/retours/page.tsx`
- [ ] Create `app/[locale]/cgv/page.tsx`
- [ ] Create `app/[locale]/confidentialite/page.tsx`

### Step 5: Add Translations (Required)
- [ ] Update `messages/fr.json` with page content
- [ ] Update `messages/ar.json` with page content
- [ ] Update `messages/en.json` with page content

### Step 6: Cleanup (Low Priority)
- [ ] Remove old non-localized routes (`app/notre-histoire/`, etc.)
- [ ] Verify all footer links work in all 3 languages

---

## File Structure After Fix

```
app/[locale]/
├── boutique/
│   ├── [category]/
│   │   └── page.tsx        ← NEW (dynamic category)
│   ├── produit/
│   │   └── [slug]/
│   ├── loading.tsx
│   └── page.tsx
├── notre-histoire/
│   └── page.tsx            ← MOVED
├── contact/
│   └── page.tsx            ← NEW
├── faq/
│   └── page.tsx            ← NEW
├── livraison/
│   └── page.tsx            ← NEW
├── retours/
│   └── page.tsx            ← NEW
├── cgv/
│   └── page.tsx            ← NEW
├── confidentialite/
│   └── page.tsx            ← NEW
├── layout.tsx
├── not-found.tsx
└── page.tsx
```

---

## Translation Keys to Add

```json
{
  "pages": {
    "contact": { "title": "...", "description": "..." },
    "faq": { "title": "...", "questions": [...] },
    "shipping": { "title": "...", "content": "..." },
    "returns": { "title": "...", "content": "..." },
    "terms": { "title": "...", "content": "..." },
    "privacy": { "title": "...", "content": "..." },
    "about": { "title": "...", "content": "..." }
  }
}
```

---

## Estimated Effort
- **Pages to create:** 8
- **Pages to move:** 1
- **Translation files to update:** 3
- **Time estimate:** 2-3 hours

---

## Testing Checklist
- [ ] Test all routes in French (`/fr/...`)
- [ ] Test all routes in Arabic (`/ar/...`) - verify RTL
- [ ] Test all routes in English (`/en/...`)
- [ ] Verify footer links work on all pages
- [ ] Check mobile responsiveness
- [ ] Verify SEO metadata for each page
