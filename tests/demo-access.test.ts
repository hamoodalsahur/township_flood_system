import assert from "node:assert/strict";
import {test} from "node:test";
import {hasDemoOperatorAccess} from "../src/lib/demo-access";
test("demo access is disabled outside development",()=>{
 assert.equal(hasDemoOperatorAccess("private-test-key-123","private-test-key-123","production"),false);
 assert.equal(hasDemoOperatorAccess("private-test-key-123","private-test-key-123","development"),true);
});
test("missing, weak and wrong keys do not work",()=>{
 assert.equal(hasDemoOperatorAccess(undefined,"anything","development"),false);
 assert.equal(hasDemoOperatorAccess("short","short","development"),false);
 assert.equal(hasDemoOperatorAccess("private-test-key-123","incorrect","development"),false);
});
