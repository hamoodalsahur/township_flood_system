import assert from "node:assert/strict";
import { test } from "node:test";
import { reviewRoadGeometry } from "../src/lib/bbr-geometry-review";

const way = (coordinates: number[][]) => ({
  type: "Feature", geometry: { type: "LineString", coordinates },
  properties: { id: "osm-way-10", name: "Example", highway: "residential",
    sourceUrl: "https://www.openstreetmap.org/way/10", verification: "osm_unverified" },
});
test("flags repeated coordinates with an OSM source link", () => {
  const result = reviewRoadGeometry({ type: "FeatureCollection", features: [
    way([[101,3],[101.1,3],[101,3]])] });
  assert.equal(result.flaggedLines, 1);
  assert.equal(result.findings[0].sourceUrl, "https://www.openstreetmap.org/way/10");
  assert.equal(result.findings[0].consecutiveDuplicates, 0);
});
test("does not flag ordinary lines", () => {
  const result = reviewRoadGeometry({ type: "FeatureCollection", features: [
    way([[101,3],[101.1,3]])] });
  assert.equal(result.flaggedLines, 0);
});
