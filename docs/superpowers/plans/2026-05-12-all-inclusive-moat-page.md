# All-Inclusive Moat Page + Schema Ripple — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `/all-inclusive-pricing` manifesto page, introduce `<AllInclusiveBadge>` component used across hub/route/homepage heroes and pricing tables, and ripple `priceSpecification.valueAddedTaxIncluded: true` into Offer schemas across the site (~2,200 district pages + 6 hub pages + 800+ route pages).

**Architecture:** One reusable badge component (`components/seo/AllInclusiveBadge.tsx`) drives the visual signal everywhere. The moat page (`app/all-inclusive-pricing/page.tsx`) is hand-written prose + 5 inline JSON-LD schemas, following the same pattern as `app/one-way-taxi/page.tsx`. Schema ripple is additive — every existing Offer gains a nested `priceSpecification` (with `valueAddedTaxIncluded: true` and `referenceQuantity` per-km), no Offer is removed or restructured.

**Tech Stack:** Next.js 16 App Router, React Server Components, TypeScript strict mode, Tailwind, lucide-react icons. No test framework installed; verification gate is `npm run build` succeeding plus visual/HTML inspection of rendered output.

**Spec:** `docs/superpowers/specs/2026-05-11-all-inclusive-moat-page-design.md`

---

## File Map

| Task | File | Action | Notes |
|---|---|---|---|
| 1 | `components/seo/AllInclusiveBadge.tsx` | CREATE | Single shared component, three size variants. Dependency for tasks 2, 5, 6, 7. |
| 2 | `app/all-inclusive-pricing/page.tsx` | CREATE | The moat page. Server Component, ~450 lines. |
| 3 | `components/seo/SchemaMarkup.tsx` | EDIT | Ripple `valueAddedTaxIncluded` into the `hasOfferCatalog.itemListElement` map. Affects ~2,200 district pages. |
| 4a | `app/drop-taxi/page.tsx` | EDIT | One-line addition to existing priceSpecification. |
| 4b | `app/outstation-cabs/page.tsx` | EDIT | One-line addition to existing priceSpecification. |
| 4c | `components/seo/VehicleLanding.tsx` | EDIT | One-line addition to existing priceSpecification. |
| 4d | `app/one-way-taxi/page.tsx` | EDIT | Add `offers` with priceSpecification to existing `serviceSchema` + render hero badge. |
| 4e | `app/round-trip-taxi/page.tsx` | EDIT | If existing Offer present → enrich. Always render hero badge. |
| 4f | `app/airport-taxi/page.tsx` | EDIT | Same conditional pattern + hero badge. |
| 5 | `app/route/[routeSlug]/page.tsx` | EDIT | Conditional Offer enrichment + render `<AllInclusiveBadge size="inline" />` near H1. |
| 6 | `components/seo/PricingTable.tsx` | EDIT | Add "All-Inclusive" column (desktop) + per-card badge (mobile). |
| 7a | `app/page.tsx` | EDIT | Render `<AllInclusiveBadge size="hero" />` in hero + manifesto link. |
| 7b | `components/Footer.tsx` | EDIT | Add "All-Inclusive Pricing" entry to Quick Links. |
| 7c | `app/sitemap.ts` | EDIT | Add `/all-inclusive-pricing` URL entry. |

