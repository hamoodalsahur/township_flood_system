/**
 * One-time research import, run by a developer on their own computer.
 * Does not change the scenario/database or claim verified connectivity.
 *
 * npm run geo:import
 */
import { mkdir, writeFile, readFile, copyFile } from "node:fs/promises";
import { resolve } from "node:path";
import { validRoadCollection, type RoadCollection, type RoadFeature } from "../src/lib/bbr-roads";
import { convertOsmWay, RESEARCH_BOUNDS, type OsmWay } from "../src/lib/bbr-osm-import";
import { compareRoadImports } from "../src/lib/bbr-road-import-diff";

type OverpassResponse = { elements?: OsmWay[] };

// A small *research window* close to the mapped BBR sales-gallery reference.
// Not the complete township boundary. Overpass uses south,west,north,east.
const bounds = RESEARCH_BOUNDS;
const query = `[out:json][timeout:30];way["highway"]["highway"!~"footway|path|steps|cycleway|pedestrian|construction|proposed"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});out geom;`;
const endpoint = "https://overpass-api.de/api/interpreter";

async function main() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45000);
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "TownshipFloodHackathonResearch/0.1 (local academic prototype)" },
      body: new URLSearchParams({ data: query }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
  if (!response.ok) throw new Error(`Overpass request failed with HTTP ${response.status}. Try again later.`);
  const data = await response.json() as OverpassResponse;
  if (!Array.isArray(data.elements)) throw new Error("Unexpected Overpass response; import stopped.");

  const features: RoadFeature[] = [];
  let skipped = 0;
  for (const element of data.elements) {
    const feature = convertOsmWay(element);
    if (feature) features.push(feature);
    else skipped++;
  }
  if (skipped > 0) console.log("Skipped", skipped, "non-road or invalid OSM elements.");
  if (features.length === 0) throw new Error("No usable road lines were returned. Existing map file left unchanged.");
  const collection: RoadCollection = { type: "FeatureCollection", features };
  if (!validRoadCollection(collection)) throw new Error("Road validation failed. Existing map file left unchanged.");

  const destination = resolve("public/data/bbr-roads.geojson");
  const previousText = await readFile(destination, "utf8").catch((error: unknown) => {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return null;
    throw error;
  });
  let previous: RoadCollection | null = null;
  if (previousText !== null) {
    let parsed: unknown;
    try { parsed = JSON.parse(previousText); }
    catch { throw new Error("Existing road file has invalid JSON. Import stopped; preserve it before proceeding."); }
    if (!validRoadCollection(parsed)) throw new Error("Existing road file did not pass validation. Import stopped to protect it.");
    previous = parsed;
  }
  let localBackup: string | null = null;
  if (previousText !== null) {
    await mkdir(resolve("reports/backups"), { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    localBackup = "reports/backups/bbr-roads-" + timestamp + ".geojson";
    await copyFile(destination, resolve(localBackup));
    console.log("Preserved previous road snapshot in:", localBackup);
  }
  await mkdir(resolve("public/data"), { recursive: true });
  await writeFile(destination, JSON.stringify(collection, null, 2) + "\n", "utf8");
  const comparison = compareRoadImports(previous, collection);
  const manifest = {
    importedAt: new Date().toISOString(),
    source: "OpenStreetMap / Overpass (unverified)",
    researchBounds: bounds,
    overpassEndpoint: endpoint,
    sourceQuery: query,
    localBackup,
    ...comparison,
  };
  await mkdir(resolve("reports"), { recursive: true });
  await writeFile(resolve("reports/bbr-osm-import.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log("Imported", features.length, "OSM road geometries to public/data/bbr-roads.geojson.");
  console.log("Road lines with original OSM node IDs:", comparison.linesWithOsmNodes);
  console.log("Way IDs added:", comparison.addedWayIds, "removed:", comparison.removedWayIds);
  console.log("Snapshot summary: reports/bbr-osm-import.json");
  console.log("UNVERIFIED geography only. OSM node identity is not proof of drivable connections, flood safety or routes.");
  console.log("Keep a separate backup outside the repo before changing Git branches.");
}
main().catch(error => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
