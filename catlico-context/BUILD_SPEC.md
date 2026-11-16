# catli.co — Build Spec

**For Claude Code.** Supersedes `CATLICO_SEO_AEO_GEO_MASTER_PLAN.md` where they conflict.
Written 2026-09-17. Decisions in this file were made by Dan and are settled — do not relitigate them.

Companion: `DESIGN_BRIEF.md` (Claude Design handoff). R1 must be complete and approved before R2 starts.

---

## 0. Settled decisions

| Decision | Ruling |
|---|---|
| Subdomains per SKU | **No.** Subdirectories. `catli.co/products/noodor/`, never `noodor.catli.co`. |
| Language default | **English unprefixed at root** (brand layer). Indonesian complete tree under `/id/`. |
| Which language gets written first | **Indonesian**, for anything transactional or educational. English is the mirror. |
| Product URL slugs | **Product name, identical in both languages.** `better-bentonite`, `noodor`. Not translated category terms. |
| Content section | **One** section, `/id/artikel/`. Not two. Pillar guides are posts inside it. |
| Hosting | **Stay on GitHub Pages.** No migration. |
| Bundle SKU | **Does not exist.** No bundle page, no bundle LP. Revisit for offline/wholesale later. |
| Product claims | **Only what already appears on the Shopee or Tokopedia listing.** Invent nothing. |
| Marketplace review markup | Display as visible text. **Never** `AggregateRating` JSON-LD. See §6. |

### Why slugs use the product name

`/id/produk/pasir-kucing-bentonit/` was proposed and rejected. The product is called Better Bentonite; a URL promising a generic category and delivering a branded product is a mismatch for the customer, and it breaks the English-first brand layer. Keyword-in-URL is a very weak ranking signal — the Indonesian keywords belong in `<title>`, `<h1>`, and body copy, where they carry real weight.

### Why `/id/artikel/` and not `/panduan/`

`panduan` is a completely natural Indonesian word and is everywhere in Indonesian content — but it appears in *titles*, not as a section path. Indonesian brand sites conventionally use `/artikel/`, `/blog/` or `/tips/` for the section. So: the section is `/id/artikel/`, and `panduan` lives where it reads naturally — in the slug of an actual guide, e.g. `/id/artikel/panduan-lengkap-pasir-kucing/`.

Collapsing guides and blog into one section is the bigger win. Two content trees on a site with zero content today is overhead with no payoff; pillar-and-cluster works fine inside one section.

---

## 1. Current live state — read before touching anything

The deployed site is `master`, which is fully pushed to `origin`. Live URLs today:

```
/                                       old EN single-product page
/id/                                    old ID page
/better-bentonite/                      old product landing page
/special/20off/                         campaign page
/special/20off/syarat-dan-ketentuan/
/special/better-bentonite-landing/      campaign page
```

The working tree is **not** clean. Branch `structure-revamp` holds an entire unshipped site rebuild from 2026-03-03: three modified tracked files (`index.html`, `id/index.html`, `css/main.css` — ~1,200 lines added), a deleted `better-bentonite/` directory, and eight untracked paths (`en/`, `id/produk/`, `id/tentang-kami/`, `id/hubungi-kami/`, `id/blog/`, `404.html`, `catlico-context/`, `.claude/`). None of it has ever been committed.

**That work is being retired, not shipped** — Dan has chosen a fresh rebuild. But it is not worthless: the Indonesian copy, FAQ answers and JSON-LD blocks are the best starting material available. Preserve before you clean. See R0.

---

## 2. URL map

```
ENGLISH — brand layer, unprefixed
/                                          homepage, both SKUs        x-default
/products/
/products/better-bentonite/
/products/noodor/
/where-to-buy/
/about/
/contact/                                  doubles as reseller / wholesale enquiry

INDONESIAN — commercial + search workhorse
/id/
/id/produk/
/id/produk/better-bentonite/
/id/produk/noodor/
/id/beli/
/id/tentang-kami/
/id/hubungi-kami/
/id/artikel/                               single content section
/id/artikel/panduan-lengkap-pasir-kucing/  pillar → Better Bentonite
/id/artikel/panduan-bau-kucing/            pillar → noOdor
/id/artikel/<slug>/                        cluster articles

CAMPAIGN — noindex, paid traffic only, Indonesian
/lp/bentonit/
/lp/noodor/

MACHINE-FACING
/sitemap.xml   /robots.txt   /llms.txt   /404.html
```

