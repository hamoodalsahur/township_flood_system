import assert from "node:assert/strict";
import {test} from "node:test";
import {relatedReports} from "../src/lib/v2-related-reports";
const a={id:"a",category:"fallen_tree",description:"Branches obstructing the roadside",impact:"unknown",reviewState:"unverified",latitude:3.08,longitude:101.43,createdAt:"2026-10-21T12:00:00Z"};
test("suggests only close related fictional reports",()=>{
 const nearby={...a,id:"b",description:"Branches covering the road",latitude:3.0801};
 assert.deepEqual(relatedReports(a,[a,nearby]).ids,["b"]);
 assert.deepEqual(relatedReports(a,[{...nearby,category:"pothole"}]).ids,[]);
});
test("suspected closure raises review priority without verification",()=>{
 assert.equal(relatedReports({...a,impact:"suspected_closure"},[]).priority,"review_soon");
});
