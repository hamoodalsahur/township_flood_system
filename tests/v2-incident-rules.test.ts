import assert from "node:assert/strict";
import {test} from "node:test";
import {canTransitionIncident,validateIncidentCreate,validateIncidentLink,validateIncidentUpdate} from "../src/lib/v2-incident-rules";
test("valid operator incident requests",()=>{
 assert.equal(validateIncidentCreate({reportId:"report-123",title:"Blocked east junction",note:"Two matching witness summaries"}).title,"Blocked east junction");
 assert.equal(validateIncidentLink({reportId:"report-123",note:"Descriptions refer to same fictional place"}).reportId,"report-123");
 assert.equal(validateIncidentUpdate({status:"under_review",note:"Checking the synthetic reports",possibleRoad:"Demo main road"}).possibleRoad,"Demo main road");
});
test("requires reason and blocks invalid status",()=>{
 assert.throws(()=>validateIncidentCreate({reportId:"12345",title:"Short",note:"no"}));
 assert.throws(()=>validateIncidentLink({reportId:"id",note:"Bad"}));
 assert.throws(()=>validateIncidentUpdate({status:"officially_closed",note:"Not permitted to close roads"}));
});
test("incident lifecycle cannot reopen resolved state",()=>{
 assert.ok(canTransitionIncident("under_review","corroborated"));
 assert.ok(canTransitionIncident("corroborated","resolved"));
 assert.ok(canTransitionIncident("under_review","resolved"));
 assert.equal(canTransitionIncident("resolved","under_review"),false);
 assert.equal(canTransitionIncident("corroborated","under_review"),false);
});
