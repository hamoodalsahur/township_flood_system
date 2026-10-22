import {test} from "node:test";
import assert from "node:assert/strict";
import {reviewPhotoPresentation} from "../src/lib/v216-review-photo-presentation";
test("only an approved image attached to a corroborated fictional report auto-renders",()=>{
 assert.equal(reviewPhotoPresentation("approved_public_demo","corroborated"),"approved_inline");
 assert.equal(reviewPhotoPresentation("approved_public_demo","unverified"),"unavailable");
 assert.equal(reviewPhotoPresentation("approved_public_demo","rejected"),"unavailable");
});
test("unapproved sample images never auto-render, even if a report is corroborated",()=>{
 for(const state of ["private_unreviewed","private_rejected"] as const){
  assert.equal(reviewPhotoPresentation(state,"unverified"),"inspect_private");
  assert.equal(reviewPhotoPresentation(state,"corroborated"),"inspect_private");
 }
});
test("missing evidence and unavailable metadata never trigger image retrieval",()=>{
 assert.equal(reviewPhotoPresentation("none","corroborated"),"none");
 assert.equal(reviewPhotoPresentation(null,"corroborated"),"unavailable");
 assert.equal(reviewPhotoPresentation("unknown","corroborated"),"unavailable");
});
