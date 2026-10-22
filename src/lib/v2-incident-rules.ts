/** Operator workflow validation; model suggestions never change incident state. */
export const INCIDENT_STATUSES=["under_review","corroborated","resolved"] as const;
export type IncidentStatus=typeof INCIDENT_STATUSES[number];
const isRecord=(x:unknown):x is Record<string,unknown>=>typeof x==="object"&&x!==null&&!Array.isArray(x);
export function validateIncidentCreate(body:unknown){
 if(!isRecord(body))throw Error("Invalid incident payload");
 const reportId=typeof body.reportId==="string"?body.reportId.trim():"";
 const title=typeof body.title==="string"?body.title.trim():"";
 const note=typeof body.note==="string"?body.note.trim():"";
 if(reportId.length<5||reportId.length>100)throw Error("Invalid report ID");
 if(title.length<8||title.length>100)throw Error("Title must contain 8–100 characters");
 if(note.length<8||note.length>400)throw Error("Operator reason must contain 8–400 characters");
 return {reportId,title,note};
}
export function validateIncidentLink(body:unknown){
 if(!isRecord(body))throw Error("Invalid link payload");
 const reportId=typeof body.reportId==="string"?body.reportId.trim():"";
 const note=typeof body.note==="string"?body.note.trim():"";
 if(reportId.length<5||reportId.length>100)throw Error("Invalid report ID");
 if(note.length<8||note.length>400)throw Error("Operator reason must contain 8–400 characters");
 return {reportId,note};
}
export function validateIncidentUpdate(body:unknown){
 if(!isRecord(body))throw Error("Invalid incident update");
 const status=body.status;
 const note=typeof body.note==="string"?body.note.trim():"";
 const possibleRoad=typeof body.possibleRoad==="string"?body.possibleRoad.trim():"";
 if(!INCIDENT_STATUSES.some(s=>s===status))throw Error("Invalid incident status");
 if(note.length<8||note.length>400)throw Error("Operator reason must contain 8–400 characters");
 if(possibleRoad.length>120)throw Error("Possible road description is too long");
 return {status:status as IncidentStatus,note,possibleRoad:possibleRoad||null};
}
/** Prevent operator workflow from silently reopening a closed fictional incident. */
export function canTransitionIncident(from:IncidentStatus,to:IncidentStatus){
 if(from==="resolved")return false;
 return from===to||from==="under_review"&&to==="corroborated"||from==="corroborated"&&to==="resolved"||from==="under_review"&&to==="resolved";
}
