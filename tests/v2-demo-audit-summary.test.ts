import {test} from "node:test";
import assert from "node:assert/strict";
import {summarizeDemoAudit} from "../src/lib/v2-demo-audit-summary";
const now=new Date("2026-10-22T12:00:00Z");
const sample=(action:string,hoursAgo:number)=>({action,createdAt:new Date(now.getTime()-hoursAgo*3600000)});
test("aggregate action categories and age windows without exposing actor or subject",()=>{
 const summary=summarizeDemoAudit([
  sample("v2_demo_incident_created",1),
  sample("v2_demo_incident_report_linked",25),
  sample("v2_demo_hazard_review",24),
  sample("scenario_stage_advanced",168),
  sample("legacy_review",200)
 ],now);
 assert.equal(summary.totalActions,5);
 assert.equal(summary.incidentManagementActions,2);
 assert.equal(summary.geographicReviewActions,1);
 assert.equal(summary.scenarioOrRoadDemoActions,1);
 assert.equal(summary.otherDemoActions,1);
 assert.equal(summary.last24Hours,2);
 assert.equal(summary.last7Days,4);
 assert.equal("actor" in summary,false);
 assert.equal("subjectId" in summary,false);
 assert.match(summary.disclaimer,/not proof of complete logging/);
});
test("future and invalid times are not counted as recent history",()=>{
 const x=summarizeDemoAudit([sample("demo_test",-1),{action:"a",createdAt:new Date("invalid")}],now);
 assert.equal(x.invalidOrFutureTimestamps,2);
 assert.equal(x.last24Hours,0);
});
test("empty demo data returns zero counts",()=>{
 const x=summarizeDemoAudit([],now);
 assert.equal(x.totalActions,0);
 assert.equal(x.last7Days,0);
});