Slug rules: lowercase, hyphen-separated, trailing slash everywhere, no underscores. Product slugs are identical across languages.

---

## 3. Release increments

Seven releases. **Each one deploys to production on its own and leaves the site working.** Do not batch them.

### The rule that makes this safe

> **New pages get new stylesheets. Do not touch `css/main.css` until the pages that depend on it are gone.**

The old homepage and the `/special/` campaign pages are live and converting. Every new page in R2 onwards loads `css/tokens.css` + `css/site.css` and nothing else. `css/main.css` stays byte-identical until R3 retires its last consumer. This is what allows new pages to ship alongside old ones with zero risk of a cascade collision breaking a page that is currently making money.

---

### R0 · Repo hygiene and safe wins
*No visual change. Deploys same day. Reversible.*

1. **Preserve the March work.** Commit the entire working tree to `structure-revamp` (`git add -A && git commit`), push it to origin. Do **not** merge to master. It becomes an archived reference branch.
2. **Return to a clean baseline.** `git checkout master`, confirm `git status` is clean, confirm the live site matches `master`.
3. **Optimise images in place.** Re-encode everything in `/img/` — same filenames, same pixel dimensions, same formats — so no HTML changes. `/img/` is currently 27 MB; `black_cat1.jpg` alone is 9.9 MB and `black_cat2.jpg` is 3.3 MB. Target under 2 MB total. Also regenerate the `.webp` twins. Commit separately from everything else so it can be reverted alone.
4. **Fix `robots.txt`.** Remove `Disallow: /*.js$` (blocks Google from rendering). Remove `Allow: /better-bentonite/` and `Disallow: /better-bentonite/test-*.html` once R3 retires that path — until then leave them. Keep `Disallow: /special/`; Dan has confirmed those are paid-traffic-only. Add explicit allows for `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`.
5. **Export the indexed-URL list from Search Console** and save it as `catlico-context/indexed-urls-baseline.txt`. This is the input to the R3 redirect map — without it you will orphan URLs you don't know are indexed.
6. **Record a PageSpeed baseline** for `/` and `/better-bentonite/` before and after step 3.

**Acceptance:** live site renders identically; PageSpeed mobile score improves measurably; GSC coverage unchanged after 7 days; `git status` clean.

---

### R1 · Design system
*Nothing deploys. Gated on Dan's approval.*

Claude Design produces `tokens.css` plus a component sheet and page comps. Full requirements in `DESIGN_BRIEF.md`.

**Blocking input:** the font decision (§7). Do not start until it is resolved.

**Acceptance:** Dan has approved the aesthetic direction in writing. `tokens.css` exists in the repo. No HTML written yet.

---

### R2 · Indonesian product pages
*Purely additive — every URL is new. Nothing existing is modified.*

Ship: `/id/produk/`, `/id/produk/better-bentonite/`, `/id/produk/noodor/`, `/id/beli/`.

- Written Indonesian-native, not translated. Harvest from `structure-revamp` where the copy is good.
- Claims limited to what appears on the live Shopee and Tokopedia listings (§6).
- `Product` JSON-LD on each SKU page. `BreadcrumbList` on all four. `FAQPage` matching visible `<details>/<summary>` content.
- `/id/beli/` carries every marketplace link with UTMs (§5) plus WhatsApp and any offline stockists.
- New stylesheets only. `css/main.css` untouched.
- No `hreflang` yet — the English counterparts don't exist. Self-referential canonical only.
- Add the four URLs to `sitemap.xml`.

**Acceptance:** old pages byte-identical (`git diff` proves it); four new URLs return 200; Rich Results Test passes on both SKU pages; zero broken links; LCP under 1.8 s on mobile.

**Rollback:** delete the four directories. Nothing else references them.

---

### R3 · Homepage swap and redirects
*The only release that modifies a page that currently ranks and converts.*

Ship: new `/` (English) and `/id/` (Indonesian) homepages, per the homepage spec in §4.

