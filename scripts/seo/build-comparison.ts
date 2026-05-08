// scripts/seo/build-comparison.ts — aggregate SERP + competitor analysis into:
//   - data/serp-comparison.csv  (one row per cluster)
//   - data/serp-comparison-summary.md  (top gaps + recommendations)

import fs from "node:fs";
import path from "node:path";

type Cluster = {
    cluster_id: string;
    type: string;
    priority: string;
    target_url: string;
    head_keyword: string;
    total_volume: number;
    page_exists: boolean;
};

type CompetitorPage = {
    url: string;
    rank: number;
    fetch_ok: boolean;
    fetch_error: string | null;
    title: string | null;
    title_length: number;
    meta_description_length: number;
    h1: string[];
    h2: string[];
    h3: string[];
    word_count: number;
    schema_types: string[];
    faq_count: number;
    has_pricing_table: boolean;
    has_distance_info: boolean;
};

const clusters: Cluster[] = JSON.parse(fs.readFileSync("data/keyword-clusters.json", "utf8"));
const SERP_DIR = "data/serp-analysis";
const COMP_DIR = "data/competitor-pages";

type Row = {
    cluster_id: string;
    priority: string;
    type: string;
    head_kw: string;
    total_volume: number;
    target_url: string;
    page_exists: string;
    serp_top_domain: string;
    serp_top_url: string;
    serp_features: string;
    paa_count: number;
    related_count: number;
    avg_word_count: number;
    max_word_count: number;
    avg_h2_count: number;
    max_h2_count: number;
    avg_faq_count: number;
    max_faq_count: number;
    schemas_observed: string;
    has_pricing: number;
    has_distance: number;
    fetch_failures: number;
    recommended_word_target: number;
    recommended_h2_target: number;
    recommended_faq_target: number;
    needs_manual: string;
};

const rows: Row[] = [];
const p1Only = clusters.filter(c => c.priority === "P1");

for (const c of p1Only) {
    const serpFile = path.join(SERP_DIR, `${c.cluster_id}.json`);
    const compFile = path.join(COMP_DIR, `${c.cluster_id}.json`);
    if (!fs.existsSync(serpFile)) continue;

    const serpJson = JSON.parse(fs.readFileSync(serpFile, "utf8"));
    const compJson = fs.existsSync(compFile) ? JSON.parse(fs.readFileSync(compFile, "utf8")) : { pages: [] };

    const pages = (compJson.pages as CompetitorPage[]).filter(p => p.fetch_ok);
    const failures = (compJson.pages as CompetitorPage[]).filter(p => !p.fetch_ok).length;
    const top1 = (serpJson.serp.items as Array<{ url?: string; domain?: string; rank_absolute?: number }>)[0];

    const wordCounts = pages.map(p => p.word_count);
    const h2Counts = pages.map(p => p.h2.length);
    const faqCounts = pages.map(p => p.faq_count);
    const allSchemas = new Set<string>();
    for (const p of pages) for (const s of p.schema_types) allSchemas.add(s);

    const avg = (arr: number[]) => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
    const max = (arr: number[]) => arr.length ? Math.max(...arr) : 0;

    rows.push({
        cluster_id: c.cluster_id,
        priority: c.priority,
        type: c.type,
        head_kw: c.head_keyword,
        total_volume: c.total_volume,
        target_url: c.target_url,
        page_exists: c.page_exists ? "yes" : "no",
        serp_top_domain: top1?.domain ?? "",
        serp_top_url: top1?.url ?? "",
        serp_features: (serpJson.serp.serp_features as string[]).join("|"),
        paa_count: (serpJson.serp.paa_questions as string[]).length,
        related_count: (serpJson.serp.related_searches as string[]).length,
        avg_word_count: avg(wordCounts),
        max_word_count: max(wordCounts),
        avg_h2_count: avg(h2Counts),
        max_h2_count: max(h2Counts),
        avg_faq_count: avg(faqCounts),
        max_faq_count: max(faqCounts),
        schemas_observed: [...allSchemas].join("|"),
        has_pricing: pages.filter(p => p.has_pricing_table).length,
        has_distance: pages.filter(p => p.has_distance_info).length,
        fetch_failures: failures,
        // Recommendation: avg of top + 25% buffer
        recommended_word_target: Math.max(1500, Math.round(avg(wordCounts) * 1.25)),
        recommended_h2_target: Math.max(8, Math.round(avg(h2Counts) * 1.25)),
        recommended_faq_target: Math.max(8, Math.max(...faqCounts, (serpJson.serp.paa_questions as string[]).length)),
        needs_manual: pages.length === 0 ? "YES — no successful fetches" : (failures >= 2 ? "PARTIAL — review SERP top results manually" : ""),
    });
}