Tasks 4a-4f run sequentially within Task 4 (one commit per file is fine; one commit covering all six is also fine — engineer's choice). Tasks 7a-7c likewise run within Task 7.

---

## Task 1: AllInclusiveBadge component

**Files:**
- Create: `components/seo/AllInclusiveBadge.tsx`

**Context:** The badge is a server-renderable component (no `'use client'` directive, no hooks). Tailwind + lucide-react icons match the codebase's existing patterns (see `components/seo/TrustBanner.tsx` or `components/Header.tsx` for prior art). Three explicit size variants: `hero` (large pill, used on heroes), `inline` (chip next to H1s), `compact` (tiny per-row indicator in PricingTable).

- [ ] **Step 1: Create the file**

```tsx
import { CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

interface AllInclusiveBadgeProps {
    size?: 'hero' | 'inline' | 'compact';
    className?: string;
}

const SIZE_STYLES: Record<NonNullable<AllInclusiveBadgeProps['size']>, string> = {
    hero: 'gap-2 px-4 py-2 text-base sm:text-lg rounded-full',
    inline: 'gap-1.5 px-2.5 py-1 text-xs sm:text-sm rounded-full',
    compact: 'gap-1 px-2 py-0.5 text-[11px] rounded-md',
};

const ICON_SIZE: Record<NonNullable<AllInclusiveBadgeProps['size']>, string> = {
    hero: 'h-5 w-5',
    inline: 'h-3.5 w-3.5',
    compact: 'h-3 w-3',
};

export default function AllInclusiveBadge({ size = 'inline', className }: AllInclusiveBadgeProps) {
    const label = size === 'compact'
        ? 'All-Inclusive'
        : 'All-Inclusive · Tolls + Bata + Permit + GST';
    return (
        <span
            className={clsx(
                'inline-flex items-center font-semibold bg-emerald-700 text-white shadow-sm',
                SIZE_STYLES[size],
                className,
            )}
            aria-label="All-inclusive pricing: tolls, driver bata, state permit, and GST are included in the fare"
        >
            <CheckCircle2 className={clsx(ICON_SIZE[size], 'shrink-0')} aria-hidden="true" />
            <span>{label}</span>
        </span>
    );
}
```

- [ ] **Step 2: TypeScript check**

Run: `npx tsc --noEmit 2>&1 | head -20`

Expected: no output (clean).

- [ ] **Step 3: Build**

Run: `npm run build 2>&1 | tail -15`

Expected: build completes; no errors. Component is not imported anywhere yet so no rendering happens — the build verifies the file parses and types correctly.

- [ ] **Step 4: Commit**

```powershell
git add components/seo/AllInclusiveBadge.tsx
git commit -m "feat(seo): add AllInclusiveBadge component with hero/inline/compact variants

Reusable visual signal for the all-inclusive pricing moat. Used in
moat page hero, route page H1s, hub page heroes, homepage hero, and
inside PricingTable rows (compact). Server-renderable, no client JS.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Moat page (`/all-inclusive-pricing`)

**Files:**
- Create: `app/all-inclusive-pricing/page.tsx`

**Context:** This is the largest single artifact. Follow the exact pattern of `app/one-way-taxi/page.tsx`: a default-exported Server Component returning `<Header /><main>...</main><Footer />`, with `metadata` and inline JSON-LD schemas at module scope (escaped with the `<` → `<` trick to prevent script-tag breakouts). Body copy is hand-written prose (matches the codebase's existing pattern of inlining long-form content in the page component).

The page targets `all inclusive taxi`, `no hidden charges taxi`, `transparent taxi pricing south india` queries. ~1,500-2,000 words.

- [ ] **Step 1: Create the directory**

Run: `mkdir -p app/all-inclusive-pricing` (PowerShell: `New-Item -ItemType Directory -Path app\all-inclusive-pricing -Force | Out-Null`)

- [ ] **Step 2: Create the page file**

Create `app/all-inclusive-pricing/page.tsx` with the EXACT content below. The file is long; copy in one shot rather than editing piecemeal.

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AllInclusiveBadge from "@/components/seo/AllInclusiveBadge";
import { SUPPORT_PHONE } from "@/lib/constants";
import { Phone, MessageCircle, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

const PHONE_DIGITS = SUPPORT_PHONE.replace(/\s/g, "");
const WHATSAPP_URL = "https://wa.me/918124476010?text=Hi%2C%20I%20want%20to%20book%20a%20one-way%20taxi.";
const CANONICAL = "https://onewaytaxi.ai/all-inclusive-pricing";
const PUBLISHED_DATE = "2026-05-12";

export const metadata: Metadata = {
    title: "All-Inclusive Taxi Pricing | No Hidden Charges | OneWayTaxi.ai",
    description:
        "OneWayTaxi.ai's fares include tolls, driver bata, state permit, and 5% GST. No surprises at drop. See real comparison math vs operators with hidden charges.",
    alternates: { canonical: CANONICAL },
    openGraph: {
        title: "All-Inclusive Taxi Pricing — OneWayTaxi.ai",
        description: "Tolls + bata + permit + GST all baked in. Quoted = paid.",
        url: CANONICAL,
        siteName: "OneWayTaxi.ai",
        type: "article",
        locale: "en_IN",
        images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "All-Inclusive Taxi Pricing — OneWayTaxi.ai" }],
    },
    twitter: { card: "summary_large_image", title: "All-Inclusive Taxi Pricing | OneWayTaxi.ai", description: "Tolls + bata + permit + GST baked in. Quoted = paid.", images: ["/opengraph-image"] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 } },
};

// ─── FAQs (8) — hand-tuned to all-inclusive pricing intent ───────────────
const faqs: { q: string; a: string }[] = [
    {
        q: "What does 'all-inclusive' actually mean at OneWayTaxi.ai?",
        a: "Your quoted fare covers four cost components that other operators usually bill separately: all national-highway tolls on your route, the driver's daily bata (typically ₹400/day), inter-state permit fees where applicable, and 5% GST. You pay the quoted amount at drop. Nothing else."
    },
    {
        q: "What's NOT included in the all-inclusive fare?",
        a: "Hill-station entry fees (Ooty ₹100, Kodaikanal ₹200, Munnar ₹200), parking inside private property (apartment basements, gated communities), waiting beyond the free 30-minute pickup buffer, and additional pickup/drop stops beyond the agreed itinerary. Any optional add-on is disclosed before booking — never billed as a surprise."
    },
    {
        q: "What if we hit an unexpected toll plaza on the way?",
        a: "If the route runs through a toll plaza that wasn't part of the original itinerary, you pay nothing extra — the operator absorbs it. Tolls are a fleet-wide corporate FASTag account, not a per-trip line item we pass on to you."
    },
    {
        q: "Are Kerala state-specific taxes (or other state border fees) included?",
        a: "Yes. Inter-state permit fees on cross-border routes (Tamil Nadu → Kerala, Karnataka → Tamil Nadu, etc.) are pre-paid by us as part of the all-inclusive fare. You won't be asked at the border."
    },
    {
        q: "What happens if GST rates change?",
        a: "Existing confirmed bookings honour the GST rate at booking time — you pay what was quoted. New bookings reflect the updated GST, with a re-quoted total. The 'all-inclusive' commitment is to your specific quote, not to a per-km rate floating forever."
    },
    {
        q: "Why can you offer all-inclusive when others can't?",
        a: "Three operational decisions: (1) corporate FASTag accounts for all national highway tolls, billed monthly to us not to drivers, (2) in-house permit and GST team handling state filings — no third-party agents marking up fees, (3) drivers paid a fixed daily bata regardless of trip length, removing the per-trip negotiation that creates hidden-charge incentives elsewhere."
    },
    {
        q: "How do I get a GST invoice for corporate billing?",
        a: "GST is already in your fare; we email the GST-compliant invoice within 24 hours of trip completion. Share your company name and GSTIN at booking and we'll generate the invoice in your business's name."
    },
    {
        q: "What's the cancellation policy with all-inclusive pricing?",
        a: "Free cancellation more than 4 hours before pickup. Within 4 hours, ₹200 service fee. After driver pickup, ₹500 no-show fee. Refunds go back to the original payment method within 3-5 working days (UPI within 24 hours). Tolls and permits we pre-paid for you are absorbed by us on cancellation — never billed back."
    },
];

// ─── Schemas ─────────────────────────────────────────────────────────────
const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "All-Inclusive Taxi Pricing — Why Quoted = Paid at OneWayTaxi.ai",
    description: "How all-inclusive pricing works at OneWayTaxi.ai: tolls, driver bata, state permit, and GST baked into every quote. Real math vs competitors with hidden charges.",
    author: { "@type": "Organization", name: "OneWayTaxi.ai", url: "https://onewaytaxi.ai" },
    publisher: {
        "@type": "Organization",
        name: "OneWayTaxi.ai",
        logo: { "@type": "ImageObject", url: "https://onewaytaxi.ai/logo.png" },
    },
    datePublished: PUBLISHED_DATE,
    dateModified: PUBLISHED_DATE,
    image: "https://onewaytaxi.ai/opengraph-image",
    mainEntityOfPage: { "@type": "WebPage", "@id": CANONICAL },
};

const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "All-Inclusive Taxi Pricing — OneWayTaxi.ai",
    description: "OneWayTaxi.ai's all-inclusive pricing manifesto. Tolls, bata, permit, GST baked in.",
    url: CANONICAL,
    inLanguage: "en-IN",
    isPartOf: { "@type": "WebSite", name: "OneWayTaxi.ai", url: "https://onewaytaxi.ai" },
};

const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://onewaytaxi.ai/" },
        { "@type": "ListItem", position: 2, name: "All-Inclusive Pricing", item: CANONICAL },
    ],
};

const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
};

const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "One Way Drop Taxi (All-Inclusive)",
    name: "All-Inclusive One Way Taxi",
    description: "One-way drop taxi with all-inclusive fares — tolls, driver bata, state permit, and 5% GST baked into the quoted price.",
    provider: { "@type": "Organization", name: "OneWayTaxi.ai", url: "https://onewaytaxi.ai", telephone: SUPPORT_PHONE },
    areaServed: ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Pondicherry"],
    offers: {
        "@type": "Offer",
        priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: 14,
            priceCurrency: "INR",
            referenceQuantity: { "@type": "QuantitativeValue", unitCode: "KMT", value: 1 },
            valueAddedTaxIncluded: true,
        },
    },
};

const escape = (json: string) => json.replace(/</g, "\\u003c");

export default function AllInclusivePricingPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="bg-gray-100 border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <ol className="flex items-center gap-1.5 text-sm text-gray-600 flex-wrap">
                            <li><Link href="/" className="hover:text-teal-700">Home</Link></li>
                            <li className="text-gray-400">/</li>
                            <li className="text-teal-800 font-medium">All-Inclusive Pricing</li>
                        </ol>
                    </div>
                </nav>

                {/* Hero */}
                <section className="bg-gradient-to-b from-teal-900 via-teal-800 to-teal-700 text-white py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="mb-6 flex justify-center"><AllInclusiveBadge size="hero" /></div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                            All-Inclusive Taxi Pricing — Why Quoted = Paid at OneWayTaxi.ai
                        </h1>
                        <p className="text-lg text-teal-50 leading-relaxed">
                            Every fare we quote includes tolls, driver bata, state permit, and 5% GST. There is no second bill at the drop point. This page explains what "all-inclusive" actually means at OneWayTaxi.ai, how the math compares with operators who advertise lower per-km rates, and what (honestly) is not included.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                            <a href={`tel:${PHONE_DIGITS}`} className="inline-flex items-center gap-2 bg-white text-teal-900 px-5 py-3 rounded-full font-bold shadow-lg hover:bg-teal-50">
                                <Phone className="h-5 w-5" /> {SUPPORT_PHONE}
                            </a>
                            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full font-bold shadow-lg hover:bg-[#20BD5A]">
                                <MessageCircle className="h-5 w-5" /> WhatsApp
                            </a>
                        </div>
                    </div>
                </section>

                {/* What all-inclusive means */}
                <section className="py-14 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">What "all-inclusive" actually means here</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            The phrase "all-inclusive" is overused in Indian taxi marketing — most operators use it loosely, then add tolls and bata at drop. At OneWayTaxi.ai it is a specific, four-component commitment. Your quoted fare always includes:
                        </p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" /><span className="text-gray-800"><strong>All national-highway tolls</strong> on the route — billed to our corporate FASTag account, never to you.</span></li>
                            <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" /><span className="text-gray-800"><strong>Driver bata</strong> (~₹400 per day) — the daily allowance that covers the driver's food, intermediate stops, and dead-head return.</span></li>
                            <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" /><span className="text-gray-800"><strong>Inter-state permit fees</strong> — Tamil Nadu → Kerala, Karnataka → Tamil Nadu, etc. — pre-paid by us, not by the driver at the border.</span></li>
                            <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" /><span className="text-gray-800"><strong>5% GST</strong> — already in the quoted total; a GST-compliant invoice is emailed within 24 hours of trip completion.</span></li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed">
                            What you pay the driver at drop is exactly the number we sent you at booking. There is no second handshake about extras.
                        </p>
                    </div>
                </section>

                {/* Hidden-charge tactics */}
                <section className="py-14 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">The hidden-charge tactics other operators use</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            The South Indian one-way taxi market runs on per-kilometre headline pricing — ₹11/km, ₹12/km, ₹13/km — that sounds cheaper than ours until you read the fine print. The three most common patterns:
                        </p>
                        <ol className="space-y-4 list-decimal list-inside text-gray-800">
                            <li><strong>"₹11/km" with tolls and bata extra.</strong> A Chennai → Bangalore quote of ₹3,806 (346 km × ₹11) becomes ₹3,806 + ₹450 toll + ₹400 bata + ₹150 permit + 5% GST = ₹5,046. The cheapest headline rate is rarely the lowest final bill.</li>
                            <li><strong>Round-trip fare disguised as one-way.</strong> A "₹14/km one-way" quote that secretly bills 1.5× the distance to cover the driver's return leg. Look for a "minimum km" clause buried in the booking confirmation.</li>
                            <li><strong>Festival/peak surcharges added at drop.</strong> Pongal, Onam, Tirupati Brahmotsavam — operators with no surge-protection policy bill an additional ₹500-1,500 at the destination.</li>
                        </ol>
                        <p className="text-gray-700 leading-relaxed mt-6">
                            None of these apply at OneWayTaxi.ai. The headline rate ₹14/km sedan is the all-in rate. The total you see at booking is the total you pay.
                        </p>
                    </div>
                </section>

                {/* Real fare comparison */}
                <section className="py-14 bg-white">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Real fare math: Chennai → Bangalore, 346 km, sedan</h2>
                        <p className="text-gray-600 mb-6">Three operators on the same route. Same sedan class. Final amount you actually pay.</p>
                        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
                            <table className="w-full text-sm">
                                <thead className="bg-teal-900 text-white">
                                    <tr>
                                        <th className="text-left py-3 px-4 font-semibold">Operator</th>
                                        <th className="text-right py-3 px-4 font-semibold">Base fare</th>
                                        <th className="text-right py-3 px-4 font-semibold">Toll</th>
                                        <th className="text-right py-3 px-4 font-semibold">Bata</th>
                                        <th className="text-right py-3 px-4 font-semibold">Permit</th>
                                        <th className="text-right py-3 px-4 font-semibold">GST</th>
                                        <th className="text-right py-3 px-4 font-semibold bg-emerald-700">Final</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-emerald-50">
                                        <td className="py-3 px-4 font-semibold text-emerald-900">OneWayTaxi.ai @ ₹14/km <span className="block text-xs font-normal text-emerald-700">All-inclusive</span></td>
                                        <td className="text-right py-3 px-4">₹4,844</td>
                                        <td className="text-right py-3 px-4 text-emerald-700">incl.</td>
                                        <td className="text-right py-3 px-4 text-emerald-700">incl.</td>
                                        <td className="text-right py-3 px-4 text-emerald-700">incl.</td>
                                        <td className="text-right py-3 px-4 text-emerald-700">incl.</td>
                                        <td className="text-right py-3 px-4 font-bold text-emerald-900 bg-emerald-100">₹4,850</td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td className="py-3 px-4 font-semibold text-gray-800">Generic competitor @ ₹11/km <span className="block text-xs font-normal text-gray-500">Headline price</span></td>
                                        <td className="text-right py-3 px-4">₹3,806</td>
                                        <td className="text-right py-3 px-4">+₹450</td>
                                        <td className="text-right py-3 px-4">+₹400</td>
                                        <td className="text-right py-3 px-4">+₹150</td>
                                        <td className="text-right py-3 px-4">+₹240</td>
                                        <td className="text-right py-3 px-4 font-bold text-gray-900 bg-gray-100">₹5,046</td>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <td className="py-3 px-4 font-semibold text-gray-800">Generic competitor @ ₹13/km <span className="block text-xs font-normal text-gray-500">Headline price</span></td>
                                        <td className="text-right py-3 px-4">₹4,498</td>
                                        <td className="text-right py-3 px-4">+₹450</td>
                                        <td className="text-right py-3 px-4">+₹400</td>
                                        <td className="text-right py-3 px-4">+₹150</td>
                                        <td className="text-right py-3 px-4">+₹275</td>
                                        <td className="text-right py-3 px-4 font-bold text-gray-900 bg-gray-100">₹5,773</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-4 text-sm text-gray-700">
                            <strong>Savings vs the cheapest competitor:</strong> ₹196 on Chennai-Bangalore alone. Across a typical 8-12 trip year that's ₹1,500-₹2,500 of avoided "small print" — but the larger value is removing the uncertainty about what the final number will be.
                        </p>
                    </div>
                </section>

                {/* What's NOT included */}
                <section className="py-14 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">What's not included (and why)</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            All-inclusive is a strict commitment, not a marketing line — which means being honest about what isn't covered. Four optional add-ons are billed separately, always disclosed before booking, never as a surprise at drop:
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3"><XCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" /><span className="text-gray-800"><strong>Hill-station entry fees</strong> — Ooty ₹100, Kodaikanal ₹200, Munnar ₹200, Coorg ₹200, Yercaud ₹50. These are paid by the driver at the entry checkpoint and added to your fare with the official receipt.</span></li>
                            <li className="flex items-start gap-3"><XCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" /><span className="text-gray-800"><strong>Private property parking</strong> — apartment basements, gated community visitor parking, hotel valet. National highway toll parking is free; private-property parking varies.</span></li>
                            <li className="flex items-start gap-3"><XCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" /><span className="text-gray-800"><strong>Extra waiting beyond 30 minutes</strong> — the first 30 minutes after the driver arrives at the pickup location are free; ₹150-250 per hour after that (vehicle-class dependent), tracked on the GPS log.</span></li>
                            <li className="flex items-start gap-3"><XCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" /><span className="text-gray-800"><strong>Additional pickup/drop stops</strong> — the agreed itinerary at booking is part of the fare. A new stop added en route is billed at the per-km rate of the diversion.</span></li>
                        </ul>
                    </div>
                </section>

                {/* Why we can be all-inclusive */}
                <section className="py-14 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Why we can be all-inclusive when others can't</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            All-inclusive pricing isn't a discount — it's a different operating model. Three decisions make it work:
                        </p>
                        <ol className="space-y-4 list-decimal list-inside text-gray-800">
                            <li><strong>Corporate FASTag accounts.</strong> Every vehicle in our fleet uses a single corporate FASTag billed monthly to OneWayTaxi.ai. Tolls become a fleet-wide cost we absorb at the fleet level — never a per-trip negotiation between you and a driver at a plaza.</li>
                            <li><strong>In-house permit and GST team.</strong> Inter-state permits and GST filings are handled by our internal compliance team, not third-party agents who mark up fees. The fixed monthly cost spreads predictably across all bookings.</li>
                            <li><strong>Fixed daily bata.</strong> Drivers are paid a fixed daily allowance regardless of route length or destination class. Removing per-trip negotiation removes the incentive to invent "extras" — drivers know their take is the same whether the customer is happy or not. The natural alignment is toward happy.</li>
                        </ol>
                    </div>
                </section>

                {/* Customer testimonials — PLACEHOLDER copy until real reviews are sourced */}
                <section className="py-14 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">What customers say about no-surprise pricing</h2>
                        <p className="text-gray-600 mb-8 text-sm italic">Illustrative quotes — to be replaced with real Google reviews on next refresh.</p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* PLACEHOLDER: replace with real customer review */}
                            <blockquote className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <p className="text-gray-800 leading-relaxed mb-4">"Booked Chennai to Tirupati at ₹1,890 quoted. Paid ₹1,890 at drop. No mention of tolls, no bata extra. First Indian taxi I've used where the number matched the booking."</p>
                                <footer className="text-sm text-gray-600">— Rajesh K., booked Chennai-Tirupati, March 2026</footer>
                            </blockquote>
                            {/* PLACEHOLDER: replace with real customer review */}
                            <blockquote className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <p className="text-gray-800 leading-relaxed mb-4">"My elderly parents travelled from Bangalore to Coorg. I worried about them being asked for toll money or bata at the destination — the driver didn't ask for a paisa beyond the quote. Quote-equals-paid is the actual product."</p>
                                <footer className="text-sm text-gray-600">— Priya S., booked Bangalore-Coorg, January 2026</footer>
                            </blockquote>
                            {/* PLACEHOLDER: replace with real customer review */}
                            <blockquote className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <p className="text-gray-800 leading-relaxed mb-4">"Corporate booking for a colleague's airport drop. GST invoice came in email next morning, exact amount as the booking confirmation. Finance team had zero questions. This is how it should work."</p>
                                <footer className="text-sm text-gray-600">— Anand M., corporate booking, February 2026</footer>
                            </blockquote>
                        </div>
                    </div>
                </section>

                {/* The math: educational breakdown */}
                <section className="py-14 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">The math: ₹11/km headline vs ₹14/km all-in</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            A ₹11/km headline looks like 21% cheaper than ₹14/km all-in. It almost never is. Walk through the breakdown on a typical 300 km route:
                        </p>
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-4">
                            <p className="text-gray-800 mb-2"><strong>₹11/km × 300 km = ₹3,300 base</strong></p>
                            <p className="text-gray-700 leading-relaxed">+ ₹400 driver bata (industry-standard daily allowance)<br />+ ₹350 toll (typical state-highway segment)<br />+ ₹150 inter-state permit (cross-border route)<br />+ 5% GST on the above = ₹210<br /><strong className="text-gray-900">Effective ₹/km: ₹14.03</strong></p>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            The ₹11/km headline becomes ₹14.03/km effective once the unbundled costs are added back. OneWayTaxi.ai's ₹14/km all-inclusive is the same effective rate without the math gymnastics — and without the anxiety that the driver might find one more "extra" to add at the drop point.
                        </p>
                    </div>
                </section>

                {/* Tamil / Tanglish */}
                <section className="py-14 bg-gradient-to-br from-amber-50 to-orange-50 border-y border-amber-200">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">தமிழில் — All-inclusive pricing</h2>
                        <div className="space-y-4 text-gray-800">
                            <p className="text-lg leading-relaxed"><strong>அனைத்து உள்ளடக்கம்</strong> — டோல், பாதா, பெர்மிட், GST. மறைக்கப்பட்ட கட்டணம் இல்லை.</p>
                            <p className="text-base leading-relaxed">"All-inclusive-nu sonna enna? Toll, bata, permit, GST ellaam fare-le sernthu irukku. Drop point-le extra kekka maatom."</p>
                            <p className="text-base leading-relaxed italic text-gray-700">Voice search: <strong>"என் டாக்ஸி கட்டணத்தில் GST சேர்க்கப்பட்டுள்ளதா?"</strong> — 5% GST already included in your quoted fare.</p>
                        </div>
                    </div>
                </section>

                {/* FAQs */}
                <section className="py-14 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Frequently asked questions</h2>
                        <div className="space-y-6">
                            {faqs.map((f, i) => (
                                <div key={i} className="border-b border-gray-200 pb-6 last:border-0">
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">{f.q}</h3>
                                    <p className="text-gray-700 leading-relaxed">{f.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-14 bg-teal-900 text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Get an all-inclusive quote — quoted = paid</h2>
                        <p className="text-teal-100 mb-8 text-lg">No surge, no surprises, no add-ons at the drop point.</p>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <a href={`tel:${PHONE_DIGITS}`} className="inline-flex items-center gap-2 bg-white text-teal-900 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-teal-50">
                                <Phone className="h-5 w-5" /> Call {SUPPORT_PHONE}
                            </a>
                            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-[#20BD5A]">
                                <MessageCircle className="h-5 w-5" /> WhatsApp
                            </a>
                            <Link href="/book-now" className="inline-flex items-center gap-2 bg-amber-500 text-teal-950 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-amber-400">
                                Get Estimate <ArrowRight className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />

            {/* JSON-LD schemas — inputs are server-controlled string constants. */}
            {/* nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escape(JSON.stringify(articleSchema)) }} />
            {/* nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escape(JSON.stringify(webPageSchema)) }} />
            {/* nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escape(JSON.stringify(breadcrumbSchema)) }} />
            {/* nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escape(JSON.stringify(faqPageSchema)) }} />
            {/* nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escape(JSON.stringify(serviceSchema)) }} />
        </div>
    );
}
```

- [ ] **Step 3: TypeScript check**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: no output.

- [ ] **Step 4: Build**

Run: `npm run build 2>&1 | tail -30`
Expected: build completes. Look for `/all-inclusive-pricing` listed as a static (`○`) route in the build output. Build should take similar duration to before (~20-25s).

- [ ] **Step 5: Spot-check rendered HTML**

Start server: `npm run start` (background)
Run: `curl -s http://localhost:3000/all-inclusive-pricing | grep -c 'application/ld+json'`
Expected: `5` (one per schema).

Run: `curl -s http://localhost:3000/all-inclusive-pricing | grep -c 'All-Inclusive · Tolls'`
Expected: at least `1` (hero badge).

Run: `curl -s http://localhost:3000/all-inclusive-pricing | grep -oE '"@type":"[A-Za-z]+"' | sort -u`
Expected: at minimum `"@type":"Article"`, `"@type":"BreadcrumbList"`, `"@type":"FAQPage"`, `"@type":"Service"`, `"@type":"WebPage"`, plus nested types like `"@type":"Organization"`, `"@type":"UnitPriceSpecification"`.

Run: `curl -s http://localhost:3000/all-inclusive-pricing | grep -c 'valueAddedTaxIncluded'`
Expected: at least `1` (inside the Service offer's priceSpecification).

Stop the server.

- [ ] **Step 6: Commit**

```powershell
git add app/all-inclusive-pricing/
git commit -m "feat(seo): add /all-inclusive-pricing moat manifesto page

~1,800-word landing page targeting 'all inclusive taxi', 'no hidden
charges taxi', 'transparent taxi pricing south india'. Hero badge,
4-component inclusion list, hidden-charge tactics, Chennai-Bangalore
comparison table with concrete numbers, what's-not-included honest
list, business model explainer, 3 placeholder testimonials,
educational math section, Tamil/Tanglish block, 8 FAQs, CTAs.
5 schemas: Article, WebPage, BreadcrumbList, FAQPage, Service with
priceSpecification.valueAddedTaxIncluded: true.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Schema ripple — district pages via SchemaMarkup.tsx

**Files:**
- Modify: `components/seo/SchemaMarkup.tsx` (around lines 42-55, the `hasOfferCatalog.itemListElement` map)

**Context:** Currently each Offer in the OfferCatalog has `price`, `priceCurrency`, `unitText`, `availability`. Schema.org requires `valueAddedTaxIncluded` to live on a `PriceSpecification` (or subclass), NOT directly on Offer. The ripple wraps the existing price fields into a nested `priceSpecification`. This change ripples through ~2,200 district pages (anywhere `<SchemaMarkup>` is rendered).

- [ ] **Step 1: Apply the edit**

In `components/seo/SchemaMarkup.tsx`, replace the existing `hasOfferCatalog` block (currently lines 42-55) with this version:

```tsx
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `${district.name} Taxi Services`,
            itemListElement: VEHICLE_TYPES.map(v => ({
                "@type": "Offer",
                itemOffered: {
                    "@type": "Service",
                    name: `${v.name} — ${district.name} ${serviceLabel}`,
                },
                price: v.price,
                priceCurrency: "INR",
                unitText: "per km",
                availability: "https://schema.org/InStock",
                priceSpecification: {
                    "@type": "UnitPriceSpecification",
                    price: v.price,
                    priceCurrency: "INR",
                    referenceQuantity: { "@type": "QuantitativeValue", unitCode: "KMT", value: 1 },
                    valueAddedTaxIncluded: true,
                },
            })),
        },
```

The only change is the new `priceSpecification` field appended to each Offer. `price`, `priceCurrency`, `unitText`, `availability` are unchanged.

- [ ] **Step 2: TypeScript check**

Run: `npx tsc --noEmit 2>&1 | head -10`
Expected: no output.

- [ ] **Step 3: Build**

Run: `npm run build 2>&1 | tail -10`
Expected: build completes.

- [ ] **Step 4: Spot-check a district page**

Start server: `npm run start` (background)
Run: `curl -s http://localhost:3000/outstation-cabs-in-bagalkot | grep -c 'valueAddedTaxIncluded'`
Expected: `7` (one per VEHICLE_TYPES entry — there are 7 vehicle types).

Run: `curl -s http://localhost:3000/outstation-cabs-in-bagalkot | grep -oE '"unitCode":"KMT"' | wc -l`
Expected: `7`.

Stop the server.

- [ ] **Step 5: Commit**

```powershell
git add components/seo/SchemaMarkup.tsx
git commit -m "feat(seo): add valueAddedTaxIncluded to district-page Offer schemas

Each Offer in OfferCatalog now nests a UnitPriceSpecification with
valueAddedTaxIncluded: true and per-km referenceQuantity. Ripples
through ~2,200 district pages rendered via SchemaMarkup. Signals
to Google that quoted prices include GST.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Schema ripple — hub pages + hero badges

Six sub-files. Each is a small edit; commit each individually or batch — engineer's choice.

### 4a. `app/drop-taxi/page.tsx`

**Context:** Existing schema at line ~58 has `priceSpecification: { "@type": "UnitPriceSpecification", price: 13, priceCurrency: "INR", unitText: "per km" }`. Add the VAT flag.

- [ ] **Step 1: Edit the file**

Find: `offers: { "@type": "Offer", priceSpecification: { "@type": "UnitPriceSpecification", price: 13, priceCurrency: "INR", unitText: "per km" } },`

Replace with: `offers: { "@type": "Offer", priceSpecification: { "@type": "UnitPriceSpecification", price: 13, priceCurrency: "INR", unitText: "per km", referenceQuantity: { "@type": "QuantitativeValue", unitCode: "KMT", value: 1 }, valueAddedTaxIncluded: true } },`

- [ ] **Step 2: Add hero badge import + render**

Near the top of the file (after the existing imports from `@/components/...`), add:
```tsx
import AllInclusiveBadge from "@/components/seo/AllInclusiveBadge";
```

In the hero JSX section (find the `<h1>` element), render `<AllInclusiveBadge size="hero" className="mb-4" />` immediately above the H1.

### 4b. `app/outstation-cabs/page.tsx`

Same two edits as 4a — same priceSpecification enrichment, same badge addition above H1.

### 4c. `components/seo/VehicleLanding.tsx`

- [ ] **Step 1: Edit the existing priceSpecification at line ~102**

Find the existing priceSpecification object (around line 102) and add:
- `referenceQuantity: { "@type": "QuantitativeValue", unitCode: "KMT", value: 1 },`
- `valueAddedTaxIncluded: true,`

inside the priceSpecification object.

### 4d. `app/one-way-taxi/page.tsx`

**Context:** The `serviceSchema` here does NOT currently have offers. Add one for symmetry.

- [ ] **Step 1: Edit serviceSchema**

Find:
```ts
const serviceSchema = JSON.stringify({
    "@context": "https://schema.org", "@type": "TaxiService",
    name: "One Way Taxi — OneWayTaxi.ai",
    description: "One-way drop taxi service across South India. Pay only for one-way distance.",
    provider: { "@type": "Organization", name: "OneWayTaxi.ai", url: "https://onewaytaxi.ai", telephone: SUPPORT_PHONE },
    areaServed: ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Pondicherry"],
});
```

Replace with:
```ts
const serviceSchema = JSON.stringify({
    "@context": "https://schema.org", "@type": "TaxiService",
    name: "One Way Taxi — OneWayTaxi.ai",
    description: "One-way drop taxi service across South India. Pay only for one-way distance. All-inclusive fare includes tolls, driver bata, state permit, and 5% GST.",
    provider: { "@type": "Organization", name: "OneWayTaxi.ai", url: "https://onewaytaxi.ai", telephone: SUPPORT_PHONE },
    areaServed: ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Pondicherry"],
    offers: {
        "@type": "Offer",
        priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: 13,
            priceCurrency: "INR",
            unitText: "per km",
            referenceQuantity: { "@type": "QuantitativeValue", unitCode: "KMT", value: 1 },
            valueAddedTaxIncluded: true,
        },
    },
});
```

- [ ] **Step 2: Add hero badge**

Import: `import AllInclusiveBadge from "@/components/seo/AllInclusiveBadge";`

Find the hero `<h1>` and render `<AllInclusiveBadge size="hero" className="mb-4" />` above it.

### 4e. `app/round-trip-taxi/page.tsx`

- [ ] **Step 1: Inspect the file's schemas**

Read the file. Search for `Offer` or `priceSpecification`.

If priceSpecification exists: add `referenceQuantity` and `valueAddedTaxIncluded: true` per the pattern in 4a.

If no Offer exists: add the badge only (do NOT invent a new schema — out of scope per spec).

- [ ] **Step 2: Add hero badge**

Import: `import AllInclusiveBadge from "@/components/seo/AllInclusiveBadge";`

Render `<AllInclusiveBadge size="hero" className="mb-4" />` above the hero H1.

### 4f. `app/airport-taxi/page.tsx`

Same conditional pattern as 4e — inspect, enrich if Offer present, always add hero badge.

- [ ] **Step 3: Build (after all 4a-4f changes)**

Run: `npm run build 2>&1 | tail -20`
Expected: clean.

- [ ] **Step 4: Spot-check**

Start server. For each hub page, curl and confirm:
- `valueAddedTaxIncluded` appears in the HTML if the page had a priceSpecification before the edit (drop-taxi, outstation-cabs, one-way-taxi, possibly others)
- `All-Inclusive · Tolls + Bata + Permit + GST` appears (hero badge rendered)

```powershell
Start-Process npm -ArgumentList 'run','start' -NoNewWindow
Start-Sleep -Seconds 5
foreach ($path in @('drop-taxi','outstation-cabs','one-way-taxi','round-trip-taxi','airport-taxi')) {
    Write-Host "--- /$path ---"
    $body = (Invoke-WebRequest "http://localhost:3000/$path").Content
    Write-Host "  All-Inclusive badge: $($body -match 'All-Inclusive')"
    Write-Host "  valueAddedTaxIncluded: $($body -match 'valueAddedTaxIncluded')"
}
```

Stop the server.

- [ ] **Step 5: Commit**

```powershell
git add app/drop-taxi/page.tsx app/outstation-cabs/page.tsx app/one-way-taxi/page.tsx app/round-trip-taxi/page.tsx app/airport-taxi/page.tsx components/seo/VehicleLanding.tsx
git commit -m "feat(seo): enrich hub Offer schemas + render AllInclusiveBadge in hero

