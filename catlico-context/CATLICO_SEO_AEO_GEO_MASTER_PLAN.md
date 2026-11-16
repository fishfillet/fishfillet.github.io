# Catlico SEO + AEO + GEO Master Plan
## Instructions for Claude Code — catli.co

> **Generated:** 2026-07-15 (re-audited and corrected same day), after auditing the live `master` branch, the uncommitted `structure-revamp` working tree, and the existing docs: `AUDIT_REPORT_20260303.md` (repo root), `catlico-context/REVAMP_REPORT_20260303.md` (this folder), plus `../Catlico Claude/CATLICO_SEO_IMPLEMENTATION.md` and `../Catlico Claude/CATLICO_WEBSITE_STRUCTURE.md` (outside this repo, in the parent project folder).
>
> **Read this whole file before touching code.** It tells you what is actually live, what is sitting unshipped, and in what order to close the gap — then how to go further than any cat-care competitor in Indonesia currently does. Detailed schema code for the "bare minimum" layer already exists in `CATLICO_SEO_IMPLEMENTATION.md` — this doc references it rather than repeating it, and adds everything that document doesn't cover.

---

## OPEN DECISIONS — blocked on Dan, everything else is executable

Two items in this plan need a human decision before the Tier 0 merge. Everything else can be done autonomously. If running unattended, do all non-blocked work first, then stop and ask:

1. **Indonesian product URL slug** — keep `/id/produk/better-bentonite-cat-litter/` (as built) or switch to `/id/produk/pasir-kucing-bentonit/` (as the Feb 2026 audit recommended)? See Tier 0 §4.
2. **`Disallow: /special/` in robots.txt** — confirm the `/special/` landing pages should stay unindexed. See Tier 0 §2.

One item needs a browser check a crawler can't do: confirm the Shopee storefront URL before adding it to `sameAs` (Tier 2 §1).

---

## 0. SITUATION REPORT — read this first

**The single biggest SEO problem on catli.co right now is not a missing tag. It's that four and a half months of finished SEO work has never shipped.**

- `master` (what Google and every visitor sees today) is the *old* single-product landing page: `<title>Catlico - Cat-centric goods</title>`, a `meta name="keywords"` tag (dead weight, ignored by Google since ~2009), only 2 `hreflang` links and no `x-default`, **zero structured data** (no Organization, no Product schema), a jQuery image carousel, and no `/en/` or `/id/` content pages beyond the homepage pair.
- `structure-revamp` — the branch currently checked out in this working tree — is a full rebuild: proper title/meta, canonical tags, reciprocal hreflang with `x-default`, Organization schema, a real brand-hub homepage, and full `/en/` + `/id/` page trees (product, about, blog, contact, 404) with Product + HowTo + FAQPage JSON-LD on the product pages.
- This branch has **never been committed or merged**. `git log` shows `master`'s last real commit is about CTA link tracking; the revamp exists only as uncommitted + untracked changes in the working tree, dated 2026-03-03. A prior QA pass (`AUDIT_REPORT_20260303.md`) found 18+ CSS/HTML class mismatches that would have broken the site on deploy; `REVAMP_REPORT_20260303.md` claims those were fixed. A spot-check today confirms the specific classes checked now resolve correctly, but **do not trust that blindly** — re-run the full class cross-check in Section 1 before merging anything.

**Implication for priority order:** do not start writing new SEO content on top of a branch that might not deploy cleanly. Verify → merge → deploy → *then* layer on the advanced GEO/AEO work in Tier 2. Shipping the already-built revamp is worth more than any single new tactic below.

---

## TIER 0 — Ship what already exists (do this before anything else)

