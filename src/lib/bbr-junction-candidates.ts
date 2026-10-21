import { validRoadCollection, type RoadCollection } from "./bbr-roads";

type WayInfo = { id: string; layer?: string; bridge?: string; tunnel?: string; access?: string };
export function reviewJunctionCandidates(input: unknown) {
  if (!validRoadCollection(input)) throw new Error("Invalid road GeoJSON");
  const roads = (input as RoadCollection).features;
  const vertices = new Map<string, number[]>();
  roads.forEach((road, i) => {
    const unique = new Set(road.geometry.coordinates.map(([lon, lat]) => lon.toFixed(6) + "," + lat.toFixed(6)));
    for (const key of unique) {
      const indices = vertices.get(key) ?? [];
      indices.push(i);
      vertices.set(key, indices);
    }
  });
  const findings: { coordinate: [number, number]; wayIds: string[]; reasons: string[] }[] = [];
  let sharedLocations = 0;
  for (const [key, indices] of vertices) {
    if (indices.length < 2) continue;
    sharedLocations++;
    const info: WayInfo[] = indices.map(i => roads[i].properties);
    const layers = new Set(info.map(w => w.layer).filter((v): v is string => v !== undefined));
    const reasons: string[] = [];
    if (layers.size > 1) reasons.push("Different recorded layer values");
    if (info.some(w => w.bridge === "yes" || w.tunnel === "yes"))
      reasons.push("Bridge or tunnel tag present");
    if (info.some(w => w.access === "private" || w.access === "no"))
      reasons.push("Access restriction tag present");
    if (reasons.length > 0) {
      const [longitude, latitude] = key.split(",").map(Number);
      findings.push({ coordinate: [longitude, latitude], wayIds: info.map(w => w.id), reasons });
    }
  }
  return {
    roadLines: roads.length,
    sharedVertexLocations: sharedLocations,
    locationsFlaggedForReview: findings.length,
    findings: findings.slice(0, 500),
    resultsTruncated: findings.length > 500,
    disclaimer: "These are coincident mapped coordinate vertices, not verified intersections. Rounded positions and recorded tags cannot establish legal turns, grade separation, passability or flood safety. Missing tags remain unknown.",
  };
}
