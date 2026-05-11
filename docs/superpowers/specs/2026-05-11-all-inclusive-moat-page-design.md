# All-Inclusive Moat Page + Schema Ripple — Design Spec

**Date:** 2026-05-11
**Status:** Draft, pending user approval
**Owner:** SEO

---

## Problem

The OneWayTaxi.ai pricing differentiator — *all-inclusive fares with tolls, driver bata, state permit, and 5% GST baked in* — is the single largest competitive advantage over rivals (DropTaxi.ai, BharatOneWayTaxi, SS Drop Taxi, DropTaxi.in) who all advertise lower per-km rates but charge tolls/bata/permit on top. Today this advantage is:

- **Stated as a footer callout** inside `components/seo/PricingTable.tsx`, easy to miss
- **Not exposed in structured data** — Offer schemas across the site lack `valueAddedTaxIncluded: true`, so Google's price comparison features can't distinguish all-in fares from extras-quoted-separately fares
- **Not directly addressed by any landing page** — no dedicated URL targets the search intents `all inclusive taxi`, `no hidden charges taxi`, `transparent taxi pricing south india`
- **Not surfaced in the homepage hero or route-page H1s** as an at-a-glance visual signal

This spec adds a dedicated manifesto page at `/all-inclusive-pricing`, a reusable `<AllInclusiveBadge>` component placed at strategic page locations, schema enrichment via `priceSpecification.valueAddedTaxIncluded: true` rippling across ~2,200 district pages + service/route hubs, and a "What's included" column in the existing pricing table.

## Goals

1. **Build the manifesto page** `/all-inclusive-pricing` (~1,500-2,000 words) targeting `all inclusive taxi`, `no hidden charges taxi`, `transparent taxi pricing south india`.
2. **Schema ripple**: add `priceSpecification.valueAddedTaxIncluded: true` to Offer schemas across the site so Google's structured data signals all-inclusive pricing on every page.
3. **Visual signal**: introduce `<AllInclusiveBadge>` and place it on the homepage hero, service-hub heroes, and route-page H1s.
4. **Pricing-table enhancement**: add a per-row "All-Inclusive" indicator (desktop column + mobile inline note), keeping the existing footer callout as the explainer.
5. **Tamil/Tanglish layer** in the moat page (3-line block) — mirrors the playbook §10 pattern.
6. **Navigation discoverability**: footer link to the new page.

## Non-goals

- Updating page titles/meta descriptions across all hub pages to lead with "All-Inclusive" — defer to a copy-only pass.
- Customer-facing communications (WhatsApp/phone scripts).
- Real testimonials sourcing — page uses 3 illustrative testimonials with a note that real ones should be swapped in later.
- Address gap (Fix 0.4 from playbook §0).
- Press/PR outreach.
- Differentiating the 6-URL variant strategy — separate spec.

## Approach

### 1. The moat page (`app/all-inclusive-pricing/page.tsx`)

Static Server Component, matches the structural pattern of `app/one-way-taxi/page.tsx`:

- `export const metadata` with title ≤60 chars, meta description ≤158 chars, canonical, OG, Twitter, robots
- Server Component returning `<Header /> + <main>{sections}</main> + <Footer />`
- All schema injected as inline `<script type="application/ld+json">` tags using the established `escape()` pattern from `SchemaMarkup.tsx` (replace `<` with `<` to prevent script tag breakouts)

**Page sections** (top to bottom):
1. Breadcrumb nav (matches `/one-way-taxi` shape)
2. **H1:** "All-Inclusive Taxi Pricing — Why Quoted = Paid at OneWayTaxi.ai"
3. Hero intro paragraph (~80 words) with `<AllInclusiveBadge size="hero" />`
4. **§ What "all-inclusive" actually means** — 4 components included (tolls, ₹400/day bata, state permit, 5% GST); 1 NOT included (optional add-ons explained next)
5. **§ The hidden-charge tactics other operators use** — narrative with concrete numbers
6. **§ Real fare comparison table** — Chennai-Bangalore 346 km, sedan column. Three rows:
   - OneWayTaxi.ai @ ₹14/km all-in: ₹4,850 final
   - Competitor @ ₹11/km headline: ₹3,806 base + ₹450 toll + ₹400 bata + ₹150 permit + ₹240 GST = **₹5,046** final
   - Competitor @ ₹13/km headline: ₹4,498 base + same extras = **₹5,773** final
   - OneWayTaxi.ai saves ₹196-923 on this single route
