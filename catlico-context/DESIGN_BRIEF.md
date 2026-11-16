# catli.co — Design Brief

**For Claude Design.** This is release R1 of the rebuild. Nothing ships from this phase — the output is a design system plus page comps that Claude Code builds from in R2 onwards.

Companion: `BUILD_SPEC.md` (the build handoff). Read §4 and §8 of it before designing — the performance budget constrains real design decisions, and the homepage spec is already settled.

---

## 1. What we're designing and why

Catlico is an Indonesian premium cat care brand. The site today is a single-product page for Better Bentonite cat litter. There are now two SKUs, and the site is being rebuilt from scratch — including a refresh of the aesthetics, which is the part this brief is about.

**The brand identity is not being redesigned.** Logo, palette, mascot, voice and positioning are settled and working. What needs work is how they're expressed on the web: the current site is functional but generic, and it doesn't carry the premium positioning the brand is built on.

**Who it's for.** Intan, 28, marketing manager, apartment in South Jakarta, two cats, class A–B, tech-savvy, smart spender. She will pay more for quality but not for nothing. She is proud of her cats and her home, and she notices when something looks considered.

---

## 2. Brand tokens — fixed inputs

### Primary

| Token | Hex | Role |
|---|---|---|
| Catlico Brown | `#5c3e32` | Primary text, headings, logo, bold accents |
| Teal Green | `#007a72` | CTAs, links, highlights |
| Beige | `#fee2cc` | Page and card backgrounds, soft fills |

Brown on Beige is the signature combination. Teal is the action colour.

### Secondary — sparingly, never as primary UI

| Token | Hex | Notes |
|---|---|---|
| Terracotta dark | `#a83623` | Warmth accents, badges |
| Terracotta medium | `#c65128` | Pairs with Brown |
| Pastel Blue dark | `#7fa4af` | Soft accent, secondary sections |
| Pastel Blue light | `#daf0f6` | Very light backgrounds, hover states |
| Pastel Yellow dark | `#e9aa21` | The mascot's eye colour; highlight details |
| Pastel Yellow light | `#f1d568` | Light accent, badges |
| Leaf Green dark | `#3f5f2c` | Natural / ingredient claims |
| Leaf Green light | `#9ab64b` | Secondary natural accent |

No colours outside this palette.

### Type

**Galano Grotesque.** Semibold for headings H1–H3, Medium for body and UI. No other family. No italic as a brand style.

> **This is blocked and must be resolved before R1 concludes.** Dan has the Galano files, but a desktop licence does not usually include webfont rights — those are licensed separately, often priced by monthly pageviews. The brand guide itself flags this. Check the licence; if web use isn't covered, either buy it or formally adopt a substitute and record the divergence. Design against Galano either way, but flag it if a fallback becomes necessary, because the type scale will need revisiting.

### Marks and illustration

- Logo is a logotype — the "C" formed into a cat's head silhouette. Never stretched, recoloured, or placed on photography. Safe zone equals the height of the "c" on all sides. Minimum 25px tall on digital.
- Brand mascot is an iconic black cat with `#e9aa21` yellow eyes, illustrative and playful, shown in various activities.
- Icons are **full outline, two-colour** — not filled or solid.

### Voice, for any copy in the comps

Warm, simple, thoughtful, cat-centric. "Cat parents", never "pet owners". "Anabul" in Indonesian. Speak directly — "you", "your cat". Tagline: *"A place where we believe cats and cat-parents deserve better."*

---

## 3. The design problem

Three things the design has to solve that the current site doesn't.

**Two SKUs that aren't equal.** Better Bentonite is the proven revenue engine — years of reviews, established price. noOdor is new. The homepage needs to present both without implying they're equally proven, and ideally sets up the pairing: noOdor is the spray that finishes the job the litter starts. Find a visual treatment for "flagship + companion" that isn't just making one card bigger.

