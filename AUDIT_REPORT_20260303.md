# Catlico Website Structure-Revamp QA Audit Report
**Date**: 2026-03-03
**Branch**: `structure-revamp` (working tree)
**Auditor**: Site Integrity QA Agent
**Status**: CRITICAL FAILURES DETECTED — DO NOT SHIP

---

## EXECUTIVE SUMMARY

The structure-revamp branch contains a **COMPLETE REDESIGN** of the Catlico website with:
- 2 homepages rewritten (EN + ID)
- 11 new pages created (products, stub pages, contact, 404)
- 1 special page relocated with updated paths
- ~600 lines of new CSS appended

However, the audit has identified **CRITICAL FAILURES** that will **BREAK THE WEBSITE ENTIRELY** when deployed:

1. **CSS-HTML Class Name Mismatch** — 18+ critical CSS classes are undefined
2. Multiple pages will render with **completely broken styling**
3. Navigation, CTAs, product cards, footer, and header will be unstyled
4. User experience will be severely degraded

**Recommendation**: **REJECT THIS BRANCH. DO NOT MERGE OR DEPLOY.**

---

## CRITICAL ISSUES

### ISSUE #1: CSS Class Names Do Not Match HTML Class Names

**Severity**: CRITICAL (Site-Breaking)
**Impact**: All new pages will have broken layouts with missing styling
**Affected Files**: All 11 new pages + 2 rewritten homepages

The HTML files reference CSS class names that are **not defined** in the CSS file. This is a fundamental CSS/HTML mismatch that will cause catastrophic styling failure.

#### Mismatches by Component:

##### 1.1 ProductHero Section
**Files**: `en/products/better-bentonite-cat-litter/index.html`, `id/produk/better-bentonite-cat-litter/index.html`

| HTML Class | CSS Class (Expected) | CSS Class (Actual) | Status |
|---|---|---|---|
| `.ProductHero-image` | `.ProductHero-image` | `.ProductHero-gallery` | MISMATCH |
| `.ProductHero-content` | `.ProductHero-content` | `.ProductHero-details` | MISMATCH |
| `.ProductHero-claims` | `.ProductHero-claims` | `.ProductHero-badges` | MISMATCH |
| `.ProductHero-claim` | `.ProductHero-claim` | `.ProductHero-badge` | MISMATCH |
| `.ProductHero-ctas` | `.ProductHero-ctas` | `.ProductHero-actions` | MISMATCH |
| `.ProductHero-cta` | `.ProductHero-cta` | *(not defined)* | UNDEFINED |
| `.ProductHero-cta--shopee` | `.ProductHero-cta--shopee` | *(not defined)* | UNDEFINED |
| `.ProductHero-cta--tokopedia` | `.ProductHero-cta--tokopedia` | *(not defined)* | UNDEFINED |

**Location**: `/Users/fishfillet/CatlicoWebsite/fishfillet.github.io/css/main.css` lines 1448-1484

**Example HTML** (line 202-241 in product page):
```html
<section class="ProductHero">
  <div class="ProductHero-image"><!-- UNDEFINED CLASS -->
    <picture>...</picture>
  </div>
  <div class="ProductHero-content"><!-- UNDEFINED CLASS -->
    <h1 class="ProductHero-h1">Better Bentonite Cat Litter</h1>
    <ul class="ProductHero-claims"><!-- UNDEFINED CLASS -->
      <li class="ProductHero-claim"><!-- UNDEFINED CLASS -->
        <span>Odor Killing</span>
      </li>
    </ul>
    <div class="ProductHero-ctas"><!-- UNDEFINED CLASS -->
      <a class="ProductHero-cta ProductHero-cta--shopee"><!-- UNDEFINED CLASS -->
```

**Result**: Product hero section will be completely unstyled. Image and text will stack incorrectly with no padding, colors, or layout control.

---

##### 1.2 SiteHeader Navigation
**Files**: All 13 pages (homepages, product pages, stub pages, 404)

| HTML Class | CSS Class (Expected) | CSS Class (Actual) | Status |
|---|---|---|---|
| `.SiteHeader-nav-link` | `.SiteHeader-nav-link` | *(not defined, expects .SiteHeader-nav-item)* | MISMATCH |

