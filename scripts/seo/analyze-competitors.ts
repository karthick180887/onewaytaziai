// scripts/seo/analyze-competitors.ts — fetch top-3 ranking competitor pages per P1 cluster,
// extract title/H1/H2s/H3s/word count/schema/FAQs/links. Saves per-cluster competitor analysis.
//
// Uses plain HTTP (Node fetch) + regex parsing — no DOM library to avoid adding dependencies.
// Rate-limited to 1 page fetch per second. Skips URLs with 2 fetch failures.

import fs from "node:fs";
import path from "node:path";

const SERP_DIR = path.resolve("data/serp-analysis");
const OUT_DIR = path.resolve("data/competitor-pages");
fs.mkdirSync(OUT_DIR, { recursive: true });

const UA = "Mozilla/5.0 (compatible; OneWayTaxiSEOBot/1.0; +https://onewaytaxi.ai)";

let lastFetchAt = 0;
async function rateLimit() {
    const since = Date.now() - lastFetchAt;
    const waitMs = Math.max(0, 1000 - since);
    if (waitMs > 0) await new Promise(r => setTimeout(r, waitMs));
    lastFetchAt = Date.now();
}

async function fetchHtml(url: string, timeoutMs = 15000): Promise<{ ok: boolean; status?: number; html?: string; error?: string }> {
    await rateLimit();
    const ctrl = new AbortController();
    const tId = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
        const r = await fetch(url, {
            headers: {
                "User-Agent": UA,
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-IN,en;q=0.9",
            },
            signal: ctrl.signal,
            redirect: "follow",
        });
        clearTimeout(tId);
        if (!r.ok) return { ok: false, status: r.status, error: `HTTP ${r.status}` };
        const html = await r.text();
        return { ok: true, status: r.status, html };
    } catch (e) {
        clearTimeout(tId);
        return { ok: false, error: (e as Error).message };
    }
}

function stripTags(s: string): string {
    return s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
}

function extractAll(html: string, regex: RegExp): string[] {
    const out: string[] = [];
    let m;
    while ((m = regex.exec(html)) !== null) out.push(m[1]);
    return out;
}

type PageAnalysis = {
    url: string;
    fetched_at: string;
    rank: number;
    fetch_status: number | null;
    fetch_ok: boolean;
    fetch_error: string | null;
    title: string | null;
    title_length: number;
    meta_description: string | null;
    meta_description_length: number;
    canonical: string | null;
    h1: string[];
    h2: string[];
    h3: string[];
    word_count: number;
    internal_link_count: number;
    external_link_count: number;
    image_count: number;
    schema_types: string[];
    schemas: unknown[];
    faq_count: number;
    faq_questions: string[];
    has_pricing_table: boolean;
    has_distance_info: boolean;
};

