import assert from "node:assert/strict";
import {test} from "node:test";
import {inspectDemoQuality} from "../src/lib/v2-demo-quality";
test("empty fictional dataset has no detected inconsistencies",()=>assert.deepEqual(inspectDemoQuality([],[]),[]));
test("checks inconsistency without mutating incident records",()=>{
 const report={id:"report-one",category:"fallen_tree",description:"Some fictional tree",longitude:101.5,latitude:3.2,reviewState:"rejected",sourceMode:"simulation",incidentLink:{incidentId:"incident-one"}};
 const incident={id:"incident-one",category:"flooding",status:"under_review",reports:[{report:{id:"report-one",category:"fallen_tree",reviewState:"rejected"}}]};
 const issues=inspectDemoQuality([report],[incident]);
 assert.ok(issues.some(x=>x.kind==="rejected_but_grouped"));
 assert.ok(issues.some(x=>x.kind==="category_mismatch"));
 assert.equal(report.reviewState,"rejected");
});
test("invalid coordinate and empty groups are flagged",()=>{
 const report={id:"r",category:"flooding",description:"short",longitude:200,latitude:95,reviewState:"unverified",sourceMode:"simulation",incidentLink:null};
 const incident={id:"i",category:"flooding",status:"bad",reports:[]};
 const types=inspectDemoQuality([report],[incident]).map(x=>x.kind);
 assert.ok(types.includes("invalid_coordinates"));assert.ok(types.includes("empty_incident"));
 assert.ok(types.includes("unknown_lifecycle_state"));
});