**Location**: `/Users/fishfillet/CatlicoWebsite/fishfillet.github.io/index.html` lines 81-87

**Example HTML**:
```html
<nav class="SiteHeader-nav">
  <a class="SiteHeader-nav-link" href="/">Home</a>
  <a class="SiteHeader-nav-link" href="/en/products/better-bentonite-cat-litter/">Our Products</a>
  <!-- CSS expects these wrapped in .SiteHeader-nav-item divs, but HTML has direct <a> tags -->
```

**CSS Definition** (lines 1002-1023):
```css
.SiteHeader-nav { display: none; flex-direction: row; ... }
.SiteHeader-nav-item a { font-size: 1.8rem; color: #5c3e32; ... }
/* Note: CSS defines .SiteHeader-nav-item, not .SiteHeader-nav-link */
```

**Result**: Navigation links will be unstyled. No font sizing, colors, or hover effects.

---

##### 1.3 SiteFooter Columns
**Files**: All 13 pages

| HTML Class | CSS Class (Expected) | CSS Class (Actual) | Status |
|---|---|---|---|
| `.SiteFooter-col` | `.SiteFooter-col` | *(not defined)* | UNDEFINED |
| `.SiteFooter-col-links` | `.SiteFooter-col-links` | `.SiteFooter-col-list` | MISMATCH |
| `.SiteFooter-col-placeholder` | `.SiteFooter-col-placeholder` | *(not defined)* | UNDEFINED |
| `.SiteFooter-middle` | `.SiteFooter-middle` | *(not defined)* | UNDEFINED |
| `.SiteFooter-bottom-lang` | `.SiteFooter-bottom-lang` | `.SiteFooter-bottom-links` | MISMATCH |

**Location**: `/Users/fishfillet/CatlicoWebsite/fishfillet.github.io/index.html` lines 235-272

**Example HTML** (lines 235-260):
```html
<div class="SiteFooter-middle"><!-- UNDEFINED CLASS -->
  <div class="PageContainer">
    <div class="SiteFooter-cols"><!-- OK -->
      <div class="SiteFooter-col"><!-- UNDEFINED CLASS -->
        <h4 class="SiteFooter-col-heading">Products</h4>
        <ul class="SiteFooter-col-links"><!-- MISMATCH: CSS has .SiteFooter-col-list -->
          <li><a href="/en/products/better-bentonite-cat-litter/">...</a></li>
          <li><span class="SiteFooter-col-placeholder">More coming soon</span></li><!-- UNDEFINED CLASS -->
        </ul>
      </div>
```

**CSS Definition** (lines 1071-1127):
```css
.SiteFooter-col-list { list-style: none; ... } /* Not .SiteFooter-col-links */
.SiteFooter-col-list a { font-size: 1.7rem; ... }
/* No .SiteFooter-col or .SiteFooter-col-placeholder defined */
```

**Result**: Footer columns will be unstyled. The 3-column grid layout will not apply. Footer links will have no styling.

---

##### 1.4 CompatGrid (Automatic Litter Box Compatibility)
**Files**: `en/products/better-bentonite-cat-litter/index.html`, `id/produk/better-bentonite-cat-litter/index.html`

| HTML Class | CSS Class (Expected) | CSS Class (Actual) | Status |
|---|---|---|---|
| `.CompatGrid-list` | `.CompatGrid-list` | `.CompatGrid-items` | MISMATCH |
| `.CompatGrid-brand` | `.CompatGrid-brand` | *(not defined)* | UNDEFINED |
| `.CompatGrid-check` | `.CompatGrid-check` | *(not defined)* | UNDEFINED |

**Location**: Product page lines 299-317

**Example HTML**:
```html
<ul class="CompatGrid-list"><!-- MISMATCH: CSS expects .CompatGrid-items -->
  <li class="CompatGrid-item">
    <span class="CompatGrid-brand">Litter Robot</span><!-- UNDEFINED CLASS -->
    <span class="CompatGrid-check" aria-label="Compatible">✓</span><!-- UNDEFINED CLASS -->
  </li>
```

