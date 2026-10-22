import assert from "node:assert/strict";
import {test} from "node:test";
import {incidentCandidateEligible} from "../src/lib/v2-incident-candidates";
const report={id:"report-1",category:"fallen_tree",description:"Fictional tree",reviewState:"unverified",latitude:3.1,longitude:101.4,createdAt:new Date("2026-10-01T10:00:00Z")};
test("matching candidates must share category and be recent and nearby",()=>{
 assert.ok(incidentCandidateEligible(report,{...report,id:"report-2",latitude:3.101},false));
 assert.equal(incidentCandidateEligible(report,{...report,id:"report-2",category:"flooding"},false),false);
 assert.equal(incidentCandidateEligible(report,{...report,id:"report-2",reviewState:"rejected"},false),false);
 assert.equal(incidentCandidateEligible(report,{...report,id:"report-2",latitude:3.2},false),false);
 assert.equal(incidentCandidateEligible(report,{...report,id:"report-2"},true),false);
});
