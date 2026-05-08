// Phase 1.5 — scan codebase to determine which target_url pages already exist.
// Reads data/keyword-clusters.json, fills in page_exists + existing_page_path,
// writes the result back to the same file.

import fs from "node:fs";
import path from "node:path";
import { ALL_DISTRICTS, DISTRICT_BY_SLUG, SERVICE_TYPES } from "../lib/districts";
import { resolveAlias } from "../lib/seo-aliases";
import { parseRouteSlug } from "../lib/routes";
import { getAllBlogSlugs } from "../lib/blog-posts";

type Cluster = {
    cluster_id: string;
    type: string;
    priority: string;
    target_url: string;
    alt_urls: string[];
    head_keyword: string;
    total_volume: number;
    page_exists: boolean | null;
    existing_page_path: string | null;
    all_keywords: unknown[];
    notes: string;
};

const CLUSTER_FILE = path.resolve("data/keyword-clusters.json");
const clusters: Cluster[] = JSON.parse(fs.readFileSync(CLUSTER_FILE, "utf8"));

const blogSlugs = new Set(getAllBlogSlugs());
const districtSlugs = new Set(ALL_DISTRICTS.map(d => d.slug));
const serviceTypeIds = new Set(SERVICE_TYPES.map(s => s.id));

const AIRPORT_SLUGS = new Set([
    "chennai-airport", "bangalore-airport", "hyderabad-airport", "kochi-airport",
    "coimbatore-airport", "madurai-airport", "trichy-airport", "trivandrum-airport",
    "mangalore-airport", "calicut-airport",
]);

const STATIC_PAGES = new Set([
    "/", "/about", "/contact", "/fare-calculator", "/blog", "/book-now",
    "/faq", "/reviews", "/terms-and-conditions", "/privacy-policy",
    "/drop-taxi", "/one-way-taxi", "/outstation-cabs", "/round-trip-taxi", "/airport-taxi",
    "/sedan-taxi", "/suv-taxi", "/innova-crysta-taxi", "/tempo-traveller", "/luxury-taxi",
]);

function checkUrl(url: string): { exists: boolean; pathHint: string | null } {
    // Static page (exact match)
    if (STATIC_PAGES.has(url)) {
        const slug = url === "/" ? "page.tsx" : `${url.slice(1)}/page.tsx`;
        return { exists: true, pathHint: `app/${slug}` };
    }

    // Service-type city page: /{service}-in-{citySlug}
    const cityMatch = url.match(/^\/([a-z-]+-(?:in|to))-([a-z-]+)$/);
    if (cityMatch) {
        const rawSlug = url.slice(1);
        const resolved = resolveAlias(rawSlug);
        // Walk known service-type prefixes
        for (const st of SERVICE_TYPES) {
            const prefix = `${st.id}-in-`;
            if (resolved.startsWith(prefix)) {
                const districtSlug = resolved.slice(prefix.length);
                if (districtSlugs.has(districtSlug)) {
                    return { exists: true, pathHint: "app/[slug]/page.tsx" };
                }
            }
        }
        return { exists: false, pathHint: null };
    }

    // Route page: /route/{from}-to-{to}-taxi
    const routeMatch = url.match(/^\/route\/(.+)$/);
    if (routeMatch) {
        const route = parseRouteSlug(routeMatch[1]);
        return { exists: !!route, pathHint: route ? "app/route/[routeSlug]/page.tsx" : null };
    }

    // Airport page: /airport-taxi/{slug}
    const airportMatch = url.match(/^\/airport-taxi\/(.+)$/);
    if (airportMatch) {
        if (AIRPORT_SLUGS.has(airportMatch[1])) {
            return { exists: true, pathHint: "app/airport-taxi/[airportSlug]/page.tsx" };
        }
        return { exists: false, pathHint: null };
    }

    // Blog post: /blog/{slug}
    const blogMatch = url.match(/^\/blog\/(.+)$/);
    if (blogMatch) {
        if (blogSlugs.has(blogMatch[1])) {
            return { exists: true, pathHint: "app/blog/[slug]/page.tsx" };
        }
        return { exists: false, pathHint: null };
    }

    return { exists: false, pathHint: null };
}

let exists = 0;
let missing = 0;
const missingList: { id: string; url: string; vol: number; type: string; pri: string }[] = [];
const existingList: { id: string; url: string; vol: number; type: string; pri: string }[] = [];

for (const c of clusters) {
    const r = checkUrl(c.target_url);
    c.page_exists = r.exists;
    c.existing_page_path = r.pathHint;
    if (r.exists) {
        exists++;
        existingList.push({ id: c.cluster_id, url: c.target_url, vol: c.total_volume, type: c.type, pri: c.priority });
    } else {
        missing++;
        missingList.push({ id: c.cluster_id, url: c.target_url, vol: c.total_volume, type: c.type, pri: c.priority });
    }
}

fs.writeFileSync(CLUSTER_FILE, JSON.stringify(clusters, null, 2) + "\n");

console.log(`=== TARGET PAGE SCAN ===`);
console.log(`Total clusters: ${clusters.length}`);
console.log(`  Exists already: ${exists}`);
console.log(`  Need creating:  ${missing}`);

console.log(`\n--- ALREADY EXISTS (${exists}) ---`);
existingList
    .sort((a, b) => b.vol - a.vol)
    .forEach(e => console.log(`  [${e.pri}/${e.type}] ${e.url.padEnd(58)}  ${e.vol.toLocaleString("en-IN")} vol  (${e.id})`));

console.log(`\n--- NEEDS CREATING (${missing}) ---`);
missingList
    .sort((a, b) => b.vol - a.vol)
    .forEach(e => console.log(`  [${e.pri}/${e.type}] ${e.url.padEnd(58)}  ${e.vol.toLocaleString("en-IN")} vol  (${e.id})`));
