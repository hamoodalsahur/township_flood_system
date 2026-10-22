import {test} from "node:test";import assert from "node:assert/strict";
import {inspectDemoReadiness} from "../src/lib/v2-demo-readiness";
test("reports complete local demo configuration without returning secrets",()=>{
 const list=inspectDemoReadiness({environment:"development",databaseUrl:"file:./dev.db",operatorKey:"supersecret-value",provider:"ollama",embedModel:"nomic-embed-text",roadFilePresent:true,roadFeatures:12,databaseAccessible:true});
 assert.ok(list.every(c=>c.passed));assert.doesNotMatch(JSON.stringify(list),/supersecret-value/);
});
test("production and missing database remain blocked",()=>{
 const list=inspectDemoReadiness({environment:"production",databaseUrl:undefined,operatorKey:"replace-with-private-dev-key",provider:"openai",embedModel:undefined,roadFilePresent:false,roadFeatures:null,databaseAccessible:false});
 assert.ok(list.every(c=>!c.passed));
});
