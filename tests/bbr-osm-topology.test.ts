import assert from "node:assert/strict";
import { test } from "node:test";
import { inspectOsmNodeTopology } from "../src/lib/bbr-osm-topology";
import type { RoadFeature } from "../src/lib/bbr-roads";

function way(id: number, nodes: number[] | undefined, coordinates: [number, number][], tags: Partial<RoadFeature["properties"]> = {}): RoadFeature {
  return { type: "Feature", geometry: { type: "LineString", coordinates },
    properties: { id: "osm-way-" + id, name: "Example", highway: "residential",
      sourceUrl: "https://www.openstreetmap.org/way/" + id, verification: "osm_unverified",
      ...(nodes ? { osmNodeIds: nodes } : {}), ...tags } };
}
const collection = (...features: RoadFeature[]) => ({ type: "FeatureCollection", features });

test("connects ways with the same source node ID", () => {
  const result = inspectOsmNodeTopology(collection(
    way(1, [10, 11], [[101.42,3.08],[101.43,3.08]]),
    way(2, [11, 12], [[101.43,3.08],[101.44,3.08]]),
    way(3, [99, 100], [[101.45,3.08],[101.46,3.08]]),
  ));
  assert.equal(result.sharedOsmNodes, 1);
  assert.equal(result.candidateWayGroups, 2);
  assert.equal(result.largestCandidateGroupWays, 2);
  assert.equal(result.oneWayGroups, 1);
});
test("same rounded coordinate but different node IDs is not a confirmed OSM connection", () => {
  const result = inspectOsmNodeTopology(collection(
    way(1, [10, 11], [[101.42,3.08],[101.43,3.08]]),
    way(2, [21, 22], [[101.43,3.08],[101.44,3.08]]),
  ));
  assert.equal(result.candidateWayGroups, 2);
  assert.equal(result.sharedOsmNodes, 0);
  assert.equal(result.coordinateCollisionLocations, 1);
});
test("flags metadata at shared nodes without claiming access", () => {
  const result = inspectOsmNodeTopology(collection(
    way(1, [10, 11], [[101.42,3.08],[101.43,3.08]], { bridge: "yes", layer: "1" }),
    way(2, [11, 12], [[101.43,3.08],[101.44,3.08]], { layer: "0", access: "private" }),
  ));
  assert.equal(result.flaggedSharedNodes, 1);
  assert.ok(result.reviewExamples[0].reasons.includes("Different explicit layer tags"));
  assert.ok(result.reviewExamples[0].reasons.includes("Bridge or tunnel tag"));
  assert.ok(result.reviewExamples[0].reasons.includes("Access restriction tag"));
});
test("reports no topology for an older geometry-only dataset", () => {
  const result = inspectOsmNodeTopology(collection(way(1, undefined, [[101.42,3.08],[101.43,3.08]])));
  assert.equal(result.status, "missing_node_ids");
  assert.equal(result.candidateWayGroups, 0);
});
test("works on an empty road file without making connectivity claims", () => {
  const result = inspectOsmNodeTopology(collection());
  assert.equal(result.status, "missing_node_ids");
  assert.equal(result.roadLines, 0);
});