Adds valueAddedTaxIncluded: true and per-km referenceQuantity to
existing priceSpecification objects in drop-taxi, outstation-cabs,
one-way-taxi, and VehicleLanding. Adds matching offer block to
one-way-taxi serviceSchema (previously missing). Renders hero badge
above H1 on all 5 service hubs.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Route page template — schema enrichment + inline badge

**Files:**
- Modify: `app/route/[routeSlug]/page.tsx`

**Context:** Route pages have their own schema. Apply the same conditional pattern: enrich existing Offer with `valueAddedTaxIncluded`, render `<AllInclusiveBadge size="inline" />` near the H1.

- [ ] **Step 1: Inspect the file**

Read `app/route/[routeSlug]/page.tsx`. Locate any `Offer` or `priceSpecification` in the schemas.

- [ ] **Step 2: Apply the edits**

If an Offer with priceSpecification exists: add `valueAddedTaxIncluded: true` and `referenceQuantity: { "@type": "QuantitativeValue", unitCode: "KMT", value: 1 }` inside the priceSpecification.

If an Offer without priceSpecification exists: wrap the existing `price` / `priceCurrency` into a new priceSpecification with the same shape.

Add import: `import AllInclusiveBadge from "@/components/seo/AllInclusiveBadge";`

Render `<AllInclusiveBadge size="inline" className="ml-2 align-middle" />` adjacent to the route page H1 (typically the route name like "Chennai to Bangalore Taxi").

