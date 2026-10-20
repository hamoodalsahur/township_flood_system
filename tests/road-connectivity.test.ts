import assert from "node:assert/strict";
import { test } from "node:test";
import { assessConnectivity } from "../src/lib/road-connectivity";

const nodes = ["A","B","C","D"].map(id=>({id,label:id}));
const edges = [
 {id:"AB",fromNodeId:"A",toNodeId:"B",status:"unknown",corridorType:"internal"},
 {id:"BC",fromNodeId:"B",toNodeId:"C",status:"at_risk",corridorType:"internal"},
 {id:"CD",fromNodeId:"C",toNodeId:"D",status:"confirmed_closed",corridorType:"internal"},
 {id:"AD",fromNodeId:"A",toNodeId:"D",status:"unknown",corridorType:"park_trail"}
];
test("graph connectivity is theoretical and surfaces uncertainty",()=>{
 const result=assessConnectivity(nodes,edges,"A","C");
 assert.equal(result.connected,true);
 assert.deepEqual(result.nodeIds,["A","B","C"]);
 assert.deepEqual(result.uncertainRoadIds,["AB","BC"]);
 assert.match(result.disclaimer,/NOT a safe route/);
});
test("verified closure and walking trail are excluded",()=>{
 const result=assessConnectivity(nodes,edges,"A","D");
 assert.equal(result.connected,false);
 assert.ok(result.excludedRoadIds.includes("CD"));
 assert.ok(result.excludedRoadIds.includes("AD"));
});
test("unverified reported flood is excluded too",()=>{
 const blocked=edges.map(e=>e.id==="BC"?{...e,status:"reported_flooding_unverified"}:e);
 assert.equal(assessConnectivity(nodes,blocked,"A","C").connected,false);
});
test("invalid junctions are rejected",()=>{
 assert.throws(()=>assessConnectivity(nodes,edges,"Q","D"));
 assert.throws(()=>assessConnectivity(nodes,edges,"A","A"));
});
