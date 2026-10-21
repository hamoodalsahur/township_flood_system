import { validRoadCollection, type RoadCollection } from "./bbr-roads";

/** Topological *candidate* connections via identical vertices, NOT drivable intersections. */
export function auditSharedVertices(input: unknown) {
  if (!validRoadCollection(input)) throw new Error("Invalid road GeoJSON");
  const roads = (input as RoadCollection).features;
  const parent = roads.map((_, i) => i);
  const find = (i: number): number => {
    while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i]; }
    return i;
  };
  const union = (a: number, b: number) => { parent[find(a)] = find(b); };
  const firstRoadAt = new Map<string, number>();
  const verticesByRoad = new Map<string, Set<number>>();
  const key = ([lon, lat]: [number, number]) => lon.toFixed(6) + "," + lat.toFixed(6);
  for (let i = 0; i < roads.length; i++) {
    // Deduplicate within a way so a loop doesn't count as multiple ways.
    const keys = new Set(roads[i].geometry.coordinates.map(key));
    for (const point of keys) {
      if (!verticesByRoad.has(point)) verticesByRoad.set(point, new Set());
      verticesByRoad.get(point)!.add(i);
      const first = firstRoadAt.get(point);
      if (first === undefined) firstRoadAt.set(point, i);
      else union(first, i);
    }
  }
  const sizeByRoot = new Map<number, number>();
  for (let i = 0; i < roads.length; i++) {
    const root = find(i);
    sizeByRoot.set(root, (sizeByRoot.get(root) ?? 0) + 1);
  }
  const sizes = [...sizeByRoot.values()].sort((a, b) => b - a);
  const shared = [...verticesByRoad.values()].filter(ways => ways.size > 1);
  return {
    roadLines: roads.length,
    distinctVertices: verticesByRoad.size,
    sharedVertexLocations: shared.length,
    candidateGroups: sizes.length,
    largestGroupRoadLines: sizes[0] ?? 0,
    isolatedRoadLines: sizes.filter(size => size === 1).length,
    groupSizesTop10: sizes.slice(0, 10),
    disclaimer: "Shared coordinates only indicate potential mapped connections. Grade separation, access restrictions, directions, missing OSM nodes and geometry accuracy are not assessed. No driving, evacuation, passability or flood-safety claims.",
  };
}
