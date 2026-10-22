import {test} from "node:test";
import assert from "node:assert/strict";
import {filterReviewReports,reportReviewCounts} from "../src/lib/v212-report-review-list";
const records=[
 {id:"a",category:"flooding",description:"Fictional standing water",reviewState:"unverified",createdAt:"2026-10-20T10:00:00Z"},
 {id:"b",category:"road_damage",description:"Fictional surface issue",reviewState:"corroborated",createdAt:"2026-10-22T10:00:00Z"},
 {id:"c",category:"road_damage",description:"Fictional cracks",reviewState:"unverified",createdAt:"2026-10-21T10:00:00Z"}
];
test("need-review ordering prioritizes unverified reports without claiming hazard severity",()=>{
 const filtered=filterReviewReports(records,{query:"",category:"all",reviewState:"all",order:"needs_review_first"});
 assert.deepEqual(filtered.map(x=>x.id),["c","a","b"]);
 assert.deepEqual(records.map(x=>x.id),["a","b","c"]);
});
test("search is trimmed/case insensitive and category/state filters combine",()=>{
 const common={order:"newest" as const};
 assert.deepEqual(filterReviewReports(records,{...common,query:" CRACKS ",category:"all",reviewState:"all"}).map(x=>x.id),["c"]);
 assert.deepEqual(filterReviewReports(records,{...common,query:"",category:"road_damage",reviewState:"unverified"}).map(x=>x.id),["c"]);
 assert.equal(filterReviewReports(records,{...common,query:"unmatched",category:"all",reviewState:"all"}).length,0);
});
test("sorted review list and counts are stable and non-mutating",()=>{
 const common={query:"",category:"all",reviewState:"all"};
 assert.deepEqual(filterReviewReports(records,{...common,order:"newest"}).map(x=>x.id),["b","c","a"]);
 assert.deepEqual(filterReviewReports(records,{...common,order:"oldest"}).map(x=>x.id),["a","c","b"]);
 assert.deepEqual(reportReviewCounts(records),{total:3,unverified:2,corroborated:1});
});
