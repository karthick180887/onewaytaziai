// scripts/seo/generate-briefs.ts — generate per-cluster content briefs from
// the cluster + SERP + competitor-page data.
//
// Output: briefs/{cluster_id}.md (one file per P1 cluster).

import fs from "node:fs";
import path from "node:path";
import { ALL_DISTRICTS, DISTRICT_BY_SLUG } from "../../lib/districts";
import { getAllRoutes } from "../../lib/routes";
import { resolveAlias } from "../../lib/seo-aliases";

type Cluster = {
    cluster_id: string;
    type: "A" | "B" | "C" | "D" | "E";
    priority: string;
    target_url: string;
    head_keyword: string;
    total_volume: number;
    page_exists: boolean;
    existing_page_path: string | null;
    all_keywords: { kw: string; vol: number; kd: number; comp: string; rank: number }[];
    notes: string;
    alt_urls: string[];
};

type SerpItem = { rank_absolute?: number; title?: string; url?: string; domain?: string; description?: string; type: string; is_featured_snippet?: boolean };
type SerpAnalysis = {
    cluster_id: string;
    head_keyword: string;
    serp: {
        items: SerpItem[];
        paa_questions: string[];
        related_searches: string[];
        serp_features: string[];
    };
};

type CompetitorPage = {
    url: string;
    rank: number;
    fetch_ok: boolean;
    fetch_error: string | null;
    title: string | null;
    title_length: number;
    meta_description: string | null;
    h1: string[];
    h2: string[];
    h3: string[];
    word_count: number;
    schema_types: string[];
    faq_count: number;
    faq_questions: string[];
    has_pricing_table: boolean;
    has_distance_info: boolean;
};

const clusters: Cluster[] = JSON.parse(fs.readFileSync("data/keyword-clusters.json", "utf8"));
const BRIEFS_DIR = path.resolve("briefs");
fs.mkdirSync(BRIEFS_DIR, { recursive: true });

// Pre-compute helpers
const ALL_ROUTES = getAllRoutes();

function loadSerp(id: string): SerpAnalysis | null {
    const p = `data/serp-analysis/${id}.json`;
    return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : null;
}
function loadComp(id: string): { pages: CompetitorPage[] } {
    const p = `data/competitor-pages/${id}.json`;
    return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : { pages: [] };
}

// Parse city/route from cluster id + target_url
function parseTarget(c: Cluster): {
    fromCity?: string;
    toCity?: string;
    cityName?: string;
    citySlug?: string;
    fromSlug?: string;
    toSlug?: string;
    distanceKm?: number;
    fareSedan?: number;
    fareSuv?: number;
    fareCrysta?: number;
} {
    if (c.type === "B") {
        // Route: /route/{from}-to-{to}-taxi
        const m = c.target_url.match(/\/route\/([a-z-]+)-to-([a-z-]+)-taxi$/);
        if (!m) return {};
        const fromSlug = resolveAlias(m[1]);
        const toSlug = resolveAlias(m[2]);
        const fromDistrict = DISTRICT_BY_SLUG.get(fromSlug);
        const toDistrict = DISTRICT_BY_SLUG.get(toSlug);
        if (!fromDistrict || !toDistrict) return { fromSlug, toSlug };
        const route = fromDistrict.popularRoutes.find(r => r.toSlug === toSlug);
        const dist = route?.distanceKm;
        return {
            fromCity: fromDistrict.name,
            toCity: toDistrict.name,
            fromSlug,
            toSlug,
            distanceKm: dist,
            fareSedan: dist ? Math.round(dist * 14 / 10) * 10 : undefined,
            fareSuv: dist ? Math.round(dist * 19 / 10) * 10 : undefined,
            fareCrysta: dist ? Math.round(dist * 21 / 10) * 10 : undefined,
        };
    }
    if (c.type === "A") {
        const m = c.target_url.match(/^\/(?:[a-z-]+-in-)([a-z-]+)$/);
        if (m) {
            const slug = resolveAlias(m[1]);
            const d = DISTRICT_BY_SLUG.get(slug);
            return { cityName: d?.name, citySlug: slug };
        }
    }
    return {};
}

