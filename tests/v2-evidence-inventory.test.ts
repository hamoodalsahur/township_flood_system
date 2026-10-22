import {test} from "node:test";
import assert from "node:assert/strict";
import {deriveEvidenceInventory} from "../src/lib/v2-evidence-inventory";

const now=new Date("2026-10-22T12:00:00.000Z");
const row=(status:string,daysAgo:number,bytes=100)=>({
  status,bytes,createdAt:new Date(now.getTime()-daysAgo*24*3600000)
});
test("evidence inventory counts private versus separately published demo photos",()=>{
 const result=deriveEvidenceInventory([
  row("private_unreviewed",31,200),
  row("private_rejected",6,150),
  row("approved_public_demo",35,300),
  row("unrecognised",20,50)
 ],now);
 assert.equal(result.totalEvidence,4);
 assert.equal(result.privateUnreviewed,1);
 assert.equal(result.privateRejected,1);
 assert.equal(result.approvedPublicDemo,1);
 assert.equal(result.unknownState,1);
 assert.equal(result.storedPayloadBytes,700);
 assert.equal(result.overThirtyDays,2);
 assert.equal(result.privateOverThirtyDays,1);
 assert.equal(result.approvedOverThirtyDays,1);
 assert.match(result.disclaimer,/does not publish, revoke, delete/);
});
test("age thresholds are inclusive and future timestamps do not count as old",()=>{
 const x=deriveEvidenceInventory([row("private_unreviewed",30),row("private_rejected",-1)],now);
 assert.equal(x.overThirtyDays,1);
 assert.equal(x.privateOverThirtyDays,1);
});
test("empty inventory is safe and never contains image payloads",()=>{
 const x=deriveEvidenceInventory([],now);
 assert.equal(x.totalEvidence,0);
 assert.equal(x.storedPayloadBytes,0);
 assert.equal("base64Data" in x,false);
});
