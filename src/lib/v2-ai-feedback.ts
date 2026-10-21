import type {InputReport} from "./v2-ai-triage";
export type AiPairJudgement="same_event"|"different_event";
export function validateAiPairFeedback(raw:unknown) {
 if(!raw||typeof raw!=="object")throw Error("Invalid pair feedback");
 const value=raw as Record<string,unknown>;
 if(typeof value.candidateId!=="string"||!/^c[a-z0-9]{10,50}$/.test(value.candidateId))throw Error("Invalid candidate report identifier");
 if(value.judgement!=="same_event"&&value.judgement!=="different_event")throw Error("Choose same event or different events");
 if(typeof value.note!=="string"||value.note.trim().length<8||value.note.length>400)throw Error("Review note must be 8–400 characters");
 return {candidateId:value.candidateId,judgement:value.judgement as AiPairJudgement,note:value.note.trim()};
}
export function canonicalReportPair(first:string,second:string):[string,string] {
 if(first===second||!first||!second)throw Error("Choose two different reports");
 return first<second?[first,second]:[second,first];
}
/** Matches the current time/distance safety prefilter but never makes a verification claim. */
export function pairEligibleForFeedback(a:Pick<InputReport,"id"|"latitude"|"longitude"|"createdAt"|"reviewState">,
 b:Pick<InputReport,"id"|"latitude"|"longitude"|"createdAt"|"reviewState">):boolean {
 if(a.id===b.id||a.reviewState==="rejected"||b.reviewState==="rejected")return false;
 if(Math.abs(a.createdAt.getTime()-b.createdAt.getTime())>48*3600*1000)return false;
 const x=(a.longitude-b.longitude)*111_000*Math.cos((a.latitude+b.latitude)*Math.PI/360);
 const y=(a.latitude-b.latitude)*111_000;
 return Math.hypot(x,y)<=500;
}
