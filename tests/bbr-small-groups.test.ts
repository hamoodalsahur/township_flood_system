import assert from "node:assert/strict";
import { test } from "node:test";
import { reviewSmallGroups } from "../src/lib/bbr-small-groups";

function way(id: number, points: number[][]) {
  return { type: "Feature", geometry: { type: "LineString", coordinates: points },
    properties: { id: "osm-way-" + id, name: "Example", highway: "residential",
      sourceUrl: "https://www.openstreetmap.org/way/" + id, verification: "osm_unverified" } };
}
test("lists smaller groups with their source links", () => {
  const result = reviewSmallGroups({ type: "FeatureCollection", features: [
    way(1, [[101,3],[101.1,3],[101.2,3]]),
    way(2, [[101.1,3],[101.1,3.1]]),
    way(3, [[102,3],[102.1,3]])
  ] });
  assert.equal(result.candidateGroupCount, 2);
  assert.equal(result.largestGroupSize, 2);
  assert.equal(result.smallerGroups[0].roadLineCount, 1);
  assert.equal(result.smallerGroups[0].ways[0].id, "osm-way-3");
});
test("handles empty data", () => {
  assert.equal(reviewSmallGroups({ type: "FeatureCollection", features: [] }).candidateGroupCount, 0);
});
