import assert from "node:assert/strict";
import { test } from "node:test";
import { DEMO_PRESETS, isValidDemoPreset } from "../src/lib/demo-showcase";
import { getStageSnapshot, roadStatusesForStage } from "../src/lib/scenario-engine";

test("five one-click scenes map to the existing synthetic scenario engine", () => {
  assert.deepEqual(DEMO_PRESETS.map(scene => scene.stage), [1, 2, 3, 4, 5]);
  for (const scene of DEMO_PRESETS) {
    assert.ok(isValidDemoPreset(scene.stage));
    assert.ok(getStageSnapshot(scene.stage).title.length > 0);
    assert.ok(scene.highlight.length > 0);
  }
  assert.equal(isValidDemoPreset("4"), false);
  assert.equal(isValidDemoPreset(0), false);
  assert.equal(isValidDemoPreset(6), false);
});
test("heavy-rain scene marks example roads at risk without inventing a live closure", () => {
  const stage = roadStatusesForStage(2);
  assert.equal(stage["RD-DEMO-WEST-GATE"], "at_risk");
  assert.equal(stage["RD-DEMO-SOUTH"], "at_risk");
});
test("road-closure scene and recovery preserve fictional gate closure", () => {
  const response = roadStatusesForStage(4);
  assert.equal(response["RD-DEMO-WEST-GATE"], "confirmed_closed");
  assert.equal(roadStatusesForStage(5)["RD-DEMO-WEST-GATE"], "confirmed_closed");
  assert.equal(roadStatusesForStage(1)["RD-DEMO-WEST-GATE"], "unknown");
});
