import assert from "node:assert/strict";
import { test } from "node:test";
import { convertOsmWay } from "../src/lib/bbr-osm-import";
import { validRoadCollection } from "../src/lib/bbr-roads";

function base() {
  return {
    type: "way", id: 987654, tags: { highway: "residential", name: "Sample Lane", bridge: "yes", oneway: "no" },
    nodes: [123456789, 123456790],
    geometry: [{ lon: 101.43, lat: 3.08 }, { lon: 101.431, lat: 3.081 }],
  };
}
test("imports OSM node IDs aligned with coordinates and keeps road tags", () => {
  const road = convertOsmWay(base());
  assert.ok(road);
  assert.deepEqual(road.properties.osmNodeIds, [123456789, 123456790]);
  assert.equal(road.properties.bridge, "yes");
  assert.equal(validRoadCollection({ type: "FeatureCollection", features: [road] }), true);
});
test("rejects node arrays that do not match the geometry", () => {
  assert.equal(convertOsmWay({ ...base(), nodes: [123456789] }), null);
  assert.equal(convertOsmWay({ ...base(), nodes: [123456789, -1] }), null);
});
test("keeps backwards compatibility with geometry-only exports", () => {
  const { nodes, ...older } = base();
  const road = convertOsmWay(older);
  assert.ok(road);
  assert.equal(road.properties.osmNodeIds, undefined);
});
test("validates optional source node IDs on GeoJSON", () => {
  const road = convertOsmWay(base());
  assert.ok(road);
  road.properties.osmNodeIds = [123456789];
  assert.equal(validRoadCollection({ type: "FeatureCollection", features: [road] }), false);
});
