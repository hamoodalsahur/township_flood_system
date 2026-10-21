import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { summarizeRoadTagValues } from "../src/lib/bbr-tag-values";

async function main() {
  const data: unknown = JSON.parse(await readFile(resolve("public/data/bbr-roads.geojson"), "utf8"));
  const report = summarizeRoadTagValues(data);
  console.log("OSM road tag values — research only");
  console.log("Road lines:", report.roadLines);
  for (const [tag, info] of Object.entries(report.tags)) {
    console.log("\n" + tag + ": present=" + info.present + ", missing=" + info.missing);
    for (const [value, count] of Object.entries(info.values).sort((a, b) => b[1] - a[1]))
      console.log("  " + JSON.stringify(value) + ": " + count);
  }
  console.log("\n" + report.disclaimer);
  await mkdir("reports", { recursive: true });
  await writeFile(resolve("reports/bbr-tag-values.json"), JSON.stringify(report, null, 2) + "\n", "utf8");
  console.log("Saved reports/bbr-tag-values.json");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