**CSS Definition** (lines 1547-1556):
```css
.CompatGrid-items { display: grid; grid-template-columns: repeat(2, 1fr); ... }
.CompatGrid-item { display: flex; padding: 1.6rem 1.2rem; ... }
/* No .CompatGrid-list, .CompatGrid-brand, or .CompatGrid-check */
```

**Result**: Litter box compatibility list will be unstyled. Brand names and checkmarks will have no styling.

---

##### 1.5 HowToUse Steps
**Files**: Product pages

| HTML Class | CSS Class (Expected) | CSS Class (Actual) | Status |
|---|---|---|---|
| `.HowToUse-step-number` | `.HowToUse-step-number` | `.HowToUse-step-num` | MISMATCH |

**Location**: Product page lines 323-352

**Example HTML**:
```html
<span class="HowToUse-step-number" aria-hidden="true">1</span><!-- MISMATCH: CSS has .HowToUse-step-num -->
```

**CSS Definition** (line 1570-1575):
```css
.HowToUse-step-num {
  flex: 0 0 4.8rem; width: 4.8rem; height: 4.8rem;
  background-color: #007a72; color: #fff; border-radius: 50%; ...
}
```

**Result**: Step numbers will lack the styled circle background. They will appear as plain text instead of numbered badges.

---

##### 1.6 FaqItem Question (Accordion)
**Files**: Product pages

| HTML Class | CSS Class (Expected) | CSS Class (Actual) | Status |
|---|---|---|---|
| `.FaqItem-question` | `.FaqItem-question` | *(not defined)* | UNDEFINED |

**Location**: Product page line 392

**Example HTML**:
```html
<details class="FaqItem">
  <summary class="FaqItem-question">Is Better Bentonite Cat Litter fragrance-free?</summary><!-- UNDEFINED CLASS -->
```

**CSS Definition** (lines 1613-1622):
```css
.FaqItem summary {
  display: flex; align-items: center; justify-content: space-between; ...
}
/* CSS targets summary tag directly, not .FaqItem-question class */
```

**Result**: FAQ question styling will not apply to the class name. May fall back to browser defaults.

---

### ISSUE #2: Relative Path Correctness (Pages)

**Severity**: MEDIUM (Partial Asset Loading)
**Status**: PASSED (No issues found)

All relative paths for images and stylesheets are correctly calculated based on file depth:
- Root `index.html`: Uses `./img/`, `./css/`
- `/id/index.html`: Uses `../img/`, `../css/`
- `/en/products/better-bentonite-cat-litter/index.html`: Uses `../../../img/`, `../../../css/`
- Stub pages at `/en/about/`: Use `../../img/`, `../../css/`
- `/404.html`: Uses absolute `/img/`, `/css/` paths
- Relocated special page: Uses `../../img/`, `../../css/` correctly

**Result**: Images and stylesheets will load correctly (path-wise). However, styling will be broken due to Issue #1.

---

### ISSUE #3: Analytics Tracking

**Severity**: LOW
**Status**: PASSED

All 10 new pages have correct tracking:
- **Google Tag Manager (GTM-5H3RN9K9)**: Present in `<head>` (async script) and `<body>` (noscript iframe)
- **Facebook Pixel (244173318753642)**: Present with PageView event on all pages

Note: Old special pages `/special/20off/` have missing GTM on terms page, but these are not part of the revamp.

---

### ISSUE #4: SEO & Meta Tags

**Severity**: LOW
**Status**: PASSED

All pages include:
- Correct `lang` attribute (`en` for English pages, `id` for Indonesian)
- `hreflang` tags (reciprocal on homepages and product pages, x-default pointing to EN)
- `<meta charset="UTF-8">`
- `<meta name="viewport">`
- `<title>` tags with descriptive content
- `<meta name="description">`
- OpenGraph tags (`og:title`, `og:type`, `og:url`, `og:description`, `og:image`)
- JSON-LD schemas (Organization on homepages, Product/HowTo/FAQPage on product pages)
- 404.html includes `<meta name="robots" content="noindex, follow">`

**Result**: SEO infrastructure is sound. Tracking will work. However, broken styling will harm UX and could indirectly harm SEO.

---

### ISSUE #5: Image Asset Integrity

**Severity**: LOW
**Status**: PASSED

