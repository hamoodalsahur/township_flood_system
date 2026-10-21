import assert from "node:assert/strict";
import { test } from "node:test";
import { reviewJunctionCandidates } from "../src/lib/bbr-junction-candidates";

function road(id: number, coords: number[][], tags: Record<string, string> = {}) {
  return { type: "Feature", geometry: { type: "LineString", coordinates: coords },
    properties: { id: "osm-way-" + id, name: "Test", highway: "residential",
      sourceUrl: "https://www.openstreetmap.org/way/" + id, verification: "osm_unverified", ...tags } };
}
test("flags shared geometry with layer or bridge metadata", () => {
  const result = reviewJunctionCandidates({ type: "FeatureCollection", features: [
    road(1, [[101.42,3.08],[101.43,3.08]], { layer: "1", bridge: "yes" }),
    road(2, [[101.43,3.08],[101.44,3.08]], { layer: "0" }),
  ] });
  assert.equal(result.sharedVertexLocations, 1);
  assert.equal(result.locationsFlaggedForReview, 1);
  assert.ok(result.findings[0].reasons.includes("Different recorded layer values"));
});
test("does not mistake crossing lines without shared vertices for junctions", () => {
  const result = reviewJunctionCandidates({ type: "FeatureCollection", features: [
    road(1, [[101.42,3.08],[101.44,3.08]]),
    road(2, [[101.43,3.07],[101.43,3.09]]),
  ] });
  assert.equal(result.sharedVertexLocations, 0);
});
test("an untagged shared coordinate is not a confirmed review finding", () => {
  const result = reviewJunctionCandidates({ type: "FeatureCollection", features: [
    road(1, [[101.42,3.08],[101.43,3.08]]),
    road(2, [[101.43,3.08],[101.44,3.08]]),
  ] });
  assert.equal(result.sharedVertexLocations, 1);
  assert.equal(result.locationsFlaggedForReview, 0);
});
