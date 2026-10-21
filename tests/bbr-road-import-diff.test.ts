import assert from "node:assert/strict";
import { test } from "node:test";
import { compareRoadImports } from "../src/lib/bbr-road-import-diff";
import type { RoadCollection, RoadFeature } from "../src/lib/bbr-roads";

function way(id: number, nodes?: number[]): RoadFeature {
  return { type: "Feature", geometry: { type: "LineString", coordinates: [[101.42,3.08],[101.43,3.08]] },
    properties: { id: "osm-way-" + id, name: "Test", highway: "residential",
      sourceUrl: "https://www.openstreetmap.org/way/" + id, verification: "osm_unverified",
      ...(nodes ? { osmNodeIds: nodes } : {}) } };
}
const collection = (...features: RoadFeature[]): RoadCollection => ({ type: "FeatureCollection", features });
test("compares road IDs and reports new node coverage", () => {
  const diff = compareRoadImports(collection(way(1), way(2)), collection(way(2,[20,21]), way(3,[30,31])));
  assert.equal(diff.previousLines, 2);
  assert.equal(diff.addedWayIds, 1);
  assert.equal(diff.removedWayIds, 1);
  assert.equal(diff.linesWithOsmNodes, 2);
  assert.deepEqual(diff.addedExamples, ["osm-way-3"]);
});
test("handles the first import without inventing a previous road count", () => {
  const diff = compareRoadImports(null, collection(way(1,[10,11])));
  assert.equal(diff.previousLines, null);
  assert.equal(diff.importedLines, 1);
});