1. **Re-run the full CSS/HTML class audit.** Every class referenced in `index.html`, `id/index.html`, `en/**/*.html`, `id/**/*.html` must resolve in `css/main.css`. Write a small Python script that extracts every `class="..."` value from the HTML files and every selector from the CSS and diffs them — don't eyeball it, that's what caused the March 3 failure. Zero mismatches is the bar.
2. **Fix `robots.txt` before merge.** Three issues in the current working-tree file:
   - `Allow: /better-bentonite/` is stale — that directory was deleted and moved to `special/better-bentonite-landing/` during the revamp. Remove it.
   - `Disallow: /better-bentonite/test-*.html` is stale for the same reason. Remove it.
   - `Disallow: /*.js$` blocks crawlers from fetching JS files. Google explicitly recommends *not* blocking JS/CSS because it needs them to render pages. The site is mostly static HTML so the damage is limited, but there's no upside — remove it (`Disallow: /test-*.html` already covers the test files this was probably meant to hide). Also note `Allow: /` makes `Allow: /id/` redundant; harmless, but drop it for cleanliness.
   - **[ASK DAN]** Confirm `Disallow: /special/` is intentional (it looks like paid-traffic-only landing pages that shouldn't be indexed as organic content — confirm, don't assume).
3. **Update `sitemap.xml`.** It currently lists only 2 URLs (EN + ID homepage). The revamp adds 8 more real pages — `/en/products/better-bentonite-cat-litter/`, `/id/produk/better-bentonite-cat-litter/`, `/en/about/`, `/id/tentang-kami/`, `/en/blog/`, `/id/blog/`, `/en/contact/`, `/id/hubungi-kami/` — none are in the sitemap. Target: 10 URLs total. Do **not** add `404.html` or anything under `/special/`. Also add `<lastmod>`, `<changefreq>`, `<priority>` per the format in `CATLICO_SEO_IMPLEMENTATION.md` §5. If stub pages get `noindex` per item 5 below, leave them out of the sitemap until they carry real content (a sitemap URL that's noindexed sends mixed signals).
4. **[ASK DAN] Decide the Indonesian product URL slug.** The revamp ships `/id/produk/better-bentonite-cat-litter/` — the English product name in the Indonesian URL. The original Feb 2026 audit recommended `/id/produk/pasir-kucing-bentonit/`. Both are defensible (product name as a proper noun vs. localized keyword slug) but this is a real decision, not an oversight — ask before merge, since changing a URL after indexing costs a redirect and some link equity.
5. **Fill the About and Blog stub pages before merge, or noindex them.** Right now `/en/about/`, `/id/tentang-kami/`, `/en/blog/`, `/id/blog/` are placeholder "stub" pages per the revamp report. A thin/placeholder page that gets indexed with no real content is worse for SEO than a page that doesn't exist yet. Either write real content for About now (the brand story exists in `CATLICO_BRAND_GUIDE.md` and the Brand Guideline PDF — there's enough material to write it today) or add `<meta name="robots" content="noindex, follow">` to the stub pages until content is ready.
6. **Merge to `master`, commit, deploy, then verify live.** Run every test in `CATLICO_SEO_IMPLEMENTATION.md` Section 15 against the *live* `https://www.catli.co/` — not the local working tree — once deployed.

---

## TIER 1 — Bare-minimum SEO/AEO/GEO checklist (verify, don't assume)

This tier is "does the site meet 2026 baseline best practice." Full implementation code for each item already lives in `CATLICO_SEO_IMPLEMENTATION.md` — this is the verification checklist. Check off each one against the *live* site after Tier 0 ships.

