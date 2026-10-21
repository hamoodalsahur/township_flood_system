import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { inspectOsmNodeTopology } from "../src/lib/bbr-osm-topology";

async function main() {
  const input: unknown = JSON.parse(await readFile(resolve("public/data/bbr-roads.geojson"), "utf8"));
  const report = inspectOsmNodeTopology(input);
  console.log("BBR OSM node-topology research audit");
  console.log("Road lines:", report.roadLines);
  console.log("Ways with original OSM node IDs:", report.waysWithNodeIds);
  console.log("Ways without node IDs:", report.waysWithoutNodeIds);
  console.log("Distinct OSM nodes:", report.distinctOsmNodes);
  console.log("Segments described by node pairs:", report.mappedSegments);
  console.log("Shared OSM nodes:", report.sharedOsmNodes);
  console.log("Candidate way groups:", report.candidateWayGroups);
  console.log("Largest candidate way group:", report.largestCandidateGroupWays);
  console.log("One-way-only groups:", report.oneWayGroups);
  console.log("Coordinate collisions with different node IDs:", report.coordinateCollisionLocations);
  console.log("Conflicting coordinates for same node ID:", report.nodeCoordinateConflictCount);
  console.log("Shared nodes flagged for manual review:", report.flaggedSharedNodes);
  console.log("Review samples truncated:", report.reviewTruncated);
  console.log(report.disclaimer);
  await mkdir("reports", { recursive: true });
  await writeFile(resolve("reports/bbr-osm-topology.json"), JSON.stringify(report, null, 2) + "\n", "utf8");
  console.log("Saved reports/bbr-osm-topology.json");
}
main().catch(error => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
