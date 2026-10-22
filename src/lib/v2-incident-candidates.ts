import type {InputReport} from "./v2-ai-triage";
export function incidentCandidateEligible(anchor:InputReport,candidate:InputReport,linked:boolean){
 if(linked||candidate.reviewState==="rejected"||candidate.id===anchor.id||anchor.category!==candidate.category)return false;
 const hours=Math.abs(candidate.createdAt.getTime()-anchor.createdAt.getTime())/3600000;
 if(hours>48)return false;
 const x=(candidate.longitude-anchor.longitude)*111000*Math.cos(anchor.latitude*Math.PI/180);
 const y=(candidate.latitude-anchor.latitude)*111000;
 return Math.hypot(x,y)<=500;
}
