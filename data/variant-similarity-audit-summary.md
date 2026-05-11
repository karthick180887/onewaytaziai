# Variant Similarity Audit — Executive Summary

> See `data/variant-similarity-audit.md` for the raw matrices.
> Run: `node scripts/seo/audit-variant-similarity.mjs`

## Verdict

**Don't consolidate. Expand CITY_OVERRIDES coverage.**

No variant pair exceeds the 80% threshold that would trigger 301 consolidation. But the 70-74% band that most non-override pairs sit in is Google's "near-duplicate" zone — at risk of being deduped to one canonical per city.

The 6-URL variant strategy is structurally sound; it just needs more hand-tuned content per city.

## Evidence

| Combination | Similarity to sibling variants | Status |
|---|---:|---|
| Chennai × **drop-taxi** (has CITY_OVERRIDE) | 37-40% | ✅ Well-differentiated |
| Coimbatore × **taxi-service** (has CITY_OVERRIDE) | 37-39% | ✅ Well-differentiated |
| Every other city × service combo (1,372 of 1,374) | 70-74% | ⚠️  Marginal — risk of dedupe |

**Cross-city baseline** (template bleed signal): 51-55% similarity between cities for the same variant. This is the irreducible shared content (header, footer, fleet table, fare-table boilerplate). Overrides break through this and drop similarity to ~25-26%.

## Why this matters

Google's quality systems run a "duplicate content classifier" before ranking. Pages above ~75-80% similarity get a single canonical assignment — the others rank far lower or not at all. Pages in the 60-75% band get probabilistic treatment: usually all rank, but at suppressed positions, and the "main" variant takes most clicks.

For OneWayTaxi.ai today:
- The 2 cities with overrides will rank 6 distinct URLs effectively per city.
- The 227 cities without overrides will (in practice) see Google pick one canonical and bury the other 5.
- That's **~1,135 URLs of crawl budget being spent on pages that Google may not show in SERPs**.

## Recommendation

Add CITY_OVERRIDES for the top Tier-1 cities × top 2-3 variants. Math:

- Tier 1 cities: ~10 (Chennai, Bangalore, Coimbatore, Madurai, Hyderabad, Kochi, Trichy, Mysore, Tirupati, Salem)
- High-priority variants per city: 3 (drop-taxi, one-way-taxi, outstation-cabs — the 3 highest-search-volume per [keyword research from `report.md`])
- Result: ~30 hand-tuned overrides covering the highest-volume traffic

The CITY_OVERRIDES mechanism already exists (`lib/seo-content.ts:57-99`) — adding entries is a data-only edit, ~30-45 min each for the serviceDescription + customFaqs.

Not in scope right now: pick the top 30 to write. That's a content-prioritization decision needing keyword volume input.

## What's NOT recommended

- ❌ **301-consolidating variants.** Max pair similarity is 74.7% — below the 80% threshold. Consolidating would forfeit 6× the ranking opportunities per city for no upside.
- ❌ **Mass-template differentiation.** Changing the template would help on all 1,374 pages but is a major refactor (template logic is mature; risk-reward poor vs targeted overrides).
- ❌ **Adding noindex to 5 of 6 variants per city.** Same as consolidation but worse (no traffic recovery via 301).

## Tracking

Re-run the audit after every batch of new CITY_OVERRIDES additions:
```
node scripts/seo/audit-variant-similarity.mjs
```

Watch the average similarity per city drop below 60% as overrides accumulate. When a city's average reaches 50-55% (the template-bleed floor), all 6 variants are maximally differentiated.

## Also flagged in the audit (and fixed during this run)

Two more `115+ other cities` references in `lib/seo-content.ts` (auto-description templates for `taxi-service` and `call-taxi`) — caught during the audit's cross-page word-count comparison. Fixed in the same commit as the audit.
