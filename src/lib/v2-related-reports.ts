export type Item={id:string;category:string;description:string;impact:string;reviewState:string;latitude:number;longitude:number;createdAt:string};
export function relatedReports(current:Item, items:readonly Item[]) {
 const words=(s:string)=>new Set((s.toLowerCase().match(/[a-z]{5,}/g)||[]).filter(w=>!["about","there","where","their","report"].includes(w)));
 const vocabulary=words(current.description);
 const candidates=items.filter(other=>{
  if(other.id===current.id||other.category!==current.category||other.reviewState==="rejected")return false;
  const x=(other.longitude-current.longitude)*111000*Math.cos(current.latitude*Math.PI/180);
  const y=(other.latitude-current.latitude)*111000;
  const dt=Math.abs(Date.parse(other.createdAt)-Date.parse(current.createdAt));
  return Math.hypot(x,y)<300&&Number.isFinite(dt)&&dt<86400000&&[...words(other.description)].some(w=>vocabulary.has(w));
 });
 return {ids:candidates.slice(0,4).map(x=>x.id),priority:current.impact==="suspected_closure"||candidates.length>=2?"review_soon":candidates.length>0?"check_related":"routine"};
}
