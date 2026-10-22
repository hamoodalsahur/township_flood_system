import {test} from "node:test";
import assert from "node:assert/strict";
import {deriveReviewAgeQueue,type QueuedReport,type QueuedIncident} from "../src/lib/v2-review-age-queue";
const now=new Date("2026-10-22T12:00:00.000Z");
const time=(hours:number)=>new Date(now.getTime()-hours*3600000);
const report=(id:string,hours:number,reviewState="unverified",grouped=false):QueuedReport=>({
 id,category:"flooding",reviewState,createdAt:time(hours),incidentLink:grouped?{incidentId:"demo"}:null
});
const incident=(id:string,hours:number,status="under_review"):QueuedIncident=>({
 id,category:"roadworks",status,createdAt:time(hours)
});

test("sorts fictional review records by age and excludes resolved or reviewed entries",()=>{
 const result=deriveReviewAgeQueue([
  report("young",1),report("old",80,"unverified",true),report("reviewed",99,"corroborated")
 ],[incident("group",27),incident("resolved",200,"resolved")],now);
 assert.deepEqual(result.entries.map(x=>x.id),["old","group","young"]);
 assert.equal(result.eligibleCount,3);
 assert.equal(result.olderThan24h,2);
 assert.equal(result.olderThan72h,1);
 assert.equal(result.entries[0].grouped,true);
 assert.match(result.disclaimer,/not incident severity/);
});

test("counts threshold edges and does not mistake future dates for overdue",()=>{
 const result=deriveReviewAgeQueue([report("a",24),report("b",72),report("future",-1)],[],now);
 assert.equal(result.olderThan24h,2);
 assert.equal(result.olderThan72h,1);
 assert.equal(result.futureOrInvalidDates,1);
 assert.equal(result.entries.length,2);
});

test("caps display entries without losing aggregate totals",()=>{
 const reports=Array.from({length:18},(_,i)=>report(String(i),i));
 const result=deriveReviewAgeQueue(reports,[],now,5);
 assert.equal(result.eligibleCount,18);
 assert.equal(result.entries.length,5);
 assert.equal(result.truncated,true);
 assert.throws(()=>deriveReviewAgeQueue([],[],now,0),RangeError);
});
