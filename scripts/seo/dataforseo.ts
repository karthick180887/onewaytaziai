// scripts/seo/dataforseo.ts — DataForSEO live SERP wrapper.
// - Loads creds from .env.local (no hardcoding).
// - Caches responses for SEO_METRICS_CACHE_DAYS (default 7) by query+location hash.
// - Enforces DAILY_DATAFORSEO_USD_CAP per UTC day (default $5).
// - Rate-limits to 1 request per 2 seconds.
// - Costs are recorded to data/dataforseo-spend.json.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = path.resolve(".");
const CACHE_DIR = path.join(ROOT, "data/serp-cache");
const SPEND_FILE = path.join(ROOT, "data/dataforseo-spend.json");

function loadEnv(): Record<string, string> {
    const envPath = path.join(ROOT, ".env.local");
    if (!fs.existsSync(envPath)) throw new Error(".env.local missing");
    const raw = fs.readFileSync(envPath, "utf8");
    const out: Record<string, string> = {};
    for (const line of raw.split(/\r?\n/)) {
        const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
        if (m) out[m[1]] = m[2].trim();
    }
    return out;
}

const env = loadEnv();
const LOGIN = env.DATAFORSEO_LOGIN;
const PASSWORD = env.DATAFORSEO_PASSWORD;
if (!LOGIN || !PASSWORD) throw new Error("DataForSEO creds not in .env.local");

const DAILY_CAP_USD = parseFloat(env.DAILY_DATAFORSEO_USD_CAP || "5");
const CACHE_DAYS = parseInt(env.SEO_METRICS_CACHE_DAYS || "7", 10);
const AUTH = "Basic " + Buffer.from(`${LOGIN}:${PASSWORD}`).toString("base64");

if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

type SpendLog = Record<string, number>; // { "YYYY-MM-DD": cents_USD }
function loadSpend(): SpendLog {
    if (!fs.existsSync(SPEND_FILE)) return {};
    return JSON.parse(fs.readFileSync(SPEND_FILE, "utf8"));
}
function saveSpend(s: SpendLog) {
    fs.writeFileSync(SPEND_FILE, JSON.stringify(s, null, 2) + "\n");
}
function todayUtc(): string {
    return new Date().toISOString().slice(0, 10);
}

function cacheFile(keyword: string, location_code: number, language_code: string): string {
    const h = crypto.createHash("sha256").update(`${keyword}|${location_code}|${language_code}`).digest("hex").slice(0, 16);
    return path.join(CACHE_DIR, `${h}.json`);
}

function isCacheFresh(file: string): boolean {
    if (!fs.existsSync(file)) return false;
    const stat = fs.statSync(file);
    const ageMs = Date.now() - stat.mtimeMs;
    return ageMs < CACHE_DAYS * 24 * 60 * 60 * 1000;
}

let lastReqAt = 0;
async function rateLimit() {
    const since = Date.now() - lastReqAt;
    const waitMs = Math.max(0, 2000 - since);
    if (waitMs > 0) await new Promise(r => setTimeout(r, waitMs));
    lastReqAt = Date.now();
}

export type SerpResult = {
    keyword: string;
    location_code: number;
    language_code: string;
    fetched_at: string;
    cached: boolean;
    cost_usd: number;
    se_results_count: number;
    items: Array<{
        type: string;
        rank_group?: number;
        rank_absolute?: number;
        position?: string;
        title?: string;
        url?: string;
        domain?: string;
        description?: string;
        breadcrumb?: string;
        is_featured_snippet?: boolean;
    }>;
    paa_questions: string[];
    related_searches: string[];
    serp_features: string[];
    raw_task: unknown;
};

export async function fetchSerp(opts: {
    keyword: string;
    location_code?: number; // 2356 = India
    language_code?: string;
    depth?: number;
}): Promise<SerpResult> {
    const location_code = opts.location_code ?? 2356;
    const language_code = opts.language_code ?? "en";
    const depth = opts.depth ?? 20;
    const keyword = opts.keyword.trim();

    const cf = cacheFile(keyword, location_code, language_code);

    if (isCacheFresh(cf)) {
        const cached = JSON.parse(fs.readFileSync(cf, "utf8")) as SerpResult;
        cached.cached = true;
        cached.cost_usd = 0;
        return cached;
    }

    // Cost cap check
    const spend = loadSpend();
    const today = todayUtc();
    const todaySpend = spend[today] ?? 0;
    if (todaySpend >= DAILY_CAP_USD) {
        throw new Error(`DataForSEO daily cap reached: $${todaySpend.toFixed(4)} >= $${DAILY_CAP_USD}`);
    }

    await rateLimit();

    const body = JSON.stringify([{ language_code, location_code, keyword, depth }]);
    const r = await fetch("https://api.dataforseo.com/v3/serp/google/organic/live/advanced", {
        method: "POST",
        headers: { Authorization: AUTH, "Content-Type": "application/json" },
        body,
    });
    if (!r.ok) throw new Error(`DataForSEO HTTP ${r.status} ${r.statusText}`);
    const j = (await r.json()) as {
        status_code: number;
        status_message: string;
        cost: number;
        tasks: Array<{
            id: string;
            status_code: number;
            status_message: string;
            cost: number;
            result: Array<{
                keyword: string;
                se_results_count: number;
                items_count: number;
                items: Array<Record<string, unknown>>;
            }>;
        }>;
    };

    if (j.status_code !== 20000) {
        throw new Error(`DataForSEO error ${j.status_code}: ${j.status_message}`);
    }

    const cost = j.cost ?? 0;
    spend[today] = todaySpend + cost;
    saveSpend(spend);

    const task = j.tasks?.[0];
    const result = task?.result?.[0];
    if (!result) throw new Error("DataForSEO empty result");

    const items = (result.items as Array<Record<string, unknown>>) || [];

    const paa_questions: string[] = [];
    const related_searches: string[] = [];
    const serp_features = new Set<string>();

    for (const it of items) {
        const t = it.type as string;
        serp_features.add(t);
        if (t === "people_also_ask") {
            const piaItems = (it.items as Array<Record<string, unknown>>) || [];
            for (const piaItem of piaItems) {
                const q = piaItem.title || piaItem.question;
                if (typeof q === "string") paa_questions.push(q);
            }
        }
        if (t === "related_searches") {
            const rels = (it.items as string[]) || [];
            for (const rs of rels) if (typeof rs === "string") related_searches.push(rs);
        }
    }

    const out: SerpResult = {
        keyword,
        location_code,
        language_code,
        fetched_at: new Date().toISOString(),
        cached: false,
        cost_usd: cost,
        se_results_count: result.se_results_count,
        items: items
            .filter(it => it.type === "organic" || it.type === "featured_snippet")
            .map(it => ({
                type: it.type as string,
                rank_group: it.rank_group as number,
                rank_absolute: it.rank_absolute as number,
                title: it.title as string,
                url: it.url as string,
                domain: it.domain as string,
                description: it.description as string,
                breadcrumb: it.breadcrumb as string,
                is_featured_snippet: it.type === "featured_snippet",
            })),
        paa_questions,
        related_searches,
        serp_features: [...serp_features],
        raw_task: task,
    };

    fs.writeFileSync(cf, JSON.stringify(out, null, 2) + "\n");
    return out;
}

export function getSpendSummary() {
    return loadSpend();
}
