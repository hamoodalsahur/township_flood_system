import assert from "node:assert/strict";
import { test } from "node:test";
import { HAZARD_CATEGORIES } from "../src/lib/demo-hazards";
import { HAZARD_SYMBOLS } from "../src/lib/hazard-symbols";
test("each supported hazard has its own recognizable marker symbol and text", () => {
  assert.deepEqual(Object.keys(HAZARD_SYMBOLS).sort(), [...HAZARD_CATEGORIES].sort());
  const symbols = HAZARD_CATEGORIES.map(category => HAZARD_SYMBOLS[category].symbol);
  assert.equal(new Set(symbols).size, symbols.length);
  for (const category of HAZARD_CATEGORIES) {
    assert.ok(HAZARD_SYMBOLS[category].label.length > 0);
    assert.match(HAZARD_SYMBOLS[category].color, /^#[0-9a-f]{6}$/i);
  }
});
