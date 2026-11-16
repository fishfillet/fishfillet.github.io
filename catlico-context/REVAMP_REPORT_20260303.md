# Catlico Website Revamp Report
**Date**: 2026-03-03T00:00:00+07:00
**Last updated**: 2026-03-03 (CSS/HTML class fix pass applied)
**Agent**: Website Revamper (claude-sonnet-4-6)
**Branch**: `structure-revamp`
**Scope**: Full structural revamp of catli.co — new URL architecture, brand homepage, product pages (EN + ID), stub pages, footer redesign, CSS architecture extension, and landing page relocation.

---

## CSS/HTML Class Fix Pass — 2026-03-03

The site-integrity-auditor identified 18+ critical CSS-HTML class name mismatches after the initial revamp. All mismatches were resolved by updating `css/main.css` to match the HTML class names (Option 1 — update CSS to match HTML). No HTML files were changed. A Python cross-check script confirmed zero remaining mismatches across all 11 non-special pages.

### Fixed in `css/main.css`

| Old CSS Class | New CSS Class | Component |
|---|---|---|
| `.ProductHero-gallery` | `.ProductHero-image` | Product page hero image column |
| `.ProductHero-details` | `.ProductHero-content` | Product page hero text column |
| `.ProductHero-badges` | `.ProductHero-claims` | Product hero claim badge list |
| `.ProductHero-badge` | `.ProductHero-claim` | Individual claim badge |
| `.ProductHero-badge-dot` | removed (replaced by icon `<img>`) | Was dot-only design; HTML uses icons |
| `.ProductHero-actions` | `.ProductHero-ctas` | CTA button group in product hero |
| `.SiteHeader-nav-item a` | `.SiteHeader-nav-link` | Direct `<a>` tag nav links (HTML has no wrapper div) |
| `.SiteFooter-col-list` | `.SiteFooter-col-links` | Footer column `<ul>` link list |
| `.SiteFooter-col-list a` | `.SiteFooter-col-links a` | Footer link styling |
| `.SiteFooter-bottom-links` | `.SiteFooter-bottom-lang` | Bottom bar language switcher |
| `.SiteFooter-copyright` | `.SiteFooter-copy` | Copyright `<p>` element |
| `.CompatGrid-items` | `.CompatGrid-list` | Auto litter box compat `<ul>` |
| `.HowToUse-step-num` | `.HowToUse-step-number` | Numbered step circle |
| `.TrustStrip-items` (grid wrapper) | Removed — grid moved to `.TrustStrip` | HTML has no `.TrustStrip-items` wrapper; items are direct children |
| `.ComingSoon-label` | `.ProductCard-coming-soon-label` | Coming soon badge label |
| `.ProductCard-content` | `.ProductCard-body` | Product card text area |
| `.ProductCard-h3` | `.ProductCard-name` | Product card name heading |

### Added new CSS classes