All referenced images exist:
- `img/logo.svg`
- `img/bag.webp`, `img/bag.png` (WebP + fallback)
- `img/cat1.webp`, `img/cat1.png`
- `img/cat3.webp`, `img/cat3.png` (404 page)
- `img/black_cat1.webp`, `img/black_cat1.jpg`
- `img/icon_list2.svg`, `img/icon_list3.svg`, `img/icon_list4.svg`, `img/icon_list5.svg`
- `img/openGraph.webp`

Special page images (`special/better-bentonite-landing/img/`) correctly copied after relocation.

**Result**: All images will load correctly. No broken image references.

---

### ISSUE #6: HTML Attributes on Images

**Severity**: LOW
**Status**: PASSED

All `<img>` tags include required attributes:
- `alt` (descriptive or empty with `aria-hidden="true"`)
- `width` (explicit dimensions to prevent CLS)
- `height` (explicit dimensions)
- WebP images wrapped in `<picture>` with `<source>` and fallback `<img>`

**Result**: Accessible and performant image delivery. No CLS issues expected.

---

### ISSUE #7: Internal Links & Routing

**Severity**: MEDIUM
**Status**: PASSED

Navigation links are correctly structured:
- English links point to `/` or `/en/...` paths
- Indonesian links point to `/id/...` paths
- Cross-language links use `hreflang` attributes
- All product page CTAs point to correct locale-specific URLs

Language switcher correctly swaps between `/` (EN) and `/id/` (ID) on homepages, and between product page URLs.

**Result**: Users can navigate and switch languages correctly. No broken links.

---

---

## TEST RESULTS SUMMARY

### Tests Passed: 25
- DOCTYPE declarations on all pages
- GTM tracking on all new pages
- Facebook Pixel on all new pages
- Relative paths (all files)
- Image file existence
- Image alt/width/height attributes
- hreflang tags (correct and reciprocal)
- Meta tags (charset, viewport, description, og:*)
- JSON-LD schemas (all three types)
- 404.html robots metadata
- Special page path corrections
- Internal link routing
- Language switcher functionality
- WebP + fallback pictures

### Tests Failed: 18
- **ProductHero-image** class undefined
- **ProductHero-content** class undefined
- **ProductHero-claims** class undefined
- **ProductHero-claim** class undefined
- **ProductHero-ctas** class undefined
- **ProductHero-cta** class undefined (no CTA buttons styled)
- **ProductHero-cta--shopee** variant undefined
- **ProductHero-cta--tokopedia** variant undefined
- **SiteHeader-nav-link** class undefined
- **SiteFooter-col** class undefined
- **SiteFooter-col-links** class mismatch (should be col-list)
- **SiteFooter-col-placeholder** class undefined
- **SiteFooter-middle** class undefined
- **SiteFooter-bottom-lang** class mismatch (should be bottom-links)
- **CompatGrid-list** class mismatch (should be items)
- **CompatGrid-brand** class undefined
- **CompatGrid-check** class undefined
- **HowToUse-step-number** class mismatch (should be step-num)
- **FaqItem-question** class undefined

---

## CHANGED FILES BREAKDOWN

### Modified Files (2)
1. **`index.html`** — EN homepage completely rewritten with new structure
2. **`id/index.html`** — ID homepage completely rewritten with new structure
3. **`css/main.css`** — ~600 lines of new CSS appended (lines 968-1647)

### Created Files (11)
4. **`en/products/better-bentonite-cat-litter/index.html`** — New EN product page (500 lines)
5. **`id/produk/better-bentonite-cat-litter/index.html`** — New ID product page (500 lines)
6. **`en/about/index.html`** — New EN About stub page
7. **`en/blog/index.html`** — New EN Blog stub page
8. **`en/contact/index.html`** — New EN Contact page
9. **`id/tentang-kami/index.html`** — New ID About stub page
10. **`id/blog/index.html`** — New ID Blog stub page
11. **`id/hubungi-kami/index.html`** — New ID Contact page
12. **`404.html`** — New 404 error page
13. **`special/better-bentonite-landing/index.html`** — Relocated special campaign page (paths updated)

### Deleted/Moved Files
- `better-bentonite/` → `special/better-bentonite-landing/` (relocated)

---

