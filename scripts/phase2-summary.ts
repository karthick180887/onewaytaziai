// Phase 2.1 — print sorted summary table of all clusters

import fs from "node:fs";
import path from "node:path";

type Cluster = {
    cluster_id: string;
    type: string;
    priority: string;
    target_url: string;
    total_volume: number;
    page_exists: boolean | null;
    existing_page_path: string | null;
    notes: string;
};

const clusters: Cluster[] = JSON.parse(
    fs.readFileSync(path.resolve("data/keyword-clusters.json"), "utf8")
);

const priOrder: Record<string, number> = { P1: 1, P2: 2, P3: 3 };

const sorted = [...clusters].sort((a, b) => {
    const pri = priOrder[a.priority] - priOrder[b.priority];
    if (pri !== 0) return pri;
    return b.total_volume - a.total_volume;
});

const COLS = [
    { h: "#", w: 3 },
    { h: "Cluster", w: 38 },
    { h: "T", w: 1 },
    { h: "Pri", w: 3 },
    { h: "Vol", w: 8 },
    { h: "Exists", w: 6 },
    { h: "Target URL", w: 56 },
];

function pad(s: string, w: number, align: "L" | "R" = "L") {
    if (s.length > w) return s.slice(0, w - 1) + "…";
    return align === "L" ? s.padEnd(w) : s.padStart(w);
}

console.log("=".repeat(125));
console.log("ALL 51 CLUSTERS — sorted by Priority then Volume");
console.log("=".repeat(125));

const head = COLS.map(c => pad(c.h, c.w)).join(" | ");
console.log(head);
console.log("-".repeat(125));

let row = 1;
let lastPri = "";
for (const c of sorted) {
    if (c.priority !== lastPri) {
        if (lastPri) console.log();
        lastPri = c.priority;
    }
    console.log(
        [
            pad(String(row++), 3, "R"),
            pad(c.cluster_id, 38),
            pad(c.type, 1),
            pad(c.priority, 3),
            pad(c.total_volume.toLocaleString("en-IN"), 8, "R"),
            pad(c.page_exists ? "✓" : "NEW", 6),
            pad(c.target_url, 56),
        ].join(" | ")
    );
}

// Aggregate stats
const stats = {
    P1: { count: 0, vol: 0, exists: 0, missing: 0 },
    P2: { count: 0, vol: 0, exists: 0, missing: 0 },
    P3: { count: 0, vol: 0, exists: 0, missing: 0 },
};
const byType: Record<string, { count: number; vol: number; exists: number; missing: number }> = {};

for (const c of clusters) {
    const s = stats[c.priority as "P1" | "P2" | "P3"];
    s.count++;
    s.vol += c.total_volume;
    if (c.page_exists) s.exists++;
    else s.missing++;

    const t = (byType[c.type] ||= { count: 0, vol: 0, exists: 0, missing: 0 });
    t.count++;
    t.vol += c.total_volume;
    if (c.page_exists) t.exists++;
    else t.missing++;
}

console.log();
console.log("=".repeat(60));
console.log("BY PRIORITY");
console.log("=".repeat(60));
console.log("Pri | Clusters | Volume      | Exists | New");
console.log("-".repeat(60));
for (const p of ["P1", "P2", "P3"] as const) {
    const s = stats[p];
    console.log(
        `${p}  | ${pad(String(s.count), 8, "R")} | ${pad(s.vol.toLocaleString("en-IN"), 11, "R")} | ${pad(String(s.exists), 6, "R")} | ${pad(String(s.missing), 3, "R")}`
    );
}

console.log();
console.log("=".repeat(60));
console.log("BY TYPE");
console.log("=".repeat(60));
console.log("Type | Clusters | Volume      | Exists | New | Description");
console.log("-".repeat(60));
const typeDesc: Record<string, string> = {
    A: "City service pages",
    B: "Route pages (city-to-city)",
    C: "Distance / info blog posts",
    D: "Service hubs",
    E: "Tourist guide blog posts",
};
for (const t of Object.keys(byType).sort()) {
    const s = byType[t];
    console.log(
        `${t}    | ${pad(String(s.count), 8, "R")} | ${pad(s.vol.toLocaleString("en-IN"), 11, "R")} | ${pad(String(s.exists), 6, "R")} | ${pad(String(s.missing), 3, "R")} | ${typeDesc[t]}`
    );
}

console.log();
console.log("=".repeat(60));
console.log("TOTALS");
console.log("=".repeat(60));
const totalVol = clusters.reduce((sum, c) => sum + c.total_volume, 0);
const totalExists = clusters.filter(c => c.page_exists).length;
const totalMissing = clusters.length - totalExists;
console.log(`Total clusters:       ${clusters.length}`);
console.log(`Total monthly volume: ${totalVol.toLocaleString("en-IN")}`);
console.log(`Pages already exist:  ${totalExists} (${((totalExists / clusters.length) * 100).toFixed(0)}%)`);
console.log(`Pages to create:      ${totalMissing} (${((totalMissing / clusters.length) * 100).toFixed(0)}%)`);
