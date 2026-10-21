import assert from "node:assert/strict";
import { test } from "node:test";
import { auditSharedVertices } from "../src/lib/bbr-vertex-audit";

function way(id: number, points: number[][]) {
  return { type: "Feature", geometry: { type: "LineString", coordinates: points },
    properties: { id: "osm-way-" + id, name: "Test", highway: "residential",
      sourceUrl: "https://www.openstreetmap.org/way/" + id, verification: "osm_unverified" } };
}
test("finds shared intermediate vertices that endpoint matching misses", () => {
  const report = auditSharedVertices({ type: "FeatureCollection", features: [
    way(1, [[101,3],[101.1,3],[101.2,3]]),
    way(2, [[101.1,3],[101.1,3.1]]),
    way(3, [[102,3],[102.1,3]]),
  ] });
  assert.equal(report.sharedVertexLocations, 1);
  assert.equal(report.candidateGroups, 2);
  assert.equal(report.largestGroupRoadLines, 2);
  assert.equal(report.isolatedRoadLines, 1);
});
test("rejects malformed coordinates", () => {
  assert.throws(() => auditSharedVertices({ type: "FeatureCollection", features: [way(1, [[200,3],[101,3]])] }));
});
test("empty dataset has no groups", () => {
  assert.equal(auditSharedVertices({ type: "FeatureCollection", features: [] }).candidateGroups, 0);
});
