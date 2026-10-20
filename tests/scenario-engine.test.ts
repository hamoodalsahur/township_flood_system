import assert from "node:assert/strict";
import { test } from "node:test";
import { assessRisk, getStageSnapshot, isDemoStage, roadStatusesForStage, SIMULATED_ROAD_IDS } from "../src/lib/scenario-engine";

test("five synthetic stages have valid risk assessment", () => {
  for (let i=1;i<=5;i++) {
    assert.ok(isDemoStage(i));
    const snapshot = getStageSnapshot(i as 1|2|3|4|5);
    assert.ok(["low","moderate","high"].includes(snapshot.overallRisk));
    assert.ok(snapshot.riskExplanation.length > 0);
  }
  assert.equal(isDemoStage(0), false);
  assert.equal(isDemoStage(6), false);
  assert.equal(isDemoStage("3"), false);
});
test("synthetic risk increases with heavy rain and storage", () => {
  assert.equal(assessRisk(2,18,"normal").risk,"low");
  assert.equal(assessRisk(65,68,"normal").risk,"moderate");
  assert.equal(assessRisk(85,92,"high").risk,"high");
  assert.throws(()=>assessRisk(-1,80,"normal"));
  assert.throws(()=>assessRisk(10,101,"normal"));
});
test("scripted confirmed closure remains closed in recovery stage", () => {
  assert.equal(roadStatusesForStage(4)["RD-DEMO-WEST-GATE"],"confirmed_closed");
  assert.equal(roadStatusesForStage(5)["RD-DEMO-WEST-GATE"],"confirmed_closed");
  assert.equal(roadStatusesForStage(5)["RD-DEMO-TRAIL"],"confirmed_closed");
  assert.equal(roadStatusesForStage(3)["RD-DEMO-WEST-GATE"],"reported_flooding_unverified");
  assert.equal(Object.keys(roadStatusesForStage(2)).length,SIMULATED_ROAD_IDS.length);
});
