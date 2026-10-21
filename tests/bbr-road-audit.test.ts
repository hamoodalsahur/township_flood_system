import assert from "node:assert/strict";
import { test } from "node:test";
import { auditRoads } from "../src/lib/bbr-road-audit";

function way(id: number, points: number[][]) {
  return { type: "Feature", geometry: { type: "LineString", coordinates: points },
    properties: { id: "osm-way-" + id, name: "Example", highway: "residential",
      sourceUrl: "https://www.openstreetmap.org/way/" + id, verification: "osm_unverified" } };
}
test("counts sample groups", () => {
  const report = auditRoads({ type: "FeatureCollection", features: [
    way(1, [[101,3],[101.1,3]]), way(2, [[101.1,3],[101.2,3]]),
    way(3, [[102,3],[102.1,3]])] });
  assert.equal(report.total, 3);
  assert.equal(report.categories.local, 3);
  assert.equal(report.endpointGroups, 2);
});
test("detects duplicate IDs", () => {
  const report = auditRoads({ type: "FeatureCollection", features: [
    way(1, [[101,3],[101,3]]), way(1, [[101,3],[101.1,3]])] });
  assert.equal(report.duplicateIds.length, 1);
  assert.equal(report.zeroLength.length, 1);
});
