import assert from "node:assert/strict";
import { test } from "node:test";
import { parseSubmission } from "../src/lib/report-validation";
test("expanded multi-hazard categories are accepted for the fictional road report", () => {
  for (const category of ["fallen_tree","pothole","roadworks","storm_damage","road_obstruction","surface_water"]) {
    const submission = parseSubmission({roadId:"RD-DEMO-WEST-GATE",category,description:"Fictional example for testing."});
    assert.equal(submission.category,category);
  }
});
test("unknown report categories cannot change controlled validation", () => {
  assert.throws(() => parseSubmission({roadId:"RD-DEMO-WEST-GATE",category:"confirmed_closed",description:"Fictional example for testing."}));
});