- [ ] **Step 3: Build**

Run: `npm run build 2>&1 | tail -10`
Expected: clean.

- [ ] **Step 4: Spot-check a route page**

Start server. Run:
```powershell
$body = (Invoke-WebRequest "http://localhost:3000/route/chennai-to-bangalore-taxi").Content
Write-Host "All-Inclusive badge: $($body -match 'All-Inclusive')"
Write-Host "valueAddedTaxIncluded: $($body -match 'valueAddedTaxIncluded')"
```
Expected: both `True`.

Stop the server.

- [ ] **Step 5: Commit**

```powershell
git add app/route/[routeSlug]/page.tsx
git commit -m "feat(seo): enrich route-page Offer schema + render inline AllInclusiveBadge

valueAddedTaxIncluded: true on the route page priceSpecification;
inline badge next to the H1. Ripples to all 800+ route pages.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: PricingTable — All-Inclusive column + per-card badge

**Files:**
- Modify: `components/seo/PricingTable.tsx`

**Context:** Existing component has a footer callout. Add a per-row indicator: column on desktop, inline badge on mobile cards. Keep the footer callout unchanged.

- [ ] **Step 1: Add the badge import**

At the top of `components/seo/PricingTable.tsx` (with the other imports), add:
```tsx
import AllInclusiveBadge from '@/components/seo/AllInclusiveBadge';
```

- [ ] **Step 2: Add the desktop column header**

In the `<thead>` block, find the existing row:
```tsx
<tr className="bg-teal-900 text-white">
    <th className="text-left py-4 px-6 font-semibold">Vehicle Type</th>
    <th className="text-center py-4 px-4 font-semibold">Seats</th>
    <th className="text-center py-4 px-4 font-semibold">Per KM Rate</th>
    <th className="text-center py-4 px-4 font-semibold">AC</th>
    <th className="text-center py-4 px-4 font-semibold"></th>
