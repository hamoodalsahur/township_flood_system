import { validRoadCollection, type RoadCollection } from "./bbr-roads";

type NodeAppearance = {
  wayIds: Set<string>;
  coordinateKeys: Set<string>;
  ways: Map<string, {
    id: string; name: string; highway: string; bridge?: string;
    tunnel?: string; layer?: string; access?: string; oneway?: string;
  }>;
};

const geoKey = ([lon, lat]: [number, number]) => lon.toFixed(6) + "," + lat.toFixed(6);

export function inspectOsmNodeTopology(input: unknown) {
  if (!validRoadCollection(input)) throw new Error("Invalid road GeoJSON");
  const roads = (input as RoadCollection).features;
  const eligible = roads.filter(road => road.properties.osmNodeIds !== undefined);
  const indexed = new Map<number, NodeAppearance>();
  const atPosition = new Map<string, { nodeIds: Set<number>; wayIds: Set<string> }>();
  const parents = eligible.map((_, index) => index);
  const find = (index: number): number => {
    while (parents[index] !== index) {
      parents[index] = parents[parents[index]];
      index = parents[index];
    }
    return index;
  };
  const union = (left: number, right: number) => {
    const a = find(left), b = find(right);
    if (a !== b) parents[b] = a;
  };
  const firstWay = new Map<number, number>();
  let mappedSegments = 0;
  let repeatedAdjacentIds = 0;

  eligible.forEach((road, index) => {
    const ids = road.properties.osmNodeIds!;
    const { id, name, highway, bridge, tunnel, layer, access, oneway } = road.properties;
    const details = { id, name, highway, bridge, tunnel, layer, access, oneway };
    mappedSegments += ids.length - 1;
    for (let position = 0; position < ids.length; position++) {
      const nodeId = ids[position];
      const key = geoKey(road.geometry.coordinates[position]);
      if (position > 0 && ids[position - 1] === nodeId) repeatedAdjacentIds++;
      const record = indexed.get(nodeId) ?? {
        wayIds: new Set<string>(), coordinateKeys: new Set<string>(),
        ways: new Map<string, typeof details>(),
      };
      record.wayIds.add(id);
      record.coordinateKeys.add(key);
      record.ways.set(id, details);
      indexed.set(nodeId, record);
      const at = atPosition.get(key) ?? { nodeIds: new Set<number>(), wayIds: new Set<string>() };
      at.nodeIds.add(nodeId);
      at.wayIds.add(id);
      atPosition.set(key, at);
      const earlier = firstWay.get(nodeId);
      if (earlier === undefined) firstWay.set(nodeId, index);
      else union(earlier, index);
    }
  });

  const componentCounts = new Map<number, number>();
  for (let index = 0; index < eligible.length; index++) {
    const root = find(index);
    componentCounts.set(root, (componentCounts.get(root) ?? 0) + 1);
  }
  const sizes = [...componentCounts.values()].sort((a, b) => b - a);
  const collisions = [...atPosition.entries()].filter(([, group]) =>
    group.nodeIds.size > 1 && group.wayIds.size > 1
  ).map(([coordinate, group]) => ({
    coordinate,
    distinctNodeIds: [...group.nodeIds].sort((a, b) => a - b),
    wayIds: [...group.wayIds].sort(),
  })).sort((a, b) => b.wayIds.length - a.wayIds.length || a.coordinate.localeCompare(b.coordinate));

  const shared = [...indexed.entries()].filter(([, item]) => item.wayIds.size > 1);
  const findings = shared.flatMap(([nodeId, item]) => {
    const tags = [...item.ways.values()];
    const explicitLayers = [...new Set(tags.map(tag => tag.layer).filter((v): v is string => v !== undefined))];
    const reasons: string[] = [];
    if (explicitLayers.length > 1) reasons.push("Different explicit layer tags");
    if (tags.some(tag => tag.bridge === "yes" || tag.tunnel === "yes")) reasons.push("Bridge or tunnel tag");
    if (tags.some(tag => tag.access === "private" || tag.access === "no")) reasons.push("Access restriction tag");
    if (item.coordinateKeys.size > 1) reasons.push("Same OSM node ID mapped at different rounded coordinates");
    if (reasons.length === 0) return [];
    return [{
      nodeId, sourceUrl: "https://www.openstreetmap.org/node/" + nodeId,
      coordinate: [...item.coordinateKeys].sort()[0],
      wayIds: [...item.wayIds].sort(),
      reasons,
    }];
  }).sort((a, b) => {
    const weight = (entry: { reasons: string[] }) =>
      (entry.reasons.includes("Same OSM node ID mapped at different rounded coordinates") ? 8 : 0) +
      (entry.reasons.includes("Different explicit layer tags") ? 4 : 0) +
      (entry.reasons.includes("Bridge or tunnel tag") ? 2 : 0) +
      (entry.reasons.includes("Access restriction tag") ? 1 : 0);
    return weight(b) - weight(a) || a.nodeId - b.nodeId;
  });

  const limit = 300;
  const hasNodes = eligible.length > 0;
  return {
    status: hasNodes ? "node_ids_present" as const : "missing_node_ids" as const,
    roadLines: roads.length,
    waysWithNodeIds: eligible.length,
    waysWithoutNodeIds: roads.length - eligible.length,
    distinctOsmNodes: indexed.size,
    mappedSegments,
    repeatedAdjacentNodeIds: repeatedAdjacentIds,
    sharedOsmNodes: shared.length,
    candidateWayGroups: sizes.length,
    largestCandidateGroupWays: sizes[0] ?? 0,
    oneWayGroups: sizes.filter(size => size === 1).length,
    largestGroupSizes: sizes.slice(0, 10),
    coordinateCollisionLocations: collisions.length,
    coordinateCollisionExamples: collisions.slice(0, 30),
    nodeCoordinateConflictCount: [...indexed.values()].filter(node => node.coordinateKeys.size > 1).length,
    flaggedSharedNodes: findings.length,
    reviewExamples: findings.slice(0, limit),
    reviewTruncated: findings.length > limit,
    disclaimer: hasNodes
      ? "OSM node IDs provide stronger source-topology evidence than coordinate matching, but NOT verified junctions, drivable turns, public access, road safety or flood conditions. Road tag conflicts are manual review flags only."
      : "No original OSM node IDs are present. Back up the existing GeoJSON before a single refreshed geo:import, then rerun this audit. No topology conclusions are available from this file.",
  };
}
