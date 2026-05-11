# Reduce GSC "Page with redirect" Backlog — Design Spec

**Date:** 2026-05-11
**Status:** Draft, pending user approval
**Owner:** SEO / Infra

---

## Problem

Google Search Console flags **1,670 URLs** under "Page with redirect" status (first detected 2025-10-11, still ~unchanged 7 months later). All affected URLs follow the **old slug pattern** `{district}-{service-type}` (e.g., `/bagalkot-outstation-cab`). The site migrated to the new pattern `{service-type}-in-{district}` (e.g., `/outstation-cabs-in-bagalkot`) and `proxy.ts` (Next.js 16 middleware) 301-redirects old→new on every request.

The redirect chain works, but the GSC backlog isn't draining because:

1. **2-3 redirect hops per old URL** (apex→www→canonical, plus trailing-slash strip on some) — Google deprioritizes chained redirects in recrawl scheduling.
2. **`robots.ts` doesn't disallow the old pattern** — Google keeps re-discovering old URLs via external backlinks and re-queuing them.
3. **Every redirect costs a Next.js middleware invocation** (`proxy.ts` runs on Netlify Functions per request) — fine for correctness, but it's a moving part that could be replaced with static edge redirects.

Sitemap (`app/sitemap.ts`) is already clean ✅. Internal `<Link href>` audit returned zero old-pattern matches ✅. The fix is purely about telling Google to (a) stop discovering and (b) resolve known old URLs faster.

## Goals

1. **Cut the redirect chain to 1 hop** at Netlify's edge for the ~1,200 known old→new URL pairs.
2. **Stop Google from re-discovering** old-pattern URLs via `robots.ts` Disallow rules.
3. **Preserve `proxy.ts` as a fallback** for any edge cases the static rules miss (e.g., a new district added in code but redirects not yet regenerated).
4. **No regression** — every URL currently working must keep working; new-pattern URLs and unrelated paths must be untouched.

## Non-goals

- Changing Netlify primary-domain (apex vs www) configuration — out of code scope.
- Modifying `proxy.ts` migration logic itself — it works; keep it.
- Touching the 2,237 new-pattern URLs in the sitemap.
- Auditing internal links again (already done — clean).
- Requesting URL removal in GSC manually (will not scale to 1,670 URLs and is unnecessary once crawl/recrawl mechanics are fixed).

## Approach

Three additive changes, each isolated:

### 1. Static edge redirects via Next.js `redirects()` config

Define explicit (district × old-suffix) → new-URL pairs in `next.config.ts` using the `redirects()` async function. The Next.js Netlify adapter compiles these `permanent: true` static rules into edge-level entries in the generated `_redirects` file at deploy time — served from CDN, no function invocation, single hop.

**Why not a separate generator script:** Neither `tsx` nor `ts-node` is installed; adding a dev dep just to run a TS script is more complexity than necessary. Next.js's built-in mechanism reads `lib/districts.ts` natively at config-evaluation time and is the canonical way to declare site-wide redirects.

**Why explicit per-district rather than placeholder rules:** A placeholder rule like `/:district-outstation-cab → /outstation-cabs-in-:district` matches *any* prefix, including invalid ones — `/foobar-outstation-cab` would redirect to a 404. Explicit rules only fire on the 150 known districts, giving Google clean signals.

**Implementation shape (`next.config.ts`):**

```ts
import { ALL_DISTRICTS } from './lib/districts';

const OLD_SUFFIX_MAP: { suffix: string; newPrefix: string }[] = [
  { suffix: '-outstation-cab',  newPrefix: 'outstation-cabs-in-' },
  { suffix: '-outstation-cabs', newPrefix: 'outstation-cabs-in-' },
  { suffix: '-airport-taxi',    newPrefix: 'cab-service-in-' },
  { suffix: '-one-way-taxi',    newPrefix: 'one-way-taxi-in-' },
  { suffix: '-taxi-service',    newPrefix: 'taxi-service-in-' },
  { suffix: '-cab-service',     newPrefix: 'cab-service-in-' },
  { suffix: '-drop-taxi',       newPrefix: 'drop-taxi-in-' },
  { suffix: '-call-taxi',       newPrefix: 'call-taxi-in-' },
];

const nextConfig: NextConfig = {
  // ...existing config
  async redirects() {
    const rules = [];
    for (const d of ALL_DISTRICTS) {
      for (const { suffix, newPrefix } of OLD_SUFFIX_MAP) {
        rules.push({
          source: `/${d.slug}${suffix}`,
          destination: `/${newPrefix}${d.slug}`,
          permanent: true,
        });
      }
    }
    return rules;
  },
};
```

