import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { auditSharedVertices } from "../src/lib/bbr-vertex-audit";

async function main() {
  const file: unknown = JSON.parse(await readFile(resolve("public/data/bbr-roads.geojson"), "utf8"));
  const report = auditSharedVertices(file);
  console.log("BBR shared-vertex audit — research only");
  console.log("Road lines:", report.roadLines);
  console.log("Distinct vertices:", report.distinctVertices);
  console.log("Shared vertex locations:", report.sharedVertexLocations);
  console.log("Candidate groups:", report.candidateGroups);
  console.log("Largest group (road lines):", report.largestGroupRoadLines);
  console.log("Single-line groups:", report.isolatedRoadLines);
  console.log("Ten largest group sizes:", report.groupSizesTop10);
  console.log(report.disclaimer);
  await mkdir("reports", { recursive: true });
  await writeFile(resolve("reports/bbr-vertex-audit.json"), JSON.stringify(report, null, 2), "utf8");
  console.log("Saved reports/bbr-vertex-audit.json");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