7. **§ What's NOT included (honest list)** — hill station entry (Ooty ₹100, Kodaikanal ₹200, Munnar ₹200), private property parking, extra waiting beyond 30-min buffer, additional pickup/drop stops beyond agreed itinerary
8. **§ Why we can be all-inclusive (business model)** — corporate toll accounts via FASTag fleet, in-house permit/GST team, drivers paid fixed daily bata (no per-trip negotiation)
9. **§ Customer testimonials** — 3 illustrative quotes flagged as placeholders in code comments for later replacement
10. **§ The math: ₹11/km headline vs ₹14/km all-in** — educational breakdown
11. **§ Tamil/Tanglish** — 3 lines (Tamil headline, Tanglish bullet, voice-search FAQ in Tamil)
12. **§ FAQs (8)** — unexpected toll, Kerala state-specific taxes, GST rate changes, hill entry, private parking, cancellation impact, advance payment, custom add-ons
13. **§ CTA** — phone + WhatsApp + booking form links

**Schemas emitted by this page** (5 separate `<script>` tags, each independently escaped):
- `Article` — `@type: Article`, `headline`, `author: { "@type": "Organization", "name": "OneWayTaxi.ai" }`, `publisher: { "@type": "Organization", "name": "OneWayTaxi.ai", "logo": ... }`, `datePublished: "2026-05-11"`, `image: "/opengraph-image"`, `mainEntityOfPage: { "@type": "WebPage", "@id": "https://onewaytaxi.ai/all-inclusive-pricing" }`
- `WebPage` — `@type: WebPage`, `name`, `description`, `url`, `inLanguage: en-IN`
- `BreadcrumbList` — Home > All-Inclusive Pricing
- `FAQPage` — all 8 questions/answers mirrored from the visible section
- `Service` with `priceSpecification.UnitPriceSpecification.valueAddedTaxIncluded: true` and `referenceQuantity` (per-km basis)

**Word count target:** 1,500-2,000 words. Body copy is hand-written in this commit (not LLM-generated at runtime), matching the codebase's existing pattern in `lib/seo-content.ts` and the inline content of `app/one-way-taxi/page.tsx`.

### 2. `<AllInclusiveBadge>` component (`components/seo/AllInclusiveBadge.tsx`)

```tsx
interface AllInclusiveBadgeProps {
    size?: 'hero' | 'inline' | 'compact';
    className?: string;
}
```

- `hero` — large pill (~24px text + 16px padding), used on homepage hero, moat page hero, hub-page heroes
- `inline` — chip (~14px text + 8px padding), used in route-page H1 area
- `compact` — tiny badge (~12px text + 4px padding), used inside PricingTable rows

All variants render: a checkmark icon + text "All-Inclusive · Tolls + Bata + Permit + GST" (the compact variant abbreviates to "All-Inclusive ✓").

Brand teal-900 background with white text (matches existing `lib/constants.ts` `THEME_COLOR: '#0F3D3E'` and Tailwind tokens already in use). One file, ~30 lines. No state, no client-side JS — server-renderable.

### 3. Schema ripple — adding `valueAddedTaxIncluded: true`

Schema.org puts `valueAddedTaxIncluded` on `PriceSpecification` (or its subclass `UnitPriceSpecification`), NOT directly on `Offer`. To add the flag, every Offer needs a nested `priceSpecification` object.

Survey of current state (from grep):
- `components/seo/SchemaMarkup.tsx:42-55` — `hasOfferCatalog.itemListElement` emits plain Offers with `price`, `priceCurrency`, `unitText: "per km"` but no priceSpecification. **NEEDS RIPPLE.** Affects ~2,200 district pages.
- `app/drop-taxi/page.tsx:58` — already has `priceSpecification: { "@type": "UnitPriceSpecification", price: 13, priceCurrency: "INR", unitText: "per km" }`. **NEEDS one-line addition** of `valueAddedTaxIncluded: true`.
- `app/outstation-cabs/page.tsx:58` — same shape as drop-taxi, same one-line fix.
- `components/seo/VehicleLanding.tsx:102` — has `priceSpecification`. Same fix.
- `app/one-way-taxi/page.tsx` — `serviceSchema` does not currently include offers/priceSpecification. **OPTIONAL ADD** of an Offer with priceSpecification for symmetry.
- `app/round-trip-taxi/page.tsx`, `app/airport-taxi/page.tsx` — inspect during implementation; same treatment.
- `app/route/[routeSlug]/page.tsx` — route pages have their own schema; survey during implementation and add `priceSpecification.valueAddedTaxIncluded: true` to any Offer present.

