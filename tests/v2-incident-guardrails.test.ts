import {test} from "node:test";
import assert from "node:assert/strict";
import {canAttachReport,canRejectGroupedReport,validateUnlink} from "../src/lib/v2-incident-guardrails";
const inc={category:"fallen_tree",status:"under_review",sourceMode:"simulation"};
const report={id:"report-abc",category:"fallen_tree",reviewState:"unverified",sourceMode:"simulation",linkedIncidentId:null};
test("guards linked, rejected, category-mismatched and resolved grouping",()=>{
 assert.equal(canAttachReport(inc,report),null);
 assert.match(canAttachReport(inc,{...report,linkedIncidentId:"incident-1"})||"",/already assigned/);
 assert.match(canAttachReport(inc,{...report,reviewState:"rejected"})||"",/Rejected/);
 assert.match(canAttachReport(inc,{...report,category:"flooding"})||"",/category/);
 assert.match(canAttachReport({...inc,status:"resolved"},report)||"",/read-only/);
});
test("rejecting grouped reports is blocked while corroboration remains possible",()=>{
 assert.equal(canRejectGroupedReport("incident-1","rejected"),false);
 assert.equal(canRejectGroupedReport(null,"rejected"),true);
 assert.equal(canRejectGroupedReport("incident-1","corroborated"),true);
});
test("unlink requires traceable operator note",()=>{
 assert.equal(validateUnlink({reportId:"report-abc",note:"Different fictional junction reported"}).reportId,"report-abc");
 assert.throws(()=>validateUnlink({reportId:"report-abc",note:"no"}));
});