- Retire `/better-bentonite/`. GitHub Pages cannot issue 301s — it is a static host. Use a redirect stub at the old path: `<meta http-equiv="refresh" content="0; url=/products/better-bentonite/">` plus `<link rel="canonical">` to the destination plus a visible `<a>` for anyone whose refresh is blocked. Google treats this as a soft redirect; it works but takes longer to consolidate than a real 301. Write one stub per URL in `indexed-urls-baseline.txt` that no longer exists.
- Add `hreflang` triplets (`en`, `id`, `x-default` → `/`) to both homepages.
- `Organization` JSON-LD on `/` with `legalName: PT Kucing Setia Abadi`, `areaServed`, `availableLanguage`, and `sameAs` pointing at the verified storefronts in §5.
- Update `sitemap.xml`; resubmit in Search Console.
- `css/main.css` may now be retired *only* if `/special/` pages don't reference it. Check first — they probably do. If so, leave it.

**Deploy window:** low-traffic hour, Jakarta time. Not immediately before a campaign.
**Rollback:** single `git revert`, live within about a minute. Verify the revert renders before walking away.
**Watch for 7 days:** GSC coverage and impressions, Shopee/Tokopedia referral traffic, direct-traffic bounce rate.

**Acceptance:** both homepages pass Rich Results Test; every old indexed URL either resolves or has a working stub; no drop in marketplace referral clicks after 7 days.

---

### R4 · English mirror
*Additive.*

Ship: `/products/`, `/products/better-bentonite/`, `/products/noodor/`, `/about/`, `/contact/`, `/where-to-buy/`.

- Mirrors of the Indonesian pages. Brand voice English-first here — this is where the premium positioning does its work.
- Complete the `hreflang` triplets in **both** directions. Every Indonesian page gains its English alternate in the same commit. This is the one cross-cutting edit in the plan; do it in a single commit so the reciprocity is never half-applied.
- Deliberately **not** an English mirror of `/id/artikel/`.

**Acceptance:** every page's `hreflang` set is reciprocal and resolves (test programmatically, not by eye); `x-default` present on all; sitemap annotated.

---

### R5 · Ad landing pages
*Fully isolated. Cannot affect anything else.*

Ship: `/lp/bentonit/`, `/lp/noodor/`. Indonesian. No bundle page — the SKU doesn't exist.

- `<meta name="robots" content="noindex, nofollow">`. Excluded from `sitemap.xml`. Add `Disallow: /lp/` to `robots.txt`.
- **No site navigation.** One offer, one CTA. Every nav link is an exit path away from the buy button.
- Hardest performance target on the site: LCP under 1.5 s. Meta Pixel and Google Ads conversion tag load deferred, after first paint.
- Social proof above the fold (§6).
- Retire `/special/20off/` and `/special/better-bentonite-landing/` only after ads are repointed and the new pages are verified live.

**Acceptance:** `noindex` confirmed in the live response; LCP under 1.5 s on throttled 4G; Pixel and conversion tag both fire on a real click-through; ads repointed only after all three pass.

---

### R6 · Content engine
*Additive.*

Ship: `/id/artikel/` index, both pillar guides, three cluster articles.

- Indonesian-native. Do not machine-translate — thin or translated Indonesian gets read as low-quality duplicate content and can drag the domain.
- Every article: direct-answer first sentence under each `<h2>`, a visible FAQ block with matching `FAQPage` schema, real HTML comparison tables (never images of tables), and at least two internal links to a product page or another article.
- `BreadcrumbList` on every article.

**Acceptance:** each article passes Rich Results Test; internal link graph has no orphans; a fluent Indonesian read-through has happened.

---

### R7 · Enrichment
*Additive, no page structure changes.*

- `llms.txt` at root.
- The unused `Better Bentonite Cat Litter Performance Review (2).mov` (in the parent project folder): upload to YouTube, embed on `/id/produk/better-bentonite/` with `VideoObject` schema, and publish a written transcript on the page structured as labelled Q&A. The transcript is the part AI crawlers actually read.
- Expand the review section (§6).
- IndexNow ping via GitHub Actions on publish.
- Monthly AI-citation check as a scheduled task: ask ChatGPT, Perplexity and Google AI Overviews for `pasir kucing bentonit alami terbaik` and log whether Catlico is cited and who is cited instead.

---

## 4. Homepage spec

**Above the fold — must render with zero JavaScript:**