// Internal-link recommendations per cluster
function recommendInternalLinks(c: Cluster, t: ReturnType<typeof parseTarget>): { label: string; href: string; rationale: string }[] {
    const out: { label: string; href: string; rationale: string }[] = [];
    if (c.type === "B" && t.fromSlug && t.toSlug && t.fromCity && t.toCity) {
        // 1. Reverse route
        const reverse = ALL_ROUTES.find(r => r.from.slug === t.toSlug && r.to.slug === t.fromSlug);
        if (reverse) out.push({ label: `${t.toCity} to ${t.fromCity} Taxi (reverse route)`, href: `/route/${reverse.slug}`, rationale: "Reverse-direction commercial route — captures bidirectional intent" });
        // 2. Origin city service hub
        out.push({ label: `${t.fromCity} Drop Taxi (origin city hub)`, href: `/drop-taxi-in-${t.fromSlug}`, rationale: "Origin city service page — covers all routes from origin" });
        // 3. /one-way-taxi service hub
        out.push({ label: `One-Way Taxi (master service)`, href: `/one-way-taxi`, rationale: "Master service hub for funnel-up traffic" });
    } else if (c.type === "A" && t.citySlug && t.cityName) {
        // 1. Top route from this city
        const district = DISTRICT_BY_SLUG.get(t.citySlug);
        if (district && district.popularRoutes.length > 0) {
            const r = district.popularRoutes[0];
            out.push({ label: `${t.cityName} to ${r.to} Taxi`, href: `/route/${t.citySlug}-to-${r.toSlug}-taxi`, rationale: "Top outbound route from this city" });
        }
        // 2. /drop-taxi service hub
        out.push({ label: `Drop Taxi Service`, href: `/drop-taxi`, rationale: "Service hub — explains drop-taxi value prop" });
        // 3. Nearby city in same state or fare calculator
        out.push({ label: `Fare Calculator`, href: `/fare-calculator`, rationale: "Conversion tool — instant quote for any route" });
    } else if (c.type === "C") {
        // Distance/info pages — link to corresponding route page + service hub + related city
        out.push({ label: `Drop Taxi Service`, href: `/drop-taxi`, rationale: "Convert distance-query reader into commercial-intent visitor" });
        out.push({ label: `Fare Calculator`, href: `/fare-calculator`, rationale: "Let reader compute fare for their actual trip" });
        out.push({ label: `One-Way Taxi (service hub)`, href: `/one-way-taxi`, rationale: "Funnel-up to master service term" });
    } else if (c.type === "E") {
        // Tourist guides — link to relevant city page + popular route + drop-taxi hub
        if (t.citySlug) out.push({ label: `${t.cityName} Drop Taxi`, href: `/drop-taxi-in-${t.citySlug}`, rationale: "Local taxi page — captures visitor intent" });
        out.push({ label: `Drop Taxi Service`, href: `/drop-taxi`, rationale: "Service explainer hub" });
        out.push({ label: `Fare Calculator`, href: `/fare-calculator`, rationale: "Convert reader into booking" });
    } else if (c.type === "D") {
        // Hub page — link to popular routes + city + book-now
        out.push({ label: `Chennai Drop Taxi`, href: `/drop-taxi-in-chennai`, rationale: "Highest-volume city — funnel down to commercial city page" });
        out.push({ label: `Chennai to Bangalore Taxi`, href: `/route/chennai-to-bangalore-taxi`, rationale: "Highest-volume route — funnel down" });
        out.push({ label: `Book Now`, href: `/book-now`, rationale: "Direct conversion path" });
    }
    return out;
}

// Recommend schemas based on what top-3 use + page type
function recommendSchemas(c: Cluster, top3: CompetitorPage[]): { schema: string; reason: string }[] {
    const observed = new Set<string>();
    for (const p of top3) for (const s of p.schema_types) observed.add(s);

    const out: { schema: string; reason: string }[] = [];
    out.push({ schema: "BreadcrumbList", reason: "Sitewide pattern; helps SERP breadcrumbs render" });

    if (c.type === "B" || c.type === "A") {
        out.push({ schema: "TaxiService", reason: "Page is a commercial taxi service offer" });
        out.push({ schema: "Product", reason: "Top competitors (Uber/MakeMyTrip) use Product for taxi offerings — supports price, aggregateRating" });
        out.push({ schema: "Offer", reason: "Encapsulate per-vehicle fare with priceCurrency=INR, unitText=per km" });
    }
    if (c.type === "C" || c.type === "E") {
        out.push({ schema: "Article", reason: "Long-form informational content" });
        out.push({ schema: "Person/Author", reason: "E-A-T signal — author byline" });
    }
    if (c.type === "E") {
        out.push({ schema: "ItemList (top tourist places)", reason: "Tourist roundup format — supports rich list result" });
    }
    if (c.type === "C" && c.cluster_id.startsWith("info-")) {
        out.push({ schema: "HowTo", reason: "Distance/route guides are step-by-step content" });
    }
    out.push({ schema: "FAQPage", reason: `Required — ${observed.has("FAQPage") ? "competitors use it" : "competitors DON'T use it (rich-result win opportunity)"}` });
    return out;
}

