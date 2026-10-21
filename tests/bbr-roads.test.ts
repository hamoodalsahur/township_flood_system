import assert from "node:assert/strict";
import { test } from "node:test";
import { validRoadCollection } from "../src/lib/bbr-roads";

const sample = { type: "FeatureCollection", features: [{
  type: "Feature",
  geometry: { type: "LineString", coordinates: [[101.43, 3.08], [101.44, 3.09]] },
  properties: { id: "osm-way-123", name: "Example", highway: "residential", sourceUrl: "https://www.openstreetmap.org/way/123", verification: "osm_unverified" },
}] };
test("valid mapped road with lon/lat", () => assert.equal(validRoadCollection(sample), true));
test("rejects invalid latitude", () => {
  const corrupted = structuredClone(sample);
  corrupted.features[0].geometry.coordinates[0][1] = 120;
  assert.equal(validRoadCollection(corrupted), false);
});
test("rejects fake feature attribution", () => {
  const corrupted = structuredClone(sample);
  corrupted.features[0].properties.sourceUrl = "https://example.com/way/123";
  assert.equal(validRoadCollection(corrupted), false);
});
test("accepts an empty collection while roads are not imported", () => {
  assert.equal(validRoadCollection({ type: "FeatureCollection", features: [] }), true);
});