- Logo, nav, EN | ID switcher as plain `<a>` tags. Never a JS or IP redirect: Googlebot crawls from the US and would be bounced out of `/id/`, and it adds a render-blocking round trip to the page that most needs to be fast.
- One `<h1>`, live HTML text, never an image.
- One sentence of positioning.
- **Two SKU cards.** Better Bentonite first — it is the proven revenue engine; noOdor is framed as the companion product ("the spray that finishes the job the litter starts"). Equal visual weight would tell a first-time visitor they are equally proven, which isn't true yet.
- Each card carries two actions: a link to the product page for researchers, and a compact `Beli di: [Shopee] [Tokopedia] [WA]` row for people already decided.

**Below the fold — lazy, this is the SEO body:**

- "Yang mana yang saya butuhkan?" — a real HTML comparison table of the two SKUs. The most quotable block on the site for AI answer engines.
- Three brand pillars, roughly 120 words of real text.
- Social proof strip (§6).
- Brand story teaser → `/id/tentang-kami/`.
- Guides teaser → `/id/artikel/`.
- Footer: every marketplace link, WhatsApp, Instagram, email, reseller enquiry.

**The homepage is not an ad landing page.** Paid traffic goes to `/lp/`. Pointing a cold Meta audience at the homepage turns the two-card chooser into a decision the visitor didn't ask to make.

---

## 5. Marketplace links and UTMs

Verified storefront and product URLs:

```
Tokopedia store     https://www.tokopedia.com/catlico
Shopee store        https://shopee.co.id/catlico          (verify in a browser before using in sameAs)

Better Bentonite
  Shopee     https://shopee.co.id/Catlico-Better-Bentonite-Cat-litter-6L-Pasir-Kucing-Gumpal-Unscented-i.1038262482.20082325306
  Tokopedia  https://www.tokopedia.com/catlico/catlico-better-bentonite-cat-litter-6l-pasir-kucing-gumpal-unscented

noOdor 500ml
  Shopee     https://shopee.co.id/product/1038262482/57456762798/
  Tokopedia  https://www.tokopedia.com/catlico/catlico-noodor-spray-penghilang-bau-kucing-500ml-plant-based-pet-odor-eliminator-kencing-kotoran-pipis-anjing-litter-box-karpet-mobil-99-9-bunuh-bakteri-amonia-non-toxic-alami-1734528994201536235

WhatsApp   https://api.whatsapp.com/message/W2FFWU6ARBRKH1?autoload=1&app_absent=0
```

**Every outbound marketplace link carries UTMs**, consistently:

```
?utm_source=website&utm_medium=referral&utm_campaign=<page-slug>&utm_content=<placement>
```

e.g. `utm_campaign=produk-noodor&utm_content=hero-cta`. Also fire a GTM outbound-click event on every one.

Attribution goes dark the moment a visitor reaches Shopee — you cannot see which site visits became sales. UTMs plus the click event, reconciled against Shopee's own traffic-source report, is the only way to tell whether the site is earning its keep. Without this the whole rebuild is unmeasurable.

---

## 6. Reviews and social proof

### What is not possible

No live review feed. Shopee and Tokopedia require server-side OAuth for any review data, and GitHub Pages is a static host with no request-time logic. Scraping is JS-walled, fragile and against their terms. **Reviews are manually maintained.**

### What to display

1. **Aggregate stat as visible text.** e.g. `4.9 ★ · 2.300+ ulasan di Shopee & Tokopedia`, with a visible `Terakhir diperbarui: <date>` beside it so the number stays honest. Refresh quarterly.
2. **Individual reviews transcribed as real HTML text** — reviewer first name, marketplace, date — with the existing screenshots in `special/better-bentonite-landing/img/` (`testimony1`–`testimony8`, `testimonyWA`) alongside as supporting evidence. Transcribe them; do not ship them as images alone. **Text is citable by AI answer engines, screenshots are not.** This is the single biggest reason to do the transcription work.
3. **Link out** to the marketplace review page so the claim is checkable.

### What NOT to do

**Do not wrap marketplace-sourced ratings in `AggregateRating` JSON-LD.** Google's self-serving review rule makes review markup ineligible for star display when the ratings are about your own business and were collected elsewhere and republished on your own site. It is not a ranking penalty — the stars simply never appear — so the markup is pure downside risk for zero gain.

