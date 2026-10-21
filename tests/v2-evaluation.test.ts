import assert from "node:assert/strict";
import {test} from "node:test";
import {EVALUATION_CASES,evaluationSplit} from "../src/lib/v2-evaluation-cases";
import {evaluateEmbeddings,evaluateThresholds,chooseDevelopmentThreshold,positivePairLanguageRecall,diagnosticErrors} from "../src/lib/v2-evaluation-metrics";

test("48 authored synthetic cases are disjoint across development and holdout",()=>{
 assert.equal(EVALUATION_CASES.length,48);
 const dev=evaluationSplit("development"),hold=evaluationSplit("holdout");
 assert.equal(dev.length,24);assert.equal(hold.length,24);
 assert.equal(new Set(dev.map(c=>c.group)).size,12);
 assert.equal(new Set(hold.map(c=>c.group)).size,12);
 assert.ok(!dev.some(d=>hold.some(h=>d.group===h.group||d.id===h.id)));
 for(const split of [dev,hold]){
  const sizes=new Map<string,number>();
  for(const c of split){
   assert.ok(c.description.length>=20);
   sizes.set(c.group,(sizes.get(c.group)||0)+1);
  }
  assert.ok([...sizes.values()].every(n=>n===2));
  assert.ok(split.some(c=>c.language==="ms")&&split.some(c=>c.language==="en"));
 }
});
test("ideal vectors classify 12 held-out positive pairs without false positives",()=>{
 const cases=evaluationSplit("holdout");
 const groups=[...new Set(cases.map(c=>c.group))];
 const vectors=cases.map(c=>groups.map(g=>g===c.group?1:0));
 const m=evaluateEmbeddings(cases,vectors,0.78);
 assert.equal(m.pairCount,276);assert.equal(m.tp,12);assert.equal(m.tn,264);assert.equal(m.fp,0);
 assert.equal(m.precision,1);assert.equal(m.recall,1);assert.equal(m.f1,1);
 assert.equal(evaluateThresholds(cases,vectors).length,7);
 assert.deepEqual(diagnosticErrors(cases,vectors,0.78),{falsePositives:[],falseNegatives:[]});
 assert.equal(positivePairLanguageRecall(cases,vectors,0.78).reduce((sum,r)=>sum+r.positivePairs,0),12);
});
test("same-vector model exposes 264 false matches, not misleading perfect accuracy",()=>{
 const cases=evaluationSplit("development"),vectors=cases.map(()=>[1,0]);
 const m=evaluateEmbeddings(cases,vectors,0.78);
 assert.equal(m.tp,12);assert.equal(m.fp,264);assert.equal(m.tn,0);
 assert.equal(diagnosticErrors(cases,vectors,0.78,3).falsePositives.length,3);
});
test("threshold selection prefers development F1 and resolves ties conservatively",()=>{
 const cases=evaluationSplit("development");
 const vectors=cases.map((c)=>[c.group===cases[0].group?1:0,1]);
 const rows=evaluateThresholds(cases,vectors);
 const pick=chooseDevelopmentThreshold(rows);
 assert.ok(rows.some(x=>x.threshold===pick));
 const tied=[{...rows[0],threshold:0.7,f1:0.9,precision:0.8,fp:2},{...rows[0],threshold:0.85,f1:0.9,precision:0.8,fp:1}];
 assert.equal(chooseDevelopmentThreshold(tied),0.85);
 assert.equal(chooseDevelopmentThreshold([{...rows[0],f1:null}]),0.78);
});
test("mixed-split vectors and invalid thresholds are rejected",()=>{
 const cases=evaluationSplit("development");
 assert.throws(()=>evaluateEmbeddings(cases,[[1]],0.78));
 assert.throws(()=>evaluateEmbeddings(cases,cases.map(()=>[1]),4));
 assert.throws(()=>evaluateEmbeddings([cases[0],evaluationSplit("holdout")[0]],[[1],[1]],0.78));
});