Trailing-slash variants are handled by Next.js automatically: with `trailingSlash: false` (default), `/foo/` 308s to `/foo` before redirect matching, so we only need the non-slash rule.

**Volume:** 229 districts × 8 = **1,832 rules** (the 229 comes from `ALL_DISTRICTS` which concatenates 150 district-level entries plus 79 Tamil Nadu sub-districts from `lib/tamil-nadu-sub-districts.ts`). Earlier draft of this spec said "1,200" assuming 150 districts; the loop naturally picks up everything `ALL_DISTRICTS` exports. Next.js builds these into the routes manifest in milliseconds; Netlify's `_redirects` file at the edge handles them with no measurable latency cost.

**Source of truth:** `lib/districts.ts` (already used by sitemap.ts, page generation, and proxy.ts via its own copy). The `OLD_SUFFIX_MAP` is duplicated from `proxy.ts` — acceptable because (a) both are tiny 8-entry tables, (b) extracting to a shared module is a separate refactor, (c) proxy.ts remains as fallback so drift is non-fatal. A follow-up commit may consolidate.

### 2. `robots.ts` Disallow patterns

Add a Disallow block for each old suffix using glob + end-anchor:

```
Disallow: /*-outstation-cab$
Disallow: /*-outstation-cab/$
Disallow: /*-airport-taxi$
Disallow: /*-airport-taxi/$
… (8 suffixes × 2 variants = 16 rules)
```

The leading `/*-` (literal `/` + wildcard + literal `-`) prevents matching the bare service hubs `/airport-taxi`, `/drop-taxi`, `/one-way-taxi`, `/outstation-cabs` (which have no `-` before the suffix). The trailing `$` end-anchor prevents matching paths like `/airport-taxi/chennai-airport`.

**User-agent application:** Per robots.txt precedence rules, a named-agent block (e.g., `User-agent: Googlebot`) overrides the wildcard (`User-agent: *`) block — if a named agent has its own rules, the wildcard ones are ignored for that agent. Today, the Googlebot/Bingbot/AI-crawler entries have only `allow: '/'` and no Disallow, so adding Disallow to just `*` would have zero effect on Google. **The Disallow list must be added to `*`, `Googlebot`, AND `Bingbot` blocks** (16 patterns × 3 blocks = 48 lines in the rendered robots.txt). AI-crawler blocks (`GPTBot`, `ClaudeBot`, etc.) are left untouched — these crawlers don't drive the GSC backlog and their per-agent overrides are deliberately open for GEO purposes.

**Effect:** Google stops crawling old-pattern URLs entirely on next robots.txt fetch (24-48h). External-backlink-induced re-discovery is shut off at the source.

**Trade-off and GSC reclassification:** Once Disallow is in effect, the 1,670 URLs currently classified as "Page with redirect" will gradually shift to "Excluded by robots.txt" in GSC as Google's recheck cycles fail to refetch them. End result is identical — neither status indexes the URL, the canonical new-pattern URL is what gets indexed via sitemap and internal links. The status label change may look concerning in the GSC UI; document this so the user isn't alarmed.

**Why not noindex on redirect responses:** A 301 response has no HTML body and can't carry a `<meta robots="noindex">`. The `X-Robots-Tag: noindex` header on a 3xx response is interpreted inconsistently by Google. Disallow is the cleanest signal for "don't recrawl these patterns".

### 3. `proxy.ts` fallback (no code change)

