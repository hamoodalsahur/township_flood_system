import {test} from "node:test";
import assert from "node:assert/strict";
import {filterIncidentGroups,incidentStatusCounts} from "../src/lib/v212-incident-list";
const items=[
{id:"a",title:"Fictional blocked road",category:"road_damage",status:"under_review",possibleRoad:"Road A",createdAt:"2026-10-21T11:00:00Z"},
{id:"b",title:"Fictional waterlogging",category:"flooding",status:"resolved",possibleRoad:null,createdAt:"2026-10-20T11:00:00Z"},
{id:"c",title:"Fictional broken signs",category:"road_damage",status:"corroborated",possibleRoad:"Road B",createdAt:"2026-10-22T11:00:00Z"}
];
test("incident search includes title, id and optional fictional road text",()=>{
 const common={status:"all",category:"all",sort:"newest" as const};
 assert.deepEqual(filterIncidentGroups(items,{...common,query:"BLOCKED"}).map(x=>x.id),["a"]);
 assert.deepEqual(filterIncidentGroups(items,{...common,query:"road b"}).map(x=>x.id),["c"]);
 assert.deepEqual(filterIncidentGroups(items,{...common,query:" waterlogging "}).map(x=>x.id),["b"]);
});
test("multiple filters and stable sorting never change the input",()=>{
 const before=[...items];const common={query:"",status:"all",category:"all"};
 assert.deepEqual(filterIncidentGroups(items,{...common,sort:"newest"}).map(x=>x.id),["c","a","b"]);
 assert.deepEqual(filterIncidentGroups(items,{...common,sort:"oldest"}).map(x=>x.id),["b","a","c"]);
 assert.deepEqual(filterIncidentGroups(items,{...common,status:"under_review",sort:"newest"}).map(x=>x.id),["a"]);
 assert.deepEqual(filterIncidentGroups(items,{...common,category:"flooding",sort:"newest"}).map(x=>x.id),["b"]);
 assert.deepEqual(items,before);
});
test("aggregate statuses describe fictional workload not priority",()=>{
 assert.deepEqual(incidentStatusCounts(items),{total:3,underReview:1,corroborated:1,resolved:1});
 assert.equal(filterIncidentGroups(items,{query:"does not match",status:"all",category:"all",sort:"newest"}).length,0);
});
