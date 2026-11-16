# Website Revamper Agent Memory
*Last updated: 2026-03-03*

## Project Architecture (Confirmed)

- Repo: `/Users/fishfillet/CatlicoWebsite/fishfillet.github.io/`
- Live site: `https://www.catli.co`
- Branch convention: feature work on `structure-revamp`, deploy from `master`
- GitHub Pages static site — no server-side rendering
- Brand/context docs live at `/Users/fishfillet/Catlico Claude/` (NOT inside the repo)

## Key File Paths

- Brand guide: `/Users/fishfillet/Catlico Claude/CATLICO_BRAND_GUIDE.md`
- Structure doc: `/Users/fishfillet/Catlico Claude/CATLICO_WEBSITE_STRUCTURE.md`
- CSS: `css/normalize.css`, `css/root.css`, `css/main.css`
- Images: `img/` — bag.webp/png, black_cat1.webp/jpg, black_cat2.webp/jpg, cat1-cat7.webp/png, pour.jpg, logo.svg, favicon.png, icon_list1-6.svg, icon_mail.svg, icon_instagram.svg, cta_shopping.svg, cta_whatsapp.svg, openGraph.webp
- Scripts: `scripts/jquery-3.7.1.min.js`, `scripts/testimonial-carousel.js`
- Special/campaign pages: `special/` directory (.gitignored from production)

## URL Architecture (2026-03 revamp)

| Page | EN URL | ID URL |
|------|--------|--------|
| Homepage | `/` (root = EN) | `/id/` |
| Product | `/en/products/better-bentonite-cat-litter/` | `/id/produk/better-bentonite-cat-litter/` |
| About | `/en/about/` | `/id/tentang-kami/` |
| Blog | `/en/blog/` | `/id/blog/` |
| Contact | `/en/contact/` | `/id/hubungi-kami/` |
| 404 | `/404.html` | (same, both languages) |

## Brand Colors (Use These Exact Values)

- Brown (primary text, headings, footer bg): `#5c3e32`
- Teal (CTAs, links, active highlights): `#007a72`
- Beige (card/hero backgrounds): `#fee2cc`

## CSS Architecture Notes

- Three-layer system: normalize.css → root.css → main.css
- Old classes (.Nav, .Header, .Action, .Splash, .Pitch, .Footer) kept for backward compat with special/ pages
- New classes added in appended block starting with comment `/* REVAMP 2026-03 — New site-wide structural components */`
- BEM-inspired: `.SiteHeader`, `.SiteHeader-inner`, `.SiteHeader-nav`, `.SiteHeader-cta`
- PageContainer: max-width 120rem, responsive padding
- See `patterns.md` for full new class list

## Critical Conventions

- CTA button order: Shopee FIRST, then Tokopedia, then WhatsApp (per CLAUDE.md)
- WhatsApp NOT on product page CTAs — footer Connect column only
- Product name "Better Bentonite Cat Litter" stays in English on both EN and ID pages
- Use "pewangi" not "wewangian" for Indonesian fragrance references
- 4 hero claims exact wording: "Odor Killing" / "Instant Clumping" / "100% Natural Highest Grade Bentonite Clay" / "99.9% Dust Free"
- FAQ: use `<details>/<summary>` NOT JavaScript accordion (SEO requirement)
- All pages: GTM-5H3RN9K9 in head (async) + noscript iframe in body
- All pages: Facebook Pixel 244173318753642 with PageView
- hreflang must be reciprocal on every page pair
- x-default points to EN version

## Analytics IDs

- GTM: `GTM-5H3RN9K9`
- Facebook Pixel: `244173318753642`
- Facebook domain verification: `bv6viv22aoyk1qeyg448g7it6yekp6`

## Marketplace URLs (Current)

- Shopee: `https://shopee.co.id/Catlico-Better-Bentonite-Cat-litter-6L-Pasir-Kucing-Gumpal-Unscented-i.1038262482.20082325306?sp_atk=45fe85f7-1aa0-4f53-aade-0814d25dee18&xptdk=45fe85f7-1aa0-4f53-aade-0814d25dee18`
- Tokopedia: `https://www.tokopedia.com/catlico/catlico-better-bentonite-cat-litter-6l-pasir-kucing-gumpal-unscented`
- WhatsApp: `https://api.whatsapp.com/message/W2FFWU6ARBRKH1?autoload=1&app_absent=0`