The rippled change shape (per Offer):
```ts
{
  "@type": "Offer",
  price: 14,
  priceCurrency: "INR",
  availability: "https://schema.org/InStock",
  priceSpecification: {
    "@type": "UnitPriceSpecification",
    price: 14,
    priceCurrency: "INR",
    referenceQuantity: { "@type": "QuantitativeValue", unitCode: "KMT", value: 1 },
    valueAddedTaxIncluded: true,
  },
}
```

`unitCode: "KMT"` is the UN/CEFACT code for kilometers. `valueAddedTaxIncluded: true` covers the GST inclusion explicitly; the broader "tolls + bata + permit" inclusion is conveyed via the moat-page Service schema's `description` text and FAQPage answers.

### 4. PricingTable column ("What's included")

Existing component has a footer callout. Add per-row visibility:

- **Desktop table** (`PricingTable.tsx:24-66`): insert a new `<th>` between AC and the booking button, header label "All-Inclusive". Each `<td>` renders `<AllInclusiveBadge size="compact" />`.
- **Mobile cards** (`PricingTable.tsx:69-98`): below the price line, add a row with `<AllInclusiveBadge size="compact" />` aligned left.
- **Footer callout** stays unchanged (line 100-105) — still useful as the explainer paragraph.

### 5. Navigation links

- **Header.tsx `serviceHubs` array**: NOT modified (the playbook itself in §13.3 puts the moat page in the footer TOOLS group, not the main service nav). Keeping Header lean.
- **Footer.tsx**: add an "All-Inclusive Pricing" link under whichever section is contextually closest (likely "Tools" or "Why us"). Audit Footer structure during implementation; place per existing patterns.
- **Homepage hero (`app/page.tsx`)**: render `<AllInclusiveBadge size="hero" />` below the main headline. Also add a "Read the all-inclusive pricing manifesto →" text link under the badge linking to `/all-inclusive-pricing`.
- **Service-hub heroes (`one-way-taxi`, `drop-taxi`, etc.)**: render `<AllInclusiveBadge size="hero" />` near the H1.
- **Route page H1 (`app/route/[routeSlug]/page.tsx`)**: render `<AllInclusiveBadge size="inline" />` adjacent to the H1.

### 6. Tamil/Tanglish mini-section (on the moat page only)

Three-line block embedded directly before the FAQs section:

- **Tamil headline:** அனைத்து உள்ளடக்கம் — டோல், பாதா, பெர்மிட், GST. மறைக்கப்பட்ட கட்டணம் இல்லை.
- **Tanglish:** "All-inclusive-nu sonna enna? Toll, bata, permit, GST ellaam fare-le sernthu irukku. Drop point-le extra kekka maatom."
- **Voice-search FAQ (Tamil):** "என் டாக்ஸி கட்டணத்தில் GST சேர்க்கப்பட்டுள்ளதா?" (5% GST already included in your fare.)

Static text in the page component; no i18n framework involvement. UTF-8 encoded directly in the .tsx source.

### 7. Sitemap