// Build a featured-snippet-eligible 50-word lede
function suggestSnippetLede(c: Cluster, t: ReturnType<typeof parseTarget>): string {
    if (c.type === "B" && t.fromCity && t.toCity && t.distanceKm) {
        const hrs = Math.floor(t.distanceKm / 55);
        const mins = Math.round((t.distanceKm / 55 - hrs) * 60);
        return `${t.fromCity} to ${t.toCity} by taxi is ${t.distanceKm} km and takes about ${hrs}h ${mins}m via the most common highway route. One-way drop taxi fares start at ₹${t.fareSedan?.toLocaleString("en-IN") ?? "_"} for a sedan, ₹${t.fareSuv?.toLocaleString("en-IN") ?? "_"} for an SUV, and ₹${t.fareCrysta?.toLocaleString("en-IN") ?? "_"} for an Innova Crysta — all-inclusive of tolls, driver bata, and GST.`;
    }
    if (c.type === "A" && t.cityName) {
        return `${t.cityName} taxi service from OneWayTaxi.ai offers one-way drop cabs starting at ₹13/km for a hatchback, ₹14/km sedan, ₹19/km SUV, and ₹22/km Innova Crysta. All vehicles are AC, GPS-tracked, and driven by background-verified drivers. Available 24/7 across ${t.cityName} and outstation routes.`;
    }
    if (c.type === "C") return `[FILL — 40-60 word factual answer to "${c.head_keyword}" with the actual distance / fare / travel-time. Use real numbers from Google Maps; mark TODO if uncertain.]`;
    if (c.type === "D") return `One-way drop taxi service across South India lets you pay only for the kilometres you actually travel — no return-journey charge. Fares start at ₹13/km for a hatchback. Available in 220+ cities across Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana, and Pondicherry. 24/7 booking via website, phone, or WhatsApp.`;
    if (c.type === "E") return `[FILL — 50-word answer naming the top 5-8 attractions in ${t.cityName ?? "the city"} with a one-line "best for" qualifier. Lead with the iconic landmark.]`;
    return "[FILL]";
}

// Merge FAQ questions from PAAs + competitor schemas, dedupe, top 8-10
function buildFaqList(serp: SerpAnalysis | null, comp: { pages: CompetitorPage[] }): string[] {
    const all: string[] = [];
    if (serp) all.push(...serp.serp.paa_questions);
    for (const p of comp.pages) all.push(...p.faq_questions);

    const seen = new Set<string>();
    const dedup: string[] = [];
    for (const q of all) {
        const norm = q.trim().toLowerCase().replace(/[?.]+$/, "").replace(/\s+/g, " ");
        if (!norm) continue;
        if (seen.has(norm)) continue;
        seen.add(norm);
        dedup.push(q.trim().replace(/^[a-z]/, m => m.toUpperCase()));
    }
    return dedup.slice(0, 10);
}

