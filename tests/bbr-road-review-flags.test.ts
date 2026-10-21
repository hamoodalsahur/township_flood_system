import assert from "node:assert/strict";
import { test } from "node:test";
import { roadReviewFlags } from "../src/lib/bbr-road-review-flags";
import type { RoadFeature } from "../src/lib/bbr-roads";

function sample(extra: Partial<RoadFeature["properties"]>): RoadFeature {
  return { type: "Feature", geometry: { type: "LineString", coordinates: [[101.42, 3.08], [101.43, 3.09]] },
    properties: { id: "osm-way-123", name: "Example", highway: "residential",
      sourceUrl: "https://www.openstreetmap.org/way/123", verification: "osm_unverified", ...extra } };
}
test("flags access, direction and level tags for review", () => {
  assert.deepEqual(roadReviewFlags(sample({ access: "private", oneway: "yes", bridge: "yes" })).map(item => item.code), ["access", "direction", "level"]);
});
test("does not interpret missing tags as open access", () => {
  assert.deepEqual(roadReviewFlags(sample({})), []);
});
test("explicit no one-way tag does not trigger a one-way review flag", () => {
  assert.deepEqual(roadReviewFlags(sample({ oneway: "no" })), []);
});