`app/sitemap.ts` — add `https://onewaytaxi.ai/all-inclusive-pricing` with `priority: 0.85` (matches the playbook's emphasis on this as a moat anchor), `changeFrequency: 'monthly'`.

## Files

| File | Action | Lines (est.) |
|---|---|---|
| `app/all-inclusive-pricing/page.tsx` | CREATE | ~450 (page component + 5 schemas + body copy) |
| `components/seo/AllInclusiveBadge.tsx` | CREATE | ~40 |
| `components/seo/SchemaMarkup.tsx` | EDIT | +6 lines (add priceSpecification with valueAddedTaxIncluded to OfferCatalog map) |
| `components/seo/PricingTable.tsx` | EDIT | +10 lines (desktop column + mobile badge) |
| `components/seo/VehicleLanding.tsx` | EDIT | +1 line |
| `components/Footer.tsx` | EDIT | +1 line (link entry) |
| `app/page.tsx` | EDIT | +5 lines (hero badge + manifesto link) |
| `app/drop-taxi/page.tsx` | EDIT | +1 line |
| `app/outstation-cabs/page.tsx` | EDIT | +1 line |
| `app/one-way-taxi/page.tsx` | EDIT | +5 lines (offers with priceSpecification in serviceSchema + hero badge) |
| `app/round-trip-taxi/page.tsx` | EDIT | +1 to +5 lines (read first; if existing Offer present, add `valueAddedTaxIncluded: true`; if no Offer present, add hero badge only — do not invent new schema) |
| `app/airport-taxi/page.tsx` | EDIT | +1 to +5 lines (same conditional pattern as round-trip-taxi) |
| `app/route/[routeSlug]/page.tsx` | EDIT | +5 to +10 lines (same conditional pattern; also add `<AllInclusiveBadge size="inline" />` near the route-page H1) |
| `app/sitemap.ts` | EDIT | +1 entry |
| `proxy.ts` | UNCHANGED | — |
| `app/robots.ts` | UNCHANGED | — |
| `next.config.ts` | UNCHANGED | — |
| `lib/constants.ts` | UNCHANGED | — |

The conditional-edit entries for `round-trip-taxi`, `airport-taxi`, and `route/[routeSlug]` follow a deterministic rule: open the file; if there is an existing `Offer` or `priceSpecification` in any schema, append `valueAddedTaxIncluded: true` to the existing priceSpecification (or wrap the Offer in one if none exists). Either way, render `<AllInclusiveBadge>` near the H1. No schema is invented; nothing else is touched.

## Verification

1. **Build:** `npm run build` completes clean.
2. **Page renders:** visit `http://localhost:3000/all-inclusive-pricing` — confirm hero, all 13 sections, 5 schemas in HTML source.
3. **Schema validation:** copy the page's JSON-LD blocks into Google's Rich Results Test (or schema.org Validator). Expected: `Article`, `WebPage`, `BreadcrumbList`, `FAQPage`, `Service` all parse cleanly. `valueAddedTaxIncluded: true` is recognized on the Service's priceSpecification.
4. **Schema ripple — district page:** visit any new-pattern URL (e.g., `/outstation-cabs-in-bagalkot`). Inspect the rendered `<script type="application/ld+json">` blocks. Confirm each Offer in the OfferCatalog now has `priceSpecification.valueAddedTaxIncluded: true`.
5. **Schema ripple — hub:** visit `/drop-taxi`, `/outstation-cabs`. Confirm `serviceSchema.offers.priceSpecification.valueAddedTaxIncluded === true`.
6. **Badge rendering:** confirm `<AllInclusiveBadge>` renders correctly in three sizes — homepage hero (large pill), route page H1 (inline chip), inside a PricingTable row on a district page (compact).
7. **PricingTable column:** on desktop and mobile, confirm the new All-Inclusive indicator is visible per row, and the existing footer callout is unchanged.
8. **Sitemap:** `/sitemap.xml` includes the new URL.
9. **Lighthouse/Core Web Vitals:** run Lighthouse on the new page. No regressions vs an existing hub page like `/one-way-taxi`.

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| `valueAddedTaxIncluded` placement wrong (on Offer vs PriceSpecification) | Schema.org defines it on PriceSpecification; we nest it inside `priceSpecification` consistently. Verification step 3 (Rich Results Test) catches it. |
| 2,200 district pages re-rendered, build slowdown | The change adds ~150 chars per Offer × 5 vehicles = ~750 chars per district page. Build is already 21s on this hardware; expect 22-25s. Not a concern. |
| Badge breaks responsive layouts | Three explicit size variants with constrained widths. Inspect on mobile during implementation. |
| Page word count too low to rank | Hand-written 1,500-2,000-word body covers the targeted intents with depth (matches `/one-way-taxi`'s ~2,000-word density). |
| Placeholder testimonials look fake | Each testimonial marked in code with `{/* PLACEHOLDER: replace with real customer review */}` comment + the spec lists them as "illustrative" in the body text. |
| Tamil text rendering on older mobile fonts | UTF-8 in source; relies on system Tamil font availability on user device. No webfont added (no perf cost). Falls back to glyphs if no font. |
| Adding `priceSpecification` everywhere drifts from existing Offer shape | The change is purely additive; existing fields stay. Schema.org accepts both shapes. |
| Future schema audit reviewer asks "why no offers on one-way-taxi page?" before this spec | Optional add for one-way-taxi noted in §3; will add for symmetry. |

## Out of scope (deferred)

- Page-by-page meta-description rewrites to lead with "All-Inclusive"
- Replacing placeholder testimonials with real reviews
- Adding the moat page to the Header main nav (footer is sufficient per playbook §13.3)
- Differentiating the 6-URL variant strategy across cities (separate spec)
- Address gap (Fix 0.4)
- Updating SMS/WhatsApp templates
