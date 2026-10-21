import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { reviewJunctionCandidates } from "../src/lib/bbr-junction-candidates";

async function main() {
  const input: unknown = JSON.parse(await readFile(resolve("public/data/bbr-roads.geojson"), "utf8"));
  const result = reviewJunctionCandidates(input);
  console.log("BBR shared-vertex junction review (research only)");
  console.log("Road lines:", result.roadLines);
  console.log("Shared-coordinate locations:", result.sharedVertexLocations);
  console.log("Locations needing metadata review:", result.locationsFlaggedForReview);
  console.log("Findings stored:", result.findings.length, "Truncated:", result.resultsTruncated);
  console.log(result.disclaimer);
  await mkdir("reports", { recursive: true });
  await writeFile(resolve("reports/bbr-junction-candidates.json"), JSON.stringify(result, null, 2) + "\n", "utf8");
  console.log("Saved reports/bbr-junction-candidates.json");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
