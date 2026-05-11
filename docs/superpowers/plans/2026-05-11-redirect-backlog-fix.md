# GSC "Page with redirect" Backlog Fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cut the 2-3 hop redirect chain to 1 hop for ~1,200 known old→new URL pairs at Netlify's edge, and stop Google from re-discovering old-pattern URLs via `robots.ts` Disallow patterns.

**Architecture:** Two atomic config edits, no new dependencies, no test framework required (the project has none). Verification gate is `npm run build` succeeding plus inspection of the generated `.next/routes-manifest.json`. Spec lives at `docs/superpowers/specs/2026-05-11-redirect-backlog-fix-design.md`.

**Tech Stack:** Next.js 16, TypeScript, Netlify static-hosting adapter.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `next.config.ts` | MODIFY | Declare 1,200 explicit `permanent: true` redirects via async `redirects()` function. Source data from `lib/districts.ts` × an inline 8-entry `OLD_SUFFIX_MAP`. |
| `app/robots.ts` | MODIFY | Add 16 Disallow patterns (8 old suffixes × 2 slash-variants) under `*`, `Googlebot`, and `Bingbot` user-agent rules. |
| `proxy.ts` | NO CHANGE | Stays as fallback for combinations not in `next.config.ts` (alias resolution, future districts, typo'd backlinks). |
| `app/sitemap.ts` | NO CHANGE | Already clean (only new-pattern URLs). |
| `lib/districts.ts` | NO CHANGE | Source of truth, already exports `ALL_DISTRICTS`. |
| `package.json` | NO CHANGE | No new deps. |

Two atomic commits at the end of each task. Both files are small and self-contained.

---

## Task 1: Add `redirects()` to `next.config.ts`

**Files:**
- Modify: `next.config.ts` (entire file rewrite — it's currently 11 lines)

**Context for the engineer:**

The current `next.config.ts` is minimal:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

We will add an async `redirects()` method that returns 1,200 redirect rules. The data source is `ALL_DISTRICTS` from `./lib/districts.ts` (an exported array of 150 District objects, each with a `slug` field) crossed with an inline `OLD_SUFFIX_MAP` of 8 entries that mirrors `proxy.ts`. Each rule has `permanent: true` so Next.js emits a 301. The Next.js Netlify adapter compiles `permanent: true` rules with no `has`/`missing` conditions into edge-level `_redirects` entries at deploy time.

- [ ] **Step 1: Read current `next.config.ts` to confirm starting state**

Run: `cat next.config.ts` (or use the Read tool on `F:\Golaang\Golaang\Websites\onewaytaxi\next.config.ts`)
Expected: 11 lines, matching the snippet above. If different, STOP and report — the plan assumes this baseline.

- [ ] **Step 2: Replace `next.config.ts` with the new version**

Write the file with this exact content:

```ts
import type { NextConfig } from "next";
import { ALL_DISTRICTS } from "./lib/districts";

const OLD_SUFFIX_MAP: { suffix: string; newPrefix: string }[] = [
  { suffix: "-outstation-cab", newPrefix: "outstation-cabs-in-" },
  { suffix: "-outstation-cabs", newPrefix: "outstation-cabs-in-" },
  { suffix: "-airport-taxi", newPrefix: "cab-service-in-" },
  { suffix: "-one-way-taxi", newPrefix: "one-way-taxi-in-" },
  { suffix: "-taxi-service", newPrefix: "taxi-service-in-" },
  { suffix: "-cab-service", newPrefix: "cab-service-in-" },
  { suffix: "-drop-taxi", newPrefix: "drop-taxi-in-" },
  { suffix: "-call-taxi", newPrefix: "call-taxi-in-" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
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

export default nextConfig;
```

Note: this file is TypeScript and gets type-checked at build. `NextConfig` types the `redirects()` return value as `Promise<Redirect[]>`; the literal we push satisfies the `Redirect` interface (`source`, `destination`, `permanent`).

- [ ] **Step 3: TypeScript-check the config compiles**

Run: `npx tsc --noEmit --project tsconfig.json next.config.ts`

(If that fails with `next.config.ts` not in `tsconfig.json`'s `include` set — which is likely — fall back to:)

Run: `npx tsc --noEmit --strict next.config.ts`

Expected: no errors. If you see `Cannot find module './lib/districts'`, the import path is wrong — verify the path matches the actual filesystem casing.

- [ ] **Step 4: Run the production build**

Run: `npm run build`

Expected: build completes with no errors. Look for a line in the build output that confirms `redirects` are registered — Next.js logs something like `info  - using redirects function` or includes the count in the routes manifest summary. The build may take 3-5 minutes given the 2,237 SSG pages.

If the build fails:
- TypeScript error in `next.config.ts` → fix the type or import
- Runtime error during `redirects()` evaluation → likely `ALL_DISTRICTS` import path issue or a malformed rule
- Out-of-memory → the existing SSG build is already heavy; redirects add negligible overhead, so this is unlikely

- [ ] **Step 5: Verify routes-manifest contains 1,200 redirects**

Run (PowerShell): `(Get-Content .next\routes-manifest.json -Raw | ConvertFrom-Json).redirects.Count`
Or (Bash): `node -e "console.log(require('./.next/routes-manifest.json').redirects.length)"`

Expected: a number ≥ 1,200 (exactly 1,200 from us, plus any Next.js auto-generated trailing-slash redirects — could be 1,200-2,500).

- [ ] **Step 6: Spot-check 3 sample rules**

Run (Bash): `node -e "const r=require('./.next/routes-manifest.json').redirects; console.log(r.filter(x => x.source.endsWith('-outstation-cab')).slice(0,3))"`

Expected: 3 entries, each with `source: '/<some-district>-outstation-cab'`, `destination: '/outstation-cabs-in-<same-district>'`, `statusCode: 308` or `permanent: true`. The destinations must be valid existing pages — spot-pick one district slug and confirm `app/[slug]/page.tsx` can render it (`grep '"<slug>"' lib/districts.ts`).

- [ ] **Step 7: Commit**

```powershell
git add next.config.ts
git commit -m "feat(seo): add 1,200 explicit old→new URL redirects in next.config.ts

Collapses the 2-3 hop redirect chain (apex→www→proxy.ts) to a single
301 at Netlify's edge for known (district × old-suffix) pairs.
proxy.ts remains as fallback. Refs spec at
docs/superpowers/specs/2026-05-11-redirect-backlog-fix-design.md.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

Expected: clean commit, no pre-commit hook complaints. If a hook fails (eslint, tsc), fix the issue and create a NEW commit — do NOT use `--amend` (see global guidance on hook failures).

---

## Task 2: Add Disallow patterns to `app/robots.ts`

**Files:**
- Modify: `app/robots.ts` (current file is 47 lines; we add 3 `disallow` arrays)

**Context for the engineer:**

Current `app/robots.ts` uses Next.js's `MetadataRoute.Robots` API. It has separate `userAgent` rules for `*`, `Googlebot`, `Bingbot`, and AI crawlers. Only the `*` rule has any `disallow` (just `/api/` and `/_next/`); named agents have only `allow: '/'`.

**Critical robots.txt precedence rule:** when a named user-agent block exists, it OVERRIDES the wildcard `*` block for that agent. So adding Disallow only to `*` would have ZERO effect on Googlebot or Bingbot. We must add the Disallow list to all three blocks. AI crawler blocks are left alone — they're deliberately open for GEO and not the source of the GSC backlog.

The 16 patterns (8 old suffixes × 2 trailing-slash variants) are constructed once and reused by all three user-agent blocks.

- [ ] **Step 1: Read current `app/robots.ts` to confirm starting state**

Use the Read tool on `F:\Golaang\Golaang\Websites\onewaytaxi\app\robots.ts`.

Expected: 47 lines, with rules for `*`, `Googlebot`, `Bingbot`, `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `PerplexityBot`, `Bytespider`. The `*` rule has `disallow: ['/api/', '/_next/']`. Named agents have only `allow: '/'`.

- [ ] **Step 2: Replace `app/robots.ts` with the new version**

Write the file with this exact content:

```ts
import type { MetadataRoute } from 'next';

const OLD_PATTERN_DISALLOW = [
    '/*-outstation-cab$',
    '/*-outstation-cab/$',
    '/*-outstation-cabs$',
    '/*-outstation-cabs/$',
    '/*-airport-taxi$',
    '/*-airport-taxi/$',
    '/*-one-way-taxi$',
    '/*-one-way-taxi/$',
    '/*-taxi-service$',
    '/*-taxi-service/$',
    '/*-cab-service$',
    '/*-cab-service/$',
    '/*-drop-taxi$',
    '/*-drop-taxi/$',
    '/*-call-taxi$',
    '/*-call-taxi/$',
];

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/_next/', ...OLD_PATTERN_DISALLOW],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: OLD_PATTERN_DISALLOW,
            },
            {
                userAgent: 'Bingbot',
                allow: '/',
                disallow: OLD_PATTERN_DISALLOW,
            },
            // Allow AI crawlers for GEO (Generative Engine Optimization) — no disallow.
            {
                userAgent: 'GPTBot',
                allow: '/',
            },
            {
                userAgent: 'OAI-SearchBot',
                allow: '/',
            },
            {
                userAgent: 'ChatGPT-User',
                allow: '/',
            },
            {
                userAgent: 'ClaudeBot',
                allow: '/',
            },
            {
                userAgent: 'PerplexityBot',
                allow: '/',
            },
            {
                userAgent: 'Bytespider',
                allow: '/',
            },
        ],
        sitemap: 'https://onewaytaxi.ai/sitemap.xml',
    };
}
```

Note on the patterns: `/*-outstation-cab$` reads as:
- `/` — literal leading slash
- `*` — wildcard (any characters)
- `-outstation-cab` — literal text including the leading hyphen
- `$` — end-of-URL anchor (Google supports this)

The leading `-` requirement means `/outstation-cab` (no hyphen prefix) won't match. The trailing `$` means `/outstation-cab/anything` won't match either. Hub paths like `/drop-taxi` are safe.

Note: `/*-outstation-cab/$` matches a URL that has the old suffix AND ends with a trailing slash. We include this because some external backlinks have trailing slashes and Google sees them as distinct.

- [ ] **Step 3: Run the production build to confirm `robots.ts` compiles**

Run: `npm run build`

Expected: build completes. The `robots.ts` is small and pure-data; failure would only happen on a type error in the `MetadataRoute.Robots` shape.

- [ ] **Step 4: Render and inspect the robots.txt output**

The build doesn't pre-render `robots.txt` to a static file (it's served by the Next.js runtime). To verify locally:

Run (in one terminal): `npm run start`
Run (in another terminal): `curl -s http://localhost:3000/robots.txt`

Expected output (excerpt):

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /*-outstation-cab$
Disallow: /*-outstation-cab/$
... (14 more)

User-agent: Googlebot
Allow: /
Disallow: /*-outstation-cab$
... (15 more)

User-agent: Bingbot
Allow: /
Disallow: /*-outstation-cab$
... (15 more)

User-agent: GPTBot
Allow: /

... (other AI crawlers, no Disallow)

Sitemap: https://onewaytaxi.ai/sitemap.xml
```

Confirm by counting (Bash): `curl -s http://localhost:3000/robots.txt | grep -c 'Disallow: /\*-'`
Expected: 48 (16 patterns × 3 user-agent blocks).

If `curl` fails because Windows `curl.exe` is the unhelpful version, use PowerShell: `(Invoke-WebRequest http://localhost:3000/robots.txt).Content`.

Stop the `npm run start` process when done.

- [ ] **Step 5: Sanity-check that no real page is blocked**

For each of these URLs, use the Google robots.txt tester logic mentally (or actually run the local server and test):

- `/outstation-cabs-in-bagalkot` — must NOT match any Disallow (ends in district slug, not in suffix)
- `/drop-taxi` — must NOT match (no hyphen before `-drop-taxi`; actually the URL IS `/drop-taxi` so the `/*-drop-taxi$` pattern needs a char-then-hyphen before `-drop-taxi`. With wildcard matching, `*` can match zero chars... let me verify: the pattern is `/*-drop-taxi$`. For `/drop-taxi` to match, the literal segment must be `/` + `*` + `-drop-taxi`. The `*` could match empty, but then the URL would need to be `/-drop-taxi`. Since the URL is `/drop-taxi` (no hyphen after the slash), it does NOT match.) — must NOT match
- `/airport-taxi/chennai-airport` — must NOT match (ends in `chennai-airport`, not `-airport-taxi$`)
- `/airport-taxi` — must NOT match (same reasoning as `/drop-taxi`)
- `/bagalkot-outstation-cab` — MUST match (this is the desired effect)
- `/bagalkot-outstation-cab/` — MUST match
- `/route/chennai-to-bangalore-taxi` — must NOT match (ends in `-taxi` not `-taxi-service`)

If any check fails the expectation, STOP and report. The patterns may need adjustment.

- [ ] **Step 6: Commit**

```powershell
git add app/robots.ts
git commit -m "feat(seo): disallow old-pattern URLs in robots.txt for major crawlers

Stops Google/Bing from re-discovering legacy {district}-{service-type}
URLs via external backlinks. Pattern repeated under *, Googlebot, and
Bingbot blocks because named-agent rules override the wildcard.
AI crawlers left open for GEO. Refs spec at
docs/superpowers/specs/2026-05-11-redirect-backlog-fix-design.md.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Post-deploy verification (manual, after the user merges and Netlify deploys)

This task is NOT executed in the worktree — it runs against production after deploy. List it in the plan so the user has the checklist.

- [ ] **Step 1: Curl a known old URL on www, confirm single-hop**

Run: `curl -sI -L https://www.onewaytaxi.ai/bagalkot-outstation-cab | grep -iE '^HTTP|^Location:'`

Expected:
```
HTTP/1.1 301 Moved Permanently
Location: /outstation-cabs-in-bagalkot
HTTP/1.1 200 OK
```

(One 301, not two. If you still see two 301s, the Netlify adapter didn't promote the rule to edge — investigate `.next/routes-manifest.json` and Netlify deploy logs.)

- [ ] **Step 2: Curl the new-pattern URL, confirm 200**

Run: `curl -sI https://www.onewaytaxi.ai/outstation-cabs-in-bagalkot | grep -i '^HTTP'`
Expected: `HTTP/1.1 200 OK`

- [ ] **Step 3: Curl each service hub, confirm 200**

Run: `for p in drop-taxi one-way-taxi outstation-cabs airport-taxi round-trip-taxi; do echo "/$p"; curl -sI "https://www.onewaytaxi.ai/$p" | grep -i '^HTTP'; done`
Expected: all five return `200 OK`. (Confirms the Disallow patterns don't match the hubs and the redirects don't accidentally fire on them.)

- [ ] **Step 4: Fetch robots.txt from production**

Run: `curl -s https://www.onewaytaxi.ai/robots.txt | head -60`

Expected: the 48 Disallow entries are present under `*`, `Googlebot`, `Bingbot`. The AI crawlers are still open.

- [ ] **Step 5: Submit URL inspection in GSC**

In Google Search Console:
- Inspect any old-pattern URL (e.g., `https://www.onewaytaxi.ai/bagalkot-outstation-cab`) — confirm Google sees the redirect.
- Inspect any new-pattern URL — confirm "URL is on Google" or request indexing.
- Watch the "Page with redirect" count over 4-8 weeks. Expected: gradual decline as Google reclassifies URLs to "Excluded by robots.txt".

- [ ] **Step 6: Document the GSC reclassification expectation in `report.md`**

Append a note to the existing `report.md` so future work has context:

```markdown

---

## 2026-05-11 — GSC "Page with redirect" backlog fix

Shipped redirect-backlog fix (spec: `docs/superpowers/specs/2026-05-11-redirect-backlog-fix-design.md`).

1,200 explicit redirect rules now compiled into Netlify edge config via `next.config.ts`. robots.txt now disallows old-pattern URLs under `*`, `Googlebot`, `Bingbot`.

**Expected GSC behaviour:** the 1.67K "Page with redirect" count will gradually shift to "Excluded by robots.txt" — this is the intended outcome, not a regression. Both statuses mean the URL is not indexed; the canonical new-pattern URLs continue to be indexed via the sitemap.
```

---

## Self-Review

**Spec coverage:**
- Approach §1 (Next.js `redirects()` config) → Task 1 ✓
- Approach §2 (robots.ts Disallow under *, Googlebot, Bingbot) → Task 2 ✓
- Approach §3 (proxy.ts unchanged fallback) → File map confirms NO CHANGE ✓
- Verification §1-8 → Task 3 covers steps 1-5; build verification in Tasks 1-2 covers step 6-7 ✓
- Risks all addressed in tasks (TypeScript check, build, sanity-check URLs, single-hop curl confirms edge compilation) ✓

**Placeholder scan:** Searched for TBD, TODO, "appropriate", "similar to". None found. Both code blocks contain complete files.

**Type consistency:** `OLD_SUFFIX_MAP` shape matches `proxy.ts`. `OLD_PATTERN_DISALLOW` is `string[]`, spread into `disallow` arrays which accept `string | string[]` per `MetadataRoute.Robots` types. `Redirect` shape (`source`, `destination`, `permanent`) matches Next.js types.

No gaps found. Plan is ready.
