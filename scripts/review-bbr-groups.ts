import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { reviewSmallGroups } from "../src/lib/bbr-small-groups";

async function main() {
  const input: unknown = JSON.parse(await readFile(resolve("public/data/bbr-roads.geojson"), "utf8"));
  const result = reviewSmallGroups(input);
  console.log("Candidate groups:", result.candidateGroupCount);
  console.log("Largest candidate group:", result.largestGroupSize, "road lines");
  for (const group of result.smallerGroups) {
    console.log("\nGroup", group.groupNumber, "-", group.roadLineCount, "lines");
    for (const road of group.ways) console.log(" ", road.id, "|", road.name, "|", road.sourceUrl);
  }
  console.log("\n" + result.disclaimer);
  await mkdir("reports", { recursive: true });
  await writeFile(resolve("reports/bbr-small-groups.json"), JSON.stringify(result, null, 2), "utf8");
  console.log("\nSaved reports/bbr-small-groups.json");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