**Premium that survives compression.** The positioning is premium, but the performance budget is severe (§8 of the build spec: homepage LCP under 1.8 s, landing pages under 1.5 s, images under 80 KB each, zero JavaScript on the homepage). Premium has to come from typography, spacing, restraint and colour — not from large photography, video backgrounds, or motion. This is the central tension of the brief, and it is solvable: the brand's own personality words are *calm, simple, thoughtful, attention to detail*, which is a quiet aesthetic, not a heavy one.

**Two audiences on the same page.** Researchers who want to read, and buyers who already know and want the marketplace link. Both exits need to feel first-class on the same product card without the card becoming cluttered.

---

## 4. Deliverables

### 4a · `tokens.css`

A flat custom-property file — colour, type scale, spacing scale, radii, shadows, breakpoints. This is the contract with Claude Code. It must be usable as-is, with no build step: the site is static on GitHub Pages and stays that way.

Include a dark-theme token set only if the design commits to supporting one. It is not required.

### 4b · Component sheet

| Component | Notes |
|---|---|
| Site header | Logo, nav, EN \| ID switcher (plain links), CTA. Desktop + mobile |
| Site footer | Three link columns, marketplace links, tagline, language toggle |
| **SKU card** | The most important component. Product shot, name, one-line benefit, claim badges, two exits: a product-page link and a compact `Beli di: Shopee / Tokopedia / WA` row |
| Marketplace button set | Three-up, compact. Appears on cards, product pages, and `/id/beli/` |
| Comparison table | Real HTML table, responsive. Used on the homepage and `/id/produk/`. Must stay readable at 400px |
| Review block | Aggregate stat + transcribed quote cards + "last updated" line |
| FAQ item | `<details>/<summary>`, open and closed states |
| Brand pillar | Outline icon + heading + short body, three across |
| Buttons | Primary (Teal), secondary, text link. All states incl. visible keyboard focus |
| Claim badge | e.g. "100% Natural", "99.9% Dust Free" |
| Breadcrumb | Every non-homepage page |

### 4c · Page comps

Desktop and 400px mobile for each:

1. **Homepage** — the layout is specified in `BUILD_SPEC.md` §4; design within it
2. **Product page** — one comp serves both SKUs
3. **Ad landing page** (`/lp/`) — no navigation, one offer, one CTA, social proof above the fold. Deliberately a different animal from the product page
4. **Article page** — the content template, optimised for long-form Indonesian reading
5. **`/id/beli/`** — the marketplace routing page

---

## 5. Hard constraints

These come from the build spec and are not negotiable in design.

- **No JavaScript on the homepage.** Anything that needs JS to look right cannot ship there. Carousels are out — CSS scroll-snap is the substitute if a scrolling row is needed.
- **Every image under 80 KB**, whole `/img/` folder under 2 MB. Design for compression: flat colour, illustration and generous space compress well; full-bleed photography does not.
- **No layout shift.** Every image gets fixed dimensions, so no design that depends on content-driven reflow.
- **Works at 400px** with a 16px minimum side gutter, no horizontal scroll except tables in their own scroll container.
- **Visible keyboard focus** on every interactive element.
- **Respect `prefers-reduced-motion`.**
- Language switcher is a plain visible link. No auto-detection, no JS redirect — Googlebot would be bounced out of the Indonesian content.

---

## 6. Out of scope

- Logo, palette, mascot, brand voice — settled, do not redesign
- Packaging and marketplace creative
- Photography art direction (existing product shots will be re-used and re-compressed)
- Anything requiring a server: live review feeds, on-site search, cart, accounts
- A bundle SKU — it doesn't exist yet

---

## 7. Gate

R1 is complete when Dan has approved the aesthetic direction and `tokens.css` is in the repo. No HTML gets written before that. If the design and the performance budget genuinely can't be reconciled on some point, raise it rather than quietly shipping a heavier page — the budget exists because paid traffic lands on these pages and load time is money.
