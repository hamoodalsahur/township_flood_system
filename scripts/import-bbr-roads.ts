/**
 * One-time research import, run by a developer on their own computer.
 * Does not change the scenario/database or claim verified connectivity.
 *
 * npm run geo:import
 */
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { validRoadCollection, type RoadCollection, type RoadFeature } from "../src/lib/bbr-roads";

type OsmWay = {
  type: string;
  id: number;
  tags?: Record<string, string>;
  geometry?: { lat: number; lon: number }[];
};
type OverpassResponse = { elements?: OsmWay[] };

// A small *research window* close to the mapped BBR sales-gallery reference.
// Not the complete township boundary. Overpass uses south,west,north,east.
const bounds = { south: 3.075, west: 101.42, north: 3.095, east: 101.45 };
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
  for (const element of data.elements) {
    if (element.type !== "way" || !Number.isSafeInteger(element.id) || !element.geometry) continue;
    const coords = element.geometry.map(point => [point.lon, point.lat] as [number, number]);
    if (coords.length < 2 || coords.length > 5000 || coords.some(([lon, lat]) =>
      !Number.isFinite(lon) || !Number.isFinite(lat) ||
      lat < bounds.south - 0.02 || lat > bounds.north + 0.02 ||
      lon < bounds.west - 0.02 || lon > bounds.east + 0.02
    )) continue;
    features.push({
      type: "Feature",
      geometry: { type: "LineString", coordinates: coords },
      properties: {
        id: `osm-way-${element.id}`,
        name: element.tags?.name || "Unnamed mapped road",
        highway: element.tags?.highway || "unknown",
        sourceUrl: `https://www.openstreetmap.org/way/${element.id}`,
        verification: "osm_unverified",
      },
    });
  }
  if (features.length === 0) throw new Error("No usable road lines were returned. Existing map file left unchanged.");
  const collection: RoadCollection = { type: "FeatureCollection", features };
  if (!validRoadCollection(collection)) throw new Error("Road validation failed. Existing map file left unchanged.");

  const destination = resolve("public/data/bbr-roads.geojson");
  await mkdir(resolve("public/data"), { recursive: true });
  await writeFile(destination, JSON.stringify(collection, null, 2) + "\n", "utf8");
  console.log(`Imported ${features.length} OSM road geometries to public/data/bbr-roads.geojson.`);
  console.log("UNVERIFIED geography only. No connectivity, flood, safety or route claims.");
  console.log("Review road features and licence attribution before committing the generated file.");
}
main().catch(error => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
