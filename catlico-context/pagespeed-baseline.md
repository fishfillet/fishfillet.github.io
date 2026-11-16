# PageSpeed baseline — R0

Captured 2026-11-17, before and after the `/img/` re-encode (commit `8e1332d`).

Method: Lighthouse 13.6.0, mobile emulation with default simulated slow-4G throttling,
performance category only, headless Chrome on a local machine, 3 runs per page, median
reported. The PageSpeed Insights API was quota-blocked (HTTP 429) on the day, so these are
local Lighthouse runs — the same engine PSI uses, but absolute scores run a little higher
than PSI's lab servers. Compare before/after against each other, not against PSI.

| Page | | Score (3 runs) | Median | FCP | LCP | TBT | CLS | Page weight |
|---|---|---|---|---|---|---|---|---|
| `/` | before | 97, 98, 97 | 97 | 1.7 s | 1.7 s | 132 ms | 0.016 | 3,322 KiB |
| `/` | after | 97, 99, 99 | **99** | 1.6 s | 1.6 s | 91 ms | 0.016 | **1,504 KiB** |
| `/better-bentonite/` | before | 52, 95, 95 | 95 | 1.6 s | 1.6 s | 117 ms | 0.101 | 1,714 KiB |
| `/better-bentonite/` | after | 93, 96, 96 | 96 | 1.7 s | 1.7 s | 85 ms | 0.101 | **1,367 KiB** |

`/img/` on disk: 27.3 MB → 4.5 MB (4,493,938 bytes).

## Notes

- Scores were already in the high 90s, so the score gain is small (+2 / +1) and close to
  run-to-run noise. The real change is transfer weight: −55% on `/`, −20% on `/better-bentonite/`.
- The 2 MB target for `/img/` was **not** reached. Step 3 requires unchanged pixel dimensions,
  and the photos are 6720×4480 (`black_cat1/2`), 3936×5904 (`main1`) and 4480×4480 (`pour`).
  They are already at the quality floor (mozjpeg q20, WebP q15) and total ~3.6 MB between them.
  Getting under 2 MB needs resizing — R3 replaces these pages anyway.
- `/better-bentonite/` still loads a 527 KiB `better-bentonite/img/pour.jpg`. That directory is
  outside `/img/` and was not in R0 scope.
- `/better-bentonite/` CLS is 0.101 (just over the 0.1 "good" threshold). Untouched in R0.
- Largest remaining requests on `/`: `black_cat1.webp` 307 K, `pour.jpg` 300 K, `bag.png` 128 K.