// Suggest H2 sections based on observed competitor patterns + cluster type
function suggestH2Sections(c: Cluster, t: ReturnType<typeof parseTarget>, top3: CompetitorPage[], paa: string[]): string[] {
    const competitorH2 = new Set<string>();
    for (const p of top3) for (const h of p.h2.slice(0, 30)) competitorH2.add(h.slice(0, 80));

    if (c.type === "B" && t.fromCity && t.toCity) {
        return [
            `${t.fromCity} to ${t.toCity} taxi fare table (sedan / SUV / Innova Crysta — including tolls, bata, GST)`,
            `Distance and travel time (with route map data: highways, major towns en route)`,
            `Why choose a one-way drop taxi vs. round trip / bus / train`,
            `Vehicle options for the ${t.fromCity}–${t.toCity} route (which to pick for groups, families, luggage)`,
            `Pickup points in ${t.fromCity} (areas, addresses, landmarks)`,
            `Drop points in ${t.toCity} (popular destinations, hotels, temples, airports)`,
            `Best time to start the trip (morning, night, monsoon advisory)`,
            `Highway tips, food stops, toll plazas en route`,
            `What's included / what's extra (night charges, inter-state permit, parking)`,
            `Sample journey timeline (departure → halt → arrival)`,
            `How to book (online, phone, WhatsApp) — same-day / advance options`,
            `${t.fromCity} to ${t.toCity} taxi reviews from real customers`,
            `Frequently asked questions (8-10 questions)`,
        ];
    }
    if (c.type === "A" && t.cityName) {
        return [
            `${t.cityName} taxi pricing per km (all vehicle categories)`,
            `Popular outstation routes from ${t.cityName} (top 8-10 with fares)`,
            `Local pickup points in ${t.cityName} (areas, airport, railway, bus stand)`,
            `Vehicle types and seating capacity (sedan, SUV, Innova, Crysta, Tempo)`,
            `What's included in the ${t.cityName} taxi fare`,
            `Booking process (3-step: enter route → confirm → driver arrives)`,
            `Same-day and advance booking — 24/7 availability`,
            `Why choose OneWayTaxi.ai for ${t.cityName} cabs`,
            `Customer reviews from ${t.cityName} riders`,
            `${t.cityName} taxi FAQs (8-10 questions)`,
        ];
    }
    if (c.type === "C") {
        return [
            `Quick answer (40-60 word featured-snippet lede)`,
            `Distance breakdown — by road, alternate routes, comparison`,
            `Travel time by vehicle type (sedan/SUV) and traffic conditions`,
            `Recommended route(s) — highway names, via-towns, road quality`,
            `Best time to travel (early morning vs. evening, monsoon advisory)`,
            `Petrol/diesel cost estimate (for self-drive comparison)`,
            `Taxi fare estimate (sedan / SUV / Innova) — direct conversion CTA to /route/* page`,
            `Bus, train, flight alternatives (with comparison table)`,
            `Things to do at the destination`,
            `Tips for first-time travellers on this route`,
            `FAQs (8-10 questions)`,
        ];
    }
    if (c.type === "E" && t.cityName) {
        return [
            `Quick overview — top 5 must-see attractions in ${t.cityName}`,
            `Best time to visit ${t.cityName}`,
            `How to reach ${t.cityName} (flight / train / road)`,
            `Top 15-20 tourist places (one H2 per place — name, what to see, timing, entry fee, nearest taxi pickup)`,
            `Day-wise itinerary suggestion (1-day / 2-day / weekend)`,
            `Local food and where to eat`,
            `Where to stay (budget / mid-range / luxury)`,
            `Local transport options — Uber/Ola/auto/Metro vs. private taxi for sightseeing`,
            `Our private taxi tour packages from ${t.cityName} (linked to /drop-taxi-in-${t.citySlug})`,
            `Travel tips and safety`,
            `FAQs (8-10 questions)`,
        ];
    }
    if (c.type === "D") {
        return [
            `What is one-way drop taxi (definition + why it's cheaper)`,
            `One-way taxi fare per km (all vehicle categories with comparison table)`,
            `Routes covered — South India route grid (Tamil Nadu / Kerala / Karnataka / AP / Telangana)`,
            `One-way vs. round-trip pricing comparison (calculator-friendly)`,
            `Vehicle options (sedan/SUV/Crysta/Tempo Traveller/luxury)`,
            `How one-way drop taxi works (4-step booking flow)`,
            `What's included / extras (night charges, permits, tolls)`,
            `Why choose OneWayTaxi.ai (verified drivers, 24/7, GPS-tracked, no hidden charges)`,
            `Coverage cities (linked grid of all city service pages)`,
            `Customer reviews and trust signals`,
            `Frequently asked questions (10+ questions)`,
        ];
    }
    return [];
}