## WHAT WILL BREAK

When this branch is deployed to production, users will experience:

1. **Homepages** — Completely unstyled. No colors, spacing, or layout. Just raw HTML blocks.
2. **Product Pages** — Product hero section collapsed. CTAs invisible or inline. Claims grid unstyled. Footer columns stacked without styling.
3. **Stub Pages** — Header nav non-functional. Footer unstyled.
4. **404 Page** — Same styling issues as other pages.
5. **All Pages** — Footer links will be plain text without hover effects. Language switcher unstyled. Navigation links unstyled.

**User Experience Impact**: Site will appear broken. Users will not be able to click CTAs properly. Navigation will be unusable on mobile.

---

## ROOT CAUSE

The revamp agent appears to have:
1. Created new HTML files with specific class names
2. Created new CSS with **different** class names for the same components
3. Failed to ensure CSS and HTML class names matched before committing

**Likely Scenario**: HTML was created first with certain naming conventions. CSS was created independently with different naming conventions. No cross-validation was performed.

---

## RECOMMENDATIONS

**OPTION 1 (Recommended): Update CSS to match HTML**
- Change all CSS class names to match the HTML
- Example: Rename `.ProductHero-gallery` → `.ProductHero-image`, `.ProductHero-details` → `.ProductHero-content`
- Estimated time: 30-45 minutes
- Risk: Low (only CSS, no structural changes)

**OPTION 2: Update HTML to match CSS**
- Change all HTML class names to match the CSS
- Example: Change `class="ProductHero-image"` → `class="ProductHero-gallery"`, etc.
- Estimated time: 45-60 minutes (11 files to update)
- Risk: Medium (multiple files, more prone to errors)

**Option 1 is strongly recommended** — it's faster and less error-prone.

### Classes to Update in CSS

```
.ProductHero-gallery → .ProductHero-image
.ProductHero-details → .ProductHero-content
.ProductHero-badges → .ProductHero-claims
.ProductHero-badge → .ProductHero-claim
.ProductHero-actions → .ProductHero-ctas
(Add new classes:) .ProductHero-cta, .ProductHero-cta--shopee, .ProductHero-cta--tokopedia

.SiteHeader-nav-item → .SiteHeader-nav-link (on <a> tag directly)

.CompatGrid-items → .CompatGrid-list
(Add new classes:) .CompatGrid-brand, .CompatGrid-check

.HowToUse-step-num → .HowToUse-step-number

(Add new classes:) .FaqItem-question (for <summary> tags)

.SiteFooter-col-list → .SiteFooter-col-links
.SiteFooter-bottom-links → .SiteFooter-bottom-lang
(Add new classes:) .SiteFooter-col, .SiteFooter-col-placeholder, .SiteFooter-middle
```

---

## ROLLBACK INSTRUCTIONS

To revert all changes:

```bash
git checkout master -- index.html id/index.html css/main.css
git rm -r en/ id/produk/ id/tentang-kami/ id/blog/ id/hubungi-kami/ 404.html special/better-bentonite-landing/
# If you need the old better-bentonite page back:
cp -r <backup>/better-bentonite . && git checkout master -- better-bentonite/
git status
git add -A
git commit -m "Rollback structure-revamp due to CSS/HTML class mismatches"
```

---

## SUMMARY

| Aspect | Status | Details |
|--------|--------|---------|
| Structure & Architecture | PASS | Well-organized new pages with correct hierarchy |
| HTML Semantics | PASS | Good use of semantic elements, aria labels, JSON-LD |
| CSS Coverage | **FAIL** | 18+ critical class mismatches between CSS and HTML |
| Analytics | PASS | GTM and Facebook Pixel correctly placed |
| SEO | PASS | hreflang, meta tags, JSON-LD all correct |
| Images | PASS | All assets exist, alt text present, WebP optimized |
| Paths | PASS | All relative and absolute paths correct |
| **Overall** | **CRITICAL FAILURE** | **DO NOT SHIP** |

---

*Report generated by Site Integrity QA Auditor on 2026-03-03*
*Audit duration: Comprehensive — All 13 pages audited, All CSS rules checked*
**Status**: REJECT THIS BRANCH — Fix CSS/HTML class mismatch before merging.
