import { validRoadCollection, type RoadCollection } from "./bbr-roads";
import { roadCategory } from "./bbr-road-display";

export function auditRoads(input: unknown) {
  if (!validRoadCollection(input)) throw new Error("Invalid road GeoJSON");
  const roads = (input as RoadCollection).features;
  const categories = { major: 0, local: 0, service: 0, other: 0 };
  const seen = new Set<string>();
  const duplicateIds: string[] = [];
  const repeatedVertices: string[] = [];
  const zeroLength: string[] = [];
  const endpoints = new Map<string, Set<string>>();
  const key = (coords: [number, number]) => coords.map(v => v.toFixed(6)).join(",");
  for (const road of roads) {
    const { id, highway } = road.properties;
    categories[roadCategory(highway)]++;
    if (seen.has(id)) duplicateIds.push(id);
    seen.add(id);
    const positions = road.geometry.coordinates.map(key);
    if (new Set(positions).size < positions.length) repeatedVertices.push(id);
    if (new Set(positions).size === 1) zeroLength.push(id);
    const a = positions[0], b = positions[positions.length - 1];
    if (!endpoints.has(a)) endpoints.set(a, new Set());
    if (!endpoints.has(b)) endpoints.set(b, new Set());
    endpoints.get(a)!.add(b);
    endpoints.get(b)!.add(a);
  }
  const visited = new Set<string>();
  let endpointGroups = 0;
  for (const origin of endpoints.keys()) {
    if (visited.has(origin)) continue;
    endpointGroups++;
    const queue = [origin];
    visited.add(origin);
    for (let i = 0; i < queue.length; i++) {
      for (const neighbor of endpoints.get(queue[i]) ?? []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
  }
  return {
    total: roads.length,
    categories,
    unnamed: roads.filter(r => r.properties.name === "Unnamed mapped road").length,
    duplicateIds,
    repeatedVertices,
    zeroLength,
    endpointGroups,
    disclaimer: "Endpoint groups are approximate data-quality clues only. No junction connectivity, road safety, or navigation is established.",
  };
}