| # | Item | Status found today | Action |
|---|---|---|---|
| 1 | Unique, keyword-rich `<title>` + meta description per page, per language | Done on `structure-revamp`, missing on `master` | Ships with Tier 0 merge |
| 2 | Reciprocal `hreflang` (en / id / x-default) on every page | Done on `structure-revamp` | Verify on all 9 pages post-merge, not just homepage |
| 3 | Self-referential canonical tag on every page | Done on `structure-revamp` | Verify |
| 4 | `<html lang="en">` / `lang="id">` correct per page | Done | Verify |
| 5 | Organization schema (homepage) | Present but minimal — see Tier 2 §1 to strengthen | Upgrade, don't just verify |
| 6 | Product + FAQPage schema (product pages) | Present (22 `@type` occurrences = multiple schema blocks on EN product page) | Validate with Rich Results Test after merge |
| 7 | Exactly one `<h1>` per page, containing primary keyword | Appears correct | Verify programmatically |
| 8 | Visible, crawlable language switcher (`<a>` tags, not JS) | Done | Verify |
| 9 | Image alt text coverage | Effectively 100% — the only "missing alt" images found in an automated scan are 1×1 Facebook pixel tracking images, which correctly have no alt | No action needed |
| 10 | WebP images with fallback | Done via `<picture>` | No action needed |
| 11 | XML sitemap with hreflang annotations, submitted to GSC | Sitemap incomplete (see Tier 0 §3) | Fix, then submit/resubmit in Search Console |
| 12 | robots.txt correctness | Stale entry (see Tier 0 §2) | Fix |
| 13 | Page speed (Core Web Vitals, mobile ≥85) | Not tested this session — revamp removed jQuery/carousel which should help LCP | Run PageSpeed Insights on live URLs after deploy, record baseline |
| 14 | FAQ content visible in HTML (not JS-only accordion) | Done (`<details>/<summary>`) | No action needed |
| 15 | Internal linking between blog ↔ product ↔ homepage | Not yet possible — no blog content exists | Blocked on Tier 2 content work |

---

## TIER 2 — Go a couple notches up: make Catlico the most AI/search-optimized cat care brand in Indonesia

**Why this is achievable:** a competitive scan of Indonesian bentonite/tofu cat litter brands (FOCAT, Arthacat, Markotop, and others) found marketplace listings (Tokopedia/Shopee/Lazada product pages) and third-party review roundups (mybest, Hello Sehat) — but no dedicated brand website with structured data, bilingual architecture, or educational content clusters. The bar in this category is low. Everything below is what separates "technically correct SEO" from actually winning AI-driven discovery (ChatGPT, Perplexity, Gemini, Google AI Overviews) and organic search simultaneously.

### 1. Strengthen Organization schema into a real entity graph

The current Organization schema has `name`, `url`, `logo`, `description`, a `contactPoint` (hello@catli.co), and one `sameAs` (Instagram). Expand it — this is what lets Google's Knowledge Graph and AI models understand Catlico is a real, verifiable business, not just a webpage:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Catlico",
  "legalName": "PT Kucing Setia Abadi",
  "url": "https://www.catli.co/",
  "logo": "https://www.catli.co/img/logo.svg",
  "description": "Indonesia's cat-centric brand — thoughtful, natural cat care products for cat parents.",
  "foundingLocation": { "@type": "Place", "name": "Indonesia" },
  "areaServed": { "@type": "Country", "name": "Indonesia" },
  "availableLanguage": ["English", "Indonesian"],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "hello@catli.co",
    "contactType": "customer service",
    "availableLanguage": ["English", "Indonesian"]
  },
  "sameAs": [
    "https://www.instagram.com/cat.li.co/",
    "https://www.tokopedia.com/catlico",
    "https://shopee.co.id/catlico"
  ]
}
```

`sameAs` linking to active, high-authority marketplace profiles is one of the cheapest entity-trust signals available and it's currently unused. **But verify the storefront URLs before adding them** — the site's CTAs contain *product* URLs, not storefront URLs. What we know from the CTAs: the Tokopedia store slug is `catlico` (product URL is `tokopedia.com/catlico/catlico-better-bentonite-...`), so `https://www.tokopedia.com/catlico` should be correct. The Shopee shop ID is `1038262482` (from the product URL `...-i.1038262482.20082325306`), but `https://shopee.co.id/catlico` is a *guess* at the shop username — Shopee is JS-walled to crawlers, so open both URLs in a real browser and confirm they resolve to Catlico's storefronts before shipping them in `sameAs`. A `sameAs` pointing at a 404 or someone else's shop is worse than none.

### 2. Turn the unused product video into a GEO asset

There's an untouched file at `Catlico Claude/Better Bentonite Cat Litter Performance Review (2).mov`. Right now it's dead weight on a hard drive. Video transcripts are heavily mined by AI answer engines because they're long-form, first-person, and naturally citable ("in this test, the litter clumped within X seconds"). Upload it to YouTube (owned, indexable, embeddable), then:

