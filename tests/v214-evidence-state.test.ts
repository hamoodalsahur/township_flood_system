import {test} from "node:test";
import assert from "node:assert/strict";
import {describePrivatePhotoState,photoStateFromRecord} from "../src/lib/v214-evidence-state";
test("only private unreviewed photos are eligible for the existing separate approval choice",()=>{
 const values=["none","private_unreviewed","private_rejected","approved_public_demo","unknown"] as const;
 assert.deepEqual(values.filter(k=>describePrivatePhotoState(k).canOfferApproval),["private_unreviewed"]);
 assert.equal(describePrivatePhotoState("approved_public_demo").publicDemo,true);
 assert.equal(describePrivatePhotoState("private_rejected").publicDemo,false);
});
test("missing or unexpected metadata never implies a photo can be published",()=>{
 assert.equal(photoStateFromRecord(null),"none");
 assert.equal(photoStateFromRecord(undefined),"none");
 assert.equal(photoStateFromRecord("broken"),"unknown");
 assert.equal(describePrivatePhotoState("unknown").canOfferApproval,false);
});
test("states describe demonstration decisions, not verified road evidence",()=>{
 for(const value of ["none","private_unreviewed","private_rejected","approved_public_demo","unknown"] as const){
  const s=describePrivatePhotoState(value);
  assert.ok(s.label.length>4);
  assert.ok(s.explanation.length>20);
 }
 assert.match(describePrivatePhotoState("approved_public_demo").explanation,/not as verified road evidence/);
});