function analyze(url: string, rank: number, html: string): PageAnalysis {
    const lower = html.toLowerCase();

    const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]?.trim() ?? null;
    const metaDesc = (html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || [])[1] ?? null;
    const canonical = (html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i) || [])[1] ?? null;

    const h1 = extractAll(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi).map(stripTags).filter(Boolean);
    const h2 = extractAll(html, /<h2[^>]*>([\s\S]*?)<\/h2>/gi).map(stripTags).filter(Boolean);
    const h3 = extractAll(html, /<h3[^>]*>([\s\S]*?)<\/h3>/gi).map(stripTags).filter(Boolean);

    // Body word count (strip head/script/style)
    const body = html
        .replace(/<head[\s\S]*?<\/head>/gi, " ")
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");
    const text = stripTags(body);
    const word_count = text ? text.split(/\s+/).filter(Boolean).length : 0;

    // Links
    const allLinks = extractAll(html, /<a[^>]+href=["']([^"']+)["'][^>]*>/gi);
    let internal = 0, external = 0;
    let host = "";
    try { host = new URL(url).hostname; } catch { /* ignore */ }
    for (const href of allLinks) {
        if (href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
        if (href.startsWith("/") || href.includes(host)) internal++;
        else if (href.startsWith("http")) external++;
    }

    // Images
    const image_count = (html.match(/<img\b/gi) || []).length;

    // Schema (JSON-LD)
    const schemas: unknown[] = [];
    const schemaTypes = new Set<string>();
    let faq_count = 0;
    const faq_questions: string[] = [];

    const jsonldBlocks = extractAll(html, /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    for (const block of jsonldBlocks) {
        try {
            const parsed = JSON.parse(block.trim());
            const items = Array.isArray(parsed) ? parsed : [parsed];
            for (const item of items) {
                schemas.push(item);
                const t = item["@type"];
                if (typeof t === "string") schemaTypes.add(t);
                else if (Array.isArray(t)) for (const tt of t) schemaTypes.add(String(tt));
                if (t === "FAQPage" && Array.isArray(item.mainEntity)) {
                    faq_count = item.mainEntity.length;
                    for (const me of item.mainEntity) {
                        if (typeof me?.name === "string") faq_questions.push(me.name);
                    }
                }
            }
        } catch { /* malformed JSON-LD — skip */ }
    }

    // Heuristics for content patterns
    const has_pricing_table = lower.includes("₹") && (lower.includes("/km") || lower.includes("per km") || lower.includes("per kilometre"));
    const has_distance_info = /\b\d{2,4}\s*km\b/i.test(text) || /distance.{0,30}(\d+)\s*km/i.test(text);

    return {
        url,
        fetched_at: new Date().toISOString(),
        rank,
        fetch_status: 200,
        fetch_ok: true,
        fetch_error: null,
        title,
        title_length: title?.length ?? 0,
        meta_description: metaDesc,
        meta_description_length: metaDesc?.length ?? 0,
        canonical,
        h1,
        h2,
        h3,
        word_count,
        internal_link_count: internal,
        external_link_count: external,
        image_count,
        schema_types: [...schemaTypes],
        schemas,
        faq_count,
        faq_questions,
        has_pricing_table,
        has_distance_info,
    };
}

async function processCluster(file: string) {
    const json = JSON.parse(fs.readFileSync(file, "utf8"));
    const cluster_id = json.cluster_id as string;
    const top3 = (json.serp.items as Array<{ url: string; rank_absolute: number; type: string; is_featured_snippet?: boolean }>)
        .filter(it => it.type === "organic" || it.is_featured_snippet)
        .slice(0, 3);

    const outFile = path.join(OUT_DIR, `${cluster_id}.json`);
    if (fs.existsSync(outFile)) {
        const existing = JSON.parse(fs.readFileSync(outFile, "utf8"));
        if (existing.pages?.length === top3.length) {
            console.log(`  cached -> skip`);
            return;
        }
    }

    const pages: PageAnalysis[] = [];
    for (const r of top3) {
        if (!r.url) continue;
        process.stdout.write(`    #${r.rank_absolute} ${new URL(r.url).hostname} ... `);
        let result = await fetchHtml(r.url);
        if (!result.ok) {
            // retry once
            await new Promise(res => setTimeout(res, 2000));
            result = await fetchHtml(r.url);
        }
        if (!result.ok) {
            console.log(`FAIL ${result.error}`);
            pages.push({
                url: r.url,
                fetched_at: new Date().toISOString(),
                rank: r.rank_absolute,
                fetch_status: result.status ?? null,
                fetch_ok: false,
                fetch_error: result.error ?? "unknown",
                title: null,
                title_length: 0,
                meta_description: null,
                meta_description_length: 0,
                canonical: null,
                h1: [], h2: [], h3: [],
                word_count: 0,
                internal_link_count: 0,
                external_link_count: 0,
                image_count: 0,
                schema_types: [],
                schemas: [],
                faq_count: 0,
                faq_questions: [],
                has_pricing_table: false,
                has_distance_info: false,
            });
            continue;
        }
        const ana = analyze(r.url, r.rank_absolute, result.html!);
        pages.push(ana);
        console.log(`${ana.word_count}w, ${ana.h2.length}H2, ${ana.schema_types.length}schema, ${ana.faq_count}FAQ`);
    }

    fs.writeFileSync(outFile, JSON.stringify({ cluster_id, pages }, null, 2) + "\n");
}

async function main() {
    const files = fs.readdirSync(SERP_DIR).filter(f => f.endsWith(".json"));
    for (const f of files) {
        const cluster_id = f.replace(/\.json$/, "");
        console.log(`\n=== ${cluster_id} ===`);
        await processCluster(path.join(SERP_DIR, f));
    }
    console.log("\nDone.");
}

main().catch(e => { console.error(e); process.exit(1); });
