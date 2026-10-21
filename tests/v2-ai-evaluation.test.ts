import assert from "node:assert/strict";
import {test} from "node:test";
import {EVALUATION_PAIRS,MALAY_LANGUAGE_CASE_IDS} from "../src/lib/v2-evaluation-fixtures";
import {evaluatePairs} from "../src/lib/v2-ai-evaluation";
import {HAZARD_CATEGORIES} from "../src/lib/demo-hazards";
test("fictional evaluation covers hazard categories, languages and hard negatives",()=>{
 assert.equal(EVALUATION_PAIRS.length,42);
 assert.equal(new Set(EVALUATION_PAIRS.map(p=>p.id)).size,EVALUATION_PAIRS.length);
 assert.deepEqual(new Set(EVALUATION_PAIRS.map(p=>p.category)),new Set(HAZARD_CATEGORIES));
 assert.equal(EVALUATION_PAIRS.filter(p=>p.sameEvent).length,21);
 assert.equal(EVALUATION_PAIRS.filter(p=>!p.sameEvent).length,21);
 assert.ok(EVALUATION_PAIRS.some(p=>/pokok|jalan|lubang|longkang/i.test(p.first)));
 assert.equal(MALAY_LANGUAGE_CASE_IDS.length,13);
 assert.ok(MALAY_LANGUAGE_CASE_IDS.every(id=>EVALUATION_PAIRS.some(p=>p.id===id)));
});
test("precision recall and F1 are calculated from explicit false positives and negatives",()=>{
 const r=evaluatePairs([
  {id:"tp",sameEvent:true,score:0.9},{id:"fn",sameEvent:true,score:0.3},
  {id:"fp",sameEvent:false,score:0.8},{id:"tn",sameEvent:false,score:0.1}
 ],0.75);
 assert.deepEqual([r.tp,r.fp,r.tn,r.fn],[1,1,1,1]);
 assert.equal(r.precision,0.5);assert.equal(r.recall,0.5);assert.equal(r.f1,0.5);
 assert.deepEqual(r.falsePositiveIds,["fp"]);assert.deepEqual(r.falseNegativeIds,["fn"]);
});
test("benchmark guards against invalid thresholds and model vectors",()=>{
 assert.throws(()=>evaluatePairs([],2));
 assert.throws(()=>evaluatePairs([{id:"a",sameEvent:true,score:NaN}],0.78));
});