function differentiationAngles(c: Cluster, t: ReturnType<typeof parseTarget>, top3: CompetitorPage[]): string[] {
    const out: string[] = [];
    const noFaq = top3.every(p => p.faq_count === 0);
    const noPricing = top3.every(p => !p.has_pricing_table);
    const noSchema = top3.every(p => p.schema_types.length === 0);

    if (noFaq) out.push("**FAQ rich-result win** — none of the top-3 competitors use FAQPage schema. Add 8-10 FAQs with FAQPage JSON-LD.");
    if (noPricing) out.push("**Transparent fare table** — competitors don't publish a per-km fare table. Add inline table with sedan / SUV / Crysta rates including tolls + bata + GST.");
    if (noSchema) out.push("**Full schema stack** — competitors have minimal/no JSON-LD. Add BreadcrumbList + TaxiService + Offer + FAQPage at minimum.");

    // Type-specific angles always emitted
    if (c.type === "A" && t.cityName) {
        out.push(`**Per-route fare grid for ${t.cityName}** — competitor pages list outstation routes generically. Build a sortable table of top-30 outbound routes with distance + sedan/SUV/Crysta fares. Lets visitors get answers without leaving the page.`);
        out.push(`**Hyperlocal pickup points** — name actual ${t.cityName} neighbourhoods (Gandhipuram, RS Puram, Saibaba Colony, Singanallur, etc. for Coimbatore). Top SERP pages stop at "city-wide".`);
        out.push(`**Local-language micro-trust signals** — driver names, fleet badge numbers, "Tamil-speaking driver" toggle. Competitors miss the regional cue.`);
    }
    if (c.type === "B" && t.distanceKm) {
        out.push(`**Real route data** — list actual highway names, via-towns, food stops, toll plazas. Most competitor pages are generic; we have real ${t.distanceKm} km route knowledge.`);
        out.push(`**Reverse route + related routes grid** — internal-link grid lets users explore the route ecosystem. Pure SEO ranking-juice gain.`);
        out.push(`**Distance + travel time at the top** — featured-snippet lede with hard numbers. Many competitors bury distance in the FAQ.`);
    }
    if (c.type === "C") {
        out.push(`**Conversion CTA above the fold** — competitor distance pages don't push booking. We put a "book taxi for this route" CTA inside the snippet-eligible lede.`);
        out.push(`**Sectioned answer for AI Overview eligibility** — short factual answers (distance, time, fare) at the very top, before any marketing copy. Lets Google quote us in the AI Overview.`);
        out.push(`**Multi-mode comparison table** — taxi vs. bus vs. train side-by-side. Most distance pages cover only their own mode.`);
    }
    if (c.type === "E") {
        out.push(`**Per-attraction taxi pickup link** — for each tourist spot, link the corresponding route/city taxi page so the user can book transport instantly. No competitor monetises tourist guides this way.`);
        out.push(`**Real itinerary tables** — most tourist guides are listicles with no day-plan structure. Add 1-day, 2-day, weekend itineraries with timings.`);
        out.push(`**Local SEO signal cluster** — embed map of all attractions, link state hub, link nearest airport taxi page. Treats the post as a hub, not a leaf.`);
    }
    if (c.type === "D") {
        out.push(`**City-by-city coverage grid** — link to all 220+ city service pages from the hub. Rare structural advantage over thin competitor pages (avg 1,076 words).`);
        out.push(`**Round-trip vs one-way calculator** — embedded calculator showing savings for popular routes. Differentiation against text-only competitors.`);
        out.push(`**Vehicle-tier × route matrix** — show 5 vehicles × 10 popular routes = 50-cell fare grid. Captures long-tail variants in one render.`);
    }

    return out.slice(0, 5);
}

function pageStatusForCluster(c: Cluster): "CREATE NEW" | "EDIT-AND-EXPAND" | "REWRITE" {
    if (!c.page_exists) return "CREATE NEW";
    if (c.cluster_id === "hub-one-way-taxi") return "REWRITE"; // explicit per Phase 2 decision
    // Programmatic city + route pages: edit-and-expand at the data/template level
    return "EDIT-AND-EXPAND";
}

function heroImage(c: Cluster, t: ReturnType<typeof parseTarget>): { concept: string; filename: string; alt: string } {
    if (c.type === "B") {
        const slug = `${t.fromSlug}-to-${t.toSlug}`;
        return {
            concept: `Wide-angle highway shot of the ${t.fromCity}→${t.toCity} route — recognizable landmark or signage in frame, with a sedan in foreground (rear-3/4 view). Warm morning light. Tamil/Kannada/Malayalam signboard if visible adds locality.`,
            filename: `/images/routes/${slug}.jpg`,
            alt: `${t.fromCity} to ${t.toCity} drop taxi — highway route via NH${t.distanceKm ? ` covering ${t.distanceKm} km` : ""}`,
        };
    }
    if (c.type === "A" && t.cityName) {
        return {
            concept: `Iconic ${t.cityName} skyline / landmark with a clean sedan or SUV in mid-foreground. Daylight, professional driver visible at door. City name should be implicit through landmark recognition.`,
            filename: `/images/cities/${t.citySlug}.jpg`,
            alt: `${t.cityName} taxi service — book one-way drop cab from OneWayTaxi.ai`,
        };
    }
    if (c.type === "C") {
        return {
            concept: `Map-illustration overlay on a route landscape photo. Shows distance/highway visually. No taxi in the shot — let it look like a travel-information page hero.`,
            filename: `/images/info/${c.cluster_id}.jpg`,
            alt: `${c.head_keyword} — distance, route options, and travel time`,
        };
    }
    if (c.type === "E" && t.cityName) {
        return {
            concept: `Wide cinematic shot of ${t.cityName}'s most-recognized monument or beach (Marina Beach for Chennai). Golden-hour lighting. People in frame add scale.`,
            filename: `/images/tourist/${t.citySlug}.jpg`,
            alt: `Best tourist places to visit in ${t.cityName}`,
        };
    }
    if (c.type === "D") {
        return {
            concept: `Aerial highway shot through South India landscape with multiple sedans visible in convoy. Conveys "across the south, all routes."`,
            filename: `/images/hub/${c.cluster_id}.jpg`,
            alt: `One-way drop taxi service across South India`,
        };
    }
    return { concept: "TBD", filename: "/images/og-default.jpg", alt: c.head_keyword };
}

