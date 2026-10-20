import assert from "node:assert/strict";
import { test } from "node:test";
import {
  COORDINATE_SYSTEM,
  DATA_MODE,
  DEFAULT_ROAD_STATUS,
  demoEdgeLength,
  demoNodes,
  demoRoads,
  demoZones,
  validateDemoNetwork,
} from "../src/lib/demo-network";

test("seed graph has four zones, eight nodes and ten connected edges", () => {
  assert.equal(demoZones.length, 4);
  assert.equal(demoNodes.length, 8);
  assert.equal(demoRoads.length, 10);
  assert.doesNotThrow(validateDemoNetwork);
});

test("seed contains three gateways and a non-driving park trail", () => {
  assert.equal(demoRoads.filter(road => road.corridorType === "ingress_egress_gateway").length, 3);
  assert.equal(demoRoads.filter(road => road.corridorType === "park_trail").length, 1);
});

test("all road segments have positive schematic distances", () => {
  for (const road of demoRoads) {
    assert.ok(demoEdgeLength(road.fromNodeId, road.toNodeId) > 0);
  }
});

test("the dataset cannot be confused with live flood measurements or GPS geometry", () => {
  assert.equal(DATA_MODE, "simulation");
  assert.equal(COORDINATE_SYSTEM, "schematic_xy");
  assert.equal(DEFAULT_ROAD_STATUS, "unknown");
  assert.ok(demoRoads.every(road => road.label.includes("illustrative")));
  assert.ok(demoZones.every(zone => zone.description.includes("not")));
});
