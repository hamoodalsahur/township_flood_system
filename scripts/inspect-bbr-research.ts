import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { inspectRoadResearchSnapshot } from "../src/lib/bbr-research-summary";

async function main() {
  const data: unknown = JSON.parse(await readFile(resolve("public/data/bbr-roads.geojson"), "utf8"));
  const snapshot = inspectRoadResearchSnapshot(data);
  const report = { createdAt: new Date().toISOString(), ...snapshot };
  console.log("BBR combined geographic research report — NOT road safety analysis");
  console.log("Imported way lines:", report.roadLines);
  console.log("Coordinate-based groups:", report.coordinateResearch.candidateGroups);
  console.log("Coordinate-based junction review flags:", report.junctionReview.flaggedLocations);
  console.log("OSM ways with source nodes:", report.nodeSourceResearch.waysWithNodeIds);
  console.log("Source-node groups:", report.nodeSourceResearch.candidateWayGroups);
  console.log("Coordinate collisions:", report.nodeSourceResearch.coordinateCollisionLocations);
  console.log(report.disclaimer);
  await mkdir("reports", { recursive: true });
  await writeFile(resolve("reports/bbr-research-summary.json"), JSON.stringify(report, null, 2) + "\n", "utf8");
  console.log("Saved reports/bbr-research-summary.json — share this one file for review.");
}
main().catch(error => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
