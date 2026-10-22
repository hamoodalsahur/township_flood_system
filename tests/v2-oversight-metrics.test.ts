import {test} from "node:test";
import assert from "node:assert/strict";
import {deriveOversight} from "../src/lib/v2-oversight-metrics";
const now=new Date("2026-10-22T10:00:00Z");
test("oversight separates ageing review from reviewed and grouped cases",()=>{
 const records=[
  {id:"a",reviewState:"unverified",createdAt:new Date("2026-10-20T08:00:00Z"),incidentLink:{incidentId:"i1"}},
  {id:"b",reviewState:"corroborated",createdAt:now,incidentLink:{incidentId:"i1"}},
  {id:"c",reviewState:"unverified",createdAt:now,incidentLink:null},
  {id:"d",reviewState:"rejected",createdAt:now,incidentLink:null}
 ];
 const groups=[{id:"i1",status:"under_review",createdAt:new Date("2026-10-20T08:00:00Z"),reports:[{reportId:"a"},{reportId:"b"}],possibleRoad:"Fictional south road"},
 {id:"i2",status:"resolved",createdAt:now,reports:[{reportId:"z"}],possibleRoad:null}];
 const m=deriveOversight(records,groups,now);
 assert.equal(m.overdueUnverified,1);assert.equal(m.ungroupedReports,1);assert.equal(m.groupedReports,2);
 assert.equal(m.possibleRoadReferences,1);assert.equal(m.activeIncidents,1);assert.equal(m.multiReportIncidents,1);
 assert.deepEqual(m.ageingIncidentIds,["i1"]);
});
test("empty data has zero counts",()=>{const m=deriveOversight([],[],now);assert.equal(m.totalReports,0);assert.equal(m.activeIncidents,0);});
