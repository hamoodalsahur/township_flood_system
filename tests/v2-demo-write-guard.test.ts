import {test} from "node:test";
import assert from "node:assert/strict";
import {checkDemoJsonSize,mayAcceptDemoSubmission,readBoundedDemoJson,DemoBodyTooLargeError} from "../src/lib/v2-demo-write-guard";
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

test("bounded JSON reader accepts valid payloads without Content-Length",async()=>{
 const request=new Request("http://localhost/demo",{method:"POST",body:JSON.stringify({category:"fictional",impact:"minor"})});
 assert.deepEqual(await readBoundedDemoJson(request,8192),{category:"fictional",impact:"minor"});
});
test("bounded JSON reader rejects oversized actual bytes even without declared length",async()=>{
 const request=new Request("http://localhost/demo",{method:"POST",body:JSON.stringify({payload:"x".repeat(512)})});
 await assert.rejects(()=>readBoundedDemoJson(request,64),DemoBodyTooLargeError);
});
test("bounded JSON reader counts UTF-8 bytes instead of characters",async()=>{
 const content=JSON.stringify({message:"éé"});
 const length=new TextEncoder().encode(content).length;
 await assert.rejects(()=>readBoundedDemoJson(new Request("http://localhost/demo",{method:"POST",body:content}),length-1),DemoBodyTooLargeError);
 assert.deepEqual(await readBoundedDemoJson(new Request("http://localhost/demo",{method:"POST",body:content}),length),{message:"éé"});
});
test("bounded JSON reader still returns syntax errors for malformed input",async()=>{
 await assert.rejects(()=>readBoundedDemoJson(new Request("http://localhost/demo",{method:"POST",body:"{bad json"}),100),SyntaxError);
});
