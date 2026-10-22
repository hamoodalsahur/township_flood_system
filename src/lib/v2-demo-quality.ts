/** Read-only consistency checks for the fictional V2 dataset. Never real geography verification. */
export type QualityReport={id:string;category:string;description:string;longitude:number;latitude:number;reviewState:string;sourceMode:string;incidentLink:{incidentId:string}|null};
export type QualityIncident={id:string;category:string;status:string;reports:{report:{id:string;category:string;reviewState:string}}[]};
export type QualityIssue={kind:string;subjectId:string;detail:string};
export function inspectDemoQuality(reports:readonly QualityReport[],incidents:readonly QualityIncident[]):QualityIssue[]{
 const issues:QualityIssue[]=[];
 const groupById=new Map(incidents.map(i=>[i.id,i]));
 for(const r of reports){
  if(r.sourceMode!=="simulation")continue;
  if(!Number.isFinite(r.latitude)||!Number.isFinite(r.longitude)||Math.abs(r.latitude)>90||Math.abs(r.longitude)>180)
   issues.push({kind:"invalid_coordinates",subjectId:r.id,detail:"Latitude or longitude is outside WGS84 numeric bounds"});
  if(r.description.trim().length<8)issues.push({kind:"incomplete_description",subjectId:r.id,detail:"Very short fictional report description"});
  if(r.reviewState==="rejected"&&r.incidentLink)issues.push({kind:"rejected_but_grouped",subjectId:r.id,detail:"Rejected report is linked to an incident"});
  if(r.incidentLink&&!groupById.has(r.incidentLink.incidentId))issues.push({kind:"missing_incident_reference",subjectId:r.id,detail:"Linked incident was not returned"});
 }
 for(const i of incidents){
  if(i.reports.length===0)issues.push({kind:"empty_incident",subjectId:i.id,detail:"Incident has no linked reports"});
  if(!["under_review","corroborated","resolved"].includes(i.status))issues.push({kind:"unknown_lifecycle_state",subjectId:i.id,detail:"Unrecognised fictional incident state"});
  for(const l of i.reports)if(l.report.category!==i.category)issues.push({kind:"category_mismatch",subjectId:l.report.id,detail:"Report category differs from its incident group"});
 }
 return issues.sort((a,b)=>a.kind.localeCompare(b.kind)||a.subjectId.localeCompare(b.subjectId));
}
