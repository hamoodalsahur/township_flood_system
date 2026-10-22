/** Pure guardrails for operator-controlled fictional incident decisions. */
export type ReportCandidate={id:string;category:string;reviewState:string;sourceMode:string;linkedIncidentId?:string|null};
export function canAttachReport(incident:{category:string;status:string;sourceMode:string},report:ReportCandidate):string|null {
 if(incident.sourceMode!=="simulation"||report.sourceMode!=="simulation")return "Only fictional demo data can be grouped";
 if(incident.status==="resolved")return "Resolved incident is read-only";
 if(report.reviewState==="rejected")return "Rejected report cannot be grouped";
 if(report.category!==incident.category)return "Hazard category does not match incident";
 if(report.linkedIncidentId)return "Report is already assigned to an incident";
 return null;
}
export function canRejectGroupedReport(linkedIncidentId:string|null|undefined,decision:string) {
 return !(decision==="rejected"&&linkedIncidentId);
}
export function validateUnlink(body:unknown) {
 if(!body||typeof body!=="object"||Array.isArray(body))throw Error("Invalid unlink request");
 const value=body as Record<string,unknown>;
 const reportId=typeof value.reportId==="string"?value.reportId.trim():"";
 const note=typeof value.note==="string"?value.note.trim():"";
 if(reportId.length<5||reportId.length>100)throw Error("Invalid report ID");
 if(note.length<8||note.length>400)throw Error("Operator reason must contain 8–400 characters");
 return {reportId,note};
}