- Embed it on the product page with `VideoObject` schema (`name`, `description`, `uploadDate`, `thumbnailUrl`, `contentUrl`/`embedUrl`, `duration`).
- Get a written transcript on the page itself (not just in the video) — this is the part AI crawlers actually read. Structure it as a labeled Q&A or step-by-step ("Performance test: does it clump instantly?" → answer) rather than a raw transcript dump.
- This single asset can seed several FAQ answers and a full blog article ("We Tested Catlico's Clumping Speed and Odor Control — Here's What Happened").

### 3. Build the topical authority content the competition doesn't have

The blog is currently an empty stub in both languages. This is the highest-leverage gap — no amount of schema fixes a site with zero educational content behind it. Competitors' web presence is entirely marketplace listings and third-party roundups; nobody owns "pasir kucing" education in Bahasa Indonesia the way, say, World's Best Cat Litter or Purina own it in English. Build a pillar-cluster structure:

**Pillar page:** `/id/blog/panduan-pasir-kucing/` ("Panduan Lengkap Pasir Kucing") + EN equivalent — the comprehensive hub page that internally links to every cluster article below and that you build backlinks toward.

**Cluster articles (write ID-native, not translated — see `CATLICO_SEO_IMPLEMENTATION.md` §7 on why machine-translation is penalized):**
- Pasir kucing tanpa pewangi vs pewangi — mana yang lebih aman?
- Pasir kucing bentonit vs tofu: perbandingan lengkap
- Cara memilih pasir kucing untuk litter box otomatis (Litter Robot, PETKIT, dll.)
- Pasir kucing untuk anak kucing / kucing sensitif — apa yang perlu diperhatikan?
- Berapa kali harus mengganti pasir kucing?
- We Tested Catlico's Clumping Speed — video-derived article from item 2 above
- "We Asked ChatGPT About Natural Cat Litter" — per the AI-engagement play already scoped in `CATLICO_SEO_IMPLEMENTATION.md` §11.3, now backed by real product-test data instead of being a standalone gimmick

Every article needs: a direct-answer first sentence under each H2 (AEO extractability), a visible FAQ block with matching FAQPage schema, and 2+ internal links to the product page and to other cluster articles once they exist.

### 4. Add the schema types the current implementation doesn't cover

- **BreadcrumbList** on every non-homepage page (Home > Blog > Article, Home > Produk). Cheap to add, gives Google an extra rich-result surface and helps AI models understand site hierarchy.
- **VideoObject** — see item 2.
- **Review / AggregateRating** on the Product schema once real review data is pulled from Shopee/Tokopedia (both marketplaces show star ratings publicly — get permission to quote review counts/averages, or collect first-party reviews via a simple form). Products with visible ratings are dramatically more likely to be surfaced in AI shopping answers and Google Shopping-style rich results.
- **WebSite schema with `SearchAction`** on the homepage if/when on-site search exists — low priority, note for later.

### 5. Ship an `llms.txt` and explicitly allow AI crawlers

As of 2026 no major AI lab has confirmed production use of `llms.txt`, but it costs almost nothing to add, Google Lighthouse now audits for it under "Agentic Browsing," and it future-proofs the site. Create `/llms.txt`:

```markdown
# Catlico

> Indonesia's cat-centric brand. We make thoughtful, natural cat care products,
> starting with Better Bentonite Cat Litter — 100% natural, unscented bentonite
> clay litter compatible with automatic litter boxes.

## Products
- [Better Bentonite Cat Litter (EN)](https://www.catli.co/en/products/better-bentonite-cat-litter/): 100% natural, unscented, dust-minimized bentonite cat litter.
- [Pasir Kucing Bentonit (ID)](https://www.catli.co/id/produk/better-bentonite-cat-litter/): Versi Bahasa Indonesia.

## Company
- [About Catlico](https://www.catli.co/en/about/)
- [Contact](https://www.catli.co/en/contact/)

## Guides
- [Cat litter and cat care guides](https://www.catli.co/en/blog/)
```

