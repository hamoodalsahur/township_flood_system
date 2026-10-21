import assert from "node:assert/strict";
import { test } from "node:test";
import { auditRoadTags } from "../src/lib/bbr-tag-audit";
import { validRoadCollection } from "../src/lib/bbr-roads";

const sample = { type: "FeatureCollection", features: [{
  type: "Feature", geometry: { type: "LineString", coordinates: [[101.43, 3.08], [101.44, 3.09]] },
  properties: { id: "osm-way-123", name: "Sample", highway: "primary",
    sourceUrl: "https://www.openstreetmap.org/way/123", verification: "osm_unverified",
    oneway: "yes", bridge: "yes" },
}] };
test("accepts optional OSM tags and counts their coverage", () => {
  assert.equal(validRoadCollection(sample), true);
  const result = auditRoadTags(sample);
  assert.equal(result.tagCounts.oneway, 1);
  assert.equal(result.tagCounts.bridge, 1);
  assert.equal(result.tagCounts.tunnel, 0);
});
test("refuses non-string tag metadata", () => {
  const changed = structuredClone(sample);
  (changed.features[0].properties as Record<string, unknown>).oneway = true;
  assert.equal(validRoadCollection(changed), false);
});