The legitimate route to review stars is first-party reviews collected on catli.co itself, moderated and published on-page. That is a later project, not part of this build.

### Placement

| Page | Placement |
|---|---|
| Homepage | Trust strip directly under the two SKU cards — aggregate stat only |
| Product pages | Dedicated section: aggregate stat + 4–6 transcribed reviews + outbound link |
| `/lp/` pages | **Above the fold.** Highest-value placement on the site — this is cold paid traffic with no brand trust yet |

---

## 7. Fonts — unresolved, blocks R1

The brand guideline specifies **Galano Grotesque**. The live site ships **Darker Grotesque** from Google Fonts, which is a different typeface. Dan has the Galano files.

Having the font file is not the same as having the right to serve it. Desktop licences (`.otf` for InDesign and Illustrator) very often exclude webfont embedding, which is licensed separately and usually priced by monthly pageviews. Before R1 concludes:

1. Find the original Galano Grotesque licence or purchase receipt and check whether it grants **webfont** rights.
2. If yes — self-host a subset `.woff2` (Latin, the weights actually used). Self-hosting is also the faster option: it removes two DNS lookups and a render-blocking stylesheet versus Google Fonts.
3. If no — either buy the webfont licence, or formally adopt Darker Grotesque as the web face and note the divergence in the brand guideline. Do not serve an unlicensed webfont.

Either way the font must be **self-hosted `.woff2` with `font-display: swap`** and explicit fallbacks. Do not keep the Google Fonts `<link>`.

---

## 8. Performance budget

Applies to the homepage and `/lp/` pages, throttled 4G mobile.

| Metric | Target |
|---|---|
| LCP | < 1.8 s homepage · **< 1.5 s on `/lp/`** |
| CLS | 0 — explicit `width`/`height` on every image, `font-display: swap` |
| HTML document | < 15 KB |
| Critical CSS | < 8 KB inlined, remainder deferred |
| JavaScript on homepage | **0 KB.** Delete jQuery (87 KB) and the testimonial carousel; CSS scroll-snap replaces it |
| `/img/` total | < 2 MB |
| Any single image | < 80 KB |
| Fonts | Self-hosted subset `.woff2` |

GTM and the Meta Pixel currently load **synchronously as the first thing in `<head>`**, before any product pixel is painted. Both must be deferred to after first paint. Verify the Pixel still fires reliably on `/lp/` pages after deferring — that is the one place where losing an event actually costs money.

---

## 9. Rules for every page

1. `<html lang="en">` or `<html lang="id">` matching the page.
2. Unique `<title>` and `<meta name="description">`, written natively in that language.
3. Self-referential `<link rel="canonical">`.
4. Reciprocal `hreflang` triplet where a counterpart exists (`en`, `id`, `x-default` → the English URL). Omit entirely rather than ship a one-way reference.
5. Exactly one `<h1>`, containing the primary keyword, as live HTML text.
6. Every `<img>` has real `alt` text and explicit `width`/`height`.
7. Every new page added to `sitemap.xml`, except `/lp/`, `/special/` and `404.html`.
8. FAQ content is visible HTML (`<details>/<summary>`) with matching `FAQPage` JSON-LD. Never a JS-only accordion.
9. `BreadcrumbList` on every non-homepage page.
10. Write for AI extractability: answer the question in the first sentence after a heading, keep sentences self-contained, use real HTML tables for comparisons.
11. Never publish a stub. Either real content or `<meta name="robots" content="noindex, follow">`.
12. Product claims come only from the live Shopee or Tokopedia listing.

### noOdor copy discipline

noOdor is PKRT-regulated. Website copy must match the registered label:

- Use **"4-Terpene Alcohol"** — matches the MSDS. Never "4-Terpene Essential Oil".
- **Never** any "alcohol-free" or "bebas alkohol" claim. Prohibited under Indonesian law even for plant-derived alcohols.
- No enzyme claims — there are no enzymes in the formula.

### Before merging anything that touches HTML or CSS

Run a class cross-check programmatically: every `class="..."` value in the HTML must resolve to a selector in the stylesheets that page loads. A previous revamp shipped 18+ mismatches that would have broken styling in production (`AUDIT_REPORT_20260303.md`). Zero mismatches is the bar. Script it — do not eyeball the diff.
