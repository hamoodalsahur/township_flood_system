import assert from "node:assert/strict";
import { test } from "node:test";
import { inspectRoadResearchSnapshot } from "../src/lib/bbr-research-summary";

const way = (id: number, nodes?: number[]) => ({
  type: "Feature", geometry: { type: "LineString", coordinates: [[101.42,3.08],[101.43,3.08]] },
  properties: { id: "osm-way-" + id, name: "Sample", highway: "residential",
    sourceUrl: "https://www.openstreetmap.org/way/" + id, verification: "osm_unverified",
    ...(nodes ? { osmNodeIds: nodes } : {}) },
});
test("builds one combined summary without requiring source nodes", () => {
  const report = inspectRoadResearchSnapshot({ type: "FeatureCollection", features: [
    way(1), way(2)
  ] });
  assert.equal(report.roadLines, 2);
  assert.equal(report.coordinateResearch.sharedCoordinateLocations, 2);
  assert.equal(report.nodeSourceResearch.status, "missing_node_ids");
});
test("combined summary includes source-node findings after import", () => {
  const report = inspectRoadResearchSnapshot({ type: "FeatureCollection", features: [
    way(1, [10, 11]), way(2, [10, 12])
  ] });
  assert.equal(report.nodeSourceResearch.waysWithNodeIds, 2);
  assert.equal(report.nodeSourceResearch.sharedOsmNodes, 1);
});
