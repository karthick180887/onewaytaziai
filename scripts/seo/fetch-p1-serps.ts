// scripts/seo/fetch-p1-serps.ts — fetch live SERPs for all P1 cluster head keywords.

import fs from "node:fs";
import path from "node:path";
import { fetchSerp, getSpendSummary } from "./dataforseo";

type Cluster = {
    cluster_id: string;
    priority: string;
    head_keyword: string;
    type: string;
    target_url: string;
    total_volume: number;
    page_exists: boolean;
};

const clusters: Cluster[] = JSON.parse(
    fs.readFileSync("data/keyword-clusters.json", "utf8")
);

const p1 = clusters.filter(c => c.priority === "P1");
const OUT_DIR = path.resolve("data/serp-analysis");
fs.mkdirSync(OUT_DIR, { recursive: true });

async function main() {
    console.log(`Fetching SERPs for ${p1.length} P1 clusters...`);
    console.log(`Initial spend log:`, getSpendSummary());

    let i = 0;
    for (const c of p1) {
        i++;
        process.stdout.write(`[${i}/${p1.length}] ${c.cluster_id.padEnd(36)} "${c.head_keyword}"... `);
        try {
            const serp = await fetchSerp({ keyword: c.head_keyword, location_code: 2356, language_code: "en", depth: 20 });

            const out = {
                cluster_id: c.cluster_id,
                target_url: c.target_url,
                type: c.type,
                total_volume: c.total_volume,
                head_keyword: c.head_keyword,
                serp,
            };
            fs.writeFileSync(path.join(OUT_DIR, `${c.cluster_id}.json`), JSON.stringify(out, null, 2) + "\n");

            const top3 = serp.items.filter(it => it.type === "organic" || it.is_featured_snippet).slice(0, 3);
            console.log(`${serp.cached ? "(cache)" : `($${serp.cost_usd.toFixed(4)})`} ${top3.length} results, ${serp.paa_questions.length} PAAs`);
        } catch (e) {
            console.log(`FAIL — ${(e as Error).message}`);
        }
    }

    console.log(`\nFinal spend log:`, getSpendSummary());
    console.log(`SERP files written to ${OUT_DIR}`);
}

main().catch(e => { console.error(e); process.exit(1); });
