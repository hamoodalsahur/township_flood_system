import assert from "node:assert/strict";
import { test } from "node:test";
import { CATEGORY_LABELS, DEMO_HAZARDS, HAZARD_CATEGORIES, filterDemoHazards } from "../src/lib/demo-hazards";
test("each demo marker is explicit simulation data with a supported category", () => {
  for (const hazard of DEMO_HAZARDS) {
    assert.equal(hazard.sourceMode,"simulation");
    assert.equal(hazard.status,"fictional_unverified");
    assert.ok(HAZARD_CATEGORIES.includes(hazard.category));
    assert.ok(hazard.coordinates[0] > 101 && hazard.coordinates[1] > 3);
  }
});
test("filter never changes or upgrades hazard status", () => {
  assert.equal(filterDemoHazards("fallen_tree").length,1);
  assert.equal(filterDemoHazards("all").length,DEMO_HAZARDS.length);
  assert.equal(filterDemoHazards("road_obstruction").length,0);
  assert.ok(Object.keys(CATEGORY_LABELS).length >= 7);
});
