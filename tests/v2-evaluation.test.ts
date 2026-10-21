import assert from "node:assert/strict";
import {test} from "node:test";
import {EVALUATION_CASES} from "../src/lib/v2-evaluation-cases";
import {evaluateEmbeddings,evaluateThresholds} from "../src/lib/v2-evaluation-metrics";
test("labelled synthetic evaluation fixture is paired and varied",()=>{
 assert.equal(EVALUATION_CASES.length,16);
 const groupCounts=new Map<string,number>();
 for(const c of EVALUATION_CASES){groupCounts.set(c.group,(groupCounts.get(c.group)||0)+1);assert.ok(c.description.length>15);}
 assert.equal(groupCounts.size,8);
 assert.ok([...groupCounts.values()].every(n=>n===2));
});
test("perfect embeddings yield perfect classifications at 0.78",()=>{
 const groups=[...new Set(EVALUATION_CASES.map(x=>x.group))];
 const vectors=EVALUATION_CASES.map(c=>groups.map(group=>group===c.group?1:0));
 const result=evaluateEmbeddings(EVALUATION_CASES,vectors,0.78);
 assert.equal(result.pairCount,120);assert.equal(result.tp,8);assert.equal(result.fp,0);
 assert.equal(result.precision,1);assert.equal(result.recall,1);assert.equal(result.f1,1);
 assert.equal(evaluateThresholds(EVALUATION_CASES,vectors).length,7);
});
test("overmatching is reflected as false positives",()=>{
 const vectors=EVALUATION_CASES.map(()=>[1,0]);
 const result=evaluateEmbeddings(EVALUATION_CASES,vectors,0.78);
 assert.equal(result.tp,8);assert.equal(result.fp,112);
 assert.equal(result.precision,0.067);assert.equal(result.recall,1);
});
test("invalid vector counts and thresholds fail closed",()=>{
 assert.throws(()=>evaluateEmbeddings(EVALUATION_CASES,[[1]],0.78));
 assert.throws(()=>evaluateEmbeddings(EVALUATION_CASES,EVALUATION_CASES.map(()=>[1]),5));
});
