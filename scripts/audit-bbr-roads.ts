import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { auditRoads } from "../src/lib/bbr-road-audit";

async function main() {
  const input = JSON.parse(await readFile(resolve("public/data/bbr-roads.geojson"), "utf8")) as unknown;
  const report = auditRoads(input);
  console.log("Road lines:", report.total);
  console.log("Categories:", report.categories);
  console.log("Unnamed:", report.unnamed);
  console.log("Repeated IDs:", report.duplicateIds.length);
  console.log("Repeated vertices:", report.repeatedVertices.length);
  console.log("Zero-length:", report.zeroLength.length);
  console.log("Endpoint coordinate groups:", report.endpointGroups);
  console.log(report.disclaimer);
  await mkdir("reports", { recursive: true });
  await writeFile(resolve("reports/bbr-road-audit.json"), JSON.stringify(report, null, 2), "utf8");
  console.log("Saved reports/bbr-road-audit.json");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
