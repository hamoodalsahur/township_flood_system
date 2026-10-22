import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=(p:string)=>readFileSync(p,"utf8");
test("both management lists use compact selectable rows and preserve manual details",()=>{
 const reports=read("src/components/management/V2HazardManager.tsx");
 const groups=read("src/components/management/IncidentManager.tsx");
 assert.match(reports,/aria-expanded=\{selectedReportId===item\.id\}/);
 assert.match(reports,/selectedReportId===item\.id\?<div id=/);
 assert.match(groups,/aria-expanded=\{selectedIncidentId===incident\.id\}/);
 assert.match(groups,/selectedIncidentId===incident\.id\?<div id=/);
 assert.doesNotMatch(reports,/visibleItems\.map\(item=><article/);
 assert.doesNotMatch(groups,/visible\.map\(incident=><article/);
});
test("operator and private-photo safeguards remain inside selected items",()=>{
 const reports=read("src/components/management/V2HazardManager.tsx");
 const groups=read("src/components/management/IncidentManager.tsx");
 for(const s of ["function toggleReport","URL.revokeObjectURL(url)","publishPhotos[item.id]","Corroborate report","Reject report"])assert.ok(reports.includes(s));
 for(const s of ["Create a fictional incident group","Find AI candidates","Link selected report","Save incident decision","IncidentRoadCandidates","Operator justification"])assert.ok(groups.includes(s));
});
