# UI/UX Changelog

## Changes Applied

### 1. Placeholder Links → App Store
**Files:** Hero.tsx, Pricing.tsx, CTA.tsx
**What:** All `href="#"` and `href="#pricing"` on download/CTA buttons changed to `https://apps.apple.com/app/blip`
**Why:** Dead links undermine trust. Every visible button must go somewhere real.

### 2. Section Divider Spacing Eliminated
**Files:** Features.tsx, HowItWorks.tsx, Security.tsx, Pricing.tsx, CTA.tsx
**What:** `section-divider mb-16 md:mb-24` → `section-divider mb-0`
**Why:** Section padding (py-16 md:py-24) already provides spacing. Divider margins doubled the gap to 192px on desktop.

### 3. Heading Block Spacing Unified
**Files:** Features.tsx, HowItWorks.tsx, Pricing.tsx
**What:** Heading container `mb-16 md:mb-24` → `mb-14 md:mb-20`. H2-to-subtitle `mb-8 md:mb-12` → `mb-6 md:mb-8`.
**Why:** Inconsistent margins across sections created uneven rhythm.

### 4. Footer Logo Proper Sizing
**File:** Footer.tsx
**What:** Removed `h-[18px] md:h-[20px] scale-[2.5] origin-left`, replaced with `h-12 md:h-14 w-auto`. Added `mb-6` spacing. Updated width/height props to 200/80.
**Why:** CSS scale creates invisible overflow, unpredictable hit areas, and layout instability.

### 5. MeshBackground GPU Hint
**File:** MeshBackground.tsx
**What:** Added `will-change-transform` class to container div.
**Why:** Promotes Three.js canvas to GPU-composited layer for smoother rendering.

### 6. Theme-Correct Back Links
**Files:** tech/page.tsx, privacy/page.tsx, terms/page.tsx, acceptable-use/page.tsx
**What:** `hover:text-white` → `hover:text-[var(--foreground)]`
**Why:** Hardcoded white doesn't work on light theme.

### 7. Button Padding Standardized
**Files:** Hero.tsx, Pricing.tsx, CTA.tsx, Nav.tsx
**What:** All primary accent buttons → `px-8 py-3 md:px-10 md:py-3.5`. Nav stays at `px-5 py-2`.
**Why:** Buttons ranged from py-2.5 to py-4 — inconsistent sizing breaks visual hierarchy.

### 8. Transition Durations Unified
**Files:** All components
**What:** All `duration-300` → `duration-200`. All `transition-colors` → `transition-all duration-200`.
**Why:** Mixed durations (200/300/unspecified) create inconsistent interaction feel.

### 9. Global Focus States
**File:** globals.css
**What:** Added `a:focus-visible, button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }`
**Why:** No focus indication existed for keyboard navigation — accessibility requirement.

### 10. Page Titles
**Files:** tech/page.tsx, privacy/page.tsx, terms/page.tsx, acceptable-use/page.tsx
**What:** Added `useEffect(() => { document.title = "..." }, [])` to each page.
**Why:** All subpages showed the root title instead of their own.

### 11. Nav Link Animation
**File:** Nav.tsx
**What:** Underline animation `after:duration-300` → `after:duration-200`.
**Why:** Match global transition standard.

## Intentionally Deferred
- App Store URL is placeholder (app not published)
- Stripe payment integration for pricing tiers
- App screenshots/video in hero
- Legal content review by counsel
- SEO meta images (og:image)
