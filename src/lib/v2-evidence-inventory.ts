/** Read-only demo evidence inventory: never loads base64 photo bytes or reviewer notes. */
export type EvidenceInventoryRow={status:string;bytes:number;createdAt:Date};
export type EvidenceInventory={
  totalEvidence:number;
  privateUnreviewed:number;
  approvedPublicDemo:number;
  privateRejected:number;
  unknownState:number;
  storedPayloadBytes:number;
  overThirtyDays:number;
  privateOverThirtyDays:number;
  approvedOverThirtyDays:number;
  disclaimer:string;
};
const monthMilliseconds=30*24*60*60*1000;

/** Descriptive counts only, never an expiration or automated publication policy. */
export function deriveEvidenceInventory(rows:readonly EvidenceInventoryRow[],now=new Date()):EvidenceInventory{
  const older=(row:EvidenceInventoryRow)=>{
    const age=now.getTime()-row.createdAt.getTime();
    return Number.isFinite(age)&&age>=monthMilliseconds;
  };
  const isPrivate=(row:EvidenceInventoryRow)=>row.status==="private_unreviewed"||row.status==="private_rejected";
  return {
    totalEvidence:rows.length,
    privateUnreviewed:rows.filter(r=>r.status==="private_unreviewed").length,
    approvedPublicDemo:rows.filter(r=>r.status==="approved_public_demo").length,
    privateRejected:rows.filter(r=>r.status==="private_rejected").length,
    unknownState:rows.filter(r=>!["private_unreviewed","approved_public_demo","private_rejected"].includes(r.status)).length,
    storedPayloadBytes:rows.reduce((sum,r)=>sum+(Number.isFinite(r.bytes)&&r.bytes>0?r.bytes:0),0),
    overThirtyDays:rows.filter(older).length,
    privateOverThirtyDays:rows.filter(r=>isPrivate(r)&&older(r)).length,
    approvedOverThirtyDays:rows.filter(r=>r.status==="approved_public_demo"&&older(r)).length,
    disclaimer:"Fictional demo evidence inventory only. Counts and 30-day age markers are not retention rules. Private images are not returned, and this feature does not publish, revoke, delete, verify or review any evidence."
  };
}