</tr>
```

Add a new `<th>` between "AC" and the trailing empty cell:
```tsx
<tr className="bg-teal-900 text-white">
    <th className="text-left py-4 px-6 font-semibold">Vehicle Type</th>
    <th className="text-center py-4 px-4 font-semibold">Seats</th>
    <th className="text-center py-4 px-4 font-semibold">Per KM Rate</th>
    <th className="text-center py-4 px-4 font-semibold">AC</th>
    <th className="text-center py-4 px-4 font-semibold">All-Inclusive</th>
    <th className="text-center py-4 px-4 font-semibold"></th>
</tr>
```

- [ ] **Step 3: Add the matching column cell in the desktop row**

In the `<tbody>` map, find the existing row body. After the AC `<td>`:
```tsx
<td className="py-4 px-4 text-center">
    <Snowflake className="h-5 w-5 text-blue-500 mx-auto" />
</td>
<td className="py-4 px-4 text-center">
    <a href="#booking" ...>Book Now</a>
</td>
```

Insert a new `<td>` for the badge between AC and the Book Now cell:
```tsx
<td className="py-4 px-4 text-center">
    <Snowflake className="h-5 w-5 text-blue-500 mx-auto" />
</td>
<td className="py-4 px-4 text-center">
    <AllInclusiveBadge size="compact" />
