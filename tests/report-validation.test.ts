import assert from "node:assert/strict";
import { test } from "node:test";
import { parseSubmission, parseReview } from "../src/lib/report-validation";

test("valid fictional resident report",()=>{
 const result=parseSubmission({roadId:"RD-DEMO-WEST-GATE",category:"surface_water",description:"A fictional puddle at a junction"});
 assert.equal(result.roadId,"RD-DEMO-WEST-GATE");
});
test("reject malformed report",()=>{
 assert.throws(()=>parseSubmission({roadId:"RD-DEMO-WEST-GATE",category:"surface_water",description:"hi"}));
 assert.throws(()=>parseSubmission({roadId:"REAL-ROAD",category:"surface_water",description:"Fictional report"}));
});
test("review requires a decision and explanation",()=>{
 assert.equal(parseReview({decision:"corroborated",note:"Reviewed against synthetic evidence"}).status,"corroborated");
 assert.throws(()=>parseReview({decision:"approved",note:"Synthetic evidence"}));
 assert.throws(()=>parseReview({decision:"rejected",note:"no"}));
});
