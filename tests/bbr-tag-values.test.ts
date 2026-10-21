import assert from "node:assert/strict";
import { test } from "node:test";
import { summarizeRoadTagValues } from "../src/lib/bbr-tag-values";

function way(id: number, extra: Record<string, string> = {}) {
  return { type: "Feature", geometry: { type: "LineString", coordinates: [[101.42, 3.08], [101.43, 3.09]] },
    properties: { id: "osm-way-" + id, name: "Example", highway: "residential",
      sourceUrl: "https://www.openstreetmap.org/way/" + id, verification: "osm_unverified", ...extra } };
}
test("separates missing tags from explicit no values", () => {
  const result = summarizeRoadTagValues({ type: "FeatureCollection", features: [
    way(1, { oneway: "yes", bridge: "no" }),
    way(2, { oneway: "no" }),
    way(3),
  ] });
  assert.equal(result.tags.oneway.present, 2);
  assert.equal(result.tags.oneway.missing, 1);
  assert.equal(result.tags.oneway.values.yes, 1);
  assert.equal(result.tags.oneway.values.no, 1);
  assert.equal(result.tags.bridge.values.no, 1);
  assert.equal(result.tags.bridge.missing, 2);
});
test("empty imports return zero counts", () => {
  const result = summarizeRoadTagValues({ type: "FeatureCollection", features: [] });
  assert.equal(result.tags.access.present, 0);
  assert.equal(result.tags.access.missing, 0);
});
