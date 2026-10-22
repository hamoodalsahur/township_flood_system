import {test} from "node:test";
import assert from "node:assert/strict";
import {csvCell,generateDemoResearchCsv} from "../src/lib/v2-research-export";
test("CSV escapes untrusted spreadsheet formulas and quotes",()=>{
 assert.equal(csvCell("=IMPORTDATA(\"x\")"),"\"'=IMPORTDATA(\"\"x\"\")\"");
 assert.equal(csvCell("  +SUM(1,2)"),"\"'  +SUM(1,2)\"");
 assert.equal(csvCell("ordinary"),"\"ordinary\"");
});
test("research export is deterministic and excludes resident descriptions or evidence",()=>{
 const t=new Date("2026-10-22T00:00:00Z");
 const csv=generateDemoResearchCsv([{id:"i",title:"Demo incident",category:"flooding",status:"under_review",createdAt:t,updatedAt:t,reports:[{reportId:"r"}]}],
 [{id:"r",category:"flooding",reviewState:"unverified",createdAt:t,incidentLink:{incidentId:"i"}}]);
 assert.match(csv,/incident/);assert.match(csv,/report/);
 assert.match(csv,/linked_report_count/);assert.doesNotMatch(csv,/description|base64|latitude|longitude/i);
 assert.equal(csv.split("\r\n").filter(Boolean).length,3);
});
