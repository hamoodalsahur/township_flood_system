import assert from "node:assert/strict";
import { test } from "node:test";
import { roadCategory, filterRoads, roadStyle } from "../src/lib/bbr-road-display";
import type { RoadFeature } from "../src/lib/bbr-roads";

function road(highway: string): RoadFeature {
  return { type: "Feature", geometry: { type: "LineString", coordinates: [[101.43, 3.08], [101.44, 3.09]] }, properties: { id: "osm-way-123", name: "Test", highway, sourceUrl: "https://www.openstreetmap.org/way/123", verification: "osm_unverified" } };
}
test("classifies major, local, service and other OSM ways", () => {
  assert.equal(roadCategory("primary"), "major");
  assert.equal(roadCategory("residential"), "local");
  assert.equal(roadCategory("service"), "service");
  assert.equal(roadCategory("road"), "other");
});
test("filters road features without editing the source list", () => {
  const source = [road("primary"), road("residential"), road("service")];
  assert.equal(filterRoads(source, "all").length, 3);
  assert.equal(filterRoads(source, "major").length, 1);
  assert.equal(source.length, 3);
});
test("major roads display more prominently than service roads", () => {
  assert.ok(roadStyle("primary").weight > roadStyle("service").weight);
});
