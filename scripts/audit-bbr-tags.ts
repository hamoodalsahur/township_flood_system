import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { auditRoadTags } from "../src/lib/bbr-tag-audit";

async function main() {
  const input: unknown = JSON.parse(await readFile(resolve("public/data/bbr-roads.geojson"), "utf8"));
  const result = auditRoadTags(input);
  console.log("OSM road metadata audit");
  console.log("Road lines:", result.roadLines);
  console.log("Tags retained:", result.tagCounts);
  console.log(result.disclaimer);
  await mkdir("reports", { recursive: true });
  await writeFile(resolve("reports/bbr-road-tags.json"), JSON.stringify(result, null, 2), "utf8");
  console.log("Saved reports/bbr-road-tags.json");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