| New Class | Component | Notes |
|---|---|---|
| `.ProductHero-cta` | Product page marketplace CTA button base | flex row, rounded, transition |
| `.ProductHero-cta--shopee` | Shopee CTA button variant | Orange (#ff6633) fill |
| `.ProductHero-cta--tokopedia` | Tokopedia CTA button variant | White fill, brown border |
| `.SiteFooter-col` | Individual footer column wrapper | flex column |
| `.SiteFooter-col-placeholder` | "More coming soon" muted text | Reduced opacity, italic |
| `.SiteFooter-middle` | Footer middle section wrapper | padding only; layout done by `PageContainer` inside |
| `.SiteHeader-nav-link[aria-current="page"]` | Active nav link state | Teal color + bold weight |
| `.CompatGrid-brand` | Brand name text in compat row | Bold brown text |
| `.CompatGrid-check` | Checkmark indicator in compat row | Teal, bold |
| `.FaqItem-question` | `<summary>` class alias | Full styling parity with `.FaqItem summary` tag selector |
| `.FeaturedProducts-grid` | Product card grid container | flex column, gap |
| `.ProductCard-image-link` | Clickable image `<a>` wrapper | flex sizing, display block |
| `.ProductCard-coming-soon-inner` | Coming soon card inner layout | centered flex column |
| `.ProductCard-coming-soon-body` | Coming soon description text | muted color |

### Structural CSS corrections

- `.SiteFooter-top` had `max-width` and `margin: 0 auto` duplicating `PageContainer`. Removed — footer section divs are now padding-only wrappers; `PageContainer` inside each handles the max-width constraint.
- `.SiteFooter-bottom` had same duplication. Fixed: layout flex now on `.SiteFooter-bottom .PageContainer` selector.
- `.TrustStrip` now directly acts as the CSS Grid container (grid properties moved from defunct `.TrustStrip-items` to `.TrustStrip` itself).
- `.CompatGrid-item` layout updated from centred card grid to flex row (brand name left, checkmark right) to match the HTML `<li>` structure with `.CompatGrid-brand` + `.CompatGrid-check` spans.

---

## 1. Changes Made

### Summary Table

| File | Section/Component | Change Description | Reason |
|------|------------------|-------------------|--------|
| `css/main.css` | All new structural components | Appended ~600 lines of new CSS for SiteHeader, SiteFooter, Hero, BrandIntro, Pillars, FeaturedProducts, TrustStrip, ProductHero, ClaimsGrid, SplitSection, CompatGrid, HowToUse, Ingredients, FaqSection, StubPage, PageContainer | New page structures required new CSS classes not present in original stylesheet |
| `index.html` | Full page | Complete rewrite: new EN homepage replacing single-product landing page | Align with new site architecture — brand hub rather than product page |
| `id/index.html` | Full page | Complete rewrite: Indonesian homepage mirror | Align with new site architecture |
| `en/products/better-bentonite-cat-litter/index.html` | New file | Created new EN product page with 7 sections + 3 JSON-LD schemas | New URL architecture requirement |
| `id/produk/better-bentonite-cat-litter/index.html` | New file | Created new ID product page in Bahasa Indonesia | New URL architecture requirement |
| `en/about/index.html` | New file | Created EN About stub page | New site architecture — placeholder until copy is ready |
| `en/blog/index.html` | New file | Created EN Blog stub page | New site architecture placeholder |
| `en/contact/index.html` | New file | Created EN Contact page with actual contact details | New site architecture — functional page with all contact info |
| `id/tentang-kami/index.html` | New file | Created ID About stub page | New site architecture placeholder |
| `id/blog/index.html` | New file | Created ID Blog stub page | New site architecture placeholder |
| `id/hubungi-kami/index.html` | New file | Created ID Contact page in Bahasa Indonesia | New site architecture — functional page with all contact info |
| `404.html` | New file | Created 404 error page with cat mascot illustration | GitHub Pages 404 handling |
| `better-bentonite/` | Directory removal | Moved to `special/better-bentonite-landing/` | User instruction: reorganize into special campaigns directory |
| `special/better-bentonite-landing/index.html` | New location | Relative paths updated from `../` to `../../` prefix | Directory depth changed from 1 to 2 levels |

---

### Notable Structural Changes

**Homepage restructure (index.html and id/index.html)**

The original homepage was a single-product landing page with image cycling carousels, a jQuery-driven FAQ accordion, and a simple footer with social icons. The new homepage is a brand hub with five distinct content sections:

1. Hero — brand-level H1 headline, product image, two CTAs (primary: product page, secondary: about page)
2. Brand Introduction — 2-column layout with cat mascot image and 3 paragraphs introducing Catlico
3. Brand Pillars — 3-column grid (Natural & Safe, Cat-Centric, Thoughtful Design)
4. Featured Products — ProductCard for Better Bentonite + coming-soon placeholder card
5. Trust Signals — horizontal strip with 3 trust metrics

The navigation was completely rebuilt using the new `.SiteHeader` component: sticky positioning, 5 navigation links, language switcher (EN|ID), and a "Shop Now" CTA button. Social icons were removed from the nav and moved to the footer Connect column. WhatsApp CTA was removed from the hero CTA row and added to the footer Connect column.

The old footer (social icons + source.svg + foot.png overlay) was replaced with a structured 3-column `.SiteFooter` with Products, Company, and Connect columns.

**New product pages**

Both EN and ID product pages were created from scratch at the new URL paths. Each contains:
- `<h1>`: "Better Bentonite Cat Litter" (product name kept in English on both language pages per brand guide)
- ProductHero section: product image + 4 claim badges + Shopee CTA + Tokopedia CTA (no WhatsApp)
- ClaimsGrid: 4-column grid expanding on each hero claim with educational copy
- SplitSection: "Why Fragrance-Free?" with black_cat1.webp lifestyle image
- CompatGrid: 4 auto litter box brands
- HowToUse: semantic `<ol>` with 4 numbered steps
- Ingredients: HTML `<table>` with 4 rows
- FaqSection: 7 `<details>/<summary>` accordion items (SEO-crawlable, no JavaScript)
- Three JSON-LD schemas: Product, HowTo, FAQPage

**URL architecture established**

| Page | URL |
|------|-----|
| EN Homepage | `https://www.catli.co/` |
| ID Homepage | `https://www.catli.co/id/` |
| EN Product Page | `https://www.catli.co/en/products/better-bentonite-cat-litter/` |
| ID Product Page | `https://www.catli.co/id/produk/better-bentonite-cat-litter/` |
| EN About | `https://www.catli.co/en/about/` |
| EN Blog | `https://www.catli.co/en/blog/` |
| EN Contact | `https://www.catli.co/en/contact/` |
| ID Tentang Kami | `https://www.catli.co/id/tentang-kami/` |
| ID Blog | `https://www.catli.co/id/blog/` |
| ID Hubungi Kami | `https://www.catli.co/id/hubungi-kami/` |
| 404 | `https://www.catli.co/404.html` |

---

### CSS Changes

**New classes added to `css/main.css`** (appended block, ~600 lines):

```
.SiteHeader               Sticky site header wrapper
.SiteHeader-inner         Flex row: logo | nav | right
.SiteHeader-logo          Logo link in header
.SiteHeader-nav           Desktop nav (hidden <900px, flex >=900px)
.SiteHeader-nav-link      Individual nav link styles
.SiteHeader-right         Right group: lang switcher + CTA
.SiteHeader-lang          EN|ID language switcher
.SiteHeader-cta           Teal rounded CTA button

.SiteFooter               Brown (#5c3e32) footer wrapper
.SiteFooter-top           Logo + tagline row
.SiteFooter-brand         Footer logo link
.SiteFooter-brand-logo    Filter: brightness(0) invert(1) for light logo
.SiteFooter-tagline       Short brand tagline
.SiteFooter-middle        3-column link section
.SiteFooter-cols          CSS Grid: 1-col mobile, 3-col >=600px
.SiteFooter-col           Individual footer column
.SiteFooter-col-heading   Column heading (h4)
.SiteFooter-col-links     Column link list
.SiteFooter-col-placeholder  Disabled/coming-soon text
.SiteFooter-bottom        Copyright + language toggle bar
.SiteFooter-copy          Copyright text
.SiteFooter-bottom-lang   Footer language switcher

.Hero                     Homepage hero section
.Hero-image               Product image container
.Hero-content             Text + CTA column
.Hero-h1                  Large brand headline
.Hero-sub                 Subheadline paragraph
.Hero-actions             CTA button row
.Hero-btn                 Base button style
.Hero-btn--primary        Teal filled button
.Hero-btn--secondary      Outlined brown button

.BrandIntro               2-column brand intro section
.BrandIntro-image         Image column
.BrandIntro-content       Text column
.BrandIntro-link          "Read our story" text link

.Pillars                  Brand pillars section wrapper
.Pillars-heading          Section H2
.Pillars-grid             3-column grid
.Pillar                   Individual pillar card
.Pillar-icon              Icon container
.Pillar-h3                Pillar heading
.Pillar-body              Pillar description

.FeaturedProducts         Products showcase section
.FeaturedProducts-heading Section H2
.FeaturedProducts-grid    Product card grid
.ProductCard              Individual product card
.ProductCard--coming-soon Grayed placeholder card
.ProductCard-image-link   Clickable image wrapper
.ProductCard-image        Product image
.ProductCard-body         Text content area
.ProductCard-name         Product H3 name
.ProductCard-desc         Short 2-line description
.ProductCard-badges       Claim badge list
.ProductCard-badge        Individual badge pill
.ProductCard-cta          Card CTA link
.ProductCard-coming-soon-inner  Coming soon inner wrapper
.ProductCard-coming-soon-label  "More coming soon" label
.ProductCard-coming-soon-body   Coming soon description

.TrustStrip               Trust signals horizontal strip
.TrustStrip-item          Individual trust signal
.TrustStrip-icon          Emoji icon container
.TrustStrip-label         Trust signal text

.ProductHero              Product page hero (2-col layout)
.ProductHero-image        Product image column
.ProductHero-content      Text + CTA column
.ProductHero-h1           Product name H1
.ProductHero-tagline      Short product tagline
.ProductHero-claims       4-item claim badge list
.ProductHero-claim        Individual claim (icon + text)
.ProductHero-ctas         CTA button group
.ProductHero-cta          Marketplace CTA button
.ProductHero-cta--shopee  Shopee variant
.ProductHero-cta--tokopedia  Tokopedia variant

.ClaimsGrid               4-column claims section
.ClaimsGrid-heading       Section H2
.ClaimsGrid-grid          4-col grid
.Claim                    Individual claim card
.Claim-icon               Icon container
.Claim-h3                 Claim heading
.Claim-body               Claim description

.SplitSection             2-column text + image section
.SplitSection-content     Text column (left)
.SplitSection-image       Image column (right)

.CompatGrid               Auto litter box compatibility section
.CompatGrid-intro         Intro paragraph
.CompatGrid-list          Brand list
.CompatGrid-item          Individual brand row
.CompatGrid-brand         Brand name
.CompatGrid-check         Checkmark indicator
.CompatGrid-note          "Don't see yours?" note

.HowToUse                 How to use section
.HowToUse-steps           Ordered list wrapper
.HowToUse-step            Individual step (li)
.HowToUse-step-number     Step number badge
.HowToUse-step-content    Step text container
.HowToUse-step-title      Step bold title

.Ingredients              Ingredients table section
.Ingredients-table        HTML table with styled rows

.FaqSection               FAQ section wrapper
.FaqSection-items         FAQ items container
.FaqItem                  details element wrapper
.FaqItem-question         summary element
.FaqItem-answer           Expandable answer container

.StubPage                 Centered stub/placeholder page layout
.StubPage-h1              Stub page H1
.StubPage-body            Stub page body text
.StubPage-back            Back-to-home CTA button

.PageContainer            Max-width content wrapper (120rem, responsive padding)
```

**Classes removed / deprecated**: None — old classes (.Nav, .Header, .Action, .Action-button, .Splash, .Pitch, .Footer etc.) remain in `main.css` for backward compatibility with the `special/` campaign pages.

---

### Asset Changes

- `better-bentonite/` directory removed from root; moved to `special/better-bentonite-landing/`
- No new images added; existing images reused in new layouts
- `seal_fg.svg` and `seal_bg.svg` preloads removed from new homepages (no longer in above-fold content)
- `source.svg` and `foot.png` no longer used in new homepage footer (old `.Footer` replaced by `.SiteFooter`)
- jQuery script (`scripts/jquery-3.7.1.min.js`) removed from new pages (not needed — no image cycling or JS accordion)

---

## 2. Brand Guideline Compliance

- **Colors**: Brown `#5c3e32`, Teal `#007a72`, Beige `#fee2cc` used throughout. SiteHeader border uses `rgba(92, 62, 50, 0.12)`. SiteFooter background is Brown `#5c3e32`. Hero section background is Beige `#fee2cc`. Primary CTA buttons use Teal `#007a72`. Secondary buttons use Brown outline. Badge and trust strip elements use brand palette only.
- **Typography**: Darker Grotesque (Google Fonts, weights 600 and 800) used as the fallback web font for Galano Grotesque. All headings use weight 800, body text uses weight 600. No other font families introduced.
- **Tone/Voice**: Copy uses "cat parents" throughout (never "pet owners"). Brand introduction copy is warm and personal. Indonesian copy uses "anabul" terminology in appropriate contexts. Product claims use exact wording from brand guidelines: "Odor Killing", "Instant Clumping", "100% Natural Highest Grade Bentonite Clay", "99.9% Dust Free" (EN); "Penghilang Bau", "Gumpal Instan", "100% Tanah Liat Bentonit Alami Grade Tertinggi", "99,9% Bebas Debu" (ID). Indonesian copy uses "pewangi" not "wewangian" per brand guide terminology note.
- **Imagery**: Only existing brand image assets used — bag.webp/png, cat1.webp/png (brand intro), black_cat1.webp/jpg (product page split section), cat3.webp/png (404 page). All images serve photography subjects aligned with brand guide (product packshot, cat mascot, lifestyle).
- **Deviations**: Galano Grotesque (commercial font) not implemented — Darker Grotesque used as fallback per user instruction. Galano Grotesque installation is documented under Future Build (Section 4).

---

## 3. Performance Impact Assessment

- **LCP Impact**: Neutral to positive. New pages preload `logo.svg`, `bag.webp`, and `bag.png` in `<head>`. Old cycling carousel (which forced multiple image loads) removed. Fewer initial resource loads on homepage.
- **CLS Impact**: Positive. All `<img>` elements on new pages have explicit `width` and `height` attributes set, which prevents layout shift. No jQuery-driven dynamic content on new pages. Fixed `<picture>` elements with defined dimensions eliminate CLS.
- **Asset Load Changes**: jQuery removed from all new pages (was 87KB on old pages). Old seal SVGs no longer preloaded. Total critical-path resource weight reduced per new page. `special/better-bentonite-landing/` pages still use jQuery and old CSS classes — no impact on performance of new pages.
- **Tracking Integrity**: GTM (`GTM-5H3RN9K9`) present in `<head>` (async) and `<body>` (noscript iframe) on all 11 new/rewritten pages. Facebook Pixel (`244173318753642`) with `PageView` tracking on all 11 pages. WhatsApp CTA link preserved in footer Connect column on all pages. Shopee listed before Tokopedia in all CTA button groups per CLAUDE.md requirement.

---

## 4. Suggested Changes (For Next Revamp)

### High Priority

- **Install Galano Grotesque font**: The brand guide specifies Galano Grotesque as the exclusive typeface. Currently using Darker Grotesque as fallback. To install: (1) Obtain a Galano Grotesque web license from Rene Bieder / type foundry; (2) Host the `.woff2` files locally at `/fonts/galano-grotesque-semibold.woff2` and `/fonts/galano-grotesque-medium.woff2`; (3) Add `@font-face` declarations to `root.css`; (4) Add preload tags to all page `<head>` blocks; (5) Update font-family stack in CSS to `"Galano Grotesque", "Darker Grotesque", sans-serif`.

- **Hamburger mobile menu**: The current nav hides at `<900px` with no mobile menu. Implement a lightweight hamburger menu (CSS-only checkbox toggle or minimal JS) for the `SiteHeader-nav` on mobile. This is a critical UX gap — mobile users currently have no access to navigation links.

- **Blog Preview section (Future Build)**: Homepage Section 6 (Blog Preview with 3 article card grid) was omitted per user instruction. When blog content exists, add this section between TrustStrip and Footer. Use the layout defined in `CATLICO_WEBSITE_STRUCTURE.md` Section 3 / Section 6. Mark articles with `<h3>` titles and `<time>` elements for SEO.

- **Social Proof / Reviews section (Future Build)**: Product page Section 8 (customer reviews) was omitted. When Tokopedia/Shopee review data is available, add star-rating cards using the schema defined in structure doc. Use `itemscope`/`itemtype="https://schema.org/Review"` markup.

- **Newsletter / Community Signup (Future Build)**: Homepage Section 7 was omitted. Implement using a third-party embed (Mailchimp, Klaviyo, or Brevo) with Indonesian-language copy. Background: Beige `#fee2cc`. Required field: email only (minimize friction).

### Medium Priority

- **About page content**: `/en/about/` and `/id/tentang-kami/` are currently stub pages. Write the full brand story, mission statement (from brand guide), 4–6 values grid, and persona-inspired "who we're for" section. The structure is defined in `CATLICO_WEBSITE_STRUCTURE.md` Section 5.

- **hreflang on root `/`**: The current EN homepage is at `/` (root) rather than `/en/`. The structure document recommends `/en/` as the canonical EN URL. Currently, `/en/` does not exist as a redirect from `/`. Consider either adding a redirect from `/en/` → `/` (using a meta-refresh or Jekyll redirect plugin) or creating `/en/index.html` that canonicals back to `/`. Until resolved, search engines will correctly follow `hreflang` pointing `/` as EN+x-default.

- **Sitemap update**: The `sitemap.xml` should be updated to include all new pages: `/en/products/better-bentonite-cat-litter/`, `/id/produk/better-bentonite-cat-litter/`, `/en/about/`, `/en/blog/`, `/en/contact/`, `/id/tentang-kami/`, `/id/blog/`, `/id/hubungi-kami/`. Exclude `/special/` (already excluded) and `404.html`.

- **robots.txt update**: Confirm `robots.txt` allows crawling of all new URL paths under `/en/` and `/id/`. Currently, it only disallows `/special/` — the new paths should be crawlable.

- **ProductHero CTA: Add WhatsApp as third option on homepage product card**: Per brand convention, WhatsApp is available as a purchase channel. The homepage ProductCard currently shows only "Shop Now" linking to the product page. The product page itself correctly shows Shopee + Tokopedia (no WhatsApp, per user decision). Consider adding WhatsApp back to the homepage card as a tertiary option for users who want to buy directly.

- **Contact page form**: `/en/contact/` and `/id/hubungi-kami/` currently show contact details only. Add a simple contact form (Formspree or Netlify Forms are compatible with GitHub Pages static hosting) with Name, Email, Message fields.

### Low Priority

- **Related articles section on product pages**: Section 9 of the product pages (cross-links to blog articles) was omitted since no blog articles exist yet. Add as 3-card row once blog content is live.

- **Facebook Pixel Lead tracking on product pages**: CLAUDE.md notes that Lead tracking for WhatsApp CTAs "needs implementation on main pages." The product pages have Shopee + Tokopedia CTAs but no WhatsApp. When WhatsApp is added to any page, add `fbq('track', 'Lead')` onclick to those CTA elements.

- **Tokopedia and Shopee logo badges in Trust Strip**: The structure document calls for marketplace logo trust badges in the Trust Strip section. Currently using emoji and text only. Source official Tokopedia/Shopee partner badge images (or SVGs) and add them to the `.TrustStrip` section.

- **OpenGraph image for EN product page**: The product page uses the general `openGraph.webp`. A product-specific OG image (packshot on white background, 1200x630px, as `.webp`) would improve social sharing appearance for the product page URL.

- **Print styles**: No print CSS exists. Low priority but worth adding a minimal `@media print` block to hide the `.SiteHeader`, `.SiteFooter`, and `.TrustStrip` for any printed product information sheets.

---

## 5. Testing Checklist (For QA Agent)

### Visual/Layout Tests

- [ ] EN homepage renders SiteHeader with 5 nav links at desktop width (≥900px)
- [ ] EN homepage Hero section shows bag.webp image + H1 text + two CTA buttons
- [ ] EN homepage BrandIntro shows cat1.webp + 3 paragraphs + "Read our story" link
- [ ] EN homepage Pillars shows 3 cards in a row at desktop, stacked on mobile
- [ ] EN homepage FeaturedProducts shows Better Bentonite card + coming-soon card
- [ ] EN homepage TrustStrip shows 3 trust signals in a row
- [ ] EN homepage SiteFooter shows 3 columns at desktop width
- [ ] ID homepage mirrors EN structure with all content in Bahasa Indonesia
- [ ] EN product page ProductHero shows bag.webp + H1 + 4 claim badges + Shopee/Tokopedia CTAs (NO WhatsApp)
- [ ] EN product page ClaimsGrid shows 4 claim cards in a 2x2 or 4-col grid
- [ ] EN product page SplitSection shows black_cat1.webp image alongside "Why Fragrance-Free?" text
- [ ] EN product page CompatGrid shows 4 auto litter box brand rows with checkmarks
- [ ] EN product page HowToUse shows numbered step list with teal step numbers
- [ ] EN product page Ingredients shows HTML table with 4 rows
- [ ] EN product page FaqSection shows 7 `<details>/<summary>` items that expand/collapse
- [ ] ID product page mirrors EN product page with all content in Bahasa Indonesia
- [ ] All stub pages (About, Blog, Contact EN+ID) display StubPage centered layout
- [ ] Contact pages (EN+ID) show actual contact details with mailto: and tel: links
- [ ] 404.html shows cat3.webp mascot image + error message + "Back to Home" button
- [ ] SiteHeader is sticky and stays visible when scrolling down any page
- [ ] Language switcher shows active language visually (EN bold/active on EN pages, ID on ID pages)

### Functional Tests

- [ ] All nav links in SiteHeader navigate to correct pages
- [ ] Language switcher (EN | ID) links navigate to correct language counterpart on all pages
- [ ] "Shop Now" CTA in SiteHeader links to `/en/products/better-bentonite-cat-litter/` on EN pages
- [ ] "Beli Sekarang" CTA in SiteHeader links to `/id/produk/better-bentonite-cat-litter/` on ID pages
- [ ] "Shop Better Bentonite" button on EN homepage leads to EN product page
- [ ] "Beli Pasir Kucing" button on ID homepage leads to ID product page
- [ ] "Learn About Us" / "Tentang Kami" secondary CTA leads to correct About stub page
- [ ] "Shop Now →" on ProductCard leads to correct product page
- [ ] Shopee CTA on EN product page opens correct Shopee URL in new tab
- [ ] Tokopedia CTA on EN product page opens correct Tokopedia URL in new tab
- [ ] WhatsApp link in SiteFooter Connect column opens WhatsApp correctly
- [ ] Instagram link in SiteFooter opens `@cat.li.co` in new tab
- [ ] Email link opens mailto:hello@catli.co
- [ ] FAQ `<details>` items expand and collapse correctly (keyboard + click)
- [ ] "Back to Home" on stub pages navigates to homepage
- [ ] `special/better-bentonite-landing/index.html` loads without broken images or missing scripts
- [ ] `special/20off/index.html` still loads correctly (CSS class compatibility check)

### Cross-Browser / Responsive Tests

- [ ] Layout at 375px (mobile): SiteHeader shows logo + lang switcher (no nav links)
- [ ] Layout at 768px (tablet): Check BrandIntro column stacking and Pillars grid
- [ ] Layout at 1024px (small desktop): Full 3-column Pillars and footer visible
- [ ] Layout at 1440px (large desktop): PageContainer max-width (120rem) constrains content properly
- [ ] WebP images display in Chrome/Safari; PNG fallbacks load in browsers without WebP support
- [ ] `<details>/<summary>` FAQ accordion works in all major browsers
- [ ] No horizontal scroll at any viewport width

### Analytics Tests

- [ ] GTM fires on page load — verify `GTM-5H3RN9K9` in GTM Preview Mode on: `index.html`, `id/index.html`, EN product page, ID product page, all stub pages
- [ ] Facebook Pixel PageView fires on all pages — check in Facebook Pixel Helper extension
- [ ] No duplicate GTM tags firing (verify only one GTM container script per page)

### SEO Tests

- [ ] `<html lang="en">` on EN pages; `<html lang="id">` on ID pages
- [ ] All pages have `<title>` and `<meta name="description">` with appropriate content
- [ ] All pages have `<link rel="canonical">` pointing to absolute self-URL
- [ ] hreflang pairs are reciprocal: EN page points to ID counterpart and vice versa
- [ ] All pages have `hreflang="x-default"` pointing to EN version
- [ ] `<h1>` present exactly once per page and contains primary keyword
- [ ] FAQ items on product pages visible in page source (not hidden behind JS)
- [ ] JSON-LD scripts (Product, HowTo, FAQPage) present on EN and ID product pages
- [ ] JSON-LD FAQPage answers match visible text in `<details>/<summary>` elements
- [ ] Organization JSON-LD present on EN and ID homepages
- [ ] `meta name="robots" content="noindex, follow"` present on `404.html` only
- [ ] OpenGraph tags (og:title, og:description, og:image, og:url) present on all pages

### Asset Path Tests

- [ ] All images load on `index.html` (relative paths: `./img/`)
- [ ] All images load on `id/index.html` (relative paths: `../img/`)
- [ ] All images load on EN product page (relative paths: `../../../img/`)
- [ ] All images load on ID product page (relative paths: `../../../img/`)
- [ ] All images load on stub pages at `en/*/` (relative paths: `../../img/`)
- [ ] All images load on stub pages at `id/*/` (relative paths: `../../img/`)
- [ ] All images load on `404.html` (absolute paths: `/img/`)
- [ ] All CSS files load correctly on all pages
- [ ] `special/better-bentonite-landing/index.html` — verify no broken `../img/` paths remain (should all be `../../img/`)

---

## 6. Rollback Notes

### What changed

The following files were **completely rewritten** (original content lost unless reverted via git):
- `index.html`
- `id/index.html`

The following files were **newly created** (can be deleted):
- `404.html`
- `en/` (entire directory tree)
- `id/produk/` (entire directory)
- `id/tentang-kami/`, `id/blog/`, `id/hubungi-kami/`
- `special/better-bentonite-landing/`
- `catlico-context/` (this report)

The following files were **appended to** (original content intact, new content at end):
- `css/main.css` — new CSS block starts at the comment `/* REVAMP 2026-03 — New site-wide structural components */`

The following directory was **moved**:
- `better-bentonite/` → `special/better-bentonite-landing/` (no longer at root)

### To fully rollback

```bash
git checkout master -- index.html id/index.html css/main.css
git rm -r en/ id/produk/ id/tentang-kami/ id/blog/ id/hubungi-kami/
git rm 404.html
# Move better-bentonite back if needed:
cp -r special/better-bentonite-landing better-bentonite
# Then re-fix relative paths in better-bentonite/index.html back to ../
```

### Git branch

All changes are on branch `structure-revamp`. The `master` branch is untouched.

---

## 7. Future Build Items

The following sections from `CATLICO_WEBSITE_STRUCTURE.md` were **intentionally omitted** per user instruction and should be implemented in a future revamp session:

| Section | Location | Notes |
|---------|----------|-------|
| Blog Preview (3-article card grid) | Homepage Section 6 | Requires published blog articles first |
| Newsletter / Community Signup | Homepage Section 7 | Requires third-party email service integration |
| Social Proof / Reviews | Product pages Section 8 | Requires actual customer review data |
| Related Articles cross-links | Product pages Section 9 | Requires published blog articles first |
| About page full content | `/en/about/`, `/id/tentang-kami/` | Awaiting copywriting |
| Blog index page | `/en/blog/`, `/id/blog/` | Awaiting content |
| Galano Grotesque font | All pages (typography) | Requires commercial font license purchase |
| Hamburger mobile menu | SiteHeader | JavaScript nav toggle for <900px viewports |
| Contact form | `/en/contact/`, `/id/hubungi-kami/` | Requires form backend (Formspree, Netlify, etc.) |

---

*Report generated by Catlico Website Revamper agent on 2026-03-03.*
*Branch: `structure-revamp` | No commits made — changes are local working tree only.*