Also confirm `robots.txt` explicitly allows the crawlers that power AI answers rather than staying silent (silence usually means allowed, but explicit is safer and self-documenting):

```
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /
```

### 6. E-E-A-T signals for a DTC brand with no physical storefront

AI models and Google both weight "who is behind this claim" heavily for health/safety-adjacent products (cat litter touches pet health claims). Add:
- A real About page (Tier 0 §5) with founding story, not a stub.
- "Written by the Catlico team" author lines on every blog article, ideally naming a real person once comfortable.
- If there's any veterinary or animal-care advisor relationship, even informal, a quoted line from them on the product page or a safety-focused article is one of the highest-lift GEO tactics available (research shows expert quotes measurably increase AI citation rate).

### 7. Monitor AI visibility monthly, not just Google Search Console

Add a recurring check (this can be a Cowork scheduled task) asking ChatGPT, Perplexity, and Google AI Overviews variations of "pasir kucing bentonit alami terbaik di Indonesia" / "best natural cat litter Indonesia" and logging whether Catlico is cited, and who is cited instead. `CATLICO_SEO_IMPLEMENTATION.md` §15.3 already scopes the manual version of this — turn it into a monthly habit, not a one-time test.

### 8. IndexNow for faster discovery

GitHub Pages hosting means no server-side control over IndexNow pinging, but a lightweight client-side or GitHub Actions step can ping the IndexNow API (Bing + it feeds Bing Copilot) whenever a new blog article publishes, instead of waiting for the next crawl cycle.

---

## VERIFICATION — before calling any of this done

1. Run the class cross-check script (Tier 0 §1) — zero mismatches.
2. Run every bash test in `CATLICO_SEO_IMPLEMENTATION.md` §15.1 against the **live** domain post-deploy. **Caveat:** §15.1 tests 9–10 expect canonical `https://www.catli.co/en/` — that doc predates the final architecture, where the English homepage lives at the root (`/`), not `/en/`. The correct expected canonical for the homepage is `https://www.catli.co/`. Adjust the expectation, not the site.
3. Validate every page with Google's Rich Results Test (`https://search.google.com/test/rich-results`) — homepage (Organization), product pages (Product + FAQPage + HowTo + BreadcrumbList once added), any article (FAQPage if present).
4. Confirm the sitemap in GSC shows "Success" with the corrected URL count (10 URLs if stubs are included, fewer if stubs are noindexed and held back — see Tier 0 §3/§5; either way, not 2).
5. Re-run the manual AI-citation check (Tier 2 §7) once new content ships, and again 30 days later to see movement.
6. Read `AUDIT_REPORT_20260303.md` (repo root) before merging anything — it's the exact list of what broke last time. Don't repeat those specific mistakes.

---

## PRIORITY ORDER (do not skip ahead)

1. Tier 0, items 1–6, in order — get the finished work actually live.
2. Tier 1 verification against the live site.
3. Tier 2 §1 (entity schema) and §5 (llms.txt / crawler access) — cheap, fast, no content dependency.
4. Tier 2 §4 (BreadcrumbList) — cheap, fast.
5. Tier 2 §2 (video asset) — one existing asset, high leverage.
6. Tier 2 §3 (content clusters) — the real, ongoing work. Start with the pillar page + 2 cluster articles, not all 7 at once.
7. Tier 2 §6 (E-E-A-T / About page) — pairs with Tier 0 §5.
8. Tier 2 §7–8 (monitoring, IndexNow) — set up once, then ongoing.

---

*Cross-references (exact paths, relative to repo root): `../Catlico Claude/CATLICO_SEO_IMPLEMENTATION.md` — outside the repo, in the parent project folder (schema code, meta tag copy, keyword tables); `../Catlico Claude/CATLICO_WEBSITE_STRUCTURE.md` — same location (page-by-page layout spec); `AUDIT_REPORT_20260303.md` — repo root (what broke last time); `catlico-context/REVAMP_REPORT_20260303.md` — this folder (what's already built and what's explicitly deferred). If working in an environment without access to the parent folder, ask Dan for the two `Catlico Claude` docs before starting.*
