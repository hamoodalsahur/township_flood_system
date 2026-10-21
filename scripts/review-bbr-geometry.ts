import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { reviewRoadGeometry } from "../src/lib/bbr-geometry-review";

async function main() {
  const data: unknown = JSON.parse(await readFile(resolve("public/data/bbr-roads.geojson"), "utf8"));
  const report = reviewRoadGeometry(data);
  console.log("Road lines checked:", report.roadLinesChecked);
  console.log("Road lines flagged for manual review:", report.flaggedLines);
  for (const item of report.findings.slice(0, 20)) {
    console.log(item.id, "|", item.name, "| repeated:", item.repeatedCoordinateOccurrences, "| adjacent duplicates:", item.consecutiveDuplicates);
    console.log("  ", item.sourceUrl);
  }
  console.log(report.disclaimer);
  await mkdir("reports", { recursive: true });
  await writeFile(resolve("reports/bbr-geometry-review.json"), JSON.stringify(report, null, 2), "utf8");
  console.log("Saved reports/bbr-geometry-review.json");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