// MAIN — generate one brief per P1 cluster
const p1 = clusters.filter(c => c.priority === "P1");
console.log(`Generating ${p1.length} briefs...`);

for (const c of p1) {
    const t = parseTarget(c);
    const serp = loadSerp(c.cluster_id);
    const comp = loadComp(c.cluster_id);
    const top3 = comp.pages.filter(p => p.fetch_ok);
    const top3Word = top3.length ? top3.reduce((s, p) => s + p.word_count, 0) / top3.length : 1500;
    const top3H2 = top3.length ? Math.max(...top3.map(p => p.h2.length)) : 8;
    const wordTarget = Math.max(1500, Math.round(top3Word * 1.25));
    const h2Target = Math.max(8, Math.round(top3H2 * 1.1));
    const faqList = buildFaqList(serp, comp);
    const h2Sections = suggestH2Sections(c, t, top3, serp?.serp.paa_questions ?? []);
    const schemas = recommendSchemas(c, top3);
    const internalLinks = recommendInternalLinks(c, t);
    const diff = differentiationAngles(c, t, top3);
    const lede = suggestSnippetLede(c, t);
    const status = pageStatusForCluster(c);
    const image = heroImage(c, t);

    const md: string[] = [];
    md.push(`# Brief — ${c.cluster_id}`);
    md.push(`> ${c.head_keyword} · ${c.total_volume.toLocaleString("en-IN")}/mo · Type ${c.type} · Priority ${c.priority}`);
    md.push("");
    md.push(`## 1. Target page\n`);
    md.push(`- **URL:** \`${c.target_url}\``);
    if (c.alt_urls?.length) md.push(`- **Alt URLs (canonicalize to target):** ${c.alt_urls.map(u => `\`${u}\``).join(", ")}`);
    md.push(`- **Page status:** ${status}`);
    if (c.existing_page_path) md.push(`- **Existing template:** \`${c.existing_page_path}\``);
    if (c.notes) md.push(`- **Notes:** ${c.notes}`);
    md.push("");

    md.push(`## 2. Keywords & volumes\n`);
    md.push(`Primary: **${c.head_keyword}**\n`);
    md.push(`| Keyword | Volume | KD | Top competitor | Their rank |`);
    md.push(`|---|---:|---:|---|---:|`);
    for (const kw of c.all_keywords.slice(0, 15)) {
        md.push(`| ${kw.kw} | ${kw.vol.toLocaleString("en-IN")} | ${kw.kd} | ${kw.comp} | #${kw.rank} |`);
    }
    if (c.all_keywords.length > 15) md.push(`| _… ${c.all_keywords.length - 15} more keywords_ | | | | |`);
    md.push("");

    md.push(`## 3. SERP intelligence\n`);
    if (serp) {
        md.push(`- **SERP features observed:** ${serp.serp.serp_features.join(", ")}`);
        if (serp.serp.serp_features.includes("ai_overview")) md.push(`- ⚠️ **AI Overview shows for this query** — write a tight 40-60 word factual lede that Google can cite.`);
        md.push(`- **Top organic results (rank · domain · title):**`);
        const top10 = serp.serp.items.filter(it => it.type === "organic" || it.is_featured_snippet).slice(0, 10);
        for (const it of top10) {
            md.push(`  - #${it.rank_absolute ?? "?"} · ${it.domain ?? "?"}${it.is_featured_snippet ? " [featured snippet]" : ""}${it.title ? ` · "${it.title}"` : ""}`);
        }
        md.push("");
        if (serp.serp.paa_questions.length) {
            md.push(`- **People Also Ask (${serp.serp.paa_questions.length}):**`);
            for (const q of serp.serp.paa_questions) md.push(`  - ${q}`);
            md.push("");
        }
        if (serp.serp.related_searches.length) {
            md.push(`- **Related searches (${serp.serp.related_searches.length} — first 12 shown):**`);
            for (const r of serp.serp.related_searches.slice(0, 12)) md.push(`  - ${r}`);
            md.push("");
        }
    } else {
        md.push(`- ⚠️ No SERP data available for this cluster.\n`);
    }

    md.push(`## 4. Top 3 competitor pages\n`);
    if (top3.length === 0) {
        md.push(`⚠️ All 3 fetches failed — see SERP top results above. Manual review required.\n`);
    } else {
        md.push(`| # | URL | Words | H2 | H3 | Schemas | FAQs |`);
        md.push(`|---|---|---:|---:|---:|---|---:|`);
        for (const p of top3) {
            md.push(`| #${p.rank} | ${p.url} | ${p.word_count} | ${p.h2.length} | ${p.h3.length} | ${p.schema_types.join("/") || "—"} | ${p.faq_count} |`);
        }
        md.push("");
        // Top H2s observed
        const h2Sample = new Set<string>();
        for (const p of top3) for (const h of p.h2.slice(0, 12)) h2Sample.add(h.slice(0, 90));
        if (h2Sample.size > 0) {
            md.push(`### Sample H2s observed (top competitor pages):\n`);
            for (const h of [...h2Sample].slice(0, 18)) md.push(`- ${h}`);
            md.push("");
        }
    }

    md.push(`## 5. Targets for our page\n`);
    md.push(`- **Word count:** ${wordTarget}+ (top-3 avg ${Math.round(top3Word)} × 1.25)`);
    md.push(`- **H2 sections:** ${h2Target}+ (top-3 max ${top3H2})`);
    md.push(`- **FAQ count:** 8-10 (use list in section 7 below)`);
    md.push(`- **Schemas required:**`);
    for (const s of schemas) md.push(`  - **${s.schema}** — ${s.reason}`);
    md.push("");

    md.push(`## 6. Required H2 sections (in order)\n`);
    h2Sections.forEach((h, i) => md.push(`${i + 1}. ${h}`));
    md.push("");

    md.push(`## 7. FAQ list (use these 8-10)\n`);
    if (faqList.length === 0) md.push(`_No PAA / competitor FAQs available — use generic taxi-route FAQs from existing seo-content.ts as starting point._`);
    else faqList.slice(0, 10).forEach((q, i) => md.push(`${i + 1}. ${q}${q.endsWith("?") ? "" : "?"}`));
    md.push("");

    md.push(`## 8. Featured-snippet-eligible lede (40-60 words, place at top of page)\n`);
    md.push(`> ${lede}`);
    md.push("");

    md.push(`## 9. Required tables\n`);
    if (c.type === "B" && t.distanceKm) {
        md.push(`### Fare table\n`);
        md.push(`| Vehicle | Per km | Estimated total (${t.distanceKm} km) |`);
        md.push(`|---|---:|---:|`);
        md.push(`| Sedan (Etios/Dzire/Xcent) | ₹14 | ₹${t.fareSedan?.toLocaleString("en-IN")} |`);
        md.push(`| SUV (Ertiga/Innova) | ₹19 | ₹${t.fareSuv?.toLocaleString("en-IN")} |`);
        md.push(`| Innova Crysta | ₹21 | ₹${t.fareCrysta?.toLocaleString("en-IN")} |`);
        md.push(`| Tempo Traveller (12-seater) | call | _on request_ |`);
        md.push("");
        md.push(`_Includes tolls, driver bata (₹400/day TN), GST. Excludes night charges (₹250-500), inter-state permit, and parking._`);
        md.push("");
        md.push(`### Distance & travel time\n`);
        const hrs = Math.floor(t.distanceKm / 55);
        const mins = Math.round((t.distanceKm / 55 - hrs) * 60);
        md.push(`| Metric | Value |`);
        md.push(`|---|---|`);
        md.push(`| Distance by road | ${t.distanceKm} km (verify via Google Maps before publish) |`);
        md.push(`| Estimated travel time | ${hrs}h ${mins}m at average 55 km/h |`);
        md.push(`| Highway | TODO — fill from lib/routes.ts HIGHWAY_DATA if defined |`);
        md.push(`| Toll plazas | TODO — list FASTag-eligible plazas |`);
        md.push("");
    } else if (c.type === "A") {
        md.push(`### Per-km pricing table (apply to all city service pages)\n`);
        md.push(`| Vehicle | Per km | Seats | Best for |`);
        md.push(`|---|---:|---:|---|`);
        md.push(`| Hatchback / Mini | ₹13 | 4 | Solo / couple, short outstation |`);
        md.push(`| Sedan (Etios/Dzire) | ₹14 | 4 | Families up to 4 with light luggage |`);
        md.push(`| SUV (Ertiga/Innova) | ₹19 | 7 | 5-7 adults, more luggage, hill stations |`);
        md.push(`| Innova Crysta | ₹21 | 7 | Premium 7-seat, captain seats, long-distance comfort |`);
        md.push("");
    } else if (c.type === "C" && c.cluster_id === "info-tirupati-arunachalam") {
        md.push(`### Distance comparison table\n`);
        md.push(`| Mode | Distance | Time | Indicative cost |`);
        md.push(`|---|---:|---|---|`);
        md.push(`| Car / taxi | TODO km | TODO h | ₹TODO sedan / ₹TODO SUV (link /route/tirupati-to-tiruvannamalai-taxi) |`);
        md.push(`| Bus | TODO km | TODO h | ₹TODO |`);
        md.push(`| Train (Tirupati → Tiruvannamalai) | TODO km | TODO h | ₹TODO |`);
        md.push("");
    }

    md.push(`## 10. Internal links (3 mandatory, contextually placed — NOT in a footer dump)\n`);
    internalLinks.forEach((l, i) => md.push(`${i + 1}. **${l.label}** → \`${l.href}\` _${l.rationale}_`));
    md.push("");

    md.push(`## 11. Hero image\n`);
    md.push(`- **Concept:** ${image.concept}`);
    md.push(`- **Suggested filename:** \`${image.filename}\``);
    md.push(`- **Alt text:** _${image.alt}_`);
    md.push(`- **Add OpenGraph image** at the same path (1200×630).`);
    md.push("");

    md.push(`## 12. What competitors don't cover (differentiation angles)\n`);
    diff.forEach((d, i) => md.push(`${i + 1}. ${d}`));
    md.push("");

    md.push(`## 13. Build sequence for Phase 5\n`);
    if (status === "CREATE NEW") {
        md.push(`1. Create the page file at the appropriate location (\`app/blog/[slug]/...\` or matching pattern).`);
        md.push(`2. Add hero image to \`/public${image.filename}\` (placeholder OK if not yet sourced — mark TODO).`);
        md.push(`3. Build the page with sections per #6 above, FAQs from #7, lede from #8, schemas from #5.`);
        md.push(`4. Add 3 internal links per #10, contextually within copy.`);
        md.push(`5. Update sitemap, run lint + tsc, atomic commit.`);
    } else if (status === "EDIT-AND-EXPAND") {
        md.push(`1. The base page is generated programmatically. Edit \`lib/seo-content.ts\` (city pages) or \`lib/routes.ts\` (route pages) to override defaults for this specific cluster's slug.`);
        md.push(`2. Add per-cluster H2 sections (per #6) via inline overrides or new component sections — match existing template style.`);
        md.push(`3. Expand FAQs per #7 inside \`getFAQs()\` for this slug.`);
        md.push(`4. Verify schemas per #5 are present in SchemaMarkup component.`);
        md.push(`5. Add 3 contextual internal links from #10.`);
        md.push(`6. Run lint + tsc, atomic commit.`);
    } else {
        md.push(`1. Treat the existing /one-way-taxi page as scaffolding. Rewrite the body sections per #6.`);
        md.push(`2. Replace existing FAQs with the 10 from #7.`);
        md.push(`3. Verify schemas per #5.`);
        md.push(`4. Update sitemap lastmod, run lint + tsc, atomic commit.`);
    }
    md.push("");

    md.push(`## 14. Acceptance checklist\n`);
    md.push(`- [ ] Word count ≥ ${wordTarget}`);
    md.push(`- [ ] H2 sections ≥ ${h2Target}`);
    md.push(`- [ ] FAQ count ≥ 8 (with FAQPage JSON-LD)`);
    md.push(`- [ ] All schemas present and validated`);
    md.push(`- [ ] Featured-snippet lede in first 100 words`);
    md.push(`- [ ] Hero image rendered with proper alt`);
    md.push(`- [ ] 3 internal links placed contextually (not in footer dump)`);
    md.push(`- [ ] Sitemap updated with lastmod`);
    md.push(`- [ ] Tested locally — no 404s, schemas validate via Schema.org validator`);
    md.push(`- [ ] No verbatim copy from competitor pages (paraphrase only)`);
    md.push("");

    fs.writeFileSync(path.join(BRIEFS_DIR, `${c.cluster_id}.md`), md.join("\n"));
    console.log(`  ✓ briefs/${c.cluster_id}.md (${md.length} lines)`);
}

console.log(`\nDone. ${p1.length} briefs written to ${BRIEFS_DIR}/`);