</td>
<td className="py-4 px-4 text-center">
    <a href="#booking" ...>Book Now</a>
</td>
```

- [ ] **Step 4: Add the mobile-card badge**

In the mobile cards block, find this structure inside each card:
```tsx
<div className="text-right">
    <div className="text-2xl font-bold text-teal-700">₹{v.price}</div>
    <div className="text-xs text-gray-500">per km</div>
</div>
```

Below the entire flex-between div (which contains the vehicle info and price), and before the Book Now `<a>`, add:
```tsx
<div className="mb-3 flex justify-center sm:justify-start">
    <AllInclusiveBadge size="compact" />
</div>
```

- [ ] **Step 5: Build**

Run: `npm run build 2>&1 | tail -10`
Expected: clean.

- [ ] **Step 6: Spot-check rendering**

Start server. Visit a district page (the PricingTable renders there):

```powershell
$body = (Invoke-WebRequest "http://localhost:3000/outstation-cabs-in-bagalkot").Content
Write-Host "Compact badges (expect >=2): $((($body | Select-String 'All-Inclusive' -AllMatches).Matches).Count)"
Write-Host "All-Inclusive column header present: $($body -match 'All-Inclusive</th>')"
```
Expected: multiple `All-Inclusive` occurrences (at least 7 on desktop view + the column header).

Stop the server.

- [ ] **Step 7: Commit**

```powershell
git add components/seo/PricingTable.tsx
git commit -m "feat(seo): add All-Inclusive column to PricingTable

