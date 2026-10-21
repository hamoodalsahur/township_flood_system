import assert from "node:assert/strict";
import { test } from "node:test";
import { validateHazardReview, validateHazardSubmission } from "../src/lib/v2-hazard-validation";
test("accepts fictional mapped hazard with impact independent of category",()=>{
 const report=validateHazardSubmission({category:"fallen_tree",description:"A fictional damaged tree.",impact:"unknown",coordinates:[101.435,3.087]});
 assert.equal(report.impact,"unknown");
});
test("rejects malformed, missing and out of study-window positions",()=>{
 const valid={category:"pothole",description:"Fictional damaged roadway.",impact:"caution"};
 assert.throws(()=>validateHazardSubmission({...valid,coordinates:[0,0]}));
 assert.throws(()=>validateHazardSubmission({...valid,coordinates:["101",3.087]}));
 assert.throws(()=>validateHazardSubmission({...valid,coordinates:[101.435,3.087],impact:"confirmed_closed"}));
});
test("requires a reason for operator demo review",()=>{
 assert.deepEqual(validateHazardReview({decision:"corroborated",note:"Checked fictional example."}),{decision:"corroborated",note:"Checked fictional example.",publishPhoto:false});
 assert.throws(()=>validateHazardReview({decision:"rejected",note:"no"}));
});