## Image Asset Relative Path Pattern (By Depth)

- Root pages (index.html): `./img/`
- Depth-1 pages (id/index.html): `../img/`
- Depth-2 pages (en/about/, id/tentang-kami/): `../../img/`
- Depth-3 pages (en/products/better-bentonite-cat-litter/): `../../../img/`
- Absolute (404.html): `/img/`
- special/better-bentonite-landing/: `../../img/` (own local ./img/ also exists)

## Known Issues / Technical Debt

- No mobile hamburger menu — `.SiteHeader-nav` hidden at <900px with no fallback navigation
- Root `/` serves EN content directly (no `/en/` subdirectory) — hreflang handles this correctly but `/en/` path returns 404
- Galano Grotesque not installed (commercial license needed) — using Darker Grotesque as fallback
- `seal_fg.svg`, `seal_bg.svg`, `source.svg`, `foot.png` remain in `img/` but no longer used by main pages (only in special/ pages potentially)

## CSS-HTML Class Name Convention (Confirmed After Audit)

These are the exact class names used in HTML (source of truth). CSS must match these — never invent names without cross-checking HTML first.

- Nav links: `.SiteHeader-nav-link` (direct `<a>` tag; no wrapper `<li class="SiteHeader-nav-item">`)
- Active nav state: `[aria-current="page"]` attribute selector, NOT `.active` class
- Footer wrappers: `.SiteFooter-top`, `.SiteFooter-middle`, `.SiteFooter-bottom` — padding-only; `PageContainer` inside handles max-width
- Footer column: `.SiteFooter-col`, `.SiteFooter-col-heading`, `.SiteFooter-col-links` (NOT `-col-list`), `.SiteFooter-col-placeholder`
- Footer bottom: `.SiteFooter-copy` (NOT `-copyright`), `.SiteFooter-bottom-lang` (NOT `-bottom-links`)
- Trust strip: `.TrustStrip` IS the CSS Grid container — no `.TrustStrip-items` wrapper in HTML
- Featured products: `.FeaturedProducts-grid` (flex column container)
- Product card: `.ProductCard-image-link`, `.ProductCard-body` (NOT `-content`), `.ProductCard-name` (NOT `-h3`), `.ProductCard-coming-soon-inner`, `.ProductCard-coming-soon-label`, `.ProductCard-coming-soon-body`
- Product hero: `.ProductHero-image` (NOT `-gallery`), `.ProductHero-content` (NOT `-details`), `.ProductHero-claims` (NOT `-badges`), `.ProductHero-claim` (NOT `-badge`), `.ProductHero-ctas` (NOT `-actions`), `.ProductHero-cta`, `.ProductHero-cta--shopee`, `.ProductHero-cta--tokopedia`
- Compat grid: `.CompatGrid-list` (NOT `-items`), `.CompatGrid-brand`, `.CompatGrid-check`
- How to use: `.HowToUse-step-number` (NOT `-step-num`)
- FAQ item: `<summary class="FaqItem-question">` — CSS must alias both `summary` tag selector AND `.FaqItem-question` class

## Tool Behavior Notes

- Write tool requires reading a file before editing — always Read before Write/Edit
- For NEW files, Write tool works without prior Read
- NEVER use dangerouslyDisableSandbox:true with rm commands
- For directory moves: use `cp -r`, fix paths with sed, then `rm -rf` with explicit full path in a variable
- `css/main.css` is large (~1600 lines after revamp) — use offset/limit when reading

## Font

- Web: Darker Grotesque, weights 600 (body) + 800 (headings), via Google Fonts `&display=swap`
- Brand spec: Galano Grotesque Semibold (headings), Medium (body) — not yet installed

## Contact Info (From Brand Guide)

- Email: hello@catli.co
- Instagram: @cat.li.co
- Phone: +62 813 8888 2435
- Founder: Daniel Susetyo (daniel@catli.co)