// Write CSV
const headers = Object.keys(rows[0] ?? {});
const csv = [
    headers.join(","),
    ...rows.map(r => headers.map(h => {
        const v = (r as Record<string, unknown>)[h];
        const s = String(v ?? "").replace(/"/g, '""');
        return s.includes(",") || s.includes("\n") || s.includes('"') ? `"${s}"` : s;
    }).join(",")),
].join("\n");
fs.writeFileSync("data/serp-comparison.csv", csv + "\n");

// Markdown summary — top 5 actionable gaps
const sortedByVol = [...rows].sort((a, b) => b.total_volume - a.total_volume);

const md: string[] = [];
md.push("# Phase 3 — SERP Comparison Summary (P1)\n");
md.push(`Total P1 clusters analyzed: **${rows.length}**`);
md.push(`Total P1 monthly volume: **${rows.reduce((s, r) => s + r.total_volume, 0).toLocaleString("en-IN")}**\n`);

md.push("## Top 5 Most Actionable Gaps\n");
md.push("Selected for: highest volume × largest content gap × competitor weakness.\n");

const ranked = [...rows].sort((a, b) => {
    // Score = volume × log(competitor_strength × content_gap)
    const aGap = (a.recommended_word_target - 1500) + (a.recommended_h2_target - 8) * 100;
    const bGap = (b.recommended_word_target - 1500) + (b.recommended_h2_target - 8) * 100;
    const aScore = Math.log10(a.total_volume + 1) * (1 + aGap / 5000);
    const bScore = Math.log10(b.total_volume + 1) * (1 + bGap / 5000);
    return bScore - aScore;
});

for (const r of ranked.slice(0, 5)) {
    md.push(`### ${r.cluster_id} — ${r.head_kw}\n`);
    md.push(`- **Volume:** ${r.total_volume.toLocaleString("en-IN")}/mo · **Type:** ${r.type} · **Page exists:** ${r.page_exists}`);
    md.push(`- **Target URL:** ${r.target_url}`);
    md.push(`- **SERP top result:** ${r.serp_top_domain || "—"}  (${r.serp_top_url || ""})`);
    md.push(`- **SERP features:** ${r.serp_features}`);
    md.push(`- **Top-3 avg / max metrics:**`);
    md.push(`  - Word count: avg ${r.avg_word_count} / max ${r.max_word_count}`);
    md.push(`  - H2 count: avg ${r.avg_h2_count} / max ${r.max_h2_count}`);
    md.push(`  - FAQ count: avg ${r.avg_faq_count} / max ${r.max_faq_count}`);
    md.push(`  - Schemas observed: ${r.schemas_observed || "(none)"}`);
    md.push(`  - Has pricing/distance signals: pricing=${r.has_pricing}/3, distance=${r.has_distance}/3`);
    md.push(`- **PAA / Related queries:** ${r.paa_count} PAAs, ${r.related_count} related searches`);
    md.push(`- **Targets for our page:**`);
    md.push(`  - Word count: ${r.recommended_word_target}+`);
    md.push(`  - H2 sections: ${r.recommended_h2_target}+`);
    md.push(`  - FAQ count: ${r.recommended_faq_target}+`);
    if (r.needs_manual) md.push(`- **⚠️ ${r.needs_manual}**`);
    md.push("");
}

md.push("## All P1 Clusters Quick Reference\n");
md.push("| Cluster | Vol | Top SERP | Avg Words | Max Words | Avg H2 | FAQs | Pricing | Distance |");
md.push("|---|---:|---|---:|---:|---:|---:|---:|---:|");
for (const r of sortedByVol) {
    md.push(`| ${r.cluster_id} | ${r.total_volume.toLocaleString("en-IN")} | ${r.serp_top_domain || "—"} | ${r.avg_word_count} | ${r.max_word_count} | ${r.avg_h2_count} | ${r.max_faq_count} | ${r.has_pricing}/3 | ${r.has_distance}/3 |`);
}
md.push("");

md.push("## Fetch Failures (needs-manual)\n");
const failed = rows.filter(r => r.needs_manual);
if (failed.length === 0) {
    md.push("None.");
} else {
    for (const r of failed) {
        md.push(`- **${r.cluster_id}** — ${r.fetch_failures}/3 fetches failed. ${r.needs_manual}`);
    }
}

fs.writeFileSync("data/serp-comparison-summary.md", md.join("\n") + "\n");

console.log("Wrote:");
console.log("  data/serp-comparison.csv     — " + rows.length + " P1 rows");
console.log("  data/serp-comparison-summary.md  — top 5 gaps + full table");
console.log("");
console.log("Top 5 actionable gaps (preview):");
for (const r of ranked.slice(0, 5)) {
    console.log(`  • ${r.cluster_id.padEnd(36)} ${r.total_volume.toLocaleString("en-IN").padStart(7)}/mo  → target ${r.recommended_word_target}w, ${r.recommended_h2_target}H2, ${r.recommended_faq_target}FAQ`);
}