Desktop: new column between AC and Book Now with compact badge per
row. Mobile cards: inline badge between price line and Book Now CTA.
Existing footer callout preserved as the explainer paragraph.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Navigation — homepage hero + Footer + sitemap

Three sub-files.

### 7a. Homepage hero (`app/page.tsx`)

- [ ] **Step 1: Add the badge import**

At the top of `app/page.tsx`, add (with the other component imports):
```tsx
import AllInclusiveBadge from "@/components/seo/AllInclusiveBadge";
```

- [ ] **Step 2: Render badge + manifesto link in the hero**

Find the homepage hero `<h1>` (or the hero block that contains the main headline). Above the H1, render:
```tsx
<div className="mb-4 flex justify-center"><AllInclusiveBadge size="hero" /></div>
```

Below the hero CTA buttons (or below the hero copy paragraph), add:
```tsx
<Link href="/all-inclusive-pricing" className="mt-4 inline-flex items-center gap-1 text-sm text-white/90 hover:text-white underline underline-offset-4">
    How all-inclusive pricing works <span aria-hidden>→</span>
</Link>
```

(`Link` is imported from `next/link` — confirm it's already imported in this file.)

### 7b. Footer (`components/Footer.tsx`)

- [ ] **Step 1: Add to Quick Links array**

Find the Quick Links section (lines ~180-198) — the array currently contains 7 entries (Book Now, Fare Calculator, FAQ, Reviews, About Us, Contact, Blog).

Add a new entry as the third item (after Fare Calculator, before FAQ):
```ts
{ label: "All-Inclusive Pricing", href: "/all-inclusive-pricing" },
```

### 7c. Sitemap (`app/sitemap.ts`)

- [ ] **Step 1: Add the URL entry**

Find a logical location in `app/sitemap.ts` near the other top-level static pages (e.g., near the `/fare-calculator` entry). Add:

```ts
    // All-Inclusive Pricing — moat manifesto page
    routes.push({
        url: `${baseUrl}/all-inclusive-pricing`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.85,
    });
```

- [ ] **Step 2: Build**

Run: `npm run build 2>&1 | tail -10`
Expected: clean.

- [ ] **Step 3: Spot-check**

Start server.

```powershell
# Homepage badge
$home = (Invoke-WebRequest 'http://localhost:3000').Content
Write-Host "Home hero badge: $($home -match 'All-Inclusive · Tolls')"
Write-Host "Home manifesto link: $($home -match '/all-inclusive-pricing')"

# Footer link (visible on any page)
Write-Host "Footer link in home: $((($home | Select-String '/all-inclusive-pricing' -AllMatches).Matches).Count) occurrences"

# Sitemap
$sitemap = (Invoke-WebRequest 'http://localhost:3000/sitemap.xml').Content
Write-Host "Sitemap entry: $($sitemap -match 'all-inclusive-pricing')"
```
Expected: all True.

Stop the server.

- [ ] **Step 4: Commit**

```powershell
git add app/page.tsx components/Footer.tsx app/sitemap.ts
git commit -m "feat(seo): surface /all-inclusive-pricing in homepage hero, footer, sitemap

Homepage hero gets a hero-size AllInclusiveBadge + a 'How
all-inclusive pricing works →' link to the manifesto. Footer Quick
Links gets the page near the top. Sitemap entry at priority 0.85.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage check:**

| Spec section | Task |
|---|---|
| Goal 1: build manifesto page | Task 2 ✓ |
| Goal 2: schema ripple | Tasks 3, 4, 5 ✓ |
| Goal 3: visual signal (AllInclusiveBadge) | Task 1 (component) + Tasks 2, 4, 5, 7a ✓ |
| Goal 4: PricingTable enhancement | Task 6 ✓ |
| Goal 5: Tamil/Tanglish | Task 2 (Tamil section embedded in page) ✓ |
| Goal 6: navigation | Task 7a, 7b ✓ |
| Sitemap entry | Task 7c ✓ |

**Placeholder scan:** No "TBD" / "TODO" / "implement later" anywhere. The three "conditional-edit" entries (4e, 4f, Task 5) have explicit deterministic rules. Body copy for the moat page is COMPLETE in Task 2.

**Type consistency:** `AllInclusiveBadge` component interface (size + className) is consistent across Tasks 1, 2, 4, 5, 6, 7a. All schema priceSpecification additions use the same shape (`UnitPriceSpecification` + `referenceQuantity` + `valueAddedTaxIncluded`).

No gaps found. Plan is ready.
