import assert from "node:assert/strict";
import { test } from "node:test";
import { hasDemoOperatorAccess } from "../src/lib/demo-access";

test("scenario controls reject missing or incorrect development keys", () => {
  const expected = "local-only-operator-example";
  assert.equal(hasDemoOperatorAccess(expected, null, "development"), false);
  assert.equal(hasDemoOperatorAccess(expected, "not-the-key", "development"), false);
  assert.equal(hasDemoOperatorAccess(expected, expected, "production"), false);
  assert.equal(hasDemoOperatorAccess(expected, expected, "development"), true);
});