Keep `proxy.ts` exactly as is. It catches:
- Combinations where `_redirects` regeneration lags behind a new district added to `lib/districts.ts`.
- Any old-pattern URL not enumerated in the static rules (e.g., a typo'd legacy backlink).
- Aliased district slugs (handled in `app/[slug]/page.tsx`, not proxy.ts directly, but the chain still works).

No changes — it's defense-in-depth.

## Files

| File | Change |
|---|---|
| `next.config.ts` | EDIT — add `redirects()` async function returning ~1,832 explicit rules (229 districts × 8 suffixes), import `ALL_DISTRICTS` |
| `app/robots.ts` | EDIT — add 16 Disallow patterns under `*`, `Googlebot`, and `Bingbot` user agents |
| `proxy.ts` | UNCHANGED (fallback) |
| `app/sitemap.ts` | UNCHANGED |
| `package.json` | UNCHANGED (no new deps) |

## Verification

After deploy:

1. **Curl single-hop confirmation:** `curl -sI -L https://www.onewaytaxi.ai/bagalkot-outstation-cab` should show one 301 to `/outstation-cabs-in-bagalkot` then 200 — not two 301s.
2. **Apex still works:** `curl -sI -L https://onewaytaxi.ai/bagalkot-outstation-cab` should still resolve (may be 2 hops because of Netlify apex→www, that's outside our scope).
3. **`/robots.txt` audit:** Fetch `https://www.onewaytaxi.ai/robots.txt`, confirm Disallow rules appear under `User-agent: *`, `User-agent: Googlebot`, and `User-agent: Bingbot`.
4. **No new-pattern URL is disallowed:** `curl -sI https://www.onewaytaxi.ai/outstation-cabs-in-bagalkot` returns 200, not blocked.
5. **Hub pages untouched:** `/airport-taxi`, `/drop-taxi`, `/one-way-taxi`, `/outstation-cabs` all return 200.
6. **TypeScript build:** `npm run build` completes clean; build log shows 1,200 redirect rules registered.
7. **Spot-check** in `.next/routes-manifest.json` (generated by build) that 1,200 redirect entries are present and 10 random samples match `lib/districts.ts` × `OLD_SUFFIX_MAP`.
8. **`proxy.ts` defense-in-depth verification:** Hit a non-enumerated old-pattern URL (e.g., introduce a typo'd district), confirm proxy.ts still 301s.

**Expected GSC effect (over 4-8 weeks):**
- "Page with redirect" count steadily drops as Google deindexes old URLs that no longer get crawled.
- "Indexed" count for new-pattern URLs stable or growing.
- "Crawl stats" report shows reduced 3xx hits over time.

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Rule conflicts with a real page | All sources are `{district.slug}{old-suffix}` where every suffix begins with `-`; service hubs (`/drop-taxi`, `/airport-taxi`, etc.) have no `-` prefix so they can't be matched. Destinations all map to `{newPrefix}{district.slug}` which are guaranteed-generated by `app/[slug]/page.tsx`. |
| Disallow blocks a new-pattern URL | Each Disallow ends with one of the 8 old suffixes preceded by `*-`. New-pattern URLs (`/outstation-cabs-in-bagalkot`) end with a district slug, not a service suffix — cannot match. Verification step 4 confirms. |
| `next.config.ts` import path breaks on Windows | Use POSIX-style import (`./lib/districts`) which Node resolves on both platforms. |
| Future district added but rules not regenerated | Rules are computed at every `next build` from `ALL_DISTRICTS`. Adding a district to `lib/districts.ts` automatically adds 8 rules on next deploy. `proxy.ts` fallback catches any gap between deploys. |
| Next.js Netlify adapter doesn't compile rules to edge | Static rules with no `has`/`missing` conditions and `permanent: true` are documented to compile to `_redirects` at deploy time. Verification step 1 (curl single-hop) confirms; if it fails (2 hops still), the rules are working via function invocation — still correct, just slightly slower. |
| GSC reclassification confuses user | Documented above: "Page with redirect" → "Excluded by robots.txt" is expected and not a regression. |

## Out of scope (deferred)

- Removing `proxy.ts` entirely — keep as defense-in-depth. (`next.config.ts` `redirects()` covers known combos; `proxy.ts` covers everything else including aliases.)
- GSC "Validate fix" submission — manual GSC step the user can take post-deploy.
- Apex→www collapse to single hop — Netlify primary-domain config, not in repo.
- Consolidating `OLD_SUFFIX_MAP` into a shared module imported by both `next.config.ts` and `proxy.ts` — a small refactor; do it later if drift becomes a real issue.
