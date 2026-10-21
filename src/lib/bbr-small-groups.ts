import { validRoadCollection, type RoadCollection } from "./bbr-roads";

/** Groups OSM way lines that share rounded coordinate vertices; diagnostic only. */
export function reviewSmallGroups(input: unknown) {
  if (!validRoadCollection(input)) throw new Error("Invalid road GeoJSON");
  const roads = (input as RoadCollection).features;
  const parent = roads.map((_, index) => index);
  function find(index: number): number {
    while (parent[index] !== index) {
      parent[index] = parent[parent[index]];
      index = parent[index];
    }
    return index;
  }
  function join(a: number, b: number) {
    const left = find(a), right = find(b);
    if (left !== right) parent[right] = left;
  }
  const firstAt = new Map<string, number>();
  for (let i = 0; i < roads.length; i++) {
    const distinctPoints = new Set(roads[i].geometry.coordinates.map(
      ([longitude, latitude]) => longitude.toFixed(6) + "," + latitude.toFixed(6)
    ));
    for (const point of distinctPoints) {
      const first = firstAt.get(point);
      if (first === undefined) firstAt.set(point, i);
      else join(first, i);
    }
  }
  const members = new Map<number, number[]>();
  for (let i = 0; i < roads.length; i++) {
    const root = find(i);
    if (!members.has(root)) members.set(root, []);
    members.get(root)!.push(i);
  }
  const groups = [...members.values()]
    .sort((a, b) => b.length - a.length || a[0] - b[0])
    .map((indices, index) => ({
      groupNumber: index + 1,
      roadLineCount: indices.length,
      ways: indices.map(i => ({
        id: roads[i].properties.id,
        name: roads[i].properties.name,
        highway: roads[i].properties.highway,
        sourceUrl: roads[i].properties.sourceUrl,
      })),
    }));
  return {
    totalRoadLines: roads.length,
    candidateGroupCount: groups.length,
    largestGroupSize: groups[0]?.roadLineCount ?? 0,
    smallerGroups: groups.slice(1),
    disclaimer: "Groups share listed rounded coordinate vertices. These are NOT verified drivable connections or disconnected roads. Bridges, access rules, directions and intersection geometry have not been checked.",
  };
}
