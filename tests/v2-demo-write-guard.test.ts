import {test} from "node:test";
import assert from "node:assert/strict";
import {checkDemoJsonSize,mayAcceptDemoSubmission} from "../src/lib/v2-demo-write-guard";
test("public demo submissions fail closed outside local development",()=>{
 assert.equal(mayAcceptDemoSubmission("development"),true);
 assert.equal(mayAcceptDemoSubmission("production"),false);
 assert.equal(mayAcceptDemoSubmission("test"),false);
 assert.equal(mayAcceptDemoSubmission(undefined),false);
});
test("preflight accepts small requests and rejects oversized declarations",()=>{
 const req=(length:string|null)=>({headers:new Headers(length===null?{}:{"content-length":length})});
 assert.equal(checkDemoJsonSize(req("500"),4096),true);
 assert.equal(checkDemoJsonSize(req("50000"),4096),false);
 assert.equal(checkDemoJsonSize(req("broken"),4096),false);
 assert.equal(checkDemoJsonSize(req(null),4096),true);
});
