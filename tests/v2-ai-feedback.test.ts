import assert from "node:assert/strict";
import {test} from "node:test";
import {canonicalReportPair,pairEligibleForFeedback,validateAiPairFeedback} from "../src/lib/v2-ai-feedback";
test("pair ordering is stable, independent of which report the reviewer opened",()=>{
 assert.deepEqual(canonicalReportPair("czzzzzzzzzz","caaaaaaaaaa"),["caaaaaaaaaa","czzzzzzzzzz"]);
 assert.throws(()=>canonicalReportPair("same","same"));
});
test("operator feedback requires an explicit judgement and explanation",()=>{
 const row=validateAiPairFeedback({candidateId:"c1234567890",judgement:"different_event",note:"Different fictional junctions"});
 assert.equal(row.judgement,"different_event");
 assert.throws(()=>validateAiPairFeedback({candidateId:"c1234567890",judgement:"confirmed_closed",note:"Different fictional junctions"}));
 assert.throws(()=>validateAiPairFeedback({candidateId:"c1234567890",judgement:"same_event",note:"no"}));
});
test("only nearby recent non-rejected pairs are allowed for simulated research feedback",()=>{
 const a={id:"a",latitude:3.087,longitude:101.43,createdAt:new Date("2026-10-22T00:00:00Z"),reviewState:"unverified"};
 assert.equal(pairEligibleForFeedback(a,{...a,id:"b",latitude:3.0871}),true);
 assert.equal(pairEligibleForFeedback(a,{...a,id:"b",latitude:3.10}),false);
 assert.equal(pairEligibleForFeedback(a,{...a,id:"b",reviewState:"rejected"}),false);
 assert.equal(pairEligibleForFeedback(a,{...a,id:"b",createdAt:new Date("2026-10-19T00:00:00Z")}),false);
});
